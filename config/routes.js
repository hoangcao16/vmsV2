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
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: './exception/404',
      },
    ],
  },

  {
    path: '/live',
    name: 'live',
    icon: 'video-camera',
  },
  {
    path: '/list',
    icon: 'table',
    name: 'list',
    routes: [
      {
        name: 'Danh sách camera',
        icon: 'table',
        path: '/list/camera-list',
        component: './list/camera-list',
      },
    ],
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
    name: 'report',
    icon: 'highlight',
    path: '/report',
    routes: [
      {
        name: 'flow',
        icon: 'smile',
        path: '/report',
        component: './report',
      },
    ],
  },
  {
    path: '/setting-user',
    name: 'setting-user',
    icon: 'setting',
    routes: [
      // {
      //   path: '/setting-user',
      //   redirect: '/setting-user/list-user',
      // },
      {
        name: 'list-user',
        icon: 'smile',
        path: '/setting-user/list-user',
        component: './setting-user/list-user',
      },
      {
        name: 'list-modules',
        icon: 'smile',
        path: '/setting-user/list-module',
        component: './setting-user/list-module',
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
