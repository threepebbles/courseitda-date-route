
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Heart, Save, Share, Navigation, Plus } from "lucide-react";
import CourseCreation from "@/components/CourseCreation";
import NavigationMode from "@/components/NavigationMode";
import SavedCourses from "@/components/SavedCourses";
import { toast } from "@/hooks/use-toast";

export interface Place {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  emoji: string;
}

export interface Course {
  id: string;
  title: string;
  places: Place[];
  createdAt: Date;
  memo?: string;
  completed: boolean;
}

const Index = () => {
  const [currentTab, setCurrentTab] = useState("create");
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStartNavigation = (course: Course) => {
    setCurrentCourse(course);
    setIsNavigating(true);
    toast({
      title: "💕 함께 걸어봐요!",
      description: "설레는 데이트 코스가 시작되었습니다.",
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              코스잇다
            </h1>
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <p className="text-gray-600 text-lg">
            연인과 함께하는 특별한 데이트 코스를 만들어보세요 💕
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/70 backdrop-blur-sm">
            <TabsTrigger 
              value="create" 
              className="flex items-center gap-2 data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700"
            >
              <Plus className="h-4 w-4" />
              코스 만들기
            </TabsTrigger>
            <TabsTrigger 
              value="saved"
              className="flex items-center gap-2 data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700"
            >
              <Save className="h-4 w-4" />
              추억 저장소
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <CourseCreation onStartNavigation={handleStartNavigation} />
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
