import React from 'react';
import { Construction } from 'lucide-react';

export default function Placeholder({ title }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="bg-secondary p-6 rounded-full mb-6">
                <Construction size={48} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground max-w-md">
                Halaman ini sedang dalam pengembangan. Fitur {title} akan segera tersedia dengan tampilan modern dan fungsionalitas lengkap.
            </p>
        </div>
    );
}
