import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    // In a real app, this would reset the chat state
    console.log('Starting new chat...');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onNewChat={handleNewChat} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content - Dynamic width based on sidebar state */}
      <div 
        className={`flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:ml-80' : 'ml-0'
        }`}
        style={{
          width: isSidebarOpen 
            ? 'calc(100vw - 320px)' // Adjust for sidebar width on desktop
            : '100vw'
        }}
      >
        <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
        
        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Layout; 