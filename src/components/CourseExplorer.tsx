
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Heart, Play, Users, Clock } from "lucide-react";
import type { Course } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";

// 추천 코스 데이터 (실제로는 API에서 가져올 데이터)
const RECOMMENDED_COURSES: Course[] = [
  {
    id: "rec-1",
    title: "성수동 힙한 데이트 코스",
    places: [
      { id: "1", name: "성수연방", description: "트렌디한 복합문화공간", lat: 37.5459, lng: 127.0557, emoji: "🎨", category: "카페" },
      { id: "2", name: "언더스탠드에비뉴", description: "개성 넘치는 편집샵", lat: 37.5463, lng: 127.0543, emoji: "👕", category: "쇼핑" },
      { id: "3", name: "성수 뚝방", description: "한강 야경 감상", lat: 37.5476, lng: 127.0594, emoji: "🌉", category: "야경" },
    ],
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
      { id: "4", name: "연트럴파크", description: "유명한 파스타 맛집", lat: 37.5547, lng: 126.9236, emoji: "🍝", category: "이탈리안" },
      { id: "5", name: "망원한강공원", description: "치킨과 맥주 한 잔", lat: 37.5538, lng: 126.8944, emoji: "🍗", category: "치킨" },
      { id: "6", name: "홍대 놀이터", description: "야식과 함께하는 밤", lat: 37.5547, lng: 126.9236, emoji: "🌃", category: "야식" },
    ],
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
      { id: "7", name: "북촌한옥마을", description: "전통 한옥의 아름다움", lat: 37.5824, lng: 126.9834, emoji: "🏘️", category: "문화" },
      { id: "8", name: "인사동 쌈지길", description: "전통 공예품 구경", lat: 37.5759, lng: 126.9835, emoji: "🎎", category: "쇼핑" },
      { id: "9", name: "창덕궁", description: "조선 왕조의 별궁", lat: 37.5794, lng: 126.9910, emoji: "🏯", category: "궁궐" },
    ],
    createdAt: new Date('2024-01-25'),
    completed: true,
    category: 'tour',
    tags: ['문화', '전통', '한옥', '관광'],
    isPublic: true
  }
];

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
  const [courses, setCourses] = useState<Course[]>(RECOMMENDED_COURSES);

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
          filteredCourses.map((course) => (
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
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseExplorer;
