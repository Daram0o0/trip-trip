import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import {
  type GalleryCard,
  mockGalleryData,
  validateMockData,
  getMockDataStats,
} from './mockData';

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
        <h2>트립토크 게시판</h2>
      </div>

      {/* Gap 영역 */}
      <div className={styles.gap}></div>
    </div>
  );
};

export default Boards;
