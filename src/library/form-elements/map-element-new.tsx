import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { classNames } from '../utils';
import { localStorageUtils } from 'utils/localstorage';
import { LoadingIndicator } from 'components/common/loading-indicator';

// Fix for default marker icon
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const MapElementNew = (props: { id; className; style; center; zoom; mapPoints; refresh?}) => {
  const [center, setCenter] = useState<any>();
  const [zoom, setZoom] = useState<any>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mapSettings: any = {};
    if (props.id) {
      mapSettings = localStorageUtils.get('map-state-' + props.id) || {};
    }
    setCenter(mapSettings?.center || props.center || [37.0902, -95.7129]);
    setZoom(mapSettings?.zoom || props.zoom || 9);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      setCenter(props.center || [37.0902, -95.7129]);
      setZoom(props.zoom || 9);
    }
  }, [props.refresh]);

  const MapEvents = () => {
    useMapEvents({
      moveend: event => {
        const map = event.target;
        setCenter([map.getCenter()]);
        localStorageUtils.set('map-state-' + props.id, { center: map.getCenter(), zoom: map.getZoom() });
      },
      zoomend: event => {
        const map = event.target;
        setZoom(map.getZoom());
        localStorageUtils.set('map-state-' + props.id, { center: map.getCenter(), zoom: map.getZoom() });
      },
    });
    return null;
  };

  if (!center || !zoom) return <LoadingIndicator />;
  return (
    <MapContainer center={center} zoom={zoom} className={classNames(props.className, 'h-full w-full')}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
      {props?.mapPoints?.map(listing => (
        <Marker key={listing.id} position={listing.position}>
          <Popup>
            <div>
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      <MapEvents />
    </MapContainer>
  );
};
