# Google Analytics 4 Integration Guide

## Tổng quan

Tài liệu này hướng dẫn cách sử dụng Google Analytics 4 (GA4) đã được tích hợp vào website BK-AUTO Vue.js.

## Cấu hình

### 1. Thiết lập Measurement ID

1. Đăng nhập vào [Google Analytics](https://analytics.google.com/)
2. Tạo property GA4 mới hoặc sử dụng property hiện có
3. Lấy Measurement ID (định dạng: `G-XXXXXXXXXX`)
4. Cập nhật file `.env`:

```bash
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Cấu trúc Files

```
src/
├── config/
│   └── ga4.js              # Cấu hình GA4
├── composables/
│   └── ga4.js              # Composable cho GA4 tracking
└── utils/
    └── ga4-inject.js       # Utility để inject script
```

## Cách sử dụng

### 1. Tracking trong Components

```vue
<script setup>
import { useGA4 } from '@/composables/ga4.js';

const { trackEvent, trackClick, trackPageView } = useGA4();

// Track page view thủ công
trackPageView('/current-page', 'Page Title');

// Track custom events
trackEvent('custom_event', {
  custom_parameter: 'value'
});

// Track button clicks
const handleButtonClick = () => {
  trackClick('button_name', 'button', 'header');
  // Logic khác...
};
</script>
```

### 2. Tracking tự động

- **Page Views**: Được track tự động khi chuyển trang qua Vue Router
- **Router Integration**: Cấu hình trong `src/router/index.js`

### 3. Predefined Events

#### Course Tracking
```javascript
const { trackCourseView } = useGA4();

trackCourseView({
  id: 'course-id',
  name: 'Course Name',
  category: 'programming'
});
```

#### News Tracking
```javascript
const { trackNewsView } = useGA4();

trackNewsView({
  id: 'news-id',
  title: 'News Title',
  category: 'announcement'
});
```

#### Project Tracking
```javascript
const { trackProjectView } = useGA4();

trackProjectView({
  id: 'project-id',
  name: 'Project Name',
  type: 'research'
});
```

#### Form Tracking
```javascript
const { trackContactFormSubmit } = useGA4();

// Khi submit form thành công
trackContactFormSubmit('recruitment');
```

#### Search Tracking
```javascript
const { trackSearch } = useGA4();

trackSearch('search term', 'course');
```

#### Download Tracking
```javascript
const { trackDownload } = useGA4();

trackDownload('document.pdf', 'pdf');
```

#### Scroll Tracking
```javascript
const { trackScroll } = useGA4();

// Track khi user scroll đến 75% trang
trackScroll(75);
```

### 4. Custom Events

```javascript
const { trackEvent } = useGA4();

// Event tùy chỉnh
trackEvent('video_play', {
  video_id: 'intro-video',
  video_title: 'BK-AUTO Introduction',
  video_duration: 120,
  video_current_time: 0
});

// Event với nhiều parameters
trackEvent('membership_interest', {
  interest_level: 'high',
  department: 'mechanical_engineering',
  year: 2024,
  source: 'recruitment_page'
});
```

### 5. User Properties

```javascript
const { setUserProperties } = useGA4();

// Set user properties
setUserProperties({
  user_type: 'student',
  department: 'mechanical_engineering',
  membership_status: 'applicant'
});
```

## Các Events có sẵn

### Standard Events
- `page_view` - Tự động track khi chuyển trang
- `click` - Track clicks trên elements
- `scroll` - Track scroll behavior
- `search` - Track search actions
- `download` - Track file downloads

### BK-AUTO Specific Events
- `course_view` - Xem khóa học
- `news_view` - Xem tin tức  
- `project_view` - Xem dự án
- `research_view` - Xem nghiên cứu
- `contact_form_submit` - Submit form liên hệ
- `form_start` - Bắt đầu điền form
- `form_submit` - Submit form thành công
- `form_error` - Lỗi khi submit form

## Best Practices

### 1. Event Naming
- Sử dụng snake_case cho event names
- Tên event nên mô tả rõ ràng action
- Sử dụng các event names chuẩn của GA4 khi có thể

### 2. Parameters
- Giới hạn số lượng parameters (tối đa 25 custom parameters)
- Tên parameter sử dụng snake_case
- Giá trị parameters nên ngắn gọn và có ý nghĩa

### 3. Performance
- Không track quá nhiều events không cần thiết
- Batch events khi có thể
- Sử dụng debounce cho events trigger liên tục (scroll, resize)

### 4. Privacy
- Không track thông tin cá nhân nhạy cảm
- Tuân thủ GDPR và các quy định về privacy
- Cung cấp tùy chọn opt-out cho users

## Debugging

### 1. Development Mode
GA4 config tự động bật debug mode trong development:

```javascript
// Trong config/ga4.js
debug_mode: import.meta.env.DEV
```

### 2. Browser DevTools
- Mở Chrome DevTools
- Tab Network > Filter "collect" để xem GA4 requests
- Tab Console để xem debug messages

### 3. GA4 DebugView
1. Vào Google Analytics
2. Admin > DebugView  
3. Enable debug mode và xem events realtime

### 4. Kiểm tra Integration
```javascript
// Trong browser console
if (window.gtag) {
  console.log('GA4 loaded successfully');
} else {
  console.log('GA4 not loaded');
}
```

## Troubleshooting

### 1. Events không xuất hiện trong GA4
- Kiểm tra Measurement ID trong `.env`
- Verify gtag script đã load
- Check browser console for errors
- Đợi 24-48h để data xuất hiện trong reports

### 2. Duplicate Events
- Đảm bảo chỉ có 1 gtag script trong HTML
- Không call trackPageView thủ công nếu router đã tự động track

### 3. Development vs Production
- Test trong production environment
- Verify environment variables được set correctly
- Check network requests trong production

## Monitoring & Reports

### 1. Key Metrics to Monitor
- Page Views
- User Engagement
- Conversion Events (form submissions)
- User Journey
- Content Performance

### 2. Custom Reports
Tạo custom reports cho:
- Course engagement
- News readership  
- Project interest
- Recruitment funnel
- User journey analysis

### 3. Alerts
Set up alerts cho:
- Significant traffic drops
- High error rates
- Conversion rate changes

## Ví dụ Implementation

Xem file `src/views/recruitment/MemberRecruitment.vue` để thấy ví dụ implementation đầy đủ với:
- Page view tracking
- Form interaction tracking
- Error handling
- Success tracking
- User journey tracking