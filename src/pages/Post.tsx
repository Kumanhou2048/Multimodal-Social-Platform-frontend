import {
  getLikePostsID,
  getPostComment,
  getPostDetail,
  getPostPicture,
  makeAComment,
  PostLikes,
} from '@/services/ant-design-pro/api';
import { history } from '@@/core/history';
import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, Carousel, Divider, Image, List, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '550px',
  textAlign: 'center',
  background: '#000000',
};

interface Post {
  posterAvatarUrl: string;
  posterName: string;
  postTime: string;
  postTitle: string;
  postContent: string;
  userAccount?: string;
}

//点赞
const LikeButton: React.FC<{
  postId: any;
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

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post | null>(null);
  const [pictures, setPictures] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [textBoxContent, setTextBoxContent] = useState('');
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [likeCount, setLikeCount] = useState<number>(0);
  const [likeList, setLikeList] = useState<any[]>([]);
  //let userAccount = currentUser?.userAccount;

  const fetchData = async () => {
    try {
      const postid = (): API.PostID => ({ id: id });
      const posts = await getPostDetail(postid());
      const pictures = await getPostPicture(postid());
      const comments = await getPostComment(postid());
      const userid = (): API.UserID => ({ id: currentUser?.id });
      const likeListResult = await getLikePostsID(userid());

      let post: Post;
      let picture: any = [];
      let comment: any = [];
      let likelist: any[] = [];
      post = posts;
      if (Array.isArray(pictures)) {
        pictures.forEach((item) => {
          picture.push(item);
        });
      }
      if (Array.isArray(comments)) {
        comments.forEach((item) => {
          comment.push(item);
        });
      }
      if (Array.isArray(likeListResult)) {
        likeListResult.forEach((item) => {
          likelist.push(item);
        });
      }

      setPosts(post);
      setLikeList(likelist || []);
      setPictures(picture || []);
      setComments(comment || []);
      setLikeCount(posts?.like);
    } catch (error) {
      console.error('获取数据失败', error);
    }
  };

  const handleLikeChange = (newLikeState: boolean) => {
    setLikeCount(newLikeState ? likeCount + 1 : likeCount - 1); // 根据点赞状态更新数量
  };

  // 提交评论时刷新评论
  const handleCommentSubmit = async () => {
    if (textBoxContent.trim() === '') {
      message.error('请先输入内容！');
      return;
    }
    try {
      const comment = (): API.Comment => ({
        userId: currentUser?.id,
        postId: id,
        content: textBoxContent,
      });
      const status = await makeAComment(comment());
      if (status.status === 'success') {
        message.success('发布成功！');
      } else {
        message.error('发布失败！');
        return;
      }
    } catch (error) {
      console.error('发表评论失败', error);
    }
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const onTextBoxChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextBoxContent(e.target.value);
  };

  const handleAvatarClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/personSetting/managePost/' + posts?.userAccount);
  };

  const handleCommentAvatarClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    userAccount: string,
  ) => {
    event.stopPropagation();
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/personSetting/managePost/' + userAccount);
  };

  return (
    <PageContainer
      header={{
        title: '',
      }}
    >
      <Card>
        <Carousel arrows infinite={false} adaptiveHeight={true}>
          {pictures.map((picture, index) => (
            <div key={index}>
              <p style={contentStyle}>
                <Image height={550} src={picture} fallback="/Note/error.png" />
              </p>
            </div>
          ))}
        </Carousel>
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div onClick={handleAvatarClick}>
              <Avatar src={<img src={posts?.posterAvatarUrl} alt="avatar" />} />
            </div>
            <p
              style={{
                fontSize: '20px',
                margin: 0,
                lineHeight: '14px',
              }}
            >
              {posts?.posterName}
            </p>
            <LikeButton
              postId={id}
              onLikeChange={handleLikeChange}
              userAccount={posts?.userAccount}
              likelist={likeList}
            ></LikeButton>
            <p
              style={{
                fontSize: '14px',
                margin: 0,
              }}
            >
              {likeCount}
            </p>
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <p
                style={{
                  fontSize: '20px',
                  margin: 0,
                  lineHeight: '14px',
                  color: '#756d6d',
                  textAlign: 'left',
                }}
              >
                {posts?.postTime}
              </p>
            </div>
          </div>
          <Divider />
          <h2>
            <b>{posts?.postTitle}</b>
          </h2>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {posts?.postContent}
          </pre>
        </Card>
        <Card>
          <h3>评论</h3>
          <TextArea
            onChange={onTextBoxChange}
            showCount
            allowClear
            maxLength={200}
            placeholder="发表你的评论"
            style={{ height: 100, resize: 'none' }}
          />
          <Button
            onClick={handleCommentSubmit}
            type="primary"
            autoInsertSpace={false}
            style={{
              display: 'flex',
              marginLeft: 'auto',
              marginTop: '20px',
            }}
          >
            发布
          </Button>
          <p style={{ fontWeight: 'bold', fontSize: '18px' }}>共 {comments.length} 条评论</p>
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  key={index}
                  avatar={
                    <div onClick={(event) => handleCommentAvatarClick(event, item.userAccount)}>
                      <Avatar src={item.avatarUrl} alt="avatar" />
                    </div>
                  }
                  title={
                    <pre
                      style={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                      }}
                    >
                      {
                        <b
                          style={{
                            fontSize: '15px',
                          }}
                        >
                          {item.name}
                        </b>
                      }
                    </pre>
                  }
                  description={
                    <p
                      style={{
                        wordWrap: 'break-word',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      {item.content}
                    </p>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Card>
    </PageContainer>
  );
};

export default PostDetail;
