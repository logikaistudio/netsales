import React, { useState } from 'react';
import { useMasterData } from '../../context/MasterDataContext';
import {
    Users,
    Plus,
    Trash2,
} from 'lucide-react';

export default function SalesTeam() {
    const {
        areas, subAreas,
        salesTeam, addSales, deleteSales
    } = useMasterData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSalesName, setNewSalesName] = useState('');
    const [newSalesNIP, setNewSalesNIP] = useState('');
    const [newSalesPhone, setNewSalesPhone] = useState('');
    const [selectedSubForSales, setSelectedSubForSales] = useState('');

    const handleAddSales = (e) => {
        e.preventDefault();
        if (newSalesName.trim() && selectedSubForSales) {
            addSales(newSalesName, selectedSubForSales, newSalesNIP, newSalesPhone);
            // Reset and Close
            setNewSalesName('');
            setNewSalesNIP('');
            setNewSalesPhone('');
            setSelectedSubForSales('');
            setIsModalOpen(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Sales Team</h1>
                    <p className="text-muted-foreground text-sm">Manage sales personnel and their assigned territories.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-colors"
                >
                    <Plus size={18} /> Add Sales Person
                </button>
            </div>

            {/* Sales List */}
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Users size={18} className="text-blue-600" /> Active Team Members
                        </h3>
                        <span className="text-xs bg-secondary px-2 py-1 rounded-full">{salesTeam.length} Members</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {salesTeam.map(sales => {
                            const sub = subAreas.find(s => s.id === sales.subAreaId);
                            const area = areas.find(a => a.id === sub?.areaId);
                            return (
                                <div key={sales.id} className="p-4 bg-white border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-shadow group relative">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-bold text-blue-700">
                                            {sales.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-foreground truncate">{sales.name}</h4>
                                            <p className="text-xs text-muted-foreground mb-1">{sub?.name}, {area?.name}</p>

                                            <div className="space-y-1 mt-2 border-t border-border/50 pt-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">NIP:</span>
                                                    <span className="font-medium">{sales.nip || '-'}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Phone:</span>
                                                    <span className="font-medium">{sales.phone || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteSales(sales.id)}
                                        className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                        {salesTeam.length === 0 && (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border">
                                No sales team members found. Click "Add Sales Person" to start.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold mb-4">Add Sales Person</h2>
                        <form onSubmit={handleAddSales} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={newSalesName}
                                    onChange={(e) => setNewSalesName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground block mb-1">NIP</label>
                                    <input
                                        type="text"
                                        value={newSalesNIP}
                                        onChange={(e) => setNewSalesNIP(e.target.value)}
                                        placeholder="e.g. 12345678"
                                        className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground block mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={newSalesPhone}
                                        onChange={(e) => setNewSalesPhone(e.target.value)}
                                        placeholder="e.g. 0812..."
                                        className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1">Assigned Territory (Sub-Area)</label>
                                <select
                                    value={selectedSubForSales}
                                    onChange={(e) => setSelectedSubForSales(e.target.value)}
                                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    required
                                >
                                    <option value="">Select Territory...</option>
                                    {subAreas.map(s => {
                                        const area = areas.find(a => a.id === s.areaId);
                                        return <option key={s.id} value={s.id}>{s.name} ({area?.name})</option>;
                                    })}
                                </select>
                            </div>

                            <div className="flex gap-3 justify-end mt-6 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                                >
                                    Add Sales
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
