import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from './index';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '버튼의 스타일 변형을 설정합니다.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기를 설정합니다.',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '테마를 설정합니다.',
    },
    disabled: {
      control: 'boolean',
      description: '버튼의 비활성화 상태를 설정합니다.',
    },
    fullWidth: {
      control: 'boolean',
      description: '버튼이 전체 너비를 사용할지 설정합니다.',
    },
    children: {
      control: 'text',
      description: '버튼 내부에 표시될 텍스트입니다.',
    },
    leftIcon: {
      control: false,
      description: '버튼 왼쪽에 표시될 아이콘입니다.',
    },
    rightIcon: {
      control: false,
      description: '버튼 오른쪽에 표시될 아이콘입니다.',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: false,
    fullWidth: false,
  },
};

// Variant 스토리들
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Tertiary Button',
    variant: 'tertiary',
    size: 'medium',
    theme: 'light',
  },
};

// Size 스토리들
export const Small: Story = {
  args: {
    children: 'Small',
    variant: 'primary',
    size: 'small',
    theme: 'light',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    variant: 'primary',
    size: 'large',
    theme: 'light',
  },
};

// Theme 스토리들
export const LightTheme: Story = {
  args: {
    children: 'Light Theme',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    children: 'Dark Theme',
    variant: 'primary',
    size: 'medium',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태 스토리들
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// 아이콘이 있는 버튼 스토리들
export const WithLeftIcon: Story = {
  args: {
    children: 'With Left Icon',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    leftIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'With Right Icon',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    rightIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
      </svg>
    ),
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Both Icons',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    leftIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    rightIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
      </svg>
    ),
  },
};

// 모든 variant와 size 조합을 보여주는 스토리
export const AllVariants: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="primary" size="small">
          Primary Small
        </Button>
        <Button variant="primary" size="medium">
          Primary Medium
        </Button>
        <Button variant="primary" size="large">
          Primary Large
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="secondary" size="small">
          Secondary Small
        </Button>
        <Button variant="secondary" size="medium">
          Secondary Medium
        </Button>
        <Button variant="secondary" size="large">
          Secondary Large
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="tertiary" size="small">
          Tertiary Small
        </Button>
        <Button variant="tertiary" size="medium">
          Tertiary Medium
        </Button>
        <Button variant="tertiary" size="large">
          Tertiary Large
        </Button>
      </div>
    </div>
  ),
};

// 모든 상태를 보여주는 스토리
export const AllStates: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="primary">Normal</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="primary" fullWidth>
          Full Width
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="secondary">Normal</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="secondary" fullWidth>
          Full Width
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button variant="tertiary">Normal</Button>
        <Button variant="tertiary" disabled>
          Disabled
        </Button>
        <Button variant="tertiary" fullWidth>
          Full Width
        </Button>
      </div>
    </div>
  ),
};
