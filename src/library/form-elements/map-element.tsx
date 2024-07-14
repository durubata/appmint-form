import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icon
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const MapElement = () => {
  const center: any = [51.505, -0.09]; // London coordinates
  const zoom = 13;

  const listings = [
    { id: 1, position: [51.505, -0.09], title: "Cozy Apartment", price: "$1000/month" },
    { id: 2, position: [51.51, -0.1], title: "Spacious House", price: "$2000/month" },
    { id: 3, position: [51.515, -0.08], title: "Modern Studio", price: "$800/month" },
  ];

  const TL: any = TileLayer
  const Mc: any = MapContainer
  return (
    <Mc center={center} zoom={zoom} style={{ height: '400px', width: '100%' }}>
      <TL
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {listings.map((listing) => (
        <Marker key={listing.id} position={listing.position}>
          <Popup>
            <div>
              <h3>{listing.title}</h3>
              <p>{listing.price}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </Mc>
  );
};