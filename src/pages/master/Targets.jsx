import React, { useState, useMemo, useEffect } from 'react';
import { useMasterData } from '../../context/MasterDataContext';
import { supabase } from '../../lib/supabaseClient';
import { formatCurrency } from '../../utils/currency';
import {
    Target,
    Map,
    Users,
    ChevronRight,
    Save,
    Briefcase,
    TrendingUp,
    PieChart as PieChartIcon,
    RefreshCw
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function Targets() {
    const { areas: masterAreas, subAreas: masterSubAreas, loading: masterLoading } = useMasterData();

    // --- State Management ---
    const [areas, setAreas] = useState([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState('yearly');
    const [expandedAreaId, setExpandedAreaId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingTargets, setIsLoadingTargets] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // --- Derived Calculations ---

    const globalTarget = useMemo(() => areas.reduce((sum, area) => sum + (area.target || 0), 0), [areas]);

    // Helper to get time divisor
    const getTimeDivisor = (tf) => {
        switch (tf) {
            case 'quarterly': return 4;
            case 'monthly': return 12;
            case 'weekly': return 52;
            case 'daily': return 365;
            default: return 1;
        }
    };

    const timeDivisor = getTimeDivisor(selectedTimeframe);

    const formatNumber = formatCurrency; // Use currency formatter

    // --- Data Sync ---

    useEffect(() => {
        if (!masterLoading && masterAreas.length > 0) {
            fetchTargetsAndMerge();
        }
    }, [masterAreas, masterSubAreas, masterLoading]);

    const fetchTargetsAndMerge = async () => {
        setIsLoadingTargets(true);
        try {
            // Fetch targets for current year (2026 default)
            const { data: targetData, error } = await supabase
                .from('targets')
                .select('*')
                .eq('year', 2026);

            if (error) throw error;

            // Merge Master Data Structure with DB Target Values
            const mergedAreas = masterAreas.map(ma => {
                // Find target for this AREA
                const areaTargetRecord = targetData?.find(t => t.entity_type === 'area' && t.entity_id === ma.id);
                const areaTargetValue = areaTargetRecord ? Number(areaTargetRecord.target_value) : 0;

                // Get SubAreas
                const currentSubs = masterSubAreas.filter(s => s.areaId === ma.id);

                // Calculate SubArea percentages
                // If we store subarea absolutes in DB, we convert to % for UI, or simple store %? 
                // Let's stick to the previous UI logic: SubAreas have % of Parent.
                // BUT, to support "Edit Bottom Up", we might want to store Absolute Values for subareas too eventually.
                // For now, let's keep SubAreas as derived percentages OR stored records if they exist.

                const mergedSubs = currentSubs.map(sub => {
                    const subTargetRecord = targetData?.find(t => t.entity_type === 'sub_area' && t.entity_id === sub.id);
                    // If sub record exists, calculate its implied percentage relative to Area Target
                    const val = subTargetRecord ? Number(subTargetRecord.target_value) : 0;
                    const avail = subTargetRecord ? Number(subTargetRecord.availability_value) : 0; // Availability Field

                    // If Area Target is 0, we can't really determine %, default 0
                    const impliedPct = areaTargetValue > 0 ? (val / areaTargetValue) * 100 : 0;

                    return {
                        id: sub.id,
                        name: sub.name,
                        percentage: Math.round(impliedPct),
                        absoluteValue: val,
                        availability: avail
                    };
                });

                // Auto-distribute if fresh (all 0)
                if (mergedSubs.length > 0 && mergedSubs.every(s => s.percentage === 0) && areaTargetValue > 0) {
                    // If area has target but subs don't, unlikely but possible.
                }

                return {
                    id: ma.id,
                    name: ma.name,
                    target: areaTargetValue,
                    subAreas: mergedSubs
                };
            });

            setAreas(mergedAreas);
        } catch (err) {
            console.error("Error fetching targets:", err);
        } finally {
            setIsLoadingTargets(false);
        }
    };

    const saveTargetsToDB = async () => {
        setIsSaving(true);
        try {
            const upsertData = [];

            // Prepare Area Targets
            areas.forEach(area => {
                upsertData.push({
                    entity_type: 'area',
                    entity_id: area.id,
                    target_value: area.target,
                    year: 2026,
                    period_type: 'yearly',
                    availability_value: 0 // Area avail could be sum of subs, but let's keep 0 or calculate
                });

                // Prepare Sub Area Targets
                area.subAreas.forEach(sub => {
                    const absVal = (area.target * (sub.percentage / 100));
                    upsertData.push({
                        entity_type: 'sub_area',
                        entity_id: sub.id,
                        target_value: absVal,
                        availability_value: sub.availability,
                        year: 2026,
                        period_type: 'yearly'
                    });
                });
            });

            // Upsert to Supabase
            const { error } = await supabase
                .from('targets')
                .upsert(upsertData, { onConflict: 'entity_type, entity_id, year' });

            if (error) throw error;

            setIsEditing(false);
        } catch (err) {
            console.error("Error saving targets:", err);
            alert("Failed to save targets");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Handlers ---

    // ... (Global/Area handlers kept same by previous context, adding SubArea Avail handler)

    const handleSubAreaAvailabilityChange = (areaId, subId, newVal) => {
        const val = parseInt(newVal.replace(/\D/g, '')) || 0;
        setAreas(prev => prev.map(area => {
            if (area.id !== areaId) return area;
            return {
                ...area,
                subAreas: area.subAreas.map(sub =>
                    sub.id === subId ? { ...sub, availability: val } : sub
                )
            };
        }));
    };

    // ... (Other handlers)

    // Re-inserting handleGlobalTargetChange etc to keep context clean if replace cut them off? 
    // No, I'll restrict replacement block carefully.

    // ... 

    // UI Render Block for SubArea (inside map)
    // We need to match the indentation carefully.

    /* Replacement for SubArea Render */
    <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground px-3 mb-2">
            <div className="col-span-4">City / District</div>
            <div className="col-span-3 text-right">Availability</div>
            <div className="col-span-3 text-right">Target</div>
            <div className="col-span-2 text-right">% Split</div>
        </div>
        {area.subAreas.map((sub) => {
            const subTargetPeriod = (area.target * (sub.percentage / 100)) / timeDivisor;
            return (
                <div key={sub.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-white border border-border/50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {/* Name */}
                    <div className="col-span-4">
                        <span className="font-medium text-sm text-foreground">{sub.name}</span>
                    </div>

                    {/* Availability (Editable) */}
                    <div className="col-span-3 flex justify-end">
                        {isEditing ? (
                            <input
                                type="text"
                                className="w-full text-right bg-gray-50 border border-input rounded px-2 py-1 text-sm font-medium focus:ring-1 focus:ring-primary"
                                value={sub.availability || 0}
                                onChange={(e) => handleSubAreaAvailabilityChange(area.id, sub.id, e.target.value)}
                            />
                        ) : (
                            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <Users size={12} />
                                {sub.availability || 0}
                            </div>
                        )}
                    </div>

                    {/* Target (Calculated) */}
                    <div className="col-span-3 text-right">
                        <span className="text-sm font-bold text-blue-600">{formatNumber(subTargetPeriod)}</span>
                    </div>

                    {/* Percentage (Editable) */}
                    <div className="col-span-2 flex justify-end">
                        {isEditing ? (
                            <div className="flex items-center border border-input rounded px-1 w-14 bg-white">
                                <input
                                    type="number"
                                    className="w-full text-right bg-transparent border-none p-0 text-xs font-semibold focus:ring-0"
                                    value={sub.percentage}
                                    onChange={(e) => updateSubAreaPercentage(area.id, sub.id, parseInt(e.target.value) || 0)}
                                />
                                <span className="text-[10px] text-muted-foreground">%</span>
                            </div>
                        ) : (
                            <span className="text-xs font-bold text-muted-foreground">
                                {sub.percentage}%
                            </span>
                        )}
                    </div>
                </div>
            );
        })}
        {area.subAreas.length === 0 && <p className="text-sm text-muted-foreground italic p-2">No cities in this area yet.</p>}
    </div>

    {/* Right Column: Visualization & Summary */ }
    <div className="space-y-6">
        {/* Distribution Pie Chart */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <PieChartIcon size={16} />
                Area Proportion (Visual)
            </h3>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={areas}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="target"
                            nameKey="name"
                            stroke="none"
                        >
                            {areas.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value) => formatNumber(value / timeDivisor)}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <TrendingUp size={18} />
                Summary ({selectedTimeframe})
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Target</span>
                    <span className="font-bold">{formatNumber(globalTarget / timeDivisor)}</span>
                </div>
                <div className="h-px bg-primary/20 my-2" />
                {areas.map(area => (
                    <div key={area.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{area.name}</span>
                        <span className="font-medium text-foreground">{formatNumber((area.target || 0) / timeDivisor)}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
            </div >
        </div >
    );
}
