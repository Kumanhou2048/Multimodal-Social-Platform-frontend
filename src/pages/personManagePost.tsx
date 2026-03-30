import {
  deleteNote,
  Follows,
  getFollowings,
  getLikePostsID,
  getManageUser,
  getUserPost,
  PostLikes,
} from '@/services/ant-design-pro/api';
import { history } from '@@/core/history';
import {
  DeleteOutlined,
  LikeFilled,
  LikeOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

const { Text, Title } = Typography;

// --- 点赞按钮组件 (保持不变) ---
const LikeButton: React.FC<{
  postId: string;
  userAccount?: string;
  likelist: any[];
  onLikeChange: (newLikedState: boolean) => void;
}> = ({ postId, userAccount, likelist, onLikeChange }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const isLiked = likelist.some((item) => item.postID === parseInt(postId, 10));
    setLiked(isLiked);
  }, [likelist, postId]);

  const handleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!currentUser) {
      message.warning('请先登录');
      return;
    }
    if (userAccount === currentUser?.userAccount) {
      message.warning('不能给自己点赞哦！');
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const newLikedState = !liked;
      const response = await PostLikes({
        userID: currentUser?.id,
        postID: postId,
        status: newLikedState,
      });
      if (response.status === 'success') {
        setLiked(newLikedState);
        onLikeChange(newLikedState);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="text"
      size="small"
      icon={liked ? <LikeFilled style={{ color: '#ff4d4f' }} /> : <LikeOutlined />}
      onClick={handleLike}
      style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}
    />
  );
};

// --- 帖子卡片组件 (保持不变) ---
const Post: React.FC<{
  id: string;
  scr: string;
  title: string;
  like: string;
  isOwner: boolean;
  likelist: any[];
  userAccount: string;
}> = ({ id, scr, title, like, isOwner, likelist, userAccount }) => {
  const [likeCount, setLikeCount] = useState<number>(parseInt(like, 10));
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.confirm({
      title: '确认删除笔记？',
      okText: '确认删除',
      okType: 'danger',
      onOk: async () => {
        const result = await deleteNote({ id: parseInt(id, 10) });
        if (result === 1) {
          message.success('已删除');
          window.location.reload();
        }
      },
    });
  };

  return (
    <Card
      hoverable
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
      bodyStyle={{ padding: '12px' }}
      cover={
        <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
          <img
            alt={title}
            src={scr}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onClick={() => history.push(`/post/${id}`)}
          />
          {isOwner && (
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.8 }}
            />
          )}
        </div>
      }
    >
      <Title level={5} ellipsis={{ rows: 1 }} style={{ marginBottom: '8px', fontSize: '15px' }}>
        {title}
      </Title>
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px' }}
      >
        <LikeButton
          postId={id}
          userAccount={userAccount}
          likelist={likelist}
          onLikeChange={(state) => setLikeCount(state ? likeCount + 1 : likeCount - 1)}
        />
        <Text type="secondary" style={{ fontSize: '13px' }}>
          {likeCount}
        </Text>
      </div>
    </Card>
  );
};

