import { getSearchPagePost, getTotalSearchPosts, Likes } from '@/services/ant-design-pro/api';
import { history } from '@@/core/history';
import { useParams } from '@@/exports';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';

const { Meta } = Card;

//点赞
const LikeButton: React.FC<{
  postId: string;
  onLikeChange: (newLikedState: boolean) => void;
}> = ({ postId, onLikeChange }) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleLike = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (loading) return;
    setLoading(true);

    const userId = currentUser?.id;
    const newLikedState = !liked;
    //console.log(userId, postId);
    try {
      // 调用点赞 API，传递点赞状态
      const response = await Likes({ userId, postId, newLikedState });

      if (response.status === 'success') {
        setLiked(!liked); // 更新点赞状态
        onLikeChange(newLikedState);
        message.success(liked ? '取消点赞成功' : '点赞成功');
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
  searchKey: any;
}> = ({ id, scr, avatar_scr, title, username, like, searchKey }) => {
  const [likeCount, setLikeCount] = useState<number>(parseInt(like, 10));

  const handleClick = () => {
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/post/' + id);
  };

  const handleLikeChange = (newLikeState: boolean) => {
    setLikeCount(newLikeState ? likeCount + 1 : likeCount - 1); // 根据点赞状态更新数量
  };

  //关键字高亮显示
  const highlightText = (text: string, key: string) => {
    if (!key) return text;
    const parts = text.split(new RegExp(`(${key})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === key.toLowerCase() ? (
        <span key={index} style={{ background: 'yellow' }}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };
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
          <Meta title={<span>{highlightText(title, searchKey)}</span>} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Avatar src={<img src={avatar_scr} alt="avatar" />} />
            <p
              style={{
                fontSize: '14px',
                margin: 0,
                lineHeight: '14px',
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
              <LikeButton postId={id} onLikeChange={handleLikeChange}></LikeButton>
              <p
                style={{
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                {likeCount}
              </p>
            </div>
          </div>
        </Space>
      </Card>
    </>
  );
};

const SearchPage: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchKey = (): API.SearchKey => ({ key: key });
        const postsResult = await getSearchPagePost(searchKey());
        const totalPostsResult = await getTotalSearchPosts(searchKey());

        setPosts(postsResult.posts || []);
        setTotalPosts(totalPostsResult.total);
      } catch (error) {
        console.error('获取数据失败', error);
      }
    };

    fetchData();
  }, [key]);

  return (
    <PageContainer
      header={{
        title: '共有 ' + totalPosts + ' 个搜索结果 关于：' + key,
      }}
    >
      <Card>
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
              searchKey={key}
            />
          ))}
        </div>
      </Card>
    </PageContainer>
  );
};

export default SearchPage;
