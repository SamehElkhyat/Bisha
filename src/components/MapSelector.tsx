'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Map.module.css';
import { FaMap, FaGlobe, FaLayerGroup, FaSatellite, FaExpand, FaCompress } from 'react-icons/fa';

// Dynamically import maps with no SSR
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '600px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f5f5f5',
      color: '#666'
    }}>
      جاري تحميل الخريطة التفاعلية...
    </div>
  )
});

const GoogleMap = dynamic(() => import('./GoogleMap'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '600px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f5f5f5',
      color: '#666'
    }}>
      جاري تحميل خرائط جوجل...
    </div>
  )
});

interface MapSelectorProps {
  onRegionSelect?: (regionName: string) => void;
  onError?: () => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onRegionSelect, onError }) => {
  const [mapType, setMapType] = useState<'interactive' | 'google'>('interactive');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isGoogleMapsAvailable, setIsGoogleMapsAvailable] = useState(false);

  // Check if Google Maps API key is available
  React.useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    setIsGoogleMapsAvailable(!!apiKey && apiKey !== 'YOUR_API_KEY');
  }, []);

  const handleMapTypeChange = async (newType: 'interactive' | 'google') => {
    if (newType === mapType) return;
    
    setIsTransitioning(true);
    
    // Smooth transition delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setMapType(newType);
    
    // Complete transition
    setTimeout(() => setIsTransitioning(false), 100);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Handle body scroll when in fullscreen
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  // Handle escape key to exit fullscreen
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        document.body.style.overflow = 'unset';
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isFullscreen]);

  return (
    <div className={`${styles.mapSelectorContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* Enhanced Map Type Selector */}
      <div className={styles.mapControlBar}>
        <div className={styles.mapBrandSection}>
          <div className={styles.mapBrandIcon}>
            <FaLayerGroup />
          </div>
          <div className={styles.mapBrandText}>
            <h3>نظام الخرائط التفاعلي</h3>
            <p>غرفة بيشة التجارية الصناعية</p>
          </div>
        </div>

        <div className={styles.mapControlsCenter}>
          <div className={styles.mapTypeToggle}>
            <button
              className={`${styles.mapTypeCard} ${mapType === 'interactive' ? styles.active : ''} ${isTransitioning ? styles.transitioning : ''}`}
              onClick={() => handleMapTypeChange('interactive')}
              disabled={isTransitioning}
            >
              <div className={styles.mapTypeCardIcon}>
                <FaMap />
              </div>
              <div className={styles.mapTypeCardContent}>
                <span className={styles.mapTypeCardTitle}>الخريطة التفاعلية</span>
                <span className={styles.mapTypeCardDesc}>مناطق المملكة</span>
              </div>
              <div className={styles.mapTypeCardIndicator}></div>
            </button>
            
            <button
              className={`${styles.mapTypeCard} ${mapType === 'google' ? styles.active : ''} ${isTransitioning ? styles.transitioning : ''} ${!isGoogleMapsAvailable ? styles.disabled : ''}`}
              onClick={() => isGoogleMapsAvailable ? handleMapTypeChange('google') : null}
              disabled={isTransitioning || !isGoogleMapsAvailable}
              title={!isGoogleMapsAvailable ? 'يتطلب مفتاح Google Maps API' : 'خرائط جوجل'}
            >
              <div className={styles.mapTypeCardIcon}>
                <FaSatellite />
              </div>
              <div className={styles.mapTypeCardContent}>
                <span className={styles.mapTypeCardTitle}>خرائط جوجل</span>
                <span className={styles.mapTypeCardDesc}>
                  {isGoogleMapsAvailable ? 'بيشة التفصيلية' : 'غير متاح'}
                </span>
              </div>
              <div className={styles.mapTypeCardIndicator}></div>
              {!isGoogleMapsAvailable && (
                <div className={styles.disabledOverlay}>
                  <span>🔒</span>
                </div>
              )}
            </button>
          </div>
        </div>

        <div className={styles.mapActionsSection}>
          {!isGoogleMapsAvailable && (
            <div className={styles.setupGuideButton}>
              <button
                className={styles.setupButton}
                onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                title="إعداد Google Maps"
              >
                ⚙️ إعداد
              </button>
            </div>
          )}
          <button
            className={styles.fullscreenButton}
            onClick={toggleFullscreen}
            title={isFullscreen ? 'إغلاق وضع ملء الشاشة' : 'وضع ملء الشاشة'}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Enhanced Map Content */}
      <div className={`${styles.mapContent} ${isTransitioning ? styles.transitioning : ''}`}>
        <div className={styles.mapViewport}>
          {/* Map Status Bar */}
          <div className={styles.mapStatusBar}>
            <div className={styles.mapStatusLeft}>
              <div className={styles.mapStatusIndicator}>
                <div className={`${styles.statusDot} ${styles.active}`}></div>
                <span>{mapType === 'interactive' ? 'الخريطة التفاعلية نشطة' : 'خرائط جوجل نشطة'}</span>
              </div>
            </div>
            <div className={styles.mapStatusRight}>
              <span className={styles.mapDescription}>
                {mapType === 'interactive' 
                  ? 'اضغط على أي منطقة لعرض تفاصيلها والإحصائيات' 
                  : 'استكشف بيشة بتفاصيل عالية الدقة والمعالم المهمة'
                }
              </span>
            </div>
          </div>

          {/* Map Container with Transition */}
          <div className={`${styles.mapContainer} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
            {mapType === 'interactive' ? (
              <div className={styles.mapWrapper}>
                <MapClient onRegionSelect={onRegionSelect} onError={onError} />
              </div>
            ) : (
              <div className={styles.mapWrapper}>
                <GoogleMap onRegionSelect={onRegionSelect} onError={onError} />
              </div>
            )}
          </div>

          {/* Loading Overlay */}
          {isTransitioning && (
            <div className={styles.transitionOverlay}>
              <div className={styles.transitionSpinner}>
                <div className={styles.spinnerRing}></div>
                <div className={styles.spinnerText}>
                  جاري التبديل إلى {mapType === 'interactive' ? 'الخريطة التفاعلية' : 'خرائط جوجل'}...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSelector;
