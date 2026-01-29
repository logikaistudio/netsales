import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target,
    Users,
    Map,
    LocateFixed,
    ShoppingBag,
    Tag,
    ArrowRight
} from 'lucide-react';

export default function MasterDataIndex() {
    const navigate = useNavigate();

    const masterDataMenus = [
        {
            icon: Target,
            title: 'Target Achievement',
            description: 'Set sales targets per region and track performance',
            path: '/master/targets',
            color: 'bg-blue-500',
            lightColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            icon: Users,
            title: 'Sales Team',
            description: 'Manage sales personnel and territory assignments',
            path: '/master/sales',
            color: 'bg-green-500',
            lightColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            icon: Map,
            title: 'Regional (Area/City)',
            description: 'Configure geographic regions and cities',
            path: '/master/regional',
            color: 'bg-purple-500',
            lightColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            icon: LocateFixed,
            title: 'Districts (Kecamatan)',
            description: 'Manage district-level geographic data',
            path: '/master/districts',
            color: 'bg-orange-500',
            lightColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
        {
            icon: ShoppingBag,
            title: 'Products',
            description: 'Product catalog, pricing, and COGS management',
            path: '/master/products',
            color: 'bg-indigo-500',
            lightColor: 'bg-indigo-50',
            textColor: 'text-indigo-600'
        },
        {
            icon: Tag,
            title: 'Promos',
            description: 'Promotional campaigns and discount management',
            path: '/master/promos',
            color: 'bg-pink-500',
            lightColor: 'bg-pink-50',
            textColor: 'text-pink-600'
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Master Data Management</h1>
                <p className="text-muted-foreground text-sm">Kelola data Area, Kota/Kecamatan, dan Sales Tim.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {masterDataMenus.map((menu) => {
                    const Icon = menu.icon;
                    return (
                        <button
                            key={menu.path}
                            onClick={() => navigate(menu.path)}
                            className="group relative bg-card border border-border/50 rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 text-left overflow-hidden"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute top-0 right-0 w-32 h-32 ${menu.lightColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-16 -mt-16`} />

                            {/* Content */}
                            <div className="relative">
                                <div className={`inline-flex p-3 rounded-xl ${menu.lightColor} mb-4`}>
                                    <Icon className={`${menu.textColor}`} size={24} />
                                </div>

                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                    {menu.title}
                                </h3>

                                <p className="text-sm text-muted-foreground mb-4">
                                    {menu.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
