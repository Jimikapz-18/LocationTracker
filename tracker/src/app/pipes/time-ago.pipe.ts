import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';

    const s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 30)  return 'just now';
    if (s < 60)  return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60)  return m === 1 ? '1 min ago' : `${m} min ago`;
    const h = Math.floor(m / 60);
    if (h < 24)  return h === 1 ? '1 hr ago'  : `${h} hrs ago`;
    const d = Math.floor(h / 24);
    return d === 1 ? 'yesterday' : `${d} days ago`;
  }
}
