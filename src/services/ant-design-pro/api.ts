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

/** 注册接口 POST /api/register/account */
export async function update(body: API.updateParams, options?: { [key: string]: any }) {
  return request<API.UpdateResult>('/api/update', {
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

//获取首页帖子的信息 输入参数一个数字index 返回按时间排序 index*12-12 ~ index * 12的帖子
/** 获取首页帖子的信息 POST /api/getHomePagePost */
export async function getHomePagePost(body: API.HomePageIndex, options?: { [key: string]: any }) {
  return request<API.HomePagePost>('/api/getHomePagePost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
//获取所有帖子的数量
/** 获取所有帖子的数量 POST /api/getTotalPosts */
export async function getTotalPosts() {
  return request<API.TotalPosts>('/api/getTotalPosts', {
    method: 'GET',
  });
}

//给某个帖子点赞 输入点赞者id 点赞的帖子id 一个布尔值 true代表点赞 false代表取消点赞
/** 给某个帖子点赞 PATCH /api/Likes **/
export async function Likes(data: { userId: any; postId: string; newLikedState: boolean }) {
  return request<API.LikesMessage>('/api/Likes', {
    method: 'PATCH',
    data: {
      userId: data.userId,
      postId: data.postId,
      newLikedState: data.newLikedState,
    },
  });
}

//获取搜索页帖子的信息 输入参数string key 返回标题或者内容有key的帖子
/** 获取首页帖子的信息 POST /api/getSearchPagePost */
export async function getSearchPagePost(body: API.SearchKey, options?: { [key: string]: any }) {
  return request<API.SearchPagePost>('/api/getSearchPagePost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

//获取符合搜索帖子的数量
/** 获取所有帖子的数量 POST /api/getTotalSearchPosts */
export async function getTotalSearchPosts(body: API.SearchKey, options?: { [key: string]: any }) {
  return request<API.TotalSearchPosts>('/api/getTotalSearchPosts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

//根据帖子ID返回帖子的详细信息
/** 获取帖子的详细信息 POST /api/getPostDetail */
export async function getPostDetail(body: API.PostID, options?: { [key: string]: any }) {
  return request<API.PostDetails>('/api/getPostDetail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

//根据帖子ID返回该帖子的全部图片
/** 获取帖子的全部图片 POST /api/getPostPicture*/
export async function getPostPicture(body: API.PostID, options?: { [key: string]: any }) {
  return request<API.PostPicture>('/api/getPostPicture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

//根据帖子ID返回该帖子的评论
/** 获取帖子的全部图片 POST /api/getPostComment*/
export async function getPostComment(body: API.PostID, options?: { [key: string]: any }) {
  return request<API.PostComment>('/api/getPostComment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

//发表评论
/** 发表评论 POST /api/makeAComment*/
export async function makeAComment(body: API.Comment, options?: { [key: string]: any }) {
  return request<API.MakeAComment>('/api/makeAComment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
