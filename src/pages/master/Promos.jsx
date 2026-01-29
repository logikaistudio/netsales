import React, { useState } from 'react';
import { useMasterData } from '../../context/MasterDataContext';
import {
    Tag,
    Plus,
    Trash2,
    Percent
} from 'lucide-react';

export default function Promos() {
    const { promos, addPromo, deletePromo } = useMasterData();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (name && price) {
            addPromo(name, parseFloat(price), parseFloat(discount || 0));
            setName('');
            setPrice('');
            setDiscount('');
        }
    };

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Active Promos</h1>
                <p className="text-muted-foreground text-sm">Manage promotional campaigns and discounts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="md:col-span-1">
                    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Plus size={18} className="text-purple-600" /> Add New Promo
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Promo/Campaign Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Merdeka Sale"
                                    className="w-full mt-1 bg-white border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Promo Price (IDR)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full mt-1 bg-white border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Discount Value (Optional)</label>
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    placeholder="0"
                                    className="w-full mt-1 bg-white border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!name || !price}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-2 rounded-lg font-medium transition-colors"
                            >
                                Add Promo
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="md:col-span-2">
                    <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 bg-secondary/30 border-b border-border/50 flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Tag size={18} /> Promo List
                            </h3>
                            <span className="text-xs bg-white px-2 py-1 rounded-full border">{promos.length} Active</span>
                        </div>
                        <div className="divide-y divide-border/50">
                            {promos.map(promo => (
                                <div key={promo.id} className="p-4 flex items-center justify-between hover:bg-secondary/5 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-foreground">{promo.name}</h4>
                                        <div className="flex gap-4 text-sm mt-1">
                                            <span className="text-purple-600 font-bold">Promo: {formatCurrency(promo.price)}</span>
                                            {promo.discount > 0 && (
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Percent size={12} /> Disc: {formatCurrency(promo.discount)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deletePromo(promo.id)}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {promos.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground">
                                    No active promos.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
