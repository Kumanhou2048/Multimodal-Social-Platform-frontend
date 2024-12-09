import { LOGO } from '@/constants/index';
import { reset } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history } from '@umijs/max';
import { message, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import Settings from '../../../../config/defaultSettings';
import {Link} from "@@/exports";
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://s1.imagehub.cc/images/2024/12/02/b0a4cabe37ec34fa7352fae6dd7501b8.jpg')",
      backgroundSize: '100% 100%',
    },
  };
});

const ResetPassword: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { styles } = useStyles();

  const handleSubmit = async (values: API.ResetParams) => {
    const { userPassword, checkPassword } = values;
    //校验
    if (userPassword !== checkPassword) {
      message.error('两次密码输入不一致');
      return;
    }
    try {
      // 重置密码
      const id = await reset({
        ...values,
        type,
      });
      if (id > 0) {
        const defaultLoginSuccessMessage = '重置密码成功！';
        message.success(defaultLoginSuccessMessage);
        //重置密码成功返回登录页
        if (!history) return;
        // 解析查询参数
        const searchParams = new URLSearchParams(history.location.search);
        const redirect = searchParams.get('redirect') || ''; // 获取 redirect 参数，如果不存在则默认为空字符串

        // 跳转到登录页
        history.push(`/user/login?redirect=${redirect}`);
        return;
      }else if(id===-2){
        message.error("账号不存在！请注册");
      } else {
        throw new Error(`reset error id=${id}`);
      }
    } catch (error) {
      const defaultLoginFailureMessage = '重置密码失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'重置密码'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '提交', //按钮文字
            },
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src={LOGO}/>}
          title="小蓝书"
          subTitle={'最方便的社区网站'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '重置密码',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                  {pattern: /^[a-zA-Z0-9]{3,10}$/, message: '用户名长度需在3到10个字符之间，且只能包含字母或数字！'},
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入新密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {min: 6, max: 20, message: '密码长度需在6到20个字符之间！'},
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请再次输入新密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {min: 6, max: 20, message: '密码长度需在6到20个字符之间！'},
                ]}
              />
            </>
          )}
          <p>
            想起密码了？
            <Link to="/user/login">登录</Link>
          </p>
        </LoginForm>
      </div>
    </div>
  );
};
export default ResetPassword;
