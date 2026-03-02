import { PageContainer, ProForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { UserOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { message, Upload, Card, Avatar, Button, Typography, Divider, UploadProps } from 'antd';
import { useModel } from '@@/exports';
import React, { useState } from 'react';
import { update } from '@/services/ant-design-pro/api';

const { Title, Text } = Typography;

// 文件上传前的校验
const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export default () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  // 处理头像上传变更
  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      // 假设后端接口直接返回图片的 URL 字符串
      setImageUrl(info.file.response);
      message.success('头像上传成功');
      // 延时刷新，让用户看一眼上传成功的反馈
      setTimeout(() => window.location.reload(), 800);
    }
    if (info.file.status === 'error') {
      setLoading(false);
      message.error('头像上传失败');
    }
  };

  // 处理个人信息表单提交
  const handleSubmit = async (values: any) => {
    try {
      // 性别转换逻辑
      const genderValue = values.gender === '男' ? 0 : 1;
      const res = await update({
        ...values,
        gender: genderValue,
        userAccount: currentUser?.userAccount,
      });

      if (res > 0) {
        message.success('个人信息更新成功！');
        // 成功后延迟刷新页面
        setTimeout(() => window.location.reload(), 1000);
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      message.error('更新失败，请重试！');
    }
  };

  return (
    <PageContainer title={false} ghost>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 0' }}>
        <Card
          bordered={false}
          style={{
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* 装饰背景 */}
          <div
            style={{
              height: '120px',
              background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
              position: 'relative',
            }}
          />

          <div style={{ padding: '0 40px 40px 40px', marginTop: '-50px' }}>
            <div
              style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '30px', gap: '24px' }}
            >
              {/* 头像展示与上传 */}
              <div style={{ position: 'relative' }}>
                <Avatar
                  size={120}
                  src={imageUrl || currentUser?.avatarUrl}
                  icon={loading ? <LoadingOutlined /> : <UserOutlined />}
                  style={{
                    border: '4px solid #fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    background: '#f5f5f5',
                  }}
                />
                <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
                  <Upload
                    name="file"
                    showUploadList={false}
                    action="/api/uploadAvatar"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    data={{ userAccount: currentUser?.userAccount }}
                  >
                    <Button
                      type="primary"
                      shape="circle"
                      // 这里使用了 loading 变量，ESLint 警告会消失
                      loading={loading}
                      icon={!loading && <EditOutlined />}
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    />
                  </Upload>
                </div>
              </div>

              <div style={{ paddingBottom: '10px' }}>
                <Title level={3} style={{ margin: 0 }}>
                  {currentUser?.username || '未命名用户'}
                </Title>
                <Text type="secondary">账号: {currentUser?.userAccount}</Text>
              </div>
            </div>

            <Divider style={{ margin: '24px 0' }} />

            <div style={{ maxWidth: '500px' }}>
              <ProForm
                layout="vertical"
                submitter={{
                  render: (_, dom) => <div style={{ marginTop: '20px' }}>{dom[1]}</div>,
                  searchConfig: {
                    submitText: '保存个人信息',
                  },
                }}
                onFinish={handleSubmit}
                initialValues={{
                  username: currentUser?.username,
                  gender: currentUser?.gender === 0 ? '男' : '女',
                }}
              >
                <ProFormText
                  name="username"
                  label={<Text strong>用户昵称</Text>}
                  tooltip="展示在主页的名称"
                  placeholder="请输入您的新昵称"
                  fieldProps={{
                    prefix: <UserOutlined style={{ color: '#bfbfbf' }} />,
                    size: 'large',
                  }}
                  rules={[
                    { required: true, message: '昵称不能为空' },
                    { max: 20, message: '昵称过长（限20字）' },
                  ]}
                />

                <div style={{ marginTop: '16px' }}>
                  <ProFormRadio.Group
                    label={<Text strong>性别</Text>}
                    name="gender"
                    options={[
                      { label: '男生', value: '男' },
                      { label: '女生', value: '女' },
                    ]}
                    fieldProps={{
                      optionType: 'button',
                      buttonStyle: 'solid',
                    }}
                  />
                </div>
              </ProForm>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
