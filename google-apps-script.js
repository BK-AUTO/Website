// Google Apps Script cho xử lý form đăng ký thành viên BK-AUTO
// URL deploy: https://script.google.com/macros/s/AKfycbzVo_MrsdBY8L3WT3ySnntSMvFLZa-KeX52kV20V31AoZx-n8qihTesAQ9gF_RC1aopew/exec

const TZ = 'Asia/Ho_Chi_Minh';
const SHEET_ID = '18vMVlHdUa99i76GHNY-f-Y38tzr9ZK-RvGA9cMwPbbU';

function doGet(e) {
  try {
    const params = e.parameter;

    // Chuẩn hóa timestamp về Date (GMT+7)
    const tsDate = normalizeToHCMDate(params.timestamp);

    // Lấy thông tin từ form
    const data = {
      timestampDate: tsDate, // Date object đã chuẩn hóa GMT+7
      fullName: (params.fullName || '').trim(),
      identifier: (params.identifier || '').trim(),   // MSSV/Trường
      majorClass: (params.majorClass || '').trim(),   // Ngành/Lớp
      email: (params.email || '').trim(),
      phone: normalizePhone(params.phone),
      studentType: (params.studentType || '').trim(), // 'hust' hoặc 'external'
      mainDepartment: (params.mainDepartment || '').trim(),
      subDepartments: params.subDepartments || '[]',
      cvLink: (params.cvLink || '').trim()
    };

    // Lưu vào Google Sheets
    const result = saveToSheet(data);
    if (!result.success) throw new Error(result.error);

    // Gửi email xác nhận (HTML-only, API key từ Script Properties)
    sendConfirmationEmail(data.email, data.fullName);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Application submitted successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Chuẩn hóa timestamp đầu vào về Date theo GMT+7. */
function normalizeToHCMDate(rawTs) {
  let d;
  if (rawTs == null || String(rawTs).trim() === '') {
    d = new Date();
  } else {
    const s = String(rawTs).trim();
    if (/^\d+$/.test(s)) {
      const num = Number(s);
      d = (s.length <= 10) ? new Date(num * 1000) : new Date(num);
    } else {
      const parsed = new Date(s);
      d = isNaN(parsed.getTime()) ? new Date() : parsed;
    }
  }
  // Spreadsheet sẽ hiển thị theo timezone của file; mình set TZ tại saveToSheet().
  return d;
}

/** Chuẩn hóa số điện thoại: giữ số, dấu +, bỏ khoảng trắng/ ký tự thừa, không đổi đầu số. */
function normalizePhone(phoneRaw) {
  const s = (phoneRaw == null) ? '' : String(phoneRaw);
  // Cho phép + ở đầu, còn lại là 0-9
  const trimmed = s.trim();
  if (trimmed === '') return '';
  const kept = trimmed.replace(/[^\d+]/g, '');
  // Nếu có nhiều dấu +, giữ dấu + đầu, bỏ dấu + sau
  return kept.replace(/(?!^)\+/g, '');
}

function saveToSheet(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    ensureSpreadsheetTimezone_(ss, TZ);
    const sheet = ss.getActiveSheet();

    // Tạo header + set format cột
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Họ tên', 'MSSV/Trường', 'Ngành/Lớp', 'Email', 'SĐT',
        'Loại SV', 'Mảng chính', 'Mảng phụ', 'CV Link', 'Trạng thái'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      ensureSheetFormats_(sheet);
    } else {
      ensureSheetFormats_(sheet);
    }

    // Chuẩn bị dữ liệu
    const phoneForSheet = data.phone ? ("'" + data.phone) : ""; // ép text, giữ 0 đầu
    const rowData = [
      data.timestampDate, // Date native
      data.fullName,
      data.identifier,
      data.majorClass,
      data.email,
      phoneForSheet, // <-- SĐT có dấu nháy
      data.studentType === 'hust' ? 'Sinh viên HUST' : 'Sinh viên ngoài HUST',
      getDepartmentName(data.mainDepartment),
      formatSubDepartments(data.subDepartments),
      data.cvLink,
      'Đã nộp đơn'
    ];

    // Ghi theo kiểu setValues (không dùng appendRow)
    const nextRow = sheet.getLastRow() + 1;

    // Đảm bảo định dạng trước khi ghi
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sheet.getRange('C:C').setNumberFormat('@');
    sheet.getRange('E:E').setNumberFormat('@');
    sheet.getRange('F:F').setNumberFormat('@');
    sheet.getRange('H:H').setNumberFormat('@');
    sheet.getRange('I:I').setNumberFormat('@');
    sheet.getRange('J:J').setNumberFormat('@');

    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    sheet.getRange(nextRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss'); // đảm bảo cột A dòng mới

    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


/** Thiết lập định dạng cột để không bị sai kiểu (đặc biệt là SĐT, MSSV, Email, v.v.) */
function ensureSheetFormats_(sheet) {
  try {
    // A: Timestamp -> DateTime format
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');

    // C: MSSV/Trường -> Text
    sheet.getRange('C:C').setNumberFormat('@');

    // E: Email -> Text
    sheet.getRange('E:E').setNumberFormat('@');

    // F: SĐT -> Text (giữ 0 đầu, không dạng số/hàm)
    sheet.getRange('F:F').setNumberFormat('@');

    // H: Mảng chính -> Text (để không auto-convert)
    sheet.getRange('H:H').setNumberFormat('@');

    // I: Mảng phụ -> Text
    sheet.getRange('I:I').setNumberFormat('@');

    // J: CV Link -> Text (tránh auto hyperlink hóa kiểu không mong muốn)
    sheet.getRange('J:J').setNumberFormat('@');

    // (Các cột khác để mặc định text theo nội dung)
  } catch (e) {
    Logger.log('ensureSheetFormats_ error: ' + e);
  }
}

function sendConfirmationEmail(email, fullName) {
  try {
    const subject = 'Xác nhận đăng ký tuyển thành viên CLB BK-AUTO';
    const logoUrl = 'https://bkauto.vn/assets/bkauto-logo-a7f95174.svg';
    const fanpageUrl = 'https://www.facebook.com/BKAUTO.STE';

    // HTML theo style mẫu (nội dung giữ nguyên)
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin:0; padding:0; background:#f3f3f3; }
    .container { width: 90%; max-width: 720px; margin: 24px auto; background:#fff; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
    .logo { text-align: center; margin-bottom: 20px; }
    .logo img { max-width: 200px; height: auto; }
    h2 { text-align: center; color: #333; margin: 8px 0 16px; }
    p { margin-bottom: 10px; color:#222; }
    .info { margin-top: 20px; padding: 12px; background-color: #f8f8f8; border: 1px solid #ddd; border-radius: 6px; }
    .info strong { display: block; margin-bottom: 6px; }
    .timeline { margin: 0; padding-left: 18px; }
    .contact { margin-top: 20px; }
    .contact h3 { margin: 0 0 8px 0; }
    .contact ul { list-style: none; padding: 0; margin: 0; }
    .contact li { margin-bottom: 6px; }
    .contact a { color: #007bff; text-decoration: none; }
    .footer { margin-top: 24px; font-size: 12px; color: #666; text-align:center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="${logoUrl}" alt="BK-AUTO Logo">
    </div>
    <h2>CLB BK-AUTO - CLB NGHIÊN CỨU KHOA HỌC VÀ KĨ THUẬT</h2>

    <p>Xin chào <strong>${escapeHtml(fullName)}</strong>,</p>

    <p>Cảm ơn bạn đã đăng ký tham gia CLB BK-AUTO!</p>

    <p>Chúng tôi đã nhận được đơn đăng ký của bạn và sẽ xem xét trong thời gian sớm nhất.</p>

    <div class="info">
      <strong>📅 Timeline tiếp theo:</strong>
      <ul class="timeline">
        <li>Phỏng vấn: <strong>05/10/2025</strong></li>
        <li>Tuần thử thách: <strong>09/10/2025</strong></li>
      </ul>
    </div>

    <p>📧 Thông tin chi tiết sẽ được gửi qua email này, vui lòng kiểm tra email thường xuyên.</p>

    <div class="contact">
      <h3>📞 Nếu có thắc mắc, liên hệ:</h3>
      <ul>
        <li><strong>Email:</strong> bkauto.ste@gmail.com</li>
        <li><strong>Phone:</strong> 0332611486 (Chu Tiến Đạt - Chủ nhiệm)</li>
        <li><strong>Fanpage:</strong> <a href="${fanpageUrl}">https://www.facebook.com/BKAUTO.STE</a></li>
      </ul>
    </div>

    <p>Trân trọng,<br>CLB BK-AUTO</p>

    <div class="footer">
      Email này được gửi tự động từ hệ thống đăng ký CLB BK-AUTO.
    </div>
  </div>
</body>
</html>`;

    sendEmailViaResendHtmlOnly(email, subject, htmlBody);
  } catch (error) {
    Logger.log('Error sending confirmation email: ' + error.toString());
  }
}

// Gửi HTML-ONLY qua Resend, API key từ Script Properties
function sendEmailViaResendHtmlOnly(to, subject, htmlBody) {
  try {
    const url = 'https://api.resend.com/emails';
    const apiKey = getResendApiKey_();
    if (!apiKey) {
      throw new Error('Missing Script Property "RESEND_API_KEY". Vào Project Settings → Script properties để set.');
    }

    const payload = {
      from: 'CLB BK-AUTO <noreply@bkauto.vn>', // Phải là email/domain đã verify trong Resend
      to: [to],
      subject: subject,
      html: htmlBody
    };

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    Logger.log('Email sent response: ' + response.getResponseCode() + ' ' + response.getContentText());
  } catch (error) {
    Logger.log('Error sending email via Resend: ' + error.toString());
  }
}

function getResendApiKey_() {
  return PropertiesService.getScriptProperties().getProperty('RESEND_API_KEY');
}

function ensureSpreadsheetTimezone_(ss, tz) {
  try {
    if (ss.getSpreadsheetTimeZone() !== tz) {
      ss.setSpreadsheetTimeZone(tz);
    }
  } catch (e) {
    Logger.log('Timezone ensure skipped: ' + e);
  }
}

function getDepartmentName(code) {
  const departments = {
    'ai': 'AI for Automobile',
    'electrical': 'Điện - Điện tử',
    'simulation': 'Mô phỏng',
    'experiment': 'Thí nghiệm'
  };
  return departments[code] || code;
}

function formatSubDepartments(subDepartmentsJson) {
  try {
    const subDepts = JSON.parse(subDepartmentsJson);
    const names = {
      'communication': 'Truyền thông',
      'english': 'Tiếng Anh',
      'manufacturing': 'Cơ khí'
    };
    return subDepts.map(code => names[code] || code).join(', ') || 'Không có';
  } catch (error) {
    return 'Không có';
  }
}

// Utility: escape HTML để tránh lỗi hiển thị khi tên chứa ký tự đặc biệt
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
