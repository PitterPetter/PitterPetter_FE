import { useEffect } from "react";
import { PlaceDetailSidebar } from "./PlaceDetailSidebar";

interface PlaceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaceDetailModal = ({ isOpen, onClose }: PlaceDetailModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="flex fixed right-[390px] top-0 h-full"
      onClick={handleBackdropClick}
    >
      <div className="flex h-full items-center py-8">
        <div className="relative w-[300px] h-[calc(100vh-32px)] bg-white shadow-xl overflow-hidden rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">장소 상세 정보</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="닫기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="h-[calc(100vh-144px)] overflow-y-auto">
            <PlaceDetailSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};
