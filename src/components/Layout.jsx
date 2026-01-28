import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Target,
    Database,
    Bell,
    Menu,
    X,
    LogOut,
    ChevronRight,
    ShoppingBag,
    MapPin,
    UserCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const SidebarItem = ({ icon: Icon, label, to, active, onClick, hasSubmenu, expanded }) => {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm"
            )}
        >
            <Icon size={20} className={cn("transition-transform", active && "scale-110")} />
            <span className="font-medium text-sm">{label}</span>
            {hasSubmenu && (
                <ChevronRight size={16} className={cn("ml-auto transition-transform", expanded && "rotate-90")} />
            )}
            {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
            )}
        </Link>
    );
};

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
        { icon: Users, label: 'Prospek & Sales', to: '/prospects' },
        { icon: Target, label: 'Target Achievement', to: '/targets' },
        { icon: Database, label: 'Master Data', to: '/master' }, // Simply route to a master data landing or expanding menu
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col p-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-xl tracking-tight text-foreground">NetSales</h1>
                            <p className="text-xs text-muted-foreground font-medium">FTTH System</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <SidebarItem
                                key={item.to}
                                {...item}
                                active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))}
                            />
                        ))}
                    </nav>

                    {/* User Profile / Footer */}
                    <div className="mt-auto pt-6 border-t border-border">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <UserCircle size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-foreground">Sales Staff</p>
                                <p className="text-xs text-muted-foreground truncate">Jatim Area</p>
                            </div>
                            <button className="p-2 hover:bg-white rounded-lg transition-colors text-muted-foreground hover:text-red-500">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 px-6 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="ml-auto flex items-center gap-4">
                        {/* Hotnews / Notifications */}
                        <button className="relative p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
