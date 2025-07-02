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
import { Place, Course, ACTIVITY_CATEGORIES, RECOMMENDED_PLACES } from "@/lib/data";

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-heading">
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
