import {
  deleteNote,
  getLikePostsID,
  getManageUser,
  getUserPost,
  PostLikes,
} from '@/services/ant-design-pro/api';
import { history } from '@@/core/history';
import {
  LikeFilled,
  LikeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  message,
  Modal,
  Space,
  Typography,
  Row,
  Col,
  Empty,
  Tag,
  Divider,
  Spin, // 👈 引入了 Spin
} from 'antd';
import React, { useEffect, useState } from 'react';

const { Text, Title } = Typography;

// --- 点赞按钮组件 ---
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
    const isLiked = likelist.some((item) => item.postID === parseInt(postId));
    setLiked(isLiked);
  }, [likelist, postId]);

  const handleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (userAccount === currentUser?.userAccount) {
      message.warning('不能给自己点赞哦');
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

// --- 帖子卡片组件 ---
const Post: React.FC<{
  id: string;
  scr: string;
  title: string;
  like: string;
  isOwner: boolean;
  likelist: any[];
}> = ({ id, scr, title, like, isOwner, likelist }) => {
  const [likeCount, setLikeCount] = useState<number>(parseInt(like, 10));

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.confirm({
      title: '确认删除笔记？',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: '删除后内容将无法找回，请谨慎操作。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
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
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [likeList, setLikeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // 👈 现在这里将被使用

  let { account } = useParams<{ account: string }>();
  if (!account || account === ':account') {
    account = currentUser?.userAccount;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 👈 开始加载
      try {
        const params = { userAccount: account };
        const [postsResult, userResult, likeListResult] = await Promise.all([
          getUserPost(params),
          getManageUser(params),
          getLikePostsID({ id: currentUser?.id }),
        ]);

        setPosts(Array.isArray(postsResult) ? postsResult : []);
        setUser(userResult);
        setLikeList(Array.isArray(likeListResult) ? likeListResult : []);
      } catch (error) {
        message.error('加载数据失败');
      } finally {
        setLoading(false); // 👈 结束加载
      }
    };
    fetchData();
  }, [account, currentUser?.id]);

  const isOwner = currentUser?.userAccount === account;

  return (
    <PageContainer title={false} ghost>
      {/* 核心：使用 Spin 包裹内容，解决 ESLint 报错并优化体验 */}
      <Spin spinning={loading} tip="正在获取精彩内容...">
        <div style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
          {/* 顶部个人资料卡片 */}
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
                    账号：<Text strong>{account}</Text>
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
              {isOwner && (
                <Button shape="round" onClick={() => history.push('/personSetting/infoSetting')}>
                  编辑资料
                </Button>
              )}
            </div>
          </Card>

          {/* 帖子列表区 */}
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
