import { http, HttpResponse, delay } from 'msw';
import diary from '../features/diary/mocks/diary.json';

export const handlers = [
  http.get('https://api.loventure.us/api/mapbox', async () => {
    // await delay(2000); // 2초 지연
    return HttpResponse.json(diary);
  }),
  http.get('*/home', () => {
    return HttpResponse.json({ message: 'Home endpoint' });
  }),
];
