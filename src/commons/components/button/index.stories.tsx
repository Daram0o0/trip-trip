import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './index';

// Mock function for actions
const fn = () => () => {};

// 아이콘 컴포넌트 (예시)
const SearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '다양한 variant, size, theme를 지원하는 재사용 가능한 버튼 컴포넌트입니다.',
      },
    },
  },
  // Docs 생성을 위한 명시적 설정
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
      description: '버튼의 시각적 스타일 변형',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '테마 (light/dark)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'light' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '버튼이 비활성화 상태인지 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '버튼이 전체 너비를 사용할지 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: { type: 'text' },
      description: '버튼 텍스트',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    leftIcon: {
      control: { type: 'object' },
      description: '좌측 아이콘',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    rightIcon: {
      control: { type: 'object' },
      description: '우측 아이콘',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    onClick: {
      action: 'clicked',
      description: '클릭 핸들러',
      table: {
        type: { summary: 'function' },
      },
    },
  },
  args: {
    children: 'Button',
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Docs 페이지용 스토리
export const Docs: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Button 컴포넌트의 모든 기능과 사용법을 확인할 수 있습니다.',
      },
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// 기본 버튼
export const Default: Story = {
  args: {
    children: '버튼',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// Variant별 스토리
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

// Size별 스토리
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button',
  },
};

// Theme별 스토리
export const LightTheme: Story = {
  args: {
    theme: 'light',
    children: 'Light Theme',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    children: 'Dark Theme',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Disabled 상태
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// 아이콘이 있는 버튼
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <SearchIcon />,
    children: 'Search',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <ArrowRightIcon />,
    children: 'Next',
  },
};

// WithBothIcons 스토리 제거 - 핵심요구사항에 따라 양쪽 아이콘을 동시에 사용할 수 없음

// Full Width 버튼
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

// Variant와 Size 조합
export const VariantSizeCombinations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Primary Variants</h3>
        <div className="flex gap-4 items-center">
          <Button variant="primary" size="small">
            Small
          </Button>
          <Button variant="primary" size="medium">
            Medium
          </Button>
          <Button variant="primary" size="large">
            Large
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Secondary Variants</h3>
        <div className="flex gap-4 items-center">
          <Button variant="secondary" size="small">
            Small
          </Button>
          <Button variant="secondary" size="medium">
            Medium
          </Button>
          <Button variant="secondary" size="large">
            Large
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Outline Variants</h3>
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="small">
            Small
          </Button>
          <Button variant="outline" size="medium">
            Medium
          </Button>
          <Button variant="outline" size="large">
            Large
          </Button>
        </div>
      </div>
    </div>
  ),
};

// Theme와 Variant 조합
export const ThemeVariantCombinations: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Light Theme</h3>
        <div className="flex gap-4 items-center">
          <Button variant="primary" theme="light">
            Primary
          </Button>
          <Button variant="secondary" theme="light">
            Secondary
          </Button>
          <Button variant="outline" theme="light">
            Outline
          </Button>
        </div>
      </div>

      <div className="space-y-4 bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white">Dark Theme</h3>
        <div className="flex gap-4 items-center">
          <Button variant="primary" theme="dark">
            Primary
          </Button>
          <Button variant="secondary" theme="dark">
            Secondary
          </Button>
          <Button variant="outline" theme="dark">
            Outline
          </Button>
        </div>
      </div>
    </div>
  ),
};

// 아이콘과 크기 조합
export const IconSizeCombinations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Small with Icons</h3>
        <div className="flex gap-4 items-center">
          <Button size="small" leftIcon={<SearchIcon />}>
            Search
          </Button>
          <Button size="small" rightIcon={<ArrowRightIcon />}>
            Next
          </Button>
          {/* 양쪽 아이콘을 동시에 사용할 수 없음 */}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Medium with Icons</h3>
        <div className="flex gap-4 items-center">
          <Button size="medium" leftIcon={<SearchIcon />}>
            Search
          </Button>
          <Button size="medium" rightIcon={<ArrowRightIcon />}>
            Next
          </Button>
          {/* 양쪽 아이콘을 동시에 사용할 수 없음 */}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Large with Icons</h3>
        <div className="flex gap-4 items-center">
          <Button size="large" leftIcon={<SearchIcon />}>
            Search
          </Button>
          <Button size="large" rightIcon={<ArrowRightIcon />}>
            Next
          </Button>
          {/* 양쪽 아이콘을 동시에 사용할 수 없음 */}
        </div>
      </div>
    </div>
  ),
};

