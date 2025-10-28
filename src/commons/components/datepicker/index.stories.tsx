// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import DatePicker from './index';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '날짜 기간 선택을 지원하는 재사용 가능한 날짜 선택기 컴포넌트입니다. yyyy.mm.dd - yyyy.mm.dd 형식으로 시작일과 종료일을 선택할 수 있습니다.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '날짜 선택기의 크기',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '테마 (light/dark)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    minDate: {
      control: { type: 'text' },
      description: '최소 날짜 (YYYY-MM-DD 형식)',
    },
    maxDate: {
      control: { type: 'text' },
      description: '최대 날짜 (YYYY-MM-DD 형식)',
    },
    startDate: {
      control: { type: 'text' },
      description: '시작일 (YYYY-MM-DD 형식)',
    },
    endDate: {
      control: { type: 'text' },
      description: '종료일 (YYYY-MM-DD 형식)',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {},
};

// Small Size
export const Small: Story = {
  args: {
    size: 'small',
  },
};

// Medium Size
export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

// Large Size
export const Large: Story = {
  args: {
    size: 'large',
  },
};

// Light Theme
export const LightTheme: Story = {
  args: {
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// Dark Theme
export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Disabled State
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

// With Date Range
export const WithDateRange: Story = {
  args: {
    startDate: '2024-01-15',
    endDate: '2024-01-20',
  },
};

// With Min/Max Date
export const WithMinMaxDate: Story = {
  args: {
    minDate: '2024-01-01',
    maxDate: '2024-12-31',
  },
};
