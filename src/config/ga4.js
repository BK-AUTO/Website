// GA4 Configuration
export const GA4_CONFIG = {
  // Thay thế GA_MEASUREMENT_ID bằng Measurement ID thực tế của bạn
  // Ví dụ: G-XXXXXXXXXX
  MEASUREMENT_ID: import.meta.env.VITE_GA4_MEASUREMENT_ID || 'GA_MEASUREMENT_ID',
  
  // Các cài đặt mặc định cho GA4
  CONFIG_OPTIONS: {
    // Tùy chọn để điều khiển việc thu thập dữ liệu
    send_page_view: true,
    // Tùy chọn cookie
    cookie_expires: 63072000, // 2 năm tính bằng giây
    cookie_update: true,
    // Tùy chọn debug (chỉ bật trong development)
    debug_mode: import.meta.env.DEV,
  },
  
  // Các event tùy chỉnh thường dùng
  EVENTS: {
    PAGE_VIEW: 'page_view',
    CLICK: 'click',
    SCROLL: 'scroll',
    CONTACT_FORM_SUBMIT: 'contact_form_submit',
    COURSE_VIEW: 'course_view',
    NEWS_VIEW: 'news_view',
    PROJECT_VIEW: 'project_view',
    RESEARCH_VIEW: 'research_view',
    DOWNLOAD: 'download',
    SEARCH: 'search',
  }
};