import { getLocale } from 'umi';

export default function getCurrentLocale() {
  const locale = getLocale();

  if (locale.includes('en')) {
    return 'en';
  }
  return 'vn';
}
