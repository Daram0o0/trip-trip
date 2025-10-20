import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Input from './index';

// Mock function for actions
const fn = () => () => {};

// 아이콘은 핵심요구사항에 따라 제거됨

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '다양한 variant, size, theme를 지원하는 재사용 가능한 Input 컴포넌트입니다. 텍스트 입력, textarea, 아이콘, 에러 상태 등을 지원합니다.',
      },
    },
  },
  // Docs 생성을 위한 명시적 설정
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Input의 시각적 스타일 변형',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Input의 크기',
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
    label: {
      control: { type: 'text' },
      description: 'Input 라벨',
      table: {
        type: { summary: 'string' },
      },
    },
    required: {
      control: { type: 'boolean' },
      description: '필수 입력 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: { type: 'text' },
      description: '에러 메시지',
      table: {
        type: { summary: 'string' },
      },
    },
    helperText: {
      control: { type: 'text' },
      description: '도움말 텍스트',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Input이 비활성화 상태인지 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isTextarea: {
      control: { type: 'boolean' },
      description: 'Textarea 모드 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maxLength: {
      control: { type: 'number' },
      description: '최대 입력 길이',
      table: {
        type: { summary: 'number' },
      },
    },
    showCount: {
      control: { type: 'boolean' },
      description: '글자 수 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placeholder: {
      control: { type: 'text' },
      description: '플레이스홀더 텍스트',
      table: {
        type: { summary: 'string' },
      },
    },
    rightButton: {
      control: { type: 'object' },
      description: '우측 버튼',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    onChange: {
      action: 'changed',
      description: '값 변경 핸들러',
      table: {
        type: { summary: 'function' },
      },
    },
  },
  args: {
    placeholder: '입력하세요',
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Docs 페이지용 스토리
export const Docs: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Input 컴포넌트의 모든 기능과 사용법을 확인할 수 있습니다.',
      },
    },
  },
  args: {
    label: '이메일',
    placeholder: '이메일을 입력하세요',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// 기본 Input
export const Default: Story = {
  args: {
    placeholder: '기본 입력',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// Variant별 스토리
export const Primary: Story = {
  args: {
    variant: 'primary',
    placeholder: 'Primary Input',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    placeholder: 'Secondary Input',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    placeholder: 'Tertiary Input',
  },
};

// Size별 스토리
export const Small: Story = {
  args: {
    size: 'small',
    placeholder: 'Small Input',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    placeholder: 'Medium Input',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    placeholder: 'Large Input',
  },
};

// Theme별 스토리
export const LightTheme: Story = {
  args: {
    theme: 'light',
    placeholder: 'Light Theme',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    placeholder: 'Dark Theme',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 라벨이 있는 Input
export const WithLabel: Story = {
  args: {
    label: '이메일 주소',
    placeholder: '이메일을 입력하세요',
  },
};

export const WithRequiredLabel: Story = {
  args: {
    label: '비밀번호',
    required: true,
    placeholder: '비밀번호를 입력하세요',
  },
};

// 에러 상태
export const WithError: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력하세요',
    error: '올바른 이메일 형식이 아닙니다',
  },
};

// 도움말 텍스트
export const WithHelperText: Story = {
  args: {
    label: '사용자명',
    placeholder: '사용자명을 입력하세요',
    helperText: '3-20자의 영문, 숫자, 언더스코어만 사용 가능합니다',
  },
};

// Disabled 상태
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled Input',
    value: '비활성화된 입력',
  },
};

// 아이콘은 핵심요구사항에 따라 제거됨

export const WithRightButton: Story = {
  args: {
    rightButton: <button type="button">확인</button>,
    placeholder: '인증번호를 입력하세요',
  },
};

// Textarea
export const Textarea: Story = {
  args: {
    isTextarea: true,
    label: '메시지',
    placeholder: '메시지를 입력하세요',
  },
};

// 글자 수 제한
export const WithMaxLength: Story = {
  args: {
    label: '제목',
    placeholder: '제목을 입력하세요',
    maxLength: 50,
    showCount: true,
  },
};

// Textarea with count
export const TextareaWithCount: Story = {
  args: {
    isTextarea: true,
    label: '내용',
    placeholder: '내용을 입력하세요',
    maxLength: 200,
    showCount: true,
  },
};

// Variant와 Size 조합
export const VariantSizeCombinations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Primary Variants</h3>
        <div className="flex flex-col gap-4 w-80">
          <Input variant="primary" size="small" placeholder="Small Primary" />
          <Input variant="primary" size="medium" placeholder="Medium Primary" />
          <Input variant="primary" size="large" placeholder="Large Primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Secondary Variants</h3>
        <div className="flex flex-col gap-4 w-80">
          <Input
            variant="secondary"
            size="small"
            placeholder="Small Secondary"
          />
          <Input
            variant="secondary"
            size="medium"
            placeholder="Medium Secondary"
          />
          <Input
            variant="secondary"
            size="large"
            placeholder="Large Secondary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Tertiary Variants</h3>
        <div className="flex flex-col gap-4 w-80">
          <Input variant="tertiary" size="small" placeholder="Small Tertiary" />
          <Input
            variant="tertiary"
            size="medium"
            placeholder="Medium Tertiary"
          />
          <Input variant="tertiary" size="large" placeholder="Large Tertiary" />
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
        <div className="flex flex-col gap-4 w-80">
          <Input variant="primary" theme="light" placeholder="Primary Light" />
          <Input
            variant="secondary"
            theme="light"
            placeholder="Secondary Light"
          />
          <Input
            variant="tertiary"
            theme="light"
            placeholder="Tertiary Light"
          />
        </div>
      </div>

      <div className="space-y-4 bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white">Dark Theme</h3>
        <div className="flex flex-col gap-4 w-80">
          <Input variant="primary" theme="dark" placeholder="Primary Dark" />
          <Input
            variant="secondary"
            theme="dark"
            placeholder="Secondary Dark"
          />
          <Input variant="tertiary" theme="dark" placeholder="Tertiary Dark" />
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
        <div className="flex flex-col gap-4 w-80">
          <Input size="small" placeholder="Search Small" />
          <Input size="small" placeholder="Password Small" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Medium with Icons</h3>
        <div className="flex flex-col gap-4 w-80">
          <Input size="medium" placeholder="Search Medium" />
          <Input size="medium" placeholder="Password Medium" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Large with Icons</h3>
        <div className="flex flex-col gap-4 w-80">
          <Input size="large" placeholder="Search Large" />
          <Input size="large" placeholder="Password Large" />
        </div>
      </div>
    </div>
  ),
};

