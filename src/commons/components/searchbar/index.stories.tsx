import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Searchbar from './index';

// Mock function for actions
const fn = () => () => {};

const meta: Meta<typeof Searchbar> = {
  title: 'Components/Searchbar',
  component: Searchbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '다양한 variant, size, theme를 지원하는 재사용 가능한 Searchbar 컴포넌트입니다. 검색 아이콘, 키보드 이벤트, 포커스 상태 등을 지원합니다.',
      },
    },
  },
  // Docs 생성을 위한 명시적 설정
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Searchbar의 시각적 스타일 변형',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Searchbar의 크기',
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
    placeholder: {
      control: { type: 'text' },
      description: '플레이스홀더 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '제목을 검색해 주세요.' },
      },
    },
    showIcon: {
      control: { type: 'boolean' },
      description: '검색 아이콘 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Searchbar 비활성화 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'Searchbar 읽기 전용 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    value: {
      control: { type: 'text' },
      description: 'Searchbar 값',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onChange: {
      action: 'changed',
      description: '값 변경 핸들러',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    onSearch: {
      action: 'searched',
      description: '검색 실행 핸들러 (Enter 키 또는 검색 아이콘 클릭)',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    onFocus: {
      action: 'focused',
      description: '포커스 핸들러',
      table: {
        type: {
          summary: '(event: React.FocusEvent<HTMLInputElement>) => void',
        },
      },
    },
    onBlur: {
      action: 'blurred',
      description: '블러 핸들러',
      table: {
        type: {
          summary: '(event: React.FocusEvent<HTMLInputElement>) => void',
        },
      },
    },
    className: {
      control: { type: 'text' },
      description: '추가 CSS 클래스명',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  args: {
    onChange: fn(),
    onSearch: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
    disabled: false,
    readOnly: false,
  },
};

// Variant 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: 'Primary 검색바',
    showIcon: true,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
    placeholder: 'Secondary 검색바',
    showIcon: true,
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    size: 'medium',
    theme: 'light',
    placeholder: 'Tertiary 검색바',
    showIcon: true,
  },
};

// Size 스토리들
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    theme: 'light',
    placeholder: 'Small 검색바',
    showIcon: true,
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: 'Medium 검색바',
    showIcon: true,
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'light',
    placeholder: 'Large 검색바',
    showIcon: true,
  },
};

// Theme 스토리들
export const Light: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: 'Light 테마 검색바',
    showIcon: true,
  },
};

export const Dark: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'dark',
    placeholder: 'Dark 테마 검색바',
    showIcon: true,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a1a' }],
    },
  },
};

// 상태 스토리들
export const WithValue: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '검색어를 입력하세요',
    showIcon: true,
    value: '검색어 예시',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '비활성화된 검색바',
    showIcon: true,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '읽기 전용 검색바',
    showIcon: true,
    readOnly: true,
    value: '읽기 전용 값',
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '아이콘 없는 검색바',
    showIcon: false,
  },
};

// 조합 스토리들
export const DarkSecondaryLarge: Story = {
  args: {
    variant: 'secondary',
    size: 'large',
    theme: 'dark',
    placeholder: 'Dark Secondary Large 검색바',
    showIcon: true,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a1a' }],
    },
  },
};

export const TertiarySmallLight: Story = {
  args: {
    variant: 'tertiary',
    size: 'small',
    theme: 'light',
    placeholder: 'Tertiary Small Light 검색바',
    showIcon: true,
  },
};

// 모든 Variant와 Size 조합
export const AllVariantsAndSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          Primary Variant
        </h3>
        <Searchbar
          variant="primary"
          size="small"
          placeholder="Primary Small"
          showIcon={true}
        />
        <Searchbar
          variant="primary"
          size="medium"
          placeholder="Primary Medium"
          showIcon={true}
        />
        <Searchbar
          variant="primary"
          size="large"
          placeholder="Primary Large"
          showIcon={true}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          Secondary Variant
        </h3>
        <Searchbar
          variant="secondary"
          size="small"
          placeholder="Secondary Small"
          showIcon={true}
        />
        <Searchbar
          variant="secondary"
          size="medium"
          placeholder="Secondary Medium"
          showIcon={true}
        />
        <Searchbar
          variant="secondary"
          size="large"
          placeholder="Secondary Large"
          showIcon={true}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          Tertiary Variant
        </h3>
        <Searchbar
          variant="tertiary"
          size="small"
          placeholder="Tertiary Small"
          showIcon={true}
        />
        <Searchbar
          variant="tertiary"
          size="medium"
          placeholder="Tertiary Medium"
          showIcon={true}
        />
        <Searchbar
          variant="tertiary"
          size="large"
          placeholder="Tertiary Large"
          showIcon={true}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// 모든 Theme 조합
export const AllThemes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          Light Theme
        </h3>
        <Searchbar
          variant="primary"
          theme="light"
          placeholder="Light Primary"
          showIcon={true}
        />
        <Searchbar
          variant="secondary"
          theme="light"
          placeholder="Light Secondary"
          showIcon={true}
        />
        <Searchbar
          variant="tertiary"
          theme="light"
          placeholder="Light Tertiary"
          showIcon={true}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '16px',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          Dark Theme
        </h3>
        <Searchbar
          variant="primary"
          theme="dark"
          placeholder="Dark Primary"
          showIcon={true}
        />
        <Searchbar
          variant="secondary"
          theme="dark"
          placeholder="Dark Secondary"
          showIcon={true}
        />
        <Searchbar
          variant="tertiary"
          theme="dark"
          placeholder="Dark Tertiary"
          showIcon={true}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// 상태별 조합
export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          Normal States
        </h3>
        <Searchbar placeholder="기본 상태" showIcon={true} />
        <Searchbar
          placeholder="값이 있는 상태"
          showIcon={true}
          value="검색어 예시"
        />
        <Searchbar placeholder="아이콘 없는 상태" showIcon={false} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          Disabled States
        </h3>
        <Searchbar
          placeholder="비활성화 상태"
          showIcon={true}
          disabled={true}
        />
        <Searchbar
          placeholder="읽기 전용 상태"
          showIcon={true}
          readOnly={true}
          value="읽기 전용 값"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
