import React, { useState, useMemo, useEffect } from 'react';
import { useMasterData } from '../context/MasterDataContext';
import {
    Target,
    Map,
    Users,
    ChevronRight,
    Save,
    Briefcase,
    TrendingUp,
    PieChart as PieChartIcon
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
    const { areas: masterAreas, subAreas: masterSubAreas } = useMasterData();

    // --- State Management ---
    // We maintain a local state for targets, but the structure comes from Master Data
    const [areas, setAreas] = useState([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState('yearly');
    const [expandedAreaId, setExpandedAreaId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Sync Master Data Structure with Local Target State
    useEffect(() => {
        // Load saved target values if any (to persist numbers when master data refreshes)
        const savedTargets = JSON.parse(localStorage.getItem('target_values') || '{}');

        const mergedAreas = masterAreas.map(ma => {
            // Find existing target value or default
            const savedArea = savedTargets[ma.id];
            const areaTarget = savedArea?.target || 0; // Default 0 if new area

            // Get subareas for this area
            const releventSubs = masterSubAreas.filter(s => s.areaId === ma.id);

            const mergedSubs = releventSubs.map(sub => {
                const savedSub = savedArea?.subAreas?.find(s => s.id === sub.id);
                return {
                    id: sub.id,
                    name: sub.name,
                    percentage: savedSub ? savedSub.percentage : 0 // Default 0%
                };
            });

            // Auto-distribute percentage if all are 0 (fresh init) to avoid NaN
            if (mergedSubs.length > 0 && mergedSubs.every(s => s.percentage === 0)) {
                const equalShare = Math.floor(100 / mergedSubs.length);
                mergedSubs.forEach((s, idx) => {
                    s.percentage = idx === mergedSubs.length - 1 ? (100 - (equalShare * (mergedSubs.length - 1))) : equalShare;
                });
            }

            return {
                id: ma.id,
                name: ma.name,
                target: areaTarget,
                subAreas: mergedSubs
            };
        });

        // Only update if structure length changed or first load to prevent loop, 
        // ideally we should do deep comparison but for now this suffices for simple addition/removal
        setAreas(mergedAreas);
    }, [masterAreas, masterSubAreas]); // Re-run when master data changes

    // Persist Targets whenever they change
    useEffect(() => {
        if (areas.length > 0) {
            const targetsToSave = {};
            areas.forEach(a => {
                targetsToSave[a.id] = {
                    target: a.target,
                    subAreas: a.subAreas.map(s => ({ id: s.id, percentage: s.percentage }))
                };
            });
            localStorage.setItem('target_values', JSON.stringify(targetsToSave));
        }
    }, [areas]);


    // --- Derived Calculations ---

    const globalTarget = useMemo(() => areas.reduce((sum, area) => sum + area.target, 0), [areas]);

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

    const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Math.round(num));

    // --- Handlers ---

    // 1. Edit Global Target (Top-Down Distribute)
    const handleGlobalTargetChange = (e) => {
        const newGlobalVal = parseInt(e.target.value.replace(/\D/g, '')) || 0;
        // Convert displayed value (which might be monthly) back to Yearly basic
        const newYearlyGlobal = newGlobalVal * timeDivisor;

        // Distribute proportionally
        const oldGlobal = globalTarget === 0 ? 1 : globalTarget; // avoid div by 0

        setAreas(prev => prev.map(area => ({
            ...area,
            target: (area.target / oldGlobal) * newYearlyGlobal
        })));
    };

    // 2. Edit Area Target (Bottom-Up)
    const handleAreaTargetChange = (id, newVal) => {
        const newAreaValPeriod = parseInt(newVal.replace(/\D/g, '')) || 0;
        const newAreaValYearly = newAreaValPeriod * timeDivisor;

        setAreas(prev => prev.map(area =>
            area.id === id ? { ...area, target: newAreaValYearly } : area
        ));
    };

    const updateSubAreaPercentage = (areaId, subId, newPct) => {
        setAreas(prev => prev.map(area => {
            if (area.id !== areaId) return area;
            return {
                ...area,
                subAreas: area.subAreas.map(sub =>
                    sub.id === subId ? { ...sub, percentage: Math.min(100, Math.max(0, newPct)) } : sub
                )
            };
        }));
    };

    const toggleAreaExpand = (id) => {
        setExpandedAreaId(expandedAreaId === id ? null : id);
    };

    const renderTimeframeTabs = () => (
        <div className="flex p-1 bg-secondary/50 rounded-lg mb-6 w-full md:w-auto overflow-x-auto">
            {[
                { id: 'yearly', label: 'Tahunan' },
                { id: 'quarterly', label: 'Per 3 Bulan' },
                { id: 'monthly', label: 'Bulanan' },
                { id: 'weekly', label: 'Mingguan' },
                { id: 'daily', label: 'Harian' },
            ].map(tf => (
                <button
                    key={tf.id}
                    onClick={() => setSelectedTimeframe(tf.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${selectedTimeframe === tf.id
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                        }`}
                >
                    {tf.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Target Achievement Planning</h1>
                    <p className="text-muted-foreground text-sm">
                        Total {selectedTimeframe === 'yearly' ? 'Tahun Ini' : selectedTimeframe === 'monthly' ? 'Bulan Ini' : 'Periode Ini'}: <span className="font-bold text-foreground">{formatNumber(globalTarget / timeDivisor)} Units</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white border border-border hover:bg-secondary'
                            }`}
                    >
                        {isEditing ? <Save size={16} /> : <Briefcase size={16} />}
                        {isEditing ? 'Selesai Edit' : 'Edit Target'}
                    </button>
                </div>
            </div>

            {/* Global Target Configuration */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Target size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Global Target ({selectedTimeframe})</p>
                            {isEditing ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="text"
                                        value={Math.round(globalTarget / timeDivisor)}
                                        onChange={handleGlobalTargetChange}
                                        className="text-3xl font-bold bg-white border border-input rounded-lg px-2 py-1 w-48 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    <span className="text-sm text-muted-foreground">Unit</span>
                                </div>
                            ) : (
                                <h2 className="text-3xl font-bold text-foreground">{formatNumber(globalTarget / timeDivisor)} <span className="text-lg font-normal text-muted-foreground">Unit</span></h2>
                            )}
                        </div>
                    </div>

                    {/* Timeframe View */}
                    <div className="w-full md:w-auto flex flex-col items-end">
                        <p className="text-sm text-muted-foreground mb-2">Lihat Pecahan Target:</p>
                        {renderTimeframeTabs()}
                    </div>
                </div>

                {/* Sub-Stats Summary (Read-Only Preview) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/50">
                    <div className="bg-secondary/30 p-4 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Total Area</p>
                        <p className="text-xl font-bold text-primary">{areas.length} Area</p>
                    </div>
                </div>
            </div>

            {/* Main Content: Hierarchy Tree */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Distribution Hierarchy */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Map size={18} className="text-muted-foreground" />
                            Target per Area ({selectedTimeframe})
                        </h3>
                    </div>

                    {areas.map((area) => {
                        const areaTargetPeriod = area.target / timeDivisor;
                        const subAreaTotalPct = area.subAreas.reduce((acc, curr) => acc + curr.percentage, 0);
                        const isSubAreaValid = subAreaTotalPct === 100;
                        const contributionPct = ((area.target / globalTarget) * 100).toFixed(1);

                        return (
                            <div key={area.id} className={`bg-card border rounded-xl overflow-hidden transition-all duration-300 ${expandedAreaId === area.id ? 'ring-2 ring-primary/20 shadow-lg' : 'border-border/50 hover:border-primary/30'}`}>
                                {/* Area Header */}
                                <div
                                    className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer bg-gradient-to-r from-transparent to-secondary/5 gap-4"
                                    onClick={() => toggleAreaExpand(area.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-md transition-transform duration-200 ${expandedAreaId === area.id ? 'bg-primary text-white rotate-90' : 'bg-secondary text-muted-foreground'}`}>
                                            <ChevronRight size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground text-lg">{area.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>Kontribusi Global: {contributionPct}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit Target Area */}
                                    <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-input shadow-sm">
                                                <input
                                                    type="text"
                                                    className="w-24 text-right bg-transparent border-none p-0 text-lg font-bold focus:ring-0 text-primary"
                                                    value={Math.round(areaTargetPeriod)}
                                                    onChange={(e) => handleAreaTargetChange(area.id, e.target.value)}
                                                />
                                                <span className="text-xs text-muted-foreground font-medium">Unit</span>
                                            </div>
                                        ) : (
                                            <div className="text-right">
                                                <span className="text-xl font-bold text-primary block">{formatNumber(areaTargetPeriod)}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Target</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Sub-Area Content */}
                                {expandedAreaId === area.id && (
                                    <div className="border-t border-border/50 bg-secondary/5 p-4 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <h5 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                                                <Users size={14} /> Breakdown Kecamatan (% dari Target Area)
                                            </h5>
                                            {!isSubAreaValid && (
                                                <span className="text-[10px] text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded">Total Alokasi: {subAreaTotalPct}% (Harus 100%)</span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            {area.subAreas.map((sub) => {
                                                const subTargetPeriod = (area.target * (sub.percentage / 100)) / timeDivisor;
                                                return (
                                                    <div key={sub.id} className="flex items-center justify-between p-3 bg-white border border-border/50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm text-foreground">{sub.name}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                Target: <span className="font-bold text-blue-600">{formatNumber(subTargetPeriod)}</span>
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden hidden md:block">
                                                                <div
                                                                    className="h-full bg-blue-500 rounded-full"
                                                                    style={{ width: `${sub.percentage}%` }}
                                                                />
                                                            </div>
                                                            {isEditing ? (
                                                                <div className="flex items-center border border-input rounded-md px-2 py-1 bg-gray-50">
                                                                    <input
                                                                        type="number"
                                                                        className="w-10 text-right bg-transparent border-none p-0 text-sm font-semibold focus:ring-0"
                                                                        value={sub.percentage}
                                                                        onChange={(e) => updateSubAreaPercentage(area.id, sub.id, parseInt(e.target.value) || 0)}
                                                                    />
                                                                    <span className="text-xs text-muted-foreground ml-1">%</span>
                                                                </div>
                                                            ) : (
                                                                <span className="font-bold text-sm bg-secondary px-2 py-1 rounded text-foreground">
                                                                    {sub.percentage}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right Column: Visualization & Summary */}
                <div className="space-y-6">
                    {/* Distribution Pie Chart */}
                    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                            <PieChartIcon size={16} />
                            Proporsi Target Area (Visual)
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
                                    <span className="font-medium text-foreground">{formatNumber(area.target / timeDivisor)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
