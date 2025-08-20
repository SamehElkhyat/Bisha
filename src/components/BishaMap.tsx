'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  GeoJSON, 
  ZoomControl, 
  ScaleControl, 
  LayersControl, 
  Marker, 
  Popup, 
  Tooltip, 
  Circle, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/Map.module.css';

// Fix Leaflet icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon for selected cities
const SelectedIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Map bounds adjuster component
const MapBoundsAdjuster = ({ bounds }: { bounds: L.LatLngBoundsExpression | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds as L.LatLngBoundsExpression);
    }
  }, [bounds, map]);
  
  return null;
};

interface BishaMapProps {
  onRegionSelect: (regionName: string) => void;
}

const BishaMap: React.FC<BishaMapProps> = ({ onRegionSelect }) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [bounds, setBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const geoJsonLayerRef = useRef<any>(null);
  const [cityMarkers, setCityMarkers] = useState<any[]>([]);
  
  useEffect(() => {
    // Fetch GeoJSON data
    fetch('/saudi-regions.json')
      .then(response => response.json())
      .then(data => {
        setGeoJsonData(data);
        
        // Create city markers from the GeoJSON data
        const markers = data.features.map((feature: any) => {
          const coordinates = feature.geometry.coordinates[0];
          // Calculate center point of polygon
          const lat = coordinates.reduce((sum: number, point: number[]) => sum + point[1], 0) / coordinates.length;
          const lng = coordinates.reduce((sum: number, point: number[]) => sum + point[0], 0) / coordinates.length;
          
          return {
            id: feature.properties.id,
            name: feature.properties.name,
            nameEn: feature.properties.nameEn,
            position: [lat, lng],
            population: feature.properties.population,
            description: feature.properties.description
          };
        });
        
        setCityMarkers(markers);
      })
      .catch(error => console.error('Error loading GeoJSON:', error));
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.name) {
      // Add tooltip with region name
      layer.bindTooltip(feature.properties.name, { 
        permanent: false, 
        direction: 'center',
        className: styles.regionLabel
      });
      
      // Add click handler
      layer.on({
        click: () => {
          setSelectedRegion(feature.properties.name);
          onRegionSelect(feature.properties.name);
          
          // Set bounds to zoom to the selected feature
          setBounds(layer.getBounds());
          
          // Reset style for all layers
          if (geoJsonLayerRef.current) {
            geoJsonLayerRef.current.resetStyle();
          }
          
          // Highlight the selected layer
          layer.setStyle({
            fillColor: '#2196F3',
            weight: 3,
            color: '#FFFFFF',
            fillOpacity: 0.6,
            dashArray: ''
          });
        },
        mouseover: (e: any) => {
          if (feature.properties.name !== selectedRegion) {
            layer.setStyle({
              fillColor: '#1976D2',
              fillOpacity: 0.5,
              weight: 3
            });
          }
          layer.bringToFront();
        },
        mouseout: (e: any) => {
          if (feature.properties.name !== selectedRegion) {
            if (geoJsonLayerRef.current) {
              geoJsonLayerRef.current.resetStyle(layer);
            }
          }
        }
      });
    }
  };

  const styleFeature = (feature: any) => {
    return {
      fillColor: feature.properties.name === selectedRegion ? '#2196F3' : '#0A3B5C',
      weight: feature.properties.name === selectedRegion ? 3 : 2,
      opacity: 1,
      color: 'rgba(255, 255, 255, 0.8)',
      dashArray: feature.properties.name === selectedRegion ? '' : '3',
      fillOpacity: feature.properties.name === selectedRegion ? 0.6 : 0.4,
      smoothFactor: 0.5
    };
  };

  const handleMarkerClick = (name: string) => {
    setSelectedRegion(name);
    onRegionSelect(name);
    
    // Find the corresponding feature to set bounds
    if (geoJsonLayerRef.current && geoJsonData) {
      const layers = geoJsonLayerRef.current.getLayers();
      const layer = layers.find((l: any) => 
        l.feature.properties.name === name
      );
      
      if (layer) {
        setBounds(layer.getBounds());
        
        // Reset style for all layers
        geoJsonLayerRef.current.resetStyle();
        
        // Highlight the selected layer
        layer.setStyle({
          fillColor: '#2196F3',
          weight: 3,
          color: '#FFFFFF',
          fillOpacity: 0.6,
          dashArray: ''
        });
      }
    }
  };

  if (!geoJsonData) {
    return <div className={styles.mapLoading}>جاري تحميل الخريطة...</div>;
  }

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={[19.0, 42.5] as L.LatLngExpression}
        zoom={8}
        style={{ height: '600px', width: '100%', direction: 'ltr' }}
        zoomControl={false}
      >
        <MapBoundsAdjuster bounds={bounds} />
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" imperial={false} />
        
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="صور الأقمار الصناعية" checked>
            <TileLayer
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="خريطة الشوارع">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="التضاريس">
            <TileLayer
              attribution='&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>'
              url="https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.Overlay name="أسماء المناطق" checked>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className={styles.overlayTiles}
            />
          </LayersControl.Overlay>
        </LayersControl>
        
        <GeoJSON
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
          ref={geoJsonLayerRef}
        />
        
        {/* Add markers for cities */}
        {cityMarkers.map((city) => (
          <Marker 
            key={city.id} 
            position={city.position as L.LatLngExpression}
            icon={city.name === selectedRegion ? SelectedIcon : DefaultIcon}
            eventHandlers={{
              click: () => handleMarkerClick(city.name)
            }}
          >
            <Tooltip className={styles.cityTooltip} direction="top" offset={[0, -20]} opacity={1} permanent>
              {city.name}
            </Tooltip>
            <Popup>
              <div className={styles.cityPopup}>
                <h3>{city.name} <span>({city.nameEn})</span></h3>
                <p className={styles.cityDescription}>{city.description}</p>
                <div className={styles.cityStats}>
                  <div className={styles.cityStat}>
                    <span className={styles.cityStatLabel}>عدد السكان:</span>
                    <span className={styles.cityStatValue}>{city.population.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  className={styles.selectCityButton}
                  onClick={() => handleMarkerClick(city.name)}
                >
                  عرض الإحصائيات
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Add circles to highlight main cities */}
        {cityMarkers.map((city) => (
          <Circle
            key={`circle-${city.id}`}
            center={city.position as L.LatLngExpression}
            radius={city.population > 400000 ? 5000 : city.population > 100000 ? 3000 : 2000}
            pathOptions={{
              fillColor: city.name === selectedRegion ? '#2196F3' : '#3F51B5',
              fillOpacity: 0.2,
              weight: 1,
              color: 'white'
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default BishaMap;