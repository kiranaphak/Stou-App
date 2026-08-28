import React from 'react';
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react';
import { lampangCenter } from '../data/config';
import { trackEvent, APP_VERSION } from '../lib/firebase';

interface LampangContactCardProps {
  className?: string;
}

export const LampangContactCard: React.FC<LampangContactCardProps> = ({ className = '' }) => {
  const handlePhoneClick = (phoneKey: '8686' | '8684' | '8687') => {
    try {
      trackEvent('lampang_center_contact_clicked', {
        contact_method: 'phone',
        phone_number_key: phoneKey,
        app_version: APP_VERSION,
      });
    } catch {
      // Ignore analytics failure
    }
  };

  const handleMapClick = () => {
    try {
      trackEvent('lampang_center_map_clicked', {
        location_key: 'stou_lampang',
        app_version: APP_VERSION,
      });
    } catch {
      // Ignore analytics failure
    }
  };

  // Determine valid Google Maps destination URL
  const resolvedMapUrl =
    lampangCenter.mapUrl && lampangCenter.mapUrl !== 'REPLACE_WITH_VERIFIED_GOOGLE_MAPS_URL'
      ? lampangCenter.mapUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          'ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง'
        )}`;

  return (
    <div
      id="lampang-center-contact-card"
      className={`bg-white rounded-3xl p-5 sm:p-6 border border-[#006837]/20 shadow-sm space-y-4 ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-[#004D28] text-[#E5C158] flex items-center justify-center flex-shrink-0 shadow-2xs">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-[#006837] block uppercase tracking-wider">
            ติดต่อสอบถาม
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-[#00381D] leading-tight">
            {lampangCenter.name}
          </h3>
          <p className="text-xs text-[#8B6B15] font-semibold">
            {lampangCenter.shortName}
          </p>
        </div>
      </div>

      {/* Info Details: Address, Hours, Phones */}
      <div className="space-y-3 text-xs sm:text-sm text-slate-700">
        {/* Address */}
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-[#006837] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-500 block">ที่อยู่</span>
            <p className="text-slate-800 leading-snug">{lampangCenter.address}</p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-[#006837] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-500 block">วันและเวลาให้บริการ</span>
            <p className="text-slate-800 leading-snug">{lampangCenter.serviceHours.weekdays}</p>
            <p className="text-[11px] text-slate-500 leading-snug">{lampangCenter.serviceHours.holidays}</p>
          </div>
        </div>

        {/* Phone Numbers List */}
        <div className="flex items-start gap-2.5">
          <Phone className="w-4 h-4 text-[#006837] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 block">เบอร์โทรศัพท์ติดต่อ</span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {lampangCenter.phones.map((phoneItem) => (
                <a
                  key={phoneItem.key}
                  href={`tel:${phoneItem.raw}`}
                  onClick={() => handlePhoneClick(phoneItem.key)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F0F7F2] hover:bg-[#E2EFE6] text-[#004D28] font-bold text-xs border border-[#006837]/25 transition-colors cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-[#006837]" />
                  <span>{phoneItem.number}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons: Map Button (min-height 44px) with target="_blank" and rel="noopener noreferrer" */}
      <div className="pt-2">
        <a
          id="btn-open-lampang-map"
          href={resolvedMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleMapClick}
          className="w-full min-h-[44px] px-4 py-3 rounded-2xl bg-[#004D28] hover:bg-[#00381D] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
        >
          <MapPin className="w-4 h-4 text-[#E5C158]" />
          <span>เปิดแผนที่</span>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
        </a>
      </div>
    </div>
  );
};
