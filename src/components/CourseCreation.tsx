import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MapPin, Navigation } from "lucide-react";
import type { Place, Course } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";
import { ACTIVITY_CATEGORIES } from "@/pages/Index";

interface CourseCreationProps {
  onStartNavigation: (course: Course) => void;
}

const PLACE_CATEGORIES = ["카페", "음식점", "관광지", "쇼핑", "기타"];

const CourseCreation = ({ onStartNavigation }: CourseCreationProps) => {
  const [courseTitle, setCourseTitle] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceDescription, setNewPlaceDescription] = useState("");
  const [newPlaceEmoji, setNewPlaceEmoji] = useState("📍");
  const [newPlaceCategory, setNewPlaceCategory] = useState("기타");
  const [newPlaceActivityCategory, setNewPlaceActivityCategory] = useState<{
    main: 'eating' | 'viewing' | 'playing' | 'walking';
    sub: string;
  }>({ main: 'eating', sub: '밥' });

  const addPlace = () => {
    if (newPlaceName.trim() && newPlaceDescription.trim()) {
      const place: Place = {
        id: Date.now().toString(),
        name: newPlaceName.trim(),
        description: newPlaceDescription.trim(),
        lat: 37.5665 + (Math.random() - 0.5) * 0.01,
        lng: 126.9780 + (Math.random() - 0.5) * 0.01,
        emoji: newPlaceEmoji,
        category: newPlaceCategory,
        activityCategory: newPlaceActivityCategory
      };
      
      setPlaces([...places, place]);
      setNewPlaceName("");
      setNewPlaceDescription("");
      setNewPlaceEmoji("📍");
      setNewPlaceCategory("기타");
      setNewPlaceActivityCategory({ main: 'eating', sub: '밥' });
      
      toast({
        title: "✨ 장소가 추가되었습니다!",
        description: `${place.name}이(가) 코스에 추가되었어요.`,
      });
    }
  };

  const removePlace = (id: string) => {
    setPlaces(places.filter((place) => place.id !== id));
  };

  const handleStartCourse = () => {
    if (courseTitle.trim() === "") {
      toast({
        title: "⚠️ 코스 제목을 입력해주세요!",
        description: "코스 제목은 필수 항목입니다.",
      });
      return;
    }

    if (places.length < 2) {
      toast({
        title: "⚠️ 최소 2개 이상의 장소를 추가해주세요!",
        description: "코스는 최소 2개 이상의 장소로 구성되어야 합니다.",
      });
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      title: courseTitle.trim(),
      places: places,
      createdAt: new Date(),
      completed: false,
      category: 'tour',
      tags: [],
      isPublic: true
    };

    onStartNavigation(newCourse);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="py-6 text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            ✨ 나만의 코스 만들기
          </h2>
          <p className="text-gray-600">
            방문하고 싶은 장소를 추가하고, 나만의 특별한 코스를 만들어보세요
          </p>
        </CardContent>
      </Card>

      {/* 코스 제목 입력 */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            코스 제목을 정해주세요
          </CardTitle>
          <CardDescription>
            코스의 개성을 나타내는 멋진 제목을 지어주세요!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="예: 서울 힙스터 여행, 맛집 정복 데이트..."
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="border-blue-200 focus:border-blue-400"
          />
        </CardContent>
      </Card>

      {/* 장소 추가 폼 */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            새로운 장소 추가하기
          </CardTitle>
          <CardDescription>
            방문하고 싶은 특별한 장소를 하나씩 추가해보세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="placeName">장소 이름</Label>
              <Input
                id="placeName"
                placeholder="예: 성수연방, 홍대 놀이터..."
                value={newPlaceName}
                onChange={(e) => setNewPlaceName(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            <div>
              <Label htmlFor="placeEmoji">이모지</Label>
              <Input
                id="placeEmoji"
                placeholder="🎨"
                value={newPlaceEmoji}
                onChange={(e) => setNewPlaceEmoji(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
                maxLength={2}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="placeDescription">장소 설명</Label>
            <Input
              id="placeDescription"
              placeholder="이 장소만의 특별한 점을 알려주세요..."
              value={newPlaceDescription}
              onChange={(e) => setNewPlaceDescription(e.target.value)}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          {/* 활동 카테고리 선택 */}
          <div>
            <Label>활동 카테고리</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label className="text-sm text-gray-600">주요 활동</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Object.entries(ACTIVITY_CATEGORIES).map(([key, category]) => (
                    <Badge
                      key={key}
                      variant={newPlaceActivityCategory.main === key ? "default" : "outline"}
                      className={`cursor-pointer hover:bg-opacity-80 ${
                        newPlaceActivityCategory.main === key 
                          ? category.color.replace('bg-', 'bg-').replace('text-', 'text-').replace('border-', 'border-')
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        const mainCategory = key as 'eating' | 'viewing' | 'playing' | 'walking';
                        setNewPlaceActivityCategory({
                          main: mainCategory,
                          sub: ACTIVITY_CATEGORIES[mainCategory].subcategories[0]
                        });
                      }}
                    >
                      <span className="mr-1">{category.emoji}</span>
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">세부 활동</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ACTIVITY_CATEGORIES[newPlaceActivityCategory.main].subcategories.map((sub) => (
                    <Badge
                      key={sub}
                      variant={newPlaceActivityCategory.sub === sub ? "default" : "outline"}
                      className={`cursor-pointer text-xs ${
                        newPlaceActivityCategory.sub === sub 
                          ? 'bg-blue-500 text-white hover:bg-blue-600' 
                          : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setNewPlaceActivityCategory(prev => ({ ...prev, sub }))}
                    >
                      {sub}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="placeCategory">장소 분류</Label>
              <select
                id="placeCategory"
                value={newPlaceCategory}
                onChange={(e) => setNewPlaceCategory(e.target.value)}
                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                {PLACE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <Button 
            onClick={addPlace} 
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium"
            disabled={!newPlaceName.trim() || !newPlaceDescription.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            장소 추가하기 ✨
          </Button>
        </CardContent>
      </Card>

      {/* 추가된 장소 목록 */}
      {places.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              나의 코스 경로
            </CardTitle>
            <CardDescription>
              추가된 장소들을 확인하고, 코스 순서를 조정해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {places.map((place) => (
                <li
                  key={place.id}
                  className="flex items-center justify-between px-4 py-2 bg-blue-50 rounded-md border border-blue-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{place.emoji}</span>
                    <div>
                      <div className="font-medium text-blue-700">{place.name}</div>
                      <div className="text-sm text-gray-500">{place.description}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePlace(place.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Plus className="h-4 w-4 rotate-45" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 코스 시작 버튼 */}
      {places.length > 1 && (
        <Button
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium"
          onClick={handleStartCourse}
        >
          <Navigation className="h-4 w-4 mr-2" />
          코스 탐험 시작하기 🚀
        </Button>
      )}
    </div>
  );
};

export default CourseCreation;
