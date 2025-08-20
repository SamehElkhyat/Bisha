'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import mapStyles from '../styles/Map.module.css';

// Import RegionStats directly since it doesn't use browser-specific APIs
import RegionStats from './RegionStats';

// Dynamically import BishaMap with no SSR to avoid Leaflet issues
const BishaMap = dynamic(() => import('./BishaMap'), {
  ssr: false,
  loading: () => <div className={mapStyles.mapLoading}>جاري تحميل الخريطة...</div>
});

const MapClient = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionData, setRegionData] = useState<any>({});
  
  useEffect(() => {
    // Fetch GeoJSON data to get region data
    fetch('/saudi-regions.json')
      .then(response => response.json())
      .then(data => {
        const regions: any = {};
        data.features.forEach((feature: any) => {
          regions[feature.properties.name] = {
            males: feature.properties.males,
            females: feature.properties.females,
            schools: feature.properties.schools,
            houses: feature.properties.houses,
            subscribers: feature.properties.subscribers,
            factories: feature.properties.factories,
            population: feature.properties.population,
            area: feature.properties.area,
            nameEn: feature.properties.nameEn
          };
        });
        setRegionData(regions);
      })
      .catch(error => console.error('Error loading region data:', error));
  }, []);

  return (
    <div className={mapStyles.mapContainer}>
      <BishaMap onRegionSelect={setSelectedRegion} />
      <RegionStats selectedRegion={selectedRegion} regionData={regionData} />
    </div>
  );
};

export default MapClient;