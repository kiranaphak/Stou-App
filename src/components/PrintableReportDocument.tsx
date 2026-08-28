import React from 'react';
import {
  TrendingUp,
  GraduationCap,
  Sparkles,
  Users,
  Eye,
  CheckCircle2,
  MousePointerClick,
  Layers,
  Award,
  Phone,
  MapPin,
  ShieldCheck,
  Calendar,
  Building2,
  BookOpen,
} from 'lucide-react';
import { AggregatedStats, ReportMetadata } from '../utils/excelExporter';

interface PrintableReportProps {
  meta?: ReportMetadata;
  metadata?: ReportMetadata;
  stats: AggregatedStats;
}

const defaultReportMetadata: ReportMetadata = {
  title: 'รายงานสรุปสถิติการใช้งาน Web app ค้นหาเส้นทางเรียน มสธ. ที่ใช่สำหรับคุณ',
  agency: 'ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง',
  dateRangeText: 'วันนี้ (Asia/Bangkok)',
  generatedAtText: new Date().toLocaleDateString('th-TH'),
  appVersion: '1.0.0',
  quizVersion: '2569-v1',
  dataSource: 'Firestore Real-time DB',
  privacyDisclaimer:
    'รายงานนี้เป็นข้อมูลสรุปเชิงสถิติแบบไม่ระบุตัวตน (Anonymous Analytics) ไม่มีการจัดเก็บข้อมูลส่วนบุคคล (No PII)',
};

const interestLabelMap: Record<string, string> = {
  people: 'ผู้คน การดูแล การสอน และการพัฒนา',
  business: 'ธุรกิจ การบริหาร ตัวเลข และการวางแผน',
  law_society: 'กฎหมาย สังคม การเมือง และนโยบาย',
  communication: 'สื่อ ภาษา การเล่าเรื่อง และการสื่อสาร',
  health: 'สุขภาพ อาหาร ครอบครัว และคุณภาพชีวิต',
  agriculture: 'เกษตร ชุมชน ทรัพยากร และสิ่งแวดล้อม',
  technology: 'ดิจิทัล ข้อมูล คอมพิวเตอร์ และเทคโนโลยี',
};

