/**
 * BK-AUTO Member Recruitment Form Handler
 * Google Apps Script for handling form submissions with file uploads
 * Updated with status column, conditional formatting, and proper timezone handling
 */

// Configuration - REPLACE THESE WITH YOUR ACTUAL IDs
const CONFIG = {
  SPREADSHEET_ID: '18vMVlHdUa99i76GHNY-f-Y38tzr9ZK-RvGA9cMwPbbU',
  DRIVE_FOLDER_ID: 'YOUR_DRIVE_FOLDER_ID_HERE',
  ALLOWED_ORIGINS: [
    'http://localhost:5173',
    'https://your-domain.com',
    'https://your-website.netlify.app'
  ]
};

// Timezone and formatting constants
const TZ = 'Asia/Ho_Chi_Minh';
const HEADER_ROW = 1;
const STATUS_COL = 13; // Cột M (13) for status
const COLOR_APPROVED = '#d9ead3'; // Duyệt
const COLOR_REJECTED = '#f4c7c3'; // Loại
// Không màu cho "Đã nộp đơn"

/**
 * Main function to handle POST requests (for file uploads)
 */
function doPost(e) {
  try {
    // Handle CORS
    const origin = e.parameter.origin;
    if (CONFIG.ALLOWED_ORIGINS.includes(origin)) {
      // CORS headers will be set at the end
    }

    console.log('Received POST request');
    
    // Parse JSON data from request body
    let requestData;
    try {
      requestData = JSON.parse(e.postData.contents);
    } catch (error) {
      console.log('Failed to parse JSON, trying parameter approach');
      requestData = e.parameter;
    }
    
    console.log('Request data received');
    
    // Extract form data with proper timezone handling
    const formData = {
      timestampDate: normalizeToHCMDate(requestData.timestamp),
      fullName: (requestData.fullName || '').trim(),
      identifier: (requestData.identifier || '').trim(),
      majorClass: (requestData.majorClass || '').trim(),
      email: (requestData.email || '').trim(),
      phone: normalizePhone(requestData.phone),
      studentType: (requestData.studentType || '').trim(),
      mainDepartment: (requestData.mainDepartment || '').trim(),
      subDepartments: requestData.subDepartments || '[]',
      questions: (requestData.questions || '').trim(),
      cvFileName: requestData.cvFileName || '',
      cvFileSize: requestData.cvFileSize || '0',
      cvFileType: requestData.cvFileType || ''
    };
    
    console.log('Form data extracted:', formData.fullName, formData.email);
    
    // Handle file upload
    let fileInfo = {
      fileName: '',
      fileUrl: '',
      fileSizeKB: 0
    };
    
    // Handle base64 file data from JSON
    if (requestData.cvFile && requestData.cvFile.startsWith('data:')) {
      console.log('Processing base64 file upload...');
      fileInfo = handleBase64FileUpload(requestData.cvFile, formData);
      console.log('File processed:', fileInfo.fileName);
    }
    
    // Save to Google Sheets with status column
    const result = saveToSheetWithStatus(formData, fileInfo);
    if (!result.success) throw new Error(result.error);
    
    console.log('Data saved to sheet successfully');
    
    // Return success response
    const response = {
      status: 'success',
      message: 'Đơn đăng ký đã được gửi thành công!',
      timestamp: formData.timestampDate,
      fileName: fileInfo.fileName,
      fileUrl: fileInfo.fileUrl
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: 'Có lỗi xảy ra khi xử lý đơn: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for backward compatibility)
 */
function doGet(e) {
  try {
    console.log('Received GET request');
    const params = e.parameter;
    
    const formData = {
      timestampDate: normalizeToHCMDate(params.timestamp),
      fullName: (params.fullName || '').trim(),
      identifier: (params.identifier || '').trim(),
      majorClass: (params.majorClass || '').trim(),
      email: (params.email || '').trim(),
      phone: normalizePhone(params.phone),
      studentType: (params.studentType || '').trim(),
      mainDepartment: (params.mainDepartment || '').trim(),
      subDepartments: params.subDepartments || '[]',
      questions: (params.questions || '').trim(),
      cvFileName: params.cvFileName || '',
      cvFileSize: params.cvFileSize || '0',
      cvFileType: params.cvFileType || ''
    };
    
    // Handle base64 file data from GET request
    let fileInfo = { fileName: '', fileUrl: '', fileSizeKB: 0 };
    
    if (params.cvFile && params.cvFile.startsWith('data:')) {
      console.log('Processing base64 file from GET request...');
      fileInfo = handleBase64FileUpload(params.cvFile, formData);
      console.log('Base64 file processed:', fileInfo.fileName);
    }
    
    // Save to sheet with status
    const result = saveToSheetWithStatus(formData, fileInfo);
    if (!result.success) throw new Error(result.error);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Đơn đăng ký đã được gửi thành công!',
        timestamp: formData.timestampDate,
        fileName: fileInfo.fileName,
        fileUrl: fileInfo.fileUrl
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: 'Có lỗi xảy ra: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Normalize timestamp to Ho Chi Minh timezone
 */
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
  return d;
}

/**
 * Normalize phone number: keep digits and +, remove spaces/special chars
 */
function normalizePhone(phoneRaw) {
  const s = (phoneRaw == null) ? '' : String(phoneRaw);
  const trimmed = s.trim();
  if (trimmed === '') return '';
  const kept = trimmed.replace(/[^\d+]/g, '');
  return kept.replace(/(?!^)\+/g, '');
}

/**
 * Handle base64 file upload
 */
function handleBase64FileUpload(base64Data, formData) {
  try {
    // Parse base64 data URL
    const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 data format');
    }
    
    const mimeType = matches[1];
    const base64Content = matches[2];
    
    // Generate unique file name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const cleanName = formData.fullName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const extension = getFileExtensionFromMimeType(mimeType);
    const fileName = `CV_${cleanName}_${timestamp}${extension}`;
    
    // Convert base64 to blob
    const decodedData = Utilities.base64Decode(base64Content);
    const blob = Utilities.newBlob(decodedData, mimeType, fileName);
    
    // Get or create folder
    let folder;
    try {
      folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    } catch (error) {
      console.log('Folder not found, using root folder');
      folder = DriveApp.getRootFolder();
    }
    
    // Create file in Drive
    const file = folder.createFile(blob);
    
    // Set file permissions
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileUrl = file.getUrl();
    const fileSizeKB = Math.round(file.getSize() / 1024);
    
    console.log(`Base64 file uploaded: ${fileName}, Size: ${fileSizeKB}KB`);
    
    return {
      fileName: fileName,
      fileUrl: fileUrl,
      fileSizeKB: fileSizeKB
    };
    
  } catch (error) {
    console.error('Error uploading base64 file:', error);
    throw new Error('Không thể upload file: ' + error.toString());
  }
}

/**
 * Get file extension from MIME type
 */
function getFileExtensionFromMimeType(mimeType) {
  const extensions = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt'
  };
  return extensions[mimeType] || '.pdf';
}

/**
 * Save form data to Google Sheets with status column and formatting
 */
function saveToSheetWithStatus(formData, fileInfo) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    ensureSpreadsheetTimezone_(ss, TZ);
    const sheet = ss.getActiveSheet();

    // Create headers and set column formats
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Họ tên', 'MSSV/Trường', 'Ngành/Lớp', 'Email', 'SĐT',
        'Loại SV', 'Mảng chính', 'Mảng phụ', 'Tên file CV', 'Link file CV', 
        'Kích thước file (KB)', 'Câu hỏi/Thắc mắc', 'Trạng thái'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      ensureSheetFormats_(sheet);
    } else {
      ensureSheetFormats_(sheet);
    }

    // Prepare data
    const phoneForSheet = formData.phone ? ("'" + formData.phone) : "";
    const questionsForSheet = formData.questions ? formData.questions.substring(0, 1000) : "";
    const statusText = 'Đã nộp đơn'; // Default status
    
    const rowData = [
      formData.timestampDate,
      formData.fullName,
      formData.identifier,
      formData.majorClass,
      formData.email,
      phoneForSheet,
      formData.studentType === 'hust' ? 'Sinh viên HUST' : 'Sinh viên ngoài HUST',
      getDepartmentName(formData.mainDepartment),
      formatSubDepartments(formData.subDepartments),
      fileInfo.fileName,
      fileInfo.fileUrl,
      fileInfo.fileSizeKB,
      questionsForSheet,
      statusText
    ];

    // Write data
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Set up status dropdown for new row
    setupStatusDropdownForRow_(sheet, nextRow);
    
    // Apply color formatting for new row
    applyRowColor_(sheet, nextRow, statusText);

    return { success: true };
  } catch (error) {
    console.error('Error saving to sheet:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Ensure sheet column formats
 */
function ensureSheetFormats_(sheet) {
  try {
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sheet.getRange('C:C').setNumberFormat('@'); // MSSV/Trường
    sheet.getRange('E:E').setNumberFormat('@'); // Email
    sheet.getRange('F:F').setNumberFormat('@'); // Phone
    sheet.getRange('H:H').setNumberFormat('@'); // Main department
    sheet.getRange('I:I').setNumberFormat('@'); // Sub departments
    sheet.getRange('J:J').setNumberFormat('@'); // File name
    sheet.getRange('K:K').setNumberFormat('@'); // File URL
    sheet.getRange('M:M').setNumberFormat('@').setWrap(true); // Questions
    
    setupStatusDropdown_(sheet);
  } catch (e) {
    console.log('ensureSheetFormats_ error: ' + e);
  }
}

/**
 * Set up status dropdown for specific row
 */
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
    console.log('setupStatusDropdownForRow_ error: ' + error.toString());
  }
}

