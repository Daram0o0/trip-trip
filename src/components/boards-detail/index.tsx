'use client';
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import {
  MessageCircle,
  Star,
  Link,
  MapPin,
  ThumbsDown,
  ThumbsUp,
  Play,
  Pencil,
  TextAlignJustify,
} from 'lucide-react';
// 실제 데이터 바인딩 타입
import { Button } from '@/commons/components/button';
import Input from '@/commons/components/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useParams } from 'next/navigation';
import { useBoardDetailBinding } from './hooks/index.binding.hook';
import { useBoardDetailLinkRouting } from './hooks/index.link.routing.hook';
import { useAuth } from '@/commons/providers/auth/auth.provider';

const BoardsDetail = () => {
  const params = useParams<{ id?: string }>();
  const boardId = params?.id ?? '';
  const {
    detail,
    comments,
    isLiked,
    isDisliked,
    handleLikeClick,
    handleDislikeClick,
  } = useBoardDetailBinding({ boardId });
  const { handleListClick, handleEditClick } =
    useBoardDetailLinkRouting(boardId);
  const { user, isAuthenticated } = useAuth();

  // 별점 상태
  const [rating, setRating] = useState<number>(0);
  // 유튜브 재생 상태
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 사용자 이름 추출 헬퍼 함수
  const getUserNameFromUser = (userObj: unknown): string | null => {
    if (!userObj || typeof userObj !== 'object') return null;
    const obj = userObj as { name?: string; _id?: string };
    return obj.name || null;
  };

  // localStorage에서 user 정보를 안전하게 가져오는 함수
  const getUserFromLocalStorage = (): string => {
    if (typeof window === 'undefined') return '';
    try {
      const userStr = window.localStorage.getItem('user');
      if (userStr) {
        const userFromStorage = JSON.parse(userStr) as {
          name?: string;
          _id?: string;
        };
        return userFromStorage?.name || '';
      }
    } catch {
      // localStorage 파싱 오류는 무시 (빈 문자열 반환)
    }
    return '';
  };

  // 댓글 입력 상태
  const [author, setAuthor] = useState<string>(() => getUserFromLocalStorage());
  const [password, setPassword] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');

  // 로그인된 사용자 정보를 작성자 Input에 자동 입력
  useEffect(() => {
    // auth provider의 user가 있으면 우선 사용
    if (isAuthenticated && user) {
      const userName = getUserNameFromUser(user);
      if (userName) {
        setAuthor(userName);
        return;
      }
    }

    // auth provider의 user가 없거나 name이 없으면 localStorage에서 직접 확인
    if (isAuthenticated) {
      const userNameFromStorage = getUserFromLocalStorage();
      if (userNameFromStorage) {
        setAuthor(userNameFromStorage);
        return;
      }
    }

    // 로그인하지 않았으면 빈 문자열
    if (!isAuthenticated) {
      setAuthor('');
    }
  }, [isAuthenticated, user]);

  // 별점 렌더링 함수
  const renderStars = (
    currentRating: number = rating,
    clickable: boolean = true
  ) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starIndex = index + 1;
      const isFilled = starIndex <= currentRating;

      return (
        <Star
          key={index}
          size={24}
          fill={isFilled ? 'currentColor' : 'none'}
          className={`${styles.starIcon} ${clickable ? styles.clickableStar : ''}`}
          onClick={clickable ? () => setRating(starIndex) : undefined}
        />
      );
    });
  };
  return (
    <div className={styles.container} data-testid="board-detail-page">
      {/* 타이틀 영역 */}
      <div className={styles.titleArea}>
        <h1 className={styles.title} data-testid="board-title">
          {detail?.title ?? ''}
        </h1>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Info 영역 */}
      <div className={styles.infoArea}>
        <div className={styles.infoTop}>
          <div className={styles.profile}>
            <Image
              src="/images/profile/img-1.png"
              alt="프로필 이미지"
              width={24}
              height={24}
              className={styles.profileImage}
            />
            <span className={styles.profileName} data-testid="board-writer">
              {detail?.writer ?? ''}
            </span>
          </div>
          <div className={styles.dateArea}>
            <span className={styles.date} data-testid="board-date">
              {detail?.createdDate ?? ''}
            </span>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.infoBottom}>
          <div className={styles.iconGroup}>
            {detail?.youtubeUrl && (
              <a
                href={detail.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconLink}
              >
                <Link size={24} className={styles.icon} />
              </a>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={styles.iconButton}
                    data-testid="board-address-pin"
                  >
                    <MapPin size={24} className={styles.icon} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span data-testid="board-address-tooltip">
                    {detail?.addressText && detail.addressText.trim()
                      ? detail.addressText
                      : '등록된 주소 없음'}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* 이미지 영역 */}
      {detail?.images && detail.images.length > 0 && (
        <>
          <div className={styles.imageArea}>
            <Image
              src={detail.image}
              alt="게시물 이미지"
              width={400}
              height={531}
              className={styles.postImage}
            />
          </div>

          {/* Gap */}
          <div className={styles.gap}></div>
        </>
      )}

      {/* Content 영역 */}
      <div className={styles.contentArea}>
        <p className={styles.content} data-testid="board-contents">
          {detail?.contents ?? ''}
        </p>
      </div>

      {/* Gap */}
      {detail?.youtubeUrl && (
        <>
          <div className={styles.gap}></div>

          {/* 동영상 영역 */}
          <div className={styles.videoArea}>
            <div className={styles.videoContainer}>
              {isPlaying && detail.youtubeEmbedUrl ? (
                <iframe
                  src={detail.youtubeEmbedUrl}
                  width="822"
                  height="464"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.videoIframe}
                  data-testid="youtube-iframe"
                />
              ) : (
                <>
                  <Image
                    src={
                      detail.youtubeThumbnail ?? '/images/Frame 427323252.png'
                    }
                    alt="동영상 썸네일"
                    width={822}
                    height={464}
                    className={styles.videoThumbnail}
                  />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className={styles.playButton}
                    type="button"
                    data-testid="youtube-play-button"
                  >
                    <Play size={20} className={styles.playIcon} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Gap */}
          <div className={styles.gap}></div>
        </>
      )}

      {/* 아이콘 영역 */}
      <div className={styles.iconArea}>
        <button
          type="button"
          className={styles.iconItemButton}
          onClick={handleDislikeClick}
          data-testid="board-dislike-button"
          disabled={isDisliked}
        >
          <ThumbsDown
            size={24}
            className={`${styles.iconDislikeColor}`}
            fill={isDisliked ? 'currentColor' : 'none'}
          />
          <span
            className={styles.iconDislikeCountColor}
            data-testid="board-dislike-count"
          >
            {detail?.dislikeCount ?? 0}
          </span>
        </button>
        <button
          type="button"
          className={styles.iconItemButton}
          onClick={handleLikeClick}
          data-testid="board-like-button"
          disabled={isLiked}
        >
          <ThumbsUp
            size={24}
            className={`${styles.iconLikeColor}`}
            fill={isLiked ? 'currentColor' : 'none'}
          />
          <span
            className={styles.iconLikeCountColor}
            data-testid="board-like-count"
          >
            {detail?.likeCount ?? 0}
          </span>
        </button>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* 버튼 영역 */}
      <div className={styles.buttonArea}>
        <Button
          variant="outline"
          size="medium"
          className={styles.button}
          leftIcon={<TextAlignJustify className={styles.outlineIcon} />}
          onClick={handleListClick}
          type="button"
          data-testid="board-detail-list-button"
        >
          <p className={styles.buttonText}>목록으로</p>
        </Button>
        <Button
          variant="outline"
          size="medium"
          className={styles.button}
          leftIcon={<Pencil className={styles.outlineIcon} />}
          onClick={handleEditClick}
          type="button"
          data-testid="board-detail-edit-button"
        >
          <p className={styles.buttonText}>수정하기</p>
        </Button>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* 댓글 영역 */}
      <div className={styles.commentArea}>
        {/* 댓글 입력 영역 */}
        <div className={styles.commentInputArea}>
          <div className={styles.commentHeader}>
            <div className={styles.commentTitle}>
              <MessageCircle size={24} className={styles.icon} />
              <span className={styles.commentTitleText}>댓글</span>
            </div>
          </div>

          <div className={styles.starRating}>{renderStars()}</div>

          <div className={styles.inputContainer}>
            <div className={styles.authorPasswordRow}>
              <div className={styles.authorField}>
                <Input
                  label="작성자"
                  required
                  placeholder="작성자 명을 입력해 주세요."
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className={styles.authorInput}
                  readOnly={isAuthenticated}
                  data-testid="comment-author-input"
                />
              </div>
              <div className={styles.passwordField}>
                <Input
                  label="비밀번호"
                  required
                  type="password"
                  placeholder="비밀번호를 입력해 주세요."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={styles.passwordInput}
                />
              </div>
            </div>
            <div className={styles.commentTextWrapper}>
              <Input
                isTextarea
                placeholder="댓글을 입력해 주세요."
                maxLength={100}
                showCount
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className={styles.commentInput}
              />
            </div>
            <Button
              variant="primary"
              size="medium"
              className={styles.commentSubmitButton}
            >
              댓글 등록
            </Button>
          </div>
        </div>

        {/* Gap */}
        <div className={styles.commentGap}></div>

        {/* 댓글 리스트 영역 */}
        <div className={styles.commentListArea}>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <React.Fragment key={comment.id}>
                <div
                  className={styles.commentItem}
                  data-testid={`comment-item-${index}`}
                >
                  <div className={styles.commentItemHeader}>
                    <div className={styles.commentProfile}>
                      <Image
                        src={'/images/profile/img.png'}
                        alt="프로필 이미지"
                        width={24}
                        height={24}
                        className={styles.profileImage}
                      />
                      <span className={styles.profileName}>
                        {comment.author}
                      </span>
                      <div className={styles.commentStars}>
                        {renderStars(comment.rating, false)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.commentContent}>{comment.content}</div>
                  <div className={styles.commentDate}>{comment.date}</div>
                </div>
                {index < comments.length - 1 && (
                  <div className={styles.commentDivider}></div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className={styles.noComments} data-testid="no-comments">
              회고가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardsDetail;
