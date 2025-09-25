// Google Apps Script cho xử lý form đăng ký thành viên BK-AUTO
// URL deploy: https://script.google.com/macros/s/AKfycbzVo_MrsdBY8L3WT3ySnntSMvFLZa-KeX52kV20V31AoZx-n8qihTesAQ9gF_RC1aopew/exec

const TZ = 'Asia/Ho_Chi_Minh';
const SHEET_ID = '18vMVlHdUa99i76GHNY-f-Y38tzr9ZK-RvGA9cMwPbbU';

// === CẤU HÌNH TÔ MÀU THEO TRẠNG THÁI ===
const HEADER_ROW = 1;          // Dòng tiêu đề
const STATUS_COL = 12;         // Cột L = 12
const COLOR_APPROVED = '#d9ead3'; // Duyệt
const COLOR_REJECTED = '#f4c7c3'; // Loại
// Không màu cho "Đã nộp đơn" => dùng null để trả về mặc định

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
      cvLink: (params.cvLink || '').trim(),
      questions: (params.questions || '').trim()
    };

    // Lưu vào Google Sheets
    const result = saveToSheet(data);
    if (!result.success) throw new Error(result.error);

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
  // Spreadsheet hiển thị theo timezone của file; mình set TZ tại saveToSheet().
  return d;
}

/** Chuẩn hóa số điện thoại: giữ số, dấu +, bỏ khoảng trắng/ ký tự thừa, không đổi đầu số. */
function normalizePhone(phoneRaw) {
  const s = (phoneRaw == null) ? '' : String(phoneRaw);
  const trimmed = s.trim();
  if (trimmed === '') return '';
  const kept = trimmed.replace(/[^\d+]/g, '');
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
        'Loại SV', 'Mảng chính', 'Mảng phụ', 'CV Link', 'Câu hỏi/Thắc mắc', 'Trạng thái'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      ensureSheetFormats_(sheet);
    } else {
      ensureSheetFormats_(sheet);
    }

    // Chuẩn bị dữ liệu
    const phoneForSheet = data.phone ? ("'" + data.phone) : ""; // ép text, giữ 0 đầu
    const questionsForSheet = data.questions ? data.questions.substring(0, 1000) : ""; // giới hạn 1000 ký tự
    const statusText = 'Đã nộp đơn'; // trạng thái mặc định khi ghi mới
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
      questionsForSheet,
      statusText
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
    sheet.getRange('K:K').setNumberFormat('@');

    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    sheet.getRange(nextRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss'); // đảm bảo cột A dòng mới
    
    // Thiết lập dropdown validation cho row mới tạo (cột L)
    setupStatusDropdownForRow_(sheet, nextRow);

    // === TÔ MÀU CHO DÒNG MỚI VỪA GHI (theo trạng thái mặc định) ===
    applyRowColor_(sheet, nextRow, statusText);

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

    // K: Câu hỏi/Thắc mắc -> Text (wrap text cho nội dung dài)
    sheet.getRange('K:K').setNumberFormat('@').setWrap(true);

    // L: Trạng thái -> Dropdown validation
    setupStatusDropdown_(sheet);
  } catch (e) {
    Logger.log('ensureSheetFormats_ error: ' + e);
  }
}

/** Thiết lập dropdown validation cho một row cụ thể (cột L) */
function setupStatusDropdownForRow_(sheet, rowNumber) {
  try {
    const statusOptions = ['Đã nộp đơn', 'Duyệt', 'Loại'];
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(statusOptions, true)
      .setAllowInvalid(false)
      .setHelpText('Chọn trạng thái: Đã nộp đơn, Duyệt, hoặc Loại')
      .build();
    
    const cell = sheet.getRange(rowNumber, STATUS_COL);
    cell.setDataValidation(rule);
  } catch (error) {
    Logger.log('setupStatusDropdownForRow_ error: ' + error.toString());
  }
}

/** Thiết lập dropdown validation cho cột L (Trạng thái) */
function setupStatusDropdown_(sheet) {
  try {
    const statusOptions = ['Đã nộp đơn', 'Duyệt', 'Loại'];
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(statusOptions, true)
      .setAllowInvalid(false)
      .setHelpText('Chọn trạng thái: Đã nộp đơn, Duyệt, hoặc Loại')
      .build();
    
    const lastRow = Math.max(sheet.getLastRow(), 2);
    const range = sheet.getRange(2, STATUS_COL, lastRow - 1, 1);
    range.setDataValidation(rule);
    
    Logger.log('Status dropdown setup completed for column L');
  } catch (error) {
    Logger.log('setupStatusDropdown_ error: ' + error.toString());
  }
}

/** ====== TÔ MÀU THEO TRẠNG THÁI ====== */

/** Trả về màu theo nội dung trạng thái */
function getRowColorForStatus_(status) {
  const s = String(status || '').trim();
  if (s === 'Duyệt') return COLOR_APPROVED;
  if (s === 'Loại') return COLOR_REJECTED;
  // 'Đã nộp đơn' hoặc giá trị khác -> không màu (mặc định)
  return null;
}

/** Tô màu cả hàng theo trạng thái tại cột L */
function applyRowColor_(sheet, row, status) {
  if (row <= HEADER_ROW) return;
  const lastCol = sheet.getLastColumn(); // tô đến cột cuối của sheet
  const color = getRowColorForStatus_(status);
  const rangeToColor = sheet.getRange(row, 1, 1, lastCol);
  rangeToColor.setBackground(color); // null = trả về mặc định
}

/** Trigger: khi đổi dropdown ở cột L sẽ tô/ bỏ tô cả hàng */
function onEdit(e) {
  try {
    const sheet = e.range.getSheet();
    if (sheet.getSheetId() == null) return; // phòng trường hợp e rỗng
    const row = e.range.getRow();
    const col = e.range.getColumn();
    if (row <= HEADER_ROW) return;
    if (col !== STATUS_COL) return; // chỉ xử lý khi sửa cột L

    // Lấy giá trị sau khi chỉnh sửa
    const status = String(e.range.getValue()).trim();
    applyRowColor_(sheet, row, status);
  } catch (err) {
    Logger.log('onEdit error: ' + err);
  }
}

/** Hàm tiện ích: tô lại tất cả hàng đang có dựa theo cột L (chạy thủ công nếu cần) */
function recolorAllRows_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= HEADER_ROW) return;
  const statuses = sheet.getRange(2, STATUS_COL, lastRow - 1, 1).getValues();
  for (let i = 0; i < statuses.length; i++) {
    const rowIndex = i + 2;
    applyRowColor_(sheet, rowIndex, statuses[i][0]);
  }
}

/** Các hàm khác giữ nguyên */

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
      'manufacturing': 'Gia công - Cơ khí'
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