// 에러 상태 조합
export const ErrorCombinations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Error States</h3>
        <div className="flex flex-col gap-4 w-80">
          <Input
            label="이메일"
            placeholder="이메일을 입력하세요"
            error="올바른 이메일 형식이 아닙니다"
          />
          <Input
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            error="비밀번호는 8자 이상이어야 합니다"
          />
          <Input
            label="사용자명"
            placeholder="사용자명을 입력하세요"
            error="이미 사용 중인 사용자명입니다"
          />
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
        <div className="flex flex-col gap-4 w-80">
          <Input variant="primary" disabled placeholder="Primary Disabled" />
          <Input
            variant="secondary"
            disabled
            placeholder="Secondary Disabled"
          />
          <Input variant="tertiary" disabled placeholder="Tertiary Disabled" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Disabled with Icons</h3>
        <div className="flex flex-col gap-4 w-80">
          <Input disabled placeholder="Search Disabled" />
          <Input disabled placeholder="Password Disabled" />
        </div>
      </div>
    </div>
  ),
};

// 인터랙션 테스트
export const Interactive: Story = {
  args: {
    label: '인터랙티브 Input',
    placeholder: '입력해보세요!',
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Input에 값을 입력하면 Actions 탭에서 이벤트를 확인할 수 있습니다.',
      },
    },
  },
};

// 폼 예시
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <h3 className="text-lg font-semibold">회원가입 폼</h3>
      <Input
        label="이메일"
        type="email"
        placeholder="이메일을 입력하세요"
        required
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        required
      />
      <Input
        label="사용자명"
        placeholder="사용자명을 입력하세요"
        maxLength={20}
        showCount
        helperText="3-20자의 영문, 숫자, 언더스코어만 사용 가능합니다"
      />
      <Input
        label="자기소개"
        isTextarea
        placeholder="자기소개를 입력하세요"
        maxLength={200}
        showCount
      />
    </div>
  ),
};

// 반응형 테스트
export const Responsive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Full Width Inputs</h3>
        <div className="space-y-2">
          <Input variant="primary" placeholder="Primary Full Width" />
          <Input variant="secondary" placeholder="Secondary Full Width" />
          <Input variant="tertiary" placeholder="Tertiary Full Width" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Mobile Size (Small)</h3>
        <div className="space-y-2">
          <Input size="small" placeholder="Small Full Width" />
          <Input size="small" placeholder="With Icon" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
