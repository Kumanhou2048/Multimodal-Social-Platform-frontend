// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/register/account */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.RegisterResult>('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 重置密码接口 POST /api/register/account */
export async function reset(body: API.ResetParams, options?: { [key: string]: any }) {
  return request<API.ResetResult>('/api/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

/*
获取首页帖子的信息 输入一个数字index 返回按时间排序 index*12-12 ~ index * 12的帖子
请返回如下信息
  res.send({
    "posts": [
      {
        "imageUrl": "https://s1.imagehub.cc/images/2024/12/06/438bd75e9bf65736dfb1fcff1cea48f7.md.jpg",
        "avatarUrl": "https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg",
        "title": "Post 1",
        "username": "Kuman",
        "likes": "114514"
      },
      ...
     ]
    }
   );
*/
export async function getHomePagePost(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/getHomePagePost', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
/*
获取所有帖子的数量
请返回如下信息
  res.send({
    total:"100"
  });
*/
export async function getTotalPosts(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/getTotalPosts', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
