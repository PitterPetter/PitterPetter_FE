import { http, HttpResponse, delay } from 'msw';
import diary from '../features/diary/mocks/diary.json';
import course from '../features/course/mocks/getCourse.json';

export const handlers = [
  http.get('https://api.loventure.us/api/mapbox', async () => {
    // await delay(2000); // 2초 지연
    return HttpResponse.json(diary);
  }),
  http.get('*/home', () => {
    return HttpResponse.json({ message: 'Home endpoint' });
  }),
  http.get('https://api.loventure.us/api/diaries', async () => {
    await delay(2000);
    return HttpResponse.json(diary);
  }),
  http.get('https://api.loventure.us/api/courses', async () => {
    await delay(2000);
    return HttpResponse.json(course);
  }),
];
