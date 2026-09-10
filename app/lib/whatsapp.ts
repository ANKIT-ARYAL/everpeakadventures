/** WhatsApp links require an international number with digits only. */
export function whatsappUrl(number: string): string {
  let digits = number.replace(/\D/g, '').replace(/^00/, '');
  if (/^9\d{9}$/.test(digits)) digits = `977${digits}`;
  return `https://wa.me/${digits}`;
}
