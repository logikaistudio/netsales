import React, { createContext, useContext, useState, useEffect } from 'react';

const MasterDataContext = createContext();

// Initial Data Seeds
const INITIAL_AREAS = [
    { id: 'area-1', name: 'Jabodetabek' },
    { id: 'area-2', name: 'Sumatera Utara' }
];

const INITIAL_SUB_AREAS = [
    { id: 'sub-1a', areaId: 'area-1', name: 'Jakarta Selatan' },
    { id: 'sub-1b', areaId: 'area-1', name: 'Bekasi' },
    { id: 'sub-1c', areaId: 'area-1', name: 'Depok' },
    { id: 'sub-1d', areaId: 'area-1', name: 'Tangerang' },
    { id: 'sub-2a', areaId: 'area-2', name: 'Medan Kota' },
    { id: 'sub-2b', areaId: 'area-2', name: 'Binjai' }
];

const INITIAL_SALES_TEAM = [
    { id: 'sales-1', name: 'Andi Saputra', subAreaId: 'sub-1a' },
    { id: 'sales-2', name: 'Citra Kirana', subAreaId: 'sub-1b' },
    { id: 'sales-3', name: 'Dodi Permana', subAreaId: 'sub-1c' },
    { id: 'sales-4', name: 'Fani Amalia', subAreaId: 'sub-1d' },
    { id: 'sales-5', name: 'Budi Hartono', subAreaId: 'sub-2a' },
    { id: 'sales-6', name: 'Eka Wijaya', subAreaId: 'sub-2b' }
];

export function MasterDataProvider({ children }) {
    // Load from localStorage or use initial data
    const [areas, setAreas] = useState(() => {
        const saved = localStorage.getItem('master_areas');
        return saved ? JSON.parse(saved) : INITIAL_AREAS;
    });

    const [subAreas, setSubAreas] = useState(() => {
        const saved = localStorage.getItem('master_subAreas');
        return saved ? JSON.parse(saved) : INITIAL_SUB_AREAS;
    });

    const [salesTeam, setSalesTeam] = useState(() => {
        const saved = localStorage.getItem('master_salesTeam');
        return saved ? JSON.parse(saved) : INITIAL_SALES_TEAM;
    });

    // Persist to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('master_areas', JSON.stringify(areas));
    }, [areas]);

    useEffect(() => {
        localStorage.setItem('master_subAreas', JSON.stringify(subAreas));
    }, [subAreas]);

    useEffect(() => {
        localStorage.setItem('master_salesTeam', JSON.stringify(salesTeam));
    }, [salesTeam]);

    // CRUD Operations
    const addArea = (name) => {
        const newArea = { id: `area-${Date.now()}`, name };
        setAreas([...areas, newArea]);
    };

    const deleteArea = (id) => {
        setAreas(areas.filter(a => a.id !== id));
        // Cleanup dependent subareas
        setSubAreas(subAreas.filter(s => s.areaId !== id));
    };

    const addSubArea = (areaId, name) => {
        const newSub = { id: `sub-${Date.now()}`, areaId, name };
        setSubAreas([...subAreas, newSub]);
    };

    const deleteSubArea = (id) => {
        setSubAreas(subAreas.filter(s => s.id !== id));
    };

    const addSales = (name, subAreaId) => {
        const newSales = { id: `sales-${Date.now()}`, name, subAreaId };
        setSalesTeam([...salesTeam, newSales]);
    };

    const deleteSales = (id) => {
        setSalesTeam(salesTeam.filter(s => s.id !== id));
    };

    return (
        <MasterDataContext.Provider value={{
            areas, addArea, deleteArea,
            subAreas, addSubArea, deleteSubArea,
            salesTeam, addSales, deleteSales // exposing salesTeam although not strictly requested for target allocation yet, good specific practice
        }}>
            {children}
        </MasterDataContext.Provider>
    );
}

export function useMasterData() {
    return useContext(MasterDataContext);
}
