import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";

interface MainNavProps {
    handleCollapseSidebar: () => void;
}

const MainNav: React.FC<MainNavProps> = ({ handleCollapseSidebar }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
    
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
        handleCollapseSidebar();
    };
    
    return (
        <div className="flex w-full py-3 px-4 justify-between items-center border-b border-border h-16">
            <div className="flex items-center">
                <button 
                    className="p-2 rounded-md hover:bg-secondary text-secondary-foreground transition-colors"
                    onClick={toggleSidebar}
                    aria-label="Toggle Sidebar"
                >
                    {isSidebarCollapsed ? 
                        <RiMenuUnfoldLine size={20} /> : 
                        <RiMenuFoldLine size={20} />
                    }
                </button>
            </div>
            
            <div className="flex items-center">
                <div className="relative group">
                    <button className="flex items-center space-x-2 rounded-full hover:bg-secondary p-1 transition-colors" aria-label="User Menu">
                        <FaUserCircle className="w-6 h-6" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-md shadow-md z-10 hidden group-hover:block border border-border">
                        <ul className="py-1">
                            <li className="px-4 py-2 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">Log In</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MainNav;