export const PrintableReportDocument: React.FC<PrintableReportProps> = ({ meta, metadata, stats }) => {
  const activeMeta = meta || metadata || defaultReportMetadata;

  const formatMin5 = (num: number) => {
    if (num === 0) return 0;
    if (num < 5) return '< 5';
    return num;
  };

  // Derive top insights for executive summary
  const insights = [
    stats.completed > 0
      ? `อัตราการตอบคำถามจนจบ (Completion Rate) อยู่ที่ ${stats.completionRate.toFixed(1)}% สะท้อนว่าโครงสร้างคำถาม 6 ข้อมอบประสบการณ์ที่กระชับและดึงดูดผู้ใช้งานได้เป็นอย่างดี`
      : 'ยังไม่มีข้อมูลการตอบแบบทดสอบในช่วงเวลานี้',
    stats.detailClicks > 0
      ? `มีอัตราความสนใจคลิกดูรายละเอียดหลักสูตรเชิงลึก (Detail CTR) ${stats.detailCtr.toFixed(1)}% แสดงถึงความตั้งใจศึกษาต่อจริงของผู้เข้าร่วมกิจกรรม`
      : 'ผู้เข้าร่วมอยู่ระหว่างการสำรวจเส้นทางการเรียนรู้',
    stats.lampangContactClicks + stats.lampangMapClicks > 0
      ? `มีผู้แสดงความตั้งใจติดต่อสอบถามหรือค้นหาตำแหน่ง ศวช. มสธ. ลำปาง รวม ${stats.lampangContactClicks + stats.lampangMapClicks} ครั้ง คิดเป็น Intent Rate ${stats.contactIntentRate.toFixed(1)}%`
      : 'สามารถเพิ่มการเน้นย้ำจุดบริการและเบอร์โทรติดต่อของศูนย์ลำปางในจุดแนะนำผลลัพธ์เพิ่มเติมได้',
  ];

  return (
    <div
      id="printable-report-wrapper"
      className="bg-white text-slate-800 font-sans p-6 sm:p-10 space-y-10 max-w-4xl mx-auto border border-slate-200 shadow-sm rounded-3xl"
    >
      {/* ================= PAGE 1: EXECUTIVE SUMMARY & FUNNEL ================= */}
      <section className="space-y-6 pb-6 border-b-2 border-slate-100 print-break-inside-avoid">
        {/* Formal Institutional Header */}
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#004D28] pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-16 flex-shrink-0">
              <img
                src="/assets/stou-emblem.svg"
                alt="ตราสัญลักษณ์ มหาวิทยาลัยสุโขทัยธรรมาธิราช"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#004D28] leading-tight">
                มหาวิทยาลัยสุโขทัยธรรมาธิราช
              </h1>
              <p className="text-xs sm:text-sm font-bold text-[#8B6B15]">
                {activeMeta.agency}
              </p>
              <p className="text-sm sm:text-base font-extrabold text-slate-800 mt-1">
                {activeMeta.title}
              </p>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-500 space-y-0.5 flex-shrink-0">
            <p><strong>ช่วงข้อมูล:</strong> {activeMeta.dateRangeText}</p>
            <p><strong>สร้างรายงานเมื่อ:</strong> {activeMeta.generatedAtText}</p>
            <p><strong>เวอร์ชัน:</strong> {activeMeta.quizVersion} (v{activeMeta.appVersion})</p>
            <p className="text-emerald-800 font-bold">ออกแบบและพัฒนาระบบโดย กิรณาภัค สระทองพูน</p>
          </div>
        </div>

        {/* Executive Notice Banner */}
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#006837] flex-shrink-0" />
          <span>{activeMeta.privacyDisclaimer}</span>
        </div>

        {/* Section 1: Executive KPI Cards (คนใช้แอปจริงไหม สนใจเรียนอะไร และสนใจลงลึกหรือไม่) */}
        <div>
          <h2 className="text-sm font-black text-[#004D28] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004D28]" />
            1. ตัวชี้วัดสำคัญระดับผู้บริหาร (Executive KPIs)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-bold block">ผู้เข้าชมทั้งหมด</span>
              <p className="text-2xl font-black text-[#00381D]">{stats.views}</p>
              <span className="text-[10px] text-slate-400">Total Views</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-bold block">เริ่มทำแบบทดสอบ</span>
              <p className="text-2xl font-black text-[#00381D]">{stats.started}</p>
              <span className="text-[10px] text-slate-400">Started Quiz</span>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1">
              <span className="text-[11px] text-[#004D28] font-bold block">ทำแบบทดสอบจบ</span>
              <p className="text-2xl font-black text-[#004D28]">{stats.completed}</p>
              <span className="text-[10px] text-emerald-700 font-bold">จบ {stats.completionRate.toFixed(1)}%</span>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 space-y-1">
              <span className="text-[11px] text-[#8B6B15] font-bold block">คลิกดูหลักสูตรต่อ</span>
              <p className="text-2xl font-black text-[#8B6B15]">{stats.detailClicks}</p>
              <span className="text-[10px] text-[#8B6B15] font-bold">CTR {stats.detailCtr.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Section 2: Conversion & Engagement Funnel */}
        <div>
          <h2 className="text-sm font-black text-[#004D28] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004D28]" />
            2. ขั้นตอนการมีส่วนร่วมและการตอบคำถาม (Engagement Funnel)
          </h2>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            {stats.funnelStages.map((stage) => (
              <div key={stage.stage} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{stage.stageLabel}</span>
                  <span>
                    {formatMin5(stage.count)} คน ({stage.pctOfStarted.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#004D28] h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(2, stage.pctOfStarted))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Persona Distribution */}
        <div>
          <h2 className="text-sm font-black text-[#004D28] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004D28]" />
            3. สัดส่วนกลุ่มเป้าหมาย (Persona Distribution)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#004D28] text-white flex items-center justify-center text-xs">
                  <TrendingUp className="w-4 h-4 text-[#E5C158]" />
                </div>
                <span className="text-xs font-bold text-slate-800">Career Development</span>
              </div>
              <p className="text-xl font-black text-[#004D28]">{formatMin5(stats.personaCounts.career)} คน</p>
              <p className="text-[11px] text-slate-500">
                {stats.completed > 0 ? ((stats.personaCounts.career / stats.completed) * 100).toFixed(1) : 0}% ของผู้ตอบจบ
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#006837] text-white flex items-center justify-center text-xs">
                  <GraduationCap className="w-4 h-4 text-[#E5C158]" />
                </div>
                <span className="text-xs font-bold text-slate-800">Degree Opportunity</span>
              </div>
              <p className="text-xl font-black text-[#006837]">{formatMin5(stats.personaCounts.degree)} คน</p>
              <p className="text-[11px] text-slate-500">
                {stats.completed > 0 ? ((stats.personaCounts.degree / stats.completed) * 100).toFixed(1) : 0}% ของผู้ตอบจบ
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#8B6B15] text-white flex items-center justify-center text-xs">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-800">Upskill / Reskill</span>
              </div>
              <p className="text-xl font-black text-[#8B6B15]">{formatMin5(stats.personaCounts.upskill)} คน</p>
              <p className="text-[11px] text-slate-500">
                {stats.completed > 0 ? ((stats.personaCounts.upskill / stats.completed) * 100).toFixed(1) : 0}% ของผู้ตอบจบ
              </p>
            </div>
          </div>
        </div>

        {/* Key Executive Insights (ไม่เกิน 3 ข้อ) */}
        <div className="p-4 bg-[#F0F7F2] rounded-2xl border border-[#006837]/30 space-y-2">
          <h3 className="text-xs font-bold text-[#004D28] flex items-center gap-1.5 uppercase">
            <CheckCircle2 className="w-4 h-4 text-[#006837]" />
            <span>ข้อสรุปสำคัญสำหรับผู้บริหาร (Executive Insights)</span>
          </h3>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            {insights.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= PAGE 2: TOP INTERESTS & RECOMMENDED PROGRAMS ================= */}
      <section className="space-y-6 pb-6 border-b-2 border-slate-100 print-break-inside-avoid">
        <div className="border-b border-slate-200 pb-2">
          <h2 className="text-base font-black text-[#004D28]">
            4. กลุ่มความสนใจและหลักสูตรยอดนิยม (Interest & Program Preferences)
          </h2>
          <p className="text-xs text-slate-500">
            วิเคราะห์ความต้องการศึกษาต่อตามสาขาวิชาและหลักสูตรมาตรฐาน มสธ. ปี 2569
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Interest Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#006837]" />
              <span>ความสนใจตามกลุ่มสาขา (ข้อที่ 4)</span>
            </h3>
            <div className="space-y-2">
              {Object.entries(stats.interestCounts).map(([key, rawCount], idx) => {
                const count = Number(rawCount) || 0;
                const pct = stats.completed > 0 ? ((count / stats.completed) * 100).toFixed(1) : '0';
                return (
                  <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        {idx + 1}. {interestLabelMap[key] || key}
                      </span>
                      <span className="font-bold text-[#004D28]">
                        {formatMin5(count)} ครั้ง ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#004D28] h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Recommended Programs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#8B6B15]" />
              <span>10 อันดับหลักสูตรที่ได้รับการแนะนำสูงสุด</span>
            </h3>
            <div className="space-y-2">
              {stats.topPrograms.slice(0, 10).map((prog, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-2xs"
                >
                  <div>
                    <p className="font-bold text-slate-800">
                      {idx + 1}. {prog.programName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {prog.schoolName} {prog.majorName ? `• ${prog.majorName}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#004D28] block">
                      {formatMin5(prog.recommendationCount)} ครั้ง
                    </span>
                    <span className="text-[10px] text-slate-400">
                      คลิกดู {formatMin5(prog.detailClickCount)} ครั้ง
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Trend Table (If range available) */}
        {stats.dailyTrends.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#006837]" />
              <span>แนวโน้มสถิติรายวัน (Daily Activity Trends)</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2">วันที่</th>
                    <th className="p-2">ผู้เข้าชม</th>
                    <th className="p-2">เริ่มทำ</th>
                    <th className="p-2">ทำจบ</th>
                    <th className="p-2">อัตราทำจบ</th>
                    <th className="p-2">คลิกหลักสูตร</th>
                    <th className="p-2">ติดต่อศูนย์</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.dailyTrends.map((d) => (
                    <tr key={d.date} className="hover:bg-slate-50">
                      <td className="p-2 font-medium">{d.date}</td>
                      <td className="p-2">{d.views}</td>
                      <td className="p-2">{d.started}</td>
                      <td className="p-2 font-bold text-[#004D28]">{d.completed}</td>
                      <td className="p-2">{d.completionRate.toFixed(1)}%</td>
                      <td className="p-2">{d.detailClicks}</td>
                      <td className="p-2">{d.contactClicks + d.mapClicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ================= PAGE 3: LAMPANG CONTACT & ACTION ITEMS ================= */}
      <section className="space-y-6 pb-6 border-b-2 border-slate-100 print-break-inside-avoid">
        <div className="border-b border-slate-200 pb-2">
          <h2 className="text-base font-black text-[#004D28]">
            5. การเชื่อมโยงบริการและการแนะแนว ศวช. มสธ. ลำปาง (Regional Guidance Impact)
          </h2>
          <p className="text-xs text-slate-500">
            สถิติการติดต่อและข้อเสนอแนะสำหรับการจัดกิจกรรมแนะแนวการศึกษา
          </p>
        </div>

        {/* Contact Intent Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-bold block">โทร 02-504-8686</span>
            <p className="text-xl font-bold text-[#004D28]">{formatMin5(stats.lampangPhone8686)} ครั้ง</p>
            <span className="text-[10px] text-slate-400">สายหลัก ศวช. ลำปาง</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-bold block">โทร 02-504-8684</span>
            <p className="text-xl font-bold text-[#004D28]">{formatMin5(stats.lampangPhone8684)} ครั้ง</p>
            <span className="text-[10px] text-slate-400">สายบริการ 1</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-bold block">โทร 02-504-8687</span>
            <p className="text-xl font-bold text-[#004D28]">{formatMin5(stats.lampangPhone8687)} ครั้ง</p>
            <span className="text-[10px] text-slate-400">สายบริการ 2</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-bold block">เปิดแผนที่ Google Maps</span>
            <p className="text-xl font-bold text-[#8B6B15]">{formatMin5(stats.lampangMapClicks)} ครั้ง</p>
            <span className="text-[10px] text-slate-400">ตำแหน่งที่ตั้ง อ.ห้างฉัตร</span>
          </div>
        </div>

        {/* Action Items for Admissions & Guidance Team */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
          <h3 className="text-xs font-bold text-[#8B6B15] flex items-center gap-1.5 uppercase">
            <BookOpen className="w-4 h-4 text-[#8B6B15]" />
            <span>ข้อเสนอแนะเชิงปฏิบัติการสำหรับทีมรับสมัครและแนะแนว (Action Items)</span>
          </h3>
          <div className="text-xs text-slate-700 space-y-2">
            <p className="leading-relaxed">
              1. <strong>จัดเตรียมเอกสารและคำปรึกษาตามกลุ่มความสนใจอันดับต้น:</strong> เน้นข้อมูลหลักสูตรปริญญาตรีและโครงการสัมฤทธิบัตรในกลุ่มที่ได้รับความนิยมสูงสุด เพื่อรองรับผู้สนใจที่ติดต่อเข้ามา
            </p>
            <p className="leading-relaxed">
              2. <strong>สื่อสารเชิงรุกผ่านศูนย์วิทยบริการฯ ลำปาง:</strong> ติดตามและอำนวยความสะดวกแก่ผู้ที่ต้องการเทียบโอนหน่วยกิต หรือผู้ทำงานประจำที่มองหาหลักสูตรที่ยืดหยุ่น
            </p>
            <p className="leading-relaxed">
              3. <strong>ใช้ผลลัพธ์เป็นฐานข้อมูลแนะแนวในงานนิทรรศการ:</strong> สามารถนำสถิติ Persona ไปใช้ออกแบบบูธกิจกรรมหรือประชาสัมพันธ์หลักสูตรที่ตรงใจกลุ่มเป้าหมายในพื้นที่จังหวัดลำปางและภาคเหนือตอนบน
            </p>
          </div>
        </div>
      </section>

      {/* ================= PAGE 4: DEFINITIONS & PRIVACY NOTICE ================= */}
      <section className="space-y-4 text-xs text-slate-500">
        <div className="border-b border-slate-200 pb-2">
          <h2 className="text-sm font-bold text-slate-700">
            6. คำนิยามและการรักษาความปลอดภัยของข้อมูล (Definitions & Privacy Assurance)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-700">การไม่ระบุตัวตน (Anonymous Design):</p>
            <p>
              ระบบไม่มีการบันทึกชื่อ นามสกุล หมายเลขโทรศัพท์ ที่อยู่อีเมล หมายเลขไอพี (IP Address) หรือตัวระบุเครื่อง ข้อมูลทั้งหมดถูกประมวลผลในรูปแบบผลรวมเชิงสถิติ (Aggregated Data) เท่านั้น
            </p>
          </div>
          <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-700">เกณฑ์การซ่อนตัวเลขต่ำกว่า 5 (k-anonymity):</p>
            <p>
              หมวดคำตอบหรือสถิติที่มีจำนวนน้อยกว่า 5 รายการ จะแสดงเป็น &quot;&lt; 5&quot; เพื่อป้องกันการคาดเดาหรืออนุมานข้อมูลรายบุคคลโดยอ้อมตามมาตรฐานสากล
            </p>
          </div>
        </div>

        {/* Institutional Sign-off */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง | มหาวิทยาลัยสุโขทัยธรรมาธิราช</p>
          <p className="text-slate-600 font-medium">ออกแบบและพัฒนาระบบโดย กิรณาภัค สระทองพูน</p>
        </div>
      </section>
    </div>
  );
};
