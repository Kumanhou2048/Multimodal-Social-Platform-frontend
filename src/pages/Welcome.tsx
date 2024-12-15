import { getHomePagePost, getTotalPosts, Likes } from '@/services/ant-design-pro/api';
import { history } from '@@/core/history';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, message, Pagination, PaginationProps, Space } from 'antd';
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
  userAccount?: string;
}> = ({ id, scr, avatar_scr, title, username, like, userAccount }) => {
  const [likeCount, setLikeCount] = useState<number>(parseInt(like, 10));

  const handleClick = () => {
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/post/' + id);
  };

  const handleLikeChange = (newLikeState: boolean) => {
    setLikeCount(newLikeState ? likeCount + 1 : likeCount - 1); // 根据点赞状态更新数量
  };

  const handleAvatarClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/personSetting/managePost/' + userAccount);
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

const Welcome: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getHomePageIndex = (): API.HomePageIndex => ({ index: pageNumber });
        const postsResult = await getHomePagePost(getHomePageIndex());
        const totalPostsResult = await getTotalPosts();
        let post: any[] = [];
        let total: any;
        if (Array.isArray(postsResult)) {
          postsResult.forEach((item) => {
            post.push(item);
          });
        }
        total = totalPostsResult;
        setPosts(post || []);
        setTotalPosts(total);
      } catch (error) {
        console.error('获取数据失败', error);
      }
    };

    fetchData();
  }, [pageNumber]);

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

  const onChange: PaginationProps['onChange'] = (page) => {
    setPageNumber(page);
    window.scrollTo(0, 0);
    window.history.pushState({}, '', `?page=${page}`);
  };

  return (
    <PageContainer
      header={{
        title: '',
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
              userAccount={post.userAccount}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Pagination
            showQuickJumper
            current={pageNumber}
            total={totalPosts}
            pageSize={pageSize}
            onChange={onChange}
            showSizeChanger={false}
          />
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
