/**
 * STOU Configuration URLs
 * ศูนย์รวม URL ระบบและหลักสูตร มสธ. ที่ถูกต้องและเปิดใช้งานได้จริง
 */

// 1. ลิงก์ดูข้อมูลหลักสูตรปริญญาตรี มสธ.
export const BACHELOR_URL = 'https://www.stou.ac.th/main/curriculums.html';

// 2. ลิงก์ดูข้อมูลหลักสูตรบัณฑิตศึกษา (ปริญญาโท-เอก) มสธ.
export const GRADUATE_CURRICULUM_URL = 'https://www.stou.ac.th/main/curriculums2.html';

// 3. ลิงก์สมัครระดับบัณฑิตศึกษา มสธ.
export const GRADUATE_URL = 'https://ogs.stou.ac.th/apply-graduate/';

// 4. ลิงก์ดูข้อมูลโครงการสัมฤทธิบัตร มสธ. (เรียนรายชุดวิชา / สะสมหน่วยกิต)
export const SUMRIT_URL = 'https://www.stou.ac.th/study/sumrit/Learn/LEARN.asp';

// 5. ลิงก์ระบบรับสมัครนักศึกษาใหม่ออนไลน์ มสธ.
export const STOU_ADMISSION_URL = 'http://cs.stou.ac.th/enroll/';

// 6. ลิงก์เว็บไซต์หลักและระบบรับสมัคร มหาวิทยาลัยสุโขทัยธรรมาธิราช
export const STOU_WEBSITE_URL = 'https://apply.stou.ac.th/';
export const STOU_APPLY_URL = 'https://apply.stou.ac.th/';

// 7. ลิงก์แบบฟอร์มขอคำปรึกษา
export const LEAD_FORM_URL = '/advisory';

// 8. ข้อมูลติดต่อ มสธ. Call Center
export const STOU_CALL_CENTER = '0 2504 7788';
export const STOU_CALL_CENTER_HOURS = 'จันทร์ - ศุกร์ 08.00 - 19.30 น. | เสาร์ - อาทิตย์ และวันหยุดนักขัตฤกษ์ 08.30 - 16.30 น.';

// 9. ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง (ศวช. มสธ. ลำปาง)
export const lampangCenter = {
  name: 'ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง',
  shortName: 'ศวช. มสธ. ลำปาง',
  address: 'หมู่ 2 ตำบลปงยางคก อำเภอห้างฉัตร จังหวัดลำปาง 52190',
  serviceHours: {
    weekdays: 'วันจันทร์–วันศุกร์ เวลา 08.30–16.30 น.',
    holidays: 'ปิดวันเสาร์–อาทิตย์ และวันหยุดนักขัตฤกษ์',
  },
  phones: [
    { number: '02-504-8686', raw: '025048686', key: '8686' as const, isDefault: true },
    { number: '02-504-8684', raw: '025048684', key: '8684' as const },
    { number: '02-504-8687', raw: '025048687', key: '8687' as const },
  ],
  mapUrl: 'REPLACE_WITH_VERIFIED_GOOGLE_MAPS_URL',
};

