/**
 * Mock 데이터 테스트 파일
 * Mock 데이터의 정확성과 일관성을 검증합니다.
 */

import {
  mockGalleryData,
  generateMockGalleryData,
  validateMockData,
  getMockDataStats,
  generateMockDate,
  generateMockLikeCount,
  generateMockViewCount,
  generateMockCommentCount,
} from '../mockData';

describe('Mock Data Tests', () => {
  describe('generateMockDate', () => {
    it('should generate correct date format', () => {
      const date = generateMockDate(1);
      expect(date).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);
    });

    it('should generate different dates for different days ago', () => {
      const date1 = generateMockDate(1);
      const date2 = generateMockDate(2);
      expect(date1).not.toBe(date2);
    });
  });

  describe('generateMockLikeCount', () => {
    it('should generate number between 20 and 320', () => {
      const count = generateMockLikeCount();
      expect(count).toBeGreaterThanOrEqual(20);
      expect(count).toBeLessThanOrEqual(320);
    });
  });

  describe('generateMockViewCount', () => {
    it('should generate number between 500 and 5500', () => {
      const count = generateMockViewCount();
      expect(count).toBeGreaterThanOrEqual(500);
      expect(count).toBeLessThanOrEqual(5500);
    });
  });

  describe('generateMockCommentCount', () => {
    it('should generate number between 5 and 55', () => {
      const count = generateMockCommentCount();
      expect(count).toBeGreaterThanOrEqual(5);
      expect(count).toBeLessThanOrEqual(55);
    });
  });

  describe('mockGalleryData', () => {
    it('should have 4 items', () => {
      expect(mockGalleryData).toHaveLength(4);
    });

    it('should have valid data structure', () => {
      const isValid = validateMockData(mockGalleryData);
      expect(isValid).toBe(true);
    });

    it('should have unique IDs', () => {
      const ids = mockGalleryData.map(item => item.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids).toHaveLength(uniqueIds.length);
    });

    it('should have valid required fields', () => {
      mockGalleryData.forEach(item => {
        expect(item.id).toBeGreaterThan(0);
        expect(item.title).toBeTruthy();
        expect(item.author).toBeTruthy();
        expect(item.authorImage).toBeTruthy();
        expect(item.likeCount).toBeGreaterThanOrEqual(0);
        expect(item.date).toBeTruthy();
        expect(item.image).toBeTruthy();
      });
    });
  });

  describe('generateMockGalleryData', () => {
    it('should generate correct number of items', () => {
      const data = generateMockGalleryData(6);
      expect(data).toHaveLength(6);
    });

    it('should generate valid data', () => {
      const data = generateMockGalleryData(3);
      const isValid = validateMockData(data);
      expect(isValid).toBe(true);
    });

    it('should have unique IDs', () => {
      const data = generateMockGalleryData(5);
      const ids = data.map(item => item.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids).toHaveLength(uniqueIds.length);
    });
  });

  describe('validateMockData', () => {
    it('should return true for valid data', () => {
      const validData = [
        {
          id: 1,
          title: 'Test Title',
          author: 'Test Author',
          authorImage: '/test/image.png',
          likeCount: 10,
          date: '2024.12.15',
          image: '/test/image.png',
        },
      ];
      expect(validateMockData(validData)).toBe(true);
    });

    it('should return false for invalid data', () => {
      const invalidData = [
        {
          id: 0, // Invalid ID
          title: 'Test Title',
          author: 'Test Author',
          authorImage: '/test/image.png',
          likeCount: 10,
          date: '2024.12.15',
          image: '/test/image.png',
        },
      ];
      expect(validateMockData(invalidData)).toBe(false);
    });

    it('should return false for empty title', () => {
      const invalidData = [
        {
          id: 1,
          title: '', // Empty title
          author: 'Test Author',
          authorImage: '/test/image.png',
          likeCount: 10,
          date: '2024.12.15',
          image: '/test/image.png',
        },
      ];
      expect(validateMockData(invalidData)).toBe(false);
    });
  });

  describe('getMockDataStats', () => {
    it('should calculate correct statistics', () => {
      const testData = [
        {
          id: 1,
          title: 'Test 1',
          author: 'Author 1',
          authorImage: '/test1.png',
          likeCount: 100,
          date: '2024.12.15',
          image: '/test1.png',
          viewCount: 1000,
          commentCount: 10,
          category: 'Test',
          location: 'Seoul',
        },
        {
          id: 2,
          title: 'Test 2',
          author: 'Author 2',
          authorImage: '/test2.png',
          likeCount: 200,
          date: '2024.12.14',
          image: '/test2.png',
          viewCount: 2000,
          commentCount: 20,
          category: 'Test',
          location: 'Busan',
        },
      ];

      const stats = getMockDataStats(testData);

      expect(stats.totalItems).toBe(2);
      expect(stats.totalLikes).toBe(300);
      expect(stats.totalViews).toBe(3000);
      expect(stats.totalComments).toBe(30);
      expect(stats.averageLikes).toBe(150);
      expect(stats.averageViews).toBe(1500);
      expect(stats.averageComments).toBe(15);
      expect(stats.uniqueCategories).toBe(1);
      expect(stats.uniqueLocations).toBe(2);
    });
  });
});
