# Google Maps Integration Setup

## Overview
The application now includes Google Maps integration alongside the existing interactive Leaflet map. Users can switch between two map types:

1. **Interactive Map** - Custom Leaflet-based map showing Saudi regions
2. **Google Maps** - Detailed satellite/street view of Bisha region

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain (optional but recommended)

### 2. Configure Environment Variables

Add your Google Maps API key to your environment variables:

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Features Included

#### Google Maps Component
- **Location**: Centered on Bisha (بيشة) coordinates from your provided link
- **View Types**: Satellite, Street, Hybrid, Terrain
- **Markers**: Important locations in Bisha
  - Bisha Chamber of Commerce (green marker)
  - Bisha Regional Airport (yellow marker)
  - University of Bisha (purple marker)
  - King Abdullah Hospital (red marker)
- **Interactive Elements**:
  - Info windows with Arabic text
  - 5km radius circle highlighting Bisha area
  - Clickable markers with location details

#### Map Selector Component
- **Toggle Button**: Switch between map types
- **Active Indicators**: Visual feedback for current map type
- **Responsive Design**: Mobile-friendly interface

### 4. File Structure

```
src/
├── components/
│   ├── GoogleMap.tsx          # Google Maps implementation
│   ├── MapSelector.tsx        # Map type switcher
│   └── MapClient.tsx          # Existing Leaflet map
├── styles/
│   └── Map.module.css         # Updated with new styles
└── app/
    └── page.tsx               # Updated to use MapSelector
```

### 5. Coordinates Used

Based on your Google Maps link, the following coordinates are used:
- **Bisha Center**: 19.9763524, 42.5901672
- **Zoom Level**: 12 (good detail level for city view)
- **Map Type**: Hybrid (satellite with labels)

### 6. Customization Options

You can modify the following in `GoogleMap.tsx`:
- **Markers**: Add/remove important locations
- **Styling**: Customize map appearance
- **Info Windows**: Update content and design
- **Circle Radius**: Adjust the highlight area size

### 7. Error Handling

The component includes:
- Loading states with Arabic text
- Error handling for API failures
- Fallback options if Google Maps fails to load
- Retry functionality

### 8. Mobile Responsiveness

The map selector automatically adapts to mobile screens:
- Stacked button layout on small screens
- Touch-friendly controls
- Responsive map sizing

## Usage

Once set up, users will see a toggle interface above the map allowing them to switch between:
1. **الخريطة التفاعلية** (Interactive Map) - Your existing regional map
2. **خرائط جوجل** (Google Maps) - Detailed Bisha satellite view

The Google Maps view will show the exact area from your provided link with additional markers for important locations in Bisha.
