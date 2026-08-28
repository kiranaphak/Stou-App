import { FieldOfStudy } from '../types';

export const ALL_FIELDS: Record<string, FieldOfStudy> = {
  management: {
    id: 'management',
    name: 'สาขาวิชาวิทยาการจัดการ',
    englishName: 'School of Management Science',
    description: 'ครอบคลุมการบริหารธุรกิจ การจัดการทั่วไป การตลาด การบัญชี และการเงิน มุ่งเน้นการเป็นผู้นำองค์กรและผู้ประกอบการยุคดิจิทัล',
    highlightPrograms: 'การจัดการ, การตลาด, การบัญชี, การเงินและการธนาคาร, การจัดการการท่องเที่ยวและโรงแรม',
    careerOpportunities: 'นักบริหารธุรกิจ, ผู้จัดการฝ่าย, นักการตลาดดิจิทัล, นักบัญชี, ผู้ประกอบการธุรกิจส่วนตัว',
    iconName: 'Briefcase',
    url: 'https://apply.stou.ac.th/',
  },
  economics: {
    id: 'economics',
    name: 'สาขาวิชาเศรษฐศาสตร์',
    englishName: 'School of Economics',
    description: 'วิเคราะห์แนวโน้มเศรษฐกิจ การลงทุน การเงิน และกลยุทธ์การตัดสินใจทางธุรกิจในระดับประเทศและสากล',
    highlightPrograms: 'เศรษฐศาสตร์ธุรกิจ, เศรษฐศาสตร์การเงินและการจัดการ, เศรษฐศาสตร์ประยุกต์',
    careerOpportunities: 'นักวิเคราะห์นโยบายและแผน, นักวิเคราะห์การเงินและการลงทุน, ที่ปรึกษาเศรษฐกิจธุรกิจ',
    iconName: 'TrendingUp',
    url: 'https://apply.stou.ac.th/',
  },
  communication_arts: {
    id: 'communication_arts',
    name: 'สาขาวิชานิเทศศาสตร์',
    englishName: 'School of Communication Arts',
    description: 'สร้างสรรค์คอนเทนต์ การสื่อสารการตลาดดิจิทัล การประชาสัมพันธ์ และการผลิตสื่อนวัตกรรมข้ามแพลตฟอร์ม',
    highlightPrograms: 'นวัตกรรมการสื่อสารและสื่อดิจิทัล, การประชาสัมพันธ์และการสื่อสารองค์กร, สื่อสารการตลาด',
    careerOpportunities: 'Content Creator, ผู้เชี่ยวชาญด้านการสื่อสารองค์กร, นักประชาสัมพันธ์, นักกลยุทธ์สื่อดิจิทัล',
    iconName: 'Megaphone',
    url: 'https://apply.stou.ac.th/',
  },
  law: {
    id: 'law',
    name: 'สาขาวิชานิติศาสตร์',
    englishName: 'School of Law',
    description: 'ศึกษาตัวบทกฎหมาย กฎหมายธุรกิจ อาญา แพ่งและพาณิชย์ รวมถึงกฎหมายมหาชน เพื่อการว่าความและที่ปรึกษากฎหมาย',
    highlightPrograms: 'นิติศาสตรบัณฑิต, กฎหมายธุรกิจและพาณิชย์, กฎหมายมหาชน',
    careerOpportunities: 'ทนายความ, นิติกรหน่วยงานรัฐ/เอกชน, ที่ปรึกษากฎหมายธุรกิจ, สายงานยุติธรรมและศาล',
    iconName: 'Scale',
    url: 'https://apply.stou.ac.th/',
  },
  political_science: {
    id: 'political_science',
    name: 'สาขาวิชารัฐศาสตร์',
    englishName: 'School of Political Science',
    description: 'การบริหารงานภาครัฐ นโยบายสาธารณะ การปกครองส่วนท้องถิ่น และความสัมพันธ์ระหว่างประเทศ',
    highlightPrograms: 'รัฐประศาสนศาสตร์ (การบริหารรัฐกิจ), การเมืองการปกครอง, การบริหารงานท้องถิ่น',
    careerOpportunities: 'ข้าราชการ, ปลัดอำเภอ, เจ้าหน้าที่บริหารงานทั่วไป, ผู้นำท้องถิ่น, นักวิเคราะห์นโยบาย',
    iconName: 'Landmark',
    url: 'https://apply.stou.ac.th/',
  },
  liberal_arts: {
    id: 'liberal_arts',
    name: 'สาขาวิชาศิลปศาสตร์',
    englishName: 'School of Liberal Arts',
    description: 'ภาษาเพื่อการสื่อสาร สารสนเทศศาสตร์ และการพัฒนาสังคม เชื่อมโยงวัฒนธรรมและมนุษยศาสตร์สู่โลกสากล',
    highlightPrograms: 'ภาษาอังกฤษเพื่อการสื่อสาร, สารสนเทศศาสตร์, ไทยคดีศึกษา, พัฒนาสังคม',
    careerOpportunities: 'นักแปล/ล่าม, นักจัดการข้อมูลสารสนเทศ, เจ้าหน้าที่ฝ่ายต่างประเทศ, ครู/วิทยากรภาษา',
    iconName: 'Languages',
    url: 'https://apply.stou.ac.th/',
  },
  health_science: {
    id: 'health_science',
    name: 'สาขาวิชาวิทยาศาสตร์สุขภาพ',
    englishName: 'School of Health Science',
    description: 'การส่งเสริมสุขภาพ การป้องกันโรค อาชีวอนามัยและความปลอดภัยในการทำงาน และการจัดการระบบบริการสุขภาพ',
    highlightPrograms: 'สาธารณสุขศาสตร์, อาชีวอนามัยและความปลอดภัย, การแพทย์แผนไทย, การจัดการโรงพยาบาล',
    careerOpportunities: 'นักวิชาการสาธารณสุข, เจ้าหน้าที่ จป.วิชาชีพ ในโรงงาน/องค์กร, ผู้บริหารคลินิกสุขภาพ',
    iconName: 'HeartPulse',
    url: 'https://apply.stou.ac.th/',
  },
  human_ecology: {
    id: 'human_ecology',
    name: 'สาขาวิชามนุษยนิเวศศาสตร์',
    englishName: 'School of Human Ecology',
    description: 'อาหาร โภชนาการ วิทยาศาสตร์การอาหาร การพัฒนาครอบครัวและเด็ก และธุรกิจบริการอาหาร',
    highlightPrograms: 'อาหารและโภชนาการ, การพัฒนาเด็กและครอบครัว, โภชนบำบัด, ธุรกิจการบริการอาหาร',
    careerOpportunities: 'นักโภชนาการ, ผู้เชี่ยวชาญด้านอาหารและสุขภาพ, ผู้ประกอบการร้านอาหาร/เบเกอรี่, ที่ปรึกษาครอบครัว',
    iconName: 'Utensils',
    url: 'https://apply.stou.ac.th/',
  },
  nursing: {
    id: 'nursing',
    name: 'สาขาวิชาพยาบาลศาสตร์',
    englishName: 'School of Nursing',
    description: 'พัฒนาศักยภาพวิชาชีพพยาบาล การบริหารการพยาบาล และการพยาบาลขั้นสูงสำหรับผู้สำเร็จการศึกษาพยาบาล',
    highlightPrograms: 'พยาบาลศาสตรบัณฑิต (ต่อเนื่อง), การบริหารการพยาบาล, การพยาบาลเวชปฏิบัติ',
    careerOpportunities: 'พยาบาลวิชาชีพ, หัวหน้าหอผู้ป่วย, ผู้บริหารทางการพยาบาล, นักวิชาการพยาบาล',
    iconName: 'Cross',
    url: 'https://apply.stou.ac.th/',
  },
  education: {
    id: 'education',
    name: 'สาขาวิชาศึกษาศาสตร์',
    englishName: 'School of Educational Studies',
    description: 'นวัตกรรมการเรียนรู้ การออกแบบหลักสูตร การศึกษานอกระบบและการศึกษาตามอัธยาศัย และการบริหารการศึกษา',
    highlightPrograms: 'การศึกษานอกระบบ, การบริหารการศึกษา, นวัตกรรมและเทคโนโลยีการศึกษา, การวัดผลการศึกษา',
    careerOpportunities: 'นักวิชาการศึกษา, ผู้บริหารสถานศึกษา, ครู/อาจารย์, นักออกแบบหลักสูตรการฝึกอบรม',
    iconName: 'GraduationCap',
    url: 'https://apply.stou.ac.th/',
  },
  agriculture: {
    id: 'agriculture',
    name: 'สาขาวิชาเกษตรศาสตร์และสหกรณ์',
    englishName: 'School of Agricultural Extension and Cooperatives',
    description: 'การเกษตรอัจฉริยะ การจัดการธุรกิจเกษตร การส่งเสริมการเกษตร และระบบการจัดการสหกรณ์ยุคใหม่',
    highlightPrograms: 'ส่งเสริมการเกษตร, ธุรกิจการเกษตร, การจัดการสหกรณ์, เกษตรยั่งยืนและเทคโนโลยีเกษตร',
    careerOpportunities: 'นักส่งเสริมการเกษตร, ผู้จัดการสหกรณ์, เจ้าของฟาร์มเกษตรอัจฉริยะ, ที่ปรึกษาธุรกิจการเกษตร',
    iconName: 'Leaf',
    url: 'https://apply.stou.ac.th/',
  },
  science_tech: {
    id: 'science_tech',
    name: 'สาขาวิชาวิทยาศาสตร์และเทคโนโลยี',
    englishName: 'School of Science and Technology',
    description: 'เทคโนโลยีสารสนเทศ วิทยาการคอมพิวเตอร์ เทคโนโลยีการพิมพ์ และเทคโนโลยีการจัดการอุตสาหกรรม',
    highlightPrograms: 'เทคโนโลยีสารสนเทศ (IT), วิทยาการคอมพิวเตอร์, เทคโนโลยีอุตสาหกรรม, เทคโนโลยีการจัดการ',
    careerOpportunities: 'โปรแกรมเมอร์, ผู้ดูแลระบบเครือข่าย, นักวิเคราะห์ระบบ, ผู้ควบคุมคุณภาพและเทคโนโลยีโรงงาน',
    iconName: 'Cpu',
    url: 'https://apply.stou.ac.th/',
  },
};

