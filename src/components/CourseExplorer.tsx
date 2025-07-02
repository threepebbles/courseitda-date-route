import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Heart, Play, Users, Clock, Bookmark } from "lucide-react";
import type { Course, Place } from "@/pages/Index";
import { ACTIVITY_CATEGORIES, RECOMMENDED_PLACES } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";

// Helper to get place by name (or id) from RECOMMENDED_PLACES
function getPlaceByName(name: string) {
  return RECOMMENDED_PLACES.find(p => p.name === name);
}

const CATEGORIES = [
  { key: 'all', label: '전체', emoji: '🌟' },
  { key: 'date', label: '데이트', emoji: '💕' },
  { key: 'food', label: '맛집', emoji: '🍽️' },
  { key: 'tour', label: '관광', emoji: '🗺️' },
  { key: 'workshop', label: '워크숍', emoji: '🎓' },
];

interface CourseExplorerProps {
  onStartNavigation: (course: Course) => void;
}

const CourseExplorer = ({ onStartNavigation }: CourseExplorerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "rec-1",
      title: "성수동 힙한 데이트 코스",
      places: [
        getPlaceByName('팀랩 몰입형 미디어아트 전시관'),
        getPlaceByName('젠틀몬스터 플래그십스토어 가로수길'),
        getPlaceByName('블루보틀 삼청점'),
      ].filter(Boolean) as Place[],
      createdAt: new Date('2024-01-15'),
      completed: true,
      category: 'date',
      tags: ['힙한', '성수동', '야경', '데이트'],
      isPublic: true
    },
    {
      id: "rec-2",
      title: "홍대 맛집 탐방 코스",
      places: [
        getPlaceByName('쉐이크쉑 강남점'),
        getPlaceByName('스타벅스 더종로점'),
        getPlaceByName('방탈출 카페 코드케이 강남점'),
      ].filter(Boolean) as Place[],
      createdAt: new Date('2024-01-20'),
      completed: true,
      category: 'food',
      tags: ['맛집', '홍대', '파티', '친구'],
      isPublic: true
    },
    {
      id: "rec-3",
      title: "북촌한옥마을 문화 탐방",
      places: [
        getPlaceByName('국립현대미술관 서울관'),
        getPlaceByName('아크앤북 시청점'),
        getPlaceByName('호텔 델루나 세트장 (익선동)'),
      ].filter(Boolean) as Place[],
      createdAt: new Date('2024-01-25'),
      completed: true,
      category: 'tour',
      tags: ['문화', '전통', '한옥', '관광'],
      isPublic: true
    }
  ]);
  const [favoritedCourses, setFavoritedCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load favorited courses from localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteCourses') || '[]');
    const favoriteIds = new Set<string>(favorites.map((course: Course) => course.id));
    setFavoritedCourses(favoriteIds);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         course.places.some(place => place.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory && course.isPublic;
  });

  const handleStartCourse = (course: Course) => {
    const newCourse = {
      ...course,
      id: Date.now().toString(), // 새로운 ID로 실행
      completed: false
    };
    onStartNavigation(newCourse);
  };

  const toggleFavorite = (course: Course) => {
    const favorites = JSON.parse(localStorage.getItem('favoriteCourses') || '[]');
    const isCurrentlyFavorited = favoritedCourses.has(course.id);
    
    if (isCurrentlyFavorited) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((fav: Course) => fav.id !== course.id);
      localStorage.setItem('favoriteCourses', JSON.stringify(updatedFavorites));
      setFavoritedCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(course.id);
        return newSet;
      });
      toast({
        title: "💔 찜 해제",
        description: `${course.title}을(를) 찜 목록에서 제거했습니다.`,
      });
    } else {
      // Add to favorites
      const courseWithFavoriteInfo = {
        ...course,
        isFavorited: true,
        favoritedAt: new Date()
      };
      favorites.push(courseWithFavoriteInfo);
      localStorage.setItem('favoriteCourses', JSON.stringify(favorites));
      setFavoritedCourses(prev => new Set([...prev, course.id]));
      toast({
        title: "💕 찜 완료!",
        description: `${course.title}을(를) 찜 목록에 추가했습니다.`,
      });
    }
  };

  const getActivityComposition = (course: Course) => {
    const activityCount = {
      eating: 0,
      viewing: 0,
      playing: 0,
      walking: 0
    };

    course.places.forEach(place => {
      if (place.activityCategory) {
        activityCount[place.activityCategory.main]++;
      }
    });

    const total = course.places.length;
    const composition = Object.entries(activityCount)
      .filter(([_, count]) => count > 0)
      .map(([activity, count]) => ({
        activity: activity as keyof typeof ACTIVITY_CATEGORIES,
        percentage: Math.round((count / total) * 100)
      }));

    return composition;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="py-6 text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">🔍 코스 탐색하기</h2>
          <p className="text-gray-600">
            다른 사용자들이 만든 특별한 코스를 발견하고 함께 탐방해보세요
          </p>
        </CardContent>
      </Card>

      {/* 검색 및 필터 */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Search className="h-5 w-5" />
            코스 검색
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="코스 이름, 태그, 장소명으로 검색해보세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-blue-200 focus:border-blue-400"
          />
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Badge
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                className={`cursor-pointer hover:bg-blue-100 ${
                  selectedCategory === category.key 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'border-blue-300 text-blue-700'
                }`}
                onClick={() => setSelectedCategory(category.key)}
              >
                <span className="mr-1">{category.emoji}</span>
                {category.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 검색 결과 */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-500">
                다른 검색어나 카테고리를 시도해보세요
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course) => {
            const activityComposition = getActivityComposition(course);
            const isFavorited = favoritedCourses.has(course.id);
            
            return (
              <Card key={course.id} className="bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-blue-700 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {course.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(course.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {Math.floor(Math.random() * 50) + 10}명 탐방
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-pink-500" />
                          {Math.floor(Math.random() * 20) + 5}개 찜
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      {CATEGORIES.find(cat => cat.key === course.category)?.emoji} {CATEGORIES.find(cat => cat.key === course.category)?.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 코스 경로 */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-gray-700">코스 경로</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {course.places.map((place, index) => (
                          <div key={place.id} className="flex items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium">
                              <span className="text-xs">{place.emoji}</span>
                              {place.name}
                            </span>
                            {index < course.places.length - 1 && (
                              <span className="text-blue-400 mx-1">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 활동 구성 비율 */}
                    {activityComposition.length > 0 && (
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">🎯 활동 구성</div>
                        <div className="flex flex-wrap gap-2">
                          {activityComposition.map(({ activity, percentage }) => (
                            <Badge 
                              key={activity} 
                              className={`text-xs ${ACTIVITY_CATEGORIES[activity].color}`}
                            >
                              {ACTIVITY_CATEGORIES[activity].emoji} {ACTIVITY_CATEGORIES[activity].label} {percentage}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1">
                      {course.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleStartCourse(course)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        이 코스 탐방하기
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleFavorite(course)}
                        className={`border-pink-300 hover:bg-pink-50 ${
                          isFavorited 
                            ? 'text-pink-700 bg-pink-50' 
                            : 'text-pink-600'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CourseExplorer;
