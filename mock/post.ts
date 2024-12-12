import { Request, Response } from 'express';
export default {
  /*首页获取帖子ID、标题。图片/视频的略缩图，用户名、用户头像和点赞数*/
  'POST /api/getHomePagePost': (req: Request, res: Response) => {
    res.send({
      posts: [
        {
          id: '114514',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg',
          title: 'Post 1',
          username: 'Kuman',
          likes: 11,
        },
        {
          id: '2',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg  ',
          title: 'Post 2',
          username: 'John',
          likes: '20',
        },
        {
          id: '3',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg',
          title: 'Post 1',
          username: 'Kuman',
          likes: '10',
        },
        {
          id: '4',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg  ',
          title: 'Post 2',
          username: 'John',
          likes: '20',
        },
        {
          id: '5',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg',
          title: 'Post 1',
          username: 'Kuman',
          likes: '10',
        },
        {
          id: '6',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg  ',
          title: 'Post 2',
          username: 'John',
          likes: '20',
        },
        {
          id: '7',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg',
          title: 'Post 1',
          username: 'Kuman',
          likes: '10',
        },
        {
          id: '8',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg  ',
          title: 'Post 2',
          username: 'John',
          likes: '20',
        },
        {
          id: '9',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg',
          title: 'Post 1',
          username: 'Kuman',
          likes: '10',
        },
        {
          id: '10',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg  ',
          title: 'Post 2',
          username: 'John',
          likes: '20',
        },
        {
          id: '11',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg',
          title: 'Post 1',
          username: 'Kuman',
          likes: '10',
        },
        {
          id: '12',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg  ',
          title: 'Post 2',
          username: 'John',
          likes: '20',
        },
      ],
    });
  },
  /*首页获取帖子*/
  'GET /api/getTotalPosts': (req: Request, res: Response) => {
    res.send({
      total: '100',
    });
  },
  'PATCH /api/Likes': (req: Request, res: Response) => {
    res.send({
      status: 'success',
    });
  },
};
