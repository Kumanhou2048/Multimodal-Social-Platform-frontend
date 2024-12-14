import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Image, Input, message, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import {useModel} from "@@/exports";
import {upLoadNote} from "@/services/ant-design-pro/api";

type ImageUploadResult = {
  url: string;
  error:string
};

// @ts-ignore
type FileType = Parameters<UploadProps['beforeUpload']>[0];
const { TextArea } = Input;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const App: React.FC = () => {
  // 笔记数据部分
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageCount, setImageCount] = useState(0); // 将 imageCount 改为状态变量

  // 图片显示部分
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  //用户信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const validFileList = newFileList.filter((file) => {
      const isPNG = file.type === 'image/png';
      const isJPEG = file.type === 'image/jpeg';
      if (!isPNG && !isJPEG) {
        message.error('您只能上传 PNG 或 JPEG 文件!');
        return false;
      }
      return true;
    });

    setFileList(validFileList);
    setImageCount(validFileList.length); // 更新图片数量的状态
  };

  // 新增函数，用于将单张图片发送到后端并获取返回的URL
  // @ts-ignore
  const uploadImageToBackend = async (file: FileType): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const requestOptions = {
      method: 'POST',
      body: formData,
    };
    const request = new Request('/api/uploadImage', requestOptions);
    try {
      const response = await fetch(request);
      if (response.ok) {
        try {
          const result: ImageUploadResult = await response.json();
          return result.url;
        } catch (error) {
          // 其他错误处理逻辑不变
          console.error("解析失败");
        }
      } else {
        console.log("图片上传失败");
        throw new Error('图片上传失败');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // 检测数据获取
  const submitData = async () => {
    console.log('图片数量:', imageCount);
    console.log('图片列表:', fileList);
    console.log('标题内容:', title);
    console.log('文字内容:', content);
    if (imageCount === 0) {
      message.error('请上传图片！');
      return;
    }
    if (title.trim() === '') {
      message.error('请输入笔记标题！');
      return;
    }
    if (content.trim() === '') {
      message.error('请输入笔记内容！');
      return;
    }
    //上传数据
    // 遍历图片列表，上传图片并获取URL，存入新的列表
    const imageUrls: string[] = [];
    for (const file of fileList) {
      await new Promise((resolve) => {setTimeout(resolve, 100)}); // 延迟 100 毫秒，可根据实际调整
      const url = await uploadImageToBackend(file.originFileObj as FileType);
      imageUrls.push(url);
    }
    const uplaodNoteParams={
      userAccount: currentUser?.userAccount,
      title: title,
      content: content,
      noteType: 0,
      imageCount: imageCount,
      imageUrls: imageUrls,
    }
    const result=await upLoadNote(uplaodNoteParams);
    if(result>0){
      message.success("上传笔记成功");
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 这里设置延迟1秒后刷新页面，时间可根据实际情况调整
    }
    else if(result===-1){
      console.log("请求为空！");
    }
    else if(result===-2){
      message.error("标题不能为空");
    }
    else if(result===-3){
      message.error("标题长度超过50");
    }
    else if(result===-4){
      message.error("内容长度超过500！");
    }
    else if(result===-5){
      console.log("后端保存失败");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <PageContainer
        header={{
          title: '',
        }}
      >
        <Card>
          <Upload
            // action="8080/api/uploadNote"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            accept=".png,.jpeg,.jpg"
          >
            {fileList.length >= 10 ? null : uploadButton}
          </Upload>
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
          <br />
          <div style={{ margin: '10px 0' }} />
          <h2
            style={{
              fontWeight: 'bold',
            }}
          >
            笔记标题：
          </h2>
          <TextArea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入笔记标题"
            autoSize
            maxLength={50}
          />
          <p
            style={{
              display: 'flex',
              marginLeft: 'auto',
              marginTop: '20px',
            }}
          >
            当前字数：{title.length} / 50
          </p>
          <div style={{ margin: '15px 0' }} />
          <h2
            style={{
              fontWeight: 'bold',
            }}
          >
            笔记内容：
          </h2>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请输入笔记内容"
            autoSize={{ minRows: 3, maxRows: 5 }}
            maxLength={500}
          />
          <p
            style={{
              display: 'flex',
              marginLeft: 'auto',
              marginTop: '20px',
            }}
          >
            当前字数：{content.length} / 500
          </p>
          <div style={{ margin: '15px 0' }} />
          <Button type="primary" onClick={submitData}>
            上传笔记
          </Button>
        </Card>
      </PageContainer>
    </>
  );
};

export default App;
