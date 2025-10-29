'use client';

// import { useParams } from 'next/navigation'; // TODO: 실제 구현에서 사용 예정
import BoardsNew from '@/components/boards-new';

const BoardsEditPage = () => {
  // const params = useParams();
  // const boardId = params.id as string; // TODO: 실제 구현에서 사용 예정

  // 실제 구현에서는 boardId를 사용해 서버에서 데이터를 가져와야 합니다
  // 현재는 샘플 데이터를 사용합니다
  const initialData = {
    author: '홍길동',
    password: '*********',
    title: '코드캠프',
    content: '코드캠프',
    postcode: '01234',
    address: '서울특별시 강남구 ',
    detailAddress: '1211',
    youtubeLink: '',
  };

  return <BoardsNew mode="edit" initialData={initialData} />;
};

export default BoardsEditPage;