// --- 主页面 ---
const PersonManagePost: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [likeList, setLikeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 关注状态相关 ---
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  let { account } = useParams<{ account: string }>();

  // URL 占位符修正
  useEffect(() => {
    if ((!account || account === ':account') && currentUser?.userAccount) {
      history.replace(`/personSetting/managePost/${currentUser.userAccount}`);
    }
  }, [account, currentUser]);

  const activeAccount = account && account !== ':account' ? account : currentUser?.userAccount;
  const isOwner = currentUser?.userAccount === activeAccount;

  const fetchData = async () => {
    if (!activeAccount) return;
    setLoading(true);
    try {
      // 1. 发起数据请求
      // 注意：这里我们同时请求了【我的关注列表】，用来判断是否关注了当前页面的主人
      const [postsResult, userResult, likeListResult, followingsResult] = await Promise.all([
        getUserPost({ userAccount: activeAccount }),
        getManageUser({ userAccount: activeAccount }),
        getLikePostsID({ id: currentUser?.id }),
        // 只有在查看别人主页时，才去查自己的关注列表
        !isOwner && currentUser?.userAccount
          ? getFollowings({ account: currentUser.userAccount })
          : Promise.resolve({ data: [] }),
      ]);

      setPosts(Array.isArray(postsResult) ? postsResult : []);
      setUser(userResult);
      setLikeList(Array.isArray(likeListResult) ? likeListResult : []);

      // 2. 核心逻辑：利用 getFollowings 的返回结果匹配 isFollowed
      // 假设 followingsResult 返回的结构是 { data: [{ account: 'xxx' }, ...] }
      if (!isOwner && followingsResult?.data) {
        const followed = followingsResult.data.some((item: any) => item.account === activeAccount);
        setIsFollowed(followed);
      }
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeAccount, currentUser?.id]);

  const handleFollow = async () => {
    if (!currentUser) {
      message.warning('请先登录');
      return;
    }
    setFollowLoading(true);
    try {
      const res = await Follows({
        followerAccount: currentUser?.userAccount,
        followingAccount: activeAccount,
      });
      // 这里的 res.data 通常是 toggle 后的最新状态（true/false），或者根据你的后端逻辑处理
      if (res.code === 0) {
        setIsFollowed(!isFollowed);
        message.success(!isFollowed ? '关注成功' : '已取消关注');
      }
    } catch (e) {
      message.error('操作失败');
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <PageContainer title={false} ghost>
      <Spin spinning={loading} tip="正在获取精彩内容...">
        <div style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
          <Card
            bordered={false}
            style={{
              borderRadius: '20px',
              marginBottom: '24px',
              background: 'linear-gradient(to right, #ffffff, #f0f7ff)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
              <Avatar
                src={user?.avatarUrl}
                size={100}
                style={{ border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <div style={{ marginLeft: '32px', flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <Title level={2} style={{ margin: 0 }}>
                    {user?.userName || (loading ? '加载中...' : '未知用户')}
                  </Title>
                  {isOwner && <Tag color="blue">我的主页</Tag>}
                </div>
                <Space split={<Divider type="vertical" />} style={{ color: '#666' }}>
                  <Text type="secondary">
                    账号：<Text strong>{activeAccount}</Text>
                  </Text>
                  <Text type="secondary">
                    笔记：<Text strong>{posts.length}</Text>
                  </Text>
                  <Text type="secondary">
                    获赞：
                    <Text strong>
                      {posts.reduce((acc, cur) => acc + (parseInt(cur.likes) || 0), 0)}
                    </Text>
                  </Text>
                </Space>
              </div>

              {/* 按钮区域 */}
              <div style={{ marginLeft: 'auto' }}>
                {isOwner ? (
                  <Button shape="round" onClick={() => history.push('/personSetting/infoSetting')}>
                    编辑资料
                  </Button>
                ) : (
                  <Button
                    type={isFollowed ? 'default' : 'primary'}
                    shape="round"
                    loading={followLoading}
                    icon={isFollowed ? <UserDeleteOutlined /> : <UserAddOutlined />}
                    onClick={handleFollow}
                  >
                    {isFollowed ? '已关注' : '关注TA'}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 600 }}>全部动态</span>}
            bordered={false}
            style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
          >
            {posts.length > 0 ? (
              <Row gutter={[20, 24]}>
                {posts.map((post) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={post.id}>
                    <Post
                      id={post.id}
                      scr={post.imageUrl}
                      title={post.title}
                      like={post.likes}
                      isOwner={isOwner}
                      likelist={likeList}
                      userAccount={post.userAccount || activeAccount}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              !loading && <Empty description="还没有发布过笔记呢" style={{ padding: '60px 0' }} />
            )}
          </Card>
        </div>
      </Spin>
    </PageContainer>
  );
};

export default PersonManagePost;
