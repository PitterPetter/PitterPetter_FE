// 코스 연결 컴포넌트

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Course } from "../types";
import mockData from "../mocks/diary.json";
import { useDiaryStore } from "../../../shared/store/diary.store";

export const ConnectCourse = () => {
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const { setCourseId } = useDiaryStore();
  const courseData = mockData.data.content.map(item => ({
    ...item,
    courseId: item.diaryId
  })) as Course[];

  useEffect(() => {
    setSearchResults(courseData);
  }, []);

  // 코스 선택
  const handleCourseSelect = (courseId: string) => {
    setSearchTerm(courseId);
    setCourseId(courseId);
    handleInputChange({ target: { value: courseId } } as React.ChangeEvent<HTMLInputElement>);
  };

  // 검색어 입력
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      const filtered = courseData.filter(item => 
        item.courseId.toLowerCase().includes(value.toLowerCase()) ||
        item.title.toLowerCase().includes(value.toLowerCase())
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
        item.courseId.toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (exactMatch) {
        setCourseId(exactMatch.courseId);
        setSearchTerm(exactMatch.courseId);
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
        {isSearchOpen && searchResults.length > 0 && (
          <div className="mt-3 border border-gray-200 rounded-lg bg-white shadow-sm max-h-40 overflow-y-auto">
            {searchResults.map((item) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}