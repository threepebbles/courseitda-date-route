import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MapPin, Calendar, Play, Trash2, Edit, Copy, Bookmark } from "lucide-react";
import { Course, ACTIVITY_CATEGORIES } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CATEGORIES = [
  { key: 'date', label: '데이트', emoji: '💕' },
  { key: 'food', label: '맛집', emoji: '🍽️' },
  { key: 'tour', label: '관광', emoji: '🗺️' },
  { key: 'workshop', label: '워크숍', emoji: '🎓' },
  { key: 'other', label: '기타', emoji: '✨' },
];

interface FavoriteCoursesProps {
  onStartNavigation: (course: Course) => void;
}

const FavoriteCourses = ({ onStartNavigation }: FavoriteCoursesProps) => {
  const [favoriteCourses, setFavoriteCourses] = useState<Course[]>([]);
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState("");
  const [memoDialogOpen, setMemoDialogOpen] = useState(false);

  useEffect(() => {
    loadFavoriteCourses();
  }, []);

  const loadFavoriteCourses = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteCourses') || '[]');
    setFavoriteCourses(favorites);
  };

  const removeFavorite = (courseId: string) => {
    const courseToRemove = favoriteCourses.find(course => course.id === courseId);
    const updatedFavorites = favoriteCourses.filter(course => course.id !== courseId);
    setFavoriteCourses(updatedFavorites);
    localStorage.setItem('favoriteCourses', JSON.stringify(updatedFavorites));
    toast({
      title: "💔 찜 해제 완료",
      description: `${courseToRemove?.title}이(가) 찜 목록에서 제거되었습니다.`,
    });
  };

  const duplicateCourse = (course: Course) => {
    const savedCourses = JSON.parse(localStorage.getItem('savedCourses') || '[]');
    const newCourse = {
      ...course,
      id: Date.now().toString(),
      title: `${course.title} (복제본)`,
      createdAt: new Date(),
      completed: false,
      isFavorited: false
    };
    savedCourses.push(newCourse);
    localStorage.setItem('savedCourses', JSON.stringify(savedCourses));
    toast({
      title: "📋 코스 복제 완료!",
      description: "나의 보관함에서 편집하실 수 있습니다.",
    });
  };

  const updateMemo = (courseId: string, memo: string) => {
    const updatedFavorites = favoriteCourses.map(course => 
      course.id === courseId ? { ...course, memo } : course
    );
    setFavoriteCourses(updatedFavorites);
    localStorage.setItem('favoriteCourses', JSON.stringify(updatedFavorites));
    setMemoDialogOpen(false);
    setEditingMemo(null);
    setMemoText("");
    toast({
      title: "💭 메모 저장 완료",
      description: "찜한 코스 메모가 업데이트되었습니다.",
    });
  };

  const openMemoDialog = (course: Course) => {
    setEditingMemo(course.id);
    setMemoText(course.memo || "");
    setMemoDialogOpen(true);
  };

  const getActivityComposition = (course: Course) => {
    const activityCount = {
      eating: 0,
      viewing: 0,
      playing: 0,
      walking: 0,
      shopping: 0,
    };

    course.places.forEach(place => {
      if (place.activityCategory && place.activityCategory.main) {
        place.activityCategory.main.forEach(activity => {
          if (activity in activityCount) {
            activityCount[activity]++;
          }
        });
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

  if (favoriteCourses.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardContent className="py-12 text-center">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            아직 찜한 코스가 없어요
          </h3>
          <p className="text-gray-500 leading-relaxed">
            마음에 드는 코스를 찾아서<br />
            하트를 눌러 찜해보세요 ✨
          </p>
          <div className="mt-4 text-sm text-blue-600">
            코스 탐색에서 다양한 코스를 둘러보세요! 🔍
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          💝 찜한 코스 모음
        </h2>
        <p className="text-gray-600">
          마음에 들어한 특별한 코스들을 다시 만나보세요
        </p>
        <div className="text-sm text-blue-600 mt-2">
          총 {favoriteCourses.length}개의 코스를 찜했어요 ✨
        </div>
      </div>

      {favoriteCourses.map((course) => {
        const categoryInfo = CATEGORIES.find(cat => cat.key === course.category);
        const activityComposition = getActivityComposition(course);
        
        return (
          <Card key={course.id} className="bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-pink-500" />
                    {course.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      찜한 날짜: {new Date().toLocaleDateString('ko-KR')}
                    </CardDescription>
                    {categoryInfo && (
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        {categoryInfo.emoji} {categoryInfo.label}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openMemoDialog(course)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateCourse(course)}
                    className="text-green-600 hover:text-green-800 hover:bg-green-50"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFavorite(course.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 코스 경로 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-gray-700">찜한 코스 경로</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.places.map((place, index) => (
                      <div key={place.id} className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-sm font-medium">
                          <span className="text-xs">{place.emoji}</span>
                          {place.name}
                        </span>
                        {index < course.places.length - 1 && (
                          <span className="text-pink-400 mx-1">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 활동 구성 비율 */}
                {activityComposition.length > 0 && (
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4">
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

                {/* 개인 메모 */}
                {course.memo && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Bookmark className="h-4 w-4 text-gray-500" />
                      나의 메모
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{course.memo}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="px-6 pb-4 flex justify-end">
              <Button
                onClick={() => onStartNavigation(course)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium"
              >
                <Play className="h-4 w-4 mr-2" />
                이 코스로 탐방 시작
              </Button>
            </div>

            <Dialog open={memoDialogOpen} onOpenChange={setMemoDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>메모 수정하기</DialogTitle>
                  <DialogDescription>
                    코스에 대한 개인적인 메모를 자유롭게 작성해주세요.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                  placeholder="코스에 대한 메모를 작성하세요..."
                  rows={5}
                />
                <Button onClick={() => editingMemo && updateMemo(editingMemo, memoText)}>
                  메모 저장
                </Button>
              </DialogContent>
            </Dialog>
          </Card>
        );
      })}
    </div>
  );
};

export default FavoriteCourses;
