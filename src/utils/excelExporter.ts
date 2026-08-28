import * as XLSX from 'xlsx';
import { AnonymousQuizSessionPayload } from '../types';
import { QUIZ_QUESTIONS } from '../data/questions';

export interface ReportMetadata {
  title: string;
  agency: string;
  dateRangeText: string;
  generatedAtText: string;
  appVersion: string;
  quizVersion: string;
  dataSource: string;
  privacyDisclaimer: string;
}

export interface AggregatedStats {
  views: number;
  started: number;
  completed: number;
  restarted: number;
  detailClicks: number;
  lampangContactClicks: number;
  lampangMapClicks: number;
  lampangPhone8686: number;
  lampangPhone8684: number;
  lampangPhone8687: number;
  completionRate: number;
  detailCtr: number;
  contactIntentRate: number;
  personaCounts: {
    career: number;
    degree: number;
    upskill: number;
  };
  interestCounts: Record<string, number>;
  topSchools: { name: string; count: number; clickCount: number }[];
  topPrograms: {
    schoolName: string;
    programName: string;
    majorName: string;
    recommendationCount: number;
    detailClickCount: number;
  }[];
  dailyTrends: {
    date: string;
    views: number;
    started: number;
    completed: number;
    completionRate: number;
    detailClicks: number;
    contactClicks: number;
    mapClicks: number;
  }[];
  funnelStages: {
    stage: string;
    stageLabel: string;
    count: number;
    pctOfStarted: number;
  }[];
  questionBreakdown: {
    questionId: number;
    questionTitle: string;
    optionId: string;
    optionLabel: string;
    count: number;
    pctOfCompleted: number;
  }[];
}

const formatMin5 = (num: number): string | number => {
  if (num === 0) return 0;
  if (num < 5) return '< 5';
  return num;
};

/**
 * Builds the 8 standardized Excel sheets according to specification.
 */
