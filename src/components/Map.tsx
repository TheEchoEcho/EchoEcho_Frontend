'use client'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { generateDistanceProof } from '../utils/distanceproof';

interface FlyToLocationProps {
  coords: [number, number];
}

const FlyToLocation: React.FC<FlyToLocationProps> = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(coords, 13);
  }, [coords, map]);

  return null;
};

interface MapProps {
  center: [number, number];
}

const LMap: React.FC<MapProps> = ({ center }) => {
  const Iconst = L.icon({
        iconUrl: "/icon.png",
        iconSize: [25, 25],
        iconAnchor: [19, 95],
        popupAnchor: [-3, -76],
  });
  useEffect(() => {
    /**
     * Get NFT coordinates here!
     */
  }, []);

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FlyToLocation coords={center} />
      <Marker position={center} icon={Iconst} draggable={false}>
        <Popup>
          You are here!
        </Popup>
      </Marker>
      {coordinates.map((coord, index) => (
        <Marker key={index} position={[coord.lat, coord.lng]} icon={Iconst} draggable={false}>
          <Popup>
            {coord.description}
            <button onClick={() => {
                handleClick(coord.lat, coord.lng, center);
            }}>
              Prove
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const handleClick = async (lat: number, lng: number, cur: [number, number]) => {
  let lat1 = Math.round(lat * Math.PI / 180 * 1000);
  let lat2 = Math.round(cur[0] * Math.PI / 180 * 1000);
  let lng1 = Math.round(lng * Math.PI / 180 * 1000);
  let lng2 = Math.round(cur[1] * Math.PI / 180 * 1000);
  [lat1, lat2] = adjustIntegers(lat1, lat2);
  [lng1, lng2] = adjustIntegers(lat1, lat2);

  console.log(lat1);console.log(lat2);console.log(lng1);console.log(lng2);

  const { proof, publicSignals } = await generateDistanceProof(
    {lat1: lat1, lon1: lng1, lat2: lat2, lon2: lng2}
  );

  // fs.fileWriteSync(proof, "./proof");
};
function adjustIntegers(a: number, b: number) {
    const difference = Math.abs(a - b); // Calculate the absolute difference

    if (difference % 2 !== 0) { // Check if the difference is odd
        a += 1; // Increment a by 1
    }

    return [a, b]; // Return the adjusted integers
}

const coordinates = [
    { lat: 22.20, lng: 115.19, description: 'Marker 1: This is the first marker.' },
    { lat: 21.30, lng: 114.34, description: 'Marker 2: This is the second marker.' },
    { lat: 22.42, lng: 113.74, description: 'Marker 3: This is the third marker.' }
];

export default LMap;