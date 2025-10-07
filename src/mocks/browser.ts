import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// MSW 설정: 외부 서비스 요청은 무시
worker.start({
  onUnhandledRequest: (req, print) => {
    // Mapbox 관련 요청은 무시
    if (req.url.includes('mapbox.com') || req.url.includes('events.mapbox.com')) {
      return;
    }
    // 다른 요청은 경고 출력
    print.warning();
  }
});
