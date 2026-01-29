import React, { useState } from 'react';
import { useMasterData } from '../../context/MasterDataContext';
import {
    Map,
    Plus,
    Trash2,
    MapPin,
} from 'lucide-react';

export default function Regional() {
    const {
        areas, addArea, deleteArea,
        subAreas, addSubArea, deleteSubArea
    } = useMasterData();

    const [newAreaName, setNewAreaName] = useState('');
    const [newSubAreaName, setNewSubAreaName] = useState('');
    const [selectedAreaForSub, setSelectedAreaForSub] = useState('');

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

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Regional Management</h1>
                <p className="text-muted-foreground text-sm">Manage Areas and Cities/Districts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Area Management */}
                <div className="space-y-4">
                    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Map size={18} className="text-primary" /> Main Areas / Regions
                        </h3>
                        <form onSubmit={handleAddArea} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newAreaName}
                                onChange={(e) => setNewAreaName(e.target.value)}
                                placeholder="New Area Name"
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
                            {areas.length === 0 && <p className="text-sm text-muted-foreground italic">No areas yet.</p>}
                        </div>
                    </div>
                </div>

                {/* Sub-Area Management */}
                <div className="space-y-4">
                    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <MapPin size={18} className="text-green-600" /> Cities / Districts
                        </h3>
                        <form onSubmit={handleAddSubArea} className="flex flex-col gap-2 mb-4">
                            <select
                                value={selectedAreaForSub}
                                onChange={(e) => setSelectedAreaForSub(e.target.value)}
                                className="bg-white border border-input rounded-lg px-3 py-2 text-sm outline-none"
                            >
                                <option value="">Select Parent Area...</option>
                                {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSubAreaName}
                                    onChange={(e) => setNewSubAreaName(e.target.value)}
                                    placeholder="City/District Name"
                                    className="flex-1 bg-white border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    disabled={!selectedAreaForSub}
                                />
                                <button
                                    type="submit"
                                    disabled={!selectedAreaForSub}
                                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white p-2 rounded-lg"
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
                                            <p className="text-xs text-muted-foreground">{parent?.name || 'Unknown Area'}</p>
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
                            {subAreas.length === 0 && <p className="text-sm text-muted-foreground italic">No cities/districts yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
