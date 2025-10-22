/**
 * 갤러리 컴포넌트용 Mock 데이터
 * 실제 서비스와 유사한 다양한 데이터를 제공합니다.
 */

// 갤러리 카드 데이터 타입 정의
export interface GalleryCard {
  id: number;
  title: string;
  author: string;
  authorImage: string;
  likeCount: number;
  date: string;
  image: string;
  category?: string;
  location?: string;
  viewCount?: number;
  commentCount?: number;
}

// Mock 데이터 생성 유틸리티 함수들
export const generateMockDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0].replace(/-/g, '.');
};

export const generateMockLikeCount = (): number => {
  return Math.floor(Math.random() * 300) + 20;
};

export const generateMockViewCount = (): number => {
  return Math.floor(Math.random() * 5000) + 500;
};

export const generateMockCommentCount = (): number => {
  return Math.floor(Math.random() * 50) + 5;
};

// 실제 서비스와 유사한 Mock 데이터
export const mockGalleryData: GalleryCard[] = [
  {
    id: 1,
    title: '제주 살이 1일차 청산별곡이 생각나네요',
    author: '김제주',
    authorImage: '/images/profile/img-1.png',
    likeCount: generateMockLikeCount(),
    date: generateMockDate(1),
    image: '/images/img-1.png',
    category: '제주도',
    location: '제주시',
    viewCount: generateMockViewCount(),
    commentCount: generateMockCommentCount(),
  },
  {
    id: 2,
    title: '길 걷고 있었는데 고양이한테 간택 받았어요',
    author: '박고양',
    authorImage: '/images/profile/img-2.png',
    likeCount: generateMockLikeCount(),
    date: generateMockDate(2),
    image: '/images/img-2.png',
    category: '일상',
    location: '서울시',
    viewCount: generateMockViewCount(),
    commentCount: generateMockCommentCount(),
  },
  {
    id: 3,
    title: '강릉 여름바다 보기 좋네요 서핑하고 싶어요!',
    author: '이바다',
    authorImage: '/images/profile/img-3.png',
    likeCount: generateMockLikeCount(),
    date: generateMockDate(3),
    image: '/images/img-3.png',
    category: '강릉',
    location: '강릉시',
    viewCount: generateMockViewCount(),
    commentCount: generateMockCommentCount(),
  },
  {
    id: 4,
    title: '누가 양양 핫하다고 했어 나밖에 없는데?',
    author: '최양양',
    authorImage: '/images/profile/img-4.png',
    likeCount: generateMockLikeCount(),
    date: generateMockDate(4),
    image: '/images/img.png',
    category: '양양',
    location: '양양군',
    viewCount: generateMockViewCount(),
    commentCount: generateMockCommentCount(),
  },
];

// 추가 Mock 데이터 생성 함수
export const generateMockGalleryData = (count: number = 4): GalleryCard[] => {
  const titles = [
    '제주 살이 1일차 청산별곡이 생각나네요',
    '길 걷고 있었는데 고양이한테 간택 받았어요',
    '강릉 여름바다 보기 좋네요 서핑하고 싶어요!',
    '누가 양양 핫하다고 했어 나밖에 없는데?',
    '부산 해운대에서 일몰 보면서 감동받았어요',
    '속초 설악산 등반 후기 - 정말 힘들었지만 보람있었어요',
    '여수 밤바다 야경이 정말 아름다웠습니다',
    '전주 한옥마을에서 찍은 사진들 공유해요',
  ];

  const authors = [
    '김제주',
    '박고양',
    '이바다',
    '최양양',
    '정부산',
    '한속초',
    '윤여수',
    '강전주',
  ];

  const categories = [
    '제주도',
    '일상',
    '강릉',
    '양양',
    '부산',
    '속초',
    '여수',
    '전주',
  ];

  const locations = [
    '제주시',
    '서울시',
    '강릉시',
    '양양군',
    '부산시',
    '속초시',
    '여수시',
    '전주시',
  ];

  const images = [
    '/images/img-1.png',
    '/images/img-2.png',
    '/images/img-3.png',
    '/images/img.png',
    '/images/a.png',
    '/images/b.png',
    '/images/c.png',
    '/images/d.png',
  ];

  const profileImages = [
    '/images/profile/img-1.png',
    '/images/profile/img-2.png',
    '/images/profile/img-3.png',
    '/images/profile/img-4.png',
    '/images/profile/img-5.png',
    '/images/profile/img-6.png',
    '/images/profile/img-7.png',
    '/images/profile/img-8.png',
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: titles[index % titles.length],
    author: authors[index % authors.length],
    authorImage: profileImages[index % profileImages.length],
    likeCount: generateMockLikeCount(),
    date: generateMockDate(index + 1),
    image: images[index % images.length],
    category: categories[index % categories.length],
    location: locations[index % locations.length],
    viewCount: generateMockViewCount(),
    commentCount: generateMockCommentCount(),
  }));
};

// Mock 데이터 검증 함수
export const validateMockData = (data: GalleryCard[]): boolean => {
  return data.every(
    item =>
      item.id > 0 &&
      item.title.length > 0 &&
      item.author.length > 0 &&
      item.authorImage.length > 0 &&
      item.likeCount >= 0 &&
      item.date.length > 0 &&
      item.image.length > 0
  );
};

// Mock 데이터 통계 함수
export const getMockDataStats = (data: GalleryCard[]) => {
  const totalLikes = data.reduce((sum, item) => sum + item.likeCount, 0);
  const totalViews = data.reduce((sum, item) => sum + (item.viewCount || 0), 0);
  const totalComments = data.reduce(
    (sum, item) => sum + (item.commentCount || 0),
    0
  );
  const categories = Array.from(
    new Set(data.map(item => item.category).filter(Boolean))
  );
  const locations = Array.from(
    new Set(data.map(item => item.location).filter(Boolean))
  );

  return {
    totalItems: data.length,
    totalLikes,
    totalViews,
    totalComments,
    averageLikes: Math.round(totalLikes / data.length),
    averageViews: Math.round(totalViews / data.length),
    averageComments: Math.round(totalComments / data.length),
    uniqueCategories: categories.length,
    uniqueLocations: locations.length,
    categories,
    locations,
  };
};
