import { useEffect } from "react";
import { useRecommendStore } from "../../shared/store/recommend.store";

export default function DataBootstrap() {
  const { restoreFromSession } = useRecommendStore();

  useEffect(() => {
    // 앱 시작 시 session storage에서 데이터 복원
    restoreFromSession();
  }, [restoreFromSession]);

  return null;
}
