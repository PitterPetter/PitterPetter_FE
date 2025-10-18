// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw';
import diary from '../features/diary/mocks/diary.json';
import course from '../features/course/mocks/getCourse.json';
import diaryDetail from '../features/diary/mocks/diaryDetail.json';
import coupleRoomCode from '../features/coupleroom/mocks/coupleCodeMock.json';
import mypage from '../features/mypage/mocks/mypageMock.json';
import districtLockMock from '../features/district/mocks/districtLockMock.json';

// 한 곳에서 베이스 URL 관리
const API = 'https://api.loventure.us';

// 메모리 기반 Mock Store
const mockStore = {
  // 다이어리별 댓글 저장소
  comments: new Map<string, any[]>(),
  
  // 초기 데이터 설정
  init() {
    // diaryDetail.json의 댓글을 초기 데이터로 설정
    if (diaryDetail.result.comments && diaryDetail.result.comments.length > 0) {
      this.comments.set('343532365357', diaryDetail.result.comments);
    }
  },
  
  // 댓글 추가
  addComment(diaryId: string, comment: any) {
    const comments = this.comments.get(diaryId) || [];
    comments.push(comment);
    this.comments.set(diaryId, comments);
    return comment;
  },
  
  // 댓글 수정
  updateComment(diaryId: string, commentId: string, content: string) {
    const comments = this.comments.get(diaryId) || [];
    const commentIndex = comments.findIndex(c => c.commentId === commentId);
    if (commentIndex !== -1) {
      comments[commentIndex] = {
        ...comments[commentIndex],
        content,
        updatedAt: new Date().toISOString()
      };
      this.comments.set(diaryId, comments);
      return comments[commentIndex];
    }
    return null;
  },
  
  // 댓글 삭제
  deleteComment(diaryId: string, commentId: string) {
    const comments = this.comments.get(diaryId) || [];
    const filteredComments = comments.filter(c => c.commentId !== commentId);
    this.comments.set(diaryId, filteredComments);
    return true;
  },
  
  // 다이어리 상세 정보에 댓글 포함해서 반환
  getDiaryDetailWithComments(diaryId: string) {
    const comments = this.comments.get(diaryId) || [];
    return {
      ...diaryDetail,
      result: {
        ...diaryDetail.result,
        comments
      }
    };
  }
};

// Mock Store 초기화
mockStore.init();

