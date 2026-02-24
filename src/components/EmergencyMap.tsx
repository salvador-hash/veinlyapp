import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { EmergencyRequest, User } from '@/types';

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// City coordinates for demo purposes
const CITY_COORDS: Record<string, [number, number]> = {
  madrid: [40.4168, -3.7038],
  barcelona: [41.3874, 2.1686],
  'buenos aires': [-34.6037, -58.3816],
  'new york': [40.7128, -74.0060],
  london: [51.5074, -0.1278],
  paris: [48.8566, 2.3522],
  berlin: [52.5200, 13.4050],
  tokyo: [35.6762, 139.6503],
  'mexico city': [19.4326, -99.1332],
  bogota: [4.7110, -74.0721],
  lima: [-12.0464, -77.0428],
  santiago: [-33.4489, -70.6693],
  default: [40.4168, -3.7038],
};

function getCityCoords(city: string): [number, number] {
  const key = city.toLowerCase().trim();
  return CITY_COORDS[key] || CITY_COORDS.default;
}

// Add slight random offset so markers don't overlap
function jitter(coords: [number, number], index: number): [number, number] {
  const offset = 0.008;
  const angle = (index * 137.508) * (Math.PI / 180); // golden angle
  return [
    coords[0] + Math.cos(angle) * offset * (1 + index * 0.3),
    coords[1] + Math.sin(angle) * offset * (1 + index * 0.3),
  ];
}

interface EmergencyMapProps {
  emergencies: EmergencyRequest[];
  donors: User[];
  city?: string;
  className?: string;
}

const emergencyIcon = (urgency: string) => {
  const color = urgency === 'Critical' ? '#ef4444' : urgency === 'Urgent' ? '#f59e0b' : '#22c55e';
  const pulseColor = urgency === 'Critical' ? 'rgba(239,68,68,0.4)' : urgency === 'Urgent' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.2)';
  const label = urgency === 'Critical' ? '🔴' : urgency === 'Urgent' ? '🟡' : '🟢';
  const pulse = urgency === 'Critical' ? `
    <style>
      @keyframes emergency-pulse { 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.8);opacity:0.3} 100%{transform:scale(2.2);opacity:0} }
    </style>
    <div style="position:absolute;inset:-8px;border-radius:50%;background:${pulseColor};animation:emergency-pulse 1.5s infinite;"></div>
  ` : '';
  return L.divIcon({
    html: `<div style="position:relative;width:44px;height:56px;">
      ${pulse}
      <div style="
        position:relative;z-index:2;
        width:44px;height:44px;border-radius:12px;
        background:${color};
        border:3px solid white;
        box-shadow:0 4px 14px rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;
        font-size:18px;color:white;
      ">🩸</div>
      <div style="
        position:absolute;bottom:0;left:50%;transform:translateX(-50%);
        width:0;height:0;
        border-left:8px solid transparent;
        border-right:8px solid transparent;
        border-top:10px solid ${color};
        filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));
      "></div>
      <div style="
        position:absolute;top:-8px;right:-4px;z-index:3;
        font-size:12px;
      ">${label}</div>
    </div>`,
    className: '',
    iconSize: [44, 56],
    iconAnchor: [22, 56],
  });
};

const donorIcon = L.divIcon({
  html: `<div style="
    width: 28px; height: 28px; border-radius: 50%;
    background: hsl(355, 82%, 41%); border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: white;
  ">🩸</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const EmergencyMap = ({ emergencies, donors, city, className = '' }: EmergencyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const center = getCityCoords(city || 'madrid');
    const map = L.map(mapRef.current, {
      center,
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    // Add emergency markers
    emergencies.forEach((e, i) => {
      const coords = jitter(getCityCoords(e.city), i);
      L.marker(coords, { icon: emergencyIcon(e.urgency_level) })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 180px;">
            <strong style="font-size: 14px;">${e.hospital}</strong><br/>
            <span style="color: #666;">Paciente: ${e.patient_name}</span><br/>
            <span style="color: ${e.urgency_level === 'Critical' ? '#ef4444' : e.urgency_level === 'Urgent' ? '#f59e0b' : '#22c55e'}; font-weight: 600;">
              ${e.urgency_level === 'Critical' ? '🔴 Crítico' : e.urgency_level === 'Urgent' ? '🟡 Urgente' : '🟢 Normal'}
            </span><br/>
            <span style="color: #c0392b; font-weight: 700;">${e.blood_type_needed}</span> · ${e.units_needed} unidades
          </div>
        `);
    });

    // Add donor markers
    donors.forEach((d, i) => {
      const coords = jitter(getCityCoords(d.city), i + emergencies.length + 5);
      L.marker(coords, { icon: donorIcon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 150px;">
            <strong>${d.full_name}</strong><br/>
            <span style="color: #c0392b; font-weight: 700;">${d.blood_type}</span>
            ${d.available ? '<br/><span style="color: #22c55e;">● Disponible</span>' : ''}
          </div>
        `);
    });

    // Fit bounds if we have markers
    const allCoords = [
      ...emergencies.map((e, i) => jitter(getCityCoords(e.city), i)),
      ...donors.map((d, i) => jitter(getCityCoords(d.city), i + emergencies.length + 5)),
    ];
    if (allCoords.length > 0) {
      map.fitBounds(allCoords.map(c => c as L.LatLngTuple), { padding: [50, 50], maxZoom: 14 });
    }

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [emergencies, donors, city]);

  return (
    <div ref={mapRef} className={`rounded-xl overflow-hidden border ${className}`} style={{ minHeight: 350 }} />
  );
};

export default EmergencyMap;
