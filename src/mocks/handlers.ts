// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw';
import diary from '../features/diary/mocks/diary.json';
import course from '../features/course/mocks/getCourse.json';
import diaryDetail from '../features/diary/mocks/diaryDetail.json';
import coupleRoomCode from '../features/coupleroom/mocks/coupleCodeMock.json';
import mypage from '../features/mypage/mocks/mypageMock.json';

// 한 곳에서 베이스 URL 관리
const API = 'https://api.loventure.us';

export const handlers = [
  // 맵박스 조회 API
  http.get(`${API}/api/mapbox`, async () => {
    await delay(500);
    return HttpResponse.json({
      markers: [
        { id: 'm1', name: '샘플 POI', lat: 37.5665, lng: 126.9780, category: 'CAFE' }
      ]
    });
  }),

  // 홈 조회 API
  http.get('*/home', () => {
    return HttpResponse.json({ message: 'Home endpoint' });
  }),

  // 다이어리 목록
  http.get(`${API}/api/diaries`, async () => {
    await delay(800);
    return HttpResponse.json(diary);
  }),

  // 코스 목록
  http.get(`${API}/api/courses`, async () => {
    await delay(800);
    return HttpResponse.json(course);
  }),

  // 코스 저장
  http.post(`${API}/api/courses`, async ({ request }) => {
    await delay(500);
    const body = await request.json().catch(() => ({}));
    console.log('Course save request:', body);
    
    return HttpResponse.json({
      course_id: Date.now(), // 임시 ID 생성
      message: '코스가 성공적으로 저장되었습니다.',
      data: body
    });
  }),

  // 다이어리 생성
  http.post(`${API}/api/diaries`, async () => {
    await delay(800);
    return HttpResponse.json(diary);
  }),

  // 다이어리 상세
  http.get(`${API}/api/diaries/:id`, async () => {
    await delay(500);
    return HttpResponse.json(diaryDetail);
  }),

  // 커플 방 생성
  http.post(`${API}/api/home/coupleroom`, async () => {
    await delay(500);
    return HttpResponse.json(coupleRoomCode);
  }),

  // 커플 방 코드 검증
  http.post(`${API}/api/couples/match`, async () => {
    await delay(500);
    return HttpResponse.json(coupleRoomCode);
  }),

  // 온보딩 저장
  http.post(`${API}/api/onboarding/me`, async () => {
    await delay(500);
    return HttpResponse.json({ status: 'success', message: 'Onboarding endpoint' });
  }),

  // 마이페이지 조회
  http.get(`${API}/api/auth/mypage`, async () => {
    await delay(500);
    return HttpResponse.json(mypage);
  }),

  // 마이페이지 수정
  http.put(`${API}/api/auth/profile`, async () => {
    await delay(500);
    return HttpResponse.json(mypage);
  }),

  // 커플 헤어지기
  http.delete(`${API}/api/couples/cancel`, async () => {
    await delay(500);
    return HttpResponse.json({ status: 'success' });
  }),

  // 커플 정보 수정
  http.put(`${API}/api/couples`, async () => {
    await delay(500);
    return HttpResponse.json({ status: 'success' });
  }),

  // 추천 코스
  http.post(`${API}/api/recommends`, async ({ request }) => {
    await delay(700);
    // const body = await request.json().catch(() => ({})); // 필요 시 요청 바디 사용

    const mock = {
      explain: '오늘 무드에 맞는 코스입니다~',
      data: [
        {
          id: 'poi-1',
          seq: 1,
          name: '이태리 레게노 식당',
          category: 'RESTAURANT', // 일관되게 대문자
          lat: 37.69231,
          lng: 126.92501,
          indoor: true,
          price_level: 2,
          open_hours: {
            mon: '09:00-18:00',
            tue: '09:00-18:00',
            wed: '09:00-18:00',
            thu: '09:00-18:00',
            fri: '09:00-20:00',
            sat: '10:00-20:00',
            sun: '10:00-18:00',
          },
          alcohol: false,           // boolean로 통일
          mood_tag: 'LOVELY',       // 태그도 UPPER_CASE 추천
          food_tag: ['PASTA', 'PIZZA'],
          rating_avg: 4.3,
          link: 'https://example.com/italian',
          reason: '분위기/가격대 밸런스 양호', // 공백/한글 key 지양
        },
        {
          id: 'poi-2',
          seq: 2,
          name: 'Blue Bottle Yeonnam',
          category: 'CAFE',
          lat: 37.76231,
          lng: 126.92501,
          indoor: true,
          price_level: 2,
          open_hours: {
            mon: '09:00-18:00',
            tue: '09:00-18:00',
            wed: '09:00-18:00',
            thu: '09:00-18:00',
            fri: '09:00-20:00',
            sat: '10:00-20:00',
            sun: '10:00-18:00',
          },
          alcohol: false,
          mood_tag: 'CALM',
          food_tag: ['COFFEE', 'DESSERT'],
          rating_avg: 4.3,
          link: 'https://example.com/yeonnam-cafe',
          reason: '산책 후 휴식에 적합',
        },
      ],
    };

    return HttpResponse.json(mock);
  }),

  // 댓글 작성
  http.post(`${API}/api/diaries/:id/comments`, async ({ params, request }) => {
    await delay(300);
    const body = await request.json().catch(() => ({}));
    const { id } = params;
    
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      code: "COMMON200",
      result: {
        commentId: Date.now().toString(),
        content: (body as any).content,
        userId: "7610272898923", // mypageMock.json의 userId와 동일하게 설정
        authorName: "양지훈",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }),

  // 댓글 수정
  http.put(`${API}/api/diaries/:diaryId/comments/:commentId`, async ({ params, request }) => {
    await delay(300);
    const body = await request.json().catch(() => ({}));
    
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      code: "COMMON200",
      result: {
        commentId: (params as any).commentId,
        content: (body as any).content,
        userId: "7610272898923", // mypageMock.json의 userId와 동일하게 설정
        authorName: "양지훈",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }),

  // 댓글 삭제
  http.delete(`${API}/api/diaries/:diaryId/comments/:commentId`, async () => {
    await delay(300);
    
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      code: "COMMON200",
      result: "댓글이 성공적으로 삭제되었습니다."
    });
  }),
];
