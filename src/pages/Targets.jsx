import React, { useState } from 'react';
import {
    Target,
    TrendingUp,
    Users,
    Award,
    Map,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal
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
    Pie
} from 'recharts';

// Data Mockup
const salesTeamData = [
    { id: 1, name: 'Andi Saputra', area: 'Jabodetabek', sub_area: 'Jakarta Selatan', target: 50, actual: 65, achieved: 130, status: 'Exceed' },
    { id: 2, name: 'Citra Kirana', area: 'Jabodetabek', sub_area: 'Bekasi', target: 40, actual: 38, achieved: 95, status: 'On Track' },
    { id: 3, name: 'Dodi Permana', area: 'Jabodetabek', sub_area: 'Depok', target: 45, actual: 20, achieved: 44, status: 'Behind' },
    { id: 4, name: 'Budi Hartono', area: 'Sumut', sub_area: 'Medan Kota', target: 45, actual: 50, achieved: 111, status: 'Exceed' },
    { id: 5, name: 'Eka Wijaya', area: 'Sumut', sub_area: 'Binjai', target: 30, actual: 15, achieved: 50, status: 'Behind' },
    { id: 6, name: 'Fani Amalia', area: 'Jabodetabek', sub_area: 'Tangerang', target: 40, actual: 42, achieved: 105, status: 'Exceed' },
];

const areaComparisonData = [
    { name: 'Jabodetabek', target: 500, actual: 420 },
    { name: 'Sumut', target: 200, actual: 185 },
];

const COLORS = ['#3b82f6', '#cbd5e1'];

const ProgressCircle = ({ percentage, color = "text-primary" }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="transform -rotate-90 w-20 h-20">
                <circle
                    className="text-secondary"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="40"
                    cy="40"
                />
                <circle
                    className={color}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="40"
                    cy="40"
                />
            </svg>
            <span className={`absolute text-sm font-bold ${color}`}>{percentage}%</span>
        </div>
    );
};

export default function Targets() {
    const [filterArea, setFilterArea] = useState('All');

    const filteredSales = filterArea === 'All'
        ? salesTeamData
        : salesTeamData.filter(s => s.area === filterArea);

    const totalTarget = filteredSales.reduce((acc, curr) => acc + curr.target, 0);
    const totalActual = filteredSales.reduce((acc, curr) => acc + curr.actual, 0);
    const totalPercentage = Math.round((totalActual / totalTarget) * 100);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Target Achievement</h1>
                    <p className="text-muted-foreground text-sm">Monitoring performa sales dan area (Jabodetabek & Sumut).</p>
                </div>

                <div className="bg-white p-1 rounded-xl shadow-sm border border-border flex gap-1">
                    {['All', 'Jabodetabek', 'Sumut'].map(area => (
                        <button
                            key={area}
                            onClick={() => setFilterArea(area)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterArea === area
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-muted-foreground hover:bg-secondary'
                                }`}
                        >
                            {area}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Achievement Card */}
                <div className="bg-card p-6 rounded-3xl shadow-sm border border-border/50 flex items-center justify-between relative overflow-hidden">
                    <div className="z-10">
                        <p className="text-muted-foreground font-medium text-sm mb-1">Total Achievement</p>
                        <h3 className="text-3xl font-bold text-foreground">{totalPercentage}%</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-green-600 font-medium">
                            <TrendingUp size={16} />
                            <span>{new Intl.NumberFormat('id-ID').format(totalActual)} / {new Intl.NumberFormat('id-ID').format(totalTarget)} Sales</span>
                        </div>
                    </div>
                    <div className="z-10">
                        <ProgressCircle percentage={totalPercentage} />
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                </div>

                {/* Top Performer Card */}
                <div className="bg-card p-6 rounded-3xl shadow-sm border border-border/50 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-muted-foreground font-medium text-sm mb-1">Top Performer</p>
                            <h3 className="text-xl font-bold text-foreground">Andi Saputra</h3>
                            <p className="text-xs text-muted-foreground">Jakarta Selatan</p>
                        </div>
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Award size={24} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-foreground">130% Achieved</span>
                            <span className="text-muted-foreground">65 Sales</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-yellow-500 h-full rounded-full w-[100%]"></div>
                        </div>
                    </div>
                </div>

                {/* Area Comparison */}
                <div className="bg-card p-6 rounded-3xl shadow-sm border border-border/50">
                    <p className="text-muted-foreground font-medium text-sm mb-3">Area vs Target</p>
                    <div className="bg-secondary/30 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                Jabodetabek
                            </div>
                            <span className="text-sm font-bold">84%</span>
                        </div>
                        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mb-4">
                            <div className="bg-primary h-full rounded-full w-[84%]"></div>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                Sumut
                            </div>
                            <span className="text-sm font-bold">92%</span>
                        </div>
                        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full w-[92%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Team Table */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Sales Team Rankings</h3>
                    <button className="text-sm text-primary font-medium hover:underline">Download Report</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Sales Person</th>
                                <th className="px-6 py-4 font-medium">Area</th>
                                <th className="px-6 py-4 font-medium">Target</th>
                                <th className="px-6 py-4 font-medium">Actual</th>
                                <th className="px-6 py-4 font-medium">Achievement</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredSales.map((sales) => (
                                <tr key={sales.id} className="group hover:bg-secondary/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        {sales.name}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {sales.sub_area} <span className="text-xs opacity-70">({sales.area})</span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {sales.target}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-foreground">
                                        {sales.actual}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{sales.achieved}%</span>
                                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${sales.achieved >= 100 ? 'bg-green-500' : sales.achieved >= 80 ? 'bg-primary' : 'bg-red-500'}`}
                                                    style={{ width: `${Math.min(sales.achieved, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${sales.status === 'Exceed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                sales.status === 'On Track' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            {sales.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
