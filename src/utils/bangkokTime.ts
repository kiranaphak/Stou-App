/**
 * Asia/Bangkok (UTC+7) Date & Time Utilities
 * Ensures all admin filters and statistics represent identical timestamps across all devices.
 */

export const BANGKOK_TZ = 'Asia/Bangkok';

/**
 * Returns current timestamp in milliseconds.
 */
export function getNowBangkokMs(): number {
  return Date.now();
}

/**
 * Formats a Date or timestamp string into Thai date and time using Asia/Bangkok timezone.
 * Example: 28 ส.ค. 2569 14:15:30
 */
export function formatBangkokDateTime(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return '-';

  try {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('th-TH', {
      timeZone: BANGKOK_TZ,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats a Date or timestamp into short date in Bangkok timezone.
 * Example: 28 ส.ค. 2569
 */
export function formatBangkokDateOnly(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return '-';

  try {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('th-TH', {
      timeZone: BANGKOK_TZ,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * Gets Bangkok day start (00:00:00.000 UTC+7) as UTC epoch timestamp.
 * @param daysAgo number of days before today (0 = today)
 */
export function getBangkokStartOfDayTimestamp(daysAgo = 0): number {
  const now = new Date();
  
  // Format to Bangkok YYYY-MM-DD
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: BANGKOK_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find((p) => p.type === 'year')?.value || '2026', 10);
  const month = parseInt(parts.find((p) => p.type === 'month')?.value || '1', 10) - 1;
  const day = parseInt(parts.find((p) => p.type === 'day')?.value || '1', 10);

  // Construct Bangkok Midnight: UTC = Bangkok time - 7 hours
  const bangkokMidnightUtcMs = Date.UTC(year, month, day - daysAgo, -7, 0, 0, 0);
  return bangkokMidnightUtcMs;
}

/**
 * Parses user custom date input (YYYY-MM-DD) into Bangkok start of day (00:00:00) UTC ms.
 */
export function parseBangkokDateToStartMs(dateString: string): number | null {
  if (!dateString) return null;
  try {
    const [y, m, d] = dateString.split('-').map(Number);
    if (!y || !m || !d) return null;
    return Date.UTC(y, m - 1, d, -7, 0, 0, 0);
  } catch {
    return null;
  }
}

/**
 * Parses user custom date input (YYYY-MM-DD) into Bangkok end of day (23:59:59.999) UTC ms.
 */
export function parseBangkokDateToEndMs(dateString: string): number | null {
  if (!dateString) return null;
  try {
    const [y, m, d] = dateString.split('-').map(Number);
    if (!y || !m || !d) return null;
    return Date.UTC(y, m - 1, d + 1, -7, 0, 0, -1);
  } catch {
    return null;
  }
}
