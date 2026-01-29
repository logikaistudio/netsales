import React, { useState } from 'react';
import { useMasterData } from '../context/MasterDataContext';
import {
    Map,
    Users,
    Plus,
    Trash2,
    MapPin,
    Briefcase,
    Building2
} from 'lucide-react';

export default function MasterData() {
    const {
        areas, addArea, deleteArea,
        subAreas, addSubArea, deleteSubArea,
        salesTeam, addSales, deleteSales
    } = useMasterData();

    const [activeTab, setActiveTab] = useState('areas'); // areas, sales
    const [newAreaName, setNewAreaName] = useState('');
    const [newSubAreaName, setNewSubAreaName] = useState('');
    const [selectedAreaForSub, setSelectedAreaForSub] = useState('');

    const [newSalesName, setNewSalesName] = useState('');
    const [selectedSubForSales, setSelectedSubForSales] = useState('');

    const handleAddArea = (e) => {
        e.preventDefault();
        if (newAreaName.trim()) {
            addArea(newAreaName);
            setNewAreaName('');
        }
    };

    const handleAddSubArea = (e) => {
        e.preventDefault();
        if (newSubAreaName.trim() && selectedAreaForSub) {
            addSubArea(selectedAreaForSub, newSubAreaName);
            setNewSubAreaName('');
        }
    };

    const handleAddSales = (e) => {
        e.preventDefault();
        if (newSalesName.trim() && selectedSubForSales) {
            addSales(newSalesName, selectedSubForSales);
            setNewSalesName('');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Master Data Management</h1>
                <p className="text-muted-foreground text-sm">Kelola data Area, Kota/Kecamatan, dan Sales Tim.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border/50">
                <button
                    onClick={() => setActiveTab('areas')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'areas'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Area & Wilayah
                </button>
                <button
                    onClick={() => setActiveTab('sales')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sales'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Sales Team
                </button>
            </div>

            {/* Content: Areas & SubAreas */}
            {activeTab === 'areas' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Area Management */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                            <h3 className="font-semibold flex items-center gap-2 mb-4">
                                <Map size={18} className="text-primary" /> Region / Area Besar
                            </h3>
                            <form onSubmit={handleAddArea} className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newAreaName}
                                    onChange={(e) => setNewAreaName(e.target.value)}
                                    placeholder="Nama Area Baru (e.g. Jawa Barat)"
                                    className="flex-1 bg-white border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                                <button type="submit" className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg">
                                    <Plus size={18} />
                                </button>
                            </form>
                            <div className="space-y-2">
                                {areas.map(area => (
                                    <div key={area.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg border border-border/30">
                                        <span className="font-medium text-sm">{area.name}</span>
                                        <button
                                            onClick={() => deleteArea(area.id)}
                                            className="text-muted-foreground hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {areas.length === 0 && <p className="text-sm text-muted-foreground italic">Belum ada area.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sub-Area Management */}
                    <div className="space-y-4">
                        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                            <h3 className="font-semibold flex items-center gap-2 mb-4">
                                <MapPin size={18} className="text-green-600" /> Kota / Kecamatan
                            </h3>
                            <form onSubmit={handleAddSubArea} className="flex flex-col gap-2 mb-4">
                                <select
                                    value={selectedAreaForSub}
                                    onChange={(e) => setSelectedAreaForSub(e.target.value)}
                                    className="bg-white border border-input rounded-lg px-3 py-2 text-sm outline-none"
                                >
                                    <option value="">Pilih Area Induk...</option>
                                    {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSubAreaName}
                                        onChange={(e) => setNewSubAreaName(e.target.value)}
                                        placeholder="Nama Kota/Kecamatan"
                                        className="flex-1 bg-white border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        disabled={!selectedAreaForSub}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!selectedAreaForSub}
                                        className="bg-primary h-full hover:bg-primary/90 disabled:opacity-50 text-white p-2 rounded-lg"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </form>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {subAreas.map(sub => {
                                    const parent = areas.find(a => a.id === sub.areaId);
                                    return (
                                        <div key={sub.id} className="flex justify-between items-center p-3 bg-white border border-border/50 rounded-lg shadow-sm">
                                            <div>
                                                <p className="font-medium text-sm">{sub.name}</p>
                                                <p className="text-xs text-muted-foreground">{parent?.name || 'Area dihapus'}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteSubArea(sub.id)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                                {subAreas.length === 0 && <p className="text-sm text-muted-foreground italic">Belum ada kota/kecamatan.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content: Sales Team */}
            {activeTab === 'sales' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                            <h3 className="font-semibold flex items-center gap-2 mb-4">
                                <Users size={18} className="text-blue-600" /> Daftar Sales
                            </h3>
                            <form onSubmit={handleAddSales} className="flex flex-col gap-2 mb-4">
                                <select
                                    value={selectedSubForSales}
                                    onChange={(e) => setSelectedSubForSales(e.target.value)}
                                    className="bg-white border border-input rounded-lg px-3 py-2 text-sm outline-none"
                                >
                                    <option value="">Pilih Wilayah (Kota/Kecamatan)...</option>
                                    {subAreas.map(s => {
                                        const area = areas.find(a => a.id === s.areaId);
                                        return <option key={s.id} value={s.id}>{s.name} ({area?.name})</option>;
                                    })}
                                </select>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSalesName}
                                        onChange={(e) => setNewSalesName(e.target.value)}
                                        placeholder="Nama Sales"
                                        className="flex-1 bg-white border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        disabled={!selectedSubForSales}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!selectedSubForSales}
                                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white p-2 rounded-lg"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                            <h3 className="font-semibold mb-4">Tim Aktif</h3>
                            <div className="space-y-2">
                                {salesTeam.map(sales => {
                                    const sub = subAreas.find(s => s.id === sales.subAreaId);
                                    const area = areas.find(a => a.id === sub?.areaId);
                                    return (
                                        <div key={sales.id} className="flex justify-between items-center p-3 bg-white border border-border/50 rounded-lg shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                                                    {sales.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-foreground">{sales.name}</p>
                                                    <p className="text-xs text-muted-foreground">{sub?.name}, {area?.name}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteSales(sales.id)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                                {salesTeam.length === 0 && <p className="text-sm text-muted-foreground italic">Belum ada data sales.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
