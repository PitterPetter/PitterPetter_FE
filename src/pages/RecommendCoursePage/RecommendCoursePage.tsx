// src/pages/recommend/RecommendCoursePage.tsx
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { RecommendMapbox } from "../../features/mapbox";
import { Button } from "@mui/material";
import { useRecommendStore } from "../../shared/store/recommend.store";
import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import { PlaceDetailModal, SessionCoursesModal } from "../../features/course";
import { useQueries, useMutation } from '@tanstack/react-query';
import { fetchRoute, routeQueryKey } from '../../shared/api/routes.api';
import { useUIStore } from '../../shared/store/ui.store';
import { useHeaderStore } from '../../shared/store/header.store';
import { saveCourseApi } from "../../features/course/api";
import { toast } from 'react-toastify';

type RecommendStop = {
  id?: string;
  seq: number;
  name: string;
  category: string;
  lat?: number;
  lng?: number;
  indoor?: boolean;
  price_level?: number;
  alcohol?: boolean | 0 | 1;
  mood_tag?: number;
  food_tag?: string[];
  rating_avg?: number;
};

const formatCategory = (c?: string) => (c ? c.toUpperCase() : "UNKNOWN");
const formatPrice = (p?: number) => (typeof p === "number" ? `가격대: ${p}` : "");
const formatAlcohol = (a?: boolean | 0 | 1) => (a ? "음주 가능" : "음주 불가");
const formatIndoor = (i?: boolean) => (i ? "실내" : "실외");

