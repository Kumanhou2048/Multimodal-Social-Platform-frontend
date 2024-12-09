import {
  PageContainer,
  ProForm,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {GetProp, message, Upload, UploadProps, Card, Avatar, Space} from 'antd';
import { useModel} from "@@/exports";
import React, { useState } from "react";
import { update} from "@/services/ant-design-pro/api";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export default () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const imageUrl = info.file.response;  // Assuming the server returns the full URL to the uploaded image
      setLoading(false);
      setImageUrl(imageUrl);
      window.location.reload(); // 用于刷新页面
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传新头像</div>
    </button>
  );

  //表当提交函数
  const handleSubmit = async (values: API.updateParams) => {

    try {
      // 更新个人信息
      const id = await update({
        ...values,
        userAccount:currentUser?.userAccount,
      });

      if (id > 0) {
        const defaultLoginSuccessMessage = '更行个人信息成功！';
        message.success(defaultLoginSuccessMessage);
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 这里设置延迟1秒后刷新页面，时间可根据实际情况调整
        return;
      } else {
        throw new Error(`update error id=${id}`);
      }
    } catch (error) {
      const defaultLoginFailureMessage = '更新失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <PageContainer
      header={{
        title: '个人信息设置',
        style: {
          textAlign: 'left',
          margin: '20px 0 0 20px',
          fontSize: '20px',
        },
      }}
    >
      {/* 使用Card包裹ProForm和Upload组件，通过设置Card的样式实现居中对齐 */}
      <Card
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%', // 根据实际情况可调整宽度占比等
        }}
      >
        {/* 表单部分，设置合适的marginBottom来增大与上传组件的间距 */}
        {/* 使用Space组件让Avatar和Upload组件在同一行显示，可根据需要调整space属性控制间距 */}
        <Space style={{ marginBottom: 30 }}>
          <Avatar size={100} src={currentUser?.avatarUrl}  />
          <Upload
            name="file"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action="/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            data={{ userAccount: currentUser?.userAccount }} // 添加额外的请求参数
          >
            {imageUrl? <img src={imageUrl} alt="avatar" style={{ width: '50%' }} /> : uploadButton}
          </Upload>
        </Space>
        <ProForm
          style={{ width: '100%', marginBottom: 40 }}
          submitter={{
            searchConfig: {
              submitText: '更新', // 按钮文字
            },
          }}
          onFinish={async (values) => {
            console.log(values);
            await handleSubmit(values as API.updateParams);
          }}
          initialValues={{
            username: currentUser?.username,
            gender: currentUser?.gender === 0? '男' : '女', // 利用三元表达式转换数值为对应字符串
          }}
        >
          <ProFormText
            width="md" // 设置宽度为100%让表单项宽度统一，可根据实际调整
            name="username"
            label="用户名"
            tooltip="最长为 20 位"
            placeholder="请输入新用户名"
            rules={[
              {
                required: true,
                message: '用户名是必填项！',
              },
              {
                max:20,
                message:'用户名长度不能超过20个字符',
              }
            ]}
          />
          <ProFormRadio.Group
            width="md"
            label="性别"
            name="gender"
            options={['男', '女']}
          />
        </ProForm>
    </Card>
</PageContainer>
);
};
