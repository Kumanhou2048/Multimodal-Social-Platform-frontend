import {
  getLikePostsID,
  getPostComment,
  getPostDetail,
  getPostPicture,
  makeAComment,
  PostLikes,
} from '@/services/ant-design-pro/api';
import { history } from '@@/core/history';
import { LikeFilled, LikeOutlined, SendOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Divider,
  Image,
  List,
  message,
  Input,
  Space,
  Typography,
  Empty,
} from 'antd';
import React, { useEffect, useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// --- 样式常量优化 ---
const carouselWrapperStyle: React.CSSProperties = {
  position: 'relative',
  background: '#1a1a1a',
  borderRadius: '16px',
  overflow: 'hidden',
  marginBottom: '24px',
  boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
};

const imgContainerStyle: React.CSSProperties = {
  height: '600px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const blurBgStyle = (src: string): React.CSSProperties => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(20px) brightness(0.7)',
  transform: 'scale(1.1)',
});

// --- 子组件：点赞按钮 ---
const LikeButton: React.FC<{
  postId: any;
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
      message.warning('小提示：不能给自己点赞哦');
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
      shape="circle"
      icon={
        liked ? (
          <LikeFilled style={{ color: '#ff4d4f', fontSize: '24px' }} />
        ) : (
          <LikeOutlined style={{ fontSize: '24px' }} />
        )
      }
      onClick={handleLike}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    />
  );
};

