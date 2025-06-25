
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, FileText, X, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ChatMessage from './ChatMessage';
import FileUpload from './FileUpload';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  files?: File[];
  imageUrls?: string[];
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m MIP, your multimodal AI assistant. I can help you with text, analyze images, and work with files. How can I assist you today?',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    // Only set drag over to false if we're leaving the input area entirely
    if (!inputAreaRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...imageFiles]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    // Detect image URLs in the message
    const imageUrls = detectImageUrls(input);
    
    // Remove image URLs from the text content
    let cleanedContent = input;
    imageUrls.forEach(url => {
      cleanedContent = cleanedContent.replace(url, '').trim();
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      content: cleanedContent,
      role: 'user',
      timestamp: new Date(),
      files: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedFiles([]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(userMessage),
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userMessage: Message): string => {
    const hasFiles = userMessage.files && userMessage.files.length > 0;
    const hasImageUrls = userMessage.imageUrls && userMessage.imageUrls.length > 0;
    
    if (hasFiles || hasImageUrls) {
      let response = "I can see you've shared ";
      
      if (hasFiles) {
        const fileTypes = userMessage.files!.map(file => {
          if (file.type.startsWith('image/')) return 'image';
          if (file.type.includes('pdf')) return 'PDF';
          return 'file';
        });
        response += `${userMessage.files!.length} uploaded ${fileTypes.join(', ')}${userMessage.files!.length > 1 ? 's' : ''}`;
      }
      
      if (hasFiles && hasImageUrls) {
        response += " and ";
      }
      
      if (hasImageUrls) {
        response += `${userMessage.imageUrls!.length} image URL${userMessage.imageUrls!.length > 1 ? 's' : ''}`;
      }
      
      response += ". ";
      
      if (userMessage.content) {
        response += `Regarding your message: "${userMessage.content}" - `;
      }
      
      response += "I'd be happy to help analyze these images and provide detailed insights. In a real implementation, I would process the actual image contents and provide comprehensive analysis.";
      
      return response;
    }
    
    const responses = [
      "That's an interesting question! I'd be happy to help you explore this topic further.",
      "I understand what you're asking. Let me provide you with a comprehensive response.",
      "Great question! Here's what I think about that...",
      "I can definitely help you with that. Let me break this down for you.",
      "That's a thoughtful inquiry. Based on my understanding..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + " " + 
           "This is a simulated response for demonstration purposes. In a real implementation, this would connect to an actual AI service.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (files: File[]) => {
    setAttachedFiles(prev => [...prev, ...files]);
    setShowFileUpload(false);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
            <Brain className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">MIP</h1>
            <p className="text-sm text-gray-500">Multimodal Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isNew={index === messages.length - 1}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gray-100 rounded-2xl p-4 max-w-xs">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div 
        ref={inputAreaRef}
        className={`bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 transition-all duration-200 ${
          isDragOver ? 'bg-blue-50/80 border-blue-300' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-100/50 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center z-10 animate-fade-in">
            <div className="text-center">
              <Image className="mx-auto mb-2 text-blue-600" size={32} />
              <p className="text-blue-600 font-medium">Drop images here</p>
            </div>
          </div>
        )}
        
        {/* Attached Files */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 animate-fade-in">
            {attachedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm">
                {file.type.startsWith('image/') ? <Image size={16} /> : <FileText size={16} />}
                <span className="truncate max-w-32">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end space-x-3">
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFileUpload(true)}
              className="hover:bg-gray-50 transition-all duration-200 hover:scale-105"
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
          
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message MIP... (You can also drag & drop images or paste image URLs)"
              className="min-h-[50px] max-h-[200px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          MIP can make mistakes. This is a demo interface for educational purposes.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
