'use client';
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import { Heart, SquarePen } from 'lucide-react';
// 실제 데이터 바인딩 타입
import DatePicker from '@/commons/components/datepicker';
import Searchbar from '@/commons/components/searchbar';
import Button from '@/commons/components/button';
import Pagination from '@/commons/components/pagination';
import { useBoardsLinkRouting } from './hooks/index.link.routing.hook';
import {
  useBoardsBinding,
  type GalleryCardBinding,
} from './hooks/index.binding.hook';

// 갤러리 카드 컴포넌트
const GalleryCardComponent: React.FC<
  GalleryCardBinding & {
    onClick: () => void;
    onLike: (id: string) => Promise<number>;
    testId?: string;
  }
> = ({
  id,
  title,
  author,
  authorImage,
  likeCount,
  date,
  image,
  onClick,
  onLike,
  testId,
}) => {
  const [isLikedByMe, setIsLikedByMe] = useState<boolean>(false);
  const [optimisticLikeCount, setOptimisticLikeCount] =
    useState<number>(likeCount);

  useEffect(() => {
    try {
      const liked = localStorage.getItem(`board-like-${id}`) === 'true';
      setIsLikedByMe(liked);
    } catch {
      setIsLikedByMe(false);
    }
  }, [id]);

  return (
    <div className={styles.galleryCard} onClick={onClick} data-testid={testId}>
      {/* 이미지 영역 */}
      <div className={styles.imageArea}>
        <Image
          src={image}
          alt={title}
          width={112}
          height={152}
          className={styles.cardImage}
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div className={styles.contentArea}>
        {/* 상단 영역 */}
        <div className={styles.topArea}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <div className={styles.profile}>
            <Image
              src={authorImage}
              alt={author}
              width={24}
              height={24}
              className={styles.profileImage}
            />
            <span className={styles.authorName}>{author}</span>
          </div>
        </div>

        {/* 하단 영역 */}
        <div className={styles.bottomArea}>
          <div
            className={styles.likeArea}
            onClick={async e => {
              e.stopPropagation();
              if (isLikedByMe) return; // 한 아이디 당 한 번만
              try {
                const next = await onLike(id);
                setIsLikedByMe(true);
                setOptimisticLikeCount(next);
              } catch {}
            }}
            data-testid={`heart-${id}`}
          >
            <Heart
              size={24}
              className={styles.heartIcon}
              fill={isLikedByMe ? 'currentColor' : 'none'}
            />
            <span className={styles.likeCount}>{optimisticLikeCount}</span>
          </div>
          <span className={styles.date}>{date}</span>
        </div>
      </div>
    </div>
  );
};

// mock 데이터 제거됨

const Boards = () => {
  const { handleClickHotCard, handleClickBoardItem, handleClickCreate } =
    useBoardsLinkRouting();
  const {
    galleryCards,
    boardItems,
    currentPage,
    totalPages,
    setPage,
    likeBoardById,
  } = useBoardsBinding({ initialPage: 1, pageSize: 10 });

  return (
    <div className={styles.container} data-testid="boards-page">
      {/* 오늘 핫한 트립토크 영역 */}
      <div className={styles.hotTripTalk}>
        <h2 className={styles.title}>오늘 핫한 트립토크</h2>

        {/* Gap 영역 */}
        <div className={styles.gap}></div>

        {/* 갤러리 영역 */}
        <div className={styles.galleryArea}>
          {galleryCards.map(card => (
            <GalleryCardComponent
              key={card.id}
              {...card}
              onClick={() => handleClickHotCard(card.id)}
              onLike={likeBoardById}
              testId={`hot-card-${card.id}`}
            />
          ))}
        </div>
      </div>

      {/* Gap 영역 */}
      <div className={styles.gap}></div>

      {/* 트립토크 게시판 영역 */}
      <div className={styles.tripTalkBoard}>
        {/* 타이틀 영역 */}
        <h2 className={styles.boardTitle}>트립토크 게시판</h2>

        {/* Gap 영역 */}
        <div className={styles.gap}></div>

        {/* Search 영역 */}
        <div className={styles.searchArea}>
          <div className={styles.searchLeft}>
            <div className={styles.datePickerBox}>
              <DatePicker
                size="medium"
                theme="light"
                className={styles.datePicker}
              />
            </div>
            <Searchbar
              size="medium"
              theme="light"
              placeholder="제목을 검색해 주세요."
              className={styles.searchBar}
            />
            <Button
              variant="primary"
              size="medium"
              className={styles.searchButton}
            >
              검색
            </Button>
          </div>
          <div className={styles.searchRight}>
            <Button
              variant="secondary"
              size="medium"
              className={styles.writeButton}
              onClick={handleClickCreate}
              leftIcon={<SquarePen size={24} className={styles.writeIcon} />}
              data-testid="write-button"
            >
              트립토크 등록
            </Button>
          </div>
        </div>

        {/* Gap 영역 */}
        <div className={styles.gap}></div>

        {/* Main 영역 */}
        <div className={styles.mainArea}>
          {/* 게시글 목록 */}
          <div className={styles.boardList}>
            {/* 헤더 */}
            <div className={styles.boardHeader}>
              <div className={styles.headerNumber}>번호</div>
              <div className={styles.headerTitle}>제목</div>
              <div className={styles.headerAuthor}>작성자</div>
              <div className={styles.headerDate}>날짜</div>
            </div>

            {/* 게시글 목록 */}
            <div className={styles.boardItems}>
              {boardItems.map(item => (
                <div
                  key={item.id}
                  className={styles.boardItem}
                  onClick={() => handleClickBoardItem(item.id)}
                  data-testid={`board-item-${item.id}`}
                >
                  <div className={styles.itemNumber}>{item.number}</div>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemAuthor}>{item.author}</div>
                  <div className={styles.itemDate}>{item.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className={styles.paginationArea}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={page => setPage(page)}
              variant="primary"
              size="medium"
              theme="light"
              className={styles.pagination}
            />
          </div>
        </div>
      </div>

      {/* Gap 영역 */}
      <div className={styles.gap}></div>
    </div>
  );
};

export default Boards;
