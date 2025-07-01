
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
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

  const currentPlace = course.places[currentPlaceIndex];
  const nextPlace = course.places[currentPlaceIndex + 1];
  const isLastPlace = currentPlaceIndex === course.places.length - 1;

  useEffect(() => {
    setProgress((currentPlaceIndex / course.places.length) * 100);
  }, [currentPlaceIndex, course.places.length]);

  const handleArrived = () => {
    if (isLastPlace) {
      toast({
        title: "🎉 모든 코스 완주!",
        description: "정말 수고하셨어요! 소중한 추억을 만드셨네요.",
      });
      onComplete();
    } else {
      setCurrentPlaceIndex(currentPlaceIndex + 1);
      toast({
        title: "✨ 도착 완료!",
        description: `${currentPlace.name}에 잘 도착하셨어요. 다음 장소로 이동해볼까요?`,
      });
    }
  };

  const handleOffRoute = () => {
    setIsOffRoute(true);
    toast({
      title: "🔄 경로 재안내",
      description: "괜찮아요! 새로운 경로로 안내해드릴게요.",
    });
    
    setTimeout(() => {
      setIsOffRoute(false);
    }, 3000);
  };

  const handleGoToPlace = (placeIndex: number) => {
    if (placeIndex <= currentPlaceIndex) {
      setCurrentPlaceIndex(placeIndex);
      toast({
        title: "📍 장소로 이동",
        description: `${course.places[placeIndex].name}부터 다시 시작합니다.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-pink-600 hover:text-pink-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-pink-700">{course.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{currentPlaceIndex + 1} / {course.places.length}</span>
              <Progress value={progress} className="flex-1 h-2" />
            </div>
          </div>
        </div>

        {/* 지도 */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-pink-200">
          <CardContent className="p-4">
            <MapComponent 
              places={course.places}
              currentPlaceIndex={currentPlaceIndex}
              isOffRoute={isOffRoute}
            />
          </CardContent>
        </Card>

        {/* 현재 안내 */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-700 flex items-center gap-2">
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
              <div className="p-4 bg-gradient-to-r from-pink-100 to-orange-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {currentPlaceIndex + 1}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-800">{currentPlace.name}</div>
                    <div className="text-gray-600">{currentPlace.description}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <Button
            onClick={handleArrived}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-medium py-4"
            size="lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {isLastPlace ? '코스 완주하기! 🎉' : '이 장소에 도착했어요!'}
          </Button>

          <Button
            onClick={handleOffRoute}
            variant="outline"
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
            disabled={isOffRoute}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {isOffRoute ? '경로 재계산 중...' : '길을 잃었어요 (경로 이탈 시뮬레이션)'}
          </Button>
        </div>

        {/* 코스 진행 상황 */}
        <Card className="mt-6 bg-white/70 backdrop-blur-sm border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-700 text-lg">코스 진행 상황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {course.places.map((place, index) => (
                <div
                  key={place.id}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                    index < currentPlaceIndex
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : index === currentPlaceIndex
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => handleGoToPlace(index)}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < currentPlaceIndex
                      ? 'bg-green-500 text-white'
                      : index === currentPlaceIndex
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentPlaceIndex ? '✓' : index + 1}
                  </div>
                  <span className="text-lg">{place.emoji}</span>
                  <span className="font-medium">{place.name}</span>
                  {index <= currentPlaceIndex && index < currentPlaceIndex && (
                    <span className="text-xs text-green-600 ml-auto">클릭하여 여기부터 다시 시작</span>
                  )}
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
