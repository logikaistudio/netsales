import React, { useState, useEffect, useMemo } from 'react';
import {
    Target,
    Map,
    Users,
    ChevronRight,
    ChevronDown,
    Save,
    RotateCcw,
    Calendar,
    Briefcase,
    TrendingUp,
    DollarSign,
    PieChart as PieChartIcon,
    BarChart3
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';

// --- Default Data & Constants ---
const DEFAULT_GLOBAL_TARGET = 10000; // Default 10,000 Sales/Year

// Struktur Awal Data Areas
const INITIAL_AREAS = [
    {
        id: 'area-1',
        name: 'Jabodetabek',
        percentage: 60, // 60% of Global
        subAreas: [ // Kecamatan / Sales Leader
            { id: 'sub-1a', name: 'Jakarta Selatan (Andi)', percentage: 30 }, // 30% of Area Target
            { id: 'sub-1b', name: 'Alfamart Bekasi (Citra)', percentage: 25 },
            { id: 'sub-1c', name: 'Depok (Dodi)', percentage: 20 },
            { id: 'sub-1d', name: 'Tangerang (Fani)', percentage: 25 },
        ]
    },
    {
        id: 'area-2',
        name: 'Sumatera Utara',
        percentage: 40, // 40% of Global
        subAreas: [
            { id: 'sub-2a', name: 'Medan Kota (Budi)', percentage: 60 },
            { id: 'sub-2b', name: 'Binjai (Eka)', percentage: 40 },
        ]
    }
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function Targets() {
    // --- State Management ---
    const [globalTarget, setGlobalTarget] = useState(DEFAULT_GLOBAL_TARGET);
    const [areas, setAreas] = useState(INITIAL_AREAS);
    const [selectedTimeframe, setSelectedTimeframe] = useState('yearly'); // yearly, quarterly, monthly, weekly, daily
    const [expandedAreaId, setExpandedAreaId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // --- Derived Calculations ---

    // Total Percentage Check (Global -> Areas)
    const totalAreaPercentage = useMemo(() => areas.reduce((sum, area) => sum + area.percentage, 0), [areas]);
    const isAreaAllocationsValid = totalAreaPercentage === 100;

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

    // --- Handlers ---

    const handleGlobalTargetChange = (e) => {
        const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
        setGlobalTarget(val);
    };

    const updateAreaPercentage = (id, newPct) => {
        setAreas(prev => prev.map(area =>
            area.id === id ? { ...area, percentage: Math.min(100, Math.max(0, newPct)) } : area
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

    const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(Math.round(num));

    // --- Render Components ---

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
                        Atur distribusi target dari level Global hingga Kecamatan/Sales Leader.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white border border-border hover:bg-secondary'
                            }`}
                    >
                        {isEditing ? <Save size={16} /> : <Briefcase size={16} />}
                        {isEditing ? 'Selesai Edit' : 'Mode Edit'}
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
                            <p className="text-sm font-medium text-muted-foreground">Global Target (Tahun)</p>
                            {isEditing ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="text"
                                        value={globalTarget}
                                        onChange={handleGlobalTargetChange}
                                        className="text-3xl font-bold bg-white border border-input rounded-lg px-2 py-1 w-48 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    <span className="text-sm text-muted-foreground">Unit</span>
                                </div>
                            ) : (
                                <h2 className="text-3xl font-bold text-foreground">{formatNumber(globalTarget)} <span className="text-lg font-normal text-muted-foreground">Unit</span></h2>
                            )}
                        </div>
                    </div>

                    {/* Timeframe View */}
                    <div className="w-full md:w-auto flex flex-col items-end">
                        <p className="text-sm text-muted-foreground mb-2">Lihat Pecahan Target:</p>
                        {renderTimeframeTabs()}
                    </div>
                </div>

                {/* Derived Global Stats based on Timeframe */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/50">
                    <div className="bg-secondary/30 p-4 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Target {selectedTimeframe === 'daily' ? 'Hari Ini' : selectedTimeframe === 'weekly' ? 'Minggu Ini' : 'Periode Ini'}</p>
                        <p className="text-xl font-bold text-primary">{formatNumber(globalTarget / timeDivisor)}</p>
                    </div>
                    {areas.map((area, idx) => (
                        <div key={area.id} className="bg-secondary/10 p-4 rounded-xl border border-border/30">
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-xs font-semibold text-muted-foreground">{area.name}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isEditing ? 'bg-white border' : 'bg-secondary'}`}>
                                    {area.percentage}%
                                </span>
                            </div>
                            <p className="text-lg font-bold text-foreground">
                                {formatNumber((globalTarget * (area.percentage / 100)) / timeDivisor)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content: Hierarchy Tree */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Distribution Hierarchy */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Map size={18} className="text-muted-foreground" />
                            Distribusi Area & Wilayah
                        </h3>
                        {!isAreaAllocationsValid && (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md animate-pulse">
                                Total Alokasi: {totalAreaPercentage}% (Harus 100%)
                            </span>
                        )}
                    </div>

                    {areas.map((area) => {
                        const areaTarget = (globalTarget * (area.percentage / 100));
                        const areaTargetPeriod = areaTarget / timeDivisor;
                        const subAreaTotalPct = area.subAreas.reduce((acc, curr) => acc + curr.percentage, 0);
                        const isSubAreaValid = subAreaTotalPct === 100;

                        return (
                            <div key={area.id} className={`bg-card border rounded-xl overflow-hidden transition-all duration-300 ${expandedAreaId === area.id ? 'ring-2 ring-primary/20 shadow-lg' : 'border-border/50 hover:border-primary/30'}`}>
                                {/* Area Header */}
                                <div
                                    className="p-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-transparent to-secondary/10"
                                    onClick={() => toggleAreaExpand(area.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-md transition-transform duration-200 ${expandedAreaId === area.id ? 'bg-primary text-white rotate-90' : 'bg-secondary text-muted-foreground'}`}>
                                            <ChevronRight size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground">{area.name}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                Target: <span className="font-semibold text-primary">{formatNumber(areaTargetPeriod)}</span> / {selectedTimeframe}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
                                        {isEditing && (
                                            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-input shadow-sm">
                                                <span className="text-xs text-muted-foreground font-medium">Alokasi:</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-12 text-right bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                                                    value={area.percentage}
                                                    onChange={(e) => updateAreaPercentage(area.id, parseInt(e.target.value) || 0)}
                                                />
                                                <span className="text-xs text-muted-foreground">%</span>
                                            </div>
                                        )}
                                        {!isEditing && (
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-foreground block">{area.percentage}%</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Kontribusi</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Sub-Area Content */}
                                {expandedAreaId === area.id && (
                                    <div className="border-t border-border/50 bg-secondary/5 p-4 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <h5 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                                                <Users size={14} /> Breakdown per Sales Leader / Kecamatan
                                            </h5>
                                            {!isSubAreaValid && (
                                                <span className="text-[10px] text-red-500 font-medium">Total: {subAreaTotalPct}% (Sesuaikan ke 100%)</span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            {area.subAreas.map((sub) => {
                                                const subTargetPeriod = (areaTarget * (sub.percentage / 100)) / timeDivisor;
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
                            Proporsi Target Area
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
                                        dataKey="percentage"
                                        stroke="none"
                                    >
                                        {areas.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => `${value}%`}
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
                                <span className="text-muted-foreground">Global Target</span>
                                <span className="font-bold">{formatNumber(globalTarget / timeDivisor)}</span>
                            </div>
                            <div className="h-px bg-primary/20 my-2" />
                            {areas.map(area => (
                                <div key={area.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{area.name}</span>
                                    <span className="font-medium">{formatNumber((globalTarget * (area.percentage / 100)) / timeDivisor)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
