/**
 * Vietnamese copy for the admin back-office.
 *
 * The admin area is intentionally single-language (Vietnamese only) and carries
 * no theme/locale switcher, so its strings live here as plain constants instead
 * of the shared `messages/*.json` i18n catalog. Keeping them local also means
 * the admin slice never touches the customer-facing translation files.
 */
export const ADMIN_COPY = {
  /** Small chip next to the logo in the header. */
  badge: 'Quản trị',
  /** Accessible label / breadcrumb root. */
  root: 'Trang quản trị',
  user: {
    role: 'Quản trị viên',
    logout: 'Đăng xuất'
  },
  pages: {
    overview: {
      title: 'Tổng quan',
      subtitle: 'Bảng điều khiển quản trị BMT Decor AI.',
      welcome: 'Chào mừng trở lại',
      quickAccess: 'Truy cập nhanh'
    },
    cms: {
      title: 'Nội dung (CMS)',
      subtitle: 'Quản lý bài viết, trang và nội dung hiển thị công khai.'
    },
    users: {
      title: 'Người dùng',
      subtitle: 'Quản lý tài khoản khách hàng và phân quyền.'
    },
    leads: {
      title: 'Khách hàng tiềm năng',
      subtitle: 'Danh sách yêu cầu tư vấn và liên hệ gửi về.'
    },
    gallery: {
      title: 'Thư viện ảnh',
      subtitle: 'Quản lý ảnh mẫu và các bộ sưu tập hiển thị.'
    },
    portfolio: {
      title: 'Dự án tiêu biểu',
      subtitle: 'Quản lý các dự án trưng bày trên trang giới thiệu.'
    }
  }
} as const
