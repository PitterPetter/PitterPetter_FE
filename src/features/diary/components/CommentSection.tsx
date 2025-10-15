import { useState, useEffect } from 'react';
import { commentApi } from '../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { mypageApi } from '../../mypage/api';

interface Comment {
  commentId: string;
  content: string;
  userId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  diaryId: string;
  comments: Comment[];
}

export const CommentSection = ({ diaryId, comments }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await mypageApi.getMypage();
        setCurrentUserId(response.data.data.userId);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // 댓글 수정/삭제 권한 체크 함수
  const canEditComment = (comment: Comment) => {
    return currentUserId && comment.userId === currentUserId;
  };

  // 댓글 작성
  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string }) => commentApi.createComment(diaryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaryDetail', diaryId] });
      setNewComment('');
      toast.success('댓글이 작성되었습니다.');
    },
    onError: () => {
      toast.error('댓글 작성에 실패했습니다.');
    },
  });

  // 댓글 수정
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) => 
      commentApi.updateComment(diaryId, commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaryDetail', diaryId] });
      setEditingCommentId(null);
      setEditingContent('');
      toast.success('댓글이 수정되었습니다.');
    },
    onError: () => {
      toast.error('댓글 수정에 실패했습니다.');
    },
  });

  // 댓글 삭제
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentApi.deleteComment(diaryId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaryDetail', diaryId] });
      toast.success('댓글이 삭제되었습니다.');
    },
    onError: () => {
      toast.error('댓글 삭제에 실패했습니다.');
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast.error('댓글 내용을 입력해주세요.');
      return;
    }
    createCommentMutation.mutate({ content: newComment.trim() });
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.commentId);
    setEditingContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editingContent.trim()) {
      toast.error('댓글 내용을 입력해주세요.');
      return;
    }
    if (editingCommentId) {
      updateCommentMutation.mutate({ commentId: editingCommentId, content: editingContent.trim() });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full rounded-md border-t border-gray-300">
      <h2 className="text-lg text-gray-800">댓글</h2>
      
      {/* 댓글 작성 */}
      <div className="flex flex-col gap-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 작성해주세요..."
          className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#662B2B]/20 focus:border-[#662B2B]"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmitComment}
            disabled={createCommentMutation.isPending}
            className="px-4 py-2 bg-[#662B2B] text-white rounded-md hover:bg-[#662B2B]/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createCommentMutation.isPending ? '작성 중...' : '댓글 작성'}
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-3">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentId} className="flex items-start justify-start gap-2 w-full">
              <div className="min-w-[40px] min-h-[40px] bg-gray-300 rounded-full flex-shrink-0">
              </div>
              <div className="flex-1 bg-gray-100 rounded-md p-3">
                {editingCommentId === comment.commentId ? (
                  // 수정 모드
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full h-16 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#662B2B]/20"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={updateCommentMutation.isPending}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {updateCommentMutation.isPending ? '저장 중...' : '저장'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // 일반 모드
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{comment.authorName}</p>
                        <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                      </div>
                      {canEditComment(comment) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.commentId)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{comment.createdAt.split("T")[0]}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            아직 댓글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
