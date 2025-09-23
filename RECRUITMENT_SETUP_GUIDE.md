# HƯỚNG DẪN SETUP FORM TUYỂN THÀNH VIÊN BK-AUTO

## 🚀 TỔNG QUAN
Form đăng ký tuyển thành viên đã được tích hợp hoàn chỉnh vào website. Cần thực hiện các bước setup sau để hoạt động:

## 📋 CHECKLIST SETUP

### 1. ✅ ĐÃ HOÀN THÀNH
- [x] Frontend form hoàn chỉnh
- [x] Routing và navigation
- [x] UI/UX responsive
- [x] Translations (Vi/En)
- [x] Form validation
- [x] Google Apps Script template

### 2. 🔧 CẦN SETUP

#### A. Google Sheets
1. Tạo Google Sheets mới cho lưu trữ đơn đăng ký
2. Copy Sheet ID (từ URL) vào file `google-apps-script.js` dòng 42:
   ```javascript
   const SHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```

#### B. Google Apps Script  
1. Truy cập: https://script.google.com/
2. Tạo project mới
3. Copy toàn bộ code từ file `google-apps-script.js`
4. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone
5. Copy URL deployment (nếu khác với URL hiện tại)

#### C. Email Setup
1. Thay đổi email addresses của trưởng mảng trong function `getManagerEmails()`:
   ```javascript
   return {
     'ai': 'EMAIL_TRUONG_MANG_AI@example.com',
     'electrical': 'EMAIL_TRUONG_MANG_DIEN@example.com', 
     'simulation': 'EMAIL_TRUONG_MANG_MO_PHONG@example.com',
     'experiment': 'EMAIL_TRUONG_MANG_THI_NGHIEM@example.com'
   };
   ```

2. Cập nhật domain gửi email trong function `sendEmailViaResend()`:
   ```javascript
   from: 'BK-AUTO Club <noreply@DOMAIN_CUA_BAN.vn>'
   ```

#### D. Resend API (Đã có key)
- API Key đã được cấu hình: `re_8qQ8DT8z_3KopiBrxRTDymkLUNijJM2pi`
- Cần verify domain trên Resend để gửi email

## 🎨 CUSTOMIZATION NOTES

### Text Placeholders đã để sẵn:
- `t('recruitment.timeline.title')` - Timeline title
- `t('recruitment.notes.title')` - Important notes
- `t('recruitment.contact.title')` - Contact info
- Và nhiều key khác trong locales/vi.json và locales/en.json

### CSS Variables có thể điều chỉnh:
- Button colors: `.recruitment-button` trong Dashboard.vue
- Form styling: RecruitmentForm.vue
- Timeline colors: MemberRecruitment.vue

## 🔗 NAVIGATION

### Menu đã được thêm:
- Header navigation: "Tuyển thành viên" (styled đặc biệt)
- Dashboard CTA button với animation
- Direct URL: `/member-recruitment`

## 📱 RESPONSIVE DESIGN
Form đã được optimize cho:
- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (< 768px)

## 🔍 TESTING CHECKLIST

### Form Validation:
- [x] Email HUST validation (@sis.hust.edu.vn)
- [x] Phone number Vietnam format
- [x] Required fields
- [x] URL validation cho CV link

### User Flow:
- [x] Student type selection (HUST/External)
- [x] Dynamic form fields
- [x] Department selection (main + sub)
- [x] File/link upload
- [x] Success modal
- [x] Loading states

## 🚦 DEPLOYMENT

### 1. Google Apps Script:
```
URL hiện tại: https://script.google.com/macros/s/AKfycbzVo_MrsdBY8L3WT3ySnntSMvFLZa-KeX52kV20V31AoZx-n8qihTesAQ9gF_RC1aopew/exec
```

### 2. Frontend:
```bash
npm run build
# Deploy như bình thường
```

## ⚠️ QUAN TRỌNG

1. **Google Sheets Permissions**: Đảm bảo Google Apps Script có quyền write vào Sheets
2. **Email Deliverability**: Test gửi email thực tế trước khi đăng
3. **Rate Limiting**: Google Apps Script có giới hạn requests/minute
4. **Backup**: Luôn backup Google Sheets định kỳ

## 🎯 TIMELINE DEPLOYMENT
- **Ngay bây giờ**: Test trên localhost
- **Trong 1 giờ**: Deploy lên staging/production
- **Trước 25/9/2025**: Go live cho đợt tuyển thành viên

## 📞 SUPPORT
Nếu có vấn đề, check:
1. Browser console để xem lỗi JavaScript
2. Google Apps Script logs
3. Network tab để xem API calls
4. Resend dashboard để xem email status

---
**Status**: ✅ Ready for deployment with minor configurations needed