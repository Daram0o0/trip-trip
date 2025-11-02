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
  List,
  Edit,
} from 'lucide-react';
// 실제 데이터 바인딩 타입
import Button from '@/commons/components/button';
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
import { useCommentForm } from './hooks/index.form.hook';

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
  const { isAuthenticated } = useAuth();

  // 댓글 작성 form hook
  const {
    register,
    errors,
    touchedFields,
    isSubmitted,
    onSubmit,
    isSubmitDisabled,
    isPending,
    rating,
    setRating,
    ratingTouched,
    watch,
  } = useCommentForm({ boardId });

  const watchedWriter = watch('writer');
  const watchedPassword = watch('password');
  const watchedContents = watch('contents');

  // 유튜브 재생 상태
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
          data-testid={`star-${starIndex}`}
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
            {detail.images.slice(0, 3).map((imageUrl, index) => (
              <Image
                key={index}
                src={imageUrl}
                alt={`게시물 이미지 ${index + 1}`}
                width={400}
                height={531}
                className={styles.postImage}
              />
            ))}
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
          size="small"
          className={styles.button}
          onClick={handleListClick}
          type="button"
          data-testid="board-detail-list-button"
          leftIcon={<List size={16} />}
        >
          목록으로
        </Button>
        <Button
          variant="outline"
          size="small"
          className={styles.button}
          onClick={handleEditClick}
          type="button"
          data-testid="board-detail-edit-button"
          leftIcon={<Edit size={16} />}
        >
          수정하기
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

          <form onSubmit={onSubmit}>
            <div className={styles.starRating}>{renderStars()}</div>
            {errors.rating && (ratingTouched || isSubmitted) && (
              <div role="alert" className={styles.errorMessage}>
                {errors.rating.message}
              </div>
            )}

            <div className={styles.inputContainer}>
              <div className={styles.authorPasswordRow}>
                <div className={styles.authorField}>
                  <Input
                    label="작성자"
                    required={!isAuthenticated}
                    placeholder="작성자 명을 입력해 주세요."
                    {...register('writer')}
                    error={
                      errors.writer && (touchedFields.writer || isSubmitted)
                        ? errors.writer.message
                        : undefined
                    }
                    className={styles.authorInput}
                    readOnly={isAuthenticated}
                    data-testid="comment-author-input"
                  />
                </div>
                <div className={styles.passwordField}>
                  <Input
                    label="비밀번호"
                    required={!isAuthenticated}
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    {...register('password')}
                    error={
                      errors.password && (touchedFields.password || isSubmitted)
                        ? errors.password.message
                        : undefined
                    }
                    className={styles.passwordInput}
                    data-testid="comment-password-input"
                  />
                </div>
              </div>
              <div className={styles.commentTextWrapper}>
                <Input
                  isTextarea
                  placeholder="댓글을 입력해 주세요."
                  maxLength={100}
                  showCount
                  {...register('contents')}
                  error={
                    errors.contents && (touchedFields.contents || isSubmitted)
                      ? errors.contents.message
                      : undefined
                  }
                  className={styles.commentInput}
                  data-testid="comment-contents-input"
                />
              </div>
              <Button
                variant="primary"
                size="medium"
                type="submit"
                className={styles.commentSubmitButton}
                disabled={isSubmitDisabled}
                data-testid="comment-submit-button"
              >
                {isPending ? '등록 중...' : '댓글 등록'}
              </Button>
            </div>
          </form>
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
