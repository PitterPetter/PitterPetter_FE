import { useState } from 'react';
import { ImageUpload, MarkdownEditor } from '../../../shared/ui';
import { useDiaryStore } from '../../../shared/store/diary.store';

export const WriteDiary = () => {
  const { diaryTitle, setDiaryTitle, diaryContent, setDiaryContent, diaryImage, setDiaryImage } = useDiaryStore();

  const handleImageSelect = (file: File | null) => {
    console.log('Selected file:', file);
    setDiaryImage(file);
  };

  const handleContentChange = (content: string) => {
    setDiaryContent(content);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold text-gray-800">다이어리 작성</h1>
      <div className="flex flex-col gap-6">
        {/* 다이어리 제목 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">다이어리 제목</label>
          <input 
            type="text" 
            placeholder="제목을 입력해 주세요" 
            value={diaryTitle}
            onChange={(e) => setDiaryTitle(e.target.value)}
            className="w-full h-[42px] rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#662B2B]/20 focus:border-[#662B2B] transition-colors" 
          />
        </div>

        {/* 대표 이미지 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">대표 이미지</label>
          <ImageUpload 
            onFileSelect={handleImageSelect}
            maxSize={10}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/gif']}
          />
        </div>

        {/* 다이어리 내용 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">다이어리 내용</label>
          <MarkdownEditor
            value={diaryContent}
            onChange={handleContentChange}
            placeholder="오늘의 추억을 마크다운 문법으로 기록해보세요..."
          />
        </div>
      </div>
    </div>
  );
};