export const handlers = [
  // 홈 조회 API
  http.get('*/home', () => {
    return HttpResponse.json({ message: 'Home endpoint' });
  }),

  // 사용자 인증 상태 조회
  http.get(`${API}/api/auth/status`, async () => {
    await delay(300);
    return HttpResponse.json({
      status: "COMPLETED" // 테스트용으로 COMPLETED 상태 반환
    });
  }),

  // 지역구 잠금 상태 (지도용)
  http.get(`${API}/api/regions/search`, async () => {
    await delay(500);
    return HttpResponse.json(districtLockMock);
  }),

  // 지역구 잠금 해제
  http.post(`${API}/api/regions/unlock`, async ({ request }) => {
    await delay(500);
    const body = await request.json().catch(() => ({}));
    console.log('District unlock request:', body);
    
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      code: "COMMON200",
      result: {
        message: "지역구 잠금이 해제되었습니다.",
        unlockedRegions: (body as any).regions || []
      }
    });
  }),

  // 다이어리 목록
  http.get(`${API}/api/diaries`, async ({ request }) => {
    await delay(800);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '6');
    
    // 원본 데이터를 깊은 복사하여 사용
    const allDiaries = JSON.parse(JSON.stringify(diary.result.content));
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedDiaries = allDiaries.slice(startIndex, endIndex);
    
    const totalElements = allDiaries.length;
    const totalPages = Math.ceil(totalElements / size);
    
    return HttpResponse.json({
      timestamp: "2025-10-16T13:48:30.178+09:00",
      code: "COMMON200",
      result: {
        content: paginatedDiaries,
        page: {
          page,
          size,
          totalElements,
          totalPages
        }
      }
    });
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
  http.post(`${API}/api/diaries`, async ({ request }) => {
    await delay(800);
    const body = await request.json().catch(() => ({}));
    console.log('Diary create request:', body);
    
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      code: "COMMON200",
      result: {
        contentId: Date.now().toString(),
        title: (body as any).title || "새 다이어리",
        content: (body as any).content || "",
        courseId: (body as any).courseId || "",
        courseName: (body as any).courseName || "",
        rating: (body as any).rating || "0",
        userId: "7610272898923",
        author: "양지훈",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        imageId: "string",
        imageUrl: null,
        imageStatus: "PENDING",
        imageExpiresIn: 0,
        imageUpload: {
          imageId: Date.now().toString(),
          presignedUrl: "string",
          expiresIn: 300
        }
      }
    });
  }),

  // 다이어리 상세
  http.get(`${API}/api/diaries/:id`, async ({ params }) => {
    await delay(500);
    const { id } = params;
    const diaryData = mockStore.getDiaryDetailWithComments(id as string);
    return HttpResponse.json(diaryData);
  }),

  // 다이어리 수정
  http.put(`${API}/api/diaries/:id`, async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    console.log('Diary update request:', body);
    return HttpResponse.json({ status: 'success' });
  }),

  // 다이어리 삭제
  http.delete(`${API}/api/diaries/:id`, async ({ params }) => {
    await delay(500);
    const { id } = params;
    console.log('Diary delete request for ID:', id);
    return HttpResponse.json({ status: 'success' });
  }),

  // 이미지 업로드 완료 알림
  http.post(`${API}/api/images/:imageId/complete`, async ({ params }) => {
    await delay(300);
    const { imageId } = params;
    console.log('Image upload complete for ID:', imageId);
    return HttpResponse.json({ status: 'success' });
  }),

  // 이미지 업로드 실패 알림
  http.post(`${API}/api/images/:imageId/fail`, async ({ params }) => {
    await delay(300);
    const { imageId } = params;
    console.log('Image upload failed for ID:', imageId);
    return HttpResponse.json({ status: 'success' });
  }),

  // 커플 방 생성
  http.post(`${API}/api/couples/room`, async () => {
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
        {
          id: 'poi-3',
          seq: 3,
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
        {
          id: 'poi-4',
          seq: 4,
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
        {
          id: 'poi-5',
          seq: 5,
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
    
    const newComment = {
      commentId: Date.now().toString(),
      content: (body as any).content,
      userId: "7610272898923", // mypageMock.json의 userId와 동일하게 설정
      authorName: "양지훈",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // mockStore에 댓글 저장
    mockStore.addComment(id as string, newComment);
    
    console.log('댓글 작성 완료:', newComment);
    console.log('현재 댓글 목록:', mockStore.comments.get(id as string));
    
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      code: "COMMON200",
      result: newComment
    });
  }),

  // 댓글 수정
  http.put(`${API}/api/diaries/:diaryId/comments/:commentId`, async ({ params, request }) => {
    await delay(300);
    const body = await request.json().catch(() => ({}));
    const { diaryId, commentId } = params;
    
    // mockStore에서 댓글 수정
    const updatedComment = mockStore.updateComment(
      diaryId as string, 
      commentId as string, 
      (body as any).content
    );
    
    console.log('댓글 수정 완료:', updatedComment);
    console.log('현재 댓글 목록:', mockStore.comments.get(diaryId as string));
    
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      code: "COMMON200",
      result: updatedComment
    });
  }),

  // 댓글 삭제
  http.delete(`${API}/api/diaries/:diaryId/comments/:commentId`, async ({ params }) => {
    await delay(300);
    const { diaryId, commentId } = params;
    
    // mockStore에서 댓글 삭제
    mockStore.deleteComment(diaryId as string, commentId as string);
    
    console.log('댓글 삭제 완료:', { diaryId, commentId });
    console.log('현재 댓글 목록:', mockStore.comments.get(diaryId as string));
    
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      code: "COMMON200",
      result: "댓글이 성공적으로 삭제되었습니다."
    });
  }),

  // 재추천 코스
  http.post(`${API}/api/courses/recommends/replace`, async ({ request }) => {
    await delay(700);
    const body = await request.json().catch(() => ({}));
    console.log('재추천 API 요청 데이터:', body);
    
    const mock = {
      explain: '오늘 무드에 맞는 코스입니다~',
      data: [
        {
          id: 'poi-1',
          seq: 1,
          name: '이태리 레게노 식당',
          category: 'RESTAURANT',
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
          alcohol: false,
          mood_tag: 'LOVELY',
          food_tag: ['PASTA', 'PIZZA'],
          rating_avg: 4.3,
          link: 'https://example.com/italian',
          reason: '분위기/가격대 밸런스 양호',
        },
        {
          id: 'poi-2',
          seq: 2,
          name: 'Blue Bottle Yeonnam',
          category: 'CAFE',
          lat: 37.76231,
          lng: 126.92501,
        },
        {
          id: 'poi-3',
          seq: 3,
          name: 'Blue Bottle NewYork',
          category: 'CAFE',
          lat: 37.76231,
          lng: 126.92501,
        },
      ],
    };
    return HttpResponse.json(mock);
  }),

  // 지역구 목록 조회 API
  http.get(`${API}/api/districts`, async () => {
    await delay(300);
    return HttpResponse.json(districtLockMock);
  }),
];