// Disabled 상태 조합
export const DisabledCombinations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Disabled Variants</h3>
        <div className="flex gap-4 items-center">
          <Button variant="primary" disabled>
            Primary Disabled
          </Button>
          <Button variant="secondary" disabled>
            Secondary Disabled
          </Button>
          <Button variant="outline" disabled>
            Outline Disabled
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Disabled with Icons</h3>
        <div className="flex gap-4 items-center">
          <Button disabled leftIcon={<SearchIcon />}>
            Search Disabled
          </Button>
          <Button disabled rightIcon={<ArrowRightIcon />}>
            Next Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
};

// 인터랙션 테스트
export const Interactive: Story = {
  args: {
    children: 'Click me!',
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: '버튼을 클릭하면 Actions 탭에서 이벤트를 확인할 수 있습니다.',
      },
    },
  },
};

// 오른쪽 아이콘 버튼 스타일 (둥근 모양, padding: 8px 12px)
export const RightIconButton: Story = {
  args: {
    children: '로그인',
    rightIcon: <ArrowRightIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          '오른쪽 아이콘 버튼은 완전한 둥근 모양(border-radius: 100px)과 특별한 패딩(padding: 8px 12px)을 가집니다.',
      },
    },
  },
};

// 오른쪽 아이콘 버튼의 다양한 variant와 size 조합
export const RightIconVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Primary Right Icon Buttons</h3>
        <div className="flex gap-4 items-center">
          <Button variant="primary" size="small" rightIcon={<ArrowRightIcon />}>
            Small
          </Button>
          <Button
            variant="primary"
            size="medium"
            rightIcon={<ArrowRightIcon />}
          >
            Medium
          </Button>
          <Button variant="primary" size="large" rightIcon={<ArrowRightIcon />}>
            Large
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Secondary Right Icon Buttons</h3>
        <div className="flex gap-4 items-center">
          <Button
            variant="secondary"
            size="small"
            rightIcon={<ArrowRightIcon />}
          >
            Small
          </Button>
          <Button
            variant="secondary"
            size="medium"
            rightIcon={<ArrowRightIcon />}
          >
            Medium
          </Button>
          <Button
            variant="secondary"
            size="large"
            rightIcon={<ArrowRightIcon />}
          >
            Large
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Outline Right Icon Buttons</h3>
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="small" rightIcon={<ArrowRightIcon />}>
            Small
          </Button>
          <Button
            variant="outline"
            size="medium"
            rightIcon={<ArrowRightIcon />}
          >
            Medium
          </Button>
          <Button variant="outline" size="large" rightIcon={<ArrowRightIcon />}>
            Large
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '오른쪽 아이콘 버튼의 모든 variant와 size 조합을 확인할 수 있습니다. 모든 오른쪽 아이콘 버튼은 동일한 패딩(8px 12px)과 둥근 모양(border-radius: 100px)을 가집니다.',
      },
    },
  },
};

// 반응형 테스트
export const Responsive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Full Width Buttons</h3>
        <div className="space-y-2">
          <Button fullWidth variant="primary">
            Primary Full Width
          </Button>
          <Button fullWidth variant="secondary">
            Secondary Full Width
          </Button>
          <Button fullWidth variant="outline">
            Outline Full Width
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Mobile Size (Small)</h3>
        <div className="space-y-2">
          <Button size="small" fullWidth>
            Small Full Width
          </Button>
          <Button size="small" fullWidth leftIcon={<SearchIcon />}>
            With Icon
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
