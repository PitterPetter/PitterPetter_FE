// 코스 연결 컴포넌트

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useMemo } from "react";
import { Course } from "../types";
import { useDiaryStore } from "../../../shared/store/diary.store";
import { courseApi } from "../api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../../../shared/ui/spinner";

export const ConnectCourse = () => {
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { courseId, setCourseId, courseName, setCourseName } = useDiaryStore();

  const { data: courseList, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await courseApi.getCourseList();
      console.log(response);
      // API 응답 데이터를 정규화 (course 타입에 맞게)
      const normalizedData = response.data?.map((item: any) => ({
        courseId: item.courseId || item.course_id || item.id,
        title: item.title,
        excerpt: item.description || item.excerpt,
        updatedAt: item.updatedAt || new Date().toISOString(),
        likeCount: item.likeCount || 0,
        lat: item.lat || 0,
        lng: item.lng || 0,
        isLiked: item.isLiked || false
      }));
      return normalizedData;
    }
  });
  const courseData = useMemo(() => {
    return courseList || [];
  }, [courseList]);

  useEffect(() => {
    setSearchResults(courseData);
    // 기존 courseId가 있으면 검색어에 설정
    if (courseId) {
      setSearchTerm(courseId);
      handleCourseSelect(courseId);
    }
  }, [courseData, courseId]);

  // 코스 선택
  const handleCourseSelect = (courseId: number | string) => {
    const selectedCourse = courseData.find(course => course.courseId === courseId);
    setSearchTerm(String(courseId));
    setCourseId(String(courseId));
    if (selectedCourse) {
      setCourseName(selectedCourse.title);
    }
    handleInputChange({ target: { value: String(courseId) } } as React.ChangeEvent<HTMLInputElement>);
  };

  // 검색어 입력
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      const filtered = courseData.filter(item => 
        String(item.courseId).toLowerCase().includes(value.toLowerCase()) ||
        String(item.title).toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(courseData);
    }
  };

  // 검색어 입력 키
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const exactMatch = courseData.find(item => 
        String(item.courseId).toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (exactMatch) {
        setCourseId(String(exactMatch.courseId));
        setSearchTerm(String(exactMatch.courseId));
        setSearchResults([exactMatch]);
      }
    }
  };
  return (
    <div className="h-full rounded-2xl p-4 pb-6 w-[800px] flex flex-col gap-4 bg-white">
      <h1 className="text-2xl">코스 연결</h1>
      <div className="flex flex-col gap-2">
        연관 코스 코드
        <div className="flex gap-2">
          <input 
            type="text" 
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="w-full h-[42px] rounded-md text-[#93000A] p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#93000A]/20 focus:border-transparent" 
            placeholder="코스 ID 또는 제목으로 검색"
          />
          <button 
            onClick={() => handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
            className="w-[120px] h-[42px] rounded-md p-3 bg-third/60 cursor-pointer border border-third/60 text-white flex items-center justify-center gap-2 hover:bg-third/80 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-[12px] h-[12px]" />
            검색
          </button>
        </div>
        <div className="mt-3 border border-gray-200 rounded-lg bg-white shadow-sm max-h-40 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full w-full py-4">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center py-2 text-red-500">에러가 발생했습니다: {error.message}</div>
          ) : (
            searchResults.map((item: Course) => (
            <div 
              key={item.courseId} 
              onClick={() => handleCourseSelect(item.courseId)}
              className="p-3 hover:bg-third/5 text-[#93000A] cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.courseId}</span>
                <span className="text-sm">{item.title}</span>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  )
}