/**
 * Set up status dropdown for entire column
 */
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
    
    console.log('Status dropdown setup completed for column', STATUS_COL);
  } catch (error) {
    console.log('setupStatusDropdown_ error: ' + error.toString());
  }
}

/**
 * Get row color based on status
 */
function getRowColorForStatus_(status) {
  const s = String(status || '').trim();
  if (s === 'Duyệt') return COLOR_APPROVED;
  if (s === 'Loại') return COLOR_REJECTED;
  return null; // Default color for "Đã nộp đơn"
}

/**
 * Apply row color based on status
 */
function applyRowColor_(sheet, row, status) {
  if (row <= HEADER_ROW) return;
  const lastCol = sheet.getLastColumn();
  const color = getRowColorForStatus_(status);
  const rangeToColor = sheet.getRange(row, 1, 1, lastCol);
  rangeToColor.setBackground(color);
}

/**
 * On edit trigger for status changes
 */
function onEdit(e) {
  try {
    const sheet = e.range.getSheet();
    if (sheet.getSheetId() == null) return;
    const row = e.range.getRow();
    const col = e.range.getColumn();
    if (row <= HEADER_ROW) return;
    if (col !== STATUS_COL) return;

    const status = String(e.range.getValue()).trim();
    applyRowColor_(sheet, row, status);
  } catch (err) {
    console.log('onEdit error: ' + err);
  }
}

