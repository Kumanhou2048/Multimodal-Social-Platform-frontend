import { getHomePagePost, getTotalPosts } from '@/services/ant-design-pro/api';
import { history } from '@@/core/history';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Card, message, Pagination, PaginationProps, Space } from 'antd';
import React, { useEffect, useState } from 'react';

const { Meta } = Card;

//点赞 还没写完 修改like的数量和调用api
const LikeButton: React.FC = () => {
  const [liked, setLiked] = useState<boolean>(false);
  const handleLike = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setLiked(!liked);
    message.success(liked ? '取消点赞' : '点赞成功');
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
}> = ({ id, scr, avatar_scr, title, username, like }) => {
  const handleClick = () => {
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/post/' + id);
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
              <LikeButton></LikeButton>
              <p
                style={{
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                {like}
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
        const [postsResult, totalPostsResult] = await Promise.all([
          getHomePagePost({ index: pageNumber }),
          getTotalPosts(),
        ]);

        setPosts(postsResult.posts);
        setTotalPosts(totalPostsResult.total);

        const totalPages = Math.ceil(totalPostsResult.total / pageSize);
        if (pageNumber > totalPages) {
          setPageNumber(totalPages);
        }
      } catch (error) {
        console.error('获取数据失败', error);
      }
    };

    fetchData();
  }, [pageNumber, totalPosts]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = parseInt(urlParams.get('page') || '1', 10);
    const totalPages = Math.ceil(totalPosts / pageSize);

    let page = pageFromUrl;
    if (pageFromUrl > totalPages) {
      page = totalPages;
    } else if (pageFromUrl < 1) {
      page = 1;
    }

    setPageNumber(page);
  }, [totalPosts]);

  const onChange: PaginationProps['onChange'] = (page) => {
    setPageNumber(page);
    window.scrollTo(0, 0);
    window.history.pushState({}, '', `?page=${page}`);
  };

  return (
    <PageContainer>
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
