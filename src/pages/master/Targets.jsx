import React, { useState, useEffect } from 'react';
import { useMasterData } from '../../context/MasterDataContext';
import { supabase } from '../../lib/supabaseClient';
import { formatCurrency } from '../../utils/currency';
import {
    Map,
    Save,
    RefreshCw,
    Edit2,
    Check
} from 'lucide-react';

export default function Targets() {
    const { areas: masterAreas, subAreas: masterSubAreas, refreshData, loading: masterLoading } = useMasterData();
    const [subAreas, setSubAreas] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initial Data Load
    useEffect(() => {
        if (masterSubAreas.length > 0) {
            // Need to ensure we have fresh data for occupancy/target if context doesn't auto-update from DB trigger
            // For now assuming context is source of truth.
            setSubAreas(JSON.parse(JSON.stringify(masterSubAreas))); // Deep copy
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
            // Prepare updates
            // We do individual updates or bulk upsert if supported for different IDs
            // Supabase upsert requires unique constraint. ID is unique.

            const updates = subAreas.map(sa => ({
                id: sa.id,
                area_id: sa.area_id,
                name: sa.name,
                occupancy: parseInt(sa.occupancy) || 0,
                target: parseInt(sa.target) || 0
            }));

            // Upsert in batches is better
            const { error } = await supabase
                .from('sub_areas')
                .upsert(updates, { onConflict: 'id' });

            if (error) throw error;

            await refreshData(); // Refresh context
            setIsEditing(false);
            alert("Changes saved successfully!");

        } catch (error) {
            console.error('Error saving targets:', error);
            alert("Failed to save changes: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Group by Area for Display
    const groupedData = masterAreas.map(area => {
        return {
            ...area,
            cities: subAreas.filter(s => s.areaId === area.id)
        };
    });

    if (masterLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading master data...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Targets & Regional Management</h1>
                    <p className="text-muted-foreground text-sm">
                        Set occupancy and sales targets per city/region.
                    </p>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                                className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-background hover:bg-secondary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                            >
                                {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-border hover:bg-secondary transition-colors"
                        >
                            <Edit2 size={16} />
                            Edit Targets
                        </button>
                    )}
                </div>
            </div>

            {/* List by Area */}
            <div className="space-y-8">
                {groupedData.map(area => (
                    <div key={area.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-secondary/30 px-6 py-4 flex justify-between items-center border-b border-border">
                            <h3 className="font-bold flex items-center gap-2">
                                <Map size={18} className="text-primary" />
                                {area.name}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                                Total Target: <span className="font-bold text-foreground">
                                    {area.cities.reduce((acc, curr) => acc + (parseInt(curr.target) || 0), 0).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-card text-muted-foreground border-b border-border">
                                    <tr>
                                        <th className="px-6 py-3 font-medium w-[40%]">City / Region</th>
                                        <th className="px-6 py-3 font-medium text-right w-[30%]">Occupancy (Unit)</th>
                                        <th className="px-6 py-3 font-medium text-right w-[30%]">Sales Target (Unit)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {area.cities.map(city => (
                                        <tr key={city.id} className="hover:bg-secondary/10 transition-colors">
                                            <td className="px-6 py-3 font-medium">{city.name}</td>
                                            <td className="px-6 py-3 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        className="w-full text-right bg-background border border-input rounded px-2 py-1 focus:ring-1 focus:ring-primary outline-none"
                                                        value={city.occupancy || ''}
                                                        onChange={(e) => handleInputChange(city.id, 'occupancy', e.target.value)}
                                                        placeholder="0"
                                                    />
                                                ) : (
                                                    <span className="font-medium text-muted-foreground">{(city.occupancy || 0).toLocaleString()}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        className="w-full text-right bg-background border border-input rounded px-2 py-1 focus:ring-1 focus:ring-primary outline-none font-bold text-primary"
                                                        value={city.target || ''}
                                                        onChange={(e) => handleInputChange(city.id, 'target', e.target.value)}
                                                        placeholder="0"
                                                    />
                                                ) : (
                                                    <span className="font-bold text-primary">{(city.target || 0).toLocaleString()}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {area.cities.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-center text-muted-foreground italic">No cities found in this area.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {groupedData.length === 0 && (
                    <div className="p-12 text-center border-2 border-dashed border-border rounded-xl">
                        <p className="text-muted-foreground">No Areas defined. Please add areas in Regional Settings.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
