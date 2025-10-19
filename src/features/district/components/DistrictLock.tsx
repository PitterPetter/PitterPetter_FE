import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock, faKey, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { mypageApi } from '../../mypage/api';
import { DistrictInfo, DistrictLockData } from '../../mypage/types';
import { useMypageStore } from '../../../shared/store/mypage.store';
import { Spinner } from '../../../shared/ui/spinner';
import { Input } from '../../../shared/ui/input';
import { toast } from 'react-toastify';
import { districtApi } from '../api';
import mockDistrictLock from '../mocks/districtLockMock.json';

export const DistrictLock = () => {
  const [selectedCity, setSelectedCity] = useState<string>('서울시');
  const [searchTerm, setSearchTerm] = useState('');
  const [unlockingDistricts, setUnlockingDistricts] = useState<Set<string>>(new Set());
  const { ticket } = useMypageStore();
  const queryClient = useQueryClient();
  // 지역구 잠금 상태 조회
  const { data: districtData, isLoading, isError, refetch } = useQuery<DistrictLockData | null>({
    queryKey: ['districtLock'],
    queryFn: async () => {
      console.log('getDistrictLock');
      const response = await districtApi.getDistrictLock();
      console.log('response', response);
      // const response = mockDistrictLock;
      // return (response.data?.data as DistrictLockData) ?? null;
      return response.data.data;
    },
  });

  // 지역구 잠금 해제 mutation
  const unlockDistrictMutation = useMutation({
    mutationFn: (regions: string[]) => districtApi.rewardUnlockDistrict(regions),
    onSuccess: (_, regions) => {
      toast.success('지역구 잠금이 해제되었습니다!');
      setUnlockingDistricts(prev => {
        const newSet = new Set(prev);
        regions.forEach(region => newSet.delete(region));
        return newSet;
      });
      
      // 홈 지도의 지역 잠금 상태 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['districtLockup'] });
      queryClient.invalidateQueries({ queryKey: ['districtLock'] });
      
      refetch();
    },
    onError: (_, regions) => {
      toast.error('잠금 해제에 실패했습니다.');
      setUnlockingDistricts(prev => {
        const newSet = new Set(prev);
        regions.forEach(region => newSet.delete(region));
        return newSet;
      });
    },
  });

  // 지역구 잠금 해제 핸들러
  const handleUnlockDistrict = (district: DistrictInfo) => {
    setUnlockingDistricts(prev => new Set(prev).add(district.id.toString()));
    unlockDistrictMutation.mutate([district.id.toString()]);
  };

  // 현재 선택된 도시 데이터
  const currentCityData = districtData?.cities[0];

  // 검색 필터링 및 정렬 (잠금 해제된 것 먼저)
  const filteredDistricts = currentCityData?.districts
    .filter(district =>
      district.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // 잠금 해제된 것(locked: false)이 먼저 오도록 정렬
      if (a.locked === b.locked) return 0;
      return a.locked ? 1 : -1;
    }) || [];

  if (isLoading) return <Spinner />;
  if (isError) return <div className="flex justify-center items-center text-red-500">정보를 불러오는데 실패했습니다.</div>;

  return (
    <div className="h-full w-full p-8 py-2 group">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">자치구 잠금 시스템</h1>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faKey} className="w-6 h-6 text-primary" />
          <span className="text-sm text-gray-600">보유 키: {ticket || 0}개</span>
        </div>
      </div>

      {/* 도시 탭 메뉴 */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setSelectedCity('서울시')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            selectedCity === '서울시'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          서울시
        </button>
        <button
          className="px-4 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed"
          disabled
        >
          (추후 추가 예정)
        </button>
      </div>

      {/* 요약 정보 */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">{selectedCity} 총 자치구: {currentCityData?.totalDistricts}개</h2>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">잠금: {currentCityData?.lockedDistricts}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">해제: {currentCityData?.unlockedDistricts}</span>
          </div>
        </div>
      </div>

      {/* 검색바 */}
      <div className="mb-6">
        <Input
          placeholder="지역구 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 지역구 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {filteredDistricts.map((district) => (
          <div
            key={district.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
              district.locked
                ? 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                : 'bg-green-50 border-green-200 hover:bg-green-100'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              {/* 잠금 아이콘 */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                district.locked ? 'bg-orange-100' : 'bg-green-100'
              }`}>
                <FontAwesomeIcon
                  icon={district.locked ? faLock : faUnlock}
                  className={`w-6 h-6 ${
                    district.locked ? 'text-orange-600' : 'text-green-600'
                  }`}
                />
              </div>
              
              {/* 지역구 정보 */}
              <h3 className="font-medium text-gray-800 mb-1">{district.name}</h3>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{district.description}</p>
              
              {/* 잠금 해제 버튼 */}
              {district.locked ? (
                <button
                  onClick={() => {ticket > 0 ? handleUnlockDistrict(district) : toast.error('보유 키가 없습니다.');}}
                  disabled={unlockingDistricts.has(district.id.toString())}
                  className={`w-full px-3 py-2 rounded-md text-sm font-medium bg-primary text-white ${ticket > 0 && "hover:bg-primary/80"} disabled:opacity-50 transition-all duration-200`}
                >
                  {unlockingDistricts.has(district.id.toString()) ? '해제 중...' : '잠금 해제'}
                </button>
              ) : (
                <div className="w-full px-3 py-2 rounded-md text-sm font-medium bg-green-100 text-green-700 text-center">
                  잠금 해제됨
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredDistricts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};