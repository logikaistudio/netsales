import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const MasterDataContext = createContext();

export function MasterDataProvider({ children }) {
    const [areas, setAreas] = useState([]);
    const [subAreas, setSubAreas] = useState([]);
    const [salesTeam, setSalesTeam] = useState([]);
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
            const { data: salesData } = await supabase.from('sales_team').select('*').order('id', { ascending: true });

            if (areasData) setAreas(areasData);
            if (subAreasData) setSubAreas(subAreasData.map(s => ({ ...s, areaId: s.area_id }))); // Normalize key
            if (salesData) setSalesTeam(salesData.map(s => ({ ...s, subAreaId: s.sub_area_id }))); // Normalize key
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // CRUD Operations

    const addArea = async (name) => {
        try {
            const { data, error } = await supabase
                .from('areas')
                .insert([{ name }])
                .select()
                .single();

            if (data && !error) {
                setAreas([...areas, data]);
            }
        } catch (error) {
            console.error('Error adding area:', error);
        }
    };

    const deleteArea = async (id) => {
        try {
            const { error } = await supabase.from('areas').delete().eq('id', id);
            if (!error) {
                setAreas(areas.filter(a => a.id !== id));
                setSubAreas(subAreas.filter(s => s.areaId !== id)); // Optimistic UI update
            }
        } catch (error) {
            console.error('Error deleting area:', error);
        }
    };

    const addSubArea = async (areaId, name) => {
        try {
            const { data, error } = await supabase
                .from('sub_areas')
                .insert([{ area_id: areaId, name }])
                .select()
                .single();

            if (data && !error) {
                // Normalize response to match app state structure
                const newSub = { ...data, areaId: data.area_id };
                setSubAreas([...subAreas, newSub]);
            }
        } catch (error) {
            console.error('Error adding sub area:', error);
        }
    };

    const deleteSubArea = async (id) => {
        try {
            const { error } = await supabase.from('sub_areas').delete().eq('id', id);
            if (!error) {
                setSubAreas(subAreas.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Error deleting sub area:', error);
        }
    };

    const addSales = async (name, subAreaId) => {
        try {
            const { data, error } = await supabase
                .from('sales_team')
                .insert([{ name, sub_area_id: subAreaId }])
                .select()
                .single();

            if (data && !error) {
                const newSales = { ...data, subAreaId: data.sub_area_id };
                setSalesTeam([...salesTeam, newSales]);
            }
        } catch (error) {
            console.error('Error adding sales:', error);
        }
    };

    const deleteSales = async (id) => {
        try {
            const { error } = await supabase.from('sales_team').delete().eq('id', id);
            if (!error) {
                setSalesTeam(salesTeam.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Error deleting sales:', error);
        }
    };

    return (
        <MasterDataContext.Provider value={{
            areas, addArea, deleteArea,
            subAreas, addSubArea, deleteSubArea,
            salesTeam, addSales, deleteSales,
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
