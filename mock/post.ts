import { Request, Response } from 'express';
export default {
  /*首页获取帖子的ID、标题。图片/视频的略缩图，用户名、用户头像和点赞数*/
  'POST /api/getPost': (req: Request, res: Response) => {
    res.send('1');
  },
};
