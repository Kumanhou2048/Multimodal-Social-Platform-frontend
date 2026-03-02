import {
  getHomePagePost,
  getLikePostsID,
  getTotalPosts,
  PostLikes,
} from '@/services/ant-design-pro/api';
import { history } from '@umijs/max'; // 修复导入路径
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, message, Pagination, Space, Spin, Empty, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Text } = Typography;

// --- 子组件：点赞按钮 ---
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
    } catch (error) {
      message.error('操作失败');
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
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
      }}
    />
  );
};

// --- 子组件：瀑布流卡片 ---
const PostCard: React.FC<{
  id: string;
  scr: string;
  avatar_scr: string;
  title: string;
  username: string;
  like: string;
  userAccount?: string;
  likelist: any[];
  index: number;
}> = ({ id, scr, avatar_scr, title, username, like, userAccount, likelist, index }) => {
  const [likeCount, setLikeCount] = useState<number>(parseInt(like, 10));

  // 定义一组循环高度，造成随机错落的视觉效果
  const heights = [260, 340, 300, 380, 280];
  const photoHeight = heights[index % heights.length];

  return (
    <Card
      hoverable
      bordered={false}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        marginBottom: '20px', // 瀑布流纵向间距
        breakInside: 'avoid', // 核心属性：防止卡片被分页切割
      }}
      bodyStyle={{ padding: '12px' }}
      cover={
        <div style={{ overflow: 'hidden', height: `${photoHeight}px`, position: 'relative' }}>
          <img
            alt={title}
            src={scr}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
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
          marginBottom: '10px',
          cursor: 'pointer',
          lineHeight: '1.4',
        }}
        onClick={() => history.push(`/post/${id}`)}
      >
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
          {title}
        </Typography.Paragraph>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space
          size={6}
          style={{ cursor: 'pointer' }}
          onClick={() => history.push(`/personSetting/managePost/${userAccount}`)}
        >
          <Avatar size={22} src={avatar_scr} />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {username}
          </Text>
        </Space>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8f9fa',
            padding: '2px 8px 2px 4px',
            borderRadius: '20px',
          }}
        >
          <LikeButton
            postId={id}
            onLikeChange={(state) => setLikeCount(state ? likeCount + 1 : likeCount - 1)}
            userAccount={userAccount}
            likelist={likelist}
          />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#444', marginLeft: '-2px' }}>
            {likeCount}
          </span>
        </div>
      </div>
    </Card>
  );
};

// --- 主页面：Welcome ---
const Welcome: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [likeList, setLikeList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const pageSize = 12;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsResult, totalPostsResult, likeListResult] = await Promise.all([
        getHomePagePost({ index: pageNumber }),
        getTotalPosts(),
        getLikePostsID({ id: currentUser?.id }),
      ]);

      setPosts(Array.isArray(postsResult) ? postsResult : []);
      setTotalPosts(Number(totalPostsResult) || 0);
      setLikeList(Array.isArray(likeListResult) ? likeListResult : []);
    } catch (error) {
      console.error('获取数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNumber]);

  const onPageChange = (page: number) => {
    setPageNumber(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 更新 URL 参数但不刷新页面
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.history.pushState({}, '', url.toString());
  };

  return (
    <PageContainer title={false} ghost>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 10px' }}>
        <Spin spinning={loading} tip="正在为你发现有趣的内容...">
          {posts.length > 0 ? (
            <div
              style={
                {
                  columnCount: posts.length > 0 ? 5 : 1, // 默认5列
                  columnGap: '20px', // 列间距
                  // 响应式微调（简单实现）
                  width: '100%',
                  // 使用内联样式根据屏幕宽度调整列数
                  ...(window.innerWidth < 1200 ? { columnCount: 4 } : {}),
                  ...(window.innerWidth < 992 ? { columnCount: 3 } : {}),
                  ...(window.innerWidth < 768 ? { columnCount: 2 } : {}),
                } as React.CSSProperties
              }
            >
              {posts.map((post, index) => (
                <PostCard
                  key={post.id}
                  index={index}
                  id={post.id}
                  scr={post.imageUrl}
                  avatar_scr={post.avatarUrl}
                  title={post.title}
                  username={post.username}
                  like={post.likes}
                  userAccount={post.userAccount}
                  likelist={likeList}
                />
              ))}
            </div>
          ) : (
            !loading && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="还没有发现新笔记，去关注一下别人吧"
                style={{ marginTop: 100 }}
              />
            )
          )}
        </Spin>

        {totalPosts > pageSize && (
          <div
            style={{
              marginTop: '60px',
              paddingBottom: '40px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Pagination
              current={pageNumber}
              total={totalPosts}
              pageSize={pageSize}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      <style>{`
        /* 针对不同屏幕宽度的响应式补丁 */
        @media (max-width: 1400px) { .welcome-masonry { column-count: 4; } }
        @media (max-width: 1100px) { .welcome-masonry { column-count: 3; } }
        @media (max-width: 768px) { .welcome-masonry { column-count: 2; } }
      `}</style>
    </PageContainer>
  );
};

export default Welcome;
