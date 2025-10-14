// 코스 상세 페이지 (Mapbox 페이지 + 코스 & 장소 목록 페이지)

import { useLocation } from "react-router-dom";
import { CourseDetailMapbox } from "../../features/mapbox";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import courseList from "../../features/course/mocks/courseList.json";
import { PlaceDetailModal } from "../../features/course";
import { useEffect, useState, useMemo } from "react";
import { CourseDetailSidebar } from "../../features/course";
import { COURSE_STORAGE_KEY, readCoursesFromSession } from "../../features/course/utils/normalizeCourse";
import { useRecommendStore } from "../../shared/store/recommend.store";
import { useHeaderStore } from "../../shared/store/header.store";
import type { Course } from "../../features/course/types";
import { useQueries } from '@tanstack/react-query';
import { fetchRoute, routeQueryKey } from '../../shared/api/routes.api';
import { useUIStore } from '../../shared/store/ui.store';

// Helper functions
function segId(sid: string | number, eid: string | number) {
  return `route-${sid}-${eid}`;
}
function formatDistance(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`;
}
function formatDuration(sec: number) {
  return `${Math.round(sec / 60)}분`;
}

export const CourseDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const { setRecommend, data: recommendData } = useRecommendStore();
  const { isOpen } = useHeaderStore();
  const { isMapReady } = useUIStore();
  
  // 세션에서 코스 데이터 가져오기
  const courses = useMemo(() => readCoursesFromSession(), []);
  const currentCourse = useMemo(() => {
    if (!id) return null;
    const courseId = parseInt(id);
    return courses.find(course => course.course_id === courseId);
  }, [courses, id]);

  // 코스 데이터를 RecommendStore에 설정
  useEffect(() => {
    if (currentCourse && currentCourse.poi_list) {
      const mapData = currentCourse.poi_list.map((poiSet, index) => ({
        id: poiSet.poi.poi_id,
        name: poiSet.poi.name,
        category: poiSet.poi.category,
        lat: poiSet.poi.lat,
        lng: poiSet.poi.lng,
        seq: poiSet.order,
        indoor: poiSet.poi.indoor ?? false,
        price_level: poiSet.poi.price_level ?? undefined,
        alcohol: typeof poiSet.poi.alcohol === 'number' ? poiSet.poi.alcohol : undefined,
        mood_tag: poiSet.poi.mood_tag ? parseInt(poiSet.poi.mood_tag) : 0,
      }));

      setRecommend({
        explain: currentCourse.description || "코스 상세 정보",
        data: mapData,
      });
    }
  }, [currentCourse?.course_id]); // course_id만 의존성으로 설정

  // 세그먼트 목록 생성
  const segments = useMemo(() => {
    const arr: {
      id: string;
      start: [number, number];
      end: [number, number];
      fromName: string;
      toName: string;
    }[] = [];

    if (recommendData && recommendData.length > 0) {
      const stops = [...recommendData].sort((a, b) => a.seq - b.seq);
      for (let i = 0; i < stops.length - 1; i++) {
        const s = stops[i], e = stops[i + 1];
        arr.push({
          id: segId(s.seq, e.seq),
          start: [s.lng, s.lat],
          end: [e.lng, e.lat],
          fromName: s.name,
          toName: e.name
        });
      }
    }
    return arr;
  }, [recommendData]);

  // TanStack Query – 경로 호출/캐싱/상태
  const results = useQueries({
    queries: segments.map(seg => ({
      queryKey: routeQueryKey({ start: seg.start, end: seg.end }),
      queryFn: ({ signal }: { signal?: AbortSignal }) => fetchRoute({ start: seg.start, end: seg.end }, signal),
      enabled: isMapReady,
      staleTime: 10 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      retry: 1
    }))
  });

  // 패널 데이터: 성공한 것만 집계
  const ok = results
    .map((r, i) => (r.isSuccess ? { seg: segments[i], ...r.data } : null))
    .filter(Boolean) as Array<{ seg: (typeof segments)[number]; distance: number; duration: number }>;

  const totalDistance = ok.reduce((s, x) => s + x.distance, 0);
  const totalDuration = ok.reduce((s, x) => s + x.duration, 0);

  const isAnyPending = results.some(r => r.isPending);
  const isAnyFetching = results.some(r => r.isFetching);

  useEffect(() => {
    const isPlaceRoute = location.pathname.includes('/place/');
    setIsPlaceModalOpen(isPlaceRoute);
  }, [location.pathname]);

  const handleClosePlaceModal = () => {
    setIsPlaceModalOpen(false);
    navigate(`/course/${id}`);
  };

  return (
    <div className={`flex absolute left-0 top-0 w-full h-full`}>
      <CourseDetailMapbox courseData={currentCourse} />


      {/* 루트 정보 패널 */}
      {(ok.length > 0 || isAnyPending || isAnyFetching) && (
        <div className={`absolute top-4 ${isOpen ? "left-[270px]" : "left-[80px]"} bg-white/95 rounded-lg shadow-lg p-4 max-w-sm z-30 min-w-[280px]`}>
          <h3 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
            코스 정보
            {isAnyFetching && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600">갱신 중</span>
            )}
          </h3>

          {/* 스켈레톤 */}
          {ok.length === 0 && (isAnyPending || isAnyFetching) && (
            <div className="space-y-2 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="text-right ml-2">
                    <div className="h-4 w-16 bg-gray-200 rounded mb-1 animate-pulse" />
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 세그먼트 리스트 */}
          {ok.length > 0 && (
            <div className="space-y-2 mb-4">
              {ok.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex-1 text-gray-600">
                    {s.seg.fromName} → {s.seg.toName}
                  </div>
                  <div className="text-right ml-2">
                    <div className="font-medium text-blue-600">{formatDistance(s.distance)}</div>
                    <div className="text-xs text-gray-500">{formatDuration(s.duration)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 총합 */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">총 거리:</span>
              <span className="font-bold text-lg text-blue-600">{formatDistance(totalDistance)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-semibold text-gray-800">총 시간:</span>
              <span className="font-bold text-lg text-green-600">{formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      )}
      {/* url에 따라 컴포넌트 변경 - 헤더가 접혔을 때는 사이드바 숨김 */}
      <div className={`absolute h-full top-0 right-0 w-[460px] z-10 transition-all duration-300 ease-in-out`}>
        <CourseDetailSidebar /> 
      </div>
      
      {/* 장소 상세 모달 */}
      <PlaceDetailModal 
        isOpen={isPlaceModalOpen} 
        onClose={handleClosePlaceModal} 
      />

    </div>  
  );
};
