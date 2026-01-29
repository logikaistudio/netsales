import React, { useState } from 'react';
import { useMasterData } from '../../context/MasterDataContext';
import { MapPin, Plus, Trash2, ChevronRight, Building2, Map } from 'lucide-react';

export default function Districts() {
    const { areas, subAreas, districts, addDistrict, deleteDistrict } = useMasterData();

    // Selection State
    const [selectedAreaId, setSelectedAreaId] = useState('');
    const [selectedSubAreaId, setSelectedSubAreaId] = useState('');

    // Form State
    const [newDistrictName, setNewDistrictName] = useState('');

    // Derived Data
    const filteredSubAreas = subAreas.filter(s => s.areaId == selectedAreaId);
    const filteredDistricts = districts.filter(d => d.subAreaId == selectedSubAreaId);

    // Handlers
    const handleAddDistrict = (e) => {
        e.preventDefault();
        if (newDistrictName.trim() && selectedSubAreaId) {
            addDistrict(selectedSubAreaId, newDistrictName);
            setNewDistrictName('');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Districts (Kecamatan)</h1>
                <p className="text-muted-foreground text-sm">Manage finer geographic divisions for precise targeting.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Filter Panel */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Area Selection */}
                    <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-primary">
                            <Map size={16} /> Select Region
                        </h3>
                        <div className="space-y-2">
                            {areas.length === 0 && <p className="text-sm text-muted-foreground italic">No regions found.</p>}
                            {areas.map(area => (
                                <button
                                    key={area.id}
                                    onClick={() => {
                                        setSelectedAreaId(area.id);
                                        setSelectedSubAreaId(''); // Reset child
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${selectedAreaId === area.id
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'bg-secondary/50 hover:bg-secondary text-foreground'
                                        }`}
                                >
                                    {area.name}
                                    {selectedAreaId === area.id && <ChevronRight size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* City Selection (Dependent) */}
                    {selectedAreaId && (
                        <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm animate-in slide-in-from-left-2 duration-300">
                            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-primary">
                                <Building2 size={16} /> Select City
                            </h3>
                            <div className="space-y-2">
                                {filteredSubAreas.length === 0 && <p className="text-sm text-muted-foreground italic">No cities in this region.</p>}
                                {filteredSubAreas.map(sub => (
                                    <button
                                        key={sub.id}
                                        onClick={() => setSelectedSubAreaId(sub.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex justify-between items-center ${selectedSubAreaId === sub.id
                                                ? 'bg-orange-500 text-white shadow-md'
                                                : 'bg-secondary/50 hover:bg-secondary text-foreground'
                                            }`}
                                    >
                                        {sub.name}
                                        {selectedSubAreaId === sub.id && <ChevronRight size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Management Panel */}
                <div className="lg:col-span-2">
                    {selectedAreaId && selectedSubAreaId ? (
                        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                            <div className="p-6 border-b border-border/50 bg-secondary/10 flex justify-between items-center">
                                <div>
                                    <h2 className="font-bold text-lg">Manage Districts</h2>
                                    <p className="text-xs text-muted-foreground">
                                        For: <span className="font-semibold text-foreground">{subAreas.find(s => s.id == selectedSubAreaId)?.name}</span>, {areas.find(a => a.id == selectedAreaId)?.name}
                                    </p>
                                </div>
                                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {filteredDistricts.length} Districts
                                </div>
                            </div>

                            {/* Add Form */}
                            <div className="p-6 bg-white border-b border-border/50">
                                <form onSubmit={handleAddDistrict} className="flex gap-3">
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Enter new district name (e.g. Kecamatan Cibeber)..."
                                            value={newDistrictName}
                                            onChange={(e) => setNewDistrictName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newDistrictName.trim()}
                                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                    >
                                        <Plus size={18} /> Add
                                    </button>
                                </form>
                            </div>

                            {/* List */}
                            <div className="p-2">
                                {filteredDistricts.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center text-muted-foreground">
                                        <MapPin size={48} className="opacity-20 mb-4" />
                                        <p>No districts registered yet.</p>
                                        <p className="text-xs">Add one above to get started.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
                                        {filteredDistricts.map(dist => (
                                            <div key={dist.id} className="group flex justify-between items-center p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md bg-white transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-secondary rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                                                        <MapPin size={16} />
                                                    </div>
                                                    <span className="font-medium">{dist.name}</span>
                                                </div>
                                                <button
                                                    onClick={() => deleteDistrict(dist.id)}
                                                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Delete District"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl bg-secondary/5 text-muted-foreground">
                            <MapPin size={48} className="opacity-20 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No City Selected</h3>
                            <p className="max-w-xs text-sm">Please select a Region and then a City from the sidebar to manage its districts.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
