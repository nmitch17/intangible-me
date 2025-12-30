/**
 * Convert a local date/time string in a specific timezone to UTC ISO string
 *
 * Strategy: We create a Date object as if the input is UTC, then format it
 * in the target timezone. The difference tells us the timezone offset.
 * We then apply the reverse offset to get the correct UTC time.
 *
 * @param localDateTimeString - Local date/time in format "YYYY-MM-DDTHH:mm:ss"
 * @param timezone - IANA timezone string (e.g., "America/New_York", "Europe/London")
 * @returns UTC datetime as ISO string
 */
export function convertToUTC(localDateTimeString: string, timezone: string): string {
  // Parse the input date/time components
  const [datePart, timePart] = localDateTimeString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second = 0] = timePart.split(':').map(Number);

  // Create a Date treating our input as if it were UTC
  const asIfUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  // Format this date in the target timezone to see what local time it represents
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(asIfUtc);
  const getValue = (type: string) => parts.find(p => p.type === type)?.value || '00';

  const tzYear = parseInt(getValue('year'));
  const tzMonth = parseInt(getValue('month'));
  const tzDay = parseInt(getValue('day'));
  const tzHour = parseInt(getValue('hour'));
  const tzMinute = parseInt(getValue('minute'));
  const tzSecond = parseInt(getValue('second'));

  // Calculate the offset: how different is the TZ representation from our input?
  const tzAsUtc = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, tzSecond);
  const offset = asIfUtc.getTime() - tzAsUtc;

  // Apply the offset: to convert from local time to UTC, we add the offset
  // (offset is positive for timezones behind UTC, e.g., UTC-7 has offset of +7 hours)
  const correctUtc = new Date(asIfUtc.getTime() + offset);

  return correctUtc.toISOString();
}
