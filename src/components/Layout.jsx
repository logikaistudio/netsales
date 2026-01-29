import React, { useState } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
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
    UserCircle,
    Tag,
    Map,
    LocateFixed
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change (mobile) - still relevant if a mobile menu is implemented
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
        { icon: Users, label: 'Prospects & Customer', to: '/prospects' },
        {
            icon: Database,
            label: 'Master Data',
            // No 'to' prop here, acts as a folder
            children: [
                { icon: Target, label: 'Target Achievement', to: '/master/targets' },
                { icon: Users, label: 'Sales Team', to: '/master/sales' },
                { icon: Map, label: 'Regional (Area/City)', to: '/master/regional' },
                { icon: LocateFixed, label: 'Districts (Kecamatan)', to: '/master/districts' },
                { icon: ShoppingBag, label: 'Products', to: '/master/products' },
                { icon: Tag, label: 'Promos', to: '/master/promos' },
            ]
        },
    ];

    return (
        <div className="flex h-screen bg-secondary/30">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex flex-col",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">N</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">NetSales</h1>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navItems.map((item, index) => (
                        <div key={index}>
                            {item.children ? (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground">
                                        <item.icon size={18} />
                                        <span>{item.label}</span>
                                    </div>
                                    <div className="ml-4 pl-4 border-l border-border/50 space-y-1">
                                        {item.children.map((child, childIndex) => (
                                            <NavLink
                                                key={childIndex}
                                                to={child.to}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden",
                                                        isActive
                                                            ? "bg-primary text-primary-foreground shadow-sm"
                                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                    )
                                                }
                                            >
                                                {/* <child.icon size={16} />  Optionally hide icon for children for cleaner look, or keep it */}
                                                <span>{child.label}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        clsx(
                                            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        )
                                    }
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </NavLink>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-border/50">
                    <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Admin User</p>
                            <p className="text-xs text-muted-foreground">admin@netsales.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden md:ml-64">
                {/* Header */}
                <header className="h-16 px-6 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
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
