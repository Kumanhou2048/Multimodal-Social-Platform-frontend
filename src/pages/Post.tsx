import {
  getPostComment,
  getPostDetail,
  getPostPicture,
  makeAComment,
} from '@/services/ant-design-pro/api';
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
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post | null>(null);
  const [pictures, setPictures] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [textBoxContent, setTextBoxContent] = useState('');
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const fetchData = async () => {
    try {
      const postid = (): API.PostID => ({ id: id });
      const posts = await getPostDetail(postid());
      const pictures = await getPostPicture(postid());
      const comments = await getPostComment(postid());

      let post: Post;
      let picture: any = [];
      let comment: any = [];
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

      setPosts(post);
      setPictures(picture || []);
      setComments(comment || []);
    } catch (error) {
      console.error('获取数据失败', error);
    }
  };

  // 提交评论时刷新评论
  const handleCommentSubmit = async () => {
    if (textBoxContent === '') {
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
                <Image height={550} src={picture.url} fallback="/Note/error.png" />
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
            <Avatar src={<img src={posts?.posterAvatarUrl} alt="avatar" />} />
            <p
              style={{
                fontSize: '20px',
                margin: 0,
                lineHeight: '14px',
              }}
            >
              {posts?.posterName}
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
                  avatar={<Avatar src={item.avatarUrl} alt="avatar" />}
                  title={
                    <pre
                      style={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                      }}
                    >
                      {item.name}
                    </pre>
                  }
                  description={item.content}
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
