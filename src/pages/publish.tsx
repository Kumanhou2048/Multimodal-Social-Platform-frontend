import { useModel } from '@@/exports';
import {
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  ThunderboltOutlined, // 新增：魔棒图标
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Input,
  message,
  Row,
  Space,
  Tooltip,
  Typography,
  Upload,
} from 'antd';
import React, { useState } from 'react';
// 注意：确保你的 api.ts 中定义了 generateAIContent 接口
import { upLoadNote } from '@/services/ant-design-pro/api';
import { request } from '@umijs/max';

const { TextArea } = Input;
const { Text } = Typography;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type ImageUploadResult = {
  url: string;
  error: string;
};

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageCount, setImageCount] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  /**
   * 新增：调用后端 Qwen-Flash 生成正文
   */
  const handleAiGenerate = async () => {
    if (!title.trim()) {
      message.warning('请先输入标题哦 ✨');
      return;
    }

    setAiLoading(true);
    // 💡 动态提示，让加载变得有趣
    const loadingText =
      fileList.length > 0 ? 'AI 正在看图写文案，请稍候...' : 'AI 正在调动灵感，请稍候...';
    const hide = message.loading(loadingText, 0);

    try {
      let base64Image = '';

      // 判断是否有图片，如果有，取第一张转 Base64
      if (fileList.length > 0 && fileList[0].originFileObj) {
        try {
          const fullBase64 = await getBase64(fileList[0].originFileObj as FileType);
          base64Image = fullBase64.split(',')[1];
        } catch (error) {
          console.error('图片转换Base64失败:', error);
        }
      }

      const res = await request<any>('/api/ai/generate/content/smart', {
        method: 'POST',
        data: {
          title: title.trim(),
          imageBase64: base64Image,
        },
      });

      if (res && res.code === 0) {
        setContent(res.data);
        setIsAiGenerated(true);
        message.success('灵感已送达！✨');
      } else {
        message.error(res?.message || 'AI 暂时没灵感，请稍后再试');
      }
    } catch (e) {
      console.error('AI生成请求出错:', e);
      message.error('网络繁忙，无法连接 AI 服务');
    } finally {
      hide(); // 关闭 loading 提示
      setAiLoading(false);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setImageCount(newFileList.length);
  };

  const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片必须小于 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const uploadImageToBackend = async (file: FileType): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('上传失败');
    const result: ImageUploadResult = await response.json();
    return result.url;
  };

  const submitData = async () => {
    if (imageCount === 0) return message.error('请至少上传一张图片');
    if (!title.trim()) return message.error('请输入标题');
    if (!content.trim()) return message.error('请输入内容');

    setSubmitting(true);
    try {
      const imageUrls: string[] = [];
      const uploadPromises = fileList.map(async (file) => {
        if (file.originFileObj) {
          return await uploadImageToBackend(file.originFileObj as FileType);
        }
        return file.url || '';
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      imageUrls.push(...uploadedUrls.filter((url) => !!url));

      const result = await upLoadNote({
        userAccount: currentUser?.userAccount,
        title,
        content,
        noteType: 0,
        imageCount,
        imageUrls,
        isAiGenerated,
      });

      if (result > 0) {
        message.success('发布成功！');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        message.error('发布失败，请检查输入内容');
      }
    } catch (e) {
      message.error('服务器繁忙，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadButton = (
    <div style={{ color: '#8c8c8c' }}>
      <PlusOutlined style={{ fontSize: '20px' }} />
      <div style={{ marginTop: 8 }}>添加图片</div>
    </div>
  );

  return (
    <PageContainer title={false} ghost>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Row gutter={24}>
          {/* 左侧：图片上传区 */}
          <Col xs={24} md={10}>
            <Card
              title={
                <Space>
                  <PictureOutlined />
                  预览图 (最多5张)
                </Space>
              }
              bordered={false}
              style={{
                borderRadius: '16px',
                height: '100%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                accept="image/png, image/jpeg"
                beforeUpload={handleBeforeUpload}
              >
                {fileList.length >= 5 ? null : uploadButton}
              </Upload>
              <Text
                type="secondary"
                style={{ fontSize: '12px', marginTop: '12px', display: 'block' }}
              >
                支持 jpg/png 格式，单张不超过 5MB
              </Text>
            </Card>
          </Col>

          {/* 右侧：文字编辑区 */}
          <Col xs={24} md={14}>
            <Card
              bordered={false}
              style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
            >
              <div style={{ marginBottom: '24px' }}>
                <Input
                  variant="borderless"
                  placeholder="填写标题 (最多50字)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                  suffix={
                    <Tooltip title="AI 辅助生成正文">
                      <Button
                        type="text"
                        icon={
                          <ThunderboltOutlined style={{ color: title ? '#722ed1' : '#bfbfbf' }} />
                        }
                        loading={aiLoading}
                        onClick={handleAiGenerate}
                        style={{ border: 'none', background: 'transparent' }}
                      />
                    </Tooltip>
                  }
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    padding: '0',
                    marginBottom: '8px',
                  }}
                />
                <Divider style={{ margin: '8px 0' }} />
                <TextArea
                  variant="borderless"
                  placeholder="分享你的故事..."
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    // 如果文本清空，则将ai标记为false
                    if (!e.target.value) setIsAiGenerated(false);
                  }}
                  autoSize={{ minRows: 8, maxRows: 15 }}
                  maxLength={500}
                  style={{
                    fontSize: '16px',
                    padding: '0',
                    lineHeight: '1.8',
                  }}
                />
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Space direction="vertical" size={0}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    标题：{title.length}/50
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    内容：{content.length}/500
                  </Text>
                </Space>

                <Button
                  type="primary"
                  size="large"
                  icon={<SendOutlined />}
                  loading={submitting}
                  onClick={submitData}
                  style={{
                    borderRadius: '10px',
                    padding: '0 32px',
                    height: '46px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                  }}
                >
                  立即发布笔记
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </PageContainer>
  );
};

export default App;
