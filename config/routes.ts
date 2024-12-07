export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
      { name: '重置密码', path: '/user/resetpassword', component: './User/ResetPassword' },
    ],
  },
  { path: '/welcome', name: '首页', icon: 'smile', component: './Welcome' },
  //个人、发布 地址没改
  { path: '/home', name: '个人', icon: 'UserOutlined', component: './Welcome' },
  { path: '/publish', name: '发布', icon: 'PlusOutlined', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  { path: '/post/:id', name: '帖子详情', component: './Post', hideInMenu: true },
  //{ name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
