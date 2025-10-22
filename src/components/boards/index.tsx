import React from 'react';
import styles from './styles.module.css';

const Boards = () => {
  return (
    <div className={styles.container}>
      {/* 오늘 핫한 트립토크 영역 */}
      <div className={styles.hotTripTalk}>
        <h2>오늘 핫한 트립토크</h2>
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