/**
 * Mapping Table: จับคู่ตัวเลือกข้อ 6 กับ 3 สาขาวิชา มสธ.
 */
export const INTEREST_FIELD_MAPPING: Record<string, string[]> = {
  // 1. ธุรกิจและการจัดการ -> วิทยาการจัดการ, เศรษฐศาสตร์, นิเทศศาสตร์
  business: ['management', 'economics', 'communication_arts'],

  // 2. กฎหมายและสังคม -> นิติศาสตร์, รัฐศาสตร์, ศิลปศาสตร์
  law_society: ['law', 'political_science', 'liberal_arts'],

  // 3. สุขภาพและคุณภาพชีวิต -> วิทยาศาสตร์สุขภาพ, มนุษยนิเวศศาสตร์, พยาบาลศาสตร์
  health_wellness: ['health_science', 'human_ecology', 'nursing'],

  // 4. การศึกษาและพัฒนาคน -> ศึกษาศาสตร์, ศิลปศาสตร์, วิทยาการจัดการ
  education_dev: ['education', 'liberal_arts', 'management'],

  // 5. เกษตรและชุมชน -> เกษตรศาสตร์และสหกรณ์, มนุษยนิเวศศาสตร์, รัฐศาสตร์
  agriculture_community: ['agriculture', 'human_ecology', 'political_science'],

  // 6. ดิจิทัลและเทคโนโลยี -> วิทยาศาสตร์และเทคโนโลยี, วิทยาการจัดการ, นิเทศศาสตร์
  digital_tech: ['science_tech', 'management', 'communication_arts'],

  // 7. ภาษาและการสื่อสาร -> ศิลปศาสตร์, นิเทศศาสตร์, ศึกษาศาสตร์
  language_comm: ['liberal_arts', 'communication_arts', 'education'],
};

export function getMatchedFields(interestId: string): FieldOfStudy[] {
  const fieldKeys = INTEREST_FIELD_MAPPING[interestId] || INTEREST_FIELD_MAPPING['business'];
  return fieldKeys.map((key) => ALL_FIELDS[key]).filter(Boolean);
}
