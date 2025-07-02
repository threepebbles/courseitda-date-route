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
    main: (keyof typeof ACTIVITY_CATEGORIES)[];
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
    name: 'CGV 용산아이파크몰',
    description: '다양한 영화를 즐길 수 있는 현대적인 영화관',
    lat: 37.5303,
    lng: 126.9638,
    emoji: '🎬',
    category: '영화관',
    activityCategory: { main: ['viewing', 'playing'] },
  },
  {
    id: 'rec-2',
    name: '블루보틀 삼청점',
    description: '고즈넉한 한옥에서 즐기는 특별한 커피 경험',
    lat: 37.5873,
    lng: 126.9806,
    emoji: '☕',
    category: '카페',
    activityCategory: { main: ['eating', 'walking', 'viewing'] },
  },
  {
    id: 'rec-3',
    name: '쉐이크쉑 강남점',
    description: '미국 본토의 맛을 느낄 수 있는 인기 수제버거 맛집',
    lat: 37.4998,
    lng: 127.0278,
    emoji: '🍔',
    category: '음식점',
    activityCategory: { main: ['eating'] },
  },
  {
    id: 'rec-4',
    name: '팀랩 몰입형 미디어아트 전시관',
    description: '빛과 예술이 어우러진 환상적인 몰입형 미디어아트 전시',
    lat: 37.5451,
    lng: 127.0422,
    emoji: '🎨',
    category: '전시관',
    activityCategory: { main: ['viewing', 'playing'] },
  },
  {
    id: 'rec-5',
    name: '아크앤북 시청점',
    description: '책과 라이프스타일이 결합된 독특한 북카페 서점',
    lat: 37.5654,
    lng: 126.9790,
    emoji: '📚',
    category: '문화시설',
    activityCategory: { main: ['viewing', 'eating'] },
  },
  {
    id: 'rec-6',
    name: '젠틀몬스터 플래그십스토어 가로수길',
    description: '독특한 디자인의 안경과 선글라스를 만날 수 있는 핫플레이스',
    lat: 37.5215,
    lng: 127.0221,
    emoji: '👓',
    category: '쇼핑',
    activityCategory: { main: ['viewing', 'playing'] },
  },
  {
    id: 'rec-7',
    name: '남산 돈까스',
    description: '남산의 명물, 바삭하고 두툼한 돈까스 전문점',
    lat: 37.5511,
    lng: 126.9870,
    emoji: '🍴',
    category: '음식점',
    activityCategory: { main: ['eating'] },
  },
  {
    id: 'rec-8',
    name: '국립현대미술관 서울관',
    description: '다양한 현대 미술 작품을 감상할 수 있는 미술관',
    lat: 37.5762,
    lng: 126.9800,
    emoji: '🖼️',
    category: '미술관',
    activityCategory: { main: ['viewing', 'walking'] },
  },
  {
    id: 'rec-9',
    name: '스타벅스 더종로점',
    description: '넓고 쾌적한 공간에서 다양한 음료와 디저트를 즐길 수 있는 대형 스타벅스',
    lat: 37.5701,
    lng: 126.9847,
    emoji: '☕',
    category: '카페',
    activityCategory: { main: ['eating', 'viewing', 'walking'] },
  },
  {
    id: 'rec-10',
    name: '방탈출 카페 코드케이 강남점',
    description: '친구들과 함께 즐거운 시간을 보낼 수 있는 인기 방탈출 카페',
    lat: 37.4984,
    lng: 127.0273,
    emoji: '🔑',
    category: '놀이',
    activityCategory: { main: ['playing'] },
  },
  {
    id: 'rec-11',
    name: '교보문고 광화문점',
    description: '다양한 서적과 문구류를 판매하는 대형 서점, 책 읽기 좋은 공간',
    lat: 37.5700,
    lng: 126.9774,
    emoji: '📚',
    category: '서점',
    activityCategory: { main: ['viewing', 'walking'] },
  },
  {
    id: 'rec-12',
    name: '호텔 델루나 세트장 (익선동)',
    description: '드라마 촬영지로 유명한 아름다운 한옥 골목, 포토존이 가득한 곳',
    lat: 37.5746,
    lng: 126.9901,
    emoji: '📸',
    category: '관광',
    activityCategory: { main: ['viewing', 'walking', 'eating'] },
  },
  {
    id: 'rec-13',
    name: '더현대서울',
    description: 'MZ세대에게 인기 많은 현대적인 백화점, 쇼핑과 다양한 볼거리',
    lat: 37.5259,
    lng: 126.9288,
    emoji: '🛍️',
    category: '쇼핑',
    activityCategory: { main: ['playing', 'eating', 'walking', 'viewing'] },
  },
  {
    id: 'rec-14',
    name: '을지로 골목 맛집 (만선호프)',
    description: '힙지로의 대표적인 노포 호프집, 시원한 맥주와 맛있는 안주',
    lat: 37.5658,
    lng: 126.9912,
    emoji: '🍻',
    category: '음식점',
    activityCategory: { main: ['eating', 'playing', 'walking'] },
  },
  {
    id: 'rec-15',
    name: '서울식물원',
    description: '다양한 식물들을 만날 수 있는 도심 속 식물원, 산책하기 좋은 곳',
    lat: 37.5700,
    lng: 126.8286,
    emoji: '🌿',
    category: '자연',
    activityCategory: { main: ['walking', 'viewing'] },
  },
  {
    id: 'rec-16',
    name: 'N서울타워',
    description: '서울 전경을 한눈에 볼 수 있는 전망대, 야경이 특히 아름다운 곳',
    lat: 37.5511,
    lng: 126.9882,
    emoji: '🗼',
    category: '관광',
    activityCategory: { main: ['viewing', 'walking', 'eating'] },
  },
  {
    id: 'rec-17',
    name: '카카오프렌즈샵 강남',
    description: '귀여운 카카오프렌즈 캐릭터 상품들을 만날 수 있는 곳',
    lat: 37.4981,
    lng: 127.0275,
    emoji: '🧸',
    category: '쇼핑',
    activityCategory: { main: ['playing', 'viewing'] },
  },
  {
    id: 'rec-18',
    name: '봉은사',
    description: '도심 속 고즈넉한 사찰, 마음의 평화를 찾을 수 있는 곳',
    lat: 37.5140,
    lng: 127.0583,
    emoji: '🧘‍♀️',
    category: '문화유산',
    activityCategory: { main: ['walking', 'viewing'] },
  },
  {
    id: 'rec-19',
    name: '아모레퍼시픽 미술관',
    description: '현대 미술과 한국 전통 미학이 어우러진 전시 공간',
    lat: 37.5586,
    lng: 126.9734,
    emoji: '🎨',
    category: '미술관',
    activityCategory: { main: ['viewing', 'walking'] },
  },
  {
    id: 'rec-20',
    name: '명화극장 (종로3가)',
    description: '오래된 분위기의 독립영화 상영관, 추억의 영화를 감상하기 좋은 곳',
    lat: 37.5714,
    lng: 126.9918,
    emoji: '🎞️',
    category: '영화관',
    activityCategory: { main: ['viewing', 'playing'] },
  },
  {
    id: 'rec-21',
    name: '을지로 만선호프',
    description: '힙한 분위기의 야외 테이블에서 즐기는 시원한 맥주',
    lat: 37.5658,
    lng: 126.9912,
    emoji: '🍺',
    category: '음식점',
    activityCategory: { main: ['eating', 'playing', 'walking'] },
  },
  {
    id: 'rec-22',
    name: '광화문 광장',
    description: '이순신 장군 동상과 세종대왕 동상이 있는 역사적인 광장',
    lat: 37.5759,
    lng: 126.9769,
    emoji: '🏛️',
    category: '관광',
    activityCategory: { main: ['walking', 'viewing'] },
  },
  {
    id: 'rec-23',
    name: '연남동 카페 거리',
    description: '개성 넘치는 작은 카페와 소품샵이 많은 아기자기한 동네',
    lat: 37.5599,
    lng: 126.9242,
    emoji: '☕',
    category: '카페',
    activityCategory: { main: ['eating', 'walking', 'viewing'] },
  },
  {
    id: 'rec-24',
    name: 'VR 스퀘어 홍대점',
    description: '다양한 VR 게임을 체험할 수 있는 가상현실 테마파크',
    lat: 37.5552,
    lng: 126.9213,
    emoji: '🎮',
    category: '놀이',
    activityCategory: { main: ['playing', 'viewing'] },
  },
  {
    id: 'rec-25',
    name: '코엑스 별마당 도서관',
    description: '아름다운 인테리어와 수많은 책이 있는 복합문화공간',
    lat: 37.5106,
    lng: 127.0585,
    emoji: '📚',
    category: '도서관',
    activityCategory: { main: ['viewing', 'walking', 'eating'] },
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
