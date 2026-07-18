import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '260px', borderRadius: '16px' };

export default function MapView({ lat, lng, markers = [] }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_BROWSER_KEY,
  });

  if (!lat || !lng) {
    return (
      <div className="h-[260px] rounded-2xl bg-card/50 flex items-center justify-center text-slate text-sm">
        Destination location will appear here
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="h-[260px] rounded-2xl bg-card/50 animate-pulse" />;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={{ lat, lng }} zoom={12}
      options={{ disableDefaultUI: true, zoomControl: true, styles: DARK_MAP_STYLE }}>
      <Marker position={{ lat, lng }} />
      {markers.map((m, i) => (
        <Marker key={i} position={{ lat: m.lat, lng: m.lng }} title={m.name} />
      ))}
    </GoogleMap>
  );
}

// Muted dark theme so the embedded map matches the app's navy palette.
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#14283B' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F1B2D' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8FA3B8' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0F1B2D' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1B3A54' }] },
];
