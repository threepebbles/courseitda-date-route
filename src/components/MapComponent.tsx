
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Place } from '@/pages/Index';

// 기본 마커 아이콘 설정 (Leaflet 기본 아이콘 문제 해결)
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const currentLocationIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -34],
  shadowSize: [49, 49]
});

interface MapComponentProps {
  places: Place[];
  currentPlaceIndex: number;
  isOffRoute: boolean;
}

const MapComponent = ({ places, currentPlaceIndex, isOffRoute }: MapComponentProps) => {
  const mapRef = useRef<any>(null);

  // 서울 중심 좌표 (기본값)
  const defaultCenter: LatLngTuple = [37.5665, 126.9780];
  
  // 현재 위치 (시뮬레이션)
  const currentLocation: LatLngTuple = [37.5665, 126.9780];

  // 지도 중심을 현재 장소로 이동
  useEffect(() => {
    if (mapRef.current && places[currentPlaceIndex]) {
      const currentPlace = places[currentPlaceIndex];
      mapRef.current.setView([currentPlace.lat, currentPlace.lng], 15);
    }
  }, [currentPlaceIndex, places]);

  // 경로 폴리라인을 위한 좌표 배열
  const getPolylinePositions = (): LatLngTuple[] => {
    const positions: LatLngTuple[] = [currentLocation];
    
    if (currentPlaceIndex < places.length) {
      // 현재 위치에서 현재 목적지까지
      positions.push([places[currentPlaceIndex].lat, places[currentPlaceIndex].lng]);
      
      // 다음 장소들까지의 경로
      for (let i = currentPlaceIndex + 1; i < places.length; i++) {
        positions.push([places[i].lat, places[i].lng]);
      }
    }
    
    return positions;
  };

  const polylinePositions = getPolylinePositions();

  return (
    <div className="relative h-64 rounded-lg overflow-hidden">
      <MapContainer
        center={places[currentPlaceIndex] ? [places[currentPlaceIndex].lat, places[currentPlaceIndex].lng] : defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 현재 위치 마커 */}
        <Marker position={currentLocation} icon={currentLocationIcon}>
          <Popup>
            <div className="text-center">
              <div className="font-bold text-blue-600">현재 위치</div>
              <div className="text-sm text-gray-600">여기서 시작해요! 💕</div>
            </div>
          </Popup>
        </Marker>

        {/* 장소 마커들 */}
        {places.map((place, index) => (
          <Marker 
            key={place.id} 
            position={[place.lat, place.lng]} 
            icon={defaultIcon}
          >
            <Popup>
              <div className="text-center">
                <div className="text-2xl mb-2">{place.emoji}</div>
                <div className="font-bold text-pink-600">{place.name}</div>
                <div className="text-sm text-gray-600">{place.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {index < currentPlaceIndex ? '완료 ✅' : 
                   index === currentPlaceIndex ? '현재 목적지 📍' : 
                   `${index + 1}번째 장소`}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 경로 폴리라인 */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            color={isOffRoute ? "#f59e0b" : "#3b82f6"}
            weight={4}
            opacity={0.8}
            dashArray={isOffRoute ? "10, 10" : undefined}
          />
        )}
      </MapContainer>

      {/* 경로 이탈 알림 */}
      {isOffRoute && (
        <div className="absolute top-2 left-2 bg-yellow-100 border border-yellow-300 rounded-lg p-2 z-[1000]">
          <div className="flex items-center gap-1 text-yellow-700 text-sm">
            <AlertTriangle className="h-4 w-4" />
            경로 재계산 중...
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
