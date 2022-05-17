import React from 'react';
import { useIntl } from 'umi';

let intl;

export function IntlGlobalProvider({ children }) {
  intl = useIntl();
  return children;
}

export function appIntl() {
  return intl;
}
