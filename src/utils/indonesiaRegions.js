/**
 * Indonesia Region Data Utility
 * Data source: https://github.com/cahyadsn/wilayah (Public Domain)
 */

// Simplified data structure for common regions
// In production, you can fetch from API or use full database

export const indonesiaRegions = {
    provinces: [
        { id: 31, name: 'DKI Jakarta' },
        { id: 32, name: 'Jawa Barat' },
        { id: 33, name: 'Jawa Tengah' },
        { id: 34, name: 'DI Yogyakarta' },
        { id: 35, name: 'Jawa Timur' },
        { id: 36, name: 'Banten' },
        // Add more provinces as needed
    ],

    // Jabodetabek cities
    jabodetabekCities: [
        { id: 3171, provinceId: 31, name: 'Jakarta Pusat' },
        { id: 3172, provinceId: 31, name: 'Jakarta Utara' },
        { id: 3173, provinceId: 31, name: 'Jakarta Barat' },
        { id: 3174, provinceId: 31, name: 'Jakarta Selatan' },
        { id: 3175, provinceId: 31, name: 'Jakarta Timur' },
        { id: 3276, provinceId: 32, name: 'Kota Depok' },
        { id: 3603, provinceId: 36, name: 'Kota Tangerang' },
        { id: 3604, provinceId: 36, name: 'Kota Tangerang Selatan' },
        { id: 3275, provinceId: 32, name: 'Kota Bekasi' },
        { id: 3201, provinceId: 32, name: 'Kabupaten Bogor' },
        { id: 3216, provinceId: 32, name: 'Kabupaten Bekasi' },
        { id: 3601, provinceId: 36, name: 'Kabupaten Tangerang' },
    ],

    // Sample districts for major cities
    districts: {
        // Jakarta Selatan
        3174: [
            { id: 317401, name: 'Kebayoran Baru' },
            { id: 317402, name: 'Kebayoran Lama' },
            { id: 317403, name: 'Pesanggrahan' },
            { id: 317404, name: 'Cilandak' },
            { id: 317405, name: 'Pasar Minggu' },
            { id: 317406, name: 'Jagakarsa' },
            { id: 317407, name: 'Mampang Prapatan' },
            { id: 317408, name: 'Pancoran' },
            { id: 317409, name: 'Tebet' },
            { id: 317410, name: 'Setiabudi' },
        ],
        // Jakarta Pusat
        3171: [
            { id: 317101, name: 'Gambir' },
            { id: 317102, name: 'Tanah Abang' },
            { id: 317103, name: 'Menteng' },
            { id: 317104, name: 'Senen' },
            { id: 317105, name: 'Cempaka Putih' },
            { id: 317106, name: 'Johar Baru' },
            { id: 317107, name: 'Kemayoran' },
            { id: 317108, name: 'Sawah Besar' },
        ],
        // Tangerang
        3603: [
            { id: 360301, name: 'Tangerang' },
            { id: 360302, name: 'Jatiuwung' },
            { id: 360303, name: 'Batuceper' },
            { id: 360304, name: 'Benda' },
            { id: 360305, name: 'Cipondoh' },
            { id: 360306, name: 'Ciledug' },
            { id: 360307, name: 'Karawaci' },
            { id: 360308, name: 'Periuk' },
            { id: 360309, name: 'Cibodas' },
            { id: 360310, name: 'Neglasari' },
            { id: 360311, name: 'Pinang' },
            { id: 360312, name: 'Karang Tengah' },
            { id: 360313, name: 'Larangan' },
        ],
        // Tangerang Selatan
        3604: [
            { id: 360401, name: 'Serpong' },
            { id: 360402, name: 'Serpong Utara' },
            { id: 360403, name: 'Pondok Aren' },
            { id: 360404, name: 'Ciputat' },
            { id: 360405, name: 'Ciputat Timur' },
            { id: 360406, name: 'Pamulang' },
            { id: 360407, name: 'Setu' },
        ],
        // Depok
        3276: [
            { id: 327601, name: 'Beji' },
            { id: 327602, name: 'Pancoran Mas' },
            { id: 327603, name: 'Cipayung' },
            { id: 327604, name: 'Sukmajaya' },
            { id: 327605, name: 'Cilodong' },
            { id: 327606, name: 'Cimanggis' },
            { id: 327607, name: 'Sawangan' },
            { id: 327608, name: 'Limo' },
            { id: 327609, name: 'Cinere' },
            { id: 327610, name: 'Tapos' },
            { id: 327611, name: 'Bojongsari' },
        ],
        // Bekasi
        3275: [
            { id: 327501, name: 'Bekasi Timur' },
            { id: 327502, name: 'Bekasi Barat' },
            { id: 327503, name: 'Bekasi Selatan' },
            { id: 327504, name: 'Bekasi Utara' },
            { id: 327505, name: 'Rawalumbu' },
            { id: 327506, name: 'Bantargebang' },
            { id: 327507, name: 'Pondokgede' },
            { id: 327508, name: 'Jatiasih' },
            { id: 327509, name: 'Jatisampurna' },
            { id: 327510, name: 'Mustikajaya' },
            { id: 327511, name: 'Pondok Melati' },
            { id: 327512, name: 'Medan Satria' },
        ],
    }
};

/**
 * Get cities by province/area
 */
export const getCitiesByProvince = (provinceName) => {
    if (provinceName.toLowerCase().includes('jabodetabek')) {
        return indonesiaRegions.jabodetabekCities;
    }

    const province = indonesiaRegions.provinces.find(p =>
        p.name.toLowerCase().includes(provinceName.toLowerCase())
    );

    if (!province) return [];

    // Return cities for that province (you can expand this)
    return indonesiaRegions.jabodetabekCities.filter(c => c.provinceId === province.id);
};

/**
 * Get districts by city
 */
export const getDistrictsByCity = (cityId) => {
    return indonesiaRegions.districts[cityId] || [];
};

/**
 * Search city by name
 */
export const searchCity = (query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return indonesiaRegions.jabodetabekCities.filter(city =>
        city.name.toLowerCase().includes(lowerQuery)
    );
};
