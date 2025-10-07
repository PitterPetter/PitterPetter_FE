import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBold, 
  faItalic, 
  faList, 
  faListOl, 
  faQuoteLeft, 
  faCode, 
  faLink,
  faEye,
  faEdit
} from '@fortawesome/free-solid-svg-icons';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '마크다운 문법을 사용해서 내용을 작성해보세요...',
  className = ''
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = before + selectedText + after;
    
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // 커서 위치 조정
    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const formatButtons = [
    {
      icon: faBold,
      label: '굵게',
      action: () => insertText('**', '**')
    },
    {
      icon: faItalic,
      label: '기울임',
      action: () => insertText('*', '*')
    },
    {
      icon: faList,
      label: '순서없는 목록',
      action: () => insertText('- ')
    },
    {
      icon: faListOl,
      label: '순서있는 목록',
      action: () => insertText('1. ')
    },
    {
      icon: faQuoteLeft,
      label: '인용',
      action: () => insertText('> ')
    },
    {
      icon: faCode,
      label: '코드',
      action: () => insertText('`', '`')
    },
    {
      icon: faLink,
      label: '링크',
      action: () => insertText('[링크 텍스트](', ')')
    }
  ];

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* 툴바 */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-3 py-2">
        <div className="flex items-center gap-1">
          {formatButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title={button.label}
            >
              <FontAwesomeIcon icon={button.icon} size="sm" />
            </button>
          ))}
        </div>
        
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
        >
          <FontAwesomeIcon icon={isPreview ? faEdit : faEye} size="sm" />
          {isPreview ? '편집' : '미리보기'}
        </button>
      </div>

      {/* 에디터/미리보기 영역 */}
      <div className="min-h-[200px]">
        {isPreview ? (
          <div className="p-4 prose prose-sm max-w-none">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">미리보기할 내용이 없습니다.</p>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[200px] p-4 border-0 resize-none focus:outline-none"
          />
        )}
      </div>

      {/* 도움말 */}
      {!isPreview && (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
          <div className="flex flex-wrap gap-4">
            <span><strong>**굵게**</strong></span>
            <span><em>*기울임*</em></span>
            <span><code>`코드`</code></span>
            <span>- 목록</span>
            <span>1. 순서목록</span>
            <span>&gt; 인용</span>
            <span>[링크](URL)</span>
          </div>
        </div>
      )}
    </div>
  );
};
