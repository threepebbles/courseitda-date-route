import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MapPin, Navigation, Search } from "lucide-react";
import type { Place, Course } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";
import { ACTIVITY_CATEGORIES, RECOMMENDED_PLACES } from "@/pages/Index";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PlaceCard from '@/components/common/PlaceCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseCreationProps {
  onStartNavigation: (course: Course) => void;
}

function DraggablePlace({ place, removePlace, id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <PlaceCard
      place={place}
      onRemove={removePlace}
      isRemovable={true}
      ref={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
      isDragging={isDragging}
    />
  );
}

const CourseCreation = ({ onStartNavigation }: CourseCreationProps) => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCategory, setCourseCategory] = useState<Course['category']>('date');
  const [places, setPlaces] = useState<Place[]>([]);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceDescription, setNewPlaceDescription] = useState("");
  const [newPlaceEmoji, setNewPlaceEmoji] = useState("📍");
  const [newPlaceCategory, setNewPlaceCategory] = useState("기타");
  const [newPlaceActivityCategory, setNewPlaceActivityCategory] = useState<
    Array<'eating' | 'viewing' | 'playing' | 'walking'>>(['eating']);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Place[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filtered = RECOMMENDED_PLACES.filter(
      (place) =>
        place.name.includes(searchTerm) ||
        place.description.includes(searchTerm)
    );
    setSearchResults(filtered);
  }, [searchTerm]);

  const addPlace = (place: Place) => {
    setPlaces([...places, place]);
    setNewPlaceName("");
    setNewPlaceDescription("");
    setNewPlaceEmoji("📍");
    setNewPlaceCategory("기타");
    setNewPlaceActivityCategory(['eating']); // Reset to default
    setSearchTerm("");
    toast({
      title: "✨ 장소가 추가되었습니다!",
      description: `${place.name}이(가) 코스에 추가되었어요.`,
    });
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
      category: courseCategory,
      tags: [],
      isPublic: true
    };

    onStartNavigation(newCourse);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = places.findIndex((p) => p.id === active.id);
      const newIndex = places.findIndex((p) => p.id === over.id);
      setPlaces((places) => arrayMove(places, oldIndex, newIndex));
    }
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
          <div className="mt-4">
            <Label htmlFor="course-category" className="mb-2 block text-sm font-medium text-gray-700">
              코스 카테고리
            </Label>
            <Select onValueChange={(value: Course['category']) => setCourseCategory(value)} defaultValue={courseCategory}>
              <SelectTrigger id="course-category" className="w-full border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">데이트</SelectItem>
                <SelectItem value="food">맛집</SelectItem>
                <SelectItem value="tour">관광</SelectItem>
                <SelectItem value="workshop">워크숍</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="장소 이름을 검색해보세요 (예: 남산타워)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-blue-200 focus:border-blue-400"
            />
          </div>

          {searchTerm.trim() === "" ? (
            // Recommended Places
            <div className="mt-4">
              <Label className="text-sm text-gray-600 mb-2 block">추천 장소</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {RECOMMENDED_PLACES.slice(0, 6).map((place) => (
                  <PlaceCard 
                    key={place.id} 
                    place={place} 
                    onClick={addPlace}
                  />
                ))}
              </div>
            </div>
          ) : (
            // Search Results
            <div className="mt-4">
              <Label className="text-sm text-gray-600 mb-2 block">검색 결과</Label>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchResults.map((place) => (
                    <PlaceCard 
                      key={place.id} 
                      place={place} 
                      onClick={addPlace}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">검색 결과가 없습니다.</p>
              )}
            </div>
          )}

          {/* 활동 카테고리 선택 (Simplified) */}
          {/* <div>
            <Label>활동 카테고리</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(ACTIVITY_CATEGORIES).map(([key, category]) => (
                <Badge
                  key={key}
                  variant={newPlaceActivityCategory.includes(key as any) ? "default" : "outline"}
                  className={`cursor-pointer hover:bg-opacity-80 ${
                    newPlaceActivityCategory.includes(key as any)
                      ? category.color.replace('bg-', 'bg-').replace('text-', 'text-').replace('border-', 'border-')
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    const mainCategory = key as 'eating' | 'viewing' | 'playing' | 'walking';
                    setNewPlaceActivityCategory(prevCategories => {
                      if (prevCategories.includes(mainCategory)) {
                        return prevCategories.filter(cat => cat !== mainCategory);
                      } else {
                        return [...prevCategories, mainCategory];
                      }
                    });
                  }}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.label}
                </Badge>
              ))}
            </div>
          </div> */}
          
          {/* <Button 
            onClick={() => {
              if (searchResults.length > 0 && searchTerm.trim() !== "") {
                addPlace(searchResults[0]);
              } else if (searchTerm.trim() === "") {
                toast({
                  title: "⚠️ 장소를 검색하거나 추천 장소를 선택해주세요!",
                  description: "추가할 장소를 선택해야 합니다.",
                });
              } else {
                toast({
                  title: "⚠️ 장소를 찾을 수 없습니다!",
                  description: "다른 검색어로 시도하거나 직접 장소를 추가해주세요.",
                });
              }
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            선택한 장소 추가하기
          </Button> */}
        </CardContent>
      </Card>

      {/* 추가된 장소 목록 */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            현재 코스에 추가된 장소 ({places.length}개)
          </CardTitle>
          <CardDescription>
            아래 순서대로 코스가 진행됩니다. 드래그하여 순서를 변경할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {places.length === 0 ? (
            <p className="text-gray-500 text-sm">아직 추가된 장소가 없습니다.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={places.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {places.map((place) => (
                    <DraggablePlace key={place.id} place={place} removePlace={removePlace} id={place.id} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* 코스 시작 버튼 */}
      <Button 
        onClick={handleStartCourse}
        className="w-full py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg shadow-lg"
      >
        <Navigation className="h-6 w-6 mr-2" />
        이 코스로 탐방 시작하기
      </Button>
    </div>
  );
};

export default CourseCreation;
