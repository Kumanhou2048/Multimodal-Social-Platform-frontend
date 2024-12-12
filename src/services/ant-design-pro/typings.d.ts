// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    id: number;
    username: string;
    userAccount: string;
    userPassword: string;
    avatarUrl: string;
    gender: number;
    userRole: number;
  };

  type LoginResult = {
    status?: string;
    type?: string;
  };

  type RegisterResult = number;

  type ResetResult = number;

  type UpdateResult = number;

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    userAccount?: string;
    userPassword?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type RegisterParams = {
    userAccount?: string;
    userPassword?: string;
    checkPassword?: string;
    username?: string;
    gender?: string;
    type?: string;
  };

  type updateParams = {
    userAccount?: string;
    username?: string;
    gender?: string;
    type?: string;
  };

  type newPersonInfoParams = {
    userAccount?: string;
    userPassword?: string;
    checkPassword?: string;
    username?: string;
    gender?: string;
    avatarUrl?: string;
    type?: string;
  };

  type avaterParams = {};

  type ResetParams = {
    userAccount?: string;
    userPassword?: string;
    checkPassword?: string;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type TotalPosts = {
    total: number;
  };

  type HomePagePost = {
    posts: Post[];
  };

  type LikesMessage = {
    status?: string;
  };

  type SearchPagePost = {
    posts: Post[];
  };

  type TotalSearchPosts = {
    total: number;
  };

  type PostDetails = {
    posterAvatarUrl: string;
    posterName: string;
    postTime: string;
    postTitle: string;
    postContent: string;
  };

  type PostPicture = {
    pictures: Picture[];
  };

  type PostComment = {
    comments: Comment[];
  };

  type MakeAComment = {
    status: string;
  };
}
