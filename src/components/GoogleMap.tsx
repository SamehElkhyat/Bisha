'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Map.module.css';

// Declare google as a global variable for TypeScript
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface GoogleMapProps {
  onRegionSelect?: (regionName: string) => void;
  onError?: () => void;
  height?: string;
  width?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  onRegionSelect, 
  onError, 
  height = '100%', 
  width = '100%' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Bisha coordinates from the Google Maps URL you provided
  const BISHA_COORDINATES = {
    lat: 19.9763524,
    lng: 42.5901672
  };

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => setIsLoaded(true));
        existingScript.addEventListener('error', () => {
          setLoadError('فشل في تحميل خرائط جوجل');
          if (onError) onError();
        });
        return;
      }

      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        setLoadError('مفتاح Google Maps API غير متوفر. يرجى إضافة المفتاح في متغيرات البيئة.');
        if (onError) onError();
        return;
      }

      // Create and load the script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&language=ar&region=SA`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
      };
      
      script.onerror = () => {
        setLoadError('فشل في تحميل خرائط جوجل');
        if (onError) onError();
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [onError]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return;

    try {
      // Create map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: BISHA_COORDINATES,
        zoom: 12,
        mapTypeId: window.google.maps.MapTypeId.HYBRID, // Satellite view with labels
        styles: [
          {
            featureType: "administrative",
            elementType: "labels.text",
            stylers: [
              { visibility: "on" },
              { color: "#ffffff" }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels.text",
            stylers: [
              { visibility: "on" },
              { color: "#ffffff" }
            ]
          }
        ],
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        scaleControl: true,
        rotateControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_CENTER,
          mapTypeIds: [
            window.google.maps.MapTypeId.ROADMAP,
            window.google.maps.MapTypeId.SATELLITE,
            window.google.maps.MapTypeId.HYBRID,
            window.google.maps.MapTypeId.TERRAIN
          ]
        }
      });

      mapInstanceRef.current = map;

      // Add marker for Bisha
      const bishaMarker = new window.google.maps.Marker({
        position: BISHA_COORDINATES,
        map: map,
        title: 'بيشة',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      // Add info window for Bisha
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 10px 0; color: #1976d2;">بيشة</h3>
            <p style="margin: 0 0 5px 0;">منطقة عسير، المملكة العربية السعودية</p>
            <p style="margin: 0; color: #666; font-size: 12px;">
              الإحداثيات: ${BISHA_COORDINATES.lat.toFixed(6)}, ${BISHA_COORDINATES.lng.toFixed(6)}
            </p>
          </div>
        `
      });

      // Show info window by default
      infoWindow.open(map, bishaMarker);

      // Add click listener to marker
      bishaMarker.addListener('click', () => {
        infoWindow.open(map, bishaMarker);
        if (onRegionSelect) {
          onRegionSelect('بيشة');
        }
      });

      // Add some important places in Bisha
      const bishaPlaces = [
        {
          name: 'غرفة بيشة التجارية الصناعية',
          position: { lat: 19.9763524, lng: 42.5901672 },
          type: 'chamber'
        },
        {
          name: 'مطار بيشة الإقليمي',
          position: { lat: 19.9844, lng: 42.6218 },
          type: 'airport'
        },
        {
          name: 'جامعة بيشة',
          position: { lat: 19.9950, lng: 42.6100 },
          type: 'university'
        },
        {
          name: 'مستشفى الملك عبدالله',
          position: { lat: 19.9800, lng: 42.5950 },
          type: 'hospital'
        }
      ];

      // Add markers for important places
      bishaPlaces.forEach(place => {
        let iconUrl = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        
        switch (place.type) {
          case 'chamber':
            iconUrl = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
            break;
          case 'airport':
            iconUrl = 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            break;
          case 'university':
            iconUrl = 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png';
            break;
          case 'hospital':
            iconUrl = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
            break;
        }

        const marker = new window.google.maps.Marker({
          position: place.position,
          map: map,
          title: place.name,
          icon: {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(24, 24)
          }
        });

        const placeInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 5px 0; color: #1976d2;">${place.name}</h4>
              <p style="margin: 0; color: #666; font-size: 12px;">
                ${place.position.lat.toFixed(6)}, ${place.position.lng.toFixed(6)}
              </p>
            </div>
          `
        });

        marker.addListener('click', () => {
          placeInfoWindow.open(map, marker);
        });
      });

      // Add circle to highlight Bisha area
      const cityCircle = new window.google.maps.Circle({
        strokeColor: '#1976d2',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#1976d2',
        fillOpacity: 0.2,
        map: map,
        center: BISHA_COORDINATES,
        radius: 5000 // 5km radius
      });

      console.log('Google Map initialized successfully');

    } catch (error) {
      console.error('Error initializing Google Map:', error);
      setLoadError('فشل في تهيئة الخريطة');
      if (onError) onError();
    }
  }, [isLoaded, onRegionSelect, onError]);

  if (loadError) {
    return (
      <div className={styles.mapError}>
        <div className={styles.mapErrorContent}>
          <h3>خطأ في تحميل خرائط جوجل</h3>
          <p>{loadError}</p>
          {loadError.includes('مفتاح') && (
            <div className={styles.setupInstructions}>
              <h4>لإعداد خرائط جوجل:</h4>
              <ol style={{ textAlign: 'right', margin: '1rem 0' }}>
                <li>احصل على مفتاح API من Google Cloud Console</li>
                <li>أضف المفتاح في ملف .env.local:</li>
                <code style={{ display: 'block', background: '#f5f5f5', padding: '0.5rem', margin: '0.5rem 0', borderRadius: '4px' }}>
                  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
                </code>
                <li>أعد تشغيل الخادم</li>
              </ol>
            </div>
          )}
          <button 
            className={styles.mapRetryButton}
            onClick={() => {
              setLoadError(null);
              setIsLoaded(false);
              window.location.reload();
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={styles.mapWrapper}>
        <div 
          style={{ 
            height, 
            width, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#f5f5f5',
            color: '#666',
            fontSize: '16px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #ddd', 
              borderTop: '4px solid #1976d2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            جاري تحميل الخريطة...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapWrapper}>
      <div 
        ref={mapRef}
        style={{ height, width, direction: 'ltr' }}
      />
    </div>
  );
};

export default GoogleMap;
