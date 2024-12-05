import { LikeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Card, Space } from 'antd';
import React from 'react';

const { Meta } = Card;

const Post: React.FC<{
  scr: string;
  avatarscr: string;
  title: string;
  username: string;
  like: string;
}> = ({ scr, avatarscr, title, username, like }) => {
  return (
    <>
      <Card
        hoverable
        style={{ width: 260, height: 430 }}
        cover={
          <img
            alt="example"
            src={scr}
            style={{
              width: '260px',
              height: '330px',
              objectFit: 'cover',
            }}
          />
        }
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
            <Avatar src={<img src={avatarscr} alt="avatar" />} />
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
              <LikeOutlined />
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
  return (
    <PageContainer>
      <Card>
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: '40px',
          }}
        >
          <Post
            scr="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            avatarscr="https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg"
            title="这个是一个标题"
            username="Kuman"
            like="114514"
          ></Post>
          <Post
            scr="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            avatarscr="https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg"
            title="这个是一个标题"
            username="Kuman"
            like="114514"
          ></Post>
          <Post
            scr="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            avatarscr="https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg"
            title="这个是一个标题"
            username="Kuman"
            like="114514"
          ></Post>
          <Post
            scr="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            avatarscr="https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg"
            title="这个是一个标题"
            username="Kuman"
            like="114514"
          ></Post>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
