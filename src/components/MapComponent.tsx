
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Place } from '@/pages/Index';

// Leaflet 아이콘 설정
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const currentLocationIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzM5ODRmZiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface MapComponentProps {
  places: Place[];
  currentPlaceIndex: number;
  currentLocation: { lat: number; lng: number };
  isOffRoute: boolean;
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

const MapComponent = ({ 
  places, 
  currentPlaceIndex, 
  currentLocation, 
  isOffRoute,
  onLocationUpdate 
}: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const currentLocationMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      // 지도 초기화
      mapRef.current = L.map('map').setView([37.5665, 126.9780], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // 지도 클릭 이벤트 (위치 업데이트용)
      if (onLocationUpdate) {
        mapRef.current.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationUpdate({ lat, lng });
        });
      }
    }

    // 기존 마커들 제거
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // 경로선 제거
    if (routeLineRef.current) {
      routeLineRef.current.remove();
    }

    // 현재 위치 마커 업데이트
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.remove();
    }
    
    currentLocationMarkerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
      icon: currentLocationIcon
    }).addTo(mapRef.current)
      .bindPopup('현재 위치 📍')
      .openPopup();

    // 장소 마커들 추가
    places.forEach((place, index) => {
      const marker = L.marker([place.lat, place.lng], { icon: defaultIcon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-2">
            <div class="font-bold text-lg">${place.emoji} ${place.name}</div>
            <div class="text-sm text-gray-600">${place.description}</div>
            <div class="text-xs mt-1 ${index < currentPlaceIndex ? 'text-green-600' : index === currentPlaceIndex ? 'text-blue-600' : 'text-gray-500'}">
              ${index < currentPlaceIndex ? '✅ 완료' : index === currentPlaceIndex ? '🚩 현재 목적지' : `${index + 1}번째 목적지`}
            </div>
          </div>
        `);

      markersRef.current.push(marker);
    });

    // 경로선 그리기
    if (places.length > 0) {
      const routePoints: [number, number][] = [
        [currentLocation.lat, currentLocation.lng],
        ...places.slice(currentPlaceIndex).map(place => [place.lat, place.lng] as [number, number])
      ];

      routeLineRef.current = L.polyline(routePoints, {
        color: isOffRoute ? '#f59e0b' : '#3b82f6',
        weight: 4,
        opacity: 0.7,
        dashArray: isOffRoute ? '10, 10' : undefined
      }).addTo(mapRef.current);

      // 지도 범위를 경로에 맞게 조정
      const bounds = L.latLngBounds(routePoints);
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }

    return () => {
      // 컴포넌트 언마운트 시 지도 정리
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [places, currentPlaceIndex, currentLocation, isOffRoute, onLocationUpdate]);

  return (
    <div className="relative">
      <div id="map" className="h-80 w-full rounded-lg overflow-hidden border-2 border-pink-200"></div>
      {isOffRoute && (
        <div className="absolute top-2 left-2 bg-yellow-100 border border-yellow-300 rounded-lg p-2">
          <div className="flex items-center gap-1 text-yellow-700 text-sm">
            <span>⚠️</span>
            경로 재계산 중...
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
