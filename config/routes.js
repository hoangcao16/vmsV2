export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        component: './exception/404',
      },
    ],
  },
  {
    path: '/',
    icon: 'home',
    name: 'home',
    component: './home',
  },
  {
    path: '/map',
    icon: 'environment',
    name: 'map',
    component: './maps',
  },
  {
    path: '/live',
    icon: 'videoCamera',
    name: 'live_mode',
    component: './live/index',
  },
  {
    path: '/storage',
    icon: 'save',
    name: 'storage',
    component: './storage',
  },
  {
    path: '/category',
    icon: 'table',
    name: 'category',
    routes: [
      {
        name: 'camera',
        icon: 'table',
        path: '/category/camera',
        component: './category/camera',
      },
      {
        name: 'administrative-unit',
        icon: 'table',
        path: '/category/administrative-unit',
        component: './category/administrative-unit',
      },
      {
        name: 'list-modules',
        icon: 'smile',
        path: '/category/list-module',
        component: './category/list-module',
      },
      {
        name: 'list-user',
        icon: 'smile',
        path: '/category/list-user',
        component: './category/list-user',
      },
    ],
  },
  {
    path: '/setting-user',
    name: 'setting',
    icon: 'setting',
    component: './setting',
  },
  {
    path: '/report',
    icon: 'notification',
    name: 'report',
    component: './report',
  },
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    hideInMenu: true,
    routes: [
      {
        name: '403',
        icon: 'smile',
        path: '/exception/403',
        component: './exception/403',
      },
      {
        name: '404',
        icon: 'smile',
        path: '/exception/404',
        component: './exception/404',
      },
      {
        name: '500',
        icon: 'smile',
        path: '/exception/500',
        component: './exception/500',
      },
    ],
  },
  {
    path: '/',
    redirect: '/report',
  },
  {
    component: './exception/404',
  },
];
