import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWineGlass, faRunning, faUtensils, faDollarSign, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useOnboardingStore } from "../../../shared/store/onboarding.store";
import { useState } from "react";
import { DrinkingList, ActiveList, FoodList, CostList } from "../../onboarding/types";

export const PersonalPreferences = () => {
  const { 
    alcoholPreference, 
    activeBound, 
    dateCostPreference, 
    favoriteFoodCategories, 
    atmosphere,
    setAlcoholPreference, 
    setActiveBound, 
    setDateCostPreference, 
    setFavoriteFoodCategories, 
    setAtmosphere 
  } = useOnboardingStore();

  const [isEditing, setIsEditing] = useState(false);

  const getAlcoholText = (level: number) => {
    const levels = ['', '거의 마시지 않아요', '가끔 마셔요', '보통이에요', '자주 마셔요', '매우 즐겨 마셔요'];
    return levels[level] || '선택되지 않음';
  };

  const getActiveText = (level: number) => {
    const levels = ['', '실내 데이트 선호', '실내 약간 선호', '중립', '야외 약간 선호', '야외 데이트 선호'];
    return levels[level] || '선택되지 않음';
  };

  const getCostText = (cost: string) => {
    const costMap: { [key: string]: string } = {
      '1만원 이하': '1만원 이하',
      '1 ~ 3만원': '1 ~ 3만원',
      '3 ~ 5만원': '3 ~ 5만원',
      '5 ~ 8만원': '5 ~ 8만원',
      '8만원 이상': '8만원 이상',
      '만원_미만': '1만원 이하',
      '만원_삼만원': '1 ~ 3만원',
      '삼만원_오만원': '3 ~ 5만원',
      '오만원_팔만원': '5 ~ 8만원',
      '팔만원_이상': '8만원 이상',
    };
    return costMap[cost] || '선택되지 않음';
  };

  const PreferenceCard = ({ 
    icon, 
    title, 
    value, 
    onEdit 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    value: string; 
    onEdit?: () => void;
  }) => (
    <div className="flex items-center gap-4 p-4 border border-gray-200 bg-white hover:shadow-sm transition-shadow">
      <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-base font-semibold text-gray-900 truncate">{value}</p>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-primary transition-colors"
          aria-label="수정"
        >
          <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const SliderInput = ({ 
    value, 
    onChange, 
    min = 1, 
    max = 5, 
    labels 
  }: { 
    value: DrinkingList | ActiveList; 
    onChange: (value: DrinkingList | ActiveList) => void; 
    min?: number; 
    max?: number;
    labels: string[];
  }) => (
    <div className="space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        value={value || 0}
        onChange={(e) => onChange(Number(e.target.value) as DrinkingList | ActiveList)}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-500">
        {labels.map((label, index) => (
          <span key={index} className="text-center">{label}</span>
        ))}
      </div>
    </div>
  );

  const FoodChip = ({ 
    category, 
    isSelected, 
    onClick 
  }: { 
    category: string; 
    isSelected: boolean; 
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm border transition-colors ${
        isSelected 
          ? 'bg-primary text-white border-primary' 
          : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
      }`}
    >
      {category}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">나의 데이트 취향</h2>
          <p className="text-sm text-gray-500">개인화된 추천을 위한 취향 정보</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
        >
          {isEditing ? '완료' : '수정'}
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <PreferenceCard
            icon={<FontAwesomeIcon icon={faWineGlass} className="h-5 w-5" />}
            title="술 선호도"
            value={getAlcoholText(alcoholPreference)}
          />
          <PreferenceCard
            icon={<FontAwesomeIcon icon={faRunning} className="h-5 w-5" />}
            title="활동성 선호도"
            value={getActiveText(activeBound)}
          />
          <PreferenceCard
            icon={<FontAwesomeIcon icon={faUtensils} className="h-5 w-5" />}
            title="선호 음식"
            value={favoriteFoodCategories.length > 0 ? favoriteFoodCategories.join(', ') : '선택되지 않음'}
          />
          <PreferenceCard
            icon={<FontAwesomeIcon icon={faDollarSign} className="h-5 w-5" />}
            title="데이트 비용"
            value={getCostText(dateCostPreference)}
          />
          <PreferenceCard
            icon={<FontAwesomeIcon icon={faHeart} className="h-5 w-5" />}
            title="선호 분위기"
            value={atmosphere || '선택되지 않음'}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* 술 선호도 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              술을 즐기는 편인가요?
            </label>
            <SliderInput
              value={alcoholPreference}
              onChange={setAlcoholPreference}
              labels={['거의 안 마셔요', '가끔', '보통', '자주', '매우 즐겨']}
            />
          </div>

          {/* 활동성 선호도 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              활동적인 데이트를 좋아하시나요?
            </label>
            <SliderInput
              value={activeBound}
              onChange={setActiveBound}
              labels={['실내 선호', '실내 약간', '중립', '야외 약간', '야외 선호']}
            />
          </div>

          {/* 음식 선호도 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              어떤 음식을 좋아하시나요? (최대 3개)
            </label>
            <div className="flex flex-wrap gap-2">
              {['한식', '중식', '양식', '일식', '분식'].map((category) => (
                <FoodChip
                  key={category}
                  category={category}
                  isSelected={favoriteFoodCategories.includes(category as FoodList)}
                  onClick={() => {
                    if (favoriteFoodCategories.includes(category as FoodList)) {
                      setFavoriteFoodCategories((prev: FoodList[]) => prev.filter((f: FoodList) => f !== category));
                    } else if (favoriteFoodCategories.length < 3) {
                      setFavoriteFoodCategories((prev: FoodList[]) => [...prev, category as FoodList]);
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* 데이트 비용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              평균 데이트 비용은 어느 정도인가요?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['1만원 이하', '1 ~ 3만원', '3 ~ 5만원', '5 ~ 8만원', '8만원 이상'].map((cost) => (
                <button
                  key={cost}
                  onClick={() => setDateCostPreference(cost as CostList)}
                  className={`p-3 text-sm border transition-colors ${
                    dateCostPreference === cost
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary/50'
                  }`}
                >
                  {cost}
                </button>
              ))}
            </div>
          </div>

          {/* 선호 분위기 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              선호하는 데이트 분위기는 무엇인가요?
            </label>
            <input
              type="text"
              value={atmosphere || ''}
              onChange={(e) => setAtmosphere(e.target.value)}
              placeholder="예: 조용하고 로맨틱한, 활기찬, 자연스러운"
              className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
};
