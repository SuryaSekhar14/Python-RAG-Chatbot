'use client';

import { FaComment, FaTrash, FaSearch } from 'react-icons/fa';

interface ChatHistoryProps {
  isCollapsed: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ isCollapsed }) => {
  // Mock data for UI only
  const chatSessions = [
    { id: 1, title: 'Chat about Python basics', timestamp: '2 hours ago' },
    { id: 2, title: 'Machine Learning questions', timestamp: 'Yesterday' },
    { id: 3, title: 'Web development tips', timestamp: '3 days ago' },
    { id: 4, title: 'Data visualization help', timestamp: 'Last week' },
    { id: 5, title: 'SQL query assistance', timestamp: 'Last week' },
  ];

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center space-y-4 py-2">
        {chatSessions.slice(0, 3).map((chat) => (
          <div 
            key={chat.id} 
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80"
            title={chat.title}
          >
            <FaComment className="text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search conversations..." 
          className="w-full px-3 py-2 pl-9 text-sm rounded-md bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-black"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
      </div>
      
      <h2 className="text-sm font-medium text-muted-foreground">Recent Conversations</h2>
      {chatSessions.map((chat) => (
        <div 
          key={chat.id} 
          className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer group"
        >
          <div className="flex items-center space-x-2 overflow-hidden">
            <FaComment className="text-muted-foreground flex-shrink-0" />
            <div className="overflow-hidden">
              <div className="truncate text-sm font-medium">{chat.title}</div>
              <div className="text-xs text-muted-foreground">{chat.timestamp}</div>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
            <FaTrash size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory; 