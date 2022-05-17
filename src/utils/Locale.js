import { getLocale } from 'umi';

export default function getCurrentLocale() {
  const locale = getLocale();

  if (locale.includes('vn')) {
    return 'vn';
  }
  return 'en';
}
