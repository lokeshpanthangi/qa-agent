import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, FileText, X, Loader2, AlertCircle, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ChatMessage from './ChatMessage';
import FileUpload from './FileUpload';
import ImagePreview from './ImagePreview';
import ImageUrlInput from './ImageUrlInput';
import ImageUrlPreview from './ImageUrlPreview';
import { 
  sendTextMessage, 
  sendMessageWithImages, 
  isApiConfigured, 
  getApiStatus,
  type ChatMessage as GeminiChatMessage 
} from '@/services/geminiService';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  files?: File[];
  imageUrls?: string[];
  isLoading?: boolean;
  error?: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: isApiConfigured() 
        ? 'Hello! I\'m QA Agent, your intelligent assistant powered by Gemini 1.5 Flash. I can help you with questions, analyze images, and provide detailed explanations. How can I assist you today?'
        : 'Hello! I\'m QA Agent. Please configure your Gemini API key in the .env file to enable AI responses. You can still test the interface by uploading images and typing messages.',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [attachedUrls, setAttachedUrls] = useState<string[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom with smooth animation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Detect image URLs in text
  const detectImageUrls = (text: string): string[] => {
    const imageUrlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s]*)?)/gi;
    return text.match(imageUrlRegex) || [];
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!inputAreaRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 20 * 1024 * 1024 // 20MB limit
    );
    
    if (imageFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...imageFiles]);
    }
  };



  const handleSendMessage = async () => {
    if (!input.trim() && attachedFiles.length === 0 && attachedUrls.length === 0) return;

    // Detect image URLs in the message
    const imageUrls = detectImageUrls(input);
    
    // Remove image URLs from the text content
    let cleanedContent = input;
    imageUrls.forEach(url => {
      cleanedContent = cleanedContent.replace(url, '').trim();
    });

    // Combine detected URLs with manually added URLs
    const allImageUrls = [...imageUrls, ...attachedUrls];

    const userMessage: Message = {
      id: Date.now().toString(),
      content: cleanedContent || (attachedFiles.length > 0 || allImageUrls.length > 0 ? 'Please analyze the provided image(s).' : ''),
      role: 'user',
      timestamp: new Date(),
      files: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
      imageUrls: allImageUrls.length > 0 ? allImageUrls : undefined,
    };

    // Build conversation history BEFORE adding the new message (includes all previous messages)
    const conversationHistory = messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .filter(msg => !msg.isLoading && msg.content.trim()) // Exclude loading and empty messages
      .map(msg => ({
        role: msg.role,
        content: msg.content,
        images: msg.files?.map(() => 'image') || [], // Include image indicators
        imageUrls: msg.imageUrls || []
      }));



    // Add user message
    setMessages(prev => [...prev, userMessage]);
    
    // Create loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    setInput('');
    setAttachedFiles([]);
    setAttachedUrls([]);
    setIsLoading(true);

    // Send to Gemini AI
    try {
      
      let response;

      if (attachedFiles.length > 0 || allImageUrls.length > 0) {
        // Send message with images (files and/or URLs)
        response = await sendMessageWithImages(
          userMessage.content,
          attachedFiles,
          allImageUrls,
          conversationHistory
        );
      } else {
        // Send text-only message
        response = await sendTextMessage(
          userMessage.content,
          conversationHistory
        );
      }

      // Update the loading message with the response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? {
              ...msg,
              content: response.text,
              isLoading: false,
              error: response.success ? undefined : response.error
            }
          : msg
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update loading message with error
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? {
              ...msg,
              content: 'Sorry, I encountered an error while processing your message. Please try again.',
              isLoading: false,
              error: 'Failed to send message'
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (files: File[]) => {
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 20 * 1024 * 1024
    );
    setAttachedFiles(prev => [...prev, ...imageFiles]);
    setShowFileUpload(false);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUrlAdd = (url: string) => {
    setAttachedUrls(prev => [...prev, url]);
  };

  const removeUrl = (index: number) => {
    setAttachedUrls(prev => prev.filter((_, i) => i !== index));
  };

  const apiStatus = getApiStatus();

  return (
    <div className="flex flex-col h-full relative">
      {/* API Status Alert */}
      {!apiStatus.configured && (
        <Alert className="m-4 mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file to enable AI responses.
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-4xl mx-auto w-full p-4 space-y-4">
          {/* Messages */}
          {messages.map((message, index) => (
            <div key={message.id} className="mb-4">
              <ChatMessage 
                message={message} 
                isNew={index === messages.length - 1}
              />
              {message.error && (
                <div className="mt-2 text-sm text-destructive">
                  Error: {message.error}
                </div>
              )}
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && messages[messages.length - 1]?.isLoading && (
            <div className="flex justify-start animate-fade-in mb-4">
              <div className="bg-muted rounded-2xl p-4 max-w-xs">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div 
        ref={inputAreaRef}
        className={`bg-background/95 backdrop-blur-sm border-t border-border transition-all duration-200 ${
          isDragOver ? 'bg-blue-50/80 border-blue-300' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="max-w-4xl mx-auto w-full p-4">
          {/* Drag and Drop Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-blue-100/50 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center z-10 animate-fade-in">
              <div className="text-center">
                <Image className="mx-auto mb-2 text-blue-600" size={32} />
                <p className="text-blue-600 font-medium">Drop images here</p>
                <p className="text-blue-500 text-sm">Max 20MB per image</p>
              </div>
            </div>
          )}
          
          {/* Interactive Image Previews */}
          {(attachedFiles.length > 0 || attachedUrls.length > 0) && (
            <div className="mb-4 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {attachedFiles.map((file, index) => (
                  <ImagePreview
                    key={`file-${index}`}
                    file={file}
                    onRemove={() => removeFile(index)}
                    className="w-full"
                  />
                ))}
                {attachedUrls.map((url, index) => (
                  <ImageUrlPreview
                    key={`url-${index}`}
                    url={url}
                    onRemove={() => removeUrl(index)}
                    className="w-full"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-end space-x-3">
            {/* File Upload Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFileUpload(true)}
                className="hover:bg-accent transition-all duration-200"
                disabled={isLoading}
              >
                <Paperclip size={18} />
              </Button>
              {showFileUpload && (
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onClose={() => setShowFileUpload(false)}
                />
              )}
            </div>

            {/* URL Input Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowUrlInput(true)}
                className="hover:bg-accent transition-all duration-200"
                disabled={isLoading}
                title="Add image URL"
              >
                <Pin size={18} />
              </Button>
              {showUrlInput && (
                <ImageUrlInput
                  onUrlAdd={handleUrlAdd}
                  onClose={() => setShowUrlInput(false)}
                />
              )}
            </div>
            
            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message QA Agent... (You can drag & drop images or paste image URLs)"
                className="min-h-[50px] max-h-[200px] resize-none border-input focus:border-ring focus:ring-ring transition-all duration-200 pr-12 overflow-y-auto"
                disabled={isLoading}
                rows={1}
              />
            </div>
            
            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={(!input.trim() && attachedFiles.length === 0 && attachedUrls.length === 0) || isLoading}
              className="bg-primary hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              size="icon"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
          


          {/* Footer Info */}
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>
              QA Agent {apiStatus.configured ? 'powered by Gemini 1.5 Flash' : '(API not configured)'}
            </span>
            <span>
              {apiStatus.configured ? 'Press Enter to send, Shift+Enter for new line' : 'Demo mode'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
