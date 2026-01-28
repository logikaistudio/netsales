import React from 'react';
import { Plus, Search, Package, MoreVertical, Edit, Trash } from 'lucide-react';

const products = [
    { id: 1, name: 'Home Fiber 50', price: 250000, speed: '50 Mbps', cogs: 180000, category: 'Residential' },
    { id: 2, name: 'Home Fiber 100', price: 350000, speed: '100 Mbps', cogs: 220000, category: 'Residential' },
    { id: 3, name: 'Biz Pro 300', price: 1500000, speed: '300 Mbps', cogs: 900000, category: 'Business' },
    { id: 4, name: 'Biz Pro 500', price: 2500000, speed: '500 Mbps', cogs: 1400000, category: 'Business' },
    { id: 5, name: 'Gamer Elite', price: 450000, speed: '150 Mbps', cogs: 300000, category: 'Special' },
];

export default function ProductMaster() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Master Produk</h1>
                    <p className="text-muted-foreground text-sm">Kelola katalog produk internet, harga, dan COGS.</p>
                </div>
                <button className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/25">
                    <Plus size={18} />
                    Tambah Produk
                </button>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="border-b border-border/50 p-4 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/50 text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 font-medium">Nama Produk</th>
                            <th className="px-6 py-4 font-medium">Kategori</th>
                            <th className="px-6 py-4 font-medium">Kecepatan</th>
                            <th className="px-6 py-4 font-medium">Harga Jual</th>
                            <th className="px-6 py-4 font-medium">COGS</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {products.map((product) => (
                            <tr key={product.id} className="group hover:bg-secondary/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                            <Package size={20} />
                                        </div>
                                        <span className="font-semibold text-foreground">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                                <td className="px-6 py-4 font-medium">{product.speed}</td>
                                <td className="px-6 py-4 font-bold text-foreground">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.cogs)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-blue-600 transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-red-600 transition-colors">
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
