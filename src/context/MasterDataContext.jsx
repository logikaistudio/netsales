import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const MasterDataContext = createContext();

export function MasterDataProvider({ children }) {
    const [areas, setAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [salesTeam, setSalesTeam] = useState([]);
    const [products, setProducts] = useState([]);
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch initial data
    useEffect(() => {
        fetchMasterData();
    }, []);

    const fetchMasterData = async () => {
        setLoading(true);
        try {
            const { data: areasData } = await supabase.from('areas').select('*').order('id', { ascending: true });
            const { data: subAreasData } = await supabase.from('sub_areas').select('*').order('id', { ascending: true });
            const { data: districtsData } = await supabase.from('districts').select('*').order('id', { ascending: true }); // New table
            const { data: salesData } = await supabase.from('sales_team').select('*').order('id', { ascending: true });
            const { data: productsData } = await supabase.from('products').select('*').order('id', { ascending: true });
            const { data: promosData } = await supabase.from('promos').select('*').order('id', { ascending: true });

            if (areasData) setAreas(areasData);
            if (subAreasData) setSubAreas(subAreasData.map(s => ({ ...s, areaId: s.area_id })));
            if (districtsData) setDistricts(districtsData.map(d => ({ ...d, subAreaId: d.sub_area_id })));
            if (salesData) setSalesTeam(salesData.map(s => ({ ...s, subAreaId: s.sub_area_id })));
            if (productsData) setProducts(productsData);
            if (promosData) setPromos(promosData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // CRUD Operations

    const addArea = async (name) => {
        try {
            const { data, error } = await supabase.from('areas').insert([{ name }]).select().single();
            if (data && !error) setAreas([...areas, data]);
        } catch (error) { console.error('Error adding area:', error); }
    };

    const deleteArea = async (id) => {
        try {
            const { error } = await supabase.from('areas').delete().eq('id', id);
            if (!error) {
                setAreas(areas.filter(a => a.id !== id));
                setSubAreas(subAreas.filter(s => s.areaId !== id));
            }
        } catch (error) { console.error('Error deleting area:', error); }
    };

    const addSubArea = async (areaId, name) => {
        try {
            const { data, error } = await supabase.from('sub_areas').insert([{ area_id: areaId, name }]).select().single();
            if (data && !error) setSubAreas([...subAreas, { ...data, areaId: data.area_id }]);
        } catch (error) { console.error('Error adding sub area:', error); }
    };

    const deleteSubArea = async (id) => {
        try {
            const { error } = await supabase.from('sub_areas').delete().eq('id', id);
            if (!error) setSubAreas(subAreas.filter(s => s.id !== id));
        } catch (error) { console.error('Error deleting sub area:', error); }
    };

    const addSales = async (name, subAreaId, nip, phone) => {
        try {
            const { data, error } = await supabase.from('sales_team').insert([{ name, sub_area_id: subAreaId, nip, phone }]).select().single();
            if (data && !error) setSalesTeam([...salesTeam, { ...data, subAreaId: data.sub_area_id }]);
        } catch (error) { console.error('Error adding sales:', error); }
    };

    const deleteSales = async (id) => {
        try {
            const { error } = await supabase.from('sales_team').delete().eq('id', id);
            if (!error) setSalesTeam(salesTeam.filter(s => s.id !== id));
        } catch (error) { console.error('Error deleting sales:', error); }
    };

    const addProduct = async (name, price, cogs) => {
        try {
            const { data, error } = await supabase.from('products').insert([{ name, price, cogs }]).select().single();
            if (data && !error) setProducts([...products, data]);
        } catch (error) { console.error('Error adding product:', error); }
    };

    const deleteProduct = async (id) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (!error) setProducts(products.filter(p => p.id !== id));
        } catch (error) { console.error('Error deleting product:', error); }
    };

    const addPromo = async (name, price, discount) => {
        try {
            const { data, error } = await supabase.from('promos').insert([{ name, price, discount }]).select().single();
            if (data && !error) setPromos([...promos, data]);
        } catch (error) { console.error('Error adding promo:', error); }
    };

    const deletePromo = async (id) => {
        try {
            const { error } = await supabase.from('promos').delete().eq('id', id);
            if (!error) setPromos(promos.filter(p => p.id !== id));
        } catch (error) { console.error('Error deleting promo:', error); }
    };

    return (
        <MasterDataContext.Provider value={{
            areas, addArea, deleteArea,
            subAreas, addSubArea, deleteSubArea,
            districts,
            salesTeam, addSales, deleteSales,
            products, addProduct, deleteProduct,
            promos, addPromo, deletePromo,
            loading,
            refreshData: fetchMasterData
        }}>
            {children}
        </MasterDataContext.Provider>
    );
}

export function useMasterData() {
    return useContext(MasterDataContext);
}
