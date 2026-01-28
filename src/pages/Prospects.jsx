import React, { useState } from 'react';
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    X,
    MapPin,
    Phone,
    Package,
    ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const statusColors = {
    New: 'bg-blue-50 text-blue-700 border-blue-200',
    Survey: 'bg-amber-50 text-amber-700 border-amber-200',
    Installation: 'bg-purple-50 text-purple-700 border-purple-200',
    Activation: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Billing: 'bg-green-50 text-green-700 border-green-200',
    Churn: 'bg-red-50 text-red-700 border-red-200',
};

const initialData = [
    { id: 1, name: 'Budi Santoso', address: 'Jl. Merdeka No. 10, Surabaya', package: 'Home 50Mbps', status: 'Activation', date: '2025-10-12', phone: '081234567890' },
    { id: 2, name: 'Siti Aminah', address: 'Perum. Graha Indah Blok A2', package: 'Home 100Mbps', status: 'New', date: '2025-10-14', phone: '081298765432' },
    { id: 3, name: 'PT. Maju Mundur', address: 'Ruko Business Park C5', package: 'Bisnis 300Mbps', status: 'Survey', date: '2025-10-14', phone: '081345678901' },
    { id: 4, name: 'Ahmad Dani', address: 'Jl. Pahlawan 45', package: 'Home 20Mbps', status: 'Billing', date: '2025-09-20', phone: '081987654321' },
    { id: 5, name: 'Cafe Kopi Senja', address: 'Jl. Tunjungan 12', package: 'Bisnis 100Mbps', status: 'Installation', date: '2025-10-13', phone: '081567890123' },
];

const packages = ['Home 20Mbps', 'Home 50Mbps', 'Home 100Mbps', 'Bisnis 100Mbps', 'Bisnis 300Mbps'];
const statuses = ['New', 'Survey', 'Installation', 'Activation', 'Billing', 'Churn'];

export default function Prospects() {
    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showStatusMenu, setShowStatusMenu] = useState(null); // id of current open menu

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        package: 'Home 50Mbps',
        status: 'New'
    });

    const filteredData = data.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phone.includes(searchTerm);
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                phone: '',
                address: '',
                package: 'Home 50Mbps',
                status: 'New'
            });
        }
        setShowModal(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const now = new Date().toISOString().split('T')[0];

        if (editingItem) {
            setData(data.map(item => item.id === editingItem.id ? { ...formData, id: item.id, date: item.date } : item));
        } else {
            const newId = Math.max(...data.map(i => i.id), 0) + 1;
            setData([...data, { ...formData, id: newId, date: now }]);
        }
        setShowModal(false);
    };

    const handleStatusChange = (id, newStatus) => {
        setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
        setShowStatusMenu(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Prospek & Sales</h1>
                    <p className="text-muted-foreground text-sm">Manage lifecycle pelanggan dari prospek hingga billing.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/25"
                >
                    <Plus size={18} />
                    New Prospect
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama, alamat, atau no HP..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                    >
                        <option value="All">All Status</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Kanban / List Board */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-visible">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Pelanggan</th>
                                <th className="px-6 py-4 font-medium">Paket</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Tanggal</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                                        No prospects found to display.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-secondary/30 transition-colors relative">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span
                                                    onClick={() => handleOpenModal(item)}
                                                    className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                                                >
                                                    {item.name}
                                                </span>
                                                <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                                                    <MapPin size={12} />
                                                    {item.address}
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                                                    <Phone size={12} />
                                                    {item.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-foreground bg-secondary px-2 py-1 rounded-lg text-xs">
                                                {item.package}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setShowStatusMenu(showStatusMenu === item.id ? null : item.id)}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-transform active:scale-95",
                                                        statusColors[item.status]
                                                    )}
                                                >
                                                    {item.status}
                                                    <ChevronDown size={12} className="opacity-50" />
                                                </button>

                                                {/* Status Dropdown */}
                                                {showStatusMenu === item.id && (
                                                    <div className="absolute top-full left-0 mt-2 w-40 bg-popover border border-border rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                                                        {statuses.map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusChange(item.id, status)}
                                                                className={cn(
                                                                    "w-full text-left px-4 py-2 text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-2",
                                                                    item.status === status ? "text-primary bg-primary/5" : "text-foreground"
                                                                )}
                                                            >
                                                                <span className={cn("w-2 h-2 rounded-full", statusColors[status].split(' ')[0].replace('bg-', 'bg-').replace('-50', '-500'))}></span>
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {item.date}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Click backdrop for dropdown */}
                {showStatusMenu && (
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowStatusMenu(null)} />
                )}

                {/* Pagination placeholder */}
                <div className="p-4 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground">
                    <span>Displaying {filteredData.length} of {data.length} prospects</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-border rounded-lg hover:bg-secondary disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-border rounded-lg hover:bg-secondary" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold">{editingItem ? 'Edit Prospect' : 'New Prospect'}</h2>
                                <p className="text-sm text-muted-foreground">Fill in the details below.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="e.g. Budi Santoso"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="0812..."
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Package</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        value={formData.package}
                                        onChange={e => setFormData({ ...formData, package: e.target.value })}
                                    >
                                        {packages.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Address</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    placeholder="Complete installation address..."
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-border font-medium hover:bg-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    {editingItem ? 'Save Changes' : 'Create Prospect'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
