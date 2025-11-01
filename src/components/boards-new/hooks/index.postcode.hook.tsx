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

    setPostcode(data.zonecode);
    setAddress(fullAddress);
    setDetailAddress('');
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
