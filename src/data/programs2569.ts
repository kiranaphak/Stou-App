/**
 * ฐานข้อมูลหลักสูตรและเส้นทางระดับปริญญาตรี มสธ. ปีการศึกษา 2569
 * ครอบคลุม 11 สาขาวิชา ตามโครงสร้างมาตรฐาน มสธ.
 */

import { BACHELOR_URL } from './config';

export interface Program2569MajorTrack {
  id: string;
  name: string;
  type: 'major' | 'track' | 'single';
  trackName?: string;
  tags: string[];
  description?: string;
}

export interface Program2569Item {
  programId: string;
  schoolCode: string;
  schoolName: string;
  programName: string;
  degreeName: string;
  englishSchoolName: string;
  tags: string[];
  majorsAndTracks: Program2569MajorTrack[];
  detailUrl: string;
  iconName: string;
}

// URL พื้นฐานสำหรับรายละเอียดหลักสูตร ปีการศึกษา 2569
export const STOU_PROGRAM_URL_BASE = BACHELOR_URL;

export const PROGRAMS_2569: Program2569Item[] = [
  // 1) สาขาวิชาศิลปศาสตร์
  {
    programId: 'libarts-ba',
    schoolCode: 'school_liberal_arts',
    schoolName: 'สาขาวิชาศิลปศาสตร์',
    englishSchoolName: 'School of Liberal Arts',
    programName: 'หลักสูตรศิลปศาสตรบัณฑิต',
    degreeName: 'ศศ.บ.',
    tags: ['ภาษาและการสื่อสาร', 'สื่อและการเล่าเรื่อง', 'สังคมและวัฒนธรรม', 'ข้อมูลและสารสนเทศ', 'communication', 'language_comm', 'people'],
    iconName: 'Languages',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'libarts-info-sci',
        name: 'สารสนเทศศาสตร์',
        type: 'major',
        tags: ['ข้อมูลและสารสนเทศ', 'เทคโนโลยี', 'การจัดการข้อมูล', 'communication', 'technology'],
        description: 'การจัดการสารสนเทศ ดาต้า และแหล่งเรียนรู้ดิจิทัล',
      },
      {
        id: 'libarts-english',
        name: 'ภาษาอังกฤษ',
        type: 'major',
        tags: ['ภาษาและการสื่อสาร', 'การสื่อสารสากล', 'ภาษาอังกฤษ', 'communication', 'language_comm'],
        description: 'ภาษาอังกฤษเพื่อการสื่อสารระดับมืออาชีพและการทำงานสากล',
      },
      {
        id: 'libarts-thai-studies',
        name: 'ไทยคดีศึกษา',
        type: 'major',
        tags: ['สังคมและวัฒนธรรม', 'สื่อและการเล่าเรื่อง', 'วัฒนธรรมไทย', 'people', 'community'],
        description: 'มรดกทางวัฒนธรรม ประวัติศาสตร์ และสังคมไทยร่วมสมัย',
      },
    ],
  },

  // 2) สาขาวิชานิเทศศาสตร์
  {
    programId: 'commarts-bca',
    schoolCode: 'school_comm_arts',
    schoolName: 'สาขาวิชานิเทศศาสตร์',
    englishSchoolName: 'School of Communication Arts',
    programName: 'หลักสูตรนิเทศศาสตรบัณฑิต',
    degreeName: 'นศ.บ.',
    tags: ['สื่อและการสื่อสาร', 'ภาษาและการสื่อสาร', 'ดิจิทัลและเทคโนโลยี', 'การตลาดและแบรนด์', 'communication', 'digital_portfolio', 'technology'],
    iconName: 'Megaphone',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'commarts-digital-comm',
        name: 'การสื่อสารดิจิทัล',
        type: 'track',
        tags: ['สื่อและการสื่อสาร', 'ดิจิทัลและเทคโนโลยี', 'การตลาดและแบรนด์', 'communication', 'digital_portfolio'],
        description: 'การสร้างสรรค์คอนเทนต์ การสื่อสารดิจิทัล และกลยุทธ์สื่อข้ามแพลตฟอร์ม',
      },
    ],
  },

  // 3) สาขาวิชาศึกษาศาสตร์
  {
    programId: 'edu-ba',
    schoolCode: 'school_education',
    schoolName: 'สาขาวิชาศึกษาศาสตร์',
    englishSchoolName: 'School of Educational Studies',
    programName: 'หลักสูตรศิลปศาสตรบัณฑิต',
    degreeName: 'ศศ.บ.',
    tags: ['การศึกษาและพัฒนาคน', 'การดูแลผู้คน', 'ชุมชนและสังคม', 'สื่อการเรียนรู้', 'people', 'community', 'education_dev'],
    iconName: 'GraduationCap',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'edu-early-childhood',
        name: 'วิชาเอกการพัฒนาเด็กปฐมวัย',
        type: 'major',
        tags: ['การดูแลผู้คน', 'การศึกษาและพัฒนาคน', 'ครอบครัว', 'people'],
        description: 'การส่งเสริมพัฒนาการและการเรียนรู้ของเด็กปฐมวัยอย่างรอบด้าน',
      },
      {
        id: 'edu-guidance-counseling',
        name: 'วิชาเอกการแนะแนวและการปรึกษาเชิงจิตวิทยา',
        type: 'major',
        tags: ['การดูแลผู้คน', 'จิตวิทยา', 'การพัฒนาคน', 'people'],
        description: 'ทักษะการให้คำปรึกษาเชิงจิตวิทยาและการแนะแนวชีวิตและการเรียน',
      },
      {
        id: 'edu-tech-comm',
        name: 'วิชาเอกเทคโนโลยีและสื่อสารการศึกษา',
        type: 'major',
        tags: ['สื่อการเรียนรู้', 'ดิจิทัลและเทคโนโลยี', 'นวัตกรรมการเรียนรู้', 'technology', 'communication'],
        description: 'การออกแบบสื่อนวัตกรรมการศึกษาและแพลตฟอร์มการเรียนรู้',
      },
      {
        id: 'edu-lifelong-learning',
        name: 'วิชาเอกการส่งเสริมการเรียนรู้ตลอดชีวิต',
        type: 'major',
        tags: ['ชุมชนและสังคม', 'การศึกษาและพัฒนาคน', 'การพัฒนาชุมชน', 'people', 'community'],
        description: 'การจัดการเรียนรู้เพื่อชุมชน องค์กร และผู้เรียนทุกช่วงวัย',
      },
    ],
  },

  // 4) สาขาวิชาวิทยาการจัดการ (4 หลักสูตร)
  {
    programId: 'mgmt-bba',
    schoolCode: 'school_management',
    schoolName: 'สาขาวิชาวิทยาการจัดการ',
    englishSchoolName: 'School of Management Science',
    programName: 'หลักสูตรบริหารธุรกิจบัณฑิต',
    degreeName: 'บธ.บ.',
    tags: ['ธุรกิจและการจัดการ', 'ตัวเลขและการวางแผน', 'การเงินและบัญชี', 'การตลาด', 'การท่องเที่ยว', 'business', 'career_growth'],
    iconName: 'Briefcase',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'mgmt-management',
        name: 'วิชาเอกการจัดการ',
        type: 'major',
        tags: ['ธุรกิจและการจัดการ', 'การบริหารคน', 'การวางแผน', 'business'],
        description: 'การบริหารจัดการองค์กร กลยุทธ์ธุรกิจ และภาวะผู้นำ',
      },
      {
        id: 'mgmt-finance',
        name: 'วิชาเอกการเงิน',
        type: 'major',
        tags: ['ตัวเลขและการวางแผน', 'การเงินและบัญชี', 'การลงทุน', 'business'],
        description: 'การบริหารการเงิน การวิเคราะห์การลงทุน และตลาดการเงิน',
      },
      {
        id: 'mgmt-marketing',
        name: 'วิชาเอกการตลาด',
        type: 'major',
        tags: ['การตลาด', 'ธุรกิจและการจัดการ', 'การสร้างแบรนด์', 'business', 'communication'],
        description: 'กลยุทธ์การตลาดสมัยใหม่ การสร้างแบรนด์ และการตลาดดิจิทัล',
      },
      {
        id: 'mgmt-tourism',
        name: 'วิชาเอกการจัดการการท่องเที่ยว',
        type: 'major',
        tags: ['การท่องเที่ยว', 'ธุรกิจและการจัดการ', 'การบริการ', 'business'],
        description: 'การบริหารธุรกิจท่องเที่ยว การบริการ และการพัฒนาแหล่งท่องเที่ยว',
      },
    ],
  },
  {
    programId: 'mgmt-bpa',
    schoolCode: 'school_management',
    schoolName: 'สาขาวิชาวิทยาการจัดการ',
    englishSchoolName: 'School of Management Science',
    programName: 'หลักสูตรรัฐประศาสนศาสตรบัณฑิต',
    degreeName: 'รป.บ.',
    tags: ['ภาครัฐและการจัดการเมือง', 'การบริหารคน', 'ธุรกิจและการจัดการ', 'นโยบาย', 'law_society', 'business'],
    iconName: 'Building2',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'mgmt-hrm',
        name: 'วิชาเอกการบริหารทรัพยากรมนุษย์',
        type: 'major',
        tags: ['การบริหารคน', 'การพัฒนาคน', 'องค์กร', 'business', 'people'],
        description: 'การสรรหา พัฒนา และบริหารศักยภาพทุนมนุษย์ในองค์กร',
      },
      {
        id: 'mgmt-local-admin',
        name: 'วิชาเอกการบริหารท้องถิ่นและการจัดการเมือง',
        type: 'major',
        tags: ['ภาครัฐและการจัดการเมือง', 'ชุมชนและสังคม', 'นโยบาย', 'law_society', 'community'],
        description: 'การบริหารราชการส่วนท้องถิ่นและการพัฒนาเมืองน่าอยู่',
      },
      {
        id: 'mgmt-public-private',
        name: 'วิชาเอกการจัดการภาครัฐและเอกชน',
        type: 'major',
        tags: ['ธุรกิจและการจัดการ', 'ภาครัฐและการจัดการเมือง', 'การบริหาร', 'business', 'law_society'],
        description: 'การเชื่อมโยงนโยบายสาธารณะและการบริหารธุรกิจเอกชน',
      },
    ],
  },
  {
    programId: 'mgmt-bacc',
    schoolCode: 'school_management',
    schoolName: 'สาขาวิชาวิทยาการจัดการ',
    englishSchoolName: 'School of Management Science',
    programName: 'หลักสูตรบัญชีบัณฑิต',
    degreeName: 'บช.บ.',
    tags: ['การเงินและบัญชี', 'ตัวเลขและการวางแผน', 'ธุรกิจและการจัดการ', 'business'],
    iconName: 'Calculator',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'mgmt-accounting',
        name: 'บัญชีบัณฑิต',
        type: 'single',
        tags: ['การเงินและบัญชี', 'ตัวเลขและการวางแผน', 'การตรวจสอบบัญชี', 'business'],
        description: 'มาตรฐานการบัญชี การตรวจสอบ และการวางแผนภาษีอากร',
      },
    ],
  },
  {
    programId: 'mgmt-btech-construction',
    schoolCode: 'school_management',
    schoolName: 'สาขาวิชาวิทยาการจัดการ',
    englishSchoolName: 'School of Management Science',
    programName: 'หลักสูตรเทคโนโลยีบัณฑิต',
    degreeName: 'ทล.บ.',
    tags: ['งานก่อสร้าง', 'ธุรกิจและการจัดการ', 'การวางแผน', 'business'],
    iconName: 'HardHat',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'mgmt-construction-mgmt',
        name: 'วิชาเอกการจัดการงานก่อสร้าง (ต่อเนื่อง)',
        type: 'major',
        tags: ['งานก่อสร้าง', 'การวางแผน', 'วิศวกรรมการจัดการ', 'business'],
        description: 'การบริหารโครงการก่อสร้าง การควบคุมต้นทุน และความปลอดภัย',
      },
    ],
  },

  // 5) สาขาวิชานิติศาสตร์
  {
    programId: 'law-llb',
    schoolCode: 'school_law',
    schoolName: 'สาขาวิชานิติศาสตร์',
    englishSchoolName: 'School of Law',
    programName: 'หลักสูตรนิติศาสตรบัณฑิต',
    degreeName: 'น.บ.',
    tags: ['กฎหมายและสังคม', 'สิทธิและความยุติธรรม', 'นโยบายและการบริหารภาครัฐ', 'law_society', 'job_security'],
    iconName: 'Scale',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'law-single',
        name: 'นิติศาสตรบัณฑิต',
        type: 'single',
        tags: ['กฎหมายและสังคม', 'สิทธิและความยุติธรรม', 'นโยบาย', 'law_society'],
        description: 'องค์ความรู้กฎหมายแพ่ง อาญา ธุรกิจ และกระบวนการยุติธรรม',
      },
    ],
  },

  // 6) สาขาวิชาวิทยาศาสตร์สุขภาพ
  {
    programId: 'health-bph',
    schoolCode: 'school_health',
    schoolName: 'สาขาวิชาวิทยาศาสตร์สุขภาพ',
    englishSchoolName: 'School of Health Science',
    programName: 'หลักสูตรสาธารณสุขศาสตรบัณฑิต',
    degreeName: 'ส.บ.',
    tags: ['สุขภาพและคุณภาพชีวิต', 'การดูแลผู้คน', 'ชุมชนและสังคม', 'health', 'people', 'community'],
    iconName: 'HeartPulse',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'health-community-health',
        name: 'วิชาเอกสาธารณสุขชุมชน',
        type: 'major',
        tags: ['สุขภาพและคุณภาพชีวิต', 'ชุมชนและสังคม', 'การดูแลผู้คน', 'health', 'community'],
        description: 'การสร้างเสริมสุขภาพชุมชน การควบคุมป้องกันโรค และสุขาภิบาล',
      },
    ],
  },
  {
    programId: 'health-bsc-occ',
    schoolCode: 'school_health',
    schoolName: 'สาขาวิชาวิทยาศาสตร์สุขภาพ',
    englishSchoolName: 'School of Health Science',
    programName: 'หลักสูตรวิทยาศาสตรบัณฑิต',
    degreeName: 'วท.บ.',
    tags: ['ความปลอดภัยในการทำงาน', 'สุขภาพและคุณภาพชีวิต', 'การดูแลผู้คน', 'health', 'job_security'],
    iconName: 'ShieldAlert',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'health-occ-safety',
        name: 'วิชาเอกอาชีวอนามัยและความปลอดภัย',
        type: 'major',
        tags: ['ความปลอดภัยในการทำงาน', 'สุขภาพและคุณภาพชีวิต', 'จป.วิชาชีพ', 'health'],
        description: 'มาตรฐานความปลอดภัย สุขอนามัยในสถานประกอบการ และ จป.วิชาชีพ',
      },
    ],
  },

  // 7) สาขาวิชาเศรษฐศาสตร์
  {
    programId: 'econ-becon',
    schoolCode: 'school_economics',
    schoolName: 'สาขาวิชาเศรษฐศาสตร์',
    englishSchoolName: 'School of Economics',
    programName: 'หลักสูตรเศรษฐศาสตรบัณฑิต',
    degreeName: 'ศ.บ.',
    tags: ['ธุรกิจและการจัดการ', 'ตัวเลขและการวางแผน', 'เศรษฐกิจและนโยบาย', 'การวิเคราะห์ข้อมูล', 'business'],
    iconName: 'TrendingUp',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'econ-general',
        name: 'วิชาเอกเศรษฐศาสตร์',
        type: 'major',
        tags: ['เศรษฐกิจและนโยบาย', 'ตัวเลขและการวางแผน', 'business'],
        description: 'การวิเคราะห์ภาพรวมเศรษฐกิจ นโยบายการเงินและการคลัง',
      },
      {
        id: 'econ-business',
        name: 'วิชาเอกเศรษฐศาสตร์ธุรกิจ',
        type: 'major',
        tags: ['ธุรกิจและการจัดการ', 'การวิเคราะห์ข้อมูล', 'การวางแผน', 'business'],
        description: 'การประยุกต์หลักเศรษฐศาสตร์เพื่อการตัดสินใจและแข่งขันทางธุรกิจ',
      },
    ],
  },

  // 8) สาขาวิชามนุษยนิเวศศาสตร์
  {
    programId: 'human-bsc-food',
    schoolCode: 'school_human_ecology',
    schoolName: 'สาขาวิชามนุษยนิเวศศาสตร์',
    englishSchoolName: 'School of Human Ecology',
    programName: 'หลักสูตรวิทยาศาสตรบัณฑิต',
    degreeName: 'วท.บ.',
    tags: ['สุขภาพและคุณภาพชีวิต', 'อาหารและโภชนาการ', 'health', 'community'],
    iconName: 'Utensils',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'human-food-nutrition',
        name: 'วิชาเอกอาหาร โภชนาการ และการประยุกต์',
        type: 'major',
        tags: ['อาหารและโภชนาการ', 'สุขภาพและคุณภาพชีวิต', 'health'],
        description: 'โภชนาการเพื่อสุขภาพ นวัตกรรมอาหาร และธุรกิจบริการอาหาร',
      },
    ],
  },
  {
    programId: 'human-ba-dev',
    schoolCode: 'school_human_ecology',
    schoolName: 'สาขาวิชามนุษยนิเวศศาสตร์',
    englishSchoolName: 'School of Human Ecology',
    programName: 'หลักสูตรศิลปศาสตรบัณฑิต',
    degreeName: 'ศศ.บ.',
    tags: ['ครอบครัวและการพัฒนาคน', 'ชุมชนและสังคม', 'สุขภาพและคุณภาพชีวิต', 'people', 'community'],
    iconName: 'Users',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'human-family-dev',
        name: 'วิชาเอกพัฒนาการมนุษย์และครอบครัว',
        type: 'major',
        tags: ['ครอบครัวและการพัฒนาคน', 'ชุมชนและสังคม', 'people'],
        description: 'ความสัมพันธ์ในครอบครัว การพัฒนาคุณภาพชีวิตทุกช่วงวัย',
      },
    ],
  },

  // 9) สาขาวิชารัฐศาสตร์
  {
    programId: 'polsci-bpol',
    schoolCode: 'school_political_sci',
    schoolName: 'สาขาวิชารัฐศาสตร์',
    englishSchoolName: 'School of Political Science',
    programName: 'หลักสูตรรัฐศาสตรบัณฑิต',
    degreeName: 'ร.บ.',
    tags: ['กฎหมายและสังคม', 'การเมืองและนโยบาย', 'ภาครัฐ', 'ประเด็นระหว่างประเทศ', 'law_society'],
    iconName: 'Landmark',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'polsci-politics-gov',
        name: 'แขนงการเมืองการปกครอง',
        type: 'track',
        trackName: 'การเมืองการปกครอง',
        tags: ['การเมืองและนโยบาย', 'ภาครัฐ', 'กฎหมายและสังคม', 'law_society'],
        description: 'ระบอบการปกครอง รัฐธรรมนูญ นโยบายสาธารณะ และการบริหารภาครัฐ',
      },
      {
        id: 'polsci-intl-relations',
        name: 'แขนงความสัมพันธ์ระหว่างประเทศ',
        type: 'track',
        trackName: 'ความสัมพันธ์ระหว่างประเทศ',
        tags: ['ประเด็นระหว่างประเทศ', 'นโยบาย', 'การทูต', 'law_society'],
        description: 'การเมืองระหว่างประเทศ องค์การระหว่างประเทศ และการทูตสากล',
      },
    ],
  },

  // 10) สาขาวิชาเกษตรศาสตร์และสหกรณ์
  {
    programId: 'agri-bsc',
    schoolCode: 'school_agriculture',
    schoolName: 'สาขาวิชาเกษตรศาสตร์และสหกรณ์',
    englishSchoolName: 'School of Agricultural Extension and Cooperatives',
    programName: 'หลักสูตรเกษตรศาสตรบัณฑิต',
    degreeName: 'กษ.บ.',
    tags: ['เกษตรและชุมชน', 'สิ่งแวดล้อมและทรัพยากร', 'ธุรกิจเกษตร', 'การประกอบการ', 'agriculture', 'community'],
    iconName: 'Sprout',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'agri-ext-dev',
        name: 'วิชาเอกส่งเสริมและพัฒนาการเกษตร',
        type: 'major',
        tags: ['เกษตรและชุมชน', 'การพัฒนาชุมชน', 'agriculture'],
        description: 'การถ่ายทอดเทคโนโลยีและการพัฒนาเกษตรกรในชุมชน',
      },
      {
        id: 'agri-plant-prod',
        name: 'วิชาเอกการจัดการการผลิตพืช',
        type: 'major',
        tags: ['เกษตรและชุมชน', 'เทคโนโลยีการผลิต', 'agriculture'],
        description: 'เทคโนโลยีการเพาะปลูกพืชเศรษฐกิจ เกษตรแม่นยำ และการจัดการผลผลิต',
      },
      {
        id: 'agri-animal-prod',
        name: 'วิชาเอกการจัดการการผลิตสัตว์',
        type: 'major',
        tags: ['เกษตรและชุมชน', 'ปศุสัตว์', 'agriculture'],
        description: 'การจัดการฟาร์มปศุสัตว์ สุขภาพสัตว์ และธุรกิจฟาร์มเลี้ยงสัตว์',
      },
      {
        id: 'agri-forest-env',
        name: 'วิชาเอกการจัดการทรัพยากรป่าไม้และสิ่งแวดล้อม',
        type: 'major',
        tags: ['สิ่งแวดล้อมและทรัพยากร', 'ความยั่งยืน', 'agriculture'],
        description: 'การอนุรักษ์ ฟื้นฟูป่าไม้ และการจัดการสิ่งแวดล้อมอย่างยั่งยืน',
      },
      {
        id: 'agri-agribusiness',
        name: 'วิชาเอกธุรกิจการเกษตรและการประกอบการ',
        type: 'major',
        tags: ['ธุรกิจเกษตร', 'การประกอบการ', 'ธุรกิจและการจัดการ', 'agriculture', 'business'],
        description: 'การสร้างธุรกิจเกษตร นวัตกรรมแปรรูป และการตลาดสินค้าเกษตร',
      },
    ],
  },
  {
    programId: 'agri-bba-coop',
    schoolCode: 'school_agriculture',
    schoolName: 'สาขาวิชาเกษตรศาสตร์และสหกรณ์',
    englishSchoolName: 'School of Agricultural Extension and Cooperatives',
    programName: 'หลักสูตรบริหารธุรกิจบัณฑิต',
    degreeName: 'บธ.บ.',
    tags: ['เกษตรและชุมชน', 'การพัฒนาชุมชน', 'ธุรกิจเกษตร', 'agriculture', 'business'],
    iconName: 'Leaf',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      {
        id: 'agri-coop-biz',
        name: 'วิชาเอกสหกรณ์และธุรกิจชุมชน',
        type: 'major',
        tags: ['การพัฒนาชุมชน', 'ธุรกิจและการจัดการ', 'เศรษฐกิจฐานราก', 'agriculture', 'community'],
        description: 'การบริหารสหกรณ์ การเงินชุมชน และวิสาหกิจเพื่อสังคม',
      },
    ],
  },

  // 11) สาขาวิชาวิทยาศาสตร์และเทคโนโลยี
  {
    programId: 'scitech-bsc',
    schoolCode: 'school_sci_tech',
    schoolName: 'สาขาวิชาวิทยาศาสตร์และเทคโนโลยี',
    englishSchoolName: 'School of Science and Technology',
    programName: 'หลักสูตรวิทยาศาสตรบัณฑิต',
    degreeName: 'วท.บ.',
    tags: ['ดิจิทัลและเทคโนโลยี', 'ข้อมูลและการวิเคราะห์', 'คอมพิวเตอร์และการเขียนโปรแกรม', 'โลจิสติกส์', 'วิศวกรรมการผลิต', 'เทคโนโลยีการเกษตร', 'technology', 'digital_portfolio'],
    iconName: 'Cpu',
    detailUrl: BACHELOR_URL,
    majorsAndTracks: [
      // แขนงวิชาวิทยาการคอมพิวเตอร์
      {
        id: 'scitech-cs',
        name: 'วิชาเอกวิทยาการคอมพิวเตอร์',
        trackName: 'แขนงวิชาวิทยาการคอมพิวเตอร์',
        type: 'major',
        tags: ['คอมพิวเตอร์และการเขียนโปรแกรม', 'ดิจิทัลและเทคโนโลยี', 'technology', 'digital_portfolio'],
        description: 'การพัฒนาซอฟต์แวร์ อัลกอริทึม ปัญญาประดิษฐ์ และระบบคอมพิวเตอร์',
      },
      {
        id: 'scitech-data-science',
        name: 'วิชาเอกวิทยาการข้อมูล',
        trackName: 'แขนงวิชาวิทยาการคอมพิวเตอร์',
        type: 'major',
        tags: ['ข้อมูลและการวิเคราะห์', 'ดิจิทัลและเทคโนโลยี', 'technology', 'business'],
        description: 'การวิเคราะห์ข้อมูลขนาดใหญ่ การทำเหมืองข้อมูล และ Data Analytics',
      },
      {
        id: 'scitech-ict',
        name: 'วิชาเอกเทคโนโลยีสารสนเทศและการสื่อสาร',
        trackName: 'แขนงวิชาวิทยาการคอมพิวเตอร์',
        type: 'major',
        tags: ['ดิจิทัลและเทคโนโลยี', 'ระบบเครือข่าย', 'technology'],
        description: 'โครงสร้างพื้นฐานระบบเครือข่าย คลาวด์ และความมั่นคงปลอดภัยไซเบอร์',
      },
      // แขนงวิชาเทคโนโลยีการเกษตร
      {
        id: 'scitech-prod-eng',
        name: 'วิชาเอกเทคโนโลยีวิศวกรรมการผลิตและการจัดการ',
        trackName: 'แขนงวิชาเทคโนโลยีการเกษตร',
        type: 'major',
        tags: ['วิศวกรรมการผลิต', 'เทคโนโลยี', 'การจัดการอุตสาหกรรม', 'technology', 'business'],
        description: 'การควบคุมกระบวนการผลิตอุตสาหกรรมและการเพิ่มผลิตภาพ',
      },
      {
        id: 'scitech-logistics-pkg',
        name: 'วิชาเอกโลจิสติกส์และการจัดการบรรจุภัณฑ์',
        trackName: 'แขนงวิชาเทคโนโลยีการเกษตร',
        type: 'major',
        tags: ['โลจิสติกส์', 'บรรจุภัณฑ์', 'การจัดการห่วงโซ่อุปทาน', 'technology', 'business'],
        description: 'การจัดการระบบโลจิสติกส์ ซัพพลายเชน และนวัตกรรมบรรจุภัณฑ์',
      },
    ],
  },
];
