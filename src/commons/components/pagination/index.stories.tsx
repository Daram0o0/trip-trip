import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pagination } from './index';
import { useState } from 'react';

// Mock function for actions
const fn = () => () => {};

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '다양한 variant, size, theme를 지원하는 재사용 가능한 페이지네이션 컴포넌트입니다. 페이지 번호 표시, 이전/다음 버튼, 첫 페이지/마지막 페이지 버튼 등을 지원합니다.',
      },
    },
  },
  // Docs 생성을 위한 명시적 설정
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: '현재 페이지 번호 (1부터 시작)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: '전체 페이지 수',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '10' },
      },
    },
    visiblePages: {
      control: { type: 'number', min: 3, max: 10 },
      description: '표시할 페이지 번호 개수',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: '페이지네이션의 시각적 스타일 변형',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '페이지네이션의 크기',
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
    hideNavigation: {
      control: { type: 'boolean' },
      description: '이전/다음 버튼 숨기기',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showFirstLast: {
      control: { type: 'boolean' },
      description: '첫 페이지/마지막 페이지로 이동 버튼 표시',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onPageChange: {
      action: 'page changed',
      description: '페이지 변경 핸들러',
      table: {
        type: { summary: 'function' },
      },
    },
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Docs 페이지용 스토리
export const Docs: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pagination 컴포넌트의 모든 기능과 사용법을 확인할 수 있습니다.',
      },
    },
  },
  args: {
    currentPage: 5,
    totalPages: 20,
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// 기본 페이지네이션
export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// Variant별 스토리
export const Primary: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    variant: 'tertiary',
  },
};

// Size별 스토리
export const Small: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    size: 'large',
  },
};

// Theme별 스토리
export const LightTheme: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 첫 페이지/마지막 페이지 버튼이 있는 페이지네이션
export const WithFirstLastButtons: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    showFirstLast: true,
  },
};

// 네비게이션 버튼이 숨겨진 페이지네이션
export const WithoutNavigation: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    hideNavigation: true,
  },
};

// 모든 옵션이 활성화된 페이지네이션
export const FullFeatured: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    showFirstLast: true,
    visiblePages: 7,
  },
};

// 페이지 수가 적은 경우
export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
  },
};

// 페이지 수가 많은 경우
export const ManyPages: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
  },
};

// Variant와 Size 조합
export const VariantSizeCombinations: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Primary Variants</h3>
        <div className="space-y-4">
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="primary"
            size="small"
            onPageChange={fn()}
          />
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="primary"
            size="medium"
            onPageChange={fn()}
          />
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="primary"
            size="large"
            onPageChange={fn()}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Secondary Variants</h3>
        <div className="space-y-4">
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="secondary"
            size="small"
            onPageChange={fn()}
          />
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="secondary"
            size="medium"
            onPageChange={fn()}
          />
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="secondary"
            size="large"
            onPageChange={fn()}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tertiary Variants</h3>
        <div className="space-y-4">
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="tertiary"
            size="small"
            onPageChange={fn()}
          />
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="tertiary"
            size="medium"
            onPageChange={fn()}
          />
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="tertiary"
            size="large"
            onPageChange={fn()}
          />
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
        <div className="space-y-4">
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="primary"
            theme="light"
            onPageChange={fn()}
          />
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="secondary"
            theme="light"
            onPageChange={fn()}
          />
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="tertiary"
            theme="light"
            onPageChange={fn()}
          />
        </div>
      </div>

      <div className="space-y-4 bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white">Dark Theme</h3>
        <div className="space-y-4">
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="primary"
            theme="dark"
            onPageChange={fn()}
          />
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="secondary"
            theme="dark"
            onPageChange={fn()}
          />
          <Pagination
            currentPage={5}
            totalPages={20}
            variant="tertiary"
            theme="dark"
            onPageChange={fn()}
          />
        </div>
      </div>
    </div>
  ),
};

// 다양한 페이지 수 조합
export const PageCountVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Few Pages (3 pages)</h3>
        <Pagination currentPage={2} totalPages={3} onPageChange={fn()} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Medium Pages (10 pages)</h3>
        <Pagination currentPage={5} totalPages={10} onPageChange={fn()} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Many Pages (50 pages)</h3>
        <Pagination currentPage={25} totalPages={50} onPageChange={fn()} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Very Many Pages (100 pages)</h3>
        <Pagination currentPage={50} totalPages={100} onPageChange={fn()} />
      </div>
    </div>
  ),
};

// 다양한 visiblePages 조합
export const VisiblePagesVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">3 Visible Pages</h3>
        <Pagination
          currentPage={10}
          totalPages={20}
          visiblePages={3}
          onPageChange={fn()}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">5 Visible Pages (Default)</h3>
        <Pagination
          currentPage={10}
          totalPages={20}
          visiblePages={5}
          onPageChange={fn()}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">7 Visible Pages</h3>
        <Pagination
          currentPage={10}
          totalPages={20}
          visiblePages={7}
          onPageChange={fn()}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">10 Visible Pages</h3>
        <Pagination
          currentPage={10}
          totalPages={20}
          visiblePages={10}
          onPageChange={fn()}
        />
      </div>
    </div>
  ),
};

// 특수 옵션 조합
export const SpecialOptionsCombinations: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With First/Last Buttons</h3>
        <Pagination
          currentPage={10}
          totalPages={20}
          showFirstLast={true}
          onPageChange={fn()}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Without Navigation</h3>
        <Pagination
          currentPage={5}
          totalPages={20}
          hideNavigation={true}
          onPageChange={fn()}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Full Featured</h3>
        <Pagination
          currentPage={10}
          totalPages={20}
          showFirstLast={true}
          visiblePages={7}
          onPageChange={fn()}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Minimal (No Navigation, No First/Last)
        </h3>
        <Pagination
          currentPage={5}
          totalPages={20}
          hideNavigation={true}
          showFirstLast={false}
          onPageChange={fn()}
        />
      </div>
    </div>
  ),
};

// 인터랙션 테스트
export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(5);

    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            현재 페이지: {currentPage} / 20
          </p>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={20}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '페이지네이션을 클릭하면 페이지가 변경되는 것을 확인할 수 있습니다.',
      },
    },
  },
};

// 실제 사용 예시
export const RealWorldExample: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 15;
    const itemsPerPage = 10;
    const totalItems = totalPages * itemsPerPage;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="space-y-6 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">상품 목록</h3>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              {startItem}-{endItem} / {totalItems}개 상품
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: itemsPerPage }, (_, i) => (
              <div key={i} className="p-4 border rounded-lg bg-gray-50">
                <div className="h-32 bg-gray-200 rounded mb-2"></div>
                <h4 className="font-medium">상품 {startItem + i}</h4>
                <p className="text-sm text-gray-600">상품 설명...</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showFirstLast={true}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

// 반응형 테스트
export const Responsive: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Desktop Size (Large)</h3>
        <Pagination
          currentPage={5}
          totalPages={20}
          size="large"
          onPageChange={fn()}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tablet Size (Medium)</h3>
        <Pagination
          currentPage={5}
          totalPages={20}
          size="medium"
          onPageChange={fn()}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mobile Size (Small)</h3>
        <Pagination
          currentPage={5}
          totalPages={20}
          size="small"
          onPageChange={fn()}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
