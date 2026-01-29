import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import {
    TrendingUp,
    Users,
    CreditCard,
    Activity,
    ArrowUpRight,
    TrendingDown,
    Megaphone
} from 'lucide-react';

const achievementData = [
    { name: 'Jan', target: 4000, actual: 2400 },
    { name: 'Feb', target: 3000, actual: 1398 },
    { name: 'Mar', target: 2000, actual: 9800 },
    { name: 'Apr', target: 2780, actual: 3908 },
    { name: 'May', target: 1890, actual: 4800 },
    { name: 'Jun', target: 2390, actual: 3800 },
    { name: 'Jul', target: 3490, actual: 4300 },
    { name: 'Aug', target: 2000, actual: 2400 },
    { name: 'Sep', target: 2780, actual: 3908 },
    { name: 'Oct', target: 1890, actual: 4800 },
    { name: 'Nov', target: 2390, actual: 3800 },
    { name: 'Dec', target: 3490, actual: 4300 },
];

const areaData = [
    { name: 'Jabodetabek', revenue: 95000000, sales: 250 },
    { name: 'Sumut', revenue: 42000000, sales: 115 },
];

const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-6 h-6 text-current`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {change}
                {trend === 'up' ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
            </div>
        </div>
        <div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
            <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
    </div>
);

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1">Monitoring FTTH sales & operational achievement.</p>
                </div>

                {/* Hotnews Widget */}
                <div className="w-full md:w-auto bg-gradient-to-r from-primary to-blue-600 text-white p-1 pr-6 rounded-full flex items-center gap-3 shadow-lg shadow-blue-500/20 max-w-sm">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <Megaphone size={16} />
                    </div>
                    <div className="text-sm font-medium truncate flex-1">
                        🔥 Internet Promo 100Mbps only IDR 200k!
                    </div>
                </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="Rp 1.2B"
                    change="+12.5%"
                    trend="up"
                    icon={CreditCard}
                    color="text-blue-600 bg-blue-600"
                />
                <StatCard
                    title="New Customers"
                    value="342"
                    change="+8.2%"
                    trend="up"
                    icon={Users}
                    color="text-indigo-600 bg-indigo-600"
                />
                <StatCard
                    title="Sales Target"
                    value="85%"
                    change="-2.1%"
                    trend="down"
                    icon={Activity}
                    color="text-amber-600 bg-amber-600"
                />
                <StatCard
                    title="Active Billing"
                    value="2,405"
                    change="+4.3%"
                    trend="up"
                    icon={TrendingUp}
                    color="text-emerald-600 bg-emerald-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-card p-6 rounded-3xl shadow-sm border border-border/50">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Monthly Achievement</h3>
                            <p className="text-sm text-muted-foreground">Target vs Actual Comparison (1 Year)</p>
                        </div>
                        <select className="bg-secondary text-sm p-2 rounded-lg outline-none border-none">
                            <option>General</option>
                            <option>Jabodetabek</option>
                            <option>Sumut</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={achievementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" activeDot={{ r: 6 }} />
                                <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Areas */}
                <div className="bg-card p-6 rounded-3xl shadow-sm border border-border/50">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg text-foreground">Top Areas</h3>
                        <p className="text-sm text-muted-foreground">Revenue contribution by region</p>
                    </div>
                    <div className="space-y-6">
                        {areaData.map((area, idx) => (
                            <div key={area.name}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-sm">{area.name}</span>
                                    <span className="text-sm font-bold text-foreground">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(area.revenue)}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500'][idx]}`}
                                        style={{ width: `${(area.revenue / 60000000) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Sales Person - New Section */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-card p-6 rounded-3xl shadow-sm border border-border/50">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Top Sales Performance</h3>
                            <p className="text-sm text-muted-foreground">Individual target achievement this month</p>
                        </div>
                        <button className="text-sm text-primary font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Andi Saputra', area: 'Jakarta Selatan', target: 50, actual: 65, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi' },
                            { name: 'Budi Hartono', area: 'Medan Kota', target: 45, actual: 50, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
                            { name: 'Citra Kirana', area: 'Bekasi', target: 40, actual: 38, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citra' },
                        ].map((sales, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-secondary/50 rounded-2xl transition-colors">
                                <div className="font-bold text-muted-foreground w-6 text-center">{i + 1}</div>
                                <img src={sales.img} alt={sales.name} className="w-10 h-10 rounded-full bg-secondary" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-foreground">{sales.name}</h4>
                                    <p className="text-xs text-muted-foreground">{sales.area}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-foreground">{sales.actual} / {sales.target}</div>
                                    <div className="text-xs text-green-600 font-medium">{Math.round((sales.actual / sales.target) * 100)}%</div>
                                </div>
                                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden hidden sm:block">
                                    <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min((sales.actual / sales.target) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mini Notification / Alert Panel */}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/25">
                    <h3 className="font-bold text-lg mb-1">System Alerts</h3>
                    <p className="text-blue-100 text-sm mb-6">Important sales notifications.</p>

                    <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-xs font-semibold text-blue-50">Achievement Unlocked</span>
                            </div>
                            <p className="text-sm font-medium">Jabodetabek Area reached 105% Q3 target!</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                                <span className="text-xs font-semibold text-blue-50">Stock Alert</span>
                            </div>
                            <p className="text-sm font-medium">ONT Modem stock running low in Main Warehouse.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
