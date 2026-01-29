import React, { useState, useEffect } from 'react';
import { useMasterData } from '../context/MasterDataContext';
import { formatCurrency } from '../utils/currency';
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
    PenTool,
    UserCircle
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
    const {
        areas: masterAreas,
        subAreas: masterSubAreas,
        districts: masterDistricts,
        products: masterProducts,
        salesTeam: masterSales
    } = useMasterData();

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

        // Master Data IDs
        areaId: '',
        subAreaId: '', // City
        districtId: '', // Kecamatan
        productId: '',
        salesId: '',

        name: '',
        nik: '', // New KTP
        address: '',
        latitude: '', // New
        longitude: '', // New

        phones: [],
        emails: [],
        status: 'New'
    });

    const [newPhone, setNewPhone] = useState('');
    const [newEmail, setNewEmail] = useState('');

    // --- Derived Data for Dropdowns ---
    // Debug Filter Logic
    // console.log('Filtering Districts for SubArea:', formData.subAreaId, 'Full List:', masterDistricts.length);

    const filteredSubAreas = masterSubAreas.filter(s => s.areaId == formData.areaId);
    const filteredDistricts = masterDistricts.filter(d => d.subAreaId == formData.subAreaId);
    const filteredSales = masterSales.filter(s => s.subAreaId == formData.subAreaId);

    // console.log('Filtered Districts:', filteredDistricts.length);

    const filteredData = data.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            // logic to reverse-map names to IDs would be needed if we stored names in 'initialData'.
            // For now, allow partial fill or default.
            setFormData({
                customerType: item.customerType || 'Broadband Home',
                rfsDate: item.date || new Date().toISOString().split('T')[0],
                areaId: item.areaId || '',
                subAreaId: item.subAreaId || '',
                districtId: item.districtId || '',
                productId: item.productId || '',
                salesId: item.salesId || '',
                name: item.name || '',
                nik: item.nik || '',
                address: item.address || '',
                latitude: item.latitude || '',
                longitude: item.longitude || '',
                phones: item.phones || [item.phone],
                emails: item.emails || [],
                status: item.status || 'New'
            });
        } else {
            setEditingItem(null);
            setFormData({
                customerType: 'Broadband Home',
                rfsDate: new Date().toISOString().split('T')[0],
                areaId: masterAreas.length > 0 ? masterAreas[0].id : '',
                subAreaId: '',
                districtId: '',
                productId: '',
                salesId: '',
                name: '',
                nik: '',
                address: '',
                latitude: '',
                longitude: '',
                phones: [],
                emails: [],
                status: 'New'
            });
        }
        setShowModal(true);
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Find names for display in table
        const productObj = masterProducts.find(p => p.id == formData.productId);
        const areaObj = masterAreas.find(a => a.id == formData.areaId);

        const saveData = {
            ...formData,
            id: editingItem ? editingItem.id : Math.max(...data.map(i => i.id || 0), 0) + 1,
            date: formData.rfsDate,
            package: productObj ? productObj.name : formData.productId, // Fallback
            area: areaObj ? areaObj.name : '-',
            phone: formData.phones[0] || '-'
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
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Prospects & Sales</h1>
                    <p className="text-muted-foreground text-sm">Manage customer lifecycle and sales pipeline.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary/25"
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

            {/* List Board */}
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
                                        No prospects found.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-secondary/30 transition-colors relative">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span onClick={() => handleOpenModal(item)} className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">{item.name}</span>
                                                <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5"><MapPin size={12} /> {item.address}</div>
                                                <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5"><Phone size={12} /> {item.phones?.[0] || item.phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-foreground bg-secondary px-2 py-1 rounded-lg text-xs">{item.package || item.plan}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setShowStatusMenu(showStatusMenu === item.id ? null : item.id)}
                                                    className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-transform active:scale-95", statusColors[item.status])}
                                                >
                                                    {item.status} <ChevronDown size={12} className="opacity-50" />
                                                </button>
                                                {showStatusMenu === item.id && (
                                                    <div className="absolute top-full left-0 mt-2 w-40 bg-popover border border-border rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                                                        {statuses.map((status) => (
                                                            <button key={status} onClick={() => handleStatusChange(item.id, status)} className={cn("w-full text-left px-4 py-2 text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-2", item.status === status ? "text-primary bg-primary/5" : "text-foreground")}>
                                                                <span className={cn("w-2 h-2 rounded-full", statusColors[status].split(' ')[0].replace('bg-', 'bg-').replace('-50', '-500'))}></span>
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{item.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleOpenModal(item)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal size={18} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Placeholder */}
                <div className="p-4 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground">
                    <span>Displaying {filteredData.length} of {data.length} records</span>
                </div>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-border p-8 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-foreground">
                                {editingItem ? 'Edit Prospect' : 'New Prospect Enrollment'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-secondary rounded-full text-muted-foreground"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-8">

                            {/* Section 1: Service Location */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                                    <MapPin size={16} /> Service Location & Assignment
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Area Region</label>
                                        <select
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.areaId}
                                            onChange={(e) => {
                                                setFormData({ ...formData, areaId: e.target.value, subAreaId: '', districtId: '', salesId: '' });
                                            }}
                                        >
                                            <option value="">Select Area...</option>
                                            {masterAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">City / Kota</label>
                                        <select
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.subAreaId}
                                            disabled={!formData.areaId}
                                            onChange={(e) => {
                                                setFormData({ ...formData, subAreaId: e.target.value, districtId: '' });
                                            }}
                                        >
                                            <option value="">Select City...</option>
                                            {filteredSubAreas.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">District / Kecamatan</label>
                                        <select
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.districtId}
                                            disabled={!formData.subAreaId}
                                            onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                                        >
                                            <option value="">Select District...</option>
                                            {filteredDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                            {filteredDistricts.length === 0 && <option value="manual">Manual Entry (Not Found)</option>}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Sales Person</label>
                                        <select
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.salesId}
                                            onChange={(e) => setFormData({ ...formData, salesId: e.target.value })}
                                        >
                                            <option value="">Select Sales...</option>
                                            {filteredSales.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            {filteredSales.length === 0 && <option disabled>No sales in this city</option>}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Product Package</label>
                                        <select
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.productId}
                                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                        >
                                            <option value="">Select Package...</option>
                                            {masterProducts.map(p => <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.price)}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Customer Identity */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                                    <UserCircle size={16} /> Identity & Location
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">NIK / KTP No.</label>
                                        <input
                                            type="text"
                                            placeholder="16 digits"
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.nik}
                                            onChange={e => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                                            maxLength={16}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Full Address <span className="text-red-500">*</span></label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Latitude</label>
                                        <input
                                            type="text"
                                            placeholder="-6.2088"
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.latitude}
                                            onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Longitude</label>
                                        <input
                                            type="text"
                                            placeholder="106.8456"
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                            value={formData.longitude}
                                            onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Document Uploads */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                                    <Upload size={16} /> Document Uploads
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* KTP Photo */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Foto KTP (JPEG/PDF)</label>
                                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-secondary/50 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,application/pdf"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => console.log('KTP File:', e.target.files[0])}
                                            />
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                                    <Upload size={20} />
                                                </div>
                                                <span className="text-xs text-muted-foreground">Click to upload KTP</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Photo */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Foto Lokasi (JPEG)</label>
                                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-secondary/50 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => console.log('Location File:', e.target.files[0])}
                                            />
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                                    <MapPin size={20} />
                                                </div>
                                                <span className="text-xs text-muted-foreground">Click to upload Location</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* House Photos (Multiple) */}
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Foto Rumah (Max 3 Foto)</label>
                                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/jpeg,image/png"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => console.log('House Files:', e.target.files)}
                                            />
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                                    <Upload size={24} />
                                                </div>
                                                <span className="text-sm text-foreground font-medium">Click to upload House Photos</span>
                                                <span className="text-xs text-muted-foreground">Supports JPEG, PNG</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Contacts */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                                    <Phone size={16} /> Contacts
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Phones */}
                                    <div>
                                        <div className="flex gap-2 mb-3">
                                            <input type="text" placeholder="Add phone..." className="px-2 py-1 text-sm border rounded w-full" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
                                            <button type="button" onClick={addPhone} className="px-3 py-1 bg-secondary rounded text-xs hover:bg-secondary/80">Add</button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.phones.map((p, i) => (
                                                <div key={i} className="flex justify-between items-center bg-secondary/20 p-2 rounded text-sm">
                                                    <span>{p}</span>
                                                    <button type="button" onClick={() => removePhone(i)} className="text-red-500 hover:text-red-700 px-2"><Trash2 size={12} /></button>
                                                </div>
                                            ))}
                                            {formData.phones.length === 0 && <p className="text-xs text-muted-foreground">No phones yet.</p>}
                                        </div>
                                    </div>
                                    {/* Emails */}
                                    <div>
                                        <div className="flex gap-2 mb-3">
                                            <input type="email" placeholder="Add email..." className="px-2 py-1 text-sm border rounded w-full" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                                            <button type="button" onClick={addEmail} className="px-3 py-1 bg-secondary rounded text-xs hover:bg-secondary/80">Add</button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.emails.map((e, i) => (
                                                <div key={i} className="flex justify-between items-center bg-secondary/20 p-2 rounded text-sm">
                                                    <span>{e}</span>
                                                    <button type="button" onClick={() => removeEmail(i)} className="text-red-500 hover:text-red-700 px-2"><Trash2 size={12} /></button>
                                                </div>
                                            ))}
                                            {formData.emails.length === 0 && <p className="text-xs text-muted-foreground">No emails yet.</p>}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="pt-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card z-10 pb-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-lg border border-border font-medium hover:bg-secondary transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all">Save Prospect</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
