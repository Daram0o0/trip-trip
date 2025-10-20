import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Modal from './index';

// Mock function for actions
const fn = () => () => {};

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '다양한 variant, actions, theme를 지원하는 재사용 가능한 Modal 컴포넌트입니다. 정보 표시, 확인/취소 액션 등을 지원합니다.',
      },
    },
  },
  // Docs 생성을 위한 명시적 설정
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'danger'],
      description: 'Modal의 시각적 스타일 변형',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'info' },
      },
    },
    actions: {
      control: { type: 'select' },
      options: ['single', 'dual'],
      description: '버튼 액션 타입 (단일/이중)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'single' },
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
    title: {
      control: { type: 'text' },
      description: 'Modal 제목',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: { type: 'text' },
      description: 'Modal 설명 텍스트',
      table: {
        type: { summary: 'string' },
      },
    },
    confirmText: {
      control: { type: 'text' },
      description: '확인 버튼 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '확인' },
      },
    },
    cancelText: {
      control: { type: 'text' },
      description: '취소 버튼 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '취소' },
      },
    },
    onConfirm: {
      action: 'confirmed',
      description: '확인 버튼 클릭 핸들러',
      table: {
        type: { summary: 'function' },
      },
    },
    onCancel: {
      action: 'cancelled',
      description: '취소 버튼 클릭 핸들러',
      table: {
        type: { summary: 'function' },
      },
    },
  },
  args: {
    title: 'Modal 제목',
    description: 'Modal 설명 텍스트입니다.',
    onConfirm: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Docs 페이지용 스토리
export const Docs: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Modal 컴포넌트의 모든 기능과 사용법을 확인할 수 있습니다.',
      },
    },
  },
  args: {
    title: 'Modal 제목',
    description: 'Modal 설명 텍스트입니다.',
    variant: 'info',
    actions: 'single',
    theme: 'light',
  },
};

// 기본 Modal
export const Default: Story = {
  args: {
    title: '기본 Modal',
    description: '기본 Modal입니다.',
    variant: 'info',
    actions: 'single',
    theme: 'light',
  },
};

// Variant별 스토리
export const Info: Story = {
  args: {
    title: '정보 Modal',
    description: '정보를 표시하는 Modal입니다.',
    variant: 'info',
    actions: 'single',
  },
};

export const Danger: Story = {
  args: {
    title: '위험 Modal',
    description: '위험한 작업에 대한 확인 Modal입니다.',
    variant: 'danger',
    actions: 'single',
  },
};

// Actions별 스토리
export const SingleAction: Story = {
  args: {
    title: '단일 액션 Modal',
    description: '확인 버튼만 있는 Modal입니다.',
    actions: 'single',
    confirmText: '확인',
  },
};

export const DualAction: Story = {
  args: {
    title: '이중 액션 Modal',
    description: '확인과 취소 버튼이 있는 Modal입니다.',
    actions: 'dual',
    confirmText: '확인',
    cancelText: '취소',
  },
};

