
import React from 'react';
import { Image, FileText, Download, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  files?: File[];
}

interface ChatMessageProps {
  message: Message;
  isNew?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isNew }) => {
  const isUser = message.role === 'user';
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isNew ? 'animate-fade-in' : ''}`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="text-white w-4 h-4" />
            </div>
            <span className="text-sm text-gray-500">MIP</span>
          </div>
        )}
        
        <div className={`rounded-2xl p-4 ${
          isUser 
            ? 'bg-blue-600 text-white ml-4' 
            : 'bg-gray-100 text-gray-900 mr-4'
        } transition-all duration-300 hover:shadow-lg`}>
          {/* Files */}
          {message.files && message.files.length > 0 && (
            <div className="mb-3 space-y-2">
              {message.files.map((file, index) => (
                <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                  isUser ? 'bg-blue-500' : 'bg-white'
                } transition-all duration-200 hover:scale-[1.02]`}>
                  <div className="flex items-center space-x-2">
                    {file.type.startsWith('image/') ? (
                      <div className="relative">
                        <Image size={16} className={isUser ? 'text-blue-100' : 'text-blue-600'} />
                        {file.type.startsWith('image/') && (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="mt-2 max-w-48 max-h-48 rounded-lg object-cover"
                          />
                        )}
                      </div>
                    ) : (
                      <FileText size={16} className={isUser ? 'text-blue-100' : 'text-blue-600'} />
                    )}
                    <span className={`text-sm truncate max-w-32 ${
                      isUser ? 'text-blue-100' : 'text-gray-700'
                    }`}>
                      {file.name}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadFile(file)}
                    className={`p-1 h-auto ${
                      isUser 
                        ? 'text-blue-100 hover:text-white hover:bg-blue-500' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Download size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Message Content */}
          {message.content && (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          )}
          
          <div className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
