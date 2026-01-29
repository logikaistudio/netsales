import React, { useState } from 'react';
import { useMasterData } from '../../context/MasterDataContext';
import { formatCurrency } from '../../utils/currency';
import {
    ShoppingBag,
    Plus,
    Trash2,
    DollarSign
} from 'lucide-react';

export default function Products() {
    const { products, addProduct, deleteProduct } = useMasterData();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [cogs, setCogs] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (name && price) {
            addProduct(name, parseFloat(price), parseFloat(cogs || 0));
            setName('');
            setPrice('');
            setCogs('');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground text-sm">Manage product catalog, pricing, and COGS.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="md:col-span-1">
                    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Plus size={18} className="text-primary" /> Add New Product
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Product Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Internet 50Mbps"
                                    className="w-full mt-1 bg-white border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Selling Price (IDR)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full mt-1 bg-white border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">COGS (Base Cost)</label>
                                <input
                                    type="number"
                                    value={cogs}
                                    onChange={(e) => setCogs(e.target.value)}
                                    placeholder="0"
                                    className="w-full mt-1 bg-white border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!name || !price}
                                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white p-2 rounded-lg font-medium transition-colors"
                            >
                                Add Product
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="md:col-span-2">
                    <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 bg-secondary/30 border-b border-border/50 flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2">
                                <ShoppingBag size={18} /> Product List
                            </h3>
                            <span className="text-xs bg-white px-2 py-1 rounded-full border">{products.length} Items</span>
                        </div>
                        <div className="divide-y divide-border/50">
                            {products.map(product => (
                                <div key={product.id} className="p-4 flex items-center justify-between hover:bg-secondary/5 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-foreground">{product.name}</h4>
                                        <div className="flex gap-4 text-sm mt-1">
                                            <span className="text-green-600 font-medium">Price: {formatCurrency(product.price)}</span>
                                            <span className="text-muted-foreground">COGS: {formatCurrency(product.cogs)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {products.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground">
                                    No products added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
