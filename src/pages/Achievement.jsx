import React, { useState, useEffect } from 'react';
import { useMasterData } from '../context/MasterDataContext';
import { supabase } from '../lib/supabaseClient';
import { formatCurrency } from '../utils/currency';
import { BarChart3, TrendingUp, Users, MapPin } from 'lucide-react';

export default function Achievement() {
    const { subAreas } = useMasterData();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('general'); // general, area, sales

    useEffect(() => {
        fetchAchievementData();
    }, [subAreas]);

    const fetchAchievementData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Prospects (Actual Sales) - Status Activation means 'Sold'
            const { data: prospects, error } = await supabase
                .from('prospects')
                .select('*')
                .eq('status', 'Activation');

            if (error) throw error;

            // 2. Map Data
            // We need to group prospects by subAreaId and match with targets from subAreas table
            // Note: subAreas from context already has updated 'target' and 'occupancy' 
            // IF we reload context. Assuming context is fresh.

            // For now, let's mock the aggregation logic or do client-side aggregation
            const data = subAreas.map(area => {
                const areaSales = prospects.filter(p => p.sub_area_id === area.id);
                const actual = areaSales.length;
                const target = area.target || 0;
                const percentage = target > 0 ? (actual / target) * 100 : 0;

                return {
                    id: area.id,
                    name: area.name,
                    areaId: area.areaId,
                    target,
                    actual,
                    percentage,
                    occupancy: area.occupancy || 0
                };
            });

            setAchievements(data);

        } catch (err) {
            console.error('Error fetching achievement:', err);
        } finally {
            setLoading(false);
        }
    };

    // Calculations
    const totalTarget = achievements.reduce((acc, curr) => acc + (curr.target || 0), 0);
    const totalActual = achievements.reduce((acc, curr) => acc + curr.actual, 0);
    const totalPercentage = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Sales Achievement</h1>
                <p className="text-muted-foreground text-sm">Monitoring real-time sales performance vs targets.</p>
            </div>

            {/* General Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Target</p>
                            <h3 className="text-3xl font-bold">{totalTarget.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Target size={24} />
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Global sales target</div>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Actual</p>
                            <h3 className="text-3xl font-bold">{totalActual.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Confirmed sales (Activation)
                    </div>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Achievement</p>
                            <h3 className={`text-3xl font-bold ${totalPercentage >= 100 ? 'text-green-600' : 'text-orange-500'}`}>
                                {totalPercentage.toFixed(1)}%
                            </h3>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <BarChart3 size={24} />
                        </div>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${totalPercentage >= 100 ? 'bg-green-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex gap-2 border-b border-border pb-1">
                <button
                    onClick={() => setViewMode('general')}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${viewMode === 'general' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    General Overview
                </button>
                <button
                    onClick={() => setViewMode('area')}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${viewMode === 'area' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Per Area / City
                </button>
                {/* Add Sales view later */}
            </div>

            {/* Content per View Mode */}
            {viewMode === 'area' && (
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">City / Region</th>
                                    <th className="px-6 py-4 font-medium text-right">Occupancy</th>
                                    <th className="px-6 py-4 font-medium text-right">Target</th>
                                    <th className="px-6 py-4 font-medium text-right">Actual</th>
                                    <th className="px-6 py-4 font-medium text-right">Achv %</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {achievements.map((item) => (
                                    <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4 font-medium">{item.name}</td>
                                        <td className="px-6 py-4 text-right">{item.occupancy.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">{item.target.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-bold">{item.actual.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold ${item.percentage >= 100 ? 'text-green-600' : item.percentage >= 80 ? 'text-blue-600' : 'text-orange-500'}`}>
                                                {item.percentage.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.percentage >= 100 ? 'bg-green-500' : item.percentage >= 80 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {achievements.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No data available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {viewMode === 'general' && (
                <div className="bg-card p-8 rounded-2xl border border-border text-center">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">Sales Performance Chart</h3>
                    <p className="text-muted-foreground">Visualization coming soon.</p>
                </div>
            )}
        </div>
    );
}

function Target({ size = 20, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}