/**
 * Utility function to recolor all rows (run manually if needed)
 */
function recolorAllRows_() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= HEADER_ROW) return;
  const statuses = sheet.getRange(2, STATUS_COL, lastRow - 1, 1).getValues();
  for (let i = 0; i < statuses.length; i++) {
    const rowIndex = i + 2;
    applyRowColor_(sheet, rowIndex, statuses[i][0]);
  }
}

/**
 * Ensure spreadsheet timezone
 */
function ensureSpreadsheetTimezone_(ss, tz) {
  try {
    if (ss.getSpreadsheetTimeZone() !== tz) {
      ss.setSpreadsheetTimeZone(tz);
    }
  } catch (e) {
    console.log('Timezone ensure skipped: ' + e);
  }
}

/**
 * Get department display name
 */
function getDepartmentName(code) {
  const departments = {
    'ai': 'AI for Automobile',
    'electrical': 'Điện - Điện tử',
    'simulation': 'Mô phỏng',
    'experiment': 'Thí nghiệm'
  };
  return departments[code] || code;
}

/**
 * Format sub-departments from JSON
 */
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

/**
 * Handle OPTIONS requests for CORS
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * Test function - run this to check if everything is set up correctly
 */
function testSetup() {
  try {
    console.log('Testing setup...');
    
    // Test spreadsheet access
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    console.log('✓ Spreadsheet accessible:', sheet.getName());
    
    // Test folder access
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    console.log('✓ Drive folder accessible:', folder.getName());
    
    console.log('✓ Setup test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('✗ Setup test failed:', error);
    return false;
  }
}

/**
 * Main function to handle POST requests (for file uploads)
 */
function doPost(e) {
  try {
    console.log('Received POST request');
    
    // Parse JSON data from request body (sent as text/plain)
    let requestData;
    try {
      requestData = JSON.parse(e.postData.contents);
      console.log('Successfully parsed JSON data');
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      // Fallback to parameter-based approach
      requestData = e.parameter;
    }
    
    // Extract form data
    const formData = {
      timestamp: requestData.timestamp || new Date().toLocaleString('vi-VN'),
      fullName: requestData.fullName || '',
      identifier: requestData.identifier || '',
      majorClass: requestData.majorClass || '',
      email: requestData.email || '',
      phone: requestData.phone || '',
      studentType: requestData.studentType || '',
                                        mainDepartment: requestData.mainDepartment || '',
      subDepartments: Array.isArray(requestData.subDepartments) ? 
        JSON.stringify(requestData.subDepartments) : requestData.subDepartments || '[]',
      questions: requestData.questions || '',
      cvFileName: requestData.cvFileName || '',
      cvFileSize: requestData.cvFileSize?.toString() || '0',
      cvFileType: requestData.cvFileType || ''
    };
    
    console.log('Form data extracted:', formData.fullName, formData.email);
    
    // Handle base64 file upload
    let fileInfo = {
      fileName: '',
      fileUrl: '',
      fileSizeKB: 0
    };
    
    if (requestData.cvFile && requestData.cvFile.startsWith('data:')) {
      console.log('Processing base64 file upload...');
      fileInfo = handleBase64FileUpload(requestData.cvFile, formData);
      console.log('File processed:', fileInfo.fileName);
    }
    
    // Save to Google Sheets
    const rowData = saveToSheet(formData, fileInfo);
    console.log('Data saved to sheet, row:', rowData.length);
    
    // Return success response
    const response = {
      status: 'success',
      message: 'Đơn đăng ký đã được gửi thành công!',
      timestamp: formData.timestamp,
      fileName: fileInfo.fileName,
      fileUrl: fileInfo.fileUrl
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: 'Có lỗi xảy ra khi xử lý đơn: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for backward compatibility and CORS avoidance)
 */
function doGet(e) {
  try {
    console.log('Received GET request');
    const params = e.parameter;
    
    const formData = {
      timestamp: params.timestamp || new Date().toLocaleString('vi-VN'),
      fullName: params.fullName || '',
      identifier: params.identifier || '',
      majorClass: params.majorClass || '',
      email: params.email || '',
      phone: params.phone || '',
      studentType: params.studentType || '',
      mainDepartment: params.mainDepartment || '',
      subDepartments: params.subDepartments || '[]',
      questions: params.questions || '',
      cvFileName: params.cvFileName || '',
      cvFileSize: params.cvFileSize || '0',
      cvFileType: params.cvFileType || ''
    };
    
    // Handle base64 file data from GET request
    let fileInfo = { fileName: '', fileUrl: '', fileSizeKB: 0 };
    
    if (params.cvFile && params.cvFile.startsWith('data:')) {
      console.log('Processing base64 file from GET request...');
      fileInfo = handleBase64FileUpload(params.cvFile, formData);
      console.log('Base64 file processed:', fileInfo.fileName);
    }
    
    // Save to sheet
    saveToSheet(formData, fileInfo);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Đơn đăng ký đã được gửi thành công!',
        timestamp: formData.timestamp,
        fileName: fileInfo.fileName,
        fileUrl: fileInfo.fileUrl
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    console.error('Error in doGet:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: 'Có lỗi xảy ra: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle base64 file upload to Google Drive
 */
function handleBase64FileUpload(base64Data, formData) {
  try {
    // Extract file info from base64 data
    const dataUrlPattern = /^data:([^;]+);base64,(.+)$/;
    const matches = base64Data.match(dataUrlPattern);
    
    if (!matches) {
      throw new Error('Invalid base64 data format');
    }
    
    const mimeType = matches[1];
    const base64Content = matches[2];
    
    // Generate unique file name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const cleanName = formData.fullName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const fileExtension = getFileExtensionFromMimeType(mimeType);
    const fileName = `CV_${cleanName}_${timestamp}${fileExtension}`;
    
    // Convert base64 to blob
    const fileBlob = Utilities.newBlob(
      Utilities.base64Decode(base64Content), 
      mimeType, 
      fileName
    );
    
    // Get or create folder
    let folder;
    try {
      folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    } catch (error) {
      console.log('Folder not found, using root folder');
      folder = DriveApp.getRootFolder();
    }
    
    // Create file in Drive
    const file = folder.createFile(fileBlob);
    
    // Set file permissions (anyone with link can view)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileUrl = file.getUrl();
    const fileSizeKB = Math.round(file.getSize() / 1024);
    
    console.log(`Base64 file uploaded: ${fileName}, Size: ${fileSizeKB}KB`);
    
    return {
      fileName: fileName,
      fileUrl: fileUrl,
      fileSizeKB: fileSizeKB
    };
    
  } catch (error) {
    console.error('Error uploading base64 file:', error);
    throw new Error('Không thể upload file: ' + error.toString());
  }
}

/**
 * Get file extension from MIME type
 */
function getFileExtensionFromMimeType(mimeType) {
  const mimeToExt = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt'
  };
  
  return mimeToExt[mimeType] || '.bin';
}

/**
 * Handle file upload to Google Drive (for FormData uploads)
 */
function handleFileUpload(fileBlob, formData) {
  try {
    // Generate unique file name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const cleanName = formData.fullName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const fileName = `CV_${cleanName}_${timestamp}_${formData.cvFileName}`;
    
    // Get or create folder
    let folder;
    try {
      folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    } catch (error) {
      console.log('Folder not found, using root folder');
      folder = DriveApp.getRootFolder();
    }
    
    // Create file in Drive
    const file = folder.createFile(fileBlob.setName(fileName));
    
    // Set file permissions (anyone with link can view)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileUrl = file.getUrl();
    const fileSizeKB = Math.round(file.getSize() / 1024);
    
    console.log(`File uploaded: ${fileName}, Size: ${fileSizeKB}KB`);
    
    return {
      fileName: fileName,
      fileUrl: fileUrl,
      fileSizeKB: fileSizeKB
    };
    
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Không thể upload file: ' + error.toString());
  }
}

/**
 * Save form data to Google Sheets
 */
function saveToSheet(formData, fileInfo) {
  try {
    // Open spreadsheet
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getActiveSheet();
    
    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Thời gian',
        'Họ và tên',
        'MSSV/Trường',
        'Ngành/Lớp',
        'Email',
        'Số điện thoại',
        'Loại sinh viên',
        'Mảng chính',
        'Mảng phụ',
        'Tên file CV',
        'Link file CV',
        'Kích thước file (KB)',
        'Câu hỏi/Ghi chú'
      ];
      sheet.appendRow(headers);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#e8f0fe');
    }
    
    // Prepare row data
    const rowData = [
      formData.timestamp,
      formData.fullName,
      formData.identifier,
      formData.majorClass,
      formData.email,
      formData.phone,
      formData.studentType === 'hust' ? 'Sinh viên HUST' : 'Sinh viên ngoài HUST',
      formData.mainDepartment,
      formData.subDepartments,
      fileInfo.fileName,
      fileInfo.fileUrl,
      fileInfo.fileSizeKB,
      formData.questions
    ];
    
    // Append data to sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, rowData.length);
    
    console.log('Data saved to sheet successfully');
    return rowData;
    
  } catch (error) {
    console.error('Error saving to sheet:', error);
    throw new Error('Không thể lưu dữ liệu: ' + error.toString());
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * Test function - run this to check if everything is set up correctly
 */
function testSetup() {
  try {
    console.log('Testing setup...');
    
    // Test spreadsheet access
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    console.log('✓ Spreadsheet accessible:', sheet.getName());
    
    // Test folder access
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    console.log('✓ Drive folder accessible:', folder.getName());
    
    console.log('✓ Setup test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('✗ Setup test failed:', error);
    return false;
  }
}