// Theme별 스토리
export const LightTheme: Story = {
  args: {
    title: 'Light Theme Modal',
    description: 'Light 테마 Modal입니다.',
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    title: 'Dark Theme Modal',
    description: 'Dark 테마 Modal입니다.',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Variant와 Actions 조합
export const InfoSingle: Story = {
  args: {
    title: '정보 - 단일 액션',
    description: '정보 Modal에 단일 액션 버튼입니다.',
    variant: 'info',
    actions: 'single',
  },
};

export const InfoDual: Story = {
  args: {
    title: '정보 - 이중 액션',
    description: '정보 Modal에 이중 액션 버튼입니다.',
    variant: 'info',
    actions: 'dual',
  },
};

export const DangerSingle: Story = {
  args: {
    title: '위험 - 단일 액션',
    description: '위험 Modal에 단일 액션 버튼입니다.',
    variant: 'danger',
    actions: 'single',
  },
};

export const DangerDual: Story = {
  args: {
    title: '위험 - 이중 액션',
    description: '위험 Modal에 이중 액션 버튼입니다.',
    variant: 'danger',
    actions: 'dual',
  },
};

// Variant와 Theme 조합
export const InfoLight: Story = {
  args: {
    title: '정보 - Light 테마',
    description: '정보 Modal의 Light 테마입니다.',
    variant: 'info',
    theme: 'light',
  },
};

export const InfoDark: Story = {
  args: {
    title: '정보 - Dark 테마',
    description: '정보 Modal의 Dark 테마입니다.',
    variant: 'info',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const DangerLight: Story = {
  args: {
    title: '위험 - Light 테마',
    description: '위험 Modal의 Light 테마입니다.',
    variant: 'danger',
    theme: 'light',
  },
};

export const DangerDark: Story = {
  args: {
    title: '위험 - Dark 테마',
    description: '위험 Modal의 Dark 테마입니다.',
    variant: 'danger',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Actions와 Theme 조합
export const SingleLight: Story = {
  args: {
    title: '단일 액션 - Light 테마',
    description: '단일 액션 Modal의 Light 테마입니다.',
    actions: 'single',
    theme: 'light',
  },
};

export const SingleDark: Story = {
  args: {
    title: '단일 액션 - Dark 테마',
    description: '단일 액션 Modal의 Dark 테마입니다.',
    actions: 'single',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const DualLight: Story = {
  args: {
    title: '이중 액션 - Light 테마',
    description: '이중 액션 Modal의 Light 테마입니다.',
    actions: 'dual',
    theme: 'light',
  },
};

export const DualDark: Story = {
  args: {
    title: '이중 액션 - Dark 테마',
    description: '이중 액션 Modal의 Dark 테마입니다.',
    actions: 'dual',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 모든 조합 스토리
export const AllCombinations: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Info Variants</h3>
        <div className="grid grid-cols-1 gap-4">
          <Modal
            title="정보 - 단일 액션 - Light"
            description="정보 Modal의 단일 액션 Light 테마입니다."
            variant="info"
            actions="single"
            theme="light"
            onConfirm={fn()}
          />
          <Modal
            title="정보 - 이중 액션 - Light"
            description="정보 Modal의 이중 액션 Light 테마입니다."
            variant="info"
            actions="dual"
            theme="light"
            onConfirm={fn()}
            onCancel={fn()}
          />
        </div>
      </div>

      <div className="space-y-4 bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white">
          Info Variants - Dark
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <Modal
            title="정보 - 단일 액션 - Dark"
            description="정보 Modal의 단일 액션 Dark 테마입니다."
            variant="info"
            actions="single"
            theme="dark"
            onConfirm={fn()}
          />
          <Modal
            title="정보 - 이중 액션 - Dark"
            description="정보 Modal의 이중 액션 Dark 테마입니다."
            variant="info"
            actions="dual"
            theme="dark"
            onConfirm={fn()}
            onCancel={fn()}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Danger Variants</h3>
        <div className="grid grid-cols-1 gap-4">
          <Modal
            title="위험 - 단일 액션 - Light"
            description="위험 Modal의 단일 액션 Light 테마입니다."
            variant="danger"
            actions="single"
            theme="light"
            onConfirm={fn()}
          />
          <Modal
            title="위험 - 이중 액션 - Light"
            description="위험 Modal의 이중 액션 Light 테마입니다."
            variant="danger"
            actions="dual"
            theme="light"
            onConfirm={fn()}
            onCancel={fn()}
          />
        </div>
      </div>

      <div className="space-y-4 bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white">
          Danger Variants - Dark
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <Modal
            title="위험 - 단일 액션 - Dark"
            description="위험 Modal의 단일 액션 Dark 테마입니다."
            variant="danger"
            actions="single"
            theme="dark"
            onConfirm={fn()}
          />
          <Modal
            title="위험 - 이중 액션 - Dark"
            description="위험 Modal의 이중 액션 Dark 테마입니다."
            variant="danger"
            actions="dual"
            theme="dark"
            onConfirm={fn()}
            onCancel={fn()}
          />
        </div>
      </div>
    </div>
  ),
};

// 인터랙션 테스트
export const Interactive: Story = {
  args: {
    title: '인터랙티브 Modal',
    description: '버튼을 클릭하면 Actions 탭에서 이벤트를 확인할 수 있습니다.',
    actions: 'dual',
    onConfirm: fn(),
    onCancel: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Modal의 버튼을 클릭하면 Actions 탭에서 이벤트를 확인할 수 있습니다.',
      },
    },
  },
};

// 실제 사용 예시
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">삭제 확인</h3>
        <Modal
          title="정말 삭제하시겠습니까?"
          description="삭제된 데이터는 복구할 수 없습니다."
          variant="danger"
          actions="dual"
          confirmText="삭제"
          cancelText="취소"
          onConfirm={fn()}
          onCancel={fn()}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">저장 완료</h3>
        <Modal
          title="저장이 완료되었습니다"
          description="변경사항이 성공적으로 저장되었습니다."
          variant="info"
          actions="single"
          confirmText="확인"
          onConfirm={fn()}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">로그아웃 확인</h3>
        <Modal
          title="로그아웃 하시겠습니까?"
          description="현재 세션이 종료됩니다."
          variant="info"
          actions="dual"
          confirmText="로그아웃"
          cancelText="취소"
          onConfirm={fn()}
          onCancel={fn()}
        />
      </div>
    </div>
  ),
};

// 반응형 테스트
export const Responsive: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Desktop Size</h3>
        <Modal
          title="데스크톱 Modal"
          description="데스크톱에서 보이는 Modal입니다. 480px 너비를 가집니다."
          variant="info"
          actions="dual"
          onConfirm={fn()}
          onCancel={fn()}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Mobile Size</h3>
        <div className="max-w-sm">
          <Modal
            title="모바일 Modal"
            description="모바일에서 보이는 Modal입니다. 320px 너비로 축소됩니다."
            variant="info"
            actions="dual"
            onConfirm={fn()}
            onCancel={fn()}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
