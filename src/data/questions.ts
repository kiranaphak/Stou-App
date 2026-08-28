import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // คำถามที่ 1
  {
    id: 1,
    numberText: 'คำถาม 1 จาก 6',
    title: 'ตอนนี้คุณกำลังอยู่ในช่วงไหนของชีวิต?',
    subtitle: 'เลือกคำตอบที่ใกล้กับคุณที่สุด',
    options: [
      {
        id: 'student',
        label: 'กำลังเรียน หรือเพิ่งเริ่มต้นเส้นทาง',
        sublabel: 'กำลังศึกษาอยู่ หรือเตรียมพร้อมสำหรับการเรียนรู้เพื่อสร้างอนาคต',
        iconName: 'GraduationCap',
        scores: { careerScore: 0, degreeScore: 3, upskillScore: 1 },
      },
      {
        id: 'working',
        label: 'ทำงานอยู่ และอยากไปต่อ',
        sublabel: 'มีงานประจำหรือวิชาชีพ และต้องการต่อยอดศักยภาพในสายงาน',
        iconName: 'Briefcase',
        scores: { careerScore: 3, degreeScore: 1, upskillScore: 2 },
      },
      {
        id: 'entrepreneur',
        label: 'ทำธุรกิจ หรือกำลังสร้างอาชีพของตัวเอง',
        sublabel: 'เป็นเจ้าของกิจการ ฟรีแลนซ์ หรือกำลังริเริ่มธุรกิจใหม่',
        iconName: 'Building2',
        scores: { careerScore: 3, degreeScore: 0, upskillScore: 2 },
      },
      {
        id: 'transition',
        label: 'อยู่ระหว่างเปลี่ยนงานหรือมองหาเส้นทางใหม่',
        sublabel: 'ต้องการปรับเปลี่ยนสายงาน หรือเตรียมความพร้อมสู่โอกาสใหม่',
        iconName: 'Compass',
        scores: { careerScore: 2, degreeScore: 2, upskillScore: 3 },
      },
      {
        id: 'lifelong',
        label: 'อยากเรียนรู้เพื่อตัวเอง ชุมชน หรือหลังเกษียณ',
        sublabel: 'เปิดโลกความรู้ พัฒนาคุณภาพชีวิต หรือส่งต่อประโยชน์สู่สังคม',
        iconName: 'HeartHandshake',
        scores: { careerScore: 0, degreeScore: 1, upskillScore: 3 },
      },
    ],
  },

  // คำถามที่ 2
  {
    id: 2,
    numberText: 'คำถาม 2 จาก 6',
    title: 'คุณอยากเรียนต่อครั้งนี้เพื่ออะไรเป็นหลัก?',
    subtitle: 'อะไรคือเป้าหมายสำคัญที่สุดในการเรียนรู้ครั้งนี้',
    options: [
      {
        id: 'degree',
        label: 'อยากมีวุฒิการศึกษาเพื่อเปิดโอกาสใหม่',
        sublabel: 'ต้องการวุฒิปริญญาบัตรเพื่อสร้างโอกาสในการทำงานและอนาคต',
        iconName: 'Award',
        scores: { careerScore: 1, degreeScore: 4, upskillScore: 0 },
      },
      {
        id: 'career',
        label: 'อยากเติบโตในงานหรือก้าวสู่บทบาทใหม่',
        sublabel: 'เพื่อเพิ่มความเชี่ยวชาญ เลื่อนขั้นตำแหน่ง หรือก้าวสู่บทบาทผู้นำ',
        iconName: 'TrendingUp',
        scores: { careerScore: 4, degreeScore: 0, upskillScore: 1 },
      },
      {
        id: 'career_change',
        label: 'อยากเปลี่ยนสายงาน หรือเริ่มอาชีพใหม่',
        sublabel: 'ข้ามสายงานสู่สิ่งใหม่ หรือสร้างทักษะสำหรับธุรกิจของตนเอง',
        iconName: 'Shuffle',
        scores: { careerScore: 2, degreeScore: 1, upskillScore: 3 },
      },
      {
        id: 'specific_skill',
        label: 'อยากเพิ่มทักษะเฉพาะด้านให้ใช้ได้จริง',
        sublabel: 'เน้นความรู้และทักษะเฉพาะทางที่นำไปแก้ปัญหาหรือใช้ทำงานได้ทันที',
        iconName: 'Sparkles',
        scores: { careerScore: 1, degreeScore: 0, upskillScore: 4 },
      },
      {
        id: 'personal',
        label: 'อยากเรียนในเรื่องที่สนใจ เพื่อตัวเองหรือชุมชน',
        sublabel: 'เรียนรู้ในสิ่งที่ชอบ เพิ่มคุณค่าให้ชีวิต หรือนำไปพัฒนาชุมชน',
        iconName: 'Smile',
        scores: { careerScore: 0, degreeScore: 1, upskillScore: 3 },
      },
    ],
  },

  // คำถามที่ 3
  {
    id: 3,
    numberText: 'คำถาม 3 จาก 6',
    title: 'ผลลัพธ์แบบไหนที่คุณอยากได้จากการเรียนมากที่สุด?',
    subtitle: 'รูปแบบความสำเร็จที่คุณคาดหวัง',
    options: [
      {
        id: 'degree',
        label: 'วุฒิปริญญาที่ต่อยอดอนาคตได้',
        sublabel: 'ปริญญาบัตรรับรองคุณวุฒิ เพื่อความก้าวหน้าและการศึกษาต่อ',
        iconName: 'GraduationCap',
        scores: { careerScore: 2, degreeScore: 4, upskillScore: 0 },
      },
      {
        id: 'certificate',
        label: 'ใบรับรองความรู้จากรายวิชาที่เลือกเรียน',
        sublabel: 'สัมฤทธิบัตรรับรองความรู้รายวิชา พร้อมสะสมหน่วยกิตเข้าปริญญาได้',
        iconName: 'FileCheck',
        scores: { careerScore: 1, degreeScore: 1, upskillScore: 4 },
      },
      {
        id: 'practical_skill',
        label: 'ทักษะใหม่ที่นำไปใช้กับงานหรือชีวิตได้ทันที',
        sublabel: 'ความรู้เชิงปฏิบัติที่ยืดหยุ่น ประยุกต์ใช้ได้จริงในชีวิตประจำวันและงาน',
        iconName: 'Wrench',
        scores: { careerScore: 1, degreeScore: 0, upskillScore: 4 },
      },
      {
        id: 'explore',
        label: 'ลองเรียนก่อน แล้วค่อยตัดสินใจเรียนต่อ',
        sublabel: 'ทดลองเรียนวิชาที่สนใจ ปูพื้นฐานความรู้ ก่อนวางแผนเรียนเต็มหลักสูตร',
        iconName: 'Search',
        scores: { careerScore: 0, degreeScore: 3, upskillScore: 3 },
      },
    ],
  },

  // คำถามที่ 4 (Primary Interest - ไม่นำมาคิด 3 คะแนนหลักโดยตรง แต่นำไปจับกลุ่มหลักสูตร)
  {
    id: 4,
    numberText: 'คำถาม 4 จาก 6',
    title: 'คุณชอบทำงานหรือเรียนรู้กับเรื่องแบบไหน?',
    subtitle: 'เลือกหัวข้อหรือสาขาที่คุณสนใจมากที่สุด',
    options: [
      {
        id: 'people',
        label: 'ผู้คน การดูแล การสอน และการพัฒนา',
        sublabel: 'การศึกษา พัฒนาเด็กและครอบครัว การแนะแนว การดูแลผู้คนในสังคม',
        iconName: 'Users',
        scores: { careerScore: 0, degreeScore: 0, upskillScore: 0 },
      },
      {
        id: 'business',
        label: 'ธุรกิจ การบริหาร ตัวเลข และการวางแผน',
        sublabel: 'การจัดการ การเงิน บัญชี การตลาด การท่องเที่ยว และเศรษฐศาสตร์',
        iconName: 'Briefcase',
        scores: { careerScore: 0, degreeScore: 0, upskillScore: 0 },
      },
      {
        id: 'law_society',
        label: 'กฎหมาย สังคม การเมือง และนโยบาย',
        sublabel: 'นิติศาสตร์ รัฐศาสตร์ ความสัมพันธ์ระหว่างประเทศ และการบริหารภาครัฐ',
        iconName: 'Scale',
        scores: { careerScore: 0, degreeScore: 0, upskillScore: 0 },
      },
      {
        id: 'communication',
        label: 'สื่อ ภาษา การเล่าเรื่อง และการสื่อสาร',
        sublabel: 'การสื่อสารดิจิทัล สื่อสารมวลชน ภาษาอังกฤษ สารสนเทศศาสตร์',
        iconName: 'Languages',
        scores: { careerScore: 0, degreeScore: 0, upskillScore: 0 },
      },
      {
        id: 'health',
        label: 'สุขภาพ อาหาร ครอบครัว และคุณภาพชีวิต',
        sublabel: 'สาธารณสุขชุมชน อาชีวอนามัย โภชนาการ และการส่งเสริมสุขภาพ',
        iconName: 'HeartPulse',
        scores: { careerScore: 0, degreeScore: 0, upskillScore: 0 },
      },
      {
        id: 'agriculture',
        label: 'เกษตร ชุมชน ทรัพยากร และสิ่งแวดล้อม',
        sublabel: 'นวัตกรรมการผลิตพืชและสัตว์ ป่าไม้ สิ่งแวดล้อม สหกรณ์และธุรกิจเกษตร',
        iconName: 'Sprout',
        scores: { careerScore: 0, degreeScore: 0, upskillScore: 0 },
      },
      {
        id: 'technology',
        label: 'ดิจิทัล ข้อมูล คอมพิวเตอร์ และเทคโนโลยี',
        sublabel: 'วิทยาการคอมพิวเตอร์ วิทยาการข้อมูล ไอที และวิศวกรรมการจัดการ',
        iconName: 'Cpu',
        scores: { careerScore: 0, degreeScore: 0, upskillScore: 0 },
      },
    ],
  },

  // คำถามที่ 5
  {
    id: 5,
    numberText: 'คำถาม 5 จาก 6',
    title: 'คุณอยากนำความรู้ไปสร้างอะไรต่อ?',
    subtitle: 'ผลลัพธ์ที่คุณอยากสร้างสรรค์หลังจากการเรียนรู้',
    options: [
      {
        id: 'career_growth',
        label: 'ความก้าวหน้าในงานปัจจุบัน',
        sublabel: 'เติบโตในสายอาชีพ เพิ่มความเชี่ยวชาญ และความมั่นคงในองค์กร',
        iconName: 'TrendingUp',
        scores: { careerScore: 4, degreeScore: 1, upskillScore: 1 },
      },
      {
        id: 'new_career',
        label: 'อาชีพหรือธุรกิจใหม่',
        sublabel: 'เริ่มต้นธุรกิจส่วนตัว เป็นฟรีแลนซ์ หรือเปลี่ยนไปสู่เส้นทางอาชีพใหม่',
        iconName: 'Rocket',
        scores: { careerScore: 2, degreeScore: 1, upskillScore: 3 },
      },
      {
        id: 'job_security',
        label: 'ความมั่นคงและโอกาสในการทำงาน',
        sublabel: 'เพิ่มคุณวุฒิความมั่นคง สมัครงานใหม่ หรือสอบบรรจุราชการ',
        iconName: 'ShieldCheck',
        scores: { careerScore: 2, degreeScore: 3, upskillScore: 1 },
      },
      {
        id: 'community',
        label: 'ประโยชน์ให้ครอบครัว ชุมชน หรือสังคม',
        sublabel: 'นำความรู้กลับไปดูแลครอบครัว ช่วยเหลือชุมชน หรือขับเคลื่อนสังคม',
        iconName: 'Heart',
        scores: { careerScore: 1, degreeScore: 2, upskillScore: 3 },
      },
      {
        id: 'digital_portfolio',
        label: 'ผลงานหรือทักษะเฉพาะตัวในโลกดิจิทัล',
        sublabel: 'สร้างผลงาน โปรเจกต์ คอนเทนต์ หรือทักษะไอทีที่โดดเด่น',
        iconName: 'Code',
        scores: { careerScore: 2, degreeScore: 0, upskillScore: 4 },
      },
    ],
  },

  // คำถามที่ 6
  {
    id: 6,
    numberText: 'คำถาม 6 จาก 6',
    title: 'รูปแบบการเรียนแบบไหนน่าจะเหมาะกับคุณตอนนี้?',
    subtitle: 'เลือกจังหวะและความยืดหยุ่นที่เข้ากับวิถีชีวิตของคุณ',
    options: [
      {
        id: 'bachelor',
        label: 'เรียนต่อเนื่องเพื่อรับวุฒิปริญญา',
        sublabel: 'หลักสูตรปริญญาตรี ศึกษาด้วยตนเองตามโครงสร้างแผนการเรียน',
        iconName: 'GraduationCap',
        scores: { careerScore: 1, degreeScore: 4, upskillScore: 0 },
      },
      {
        id: 'graduate',
        label: 'เรียนต่อยอดหลังปริญญาตรี เพื่อความเชี่ยวชาญ',
        sublabel: 'หลักสูตรระดับบัณฑิตศึกษา/ปริญญาโท หรือประกาศนียบัตรบัณฑิต',
        iconName: 'Award',
        scores: { careerScore: 4, degreeScore: 2, upskillScore: 1 },
      },
      {
        id: 'certificate',
        label: 'เลือกเรียนเฉพาะรายวิชาที่สนใจ',
        sublabel: 'โครงการสัมฤทธิบัตร เรียนเฉพาะชุดวิชาที่ต้องการ สะสมหน่วยกิตได้',
        iconName: 'CheckCircle2',
        scores: { careerScore: 1, degreeScore: 1, upskillScore: 4 },
      },
      {
        id: 'explore',
        label: 'เริ่มจากลองเรียนสั้น ๆ ก่อน แล้วค่อยวางแผนต่อ',
        sublabel: 'ทดลองเรียนแบบยืดหยุ่น สัมผัสเนื้อหาจริงก่อนตัดสินใจสมัครเรียนเต็มรูปแบบ',
        iconName: 'Sparkles',
        scores: { careerScore: 0, degreeScore: 2, upskillScore: 3 },
      },
    ],
  },
];
