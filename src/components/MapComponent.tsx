import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icons
const hauntedIcon = new L.Icon({
  iconUrl: '/marker-ghost.png',
  iconRetinaUrl: '/marker-ghost-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const pumpkinIcon = new L.Icon({
  iconUrl: '/marker-pumpkin.png',
  iconRetinaUrl: '/marker-pumpkin-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const costumeIcon = new L.Icon({
  iconUrl: '/marker-mask.png',
  iconRetinaUrl: '/marker-mask-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const getEventIcon = (title: string) => {
  if (title.includes('Haunted')) return hauntedIcon;
  if (title.includes('Pumpkin')) return pumpkinIcon;
  if (title.includes('Costume')) return costumeIcon;
  return new L.Icon.Default();
};

interface MapComponentProps {
  events: {
    title: string;
    location: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }[];
}

export default function MapComponent({ events }: MapComponentProps) {
  const center = [
    events.reduce((sum, e) => sum + e.coordinates.lat, 0) / events.length,
    events.reduce((sum, e) => sum + e.coordinates.lng, 0) / events.length
  ];

  return (
    <MapContainer 
      center={center as [number, number]} 
      zoom={15} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.coordinates.lat, event.coordinates.lng]}
          icon={getEventIcon(event.title)}
        >
          <Popup>
            <b>{event.title}</b><br />
            {event.location}<br />
            {event.date} at {event.time}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}