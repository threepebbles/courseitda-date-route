
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Navigation, Trash2, GripVertical } from "lucide-react";
import type { Place, Course } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";

// 카테고리별 장소 데이터
const MOCK_PLACES: Place[] = [
  // 데이트 관련 장소
  { id: "1", name: "한강공원 (반포)", description: "로맨틱한 강변 산책과 무지개 분수", lat: 37.5155, lng: 126.9955, emoji: "🌊", category: "데이트" },
  { id: "2", name: "N서울타워", description: "서울의 야경을 함께", lat: 37.5512, lng: 126.9882, emoji: "🗼", category: "데이트" },
  { id: "3", name: "이화여대 벚꽃길", description: "봄날의 낭만적인 산책", lat: 37.5617, lng: 126.9463, emoji: "🌸", category: "데이트" },
  
  // 맛집 관련 장소
  { id: "4", name: "연트럴파크", description: "유명한 파스타 맛집", lat: 37.5547, lng: 126.9236, emoji: "🍝", category: "맛집" },
  { id: "5", name: "망원한강공원", description: "치킨과 맥주 한 잔", lat: 37.5538, lng: 126.8944, emoji: "🍗", category: "맛집" },
  { id: "6", name: "명동 교자", description: "전통 만두 전문점", lat: 37.5633, lng: 126.9859, emoji: "🥟", category: "맛집" },
  
  // 관광 관련 장소
  { id: "7", name: "북촌한옥마을", description: "전통미가 살아있는 골목", lat: 37.5824, lng: 126.9834, emoji: "🏘️", category: "관광" },
  { id: "8", name: "경복궁", description: "조선 왕조의 정궁", lat: 37.5759, lng: 126.9768, emoji: "🏯", category: "관광" },
  { id: "9", name: "창덕궁", description: "조선 왕조의 별궁", lat: 37.5794, lng: 126.9910, emoji: "🏛️", category: "관광" },
  
  // 카페/문화 관련 장소
  { id: "10", name: "가로수길", description: "트렌디한 카페거리", lat: 37.5175, lng: 127.0233, emoji: "☕", category: "카페" },
  { id: "11", name: "홍대 걷고싶은거리", description: "젊음이 넘치는 거리", lat: 37.5547, lng: 126.9236, emoji: "🎵", category: "문화" },
  { id: "12", name: "동대문 디자인 플라자", description: "미래적인 건축물과 야경", lat: 37.5665, lng: 127.0092, emoji: "🌟", category: "문화" },
];

const CATEGORIES = [
  { key: 'date', label: '데이트', emoji: '💕' },
  { key: 'food', label: '맛집', emoji: '🍽️' },
  { key: 'tour', label: '관광', emoji: '🗺️' },
  { key: 'workshop', label: '워크숍', emoji: '🎓' },
  { key: 'other', label: '기타', emoji: '✨' },
];

interface CourseCreationProps {
  onStartNavigation: (course: Course) => void;
}

const CourseCreation = ({ onStartNavigation }: CourseCreationProps) => {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseMemo, setCourseMemo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Course['category']>('other');
  const [courseTags, setCourseTags] = useState("");

  const filteredPlaces = MOCK_PLACES.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addPlace = (place: Place) => {
    if (!selectedPlaces.find(p => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
      toast({
        title: "✨ 장소가 추가되었습니다!",
        description: `${place.name}이(가) 코스에 추가되었습니다.`,
      });
    }
  };

  const removePlace = (placeId: string) => {
    setSelectedPlaces(selectedPlaces.filter(p => p.id !== placeId));
    toast({
      title: "장소가 제거되었습니다",
      description: "코스에서 선택한 장소가 제거되었습니다.",
    });
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
      completed: false,
      category: selectedCategory,
      tags: courseTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      memo: courseMemo
    };

    onStartNavigation(course);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 메시지 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="py-6 text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">🗺️ 나만의 코스 만들기</h2>
          <p className="text-gray-600">
            특별한 목적에 맞는 장소들을 선택하여 나만의 코스를 만들어보세요
          </p>
        </CardContent>
      </Card>

      {/* 코스 기본 정보 */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            📝 코스 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="course-title">코스 이름</Label>
            <Input
              id="course-title"
              placeholder="예: 성수동 힙한 데이트 코스"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          
          <div>
            <Label htmlFor="course-category">카테고리</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map((category) => (
                <Badge
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  className={`cursor-pointer hover:bg-blue-100 ${
                    selectedCategory === category.key 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'border-blue-300 text-blue-700'
                  }`}
                  onClick={() => setSelectedCategory(category.key as Course['category'])}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="course-tags">태그 (쉼표로 구분)</Label>
            <Input
              id="course-tags"
              placeholder="예: 힙한, 데이트, 야경"
              value={courseTags}
              onChange={(e) => setCourseTags(e.target.value)}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="course-memo">메모 (선택사항)</Label>
            <Textarea
              id="course-memo"
              placeholder="이 코스에 대한 간단한 설명을 작성해보세요"
              value={courseMemo}
              onChange={(e) => setCourseMemo(e.target.value)}
              className="border-blue-200 focus:border-blue-400"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* 장소 검색 */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            장소 검색하기
          </CardTitle>
          <CardDescription>
            코스에 포함할 장소들을 검색하고 추가해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="장소 이름이나 카테고리로 검색해보세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 border-blue-200 focus:border-blue-400"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedPlaces.find(p => p.id === place.id)
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-white border-gray-200 hover:border-blue-200'
                }`}
                onClick={() => addPlace(place)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{place.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{place.name}</div>
                    <div className="text-sm text-gray-600">{place.description}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {place.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 선택된 장소들 */}
      {selectedPlaces.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              🗺️ 내 코스 ({selectedPlaces.length}곳)
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
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                >
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
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
              <div className="mt-6 pt-4 border-t border-blue-200">
                <Button
                  onClick={handleStartCourse}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3"
                  size="lg"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  코스 탐방 시작하기! 🧭
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
