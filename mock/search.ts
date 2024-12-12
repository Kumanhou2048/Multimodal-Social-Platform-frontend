import { Request, Response } from 'express';
export default {
  'POST /api/getSearchPagePost': (req: Request, res: Response) => {
    res.send({
      posts: [
        {
          id: '114514',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg',
          title: 'Post 1',
          username: '原神',
          likes: '10',
        },
        {
          id: '2',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg  ',
          title: 'Post 2',
          username: '星穹铁道',
          likes: '20',
        },
        {
          id: '3',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg',
          title: 'Post 1',
          username: '绝区零',
          likes: '10',
        },
        {
          id: '4',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg  ',
          title: 'Post 2',
          username: '鸣潮',
          likes: '20',
        },
        {
          id: '5',
          imageUrl:
            'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.md.png',
          avatarUrl:
            'https://s1.imagehub.cc/images/2024/12/03/816ffbdae7a44ede51ce0bc1bb406baa.th.jpg',
          title: 'Post 1',
          username: '崩坏3',
          likes: '10',
        },
      ],
    });
  },
  /*首页获取帖子*/
  'POST /api/getTotalSearchPosts': (req: Request, res: Response) => {
    res.send({
      total: '20',
    });
  },
};
