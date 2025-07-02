import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar, Share, Play, Trash2, Clock, Users } from "lucide-react";
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
import { Dialog as AlertDialog, DialogContent as AlertDialogContent, DialogHeader as AlertDialogHeader, DialogTitle as AlertDialogTitle, DialogDescription as AlertDialogDescription, DialogTrigger as AlertDialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  { key: 'date', label: '데이트', emoji: '💕' },
  { key: 'food', label: '맛집', emoji: '🍽️' },
  { key: 'tour', label: '관광', emoji: '🗺️' },
  { key: 'workshop', label: '워크숍', emoji: '🎓' },
  { key: 'other', label: '기타', emoji: '✨' },
];

interface SavedCoursesProps {
  onStartNavigation: (course: Course) => void;
}

const SavedCourses = ({ onStartNavigation }: SavedCoursesProps) => {
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [tagInputs, setTagInputs] = useState<{ [courseId: string]: string }>({});
  const [communityDialogOpen, setCommunityDialogOpen] = useState(false);
  const [communityCourse, setCommunityCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadSavedCourses();
  }, []);

  const loadSavedCourses = () => {
    const courses = JSON.parse(localStorage.getItem('savedCourses') || '[]');
    setSavedCourses(courses);
  };

  const deleteCourse = (courseId: string) => {
    const courseToDelete = savedCourses.find(course => course.id === courseId);
    const updatedCourses = savedCourses.filter(course => course.id !== courseId);
    setSavedCourses(updatedCourses);
    localStorage.setItem('savedCourses', JSON.stringify(updatedCourses));
    toast({
      title: "코스가 삭제되었습니다 🗑️",
      description: `${courseToDelete?.title}이(가) 보관함에서 삭제되었습니다.`,
    });
  };

  const shareCourse = (course: Course) => {
    setSelectedCourse(course);
    setShareDialogOpen(true);
  };

  const copyShareLink = async () => {
    if (selectedCourse) {
      const categoryInfo = CATEGORIES.find(cat => cat.key === selectedCourse.category);
      const shareData = {
        title: selectedCourse.title,
        category: categoryInfo ? `${categoryInfo.emoji} ${categoryInfo.label}` : '✨ 기타',
        places: selectedCourse.places.map(p => p.name).join(' → '),
        date: new Date(selectedCourse.createdAt).toLocaleDateString('ko-KR'),
        tags: selectedCourse.tags.length > 0 ? selectedCourse.tags.join(', ') : ''
      };
      
      const shareText = `🧭 ${shareData.title} 🧭\n\n📂 카테고리: ${shareData.category}\n📍 경로: ${shareData.places}\n📅 날짜: ${shareData.date}${shareData.tags ? '\n🏷️ 태그: ' + shareData.tags : ''}\n\n✨ 코스잇다에서 만든 특별한 코스예요!\n함께 탐방해보시는 건 어떨까요? 🚀`;
      
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "🔗 클립보드에 복사 완료!",
          description: "소중한 사람과 함께 공유해보세요.",
        });
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        toast({
          title: "❌ 클립보드 복사 실패",
          description: "클립보드 복사에 실패했습니다. 수동으로 복사해주세요.",
          variant: "destructive",
        });
      }
      setShareDialogOpen(false);
    }
  };

  // 커뮤니티에 공유 함수
  const handleCommunityShare = (course: Course) => {
    setCommunityCourse(course);
    setCommunityDialogOpen(true);
  };

  const confirmCommunityShare = () => {
    if (!communityCourse) return;
    // 기존 communityCourses 불러오기
    const communityCourses = JSON.parse(localStorage.getItem('communityCourses') || '[]');
    // 중복 업로드 방지 (id 기준)
    if (communityCourses.some((c: Course) => c.id === communityCourse.id)) {
      toast({ title: '이미 업로드된 코스입니다.', description: '이 코스는 이미 커뮤니티에 공유되었습니다.' });
      setCommunityDialogOpen(false);
      return;
    }
    communityCourses.push(communityCourse);
    localStorage.setItem('communityCourses', JSON.stringify(communityCourses));
    toast({ title: '커뮤니티에 공유 완료!', description: '코스가 커뮤니티에 업로드되었습니다.' });
    setCommunityDialogOpen(false);
  };

  // 태그 추가 함수
  const addTagToCourse = (courseId: string) => {
    const tag = (tagInputs[courseId] || '').trim();
    if (!tag) return;
    setSavedCourses(prev => {
      const updated = prev.map(course => {
        if (course.id === courseId) {
          // 중복 방지
          if (course.tags.includes(tag)) return course;
          const newTags = [...course.tags, tag];
          const updatedCourse = { ...course, tags: newTags };
          return updatedCourse;
        }
        return course;
      });
      localStorage.setItem('savedCourses', JSON.stringify(updated));
      return updated;
    });
    setTagInputs(prev => ({ ...prev, [courseId]: '' }));
  };

  if (savedCourses.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
        <CardContent className="py-12 text-center">
          <div className="text-6xl mb-4">🗂️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            아직 저장된 코스가 없어요
          </h3>
          <p className="text-gray-500 leading-relaxed">
            코스를 완주하면<br />
            소중한 기록이 여기에 저장됩니다 ✨
          </p>
          <div className="mt-4 text-sm text-blue-600">
            첫 번째 코스를 만들어보세요! 🧭
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          🗂️ 나의 코스 보관함
        </h2>
        <p className="text-gray-600">
          함께 탐방했던 소중한 코스들을 다시 만나보세요
        </p>
        <div className="text-sm text-blue-600 mt-2">
          총 {savedCourses.length}개의 코스가 저장되어 있어요 ✨
        </div>
      </div>

      {savedCourses.map((course) => {
        const categoryInfo = CATEGORIES.find(cat => cat.key === course.category);
        return (
          <Card key={course.id} className="bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {course.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(course.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
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
                    onClick={() => shareCourse(course)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCourse(course.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-gray-700">탐방 경로</span>
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
                {course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {course.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {/* 해시태그 추가 입력 */}
                <div className="flex gap-2 items-center mb-2">
                  <Input
                    value={tagInputs[course.id] || ''}
                    onChange={e => setTagInputs(prev => ({ ...prev, [course.id]: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') addTagToCourse(course.id);
                    }}
                    placeholder="해시태그 입력 후 Enter 또는 추가"
                    className="w-40 text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => addTagToCourse(course.id)}
                  >
                    추가
                  </Button>
                </div>

                {/* 메모 */}
                {course.memo && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600 italic">
                      "{course.memo}"
                    </div>
                  </div>
                )}

                {/* 통계 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="text-blue-500">📍</span>
                      총 {course.places.length}개 장소
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-green-500">✅</span>
                      완주 완료
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      특별한 기록
                    </span>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => onStartNavigation({...course, id: Date.now().toString()})}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    이 코스 다시 탐방하기 🧭
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-blue-700 border-blue-300"
                    onClick={() => handleCommunityShare(course)}
                  >
                    커뮤니티에 공유
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* 공유 다이얼로그 */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <Share className="h-5 w-5" />
              🔗 코스 공유하기
            </DialogTitle>
            <DialogDescription>
              소중한 사람과 함께 이 특별한 코스를 공유해보세요!
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedCourse.title}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  📍 {selectedCourse.places.map(p => p.name).join(' → ')}
                </div>
                <div className="text-xs text-gray-500">
                  📅 {new Date(selectedCourse.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </div>
              <Button 
                onClick={copyShareLink} 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                🔗 클립보드에 복사하기
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 커뮤니티 공유 다이얼로그 */}
      <AlertDialog open={communityDialogOpen} onOpenChange={setCommunityDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-blue-700">커뮤니티에 공유하기</AlertDialogTitle>
            <AlertDialogDescription>
              이 코스를 커뮤니티에 공유하시겠습니까?<br />공유 후에는 코스 탐색 탭에서 확인할 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 mt-4">
            <Button onClick={confirmCommunityShare} className="bg-blue-600 text-white w-full">커뮤니티에 공유</Button>
            <Button variant="outline" onClick={() => setCommunityDialogOpen(false)} className="w-full">취소</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedCourses;
