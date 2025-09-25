# Hướng dẫn Setup Google Apps Script cho Form Tuyển Thành Viên BK-AUTO

## Bước 1: Tạo Google Spreadsheet

1. **Tạo Google Sheets mới:**
   - Truy cập [sheets.google.com](https://sheets.google.com)
   - Tạo một spreadsheet mới
   - Đặt tên: "BK-AUTO Member Recruitment"

2. **Lấy Spreadsheet ID:**
   - Từ URL của spreadsheet: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy phần `SPREADSHEET_ID` (chuỗi dài giữa `/d/` và `/edit`)
   - Ví dụ: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Bước 2: Tạo Google Drive Folder

1. **Tạo folder để lưu CV:**
   - Truy cập [drive.google.com](https://drive.google.com)
   - Tạo folder mới, đặt tên: "BK-AUTO CVs"

2. **Lấy Folder ID:**
   - Vào folder vừa tạo
   - Từ URL: `https://drive.google.com/drive/folders/FOLDER_ID`
   - Copy phần `FOLDER_ID`
   - Ví dụ: `1DriveFolder123abc456def789`

## Bước 3: Tạo Google Apps Script

1. **Tạo project mới:**
   - Truy cập [script.google.com](https://script.google.com)
   - Nhấn "New project"
   - Đặt tên: "BK-AUTO Recruitment Handler"

2. **Thay thế code:**
   - Xóa code mặc định
   - Copy toàn bộ nội dung từ file `google-apps-script-updated.js`
   - Paste vào Apps Script Editor

3. **Cập nhật cấu hình:**
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'PASTE_YOUR_SPREADSHEET_ID_HERE',
     DRIVE_FOLDER_ID: 'PASTE_YOUR_FOLDER_ID_HERE',
     ALLOWED_ORIGINS: [
       'http://localhost:5173',           // For development
       'https://your-domain.com',         // Your production domain
       'https://bk-auto.netlify.app'      // Example hosting
     ]
   };
   ```

## Bước 4: Test Setup

1. **Chạy test function:**
   - Trong Apps Script Editor, chọn function `testSetup`
   - Nhấn nút "Run" (▶️)
   - Cấp quyền khi được yêu cầu
   - Kiểm tra logs để đảm bảo không có lỗi

## Bước 5: Deploy Web App

1. **Deploy script:**
   - Nhấn "Deploy" > "New deployment"
   - Chọn type: "Web app"
   - Description: "BK-AUTO Recruitment Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone" (quan trọng!)

2. **Lấy Web App URL:**
   - Copy URL từ deployment (dạng: `https://script.google.com/macros/s/.../exec`)
   - Đây là URL bạn sẽ sử dụng trong frontend

## Bước 6: Cập nhật Frontend

Cập nhật URL trong file `MemberRecruitment.vue`:

```javascript
// Thay thế URL này
const response = await fetch(
  'YOUR_DEPLOYED_WEB_APP_URL_HERE',
  {
    method: 'POST',
    body: postData,
  }
);
```

## Bước 7: Kiểm tra quyền

1. **Spreadsheet permissions:**
   - Đảm bảo script có quyền edit spreadsheet
   - Nếu cần, share spreadsheet với email của script

2. **Drive permissions:**
   - Script sẽ tự động có quyền tạo file trong folder
   - Folder sẽ chứa các CV được upload

## Bước 8: Test toàn bộ hệ thống

1. **Test từ frontend:**
   - Chạy `npm run dev`
   - Truy cập form tuyển thành viên
   - Upload một file test và submit

2. **Kiểm tra kết quả:**
   - Kiểm tra Google Sheets có dữ liệu mới
   - Kiểm tra Google Drive có file CV
   - Kiểm tra console logs trong Apps Script

## Cấu trúc dữ liệu trong Google Sheets

Spreadsheet sẽ có các cột sau:

| Cột | Tên | Mô tả |
|-----|-----|-------|
| A | Thời gian | Timestamp submit |
| B | Họ và tên | Tên đầy đủ |
| C | MSSV/Trường | MSSV hoặc tên trường |
| D | Ngành/Lớp | Thông tin ngành học |
| E | Email | Địa chỉ email |
| F | Số điện thoại | SĐT liên lạc |
| G | Loại sinh viên | HUST/Ngoài HUST |
| H | Mảng chính | Mảng ứng tuyển |
| I | Mảng phụ | JSON array các mảng phụ |
| J | Tên file CV | Tên file đã upload |
| K | Link file CV | URL truy cập file |
| L | Kích thước file | Size file (KB) |
| M | Câu hỏi/Ghi chú | Thắc mắc của ứng viên |

## Troubleshooting

### Lỗi thường gặp:

1. **"Exception: You do not have permission"**
   - Chạy lại function `testSetup` và cấp đủ quyền
   - Kiểm tra lại Spreadsheet ID và Folder ID

2. **"CORS error"**
   - Đảm bảo domain được thêm vào `ALLOWED_ORIGINS`
   - Kiểm tra deployment có set "Anyone" access

3. **File không upload được**
   - Kiểm tra Drive Folder ID
   - Đảm bảo folder tồn tại và có quyền

4. **413 Request Entity Too Large**
   - Đã được fix bằng cách chuyển sang POST với FormData
   - Giới hạn file size ở frontend (5MB)

### Debug tips:

1. **Xem logs:**
   - Trong Apps Script Editor: View > Logs
   - Hoặc View > Executions (chi tiết hơn)

2. **Test riêng từng function:**
   - Test `testSetup()` trước
   - Test `saveToSheet()` với dữ liệu mẫu

3. **Test POST request trực tiếp:**
   - Dùng Postman hoặc curl để test endpoint

## Bảo mật

1. **Không lưu thông tin nhạy cảm** trong code
2. **Kiểm tra origin** của request
3. **Giới hạn file size** và file type
4. **Regular backup** spreadsheet và drive folder
5. **Monitor logs** thường xuyên để phát hiện abuse

Hoàn thành setup này, bạn sẽ có một hệ thống hoàn chỉnh để nhận đơn đăng ký với file CV, lưu trữ tự động và không cần email notification.