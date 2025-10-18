import mockDistrictLock from '../mocks/districtLockMock.json';
import { CityData } from '../../mypage/types';

const STORAGE_KEY = 'district_lock_data';

export const getDistrictData = (): CityData | null => {
  try {
    // sessionStorage에서 데이터 확인
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    
    if (storedData) {
      // sessionStorage에 데이터가 있으면 파싱해서 반환
      const parsedData = JSON.parse(storedData);
      console.log('[DistrictStorage] Using data from sessionStorage');
      return parsedData;
    } else {
      // sessionStorage에 데이터가 없으면 목데이터 사용하고 저장
      const mockData = mockDistrictLock.data.cities[0] as CityData;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      console.log('[DistrictStorage] Using mock data and storing to sessionStorage');
      return mockData;
    }
  } catch (error) {
    console.error('[DistrictStorage] Error getting district data:', error);
    // 에러 발생 시 목데이터 반환
    return mockDistrictLock.data.cities[0] as CityData;
  }
};

export const updateDistrictData = (updatedData: CityData): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    console.log('[DistrictStorage] District data updated in sessionStorage');
  } catch (error) {
    console.error('[DistrictStorage] Error updating district data:', error);
  }
};

export const unlockDistrict = (districtId: string): CityData | null => {
  try {
    const currentData = getDistrictData();
    if (!currentData) return null;

    // 해당 지역구의 잠금 상태를 false로 변경
    const updatedDistricts = currentData.districts.map(district => 
      district.id === districtId 
        ? { ...district, isLocked: false }
        : district
    );

    const updatedData: CityData = {
      ...currentData,
      districts: updatedDistricts,
      lockedDistricts: updatedDistricts.filter(d => d.isLocked).length,
      unlockedDistricts: updatedDistricts.filter(d => !d.isLocked).length
    };

    updateDistrictData(updatedData);
    return updatedData;
  } catch (error) {
    console.error('[DistrictStorage] Error unlocking district:', error);
    return null;
  }
};

export const clearDistrictData = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    console.log('[DistrictStorage] District data cleared from sessionStorage');
  } catch (error) {
    console.error('[DistrictStorage] Error clearing district data:', error);
  }
};

export const isDistrictUnlocked = (districtId: string): boolean => {
  try {
    const data = getDistrictData();
    if (!data) return false;
    
    const district = data.districts.find(d => d.id === districtId);
    return district ? !district.isLocked : false;
  } catch (error) {
    console.error('[DistrictStorage] Error checking district lock status:', error);
    return false;
  }
};

// 지역구 선택 완료 시 잠금 해제 (POST /api/regions/unlock 시뮬레이션)
export const unlockSelectedDistricts = (districtNames: string[]): CityData | null => {
  try {
    const currentData = getDistrictData();
    if (!currentData) return null;

    console.log('[DistrictStorage] Unlocking selected districts:', districtNames);

    // 지역구 이름을 ID로 변환하고 잠금 해제
    const updatedDistricts = currentData.districts.map(district => {
      // 지역구 이름 매칭 (예: "강남구" -> "gangnam")
      const isSelected = districtNames.some(name => 
        district.name === name || 
        district.name === name.replace('구', '') ||
        district.id === name.toLowerCase().replace('구', '')
      );
      
      if (isSelected) {
        console.log(`[DistrictStorage] Unlocking district: ${district.name} (${district.id})`);
        return { ...district, isLocked: false };
      }
      return district;
    });

    const updatedData: CityData = {
      ...currentData,
      districts: updatedDistricts,
      lockedDistricts: updatedDistricts.filter(d => d.isLocked).length,
      unlockedDistricts: updatedDistricts.filter(d => !d.isLocked).length
    };

    updateDistrictData(updatedData);
    console.log('[DistrictStorage] Selected districts unlocked successfully');
    return updatedData;
  } catch (error) {
    console.error('[DistrictStorage] Error unlocking selected districts:', error);
    return null;
  }
};

// 개별 지역구 잠금 해제 (자치구 잠금 시스템에서 사용)
export const unlockSingleDistrict = (districtId: string): CityData | null => {
  try {
    const currentData = getDistrictData();
    if (!currentData) return null;

    console.log('[DistrictStorage] Unlocking single district:', districtId);
    console.log('[DistrictStorage] Available districts:', currentData.districts.map(d => ({ id: d.id, name: d.name, isLocked: d.isLocked })));

    // 해당 지역구 찾기
    const targetDistrict = currentData.districts.find(d => d.id === districtId);
    if (!targetDistrict) {
      console.error('[DistrictStorage] District not found:', districtId);
      return null;
    }

    console.log('[DistrictStorage] Found target district:', targetDistrict);

    const updatedDistricts = currentData.districts.map(district => 
      district.id === districtId 
        ? { ...district, isLocked: false }
        : district
    );

    const updatedData: CityData = {
      ...currentData,
      districts: updatedDistricts,
      lockedDistricts: updatedDistricts.filter(d => d.isLocked).length,
      unlockedDistricts: updatedDistricts.filter(d => !d.isLocked).length
    };

    updateDistrictData(updatedData);
    console.log(`[DistrictStorage] District ${districtId} unlocked successfully`);
    console.log('[DistrictStorage] Updated counts - locked:', updatedData.lockedDistricts, 'unlocked:', updatedData.unlockedDistricts);
    return updatedData;
  } catch (error) {
    console.error('[DistrictStorage] Error unlocking single district:', error);
    return null;
  }
};

// 지역구 잠금 상태 토글 (잠금/해제)
export const toggleDistrictLock = (districtId: string): CityData | null => {
  try {
    const currentData = getDistrictData();
    if (!currentData) return null;

    const district = currentData.districts.find(d => d.id === districtId);
    if (!district) return null;

    const newLockStatus = !district.isLocked;
    console.log(`[DistrictStorage] Toggling district ${districtId} to ${newLockStatus ? 'locked' : 'unlocked'}`);

    const updatedDistricts = currentData.districts.map(d => 
      d.id === districtId 
        ? { ...d, isLocked: newLockStatus }
        : d
    );

    const updatedData: CityData = {
      ...currentData,
      districts: updatedDistricts,
      lockedDistricts: updatedDistricts.filter(d => d.isLocked).length,
      unlockedDistricts: updatedDistricts.filter(d => !d.isLocked).length
    };

    updateDistrictData(updatedData);
    return updatedData;
  } catch (error) {
    console.error('[DistrictStorage] Error toggling district lock:', error);
    return null;
  }
};
