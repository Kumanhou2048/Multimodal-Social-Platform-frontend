import {
  getLikePostsID,
  getSearchPagePost,
  getTotalSearchPosts,
  PostLikes,
} from '@/services/ant-design-pro/api';
import { history } from '@@/core/history';
import { useParams } from '@@/exports';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, message, Space, Row, Col, Typography, Empty, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

const { Text } = Typography;

// --- 子组件：点赞按钮 (同步之前的精致风格) ---
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
      style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}
    />
  );
};

// --- 子组件：搜索结果帖子卡片 ---
const PostCard: React.FC<{
  id: string;
  scr: string;
  avatar_scr: string;
  title: string;
  username: string;
  like: string;
  searchKey: string;
  userAccount?: string;
  likelist: any[];
}> = ({ id, scr, avatar_scr, title, username, like, searchKey, userAccount, likelist }) => {
  const [likeCount, setLikeCount] = useState<number>(parseInt(like, 10));

  // 关键词高亮函数：优化了背景色和圆角
  const highlightText = (text: string, key: string) => {
    if (!key) return text;
    const parts = text.split(new RegExp(`(${key})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === key.toLowerCase() ? (
        <span key={index} style={{ background: '#fff566', padding: '0 2px', borderRadius: '2px' }}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <Card
      hoverable
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: 'none',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      }}
      bodyStyle={{ padding: '12px' }}
      cover={
        <div style={{ height: '260px', overflow: 'hidden' }}>
          <img
            alt={title}
            src={scr}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onClick={() => history.push(`/post/${id}`)}
          />
        </div>
      }
    >
      <div
        style={{
          fontSize: '15px',
          fontWeight: 600,
          height: '22px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: '12px',
          cursor: 'pointer',
        }}
        onClick={() => history.push(`/post/${id}`)}
      >
        {highlightText(title, searchKey)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space
          size={8}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/personSetting/managePost/${userAccount}`);
          }}
        >
          <Avatar size={24} src={avatar_scr} />
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {username}
          </Text>
        </Space>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8f9fa',
            padding: '2px 8px 2px 4px',
            borderRadius: '15px',
          }}
        >
          <LikeButton
            postId={id}
            onLikeChange={(state) => setLikeCount(state ? likeCount + 1 : likeCount - 1)}
            userAccount={userAccount}
            likelist={likelist}
          />
          <span style={{ fontSize: '12px', fontWeight: 500, color: '#444' }}>{likeCount}</span>
        </div>
      </div>
    </Card>
  );
};

// --- 主页面 ---
const SearchPage: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const { time } = useParams<{ time: string }>(); // time 用于触发刷新
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [likeList, setLikeList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const searchKey = { key };
        // 并发请求优化
        const [postsResult, totalResult, likeResult] = await Promise.all([
          getSearchPagePost(searchKey),
          getTotalSearchPosts(searchKey),
          getLikePostsID({ id: currentUser?.id }),
        ]);

        setPosts(Array.isArray(postsResult) ? postsResult : []);
        setTotalPosts(Number(totalResult) || 0);
        setLikeList(Array.isArray(likeResult) ? likeResult : []);
      } catch (error) {
        console.error('获取搜索数据失败', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [key, time]);

  return (
    <PageContainer
      title={false}
      ghost
      content={
        <div style={{ padding: '8px 0' }}>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            关于 “
            <Text strong color="red">
              {key}
            </Text>
            ” 的搜索结果，共 {totalPosts} 条
          </Text>
        </div>
      }
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Spin spinning={loading} tip="正在搜索...">
          {posts.length > 0 ? (
            <Row gutter={[20, 24]}>
              {posts.map((post) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={post.id}>
                  <PostCard
                    id={post.id}
                    scr={post.imageUrl}
                    avatar_scr={post.avatarUrl}
                    title={post.title}
                    username={post.username}
                    like={post.likes}
                    searchKey={key || ''}
                    userAccount={post.userAccount}
                    likelist={likeList}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            !loading && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="换个关键词试试吧，没找到相关内容"
                style={{ marginTop: 100 }}
              />
            )
          )}
        </Spin>
      </div>
    </PageContainer>
  );
};

export default SearchPage;