export function generateExcelWorkbook(
  meta: ReportMetadata,
  stats: AggregatedStats,
  rawSessionsCount: number
): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  const commonHeader = (sheetName: string) => [
    [meta.title],
    [meta.agency],
    [`รายงาน: ${sheetName}`],
    [`ช่วงวันที่ข้อมูล: ${meta.dateRangeText} | วันที่และเวลาที่สร้าง: ${meta.generatedAtText}`],
    [`เวอร์ชันแบบทดสอบ: ${meta.quizVersion} (แอป v${meta.appVersion}) | แหล่งข้อมูล: ${meta.dataSource}`],
    [`หมายเหตุความเป็นส่วนตัว: ${meta.privacyDisclaimer}`],
    [],
  ];

  // 1. 01_Executive_Summary
  const sheet1Data = [
    ...commonHeader('01_Executive_Summary (สรุปภาพรวมผู้บริหาร)'),
    ['ตัวชี้วัดสำคัญ (Executive KPI Metrics)', 'จำนวน (ครั้ง/คน)', 'อัตราส่วน (%)', 'คำอธิบาย'],
    ['ผู้เข้าชมหน้าแรก (quiz_viewed)', stats.views, '-', 'จำนวนการเข้าชมหน้าแรก'],
    ['ผู้เริ่มทำแบบทดสอบ (quiz_started)', stats.started, '-', 'จำนวนผู้กดปุ่มเริ่มทำแบบทดสอบ'],
    ['ผู้ทำแบบทดสอบครบถ้วน (quiz_completed)', stats.completed, '-', 'จำนวนผู้ตอบคำถามครบทั้ง 6 ข้อ'],
    ['อัตราการทำจนจบ (completion_rate)', '-', `${stats.completionRate.toFixed(1)}%`, 'สัดส่วน quiz_completed / quiz_started'],
    ['การเริ่มทำใหม่ (quiz_restarted)', stats.restarted, '-', 'จำนวนการกดเริ่มทำใหม่'],
    ['คลิกดูรายละเอียดหลักสูตร (result_detail_clicked)', stats.detailClicks, '-', 'จำนวนครั้งที่คลิกดูข้อมูลหลักสูตรต่อ'],
    ['อัตราการคลิกดูหลักสูตร (detail_click_through_rate)', '-', `${stats.detailCtr.toFixed(1)}%`, 'สัดส่วน detail_clicked / quiz_completed'],
    ['คลิกติดต่อ ศวช. มสธ. ลำปาง (lampang_contact_clicked)', stats.lampangContactClicks, '-', 'จำนวนครั้งที่คลิกโทรติดต่อ ศวช. ลำปาง'],
    ['คลิกดูแผนที่ตั้ง ศวช. ลำปาง (lampang_map_clicked)', stats.lampangMapClicks, '-', 'จำนวนครั้งที่คลิกเปิด Google Maps'],
    ['อัตราความสนใจติดต่อศูนย์ (contact_intent_rate)', '-', `${stats.contactIntentRate.toFixed(1)}%`, 'สัดส่วนผู้คลิกติดต่อหรือแผนที่ต่อ completed'],
    [],
    ['สัดส่วนกลุ่มเป้าหมาย (Persona Distribution)', 'จำนวน (คน)', 'ร้อยละ (%)', 'กลุ่มคำอธิบาย'],
    [
      'นักพัฒนาความก้าวหน้าในอาชีพ (Career Pathway)',
      formatMin5(stats.personaCounts.career),
      stats.completed > 0 ? `${((stats.personaCounts.career / stats.completed) * 100).toFixed(1)}%` : '0.0%',
      'กลุ่มคนทำงานที่ต้องการต่อยอดวิชาชีพ / บัณฑิตศึกษา',
    ],
    [
      'นักสร้างโอกาสใหม่ (Degree Pathway)',
      formatMin5(stats.personaCounts.degree),
      stats.completed > 0 ? `${((stats.personaCounts.degree / stats.completed) * 100).toFixed(1)}%` : '0.0%',
      'กลุ่มต้องการวุฒิปริญญาตรีใบแรก / เทียบโอน',
    ],
    [
      'นัก Upskill / Reskill (Upskill Pathway)',
      formatMin5(stats.personaCounts.upskill),
      stats.completed > 0 ? `${((stats.personaCounts.upskill / stats.completed) * 100).toFixed(1)}%` : '0.0%',
      'กลุ่มเรียนรายชุดวิชา สัมฤทธิบัตร / เรียนรู้ตามอัธยาศัย',
    ],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  XLSX.utils.book_append_sheet(wb, ws1, '01_Executive_Summary');

  // 2. 02_Daily_Trend
  const sheet2Data = [
    ...commonHeader('02_Daily_Trend (แนวโน้มสถิติรายวัน)'),
    [
      'วันที่ (Date)',
      'ผู้เข้าชม (quiz_viewed)',
      'ผู้เริ่มทำ (quiz_started)',
      'ผู้ทำจบ (quiz_completed)',
      'อัตราการทำจบ (%)',
      'คลิกดูหลักสูตร (detail_clicks)',
      'คลิกโทรติดต่อ (contact_clicks)',
      'คลิกแผนที่ (map_clicks)',
    ],
    ...(stats.dailyTrends.length > 0
      ? stats.dailyTrends.map((d) => [
          d.date,
          d.views,
          d.started,
          d.completed,
          `${d.completionRate.toFixed(1)}%`,
          d.detailClicks,
          d.contactClicks,
          d.mapClicks,
        ])
      : [['ยังไม่มีข้อมูลในช่วงเวลาที่เลือก', '-', '-', '-', '-', '-', '-', '-']]),
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
  XLSX.utils.book_append_sheet(wb, ws2, '02_Daily_Trend');

  // 3. 03_Funnel
  const sheet3Data = [
    ...commonHeader('03_Funnel (ขั้นตอนการมีส่วนร่วมและการตอบคำถาม)'),
    ['ขั้นตอน (Stage Key)', 'ชื่อขั้นตอน (Stage Label)', 'จำนวนผู้ใช้ (Count)', 'ร้อยละเทียบกับผู้เริ่มทำ (%)'],
    ...stats.funnelStages.map((f) => [
      f.stage,
      f.stageLabel,
      formatMin5(f.count),
      `${f.pctOfStarted.toFixed(1)}%`,
    ]),
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(sheet3Data);
  XLSX.utils.book_append_sheet(wb, ws3, '03_Funnel');

  // 4. 04_Question_Answers
  const sheet4Data = [
    ...commonHeader('04_Question_Answers (สถิติการตอบคำถามข้อ 1-6)'),
    ['ข้อที่ (Question No.)', 'หัวข้อคำถาม', 'รหัสตัวเลือก (Answer Key)', 'ข้อความตัวเลือก (Answer Label TH)', 'จำนวนที่เลือก (Count)', 'สัดส่วนต่อผู้ตอบจบ (%)'],
    ...(stats.questionBreakdown.length > 0
      ? stats.questionBreakdown.map((q) => [
          q.questionId,
          q.questionTitle,
          q.optionId,
          q.optionLabel,
          formatMin5(q.count),
          `${q.pctOfCompleted.toFixed(1)}%`,
        ])
      : [['-', 'ยังไม่มีข้อมูลในช่วงเวลาที่เลือก', '-', '-', '-', '-']]),
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(sheet4Data);
  XLSX.utils.book_append_sheet(wb, ws4, '04_Question_Answers');

  // 5. 05_Persona
  const sheet5Data = [
    ...commonHeader('05_Persona (กลุ่มผลลัพธ์และเส้นทางการเรียนรู้)'),
    ['รหัสกลุ่ม (Persona Key)', 'ชื่อกลุ่มผลลัพธ์ (Persona Label TH)', 'จำนวนผู้รับคำแนะนำ (Count)', 'สัดส่วน (%)'],
    [
      'career',
      'นักพัฒนาความก้าวหน้าในอาชีพ (ปริญญาโท-เอก / ปริญญาตรีสำหรับคนทำงาน)',
      formatMin5(stats.personaCounts.career),
      stats.completed > 0 ? `${((stats.personaCounts.career / stats.completed) * 100).toFixed(1)}%` : '0.0%',
    ],
    [
      'degree',
      'นักสร้างโอกาสใหม่ (ปริญญาตรีใบแรก / เทียบโอน)',
      formatMin5(stats.personaCounts.degree),
      stats.completed > 0 ? `${((stats.personaCounts.degree / stats.completed) * 100).toFixed(1)}%` : '0.0%',
    ],
    [
      'upskill',
      'นัก Upskill / Reskill (สัมฤทธิบัตร / เรียนรู้รายชุดวิชา)',
      formatMin5(stats.personaCounts.upskill),
      stats.completed > 0 ? `${((stats.personaCounts.upskill / stats.completed) * 100).toFixed(1)}%` : '0.0%',
    ],
  ];
  const ws5 = XLSX.utils.aoa_to_sheet(sheet5Data);
  XLSX.utils.book_append_sheet(wb, ws5, '05_Persona');

  // 6. 06_Recommended_Programs
  const sheet6Data = [
    ...commonHeader('06_Recommended_Programs (สถิติหลักสูตรที่ได้รับการแนะนำและคลิกดูต่อ)'),
    [
      'ประเภทการจัดอันดับ (Ranking Type)',
      'สาขาวิชา / คณะ (School Name)',
      'ชื่อหลักสูตร (Program Name)',
      'วิชาเอก / แขนง (Track / Major)',
      'จำนวนครั้งที่แนะนำ (Recommendation Count)',
      'สัดส่วนต่อผู้ตอบจบ (%)',
      'จำนวนคลิกดูรายละเอียด (Detail Clicks)',
      'อัตราคลิกดูต่อ (Recommendation-to-Detail CTR)',
    ],
    ...(stats.topPrograms.length > 0
      ? stats.topPrograms.map((p) => {
          const recPct = stats.completed > 0 ? `${((p.recommendationCount / stats.completed) * 100).toFixed(1)}%` : '0.0%';
          const ctr = p.recommendationCount > 0 ? `${((p.detailClickCount / p.recommendationCount) * 100).toFixed(1)}%` : '0.0%';
          return [
            p.majorName ? 'track_or_major' : 'program',
            p.schoolName,
            p.programName,
            p.majorName || '-',
            formatMin5(p.recommendationCount),
            recPct,
            formatMin5(p.detailClickCount),
            ctr,
          ];
        })
      : [['-', '-', 'ยังไม่มีข้อมูลในช่วงเวลาที่เลือก', '-', '-', '-', '-', '-']]),
  ];
  const ws6 = XLSX.utils.aoa_to_sheet(sheet6Data);
  XLSX.utils.book_append_sheet(wb, ws6, '06_Recommended_Programs');

  // 7. 07_Contact_Lampang
  const sheet7Data = [
    ...commonHeader('07_Contact_Lampang (สถิติความสนใจติดต่อ ศวช. มสธ. ลำปาง)'),
    ['ประเภทการติดต่อ (Contact Type)', 'รายละเอียด / หมายเลข', 'จำนวนครั้งที่คลิก (Count)', 'สัดส่วนต่อผู้ตอบจบ (%)'],
    [
      'phone_8686',
      'โทร 02-504-8686 (เบอร์หลัก ศวช. ลำปาง)',
      formatMin5(stats.lampangPhone8686),
      stats.completed > 0 ? `${((stats.lampangPhone8686 / stats.completed) * 100).toFixed(1)}%` : '0.0%',
    ],
    [
      'phone_8684',
      'โทร 02-504-8684 (สายรอง 1)',
      formatMin5(stats.lampangPhone8684),
      stats.completed > 0 ? `${((stats.lampangPhone8684 / stats.completed) * 100).toFixed(1)}%` : '0.0%',
    ],
    [
      'phone_8687',
      'โทร 02-504-8687 (สายรอง 2)',
      formatMin5(stats.lampangPhone8687),
      stats.completed > 0 ? `${((stats.lampangPhone8687 / stats.completed) * 100).toFixed(1)}%` : '0.0%',
    ],
    [
      'map',
      'คลิกดูแผนที่ตั้ง Google Maps ศวช. มสธ. ลำปาง',
      formatMin5(stats.lampangMapClicks),
      stats.completed > 0 ? `${((stats.lampangMapClicks / stats.completed) * 100).toFixed(1)}%` : '0.0%',
    ],
  ];
  const ws7 = XLSX.utils.aoa_to_sheet(sheet7Data);
  XLSX.utils.book_append_sheet(wb, ws7, '07_Contact_Lampang');

  // 8. 08_Definitions
  const sheet8Data = [
    ...commonHeader('08_Definitions (คำนิยาม สูตรคำนวณ และขอบเขตข้อมูล)'),
    ['ชื่อตัวชี้วัด (Metric Name)', 'คำนิยาม (Definition)', 'สูตรคำนวณ (Formula)', 'แหล่งข้อมูล (Data Source)', 'หมายเหตุ (Notes)'],
    ['quiz_viewed', 'จำนวนครั้งที่มีการเปิดหน้าแรกของแอปพลิเคชัน', 'นับรวมทุกครั้งที่เข้าสู่หน้าแรก', 'Analytics Event', 'ใช้วัดการเข้าถึงแคมเปญ'],
    ['quiz_started', 'จำนวนผู้ที่กดปุ่มเริ่มต้นค้นหาเส้นทาง', 'นับเมื่อเริ่มข้อที่ 1', 'Analytics Event', 'แสดงความสนใจเริ่มต้น'],
    ['quiz_completed', 'จำนวนผู้ที่ตอบคำถามครบทั้ง 6 ข้อและได้ผลลัพธ์', 'นับเมื่อแสดงหน้าผลลัพธ์', 'Firestore / Analytics', 'เป็นตัวเลขฐานสำหรับการคำนวณ Persona'],
    ['completion_rate', 'อัตราส่วนผู้ตอบจบเทียบกับผู้เริ่มทำ', '(quiz_completed / quiz_started) * 100', 'Calculated', 'ชี้วัดความง่ายและน่าติดตามของแบบทดสอบ'],
    ['result_detail_clicked', 'จำนวนการคลิกเพื่อดูรายละเอียดหลักสูตร', 'นับเมื่อผู้ใช้กดดูหลักสูตร', 'Analytics Event', 'แสดง Intent การศึกษาต่อ'],
    ['detail_click_through_rate', 'อัตราการคลิกดูหลักสูตรต่อผู้ตอบจบ', '(result_detail_clicked / quiz_completed) * 100', 'Calculated', 'ชี้วัดความสนใจเชิงลึก'],
    ['contact_intent_rate', 'อัตราความตั้งใจติดต่อศูนย์วิทยบริการฯ ลำปาง', '((contact_clicks + map_clicks) / quiz_completed) * 100', 'Calculated', 'ชี้วัดผลลัพธ์ต่อการแนะแนวเชิงพื้นที่'],
    ['กฎการรักษาความเป็นส่วนตัว', 'หลีกเลี่ยงการระบุตัวตนโดยอ้อม', 'หากยอด < 5 แสดงเป็น < 5', 'Aggregated Privacy Rule', 'ไม่มีการเก็บชื่อ นามสกุล หรือ IP'],
  ];
  const ws8 = XLSX.utils.aoa_to_sheet(sheet8Data);
  XLSX.utils.book_append_sheet(wb, ws8, '08_Definitions');

  return wb;
}
