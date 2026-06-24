import type { PaginatedResponse } from '@/shared/types';
import { mockDelay, paginate } from '@/shared/lib';
import {
  PROJECT_STATUS,
  DEFAULT_PROJECT_PAGE_SIZE,
} from '../constants/project.constants';
import type {
  Project,
  ProjectFilters,
  CreateProjectPayload,
} from '../types/project.types';

/**
 * Sample projects for local development without a backend.
 * Activated by `NEXT_PUBLIC_USE_MOCK_API=true` in `project.api.ts`.
 */
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p-01',
    name: 'Cải tạo căn hộ Vinhomes Central Park',
    description: 'Cải tạo toàn bộ căn hộ 2 phòng ngủ, 78m².',
    status: PROJECT_STATUS.ACTIVE,
    createdAt: '2026-05-02T03:00:00Z',
    updatedAt: '2026-06-18T08:30:00Z',
  },
  {
    id: 'p-02',
    name: 'Thi công quán café The Workshop',
    description: 'Setup nội thất quán café 120m² phong cách công nghiệp.',
    status: PROJECT_STATUS.ACTIVE,
    createdAt: '2026-04-15T03:00:00Z',
    updatedAt: '2026-06-12T10:00:00Z',
  },
  {
    id: 'p-03',
    name: 'Nhà phố gia đình anh Tuấn',
    description: 'Xây mới nhà phố 1 trệt 3 lầu tại Thủ Đức.',
    status: PROJECT_STATUS.ON_HOLD,
    createdAt: '2026-03-20T03:00:00Z',
    updatedAt: '2026-05-28T09:15:00Z',
  },
  {
    id: 'p-04',
    name: 'Văn phòng công ty TNHH Minh Phát',
    description: 'Cải tạo văn phòng 300m² tầng 8.',
    status: PROJECT_STATUS.COMPLETED,
    createdAt: '2026-01-10T03:00:00Z',
    updatedAt: '2026-04-02T07:45:00Z',
  },
  {
    id: 'p-05',
    name: 'Biệt thự Eco Park lô B12',
    description: 'Hoàn thiện nội thất biệt thự song lập.',
    status: PROJECT_STATUS.DRAFT,
    createdAt: '2026-06-01T03:00:00Z',
    updatedAt: '2026-06-20T11:00:00Z',
  },
  {
    id: 'p-06',
    name: 'Showroom nội thất Nhà Xinh',
    description: 'Thi công showroom 250m² mặt tiền Cộng Hòa.',
    status: PROJECT_STATUS.ACTIVE,
    createdAt: '2026-05-18T03:00:00Z',
    updatedAt: '2026-06-19T14:20:00Z',
  },
  {
    id: 'p-07',
    name: 'Cải tạo nhà hàng Hải Sản Biển Đông',
    description: 'Nâng cấp khu bếp và khu vực phục vụ 400m².',
    status: PROJECT_STATUS.ON_HOLD,
    createdAt: '2026-02-25T03:00:00Z',
    updatedAt: '2026-05-15T06:30:00Z',
  },
  {
    id: 'p-08',
    name: 'Căn hộ Masteri Thảo Điền',
    description: 'Cải tạo căn studio 45m² cho thuê.',
    status: PROJECT_STATUS.COMPLETED,
    createdAt: '2025-12-05T03:00:00Z',
    updatedAt: '2026-03-10T08:00:00Z',
  },
  {
    id: 'p-09',
    name: 'Spa & Wellness Center Quận 7',
    description: 'Thi công mới spa 2 tầng 500m².',
    status: PROJECT_STATUS.ACTIVE,
    createdAt: '2026-05-25T03:00:00Z',
    updatedAt: '2026-06-21T09:40:00Z',
  },
  {
    id: 'p-10',
    name: 'Kho xưởng Long An',
    description: 'Xây dựng nhà kho khung thép 1.200m².',
    status: PROJECT_STATUS.DRAFT,
    createdAt: '2026-06-10T03:00:00Z',
    updatedAt: '2026-06-22T13:10:00Z',
  },
  {
    id: 'p-11',
    name: 'Trường mầm non Hoa Sen',
    description: 'Cải tạo và mở rộng khu lớp học.',
    status: PROJECT_STATUS.ARCHIVED,
    createdAt: '2025-09-01T03:00:00Z',
    updatedAt: '2026-01-20T07:00:00Z',
  },
  {
    id: 'p-12',
    name: 'Penthouse Landmark 81',
    description: 'Hoàn thiện nội thất cao cấp tầng 72.',
    status: PROJECT_STATUS.ACTIVE,
    createdAt: '2026-04-28T03:00:00Z',
    updatedAt: '2026-06-17T15:00:00Z',
  },
  {
    id: 'p-13',
    name: 'Phòng khám nha khoa Smile',
    description: 'Thi công phòng khám 90m² tại Gò Vấp.',
    status: PROJECT_STATUS.COMPLETED,
    createdAt: '2025-11-12T03:00:00Z',
    updatedAt: '2026-02-14T10:30:00Z',
  },
  {
    id: 'p-14',
    name: 'Nhà hàng chay An Lạc',
    description: 'Cải tạo không gian 180m² phong cách thiền.',
    status: PROJECT_STATUS.DRAFT,
    createdAt: '2026-06-15T03:00:00Z',
    updatedAt: '2026-06-23T08:50:00Z',
  },
];

function applyFilters(filters: ProjectFilters): Project[] {
  let items = [...MOCK_PROJECTS];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }
  if (filters.status !== 'all') {
    items = items.filter((p) => p.status === filters.status);
  }
  return items;
}

export const mockProjectApi = {
  async list(filters: ProjectFilters): Promise<PaginatedResponse<Project>> {
    await mockDelay();
    return paginate(
      applyFilters(filters),
      filters.page,
      DEFAULT_PROJECT_PAGE_SIZE,
    );
  },

  async getById(id: string): Promise<Project> {
    await mockDelay(200);
    const found = MOCK_PROJECTS.find((p) => p.id === id);
    if (!found) throw { status: 404, message: 'Project not found (mock).' };
    return found;
  },

  async create(payload: CreateProjectPayload): Promise<Project> {
    await mockDelay();
    return {
      id: `p-${MOCK_PROJECTS.length + 1}`,
      name: payload.name,
      description: payload.description,
      status: PROJECT_STATUS.DRAFT,
      createdAt: '2026-06-24T00:00:00Z',
      updatedAt: '2026-06-24T00:00:00Z',
    };
  },

  async remove(): Promise<void> {
    await mockDelay(200);
  },
};
