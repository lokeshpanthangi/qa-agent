import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QAIcon } from './Sidebar';
import { isApiConfigured } from '@/services/geminiService';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  return (
    <header className="h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-accent"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex items-center space-x-3">
            <QAIcon />
            <div>
              <h1 className="text-xl font-semibold text-foreground">QA Agent</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Intelligent Question & Answer Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${
              isApiConfigured() 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-yellow-500'
            }`}></div>
            <span>{isApiConfigured() ? 'AI Connected' : 'API Setup Needed'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 