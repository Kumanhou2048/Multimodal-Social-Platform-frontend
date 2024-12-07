import React from 'react';
import { useParams } from 'umi';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>帖子详情</h1>
      <p>Post ID: {id}</p>
    </div>
  );
};

export default PostDetail;
