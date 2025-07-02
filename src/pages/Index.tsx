import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Heart, Save, Share, Navigation, Plus, Search, Compass, Bookmark } from "lucide-react";
import CourseCreation from "@/components/CourseCreation";
import NavigationMode from "@/components/NavigationMode";
import SavedCourses from "@/components/SavedCourses";
import CourseExplorer from "@/components/CourseExplorer";
import FavoriteCourses from "@/components/FavoriteCourses";
import { toast } from "@/hooks/use-toast";

export interface Place {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  emoji: string;
  category: string;
  activityCategory: {
    main: 'eating' | 'viewing' | 'playing' | 'walking';
  };
}

export interface Course {
  id: string;
  title: string;
  places: Place[];
  createdAt: Date;
  memo?: string;
  completed: boolean;
  category: 'date' | 'food' | 'tour' | 'workshop' | 'other';
  tags: string[];
  isPublic?: boolean;
  isFavorited?: boolean;
  favoriteCount?: number;
}

// 활동 카테고리 정의
export const ACTIVITY_CATEGORIES = {
  eating: {
    label: '먹기',
    emoji: '🍽️',
    color: 'bg-red-100 text-red-700 border-red-300',
  },
  viewing: {
    label: '보기', 
    emoji: '🎬',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
  },
  playing: {
    label: '놀기',
    emoji: '🕹️', 
    color: 'bg-green-100 text-green-700 border-green-300',
  },
  walking: {
    label: '걷기',
    emoji: '🚶',
    color: 'bg-blue-100 text-blue-700 border-blue-300', 
  }
};

export const RECOMMENDED_PLACES: Place[] = [
  {
    id: 'rec-1',
    name: '남산타워',
    description: '서울의 랜드마크, 아름다운 야경과 함께하는 데이트 코스',
    lat: 37.5511,
    lng: 126.9882,
    emoji: '🗼',
    category: '관광',
    activityCategory: { main: 'viewing' },
  },
  {
    id: 'rec-2',
    name: '경복궁',
    description: '조선 왕조의 법궁, 고궁의 아름다움을 느낄 수 있는 역사적인 장소',
    lat: 37.5796,
    lng: 126.9770,
    emoji: '🏯',
    category: '역사',
    activityCategory: { main: 'viewing' },
  },
  {
    id: 'rec-3',
    name: '홍대',
    description: '젊음과 예술의 거리, 다양한 맛집과 카페, 즐길 거리가 가득한 곳',
    lat: 37.5577,
    lng: 126.9248,
    emoji: '🎶',
    category: '상업',
    activityCategory: { main: 'playing' },
  },
  {
    id: 'rec-4',
    name: '여의도 한강공원',
    description: '도심 속 힐링 공간, 피크닉과 산책을 즐기기 좋은 곳',
    lat: 37.5283,
    lng: 126.9327,
    emoji: '🌳',
    category: '자연',
    activityCategory: { main: 'walking' },
  },
  {
    id: 'rec-5',
    name: '명동',
    description: '쇼핑과 미식의 천국, 활기찬 분위기에서 다양한 경험을 할 수 있는 곳',
    lat: 37.5636,
    lng: 126.9821,
    emoji: '🛍️',
    category: '상업',
    activityCategory: { main: 'eating' },
  },
];

const Index = () => {
  const [currentTab, setCurrentTab] = useState("create");
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStartNavigation = (course: Course) => {
    setCurrentCourse(course);
    setIsNavigating(true);
    toast({
      title: "🧭 코스 탐방 시작!",
      description: "특별한 여정이 시작되었습니다.",
    });
  };

  const handleCompleteNavigation = (course: Course) => {
    setIsNavigating(false);
    setCurrentTab("saved");
    
    // 코스 저장
    const savedCourses = JSON.parse(localStorage.getItem('savedCourses') || '[]');
    const completedCourse = {
      ...course,
      completed: true,
      createdAt: new Date()
    };
    savedCourses.push(completedCourse);
    localStorage.setItem('savedCourses', JSON.stringify(savedCourses));
    
    toast({
      title: "🎉 코스 완주 완료!",
      description: "소중한 추억이 저장되었습니다.",
    });
  };

  const handleBackToCreate = () => {
    setIsNavigating(false);
    setCurrentCourse(null);
    setCurrentTab("create");
  };

  if (isNavigating && currentCourse) {
    return (
      <NavigationMode 
        course={currentCourse}
        onComplete={() => handleCompleteNavigation(currentCourse)}
        onBack={handleBackToCreate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              코스잇다
            </h1>
            <Compass className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-gray-600 text-lg">
            나만의 특별한 코스를 만들고, 함께 탐방해보세요 ✨
          </p>
          <div className="text-sm text-blue-600 mt-2">
            데이트 • 맛집 탐방 • 여행 • 워크숍 등 다양한 목적의 코스를 만들어보세요
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/70 backdrop-blur-sm">
            <TabsTrigger 
              value="create" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              코스 만들기
            </TabsTrigger>
            <TabsTrigger 
              value="explore"
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <Search className="h-4 w-4" />
              코스 탐색
            </TabsTrigger>
            <TabsTrigger 
              value="favorites"
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <Bookmark className="h-4 w-4" />
              찜한 코스
            </TabsTrigger>
            <TabsTrigger 
              value="saved"
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <Save className="h-4 w-4" />
              나의 보관함
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <CourseCreation onStartNavigation={handleStartNavigation} />
          </TabsContent>
          
          <TabsContent value="explore">
            <CourseExplorer onStartNavigation={handleStartNavigation} />
          </TabsContent>
          
          <TabsContent value="favorites">
            <FavoriteCourses onStartNavigation={handleStartNavigation} />
          </TabsContent>
          
          <TabsContent value="saved">
            <SavedCourses onStartNavigation={handleStartNavigation} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
