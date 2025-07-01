
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, GripVertical, X, Navigation } from "lucide-react";
import type { Course, Place } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";

interface CourseCreationProps {
  onStartNavigation: (course: Course) => void;
}

// 서울의 실제 장소들 (실제 좌표 포함)
const SAMPLE_PLACES: Place[] = [
  { id: "1", name: "한강공원 여의도", description: "한강을 보며 로맨틱한 산책", lat: 37.5285, lng: 126.9385, emoji: "🌊" },
  { id: "2", name: "N서울타워", description: "서울의 랜드마크에서 야경 감상", lat: 37.5512, lng: 126.9882, emoji: "🗼" },
  { id: "3", name: "명동성당", description: "고딕 양식의 아름다운 성당", lat: 37.5633, lng: 126.9870, emoji: "⛪" },
  { id: "4", name: "경복궁", description: "조선왕조의 정궁에서 한복 데이트", lat: 37.5796, lng: 126.9770, emoji: "🏯" },
  { id: "5", name: "홍대입구", description: "젊음의 거리에서 즐거운 시간", lat: 37.5563, lng: 126.9236, emoji: "🎭" },
  { id: "6", name: "가로수길", description: "트렌디한 카페와 쇼핑 거리", lat: 37.5186, lng: 127.0208, emoji: "🌳" },
  { id: "7", name: "롯데월드타워", description: "서울의 새로운 랜드마크", lat: 37.5125, lng: 127.1025, emoji: "🏢" },
  { id: "8", name: "반포한강공원", description: "무지개분수와 함께하는 데이트", lat: 37.5087, lng: 126.9957, emoji: "🌈" },
  { id: "9", name: "북촌한옥마을", description: "전통 한옥에서 느끼는 정취", lat: 37.5814, lng: 126.9834, emoji: "🏘️" },
  { id: "10", name: "이태원", description: "다양한 문화가 공존하는 거리", lat: 37.5349, lng: 126.9956, emoji: "🌍" }
];

const CourseCreation = ({ onStartNavigation }: CourseCreationProps) => {
  const [courseTitle, setCourseTitle] = useState("우리만의 데이트 코스");
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlaces = SAMPLE_PLACES.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addPlace = (place: Place) => {
    if (!selectedPlaces.find(p => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
      setSearchTerm("");
      toast({
        title: "장소 추가 완료! ✨",
        description: `${place.name}이(가) 코스에 추가되었습니다.`,
      });
    }
  };

  const removePlace = (placeId: string) => {
    setSelectedPlaces(selectedPlaces.filter(p => p.id !== placeId));
  };

  const movePlace = (fromIndex: number, toIndex: number) => {
    const newPlaces = [...selectedPlaces];
    const [movedPlace] = newPlaces.splice(fromIndex, 1);
    newPlaces.splice(toIndex, 0, movedPlace);
    setSelectedPlaces(newPlaces);
  };

  const startNavigation = () => {
    if (selectedPlaces.length === 0) {
      toast({
        title: "장소를 추가해주세요",
        description: "최소 1개 이상의 장소를 선택해야 합니다.",
        variant: "destructive"
      });
      return;
    }

    const course: Course = {
      id: Date.now().toString(),
      title: courseTitle,
      places: selectedPlaces,
      createdAt: new Date(),
      completed: false
    };

    onStartNavigation(course);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-pink-700 mb-2">
          💕 데이트 코스 만들기
        </h2>
        <p className="text-gray-600">
          사랑하는 사람과 함께 걸을 특별한 코스를 만들어보세요
        </p>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-700">코스 정보</CardTitle>
          <CardDescription>데이트 코스의 이름을 정해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="courseTitle" className="text-gray-700">코스 제목</Label>
              <Input
                id="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="예: 우리만의 특별한 서울 데이트"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-700">장소 검색 및 추가</CardTitle>
          <CardDescription>방문하고 싶은 장소를 검색해서 추가해보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="placeSearch" className="text-gray-700">장소 검색</Label>
              <Input
                id="placeSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="장소명 또는 설명으로 검색..."
                className="mt-1"
              />
            </div>

            {searchTerm && (
              <div className="max-h-48 overflow-y-auto space-y-2 border border-pink-200 rounded-lg p-3 bg-pink-50/50">
                {filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-pink-50 transition-colors cursor-pointer"
                    onClick={() => addPlace(place)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{place.emoji}</span>
                      <div>
                        <div className="font-medium text-gray-800">{place.name}</div>
                        <div className="text-sm text-gray-600">{place.description}</div>
                      </div>
                    </div>
                    <Plus className="h-5 w-5 text-pink-500" />
                  </div>
                ))}
                {filteredPlaces.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    검색 결과가 없습니다
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPlaces.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-700 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              선택된 코스 ({selectedPlaces.length}개 장소)
            </CardTitle>
            <CardDescription>장소를 드래그해서 순서를 변경할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedPlaces.map((place, index) => (
                <div
                  key={place.id}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-100 to-orange-100 rounded-lg border border-pink-200"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  
                  <span className="text-2xl">{place.emoji}</span>
                  
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{place.name}</div>
                    <div className="text-sm text-gray-600">{place.description}</div>
                  </div>

                  <div className="flex gap-1">
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePlace(index, index - 1)}
                        className="text-pink-600 hover:text-pink-800"
                      >
                        ↑
                      </Button>
                    )}
                    {index < selectedPlaces.length - 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePlace(index, index + 1)}
                        className="text-pink-600 hover:text-pink-800"
                      >
                        ↓
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlace(place.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={startNavigation}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-medium py-4"
              size="lg"
            >
              <Navigation className="h-5 w-5 mr-2" />
              🚀 데이트 코스 시작하기!
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseCreation;
