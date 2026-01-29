import React, { useState, useEffect } from 'react';
import { useMasterData } from '../../context/MasterDataContext';
import { supabase } from '../../lib/supabaseClient';
import {
    Map,
    Save,
    RefreshCw,
    Edit2,
    Plus,
    MoreHorizontal,
    Trash2,
    Building2,
    MapPin,
    Network
} from 'lucide-react';

export default function Targets() {
    const {
        areas: masterAreas,
        subAreas: masterSubAreas,
        addArea,
        addSubArea,
        deleteArea,
        deleteSubArea,
        refreshData,
        loading: masterLoading
    } = useMasterData();

    // Local state for editing values
    const [subAreas, setSubAreas] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Modal States
    const [showAddAreaModal, setShowAddAreaModal] = useState(false);
    const [showAddCityModal, setShowAddCityModal] = useState(null); // stores areaId
    const [newItemName, setNewItemName] = useState('');

    // Initial Data Sync
    useEffect(() => {
        if (masterSubAreas.length > 0) {
            setSubAreas(JSON.parse(JSON.stringify(masterSubAreas)));
        }
    }, [masterSubAreas]);

    const handleInputChange = (id, field, value) => {
        setSubAreas(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            const updates = subAreas.map(sa => ({
                id: sa.id,
                area_id: sa.area_id,
                name: sa.name,
                occupancy: parseInt(sa.occupancy) || 0,
                target: parseInt(sa.target) || 0
            }));

            const { error } = await supabase
                .from('sub_areas')
                .upsert(updates, { onConflict: 'id' });

            if (error) throw error;

            await refreshData();
            setIsEditing(false);
            // alert("Changes saved successfully!"); 
        } catch (error) {
            console.error('Error saving targets:', error);
            alert("Failed to save changes: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddArea = async () => {
        if (!newItemName.trim()) return;
        await addArea(newItemName);
        setNewItemName('');
        setShowAddAreaModal(false);
        await refreshData();
    };

    const handleAddCity = async () => {
        if (!newItemName.trim() || !showAddCityModal) return;
        await addSubArea(showAddCityModal, newItemName);
        setNewItemName('');
        setShowAddCityModal(null);
        await refreshData();
    };

    const handleDeleteCity = async (id) => {
        if (window.confirm('Are you sure you want to delete this city? Data related to this city might be affected.')) {
            await deleteSubArea(id);
            await refreshData();
        }
    }

    const handleDeleteArea = async (id) => {
        if (window.confirm('Are you sure you want to delete this Area? All cities inside it will be deleted.')) {
            await deleteArea(id);
            await refreshData();
        }
    }

    // Grouping Data
    const groupedData = masterAreas.map(area => {
        return {
            ...area,
            cities: subAreas.filter(s => s.area_id === area.id) // Changed from areaId to area_id to match DB schema
        };
    });

    if (masterLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading region data...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Network className="text-primary" size={32} />
                        Network Planning
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Manage coverage areas, homepass capacity, and sales targets per region.
                    </p>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-border bg-background hover:bg-secondary transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                            >
                                {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddAreaModal(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
                            >
                                <Plus size={18} />
                                Add Area
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white border border-border hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <Edit2 size={18} />
                                Edit Targets
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8">
                {groupedData.map(area => {
                    // Calculate Summaries
                    const totalHomepass = area.cities.reduce((acc, curr) => acc + (parseInt(curr.occupancy) || 0), 0);
                    const totalTarget = area.cities.reduce((acc, curr) => acc + (parseInt(curr.target) || 0), 0);

                    return (
                        <div key={area.id} className="group relative bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                            {/* Area Header Card */}
                            <div className="bg-gradient-to-r from-secondary/50 to-background p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm">
                                        <Map size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">{area.name}</h2>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1"><Building2 size={14} /> {area.cities.length} Cities</span>
                                            <span className="w-1 h-1 bg-border rounded-full"></span>
                                            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                                                Region ID: {area.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Homepass</p>
                                        <p className="text-2xl font-bold text-foreground">{totalHomepass.toLocaleString()}</p>
                                    </div>
                                    <div className="w-px h-10 bg-border/50 hidden md:block"></div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Target</p>
                                        <p className="text-2xl font-bold text-primary">{totalTarget.toLocaleString()}</p>
                                    </div>

                                    {isEditing && (
                                        <button
                                            onClick={() => handleDeleteArea(area.id)}
                                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Area"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Table Content */}
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-secondary/20 text-muted-foreground border-b border-border/50">
                                        <tr>
                                            <th className="px-6 py-4 font-medium w-[40%] pl-8">City / District Segment</th>
                                            <th className="px-6 py-4 font-medium text-right w-[25%]">Homepass Capacity (HP)</th>
                                            <th className="px-6 py-4 font-medium text-right w-[25%]">Sales Target (HP)</th>
                                            {isEditing && <th className="px-6 py-4 w-[10%]"></th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {area.cities.map(city => (
                                            <tr key={city.id} className="hover:bg-secondary/5 transition-colors group/row">
                                                <td className="px-6 py-4 pl-8">
                                                    <div className="flex items-center gap-3">
                                                        <MapPin size={16} className="text-muted-foreground opacity-50 group-hover/row:opacity-100 transition-opacity" />
                                                        <span className="font-medium text-foreground">{city.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {isEditing ? (
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                className="w-full text-right bg-background border border-input rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                                value={city.occupancy || ''}
                                                                onChange={(e) => handleInputChange(city.id, 'occupancy', e.target.value)}
                                                                placeholder="0"
                                                            />
                                                            <span className="absolute right-8 top-2.5 text-xs text-muted-foreground pointer-events-none hidden">HP</span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-medium text-muted-foreground bg-secondary/30 px-3 py-1 rounded-lg">
                                                            {(city.occupancy || 0).toLocaleString()} HP
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            className="w-full text-right bg-background border border-input rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-primary"
                                                            value={city.target || ''}
                                                            onChange={(e) => handleInputChange(city.id, 'target', e.target.value)}
                                                            placeholder="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">
                                                            {(city.target || 0).toLocaleString()} HP
                                                        </span>
                                                    )}
                                                </td>
                                                {isEditing && (
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleDeleteCity(city.id)}
                                                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* Footer Add City Button */}
                                    <tfoot className="border-t border-border/50 bg-secondary/5">
                                        <tr>
                                            <td colSpan={isEditing ? 4 : 3} className="px-6 py-3">
                                                <button
                                                    onClick={() => setShowAddCityModal(area.id)}
                                                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg hover:bg-primary/5"
                                                >
                                                    <Plus size={16} />
                                                    Add New City to {area.name}
                                                </button>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    );
                })}

                {groupedData.length === 0 && (
                    <div className="p-16 text-center border-2 border-dashed border-border rounded-2xl bg-secondary/10">
                        <Map size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-foreground">No Areas Configured</h3>
                        <p className="text-muted-foreground mb-6">Start by adding your first coverage area (e.g., Province).</p>
                        <button
                            onClick={() => setShowAddAreaModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                        >
                            <Plus size={18} />
                            Add First Area
                        </button>
                    </div>
                )}
            </div>

            {/* --- Modals --- */}

            {/* Add Area Modal */}
            {showAddAreaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-4">Add New Area (Province)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-1 block">Area Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g., Jawa Tengah"
                                    value={newItemName}
                                    onChange={e => setNewItemName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddArea()}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setShowAddAreaModal(false)}
                                    className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddArea}
                                    disabled={!newItemName.trim()}
                                    className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    Add Area
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add City Modal */}
            {showAddCityModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-4">Add New City</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-1 block">City Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g., Kota Semarang"
                                    value={newItemName}
                                    onChange={e => setNewItemName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddCity()}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setShowAddCityModal(null)}
                                    className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddCity}
                                    disabled={!newItemName.trim()}
                                    className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    Add City
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
