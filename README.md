# คู่มือการเชื่อมต่อระบบฟอร์ม "ขอให้เจ้าหน้าที่ มสธ. ติดต่อกลับ" กับ Google Sheets ผ่าน Google Apps Script

เอกสารนี้อธิบายสถาปัตยกรรมความปลอดภัยและขั้นตอนการตั้งค่า Google Sheets และ Google Apps Script Web App เพื่อบันทึกข้อมูลผู้สนใจเรียน มหาวิทยาลัยสุโขทัยธรรมาธิราช (มสธ.) จากเว็บแอปพลิเคชัน

---

## 1. สถาปัตยกรรมความปลอดภัย (Security & Privacy Architecture)

- **ความปลอดภัยระดับสูงสุด (Server-Side Proxy)**: เว็บเบราว์เซอร์ของฝั่งไคลเอนต์ (Client/Frontend) จะ**ไม่เขียนข้อมูลลง Google Sheets โดยตรง**
- **ไม่มี Secrets หลุดใน Frontend**: ไม่มี API Key, OAuth Token หรือ URL ของ Apps Script อยู่ในโค้ดฝั่งหน้าเว็บ
- **Server Endpoint (`POST /api/leads`)**: มี Server ทำหน้าที่เป็นตัวกลางในการตรวจสอบความถูกต้อง (Validation) และกรองข้อมูลอันตราย (Input Sanitization) ก่อนส่งต่อไปยัง Google Sheets
- **การสร้าง Lead ID อัตโนมัติ**: สร้างรหัสผู้สนใจแบบสุ่มไม่ซ้ำกัน (เช่น `STOU-2026-X8K9L-A1B2`)
- **การคุ้มครองข้อมูลส่วนบุคคล (PDPA Compliant)**: ห้ามบันทึกข้อมูลส่วนบุคคล (PII) เช่น ชื่อ เบอร์โทรศัพท์ อีเมล หรือ LINE ID ลงในบันทึก Console, Analytics หรือ Error Tracker

---

## 2. โครงสร้างคอลัมน์ใน Google Sheets

เมื่อมีผู้ส่งข้อมูล ระบบจะบันทึกข้อมูลทั้งหมด 13 ฟิลด์ลงในแถวใหม่ของ Google Sheets:

| ลำดับ | ชื่อคอลัมน์ (Header) | คำอธิบาย | ตัวอย่างข้อมูล |
|:---:|:---|:---|:---|
| 1 | `lead_id` | รหัสอ้างอิงผู้สนใจแบบไม่ซ้ำ | `STOU-2026-LM49K-8F21` |
| 2 | `created_at` | วัน-เวลาที่บันทึกข้อมูล (ISO Format) | `2026-08-27T04:45:00.000Z` |
| 3 | `event_name` | ชื่องาน / บูธนิทรรศการ | `มสธ. นิทรรศการแนะแนวการศึกษา 2026` |
| 4 | `source_qr` | ที่มา / จุดสแกน QR Code | `booth-kiosk` หรือ `flyer-hall1` |
| 5 | `full_name` | ชื่อ - นามสกุล | `สมชาย ใจดี` |
| 6 | `contact_type` | ประเภทช่องทางติดต่อ | `phone` / `line` / `email` |
| 7 | `contact_value` | ข้อมูลสำหรับติดต่อกลับ | `081-234-5678` หรือ `@line_id` |
| 8 | `quiz_recommendations` | สรุปผลหลักสูตร 3 อันดับแรกจากแบบทดสอบ | `1. วิทยาการจัดการ (95%) \| 2. นิติศาสตร์ (88%)` |
| 9 | `interest_topics` | สาขาวิชาที่สนใจและวุฒิการศึกษาเดิม | `สาขาที่สนใจ: [วิทยาการจัดการ], วุฒิเดิม: ม.6` |
| 10 | `contact_request` | คำถามเพิ่มเติม / ช่วงเวลาที่สะดวก | `สนใจค่าใช้จ่ายตลอดหลักสูตร สะดวกบ่าย` |
| 11 | `consent_info` | ความยินยอมให้เจ้าหน้าที่ติดต่อกลับ | `TRUE` |
| 12 | `consent_news` | ความยินยอมรับข้อมูลข่าวสาร | `TRUE` / `FALSE` |
| 13 | `privacy_version` | เวอร์ชันนโยบายความเป็นส่วนตัว | `v1.0-2026` |

---

## 3. ขั้นตอนการติดตั้ง Google Apps Script บน Google Sheets

