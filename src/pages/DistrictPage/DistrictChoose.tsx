import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import { DistrictInfo, DistrictLockData, CityData } from '../../features/mypage/types';
import { Spinner } from '../../shared/ui/spinner';
import { useDistrictStore } from '../../shared/store/district.store';
import namsantower from '/namsantower.jpg';
import { districtApi } from '../../features/district/api';

export const DistrictChoose = () => {
  const navigate = useNavigate();
  const [selectedDistricts, setSelectedDistricts] = useState<DistrictInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('서울시');
  const { setSelectedDistricts: setStoreDistricts } = useDistrictStore();

  // 지역구 잠금 상태 조회
  const { data: districtData, isLoading, isError } = useQuery<DistrictLockData | null>({
    queryKey: ['districtLock'],
    queryFn: async () => {
      const response = await districtApi.getDistrictLock();
      console.log(response.data.data);
      return response.data?.data as DistrictLockData ?? null;
    },
  });

  // 현재 선택된 도시의 모든 지역구 표시
  const currentCityData = districtData?.cities?.find((city: any) => city.cityName === selectedCity);
  const allDistricts = currentCityData?.districts || [];

  // 검색 필터링
  const filteredDistricts = allDistricts.filter(district =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 지역구 선택/해제 핸들러
  const handleDistrictToggle = (district: DistrictInfo) => {
    setSelectedDistricts(prev => {
      const isSelected = prev.some(d => d.name === district.name);
      if (isSelected) {
        return prev.filter(d => d.name !== district.name);
      } else if (prev.length < 2) {
        return [...prev, district];
      }
      return prev;
    });
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (selectedDistricts.length === 2) {
      setStoreDistricts(selectedDistricts);
      navigate('/home/district/check');
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div className="flex justify-center items-center text-red-500">정보를 불러오는데 실패했습니다.</div>;

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative h-[800px] w-[700px] bg-[#DED6D6] border-gray-300 border rounded-2xl p-4 py-16 flex flex-col gap-4 justify-start items-center overflow-hidden">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${namsantower})` }}
        />
        <h1 className="text-2xl font-bold text-gray-800 relative z-10">데이트 지역 선택</h1>
        <p className="text-gray-600 text-center relative z-10">함께 데이트하고 싶은 2개의 자치구를 선택해주세요</p>
        <p className="text-sm text-gray-500 text-center max-w-md relative z-10">
          선택한 지역구를 기반으로 맞춤형 데이트 코스를 추천해드립니다
        </p>
        
        {/* 도시 탭 메뉴 */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-full max-w-md relative z-10">
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
        
        {/* 선택된 지역구 표시 */}
        <div className="w-full max-w-md relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">선택된 자치구 ({selectedDistricts.length}/2)</span>
          </div>
          <div className="flex gap-2 flex-wrap h-7">
            {selectedDistricts.map((district) => (
              <div
                key={district.id}
                className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                <span>{district.name}</span>
                <button
                  onClick={() => handleDistrictToggle(district)}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 검색바 */}
        <div className="w-full max-w-md relative z-10">
          <input
            type="text"
            placeholder="자치구 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* 자치구 그리드 */}
        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto w-full max-w-md relative z-10">
          {filteredDistricts.map((district) => {
            const isSelected = selectedDistricts.some(d => d.name === district.name);
            const canSelect = selectedDistricts.length < 2 || isSelected;
            
            return (
              <div
                key={district.name}
                onClick={() => canSelect && handleDistrictToggle(district)}
                className={`px-3 py-4 rounded-lg transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white'
                    : canSelect
                    ? 'bg-white hover:shadow-md'
                    : 'bg-gray-100 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{district.name}</span>
                  </div>
                  {isSelected && (
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 빈 상태 */}
        {filteredDistricts.length === 0 && (
          <div className="text-center py-8 text-gray-500 relative z-10">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>검색 결과가 없습니다.</p>
          </div>
        )}

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={selectedDistricts.length !== 2}
          className={`w-[220px] min-h-14 rounded-md font-medium transition-all duration-200 relative z-10 ${
            selectedDistricts.length === 2
              ? 'bg-primary text-white hover:bg-primary/80'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          다음 단계
        </button>
      </div>

    </div>
  );
};
