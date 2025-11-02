'use client';

import { useState } from 'react';
import React from 'react';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { useModal } from '@/commons/providers/modal/modal.provider';

export interface PostcodeData {
  postcode: string;
  address: string;
  detailAddress: string;
}

export interface UsePostcodeBindingParams {
  postcode?: string;
  address?: string;
  detailAddress?: string;
}

export interface UsePostcodeBindingReturn {
  postcode: string;
  address: string;
  detailAddress: string;
  setDetailAddress: (value: string) => void;
  openPostcode: () => void;
  closePostcode: () => void;
  isOpen: boolean;
}

export function usePostcodeBinding(
  initialData?: UsePostcodeBindingParams
): UsePostcodeBindingReturn {
  const { openModal, closeModal } = useModal();
  const [postcode, setPostcode] = useState<string>(initialData?.postcode || '');
  const [address, setAddress] = useState<string>(initialData?.address || '');
  const [detailAddress, setDetailAddress] = useState<string>(
    initialData?.detailAddress || ''
  );
  const [isOpen, setIsOpen] = useState(false);

  // 사용자가 주소를 선택했는지 추적
  const [userHasSelectedAddress, setUserHasSelectedAddress] = useState(false);

  // 초기 데이터가 변경될 때 상태 업데이트 (사용자가 주소를 선택하지 않은 경우에만)
  React.useEffect(() => {
    if (initialData && !userHasSelectedAddress) {
      // postcode 업데이트 (undefined가 아니면 업데이트, 빈 문자열 포함)
      if (initialData.postcode !== undefined) {
        setPostcode(initialData.postcode);
      }
      // address 업데이트 (undefined가 아니면 업데이트, 빈 문자열 포함)
      if (initialData.address !== undefined) {
        setAddress(initialData.address);
      }
      // detailAddress 업데이트 (undefined가 아니면 업데이트, 빈 문자열 포함)
      if (initialData.detailAddress !== undefined) {
        setDetailAddress(initialData.detailAddress);
      }
    }
  }, [
    initialData?.postcode,
    initialData?.address,
    initialData?.detailAddress,
    initialData,
    userHasSelectedAddress,
  ]);

  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    console.log('🏠 주소 선택됨:', {
      zonecode: data.zonecode,
      address: fullAddress,
    }); // 디버깅
    setPostcode(data.zonecode);
    setAddress(fullAddress);
    setDetailAddress('');
    setUserHasSelectedAddress(true); // 사용자가 주소를 선택했음을 표시
    closePostcodeModal();
  };

  const openPostcodeModal = () => {
    setIsOpen(true);
    openModal(
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          minWidth: '500px',
          margin: '-24px',
          padding: 0,
        }}
        data-testid="postcode-modal"
      >
        <div style={{ height: '600px', width: '100%' }}>
          <DaumPostcode onComplete={handleComplete} autoClose={false} />
        </div>
      </div>
    );
  };

  const closePostcodeModal = () => {
    setIsOpen(false);
    closeModal();
  };

  const openPostcode = () => {
    openPostcodeModal();
  };

  const closePostcode = () => {
    closePostcodeModal();
  };

  return {
    postcode,
    address,
    detailAddress,
    setDetailAddress,
    openPostcode,
    closePostcode,
    isOpen,
  };
}
