export function convertDateTime(date: Date): string {
  const thaiDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));

  const year = thaiDate.getFullYear();
  const month = String(thaiDate.getMonth() + 1).padStart(2, '0');
  const day = String(thaiDate.getDate()).padStart(2, '0');
  const hours = String(thaiDate.getHours()).padStart(2, '0');
  const minutes = String(thaiDate.getMinutes()).padStart(2, '0');
  const seconds = String(thaiDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
