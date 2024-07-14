import React from 'react';
import GoogleMapReact from 'google-map-react';

export const MapElement = (props: { path, name }) => {
  const prop: any = {}

  const handleUpdate = (emoji: any) => {
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact bootstrapURLKeys={{ key: 'AIzaSyB6XJn7nEXX7aaNwQX-q8UVmFbzI5Oq5Xg', }}  >
      </GoogleMapReact>
    </div>
  );
};