### ขั้นตอนที่ 1: สร้าง Google Sheets
1. ไปที่ [Google Sheets](https://sheets.new) และสร้าง Spreadsheet ใหม่
2. ตั้งชื่อไฟล์ เช่น `STOU-Leads-Exhibition-2026`
3. ตั้งชื่อแผ่นงาน (Sheet Tab) แผ่นแรกว่า `Leads`

### ขั้นตอนที่ 2: เปิด Apps Script Editor
1. ใน Google Sheets เมนูด้านบน คลิกที่ **ส่วนขยาย (Extensions)** > **Apps Script**
2. ลบโค้ดเดิมทั้งหมดในไฟล์ `Code.gs` แล้วคัดลอกโค้ดด้านล่างนี้ไปวาง:

```javascript
/**
 * STOU Lead Capture Backend API for Google Sheets
 * Web App Endpoint สำหรับรับข้อมูลจาก Server-Side /api/leads
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // รอล็อคสูงสุด 30 วินาทีเพื่อป้องกันการเขียนชนกันเมื่อมีผู้ส่งพร้อมกันหลายคน
  lock.tryLock(30000);

  try {
    var rawData = e.postData ? e.postData.contents : null;
    if (!rawData) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No data payload received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(rawData);
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("Leads") || doc.getActiveSheet();

    // สร้าง Header อัตโนมัติในแถวแรก หากชีตยังว่างอยู่
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "lead_id",
        "created_at",
        "event_name",
        "source_qr",
        "full_name",
        "contact_type",
        "contact_value",
        "quiz_recommendations",
        "interest_topics",
        "contact_request",
        "consent_info",
        "consent_news",
        "privacy_version"
      ]);
      // จัดรูปแบบ Header
      var headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setBackground("#0F2942");
      headerRange.setFontColor("#FBBF24");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // เพิ่มแถวข้อมูลผู้สนใจ
    sheet.appendRow([
      data.lead_id || "",
      data.created_at || new Date().toISOString(),
      data.event_name || "STOU Event 2026",
      data.source_qr || "direct",
      data.full_name || "",
      data.contact_type || "phone",
      data.contact_value || "",
      data.quiz_recommendations || "",
      data.interest_topics || "",
      data.contact_request || "",
      data.consent_info === true ? "TRUE" : "FALSE",
      data.consent_news === true ? "TRUE" : "FALSE",
      data.privacy_version || "v1.0-2026"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      lead_id: data.lead_id
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    service: "STOU Lead Capture API",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
```

### ขั้นตอนที่ 3: เผยแพร่เว็บแอปพลิเคชัน (Deploy as Web App)
1. ในหน้าต่าง Apps Script คลิกปุ่มสีน้ำเงิน **การทำให้ใช้งานได้ (Deploy)** > **การทำให้ใช้งานได้ใหม่ (New deployment)**
2. คลิกไอคอนรูปเฟือง ⚙️ ด้านซ้าย เลือกประเภท **เว็บแอป (Web app)**
3. กำหนดค่าดังนี้:
   - **คำอธิบาย (Description)**: `STOU Lead Production API`
   - **เรียกใช้ในฐานะ (Execute as)**: `ฉัน (Me / บัญชี Google ของคุณ)`
   - **ผู้ที่มีสิทธิ์เข้าถึง (Who has access)**: `ทุกคน (Anyone)` *(จำเป็นเพื่อให้ Server สามารถส่งข้อมูลได้)*
4. คลิก **ทำให้ใช้งานได้ (Deploy)**
5. อนุญาตสิทธิ์การเข้าถึง (Authorize access) ให้กับบัญชี Google ของท่าน
6. คัดลอก **URL ของเว็บแอป (Web App URL)** ที่ได้ ซึ่งจะมีรูปแบบดังนี้:
   `https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec`

---

## 4. วิธีกำหนดค่า Environment Variable `LEAD_API_URL`

### 1. กำหนดค่าในไฟล์ `.env` (สำหรับการพัฒนาและรันเซิร์ฟเวอร์)
สร้างหรือเปิดไฟล์ `.env` ที่ root ของโปรเจกต์ แล้วเพิ่มค่าตัวแปร:

```env
LEAD_API_URL="https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec"
```

### 2. กำหนดค่าผ่าน AI Studio / Cloud Run Environment Settings
- เปิดเมนู **Settings / Secrets**
- เพิ่มตัวแปรชื่อ `LEAD_API_URL` พร้อมระบุ Web App Exec URL ที่ได้จากขั้นตอนที่ 3

---

## 5. การทดสอบและข้อความแนะนำผู้ใช้กรณีบันทึกไม่สำเร็จ

1. **โหมดพรีวิว (เมื่อยังไม่ใส่ URL)**:
   - หากยังไม่ได้กำหนดค่า `LEAD_API_URL` ระบบเซิร์ฟเวอร์จะทำงานในโหมด Preview/Demo Mode และตอบรับด้วยรหัสผู้สนใจจำลอง ทำให้ทดสอบการทำงานของหน้าเว็บได้โดยระบบไม่ล่ม
2. **กรณีเกิดข้อผิดพลาดในการบันทึก**:
   - หน้าจอจะแสดงกล่องแจ้งเตือนสีแดงพร้อมข้อความ:
     > *"บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่ประจำบูธ มสธ."*
   - พร้อมแสดงปุ่มด่วนสำหรับโทรติดต่อ STOU Call Center (0 2504 7788) และ LINE Official Account (@stoucallcenter) ทันที
3. **หลังส่งข้อมูลสำเร็จ**:
   - ข้อมูลในฟอร์มของเบราว์เซอร์จะถูกล้างค่า (Clear Form State) ทันที เพื่อป้องกันข้อมูลส่วนตัวของผู้ใช้ตกค้างบนอุปกรณ์สาธารณะหรืออุปกรณ์ของผู้เข้าชมงาน
