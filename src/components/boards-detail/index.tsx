'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/commons/components/button';
import Input from '@/commons/components/input';
import styles from './styles.module.css';
import {
  MessageCircle,
  Star,
  Link,
  MapPin,
  ThumbsDown,
  ThumbsUp,
  X,
  Play,
  Pencil,
  TextAlignJustify,
} from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  profileImage: string;
  rating: number;
  content: string;
  date: string;
  canEdit?: boolean;
}

const BoardsDetail = () => {
  // 별점 상태
  const [rating, setRating] = useState<number>(0);

  // 댓글 입력 상태
  const [author, setAuthor] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');

  // 댓글 데이터 상태
  const [comments] = useState<Comment[]>([
    {
      id: 1,
      author: '홍길동',
      profileImage: '/images/profile/img-4.png',
      rating: 5,
      content:
        '살겠노라 살겠노라. 청산에 살겠노라.\n머루랑 다래를 먹고 청산에 살겠노라.\n얄리얄리 얄랑셩 얄라리 얄라',
      date: '2024.11.11',
      canEdit: true,
    },
    {
      id: 2,
      author: '애슐리',
      profileImage: '/images/profile/img-5.png',
      rating: 5,
      content:
        '살겠노라 살겠노라. 청산에 살겠노라.\n머루랑 다래를 먹고 청산에 살겠노라.\n얄리얄리 얄랑셩 얄라리 얄라',
      date: '2024.11.11',
      canEdit: false,
    },
  ]);

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
    <div className={styles.container}>
      {/* 타이틀 영역 */}
      <div className={styles.titleArea}>
        <h1 className={styles.title}>
          살어리 살어리랏다 쳥산(靑山)애 살어리랏다멀위랑 ᄃᆞ래랑 먹고
          쳥산(靑山)애 살어리랏다얄리얄리 얄랑셩 얄라리 얄라
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
            <span className={styles.profileName}>홍길동</span>
          </div>
          <div className={styles.dateArea}>
            <span className={styles.date}>2024.11.11</span>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.infoBottom}>
          <div className={styles.iconGroup}>
            <Link size={24} className={styles.icon} />
            <MapPin size={24} className={styles.icon} />
          </div>
        </div>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* 이미지 영역 */}
      <div className={styles.imageArea}>
        <Image
          src="/images/Tranquil Beachside Serenity 1.png"
          alt="게시물 이미지"
          width={400}
          height={531}
          className={styles.postImage}
        />
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Content 영역 */}
      <div className={styles.contentArea}>
        <p className={styles.content}>
          {`살겠노라 살겠노라. 청산에 살겠노라. 머루랑 다래를 먹고 청산에
          살겠노라. 얄리얄리 얄랑셩 얄라리 얄라 우는구나 우는구나 새야. 자고
          일어나 우는구나 새야. 너보다 시름 많은 나도 자고 일어나 우노라.
          얄리얄리 얄라셩 얄라리 얄라 갈던 밭(사래) 갈던 밭 보았느냐. 물
          아래(근처) 갈던 밭 보았느냐 이끼 묻은 쟁기를 가지고 물 아래 갈던 밭
          보았느냐. 얄리얄리 얄라셩 얄라리 얄라 이럭저럭 하여 낮일랑 지내 왔건만
          올 이도 갈 이도 없는 밤일랑 또 어찌 할 것인가. 얄리얄리 얄라셩 얄라리
          얄라 어디다 던지는 돌인가 누구를 맞히려던 돌인가. 미워할 이도 사랑할
          이도 없이 맞아서 우노라. 얄리얄리 얄라셩 얄라리 얄라 살겠노라
          살겠노라. 바다에 살겠노라. 나문재, 굴, 조개를 먹고 바다에 살겠노라.
          얄리얄리 얄라셩 얄라리 얄라 가다가 가다가 듣노라. 에정지(미상) 가다가
          듣노라. 사슴(탈 쓴 광대)이 솟대에 올라서 해금을 켜는 것을 듣노라.
          얄리얄리 얄라셩 얄라리 얄라 가다 보니 배불룩한 술독에 독한 술을
          빚는구나. 조롱박꽃 모양 누룩이 매워 (나를) 붙잡으니 내 어찌
          하리이까.[1] 얄리얄리 얄라셩 얄라리 얄라`}
        </p>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* 동영상 영역 */}
      <div className={styles.videoArea}>
        <div className={styles.videoContainer}>
          <Image
            src="/images/Frame 427323252.png"
            alt="동영상 썸네일"
            width={822}
            height={464}
            className={styles.videoThumbnail}
          />
          <button className={styles.playButton}>
            <Play size={20} className={styles.playIcon} />
          </button>
        </div>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* 아이콘 영역 */}
      <div className={styles.iconArea}>
        <div className={styles.iconItem}>
          <ThumbsDown size={24} className={styles.icon} />
          <span className={styles.iconCount}>24</span>
        </div>
        <div className={styles.iconItem}>
          <ThumbsUp size={24} className={styles.icon} />
          <span className={styles.iconCountActive}>24</span>
        </div>
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
        >
          목록으로
        </Button>
        <Button
          variant="outline"
          size="medium"
          className={styles.button}
          leftIcon={<Pencil className={styles.outlineIcon} />}
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
              size="large"
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
                <div className={styles.commentItem}>
                  <div className={styles.commentItemHeader}>
                    <div className={styles.commentProfile}>
                      <Image
                        src={comment.profileImage}
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
                    {comment.canEdit && (
                      <div className={styles.commentActions}>
                        <Pencil size={20} className={styles.actionIcon} />
                        <X size={20} className={styles.actionIcon} />
                      </div>
                    )}
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
            <div className={styles.noComments}>등록된 댓글이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardsDetail;
