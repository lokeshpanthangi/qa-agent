import { GoogleGenerativeAI } from '@google/generative-ai';

// Environment variable validation
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. Please add it to your .env file.');
}

// Initialize the Gemini AI client
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  images?: string[]; // Base64 encoded images
  imageUrls?: string[]; // Image URLs
}

/**
 * Convert File to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/xxx;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Convert Image URL to base64 string
 */
export const urlToBase64 = async (url: string): Promise<{ data: string; mimeType: string }> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  
  const blob = await response.blob();
  const mimeType = blob.type || 'image/jpeg';
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/xxx;base64, prefix
      const base64 = result.split(',')[1];
      resolve({ data: base64, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Get MIME type from file
 */
export const getMimeType = (file: File): string => {
  return file.type || 'image/jpeg';
};

/**
 * Send a text-only message to Gemini
 */
export const sendTextMessage = async (message: string, conversationHistory?: ChatMessage[]): Promise<GeminiResponse> => {
  if (!genAI) {
    return {
      text: 'API key not configured. Please add your Gemini API key to the .env file.',
      success: false,
      error: 'Missing API key'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Build conversation history for context - keep ALL conversation history
    let prompt = message;
    if (conversationHistory && conversationHistory.length > 0) {
      const context = conversationHistory
        .map(msg => {
          let content = msg.content;
          // Add context for images if they were included
          if (msg.images && msg.images.length > 0) {
            content += ` [Included ${msg.images.length} image(s)]`;
          }
          if (msg.imageUrls && msg.imageUrls.length > 0) {
            content += ` [Included ${msg.imageUrls.length} image URL(s)]`;
          }
          return `${msg.role}: ${content}`;
        })
        .join('\n');
      prompt = `Previous conversation:\n${context}\n\nUser: ${message}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      text,
      success: true
    };
  } catch (error) {
    console.error('Error sending text message:', error);
    return {
      text: 'Sorry, I encountered an error while processing your message. Please try again.',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Send a message with images to Gemini (supports both files and URLs)
 */
export const sendMessageWithImages = async (
  message: string, 
  images: File[] = [], 
  imageUrls: string[] = [],
  conversationHistory?: ChatMessage[]
): Promise<GeminiResponse> => {
  if (!genAI) {
    return {
      text: 'API key not configured. Please add your Gemini API key to the .env file.',
      success: false,
      error: 'Missing API key'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert files to the format expected by Gemini
    const fileParts = await Promise.all(
      images.map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          inlineData: {
            data: base64,
            mimeType: getMimeType(file)
          }
        };
      })
    );

    // Convert URLs to the format expected by Gemini
    const urlParts = await Promise.all(
      imageUrls.map(async (url) => {
        const { data, mimeType } = await urlToBase64(url);
        return {
          inlineData: {
            data,
            mimeType
          }
        };
      })
    );

    const imageParts = [...fileParts, ...urlParts];

    // Build prompt with context - keep ALL conversation history
    let prompt = message || "Please analyze the provided image(s) and describe what you see.";
    if (conversationHistory && conversationHistory.length > 0) {
      const context = conversationHistory
        .map(msg => {
          let content = msg.content;
          // Add context for images if they were included
          if (msg.images && msg.images.length > 0) {
            content += ` [Referenced ${msg.images.length} image(s)]`;
          }
          if (msg.imageUrls && msg.imageUrls.length > 0) {
            content += ` [Referenced ${msg.imageUrls.length} image URL(s)]`;
          }
          return `${msg.role}: ${content}`;
        })
        .join('\n');
      
      prompt = `Previous conversation:\n${context}\n\nCurrent request with new image(s): ${prompt}`;
    }

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    return {
      text,
      success: true
    };
  } catch (error) {
    console.error('Error sending message with images:', error);
    return {
      text: 'Sorry, I encountered an error while analyzing the image(s). Please try again.',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Check if the API is properly configured
 */
export const isApiConfigured = (): boolean => {
  return !!API_KEY && !!genAI;
};

/**
 * Get API status information
 */
export const getApiStatus = () => {
  return {
    configured: isApiConfigured(),
    model: 'gemini-1.5-flash',
    features: ['text', 'images', 'conversation-history']
  };
}; 