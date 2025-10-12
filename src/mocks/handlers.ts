import { http, HttpResponse, delay } from 'msw';
import diary from '../features/diary/mocks/diary.json';
import course from '../features/course/mocks/getCourse.json';
import diaryDetail from '../features/diary/mocks/diaryDetail.json';
import coupleRoomCode from '../features/coupleroom/mocks/coupleCodeMock.json';
import mypage from '../features/mypage/mocks/mypageMock.json';

export const handlers = [
  // 맵박스 조회 API
  http.get('https://api.loventure.us/api/mapbox', async () => {
    // await delay(2000); // 2초 지연
    return HttpResponse.json(diary);
  }),

  // 홈 조회 API
  http.get('*/home', () => {
    return HttpResponse.json({ message: 'Home endpoint' });
  }),

  // 다이어리 목록 조회 API
  http.get('https://api.loventure.us/api/diaries', async () => {
    await delay(2000);
    return HttpResponse.json(diary);
  }),

  // 코스 조회 API
  http.get('https://api.loventure.us/api/courses', async () => {
    await delay(2000);
    return HttpResponse.json(course);
  }),

  // 다이어리 생성 API
  http.post('https://api.loventure.us/api/diaries', async (req) => {
    await delay(2000);
    return HttpResponse.json(diary);
  }),

  // 다이어리 상세 조회 API
  http.get('https://api.loventure.us/api/diaries/:id', async (req) => {
    await delay(2000);
    return HttpResponse.json(diaryDetail);
  }),

  // 커플 방 생성 API
  http.post('https://api.loventure.us/api/home/coupleroom', async (req) => {
    await delay(2000);
    return HttpResponse.json(coupleRoomCode);
  }),

  // 커플 방 코드 검증 API
  http.post('https://api.loventure.us/api/couples/match', async (req) => {
    await delay(2000);
    return HttpResponse.json(coupleRoomCode);
  }),
    
  // 온보딩 정보 저장 API
  http.post('https://api.loventure.us/api/onboarding/me', async (req) => {
    await delay(2000);
    return HttpResponse.json({ status: 'success', message: 'Onboarding endpoint' });
  }),

  // 마이페이지 조회 API
  http.get('https://api.loventure.us/api/auth/mypage', async (req) => {
    await delay(2000);
    return HttpResponse.json(mypage);
  }),

  // 마이페이지 수정 API
  http.put('https://api.loventure.us/api/auth/profile', async (req) => {
    await delay(2000);
    return HttpResponse.json(mypage);
  }),

  // 커플 헤어지기 API
  http.delete('https://api.loventure.us/api/couples/room/:coupleId', async (req) => {
    await delay(2000);
    return HttpResponse.json(mypage);
  }),

  // 커플 정보 수정 API
  http.put('https://api.loventure.us/api/couples', async (req) => {
    await delay(2000);
    return HttpResponse.json(mypage);
  }),
];
  