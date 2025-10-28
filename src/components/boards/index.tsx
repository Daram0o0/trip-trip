'use client';
import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import {
  type GalleryCard,
  mockGalleryData,
  validateMockData,
  getMockDataStats,
} from './mockData';
import DatePicker from '@/commons/components/datepicker';
import Searchbar from '@/commons/components/searchbar';
import Button from '@/commons/components/button';
import Pagination from '@/commons/components/pagination';

// 갤러리 카드 컴포넌트
const GalleryCardComponent: React.FC<GalleryCard> = ({
  title,
  author,
  authorImage,
  likeCount,
  date,
  image,
}) => {
  return (
    <div className={styles.galleryCard}>
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
          <div className={styles.likeArea}>
            <div className={styles.likeIcon}></div>
            <span className={styles.likeCount}>{likeCount}</span>
          </div>
          <span className={styles.date}>{date}</span>
        </div>
      </div>
    </div>
  );
};

// Mock 게시판 데이터
const mockBoardData = [
  {
    id: 1,
    number: 243,
    title: '제주 살이 1일차',
    author: '홍길동',
    date: '2024.12.16',
  },
  {
    id: 2,
    number: 242,
    title: '강남 살이 100년차',
    author: '홍길동',
    date: '2024.12.16',
  },
  {
    id: 3,
    number: 241,
    title: '길 걷고 있었는데 고양이한테 간택 받았어요',
    author: '홍길동',
    date: '2024.12.16',
  },
  {
    id: 4,
    number: 240,
    title: '오늘 날씨 너무 좋아서 바다보러 왔어요~',
    author: '홍길동',
    date: '2024.12.16',
  },
  {
    id: 5,
    number: 239,
    title: '누가 양양 핫하다고 했어 나밖에 없는데?',
    author: '홍길동',
    date: '2024.12.16',
  },
  {
    id: 6,
    number: 238,
    title: '여름에 보드타고 싶은거 저밖에 없나요 🥲',
    author: '홍길동',
    date: '2024.12.16',
  },
  {
    id: 7,
    number: 237,
    title:
      '사무실에서 과자 너무 많이 먹은거 같아요 다이어트하러 여행 가야겠어요',
    author: '홍길동',
    date: '2024.12.16',
  },
  {
    id: 8,
    number: 236,
    title: '여기는 기승전 여행이네요 ㅋㅋㅋ',
    author: '홍길동',
    date: '2024.12.16',
  },
  {
    id: 9,
    number: 235,
    title: '상여금 들어왔는데 이걸로 다낭갈까 사이판 갈까',
    author: '홍길동',
    date: '2024.12.16',
  },
  {
    id: 10,
    number: 234,
    title: '강릉 여름바다 보기 좋네요',
    author: '홍길동',
    date: '2024.12.16',
  },
];

const Boards = () => {
  // Mock 데이터 사용 및 검증
  const galleryData = mockGalleryData;

  // Mock 데이터 검증 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    const isValid = validateMockData(galleryData);
    if (!isValid) {
      console.warn('Mock 데이터 검증 실패');
    }

    // Mock 데이터 통계 출력 (개발 환경에서만)
    const stats = getMockDataStats(galleryData);
    console.log('Mock 데이터 통계:', stats);
  }

  return (
    <div className={styles.container}>
      {/* 오늘 핫한 트립토크 영역 */}
      <div className={styles.hotTripTalk}>
        <h2 className={styles.title}>오늘 핫한 트립토크</h2>

        {/* Gap 영역 */}
        <div className={styles.gap}></div>

        {/* 갤러리 영역 */}
        <div className={styles.galleryArea}>
          {galleryData.map(card => (
            <GalleryCardComponent key={card.id} {...card} />
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
              leftIcon={
                <Image
                  src="/icons/outline/rwrite.svg"
                  alt="글쓰기"
                  width={24}
                  height={24}
                />
              }
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
              {mockBoardData.map(item => (
                <div key={item.id} className={styles.boardItem}>
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
              currentPage={1}
              totalPages={10}
              onPageChange={page => console.log('Page changed:', page)}
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
