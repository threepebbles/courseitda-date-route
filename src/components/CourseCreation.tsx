
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Trash2, GripVertical } from "lucide-react";
import type { Place, Course } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";

// 모의 장소 데이터
const MOCK_PLACES: Place[] = [
  { id: "1", name: "한강공원", description: "로맨틱한 강변 산책", lat: 37.5326, lng: 127.0246, emoji: "🌊" },
  { id: "2", name: "남산타워", description: "서울의 야경을 함께", lat: 37.5512, lng: 126.9882, emoji: "🗼" },
  { id: "3", name: "홍대 걷고싶은거리", description: "젊음이 넘치는 거리", lat: 37.5547, lng: 126.9236, emoji: "🎵" },
  { id: "4", name: "북촌한옥마을", description: "전통미가 살아있는 골목", lat: 37.5824, lng: 126.9834, emoji: "🏘️" },
  { id: "5", name: "이화여대 벚꽃길", description: "봄날의 낭만적인 산책", lat: 37.5617, lng: 126.9463, emoji: "🌸" },
  { id: "6", name: "가로수길", description: "트렌디한 카페거리", lat: 37.5175, lng: 127.0233, emoji: "☕" },
  { id: "7", name: "뚝섬한강공원", description: "넓은 잔디밭에서 피크닉", lat: 37.5305, lng: 127.0669, emoji: "🌱" },
  { id: "8", name: "청계천", description: "도심 속 시원한 물소리", lat: 37.5687, lng: 126.9784, emoji: "💧" },
];

interface CourseCreationProps {
  onStartNavigation: (course: Course) => void;
}

const CourseCreation = ({ onStartNavigation }: CourseCreationProps) => {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const filteredPlaces = MOCK_PLACES.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addPlace = (place: Place) => {
    if (!selectedPlaces.find(p => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
      toast({
        title: "장소가 추가되었습니다!",
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

  const handleStartCourse = () => {
    if (selectedPlaces.length < 2) {
      toast({
        title: "장소를 더 추가해주세요",
        description: "최소 2개 이상의 장소가 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    const course: Course = {
      id: Date.now().toString(),
      title: courseTitle || `${selectedPlaces[0].name} 코스`,
      places: selectedPlaces,
      createdAt: new Date(),
      completed: false
    };

    onStartNavigation(course);
  };

  return (
    <div className="space-y-6">
      {/* 코스 제목 */}
      <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-700 flex items-center gap-2">
            💕 데이트 코스 이름
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="예: 홍대 낭만 데이트 코스"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="border-pink-200 focus:border-pink-400"
          />
        </CardContent>
      </Card>

      {/* 장소 검색 */}
      <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-700 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            장소 검색하기
          </CardTitle>
          <CardDescription>
            데이트 코스에 포함할 장소들을 검색하고 추가해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="장소 이름을 검색해보세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 border-pink-200 focus:border-pink-400"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedPlaces.find(p => p.id === place.id)
                    ? 'bg-pink-100 border-pink-300'
                    : 'bg-white border-gray-200 hover:border-pink-200'
                }`}
                onClick={() => addPlace(place)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{place.emoji}</span>
                  <div>
                    <div className="font-medium text-gray-800">{place.name}</div>
                    <div className="text-sm text-gray-600">{place.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 선택된 장소들 */}
      {selectedPlaces.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-700 flex items-center gap-2">
              🗺️ 내 데이트 코스 ({selectedPlaces.length}곳)
            </CardTitle>
            <CardDescription>
              순서를 드래그로 변경할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedPlaces.map((place, index) => (
                <div
                  key={place.id}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-200"
                >
                  <div className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-xl">{place.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{place.name}</div>
                    <div className="text-sm text-gray-600">{place.description}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePlace(place.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {selectedPlaces.length >= 2 && (
              <div className="mt-6 pt-4 border-t border-pink-200">
                <Button
                  onClick={handleStartCourse}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-medium py-3"
                  size="lg"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  함께 걸어볼까요? 💕
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseCreation;
