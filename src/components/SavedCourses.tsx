
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, MapPin, Calendar, Share, Play, Trash2 } from "lucide-react";
import type { Course } from "@/pages/Index";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SavedCoursesProps {
  onStartNavigation: (course: Course) => void;
}

const SavedCourses = ({ onStartNavigation }: SavedCoursesProps) => {
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadSavedCourses();
  }, []);

  const loadSavedCourses = () => {
    const courses = JSON.parse(localStorage.getItem('savedCourses') || '[]');
    setSavedCourses(courses);
  };

  const deleteCourse = (courseId: string) => {
    const updatedCourses = savedCourses.filter(course => course.id !== courseId);
    setSavedCourses(updatedCourses);
    localStorage.setItem('savedCourses', JSON.stringify(updatedCourses));
    toast({
      title: "코스가 삭제되었습니다",
      description: "선택한 코스가 추억 저장소에서 삭제되었습니다.",
    });
  };

  const shareCourse = (course: Course) => {
    setSelectedCourse(course);
    setShareDialogOpen(true);
  };

  const copyShareLink = () => {
    if (selectedCourse) {
      const shareData = {
        title: selectedCourse.title,
        places: selectedCourse.places.map(p => p.name).join(' → ')
      };
      const shareText = `${shareData.title}\n경로: ${shareData.places}\n\n코스잇다에서 만든 데이트 코스예요! 💕`;
      navigator.clipboard.writeText(shareText);
      toast({
        title: "클립보드에 복사되었습니다!",
        description: "친구들과 공유해보세요.",
      });
      setShareDialogOpen(false);
    }
  };

  if (savedCourses.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
        <CardContent className="py-12 text-center">
          <Heart className="h-16 w-16 text-pink-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            아직 저장된 추억이 없어요
          </h3>
          <p className="text-gray-500">
            데이트 코스를 완주하면 소중한 추억이 여기에 저장됩니다 💕
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-pink-700 mb-2">
          💕 추억 저장소
        </h2>
        <p className="text-gray-600">
          함께 걸었던 소중한 데이트 코스들을 다시 만나보세요
        </p>
      </div>

      {savedCourses.map((course) => (
        <Card key={course.id} className="bg-white/70 backdrop-blur-sm border-pink-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-pink-700 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {course.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(course.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => shareCourse(course)}
                  className="text-pink-600 hover:text-pink-800"
                >
                  <Share className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCourse(course.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 코스 경로 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-pink-500" />
                  <span className="font-medium text-gray-700">코스 경로</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.places.map((place, index) => (
                    <div key={place.id} className="flex items-center gap-1">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                        <span className="text-xs">{place.emoji}</span>
                        {place.name}
                      </span>
                      {index < course.places.length - 1 && (
                        <span className="text-gray-400">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 통계 */}
              <div className="flex items-center gap-4 text-sm text-gray-600 bg-pink-50 rounded-lg p-3">
                <span>총 {course.places.length}개 장소</span>
                <span>•</span>
                <span>완주 완료 ✅</span>
              </div>

              {/* 액션 버튼 */}
              <Button
                onClick={() => onStartNavigation({...course, id: Date.now().toString()})}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                이 코스 다시 걷기
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 공유 다이얼로그 */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-pink-700">
              <Share className="h-5 w-5" />
              코스 공유하기
            </DialogTitle>
            <DialogDescription>
              친구들과 함께 이 코스를 공유해보세요!
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <div className="p-4 bg-pink-50 rounded-lg">
                <div className="font-medium text-pink-700 mb-2">{selectedCourse.title}</div>
                <div className="text-sm text-gray-600">
                  {selectedCourse.places.map(p => p.name).join(' → ')}
                </div>
              </div>
              <Button onClick={copyShareLink} className="w-full">
                클립보드에 복사하기
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedCourses;
