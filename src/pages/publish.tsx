import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
//import { useModel } from '@umijs/max';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Button, Card, Image, Input, message, Upload } from 'antd';
import React, { useState } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

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
  // const [imagecount, setimageCount] = useState(0);
  let imageCount = 0;
  // const [keyword, setKeyword] = useState('');

  // 用户信息部分
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};
  // userId: currentUser?.id;

  // 图片显示部分
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-2',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-3',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-4',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-xxx',
    //   percent: 50,
    //   name: 'image.png',
    //   status: 'uploading',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-5',
    //   name: 'image.png',
    //   status: 'error',
    // },
  ]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    //将文件类型限制为PNG、JPG和JPEG
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
  };

  // setimageCount(fileList.length);
  imageCount = fileList.length; // 更新图片数量

  // // 使用 useEffect 记录数据变化
  // useEffect(() => {
  //   console.log('标题:', title);
  // }, [title]); // 依赖于 title，每当 title 变化时执行
  //
  // useEffect(() => {
  //   console.log('内容:', content);
  // }, [content]); // 依赖于 content，每当 content 变化时执行
  //
  // useEffect(() => {
  //   console.log('话题:', keyword);
  // }, [keyword]); // 依赖于 keyword，每当 keyword 变化时执行

  // 检测数据获取
  const submitData = () => {
    console.log('标题:', title);
    console.log('内容:', content);
    console.log('图片数量:', imageCount);
    if (imageCount === 0) {
      message.error('请上转图片！');
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
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  console.log(fileList[fileList.length - 1]);
  return (
    <>
      <PageContainer
        header={{
          title: '',
        }}
      >
        <Card>
          <Upload
            action="8080/api/uploadNote"
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
            maxLength={50} // 限制最大输入长度为50字
          />
          <p
            style={{
              display: 'flex',
              marginLeft: 'auto',
              marginTop: '20px',
            }}
          >
            当前字数：{title.length} / 50
          </p>{' '}
          {/* 动态显示当前字数及最大字符数 */}
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
            maxLength={500} // 限制最大输入长度为500字
          />
          <p
            style={{
              display: 'flex',
              marginLeft: 'auto',
              marginTop: '20px',
            }}
          >
            当前字数：{content.length} / 500
          </p>{' '}
          {/* 动态显示当前字数及最大字符数 */}
          <div style={{ margin: '15px 0' }} />
          {/*<h2>笔记话题：</h2>*/}
          {/*<TextArea*/}
          {/*  value={keyword}*/}
          {/*  onChange={(e) => setKeyword(e.target.value)}*/}
          {/*  placeholder="请输入笔记话题" autoSize={{minRows: 2, maxRows: 6}}/>*/}
          <br />
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
