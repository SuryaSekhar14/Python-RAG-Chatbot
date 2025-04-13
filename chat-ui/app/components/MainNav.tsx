import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';

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
                    <SignedOut>
                        <div className="flex items-center gap-2">
                            <SignInButton mode="modal">
                                <button className="px-4 py-2 rounded-md hover:bg-secondary text-sm font-medium transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </div>
    )
};

export default MainNav;