export const RecommendCoursePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { data: recommendData, explain, setRecommend, setSelectedPlace: setStoreSelectedPlace } = useRecommendStore();
  const { isMapReady } = useUIStore();
  const { isOpen } = useHeaderStore();
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<RecommendStop | null>(null);
  const [isSessionCoursesModalOpen, setIsSessionCoursesModalOpen] = useState(false);

  const stops: RecommendStop[] = useMemo(() => {
    if (!recommendData) return [];
    if (Array.isArray(recommendData)) return recommendData as RecommendStop[];
    if (Array.isArray((recommendData as any).data)) return (recommendData as any).data;
    if (Array.isArray((recommendData as any)[0]?.data)) return (recommendData as any)[0].data;
    return [];
  }, [recommendData]);

  const handleRerecommend = useCallback(() => {
    setIsSessionCoursesModalOpen(true);
  }, []);

  const handleCloseSessionCoursesModal = useCallback(() => {
    setIsSessionCoursesModalOpen(false);
  }, []);

    const handlePlaceClick = useCallback((place: RecommendStop) => {
      setSelectedPlace(place);
      setIsPlaceModalOpen(true);
      setStoreSelectedPlace({
        seq: place.seq,
        name: place.name,
        category: place.category,
        lat: place.lat || 0,
        lng: place.lng || 0,
        indoor: place.indoor || false,
        price_level: place.price_level,
        alcohol: typeof place.alcohol === 'number' ? place.alcohol : (place.alcohol ? 1 : 0),
        mood_tag: 0 // 기본값 설정
      });
      // URL 변경
      navigate(`/recommend/${place.id || place.seq}`);
    }, [navigate, setStoreSelectedPlace]);

  const handleCloseModal = useCallback(() => {
    setIsPlaceModalOpen(false);
    setSelectedPlace(null);
    // Store에서 선택된 장소 제거
    setStoreSelectedPlace(null);
    // URL을 기본 recommend 페이지로 변경
    navigate("/recommend");
  }, [navigate, setStoreSelectedPlace]);

  // 세그먼트 목록 생성
  const segments = useMemo(() => {
    const arr: {
      id: string;
      start: [number, number];
      end: [number, number];
      fromName: string;
      toName: string;
    }[] = [];

    if (stops && stops.length > 0) {
      const sortedStops = [...stops].sort((a, b) => a.seq - b.seq);
      for (let i = 0; i < sortedStops.length - 1; i++) {
        const s = sortedStops[i], e = sortedStops[i + 1];
        if (typeof s.lng === "number" && typeof s.lat === "number" && 
            typeof e.lng === "number" && typeof e.lat === "number") {
          arr.push({
            id: `route-${s.seq}-${e.seq}`,
            start: [s.lng, s.lat],
            end: [e.lng, e.lat],
            fromName: s.name,
            toName: e.name
          });
        }
      }
    }
    return arr;
  }, [stops]);

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

  // Helper functions
  const formatDistance = (m: number) => {
    return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`;
  };
  
  const formatDuration = (sec: number) => {
    return `${Math.round(sec / 60)}분`;
  };

  // useMutation을 컴포넌트 최상위에서 호출
  const saveCourseMutation = useMutation({
    mutationFn: saveCourseApi,
    onSuccess: (data) => {
      console.log(data);
      navigate(`/course`);
      toast.success("코스가 저장되었습니다.");
    },
    onError: () => {
      toast.error("코스 저장에 실패했습니다.");
    }
  });

  const saveCourse = () => {
    // recommend 데이터를 course 형태로 변환
    const courseData = {
      name: "추천 코스",
      description: explain || "옵션에서 추천받은 코스",
      poi_list: stops.map((stop, index) => ({
        order: stop.seq,
        poi: {
          poi_id: stop.id || `recommend-${stop.seq}`,
          name: stop.name,
          category: stop.category,
          lat: stop.lat || 0,
          lng: stop.lng || 0,
          indoor: stop.indoor || false,
          price_level: stop.price_level,
          alcohol: stop.alcohol,
          mood_tag: "0" // 기본값
        }
      }))
    };
    
    saveCourseMutation.mutate(courseData);
  }

  // URL 파라미터에 따른 모달 상태 설정
  useEffect(() => {
    const isPlaceRoute = Boolean(location.pathname.includes('/recommend/') && id);
    setIsPlaceModalOpen(isPlaceRoute);
    
    if (isPlaceRoute && stops.length > 0) {
      // URL의 id와 일치하는 장소 찾기
      const place = stops.find(stop => 
        stop.id === id || stop.seq.toString() === id
      );
      if (place) {
        setSelectedPlace(place);
      }
    } else {
      setSelectedPlace(null);
    }
  }, [id, location.pathname, stops]);

  return (
    <div className="flex absolute left-0 top-0 w-full h-full">
      <RecommendMapbox />

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

      {/* 사이드바 */}
      <div className="absolute h-full top-0 right-0 w-[460px] z-10">
        {stops.length > 0 ? (
          <div className="flex flex-col h-full gap-8 p-6 bg-white w-full">
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-2xl font-semibold text-[#0B0B0C]">추천 코스</h1>
              <p className="text-base text-[#6B7486] w-full break-words break-all px-2">
                {explain || "온보딩에서 설정한 취향에 맞는 추천 코스입니다."}
              </p>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className="flex flex-col w-full gap-2 overflow-y-auto max-h-[calc(100vh-380px)]">
              {[...stops]
                .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))
                .map((stop, index) => (
                  <div
                    key={stop.id ?? `${stop.seq}-${index}`}
                    className="flex w-full flex-col gap-3 py-5 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => handlePlaceClick(stop)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#662B2B] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {stop.seq}
                      </div>
                      <span className="text-[#662B2B] text-lg font-medium truncate">
                        {stop.name}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 pl-[44px] w-full">
                      <p className="text-sm text-[#1F2937] font-semibold uppercase tracking-wide">
                        {formatCategory(stop.category)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {[formatPrice(stop.price_level), formatAlcohol(stop.alcohol), formatIndoor(stop.indoor)]
                          .filter(Boolean)
                          .join(" | ")}
                      </p>
                      {stop.rating_avg && (
                        <p className="text-xs text-yellow-600">
                          평점: {stop.rating_avg.toFixed(1)}
                        </p>
                      )}
                      {stop.mood_tag && (
                        <p className="text-xs text-blue-600">
                          분위기: {stop.mood_tag}
                        </p>
                      )}
                      {stop.food_tag && stop.food_tag.length > 0 && (
                        <p className="text-xs text-green-600">
                          음식 태그: {stop.food_tag.join(", ")}
                        </p>
                      )}
                    </div>

                    {index !== stops.length - 1 && (
                      <div className="w-full h-px bg-gray-200" />
                    )}
                  </div>
                ))}
            </div>

              {/* 하단 버튼 */}
              <div className="flex flex-col gap-2 p-4 z-20">
                <div className="flex gap-2 w-full h-[50px] justify-between">
                  <Button variant="outlined" className="w-full" onClick={handleRerecommend}>
                    Rerecommend
                  </Button>
                </div>
                <Button
                  variant="contained"
                  className="w-full h-[50px]"
                  onClick={() => saveCourse()}
                >
                  Save this course
                </Button>
              </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-white p-6 text-sm text-gray-500">
            추천 코스 데이터가 없습니다. 온보딩을 완료해주세요.
          </div>
        )}
      </div>


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

      {/* 장소 상세 모달 */}
      {selectedPlace && (
        <PlaceDetailModal 
          isOpen={isPlaceModalOpen} 
          onClose={handleCloseModal}
          placeData={selectedPlace}
        />
      )}

      {/* 세션 코스 모달 */}
      <SessionCoursesModal
        isOpen={isSessionCoursesModalOpen}
        onClose={handleCloseSessionCoursesModal}
      />
    </div>
  );
};
