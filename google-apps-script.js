// Google Apps Script cho xử lý form đăng ký thành viên BK-AUTO
// URL deploy: https://script.google.com/macros/s/AKfycbzVo_MrsdBY8L3WT3ySnntSMvFLZa-KeX52kV20V31AoZx-n8qihTesAQ9gF_RC1aopew/exec

function doGet(e) {
  try {
    const params = e.parameter;
    
    // Lấy thông tin từ form
    const data = {
      timestamp: params.timestamp || new Date().toLocaleString(),
      fullName: params.fullName || '',
      identifier: params.identifier || '', // MSSV hoặc tên trường
      majorClass: params.majorClass || '', // Ngành/lớp hoặc ngành
      email: params.email || '',
      phone: params.phone || '',
      studentType: params.studentType || '', // 'hust' hoặc 'external'
      mainDepartment: params.mainDepartment || '',
      subDepartments: params.subDepartments || '[]',
      cvLink: params.cvLink || '',
      resendApiKey: params.resendApiKey || ''
    };
    
    // Lưu vào Google Sheets
    const result = saveToSheet(data);
    
    if (result.success) {
      // Gửi email xác nhận cho ứng viên
      sendConfirmationEmail(data.email, data.fullName, data.resendApiKey);
      
      // Gửi email thông báo cho trưởng mảng
      sendNotificationToManager(data.mainDepartment, data, data.resendApiKey);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: 'Application submitted successfully'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error(result.error);
    }
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveToSheet(data) {
  try {
    // Thay đổi SHEET_ID bằng ID Google Sheet của bạn
    const SHEET_ID = 'YOUR_SHEET_ID_HERE';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Kiểm tra header row (nếu chưa có thì tạo)
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Họ tên', 'MSSV/Trường', 'Ngành/Lớp', 'Email', 'SĐT', 
        'Loại SV', 'Mảng chính', 'Mảng phụ', 'CV Link', 'Trạng thái'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Thêm dữ liệu mới
    const rowData = [
      data.timestamp,
      data.fullName,
      data.identifier,
      data.majorClass,
      data.email,
      data.phone,
      data.studentType === 'hust' ? 'Sinh viên HUST' : 'Sinh viên ngoài HUST',
      getDepartmentName(data.mainDepartment),
      formatSubDepartments(data.subDepartments),
      data.cvLink,
      'Đã nộp đơn'
    ];
    
    sheet.appendRow(rowData);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function sendConfirmationEmail(email, fullName, apiKey) {
  try {
    const subject = 'Xác nhận đăng ký tuyển thành viên CLB BK-AUTO';
    const body = `
Xin chào ${fullName},

Cảm ơn bạn đã đăng ký tham gia CLB BK-AUTO!

Chúng tôi đã nhận được đơn đăng ký của bạn và sẽ xem xét trong thời gian sớm nhất.

📅 Timeline tiếp theo:
- Phỏng vấn: 05/10/2025
- Tuần thử thách: 09/10/2025

📧 Thông tin chi tiết sẽ được gửi qua email này, vui lòng kiểm tra email thường xuyên.

📞 Nếu có thắc mắc, liên hệ:
- Email: bkauto.ste@gmail.com
- Phone: 0332611486 (Chu Tiến Đạt - Chủ nhiệm)
- Fanpage: https://www.facebook.com/BKAUTO.STE

Trân trọng,
CLB BK-AUTO
    `;
    
    sendEmailViaResend(email, subject, body, apiKey);
  } catch (error) {
    Logger.log('Error sending confirmation email: ' + error.toString());
  }
}

function sendNotificationToManager(department, applicantData, apiKey) {
  try {
    const managerEmails = getManagerEmails();
    const managerEmail = managerEmails[department];
    
    if (!managerEmail) {
      Logger.log('No manager email found for department: ' + department);
      return;
    }
    
    const subject = `Đơn đăng ký mới - Mảng ${getDepartmentName(department)}`;
    const body = `
Có ứng viên mới đăng ký vào mảng ${getDepartmentName(department)}:

👤 Thông tin ứng viên:
- Họ tên: ${applicantData.fullName}
- ${applicantData.studentType === 'hust' ? 'MSSV' : 'Trường'}: ${applicantData.identifier}
- ${applicantData.studentType === 'hust' ? 'Ngành/Lớp' : 'Ngành'}: ${applicantData.majorClass}
- Email: ${applicantData.email}
- SĐT: ${applicantData.phone}
- Mảng phụ: ${formatSubDepartments(applicantData.subDepartments)}
- CV: ${applicantData.cvLink}
- Thời gian nộp: ${applicantData.timestamp}

Vui lòng kiểm tra Google Sheets để xem chi tiết và chuẩn bị cho vòng phỏng vấn.

CLB BK-AUTO
    `;
    
    sendEmailViaResend(managerEmail, subject, body, apiKey);
  } catch (error) {
    Logger.log('Error sending manager notification: ' + error.toString());
  }
}

function sendEmailViaResend(to, subject, body, apiKey) {
  try {
    const url = 'https://api.resend.com/emails';
    const payload = {
      from: 'BK-AUTO Club <noreply@bkauto.vn>', // Thay đổi domain phù hợp
      to: [to],
      subject: subject,
      text: body
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    Logger.log('Email sent response: ' + response.getContentText());
  } catch (error) {
    Logger.log('Error sending email via Resend: ' + error.toString());
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

function getManagerEmails() {
  // Thay đổi email addresses của các trưởng mảng
  return {
    'ai': 'EMAIL_TRUONG_MANG_AI@example.com',
    'electrical': 'EMAIL_TRUONG_MANG_DIEN@example.com', 
    'simulation': 'EMAIL_TRUONG_MANG_MO_PHONG@example.com',
    'experiment': 'EMAIL_TRUONG_MANG_THI_NGHIEM@example.com'
  };
}