// --- 主组件 ---
const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<any>(null);
  const [pictures, setPictures] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [textBoxContent, setTextBoxContent] = useState('');
  const [likeCount, setLikeCount] = useState<number>(0);
  const [likeList, setLikeList] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [currentPicIndex, setCurrentPicIndex] = useState(0); // 图片索引

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const fetchData = async () => {
    try {
      const postid = { id };
      const [resPost, resPics, resComments, resLikes] = await Promise.all([
        getPostDetail(postid),
        getPostPicture(postid),
        getPostComment(postid),
        getLikePostsID({ id: currentUser?.id }),
      ]);

      setPosts(resPost);
      setPictures(Array.isArray(resPics) ? resPics : []);
      setComments(Array.isArray(resComments) ? resComments : []);
      setLikeList(Array.isArray(resLikes) ? resLikes : []);
      setLikeCount(resPost?.like || 0);
    } catch (error) {
      console.error('Data fetch failed', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!textBoxContent.trim()) {
      message.warning('内容不能为空');
      return;
    }
    setSubmitting(true);
    try {
      const status = await makeAComment({
        userId: currentUser?.id,
        postId: id,
        content: textBoxContent,
      });
      if (status.status === 'success') {
        message.success('评论已发布');
        setTextBoxContent('');
        fetchData();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const navToUser = (account: string) => {
    history.push(`/personSetting/managePost/${account}`);
  };

  return (
    <PageContainer title={false} ghost>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* 1. 图片展示区 - 优化切换与显示 */}
        <div style={carouselWrapperStyle}>
          <Carousel
            arrows
            infinite
            draggable
            dots={false}
            afterChange={(current) => setCurrentPicIndex(current)}
          >
            {pictures.map((pic, index) => (
              <div key={index}>
                <div style={imgContainerStyle}>
                  {/* 背景模糊层 */}
                  <div style={blurBgStyle(pic)} />
                  {/* 主图层 */}
                  <Image
                    height="100%"
                    src={pic}
                    style={{ objectFit: 'contain', position: 'relative', zIndex: 1 }}
                    fallback="/Note/error.png"
                    preview={{ mask: '点击预览' }}
                  />
                </div>
              </div>
            ))}
          </Carousel>

          {/* 自定义数字页码指示器 */}
          {pictures.length > 1 && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(4px)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 500,
                zIndex: 2,
                pointerEvents: 'none',
              }}
            >
              {currentPicIndex + 1} / {pictures.length}
            </div>
          )}
        </div>

        {/* 2. 内容主体区 */}
        <Card
          bordered={false}
          style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Space
              size={12}
              style={{ cursor: 'pointer' }}
              onClick={() => navToUser(posts?.userAccount)}
            >
              <Avatar size={48} src={posts?.posterAvatarUrl} />
              <div>
                <Text strong style={{ fontSize: '16px', display: 'block' }}>
                  {posts?.posterName}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  发布于 {posts?.postTime}
                </Text>
              </div>
            </Space>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LikeButton
                postId={id}
                onLikeChange={(state) => setLikeCount(state ? likeCount + 1 : likeCount - 1)}
                userAccount={posts?.userAccount}
                likelist={likeList}
              />
              <Text strong style={{ fontSize: '16px', color: '#666', minWidth: '20px' }}>
                {likeCount}
              </Text>
            </div>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          <Typography>
            <Title level={2} style={{ marginBottom: '24px' }}>
              {posts?.postTitle}
            </Title>
            <Paragraph
              style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#333',
                whiteSpace: 'pre-wrap',
              }}
            >
              {posts?.postContent}
            </Paragraph>
          </Typography>
        </Card>

        {/* 3. 评论区 */}
        <Card
          bordered={false}
          style={{
            marginTop: '24px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            background: '#ffffff',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <Title
              level={4}
              style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '8px' }}
            >
              评论{' '}
              <span style={{ color: '#8c8c8c', fontSize: '14px', fontWeight: 'normal' }}>
                {comments.length}
              </span>
            </Title>
          </div>

          {/* 输入框区域 */}
          <div
            style={{
              background: '#f8f9fa',
              padding: '16px',
              borderRadius: '16px',
              marginBottom: '32px',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s',
            }}
            className="comment-input-wrapper"
          >
            <TextArea
              value={textBoxContent}
              onChange={(e) => setTextBoxContent(e.target.value)}
              placeholder="真诚的评论是交流的开始..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              maxLength={200}
              // 关闭自带的 showCount
              style={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                padding: '0',
                fontSize: '15px',
              }}
            />
            {/* 自定义控制条：左侧放字数，右侧放按钮 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                borderTop: '1px solid #eee',
                paddingTop: '12px',
              }}
            >
              <Text style={{ color: '#bfbfbf', fontSize: '13px' }}>
                {textBoxContent.length} / 200
              </Text>

              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={submitting}
                onClick={handleCommentSubmit}
                style={{
                  borderRadius: '10px',
                  height: '36px',
                  padding: '0 20px',
                  fontWeight: 600,
                  background: '#1890ff',
                  boxShadow: '0 4px 10px rgba(24, 144, 255, 0.15)',
                }}
              >
                发布评论
              </Button>
            </div>
          </div>

          {/* 评论列表 */}
          {comments.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(item, index) => (
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    transition: 'all 0.3s',
                    marginBottom: '8px',
                  }}
                  className="comment-item"
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fcfcfc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Avatar
                      src={item.avatarUrl}
                      size={40}
                      style={{ flexShrink: 0, cursor: 'pointer', border: '1px solid #f0f0f0' }}
                      onClick={() => navToUser(item.userAccount)}
                    />

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                        }}
                      >
                        <Text
                          strong
                          style={{ color: '#262626', fontSize: '15px', cursor: 'pointer' }}
                          onClick={() => navToUser(item.userAccount)}
                        >
                          {item.name}
                        </Text>
                        <Text style={{ color: '#bfbfbf', fontSize: '12px' }}>#{index + 1}楼</Text>
                      </div>

                      <div
                        style={{
                          background: '#f4f4f4',
                          padding: '12px 16px',
                          borderRadius: '0 12px 12px 12px',
                          display: 'inline-block',
                          maxWidth: '100%',
                        }}
                      >
                        <Text style={{ color: '#434343', lineHeight: '1.6', fontSize: '14px' }}>
                          {item.content}
                        </Text>
                      </div>

                      <div style={{ marginTop: '8px' }}>
                        <Text type="secondary" style={{ fontSize: '12px', marginRight: '16px' }}>
                          {item.time}
                        </Text>
                        <Button
                          type="text"
                          size="small"
                          style={{ fontSize: '12px', color: '#8c8c8c', padding: 0 }}
                        >
                          回复
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span style={{ color: '#bfbfbf' }}>暂无评论，快来抢沙发吧~</span>}
              style={{ margin: '60px 0' }}
            />
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default PostDetail;
