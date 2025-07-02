
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, AlertTriangle, MapPin, SkipForward, Edit3 } from "lucide-react";
import type { Course } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";
import MapComponent from "./MapComponent";

interface NavigationModeProps {
  course: Course;
  onComplete: () => void;
  onBack: () => void;
}

const NavigationMode = ({ course, onComplete, onBack }: NavigationModeProps) => {
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  const [isOffRoute, setIsOffRoute] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울 중심부
  const [activePlaces, setActivePlaces] = useState(course.places); // 활성 장소 목록

  const currentPlace = activePlaces[currentPlaceIndex];
  const nextPlace = activePlaces[currentPlaceIndex + 1];
  const isLastPlace = currentPlaceIndex === activePlaces.length - 1;

  useEffect(() => {
    setProgress((currentPlaceIndex / activePlaces.length) * 100);
  }, [currentPlaceIndex, activePlaces.length]);

  // 첫 번째 장소 근처로 현재 위치 설정
  useEffect(() => {
    if (activePlaces.length > 0) {
      const firstPlace = activePlaces[0];
      setCurrentLocation({
        lat: firstPlace.lat - 0.005,
        lng: firstPlace.lng - 0.005
      });
    }
  }, [activePlaces]);

  const handleArrived = () => {
    if (isLastPlace) {
      toast({
        title: "🎉 모든 코스 완주 완료!",
        description: "정말 수고하셨어요! 추억 한 조각이 완성되었습니다 ✨",
      });
      onComplete();
    } else {
      // 다음 장소로 현재 위치 이동 (도착 시뮬레이션)
      setCurrentLocation({
        lat: currentPlace.lat,
        lng: currentPlace.lng
      });
      
      setCurrentPlaceIndex(currentPlaceIndex + 1);
      toast({
        title: "✨ 도착 완료!",
        description: `${currentPlace.name}에 잘 도착하셨어요. 다음 장소로 이동해볼까요?`,
      });
    }
  };

  const handleOffRoute = () => {
    setIsOffRoute(true);
    // 랜덤한 위치로 이동 (경로 이탈 시뮬레이션)
    const randomOffset = {
      lat: (Math.random() - 0.5) * 0.01,
      lng: (Math.random() - 0.5) * 0.01
    };
    setCurrentLocation({
      lat: currentLocation.lat + randomOffset.lat,
      lng: currentLocation.lng + randomOffset.lng
    });
    
    toast({
      title: "🔄 경로 이탈 감지",
      description: "괜찮아요! 새로운 경로로 안내해드릴게요.",
    });
    
    // 3초 후 자동으로 경로 복구
    setTimeout(() => {
      setIsOffRoute(false);
      toast({
        title: "✅ 새로운 경로 안내",
        description: "최적 경로로 다시 안내를 시작합니다.",
      });
    }, 3000);
  };

  const handleLocationUpdate = (newLocation: { lat: number; lng: number }) => {
    setCurrentLocation(newLocation);
    toast({
      title: "📍 위치 업데이트",
      description: "현재 위치가 갱신되었습니다.",
    });
  };

  const goToPlace = (placeIndex: number) => {
    if (placeIndex < currentPlaceIndex) {
      setCurrentPlaceIndex(placeIndex);
      const targetPlace = activePlaces[placeIndex];
      setCurrentLocation({
        lat: targetPlace.lat - 0.003,
        lng: targetPlace.lng - 0.003
      });
      toast({
        title: "🔄 이전 장소로 이동",
        description: `${targetPlace.name}부터 다시 시작합니다.`,
      });
    }
  };

  // 현재 장소 건너뛰기
  const skipCurrentPlace = () => {
    if (currentPlaceIndex < activePlaces.length - 1) {
      const skippedPlace = activePlaces[currentPlaceIndex];
      setCurrentPlaceIndex(currentPlaceIndex + 1);
      toast({
        title: "⏭️ 장소 건너뛰기",
        description: `${skippedPlace.name}을(를) 건너뛰고 다음 장소로 이동합니다.`,
      });
    }
  };

  // 장소 삭제 (코스 조정)
  const removePlace = (placeIndex: number) => {
    if (activePlaces.length <= 2) {
      toast({
        title: "삭제할 수 없습니다",
        description: "최소 2개의 장소는 유지되어야 합니다.",
        variant: "destructive"
      });
      return;
    }

    const newActivePlaces = activePlaces.filter((_, index) => index !== placeIndex);
    setActivePlaces(newActivePlaces);
    
    // 현재 인덱스 조정
    if (placeIndex <= currentPlaceIndex && currentPlaceIndex > 0) {
      setCurrentPlaceIndex(currentPlaceIndex - 1);
    } else if (currentPlaceIndex >= newActivePlaces.length) {
      setCurrentPlaceIndex(newActivePlaces.length - 1);
    }
    
    toast({
      title: "🗑️ 장소 삭제 완료",
      description: `${activePlaces[placeIndex].name}이(가) 코스에서 제거되었습니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-blue-700">{course.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{currentPlaceIndex + 1} / {activePlaces.length}</span>
              <Progress value={progress} className="flex-1 h-2" />
            </div>
          </div>
        </div>

        {/* 지도 */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              실시간 위치 안내
            </CardTitle>
            <CardDescription>
              지도를 클릭하여 위치를 변경할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapComponent 
              places={activePlaces}
              currentPlaceIndex={currentPlaceIndex}
              currentLocation={currentLocation}
              isOffRoute={isOffRoute}
              onLocationUpdate={handleLocationUpdate}
            />
          </CardContent>
        </Card>

        {/* 현재 안내 */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <span className="text-2xl">{currentPlace.emoji}</span>
              {isLastPlace ? '마지막 목적지에요!' : '현재 목적지'}
            </CardTitle>
            <CardDescription>
              {isLastPlace 
                ? '모든 코스를 완주하셨어요! 🎉' 
                : `${currentPlace.name}에서 ${nextPlace?.name}로 이동 중`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {currentPlaceIndex + 1}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-800">{currentPlace.name}</div>
                    <div className="text-gray-600">{currentPlace.description}</div>
                  </div>
                </div>
              </div>

              {!isLastPlace && nextPlace && (
                <div className="flex items-center gap-2 text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <span className="text-blue-500">🚩</span>
                  <span>다음 목적지: {nextPlace.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <Button
            onClick={handleArrived}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-4"
            size="lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {isLastPlace ? '코스 완주하기! 🎉' : '이 장소에 도착했어요!'}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleOffRoute}
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
              disabled={isOffRoute}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {isOffRoute ? '경로 재계산 중...' : '길을 잃었어요'}
            </Button>

            {!isLastPlace && (
              <Button
                onClick={skipCurrentPlace}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                장소 건너뛰기
              </Button>
            )}
          </div>
        </div>

        {/* 코스 진행 상황 및 조정 */}
        <Card className="mt-6 bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 text-lg flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              코스 진행 상황 및 조정
            </CardTitle>
            <CardDescription>장소를 클릭하여 이동하거나 삭제할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activePlaces.map((place, index) => (
                <div
                  key={place.id}
                  className={`flex items-center gap-3 p-2 rounded transition-all ${
                    index < currentPlaceIndex
                      ? 'bg-green-100 text-green-800'
                      : index === currentPlaceIndex
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < currentPlaceIndex
                      ? 'bg-green-500 text-white'
                      : index === currentPlaceIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentPlaceIndex ? '✓' : index + 1}
                  </div>
                  <span className="text-lg">{place.emoji}</span>
                  <span className="font-medium flex-1">{place.name}</span>
                  
                  <div className="flex gap-1">
                    {index < currentPlaceIndex && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToPlace(index)}
                        className="text-xs text-green-600 hover:text-green-700"
                      >
                        다시 시작
                      </Button>
                    )}
                    {activePlaces.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlace(index)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        삭제
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NavigationMode;
