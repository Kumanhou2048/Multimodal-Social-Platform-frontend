import {
  deleteNote,
  getLikePostsID,
  getManageUser,
  getUserPost,
  PostLikes,
} from '@/services/ant-design-pro/api';
import { history } from '@@/core/history';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, message, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';

const { Meta } = Card;

interface ManageUser {
  avatarUrl: string;
  userName: string;
}

//点赞
const LikeButton: React.FC<{
  postId: string;
  userAccount?: string;
  likelist: any[]; // likeList 数据格式：[{ postID: number }]
  onLikeChange: (newLikedState: boolean) => void;
}> = ({ postId, userAccount, likelist, onLikeChange }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect 检查是否已经点赞过
  useEffect(() => {
    // 使用 some 来检查 likelist 中是否包含当前 postId
    const isLiked = likelist.some((item) => item.postID === parseInt(postId)); // 通过 postID 比较
    setLiked(isLiked);
  }, [likelist, postId]);

  const handleLike = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (userAccount === currentUser?.userAccount) {
      message.error('不能给自己点赞！');
      return;
    }

    if (loading) return;
    setLoading(true);

    const userId = currentUser?.id;
    const newLikedState = !liked;

    try {
      // 调用点赞 API，传递点赞状态
      const response = await PostLikes({ userID: userId, postID: postId, status: newLikedState });

      if (response.status === 'success') {
        setLiked(newLikedState); // 更新点赞状态
        onLikeChange(newLikedState);
        message.success(newLikedState ? '点赞成功' : '取消点赞成功');
      } else {
        message.error('操作失败，请重试');
      }
    } catch (error) {
      console.error('点赞请求失败', error);
      message.error('请求失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="text"
      icon={liked ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
      onClick={handleLike}
      style={{ fontSize: '24px' }}
    />
  );
};

const Post: React.FC<{
  id: string;
  scr: string;
  avatar_scr: string;
  title: string;
  username: string;
  like: string;
  userAccount1: any;
  userAccount2: any;
  likelist: any[];
}> = ({ id, scr, avatar_scr, title, username, like, userAccount1, userAccount2, likelist }) => {
  const [likeCount, setLikeCount] = useState<number>(parseInt(like, 10));

  const handleClick = () => {
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/post/' + id);
  };

  const handleLikeChange = (newLikeState: boolean) => {
    setLikeCount(newLikeState ? likeCount + 1 : likeCount - 1); // 根据点赞状态更新数量
  };

  // 定义一个函数用于处理删除按钮的点击事件，这里可以添加具体的删除逻辑，比如发送删除请求等
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 阻止事件冒泡，避免触发父元素（Card）的点击事件（handleClick）
    e.stopPropagation();

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇笔记吗？',
      onOk: async () => {
        const result = await deleteNote({
          //把id作为数字传入
          id: parseInt(id, 10),
        });
        if (result === 1) {
          message.success('删除成功');
          setTimeout(() => {
            window.location.reload();
          }, 1000); // 这里设置延迟1秒后刷新页面，时间可根据实际情况调整
          return;
        } else {
          message.error('笔记删除失败');
        }
      },
    });
  };

  const handleAvatarClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/personSetting/managePost/' + userAccount2);
  };

  const deleteButton = (
    <Button
      type="primary"
      style={{
        color: 'white',
        marginLeft: '10px',
      }}
      onClick={handleDeleteClick}
    >
      删除
    </Button>
  );

  return (
    <>
      <Card
        key={id}
        hoverable
        style={{ width: 275, height: 430 }}
        cover={
          <img
            alt="example"
            src={scr}
            style={{
              width: '275px',
              height: '330px',
              objectFit: 'cover',
            }}
          />
        }
        onClick={handleClick}
      >
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Meta title={title} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div onClick={handleAvatarClick}>
              <Avatar src={<img src={avatar_scr} alt="avatar" />} />
            </div>
            <p
              style={{
                fontSize: '13px',
                margin: 0,
                lineHeight: '14px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100px', // 根据字体大小设置宽度限制
              }}
            >
              {username}
            </p>
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <LikeButton
                postId={id}
                userAccount={userAccount2}
                onLikeChange={handleLikeChange}
                likelist={likelist}
              ></LikeButton>
              <p
                style={{
                  fontSize: '12px',
                  margin: 0,
                }}
              >
                {likeCount}
              </p>
              {/* 添加删除按钮，设置按钮的类型、样式以及点击事件处理函数 */}
              {userAccount1 === userAccount2 ? deleteButton : null}
            </div>
          </div>
        </Space>
      </Card>
    </>
  );
};

const PersonManagePost: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<ManageUser | null>(null);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [likeList, setLikeList] = useState<any[]>([]);
  let userAccount = currentUser?.userAccount;
  let { account } = useParams<{ account: string }>();
  if (account === ':account') {
    account = currentUser?.userAccount;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 定义参数时附加 userAccount
        const params = {
          userAccount: account, // 添加 userAccount 参数
        };
        const postsResult = await getUserPost(params);
        const userResult = await getManageUser(params);
        const userid = (): API.UserID => ({ id: currentUser?.id });
        const likeListResult = await getLikePostsID(userid());
        let post: any[] = [];
        let likelist: any[] = [];
        let user: ManageUser;
        user = userResult;
        if (Array.isArray(postsResult)) {
          postsResult.forEach((item) => {
            post.push(item);
          });
        }
        if (Array.isArray(likeListResult)) {
          likeListResult.forEach((item) => {
            likelist.push(item);
          });
        }
        setLikeList(likelist || []);
        setUser(user || []);
        setPosts(post || []);
      } catch (error) {
        console.error('获取数据失败', error);
      }
    };

    fetchData();
  }, [account]);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const pageFromUrl = parseInt(urlParams.get('page') || '1', 10);
  //   const totalPages = Math.ceil(totalPosts / pageSize);
  //
  //   let page = pageFromUrl;
  //   if (pageFromUrl > totalPages) {
  //     page = totalPages;
  //   } else if (pageFromUrl < 1) {
  //     page = 1;
  //   }
  //
  //   setPageNumber(page);
  // }, [totalPosts]);

  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <Card
        style={{
          width: '100%',
          borderRadius: '10px', // 圆角
          border: '1px solid #e0e0e0', // 边框
          backgroundColor: '#fff', // 白色背景
          padding: '20px', // 卡片内边距
          display: 'flex', // 使用 Flex 布局
          justifyContent: 'center', // 水平居中
          alignItems: 'center', // 垂直居中
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center', // 头像和文字垂直居中
          }}
        >
          <Avatar src={user?.avatarUrl} size={70} />
          <div
            style={{
              marginLeft: 16, // 调整头像与文字的间距
            }}
          >
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '25px' }}>
              {user?.userName || '用户名'}
            </p>
            <p style={{ margin: 0, fontSize: '17px', color: '#555' }}>
              小蓝书号：{account || '未知'}
            </p>
          </div>
        </div>
      </Card>
      <Card title="发布的帖子">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'flex-start',
          }}
        >
          {posts.map((post, index) => (
            <Post
              key={index}
              id={post.id}
              scr={post.imageUrl}
              avatar_scr={post.avatarUrl}
              title={post.title}
              username={post.username}
              like={post.likes}
              userAccount1={userAccount}
              userAccount2={account}
              likelist={likeList}
            />
          ))}
        </div>
      </Card>
    </PageContainer>
  );
};

export default PersonManagePost;
