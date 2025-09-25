/**
 * Example configuration for Google Apps Script
 * Copy this and replace the CONFIG object in your Apps Script
 */

const CONFIG = {
  // Replace with your actual Google Sheets ID
  // Get this from: https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
  SPREADSHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  
  // Replace with your actual Google Drive Folder ID
  // Get this from: https://drive.google.com/drive/folders/YOUR_FOLDER_ID
  DRIVE_FOLDER_ID: '1DriveFolder123abc456def789',
  
  // Add your website domains here
  ALLOWED_ORIGINS: [
    'http://localhost:5173',                    // Local development
    'http://localhost:3000',                    // Alternative local port
    'https://bk-auto-website.netlify.app',      // Netlify deployment
    'https://bk-auto.github.io',                // GitHub Pages
    'https://your-custom-domain.com'            // Your custom domain
  ]
};

// Test data for debugging
const TEST_FORM_DATA = {
  timestamp: new Date().toLocaleString('vi-VN'),
  fullName: 'Nguyễn Văn Test',
  identifier: '20210001',
  majorClass: 'Kỹ thuật Ô tô - TE1-01',
  email: 'test@sis.hust.edu.vn',
  phone: '0123456789',
  studentType: 'hust',
  mainDepartment: 'ai',
  subDepartments: '["electrical","simulation"]',
  questions: 'Đây là câu hỏi test',
  cvFileName: 'CV_Test.pdf',
  cvFileSize: '1024',
  cvFileType: 'application/pdf'
};

/**
 * Function to test your configuration
 * Run this in Apps Script to verify everything works
 */
function testConfiguration() {
  console.log('Testing configuration...');
  
  try {
    // Test 1: Check Spreadsheet access
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    console.log('✓ Spreadsheet accessible:', spreadsheet.getName());
    console.log('  Sheet name:', sheet.getName());
    console.log('  Current rows:', sheet.getLastRow());
    
    // Test 2: Check Drive Folder access
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    console.log('✓ Drive folder accessible:', folder.getName());
    console.log('  Folder URL:', folder.getUrl());
    
    // Test 3: Test saving data (without file)
    const fileInfo = { fileName: 'TEST_FILE.pdf', fileUrl: 'https://test.url', fileSizeKB: 100 };
    const rowData = saveToSheet(TEST_FORM_DATA, fileInfo);
    console.log('✓ Test data saved to sheet');
    console.log('  Row data length:', rowData.length);
    
    console.log('\n🎉 All tests passed! Your configuration is correct.');
    return true;
    
  } catch (error) {
    console.error('❌ Configuration test failed:', error.toString());
    console.error('Please check your SPREADSHEET_ID and DRIVE_FOLDER_ID');
    return false;
  }
}

/**
 * Function to initialize your spreadsheet with proper headers
 * Run this once after setting up your spreadsheet
 */
function initializeSpreadsheet() {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getActiveSheet();
    
    // Clear existing content
    sheet.clear();
    
    // Set headers
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
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#e8f0fe');
    headerRange.setBorder(true, true, true, true, true, true);
    
    // Set column widths
    sheet.setColumnWidth(1, 120); // Thời gian
    sheet.setColumnWidth(2, 150); // Họ tên
    sheet.setColumnWidth(3, 120); // MSSV
    sheet.setColumnWidth(4, 180); // Ngành/Lớp
    sheet.setColumnWidth(5, 200); // Email
    sheet.setColumnWidth(6, 120); // SĐT
    sheet.setColumnWidth(7, 120); // Loại SV
    sheet.setColumnWidth(8, 120); // Mảng chính
    sheet.setColumnWidth(9, 150); // Mảng phụ
    sheet.setColumnWidth(10, 200); // Tên file
    sheet.setColumnWidth(11, 300); // Link file
    sheet.setColumnWidth(12, 80);  // Size
    sheet.setColumnWidth(13, 250); // Câu hỏi
    
    console.log('✓ Spreadsheet initialized successfully!');
    console.log('  Headers added and formatted');
    console.log('  Column widths set');
    
  } catch (error) {
    console.error('❌ Failed to initialize spreadsheet:', error.toString());
  }
}

/**
 * Get deployment URL for your reference
 */
function getDeploymentInfo() {
  console.log('=== DEPLOYMENT INFORMATION ===');
  console.log('After deploying your web app, you will get a URL like:');
  console.log('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec');
  console.log('');
  console.log('Use this URL in your frontend MemberRecruitment.vue file');
  console.log('');
  console.log('Current configuration:');
  console.log('- Spreadsheet ID:', CONFIG.SPREADSHEET_ID);
  console.log('- Drive Folder ID:', CONFIG.DRIVE_FOLDER_ID);
  console.log('- Allowed Origins:', CONFIG.ALLOWED_ORIGINS.length, 'domains');
}