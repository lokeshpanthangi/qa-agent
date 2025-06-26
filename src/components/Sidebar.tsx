import React from 'react';
import { Plus, MessageSquare, Settings, HelpCircle, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen: boolean;
  onNewChat: () => void;
}

// Create a unique icon for our QA Agent
const QAIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
      <div className="relative">
        <Sparkles className="text-white w-4 h-4" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNewChat }) => {
  // Mock chat history with more realistic AI assistant conversations
  const chatHistory = [
    { id: '1', title: 'Image analysis: React component diagram', timestamp: '2 hours ago' },
    { id: '2', title: 'Explain machine learning concepts', timestamp: '1 day ago' },
    { id: '3', title: 'Code review: TypeScript interface', timestamp: '2 days ago' },
    { id: '4', title: 'Debug API integration issues', timestamp: '1 week ago' },
    { id: '5', title: 'UI/UX design best practices', timestamp: '1 week ago' },
    { id: '6', title: 'Database optimization queries', timestamp: '2 weeks ago' },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-sidebar-background border-r border-sidebar-border transition-all duration-300 ease-in-out z-40 ${
        isOpen ? 'w-80' : 'w-0'
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3 mb-4">
            <QAIcon />
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">QA Agent</h2>
              <p className="text-sm text-sidebar-foreground/70">Intelligent Assistant</p>
            </div>
          </div>
          
          <Button
            onClick={onNewChat}
            className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium text-sidebar-foreground/70 mb-3 uppercase tracking-wider">
            Recent Chats
          </h3>
          <ScrollArea className="h-full">
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="group cursor-pointer rounded-lg p-3 hover:bg-sidebar-accent transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="w-4 h-4 text-sidebar-foreground/60 mt-0.5 group-hover:text-sidebar-foreground/80 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-sidebar-foreground line-clamp-2 group-hover:text-sidebar-foreground/90">
                        {chat.title}
                      </p>
                      <p className="text-xs text-sidebar-foreground/50 mt-1">
                        {chat.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Zap className="w-4 h-4 mr-3" />
              Upgrade to Pro
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <HelpCircle className="w-4 h-4 mr-3" />
              Help & Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { QAIcon };
export default Sidebar; 