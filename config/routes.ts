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
  { path: '/publish', name: '发布', icon: 'PlusOutlined', component: './Welcome' },
  { path: '/search/:key', name: '搜索页', component: './Search', hideInMenu: true },
  { path: '/post/:id', name: '帖子详情', component: './Post', hideInMenu: true },
  // 设置用户信息（提取出来作为一级页面）
  {
    path: '/personInfoSetting',
    name: '个人设置',
    icon: 'SettingOutlined',
    component: './personInfoSetting',
  },
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
  //{ name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
