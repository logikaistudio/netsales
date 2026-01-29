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
    ChevronDown,
    Trash2,
    Edit2,
    Calendar,
    Upload,
    PenTool
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
    {
        id: 1,
        name: 'Budi Santoso',
        address: 'Jl. Merdeka No. 10, Surabaya',
        package: 'Home 50Mbps',
        status: 'Activation',
        date: '2025-10-12',
        phones: ['081234567890'],
        emails: ['budi@gmail.com'],
        area: 'Jabodetabek'
    },
    // ... other data can be mapped similarly
];

const packages = ['Home 20Mbps', 'Home 50Mbps', 'Home 100Mbps', 'Bisnis 100Mbps', 'Bisnis 300Mbps'];
const statuses = ['New', 'Survey', 'Installation', 'Activation', 'Billing', 'Churn'];
const areas = ['Jabodetabek', 'Sumut'];
const customerTypes = ['Broadband Home', 'Broadband Business', 'Corporate'];

export default function Prospects() {
    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showStatusMenu, setShowStatusMenu] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        customerType: 'Broadband Home',
        rfsDate: '',
        area: 'Jabodetabek',
        plan: '',
        name: '',
        kabupaten: '',
        kecamatan: '',
        kelurahan: '',
        address: '',
        phones: [],
        emails: [],
        status: 'New'
    });

    const [newPhone, setNewPhone] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const filteredData = data.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                customerType: item.customerType || 'Broadband Home',
                rfsDate: item.date || new Date().toISOString().split('T')[0],
                area: item.area || 'Jabodetabek',
                plan: item.package || '',
                name: item.name || '',
                kabupaten: '',
                kecamatan: '',
                kelurahan: '',
                address: item.address || '',
                phones: item.phones || [item.phone], // fallback
                emails: item.emails || [],
                status: item.status || 'New'
            });
        } else {
            setEditingItem(null);
            setFormData({
                customerType: 'Broadband Home',
                rfsDate: new Date().toISOString().split('T')[0],
                area: 'Jabodetabek',
                plan: '',
                name: '',
                kabupaten: '',
                kecamatan: '',
                kelurahan: '',
                address: '',
                phones: [],
                emails: [],
                status: 'New'
            });
        }
        setShowModal(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const now = new Date().toISOString().split('T')[0];

        const saveData = {
            ...formData,
            id: editingItem ? editingItem.id : Math.max(...data.map(i => i.id || 0), 0) + 1,
            date: formData.rfsDate,
            package: formData.plan,
            phone: formData.phones[0] || '-' // simple fallback for list view
        };

        if (editingItem) {
            setData(data.map(item => item.id === editingItem.id ? saveData : item));
        } else {
            setData([...data, saveData]);
        }
        setShowModal(false);
    };

    const handleStatusChange = (id, newStatus) => {
        setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
        setShowStatusMenu(null);
    };

    const addPhone = () => {
        if (newPhone) {
            setFormData({ ...formData, phones: [...formData.phones, newPhone] });
            setNewPhone('');
        }
    };

    const removePhone = (idx) => {
        setFormData({ ...formData, phones: formData.phones.filter((_, i) => i !== idx) });
    };

    const addEmail = () => {
        if (newEmail) {
            setFormData({ ...formData, emails: [...formData.emails, newEmail] });
            setNewEmail('');
        }
    };

    const removeEmail = (idx) => {
        setFormData({ ...formData, emails: formData.emails.filter((_, i) => i !== idx) });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-screen">
            {/* Header & Filters (Same as before) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Prospects & Sales</h1>
                    <p className="text-muted-foreground text-sm">Manage customer lifecycle from prospect to billing.</p>
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
                        placeholder="Search name, address, or phone..."
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
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Package</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
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
                                                    {item.phones?.[0] || item.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-foreground bg-secondary px-2 py-1 rounded-lg text-xs">
                                                {item.package || item.plan}
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

            {/* Expanded Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-border p-8 animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-orange-500 font-bold text-xl tracking-tight">Wiznet</span>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold mb-8 text-foreground">New Prospect</h2>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Row 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Customer Type <span className="text-red-500">*</span></label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                        value={formData.customerType}
                                        onChange={e => setFormData({ ...formData, customerType: e.target.value })}
                                    >
                                        {customerTypes.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="hidden md:block"></div> {/* Spacer for layout alignment */}
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">RFS Date <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.rfsDate}
                                            onChange={e => setFormData({ ...formData, rfsDate: e.target.value })}
                                        />
                                        <Calendar className="absolute right-3 top-2.5 text-muted-foreground pointer-events-none" size={18} />
                                    </div>
                                </div>
                                <div className="hidden md:block"></div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Area <span className="text-red-500">*</span></label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                        value={formData.area}
                                        onChange={e => setFormData({ ...formData, area: e.target.value })}
                                    >
                                        {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    {/* Swapped order to match image somewhat, or just adjacent columns */}
                                    <label className="text-sm font-medium text-muted-foreground">Plan <span className="text-red-500">*</span></label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                        value={formData.plan}
                                        onChange={e => setFormData({ ...formData, plan: e.target.value })}
                                    >
                                        <option value="">Select plan</option>
                                        {packages.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Location Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">City</label>
                                        <select className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
                                            <option>KOTA CILEGON</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Sub-District/Village</label>
                                        <select className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
                                            <option>Cibeber</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">District</label>
                                        <select className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
                                            <option>Cibeber</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Address <span className="text-red-500">*</span></label>
                                        <textarea
                                            rows={2}
                                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contacts: Phone & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-6">
                                {/* Phone Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-medium text-foreground">Phone</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add phone..."
                                                className="px-2 py-1 text-xs border rounded w-32"
                                                value={newPhone}
                                                onChange={e => setNewPhone(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={addPhone}
                                                className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                                            >
                                                <Plus size={16} /> Add
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3 bg-secondary/30 p-4 rounded-xl">
                                        {formData.phones.length === 0 && <p className="text-xs text-muted-foreground italic">No phones added.</p>}
                                        {formData.phones.map((phone, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                                <span className="text-sm">{phone}</span>
                                                <div className="flex gap-2 text-muted-foreground">
                                                    <button type="button" className="hover:text-primary"><Edit2 size={14} /></button>
                                                    <button type="button" onClick={() => removePhone(idx)} className="hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Email Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-medium text-foreground">Email</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                placeholder="Add email..."
                                                className="px-2 py-1 text-xs border rounded w-32"
                                                value={newEmail}
                                                onChange={e => setNewEmail(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={addEmail}
                                                className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                                            >
                                                <Plus size={16} /> Add
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3 bg-secondary/30 p-4 rounded-xl">
                                        {formData.emails.length === 0 && <p className="text-xs text-muted-foreground italic">No emails added.</p>}
                                        {formData.emails.map((email, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                                <span className="text-sm">{email}</span>
                                                <div className="flex gap-2 text-muted-foreground">
                                                    <button type="button" className="hover:text-primary"><Edit2 size={14} /></button>
                                                    <button type="button" onClick={() => removeEmail(idx)} className="hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Docs & Signature */}
                            <div className="border-t border-border pt-6 space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium text-foreground">Documents (0)</label>
                                        <button type="button" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                                            <Plus size={16} /> Add
                                        </button>
                                    </div>
                                    <div className="h-12 bg-secondary/30 rounded-lg flex items-center justify-center border border-dashed border-border text-xs text-muted-foreground">
                                        No documents uploaded
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium text-foreground">Signature</label>
                                        <button type="button" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                                            <PenTool size={16} /> Open Pad
                                        </button>
                                    </div>
                                    <div className="h-32 bg-secondary/30 rounded-lg flex items-center justify-center border border-dashed border-border">
                                        {/* Signature Placeholder */}
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-muted-foreground/50 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions - Matching the visual hidden save button logic or custom */}
                            <div className="pt-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card z-10">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 rounded-lg border border-border font-medium hover:bg-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all"
                                >
                                    Save Prospect
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
