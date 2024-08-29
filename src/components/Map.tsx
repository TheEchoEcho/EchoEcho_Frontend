'use client'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { generateDistanceProof, verifyDistanceProof } from '../utils/distanceproof';
import { PlonkProof, PublicSignals } from 'snarkjs';

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
  const [proofs, setProofs] = useState<PlonkProof>();
  const [publicsigs, setPublicSigs] = useState<PublicSignals>();
  const [showVerifyButton, setShowVerifyButton] = useState(false);

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
            <br />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mt-2"
              onClick={async () => {
                const ret = await handleProveClick(coord.lat, coord.lng, center);
                setProofs(ret.proof);
                setPublicSigs(ret.publicSignals);
                setShowVerifyButton(true);
                console.log(proofs);
              }}>
              Prove
            </button>
            {
              showVerifyButton &&
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded ml-2"
                onClick={async () => {
                  const isValid = await handleVerifyClick(proofs!, publicsigs!);
                  if (isValid !== false) {
                    alert("Verification Passed! Customer distance." + isValid + "km");
                  }
                  setShowVerifyButton(false);
                }}
              >
                Verify
              </button>
            }
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const handleProveClick = async (lat: number, lng: number, cur: [number, number]) => {
  let lat1 = Math.round(lat * Math.PI / 180 * 1000);
  let lat2 = Math.round(cur[0] * Math.PI / 180 * 1000);
  let lng1 = Math.round(lng * Math.PI / 180 * 1000);
  let lng2 = Math.round(cur[1] * Math.PI / 180 * 1000);
  [lat1, lat2] = adjustIntegers(lat1, lat2);
  [lng1, lng2] = adjustIntegers(lat1, lat2);

  const { proof, publicSignals } = await generateDistanceProof(
    { lat1: lat1, lon1: lng1, lat2: lat2, lon2: lng2 }
  );

  return { proof, publicSignals };
};

const handleVerifyClick = async (proof: PlonkProof, publicSignals: PublicSignals) => {
  const isValid = await verifyDistanceProof({ proof, publicSignals });

  return isValid;
}

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
  { lat: 22.40, lng: 113.44, description: 'Personal fitness trainer' }
];

export default LMap;