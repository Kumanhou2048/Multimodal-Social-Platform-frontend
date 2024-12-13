import { Request, Response } from 'express';

export default {
  'POST /api/getPostDetail': (req: Request, res: Response) => {
    res.send({
      posterAvatarUrl: '/avatar/Kuman.png',
      posterName: 'Kuman',
      postTime: '2024-1-1',
      postTitle: '赤壁赋——苏轼',
      postContent:
        '   壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，诵明月之诗，歌窈窕之章。少焉，月出于东山之上，徘徊于斗牛之间。白露横江，水光接天。纵一苇之所如，凌万顷之茫然。浩浩乎如冯虚御风，而不知其所止；飘飘乎如遗世独立，羽化而登仙。(冯 通：凭)\n' +
        '\n' +
        '　　于是饮酒乐甚，扣舷而歌之。歌曰：“桂棹兮兰桨，击空明兮溯流光。渺渺兮予怀，望美人兮天一方。”客有吹洞箫者，倚歌而和之。其声呜呜然，如怨如慕，如泣如诉；余音袅袅，不绝如缕。舞幽壑之潜蛟，泣孤舟之嫠妇。\n' +
        '\n' +
        '　　苏子愀然，正襟危坐而问客曰：“何为其然也？”客曰：“‘月明星稀，乌鹊南飞’，此非曹孟德之诗乎？西望夏口，东望武昌，山川相缪，郁乎苍苍，此非孟德之困于周郎者乎？方其破荆州，下江陵，顺流而东也，舳舻千里，旌旗蔽空，酾酒临江，横槊赋诗，固一世之雄也，而今安在哉？况吾与子渔樵于江渚之上，侣鱼虾而友麋鹿，驾一叶之扁舟，举匏樽以相属。寄蜉蝣于天地，渺沧海之一粟。哀吾生之须臾，羡长江之无穷。挟飞仙以遨游，抱明月而长终。知不可乎骤得，托遗响于悲风。”\n' +
        '\n' +
        '　　苏子曰：“客亦知夫水与月乎？逝者如斯，而未尝往也；盈虚者如彼，而卒莫消长也。盖将自其变者而观之，则天地曾不能以一瞬；自其不变者而观之，则物与我皆无尽也，而又何羡乎！且夫天地之间，物各有主，苟非吾之所有，虽一毫而莫取。惟江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭。是造物者之无尽藏也，而吾与子之所共适。”(共适 一作：共食)\n' +
        '\n' +
        '　　客喜而笑，洗盏更酌。肴核既尽，杯盘狼籍。相与枕藉乎舟中，不知东方之既白。',
    });
  },
  'POST /api/getPostPicture': (req: Request, res: Response) => {
    res.send({
      pictures: [
        {
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          url: 'https://s1.imagehub.cc/images/2024/12/06/438bd75e9bf65736dfb1fcff1cea48f7.jpg',
        },
        {
          url: 'https://s1.imagehub.cc/images/2024/12/05/ab11d75b304381e6f66d4c67ed2950ca.png',
        },
        {
          url: 'https://s1.imagehub.cc/images/2024/12/02/b0a4cabe37ec34fa7352fae6dd7501b8.jpg',
        },
      ],
    });
  },
  'POST /api/getPostComment': (req: Request, res: Response) => {
    res.send({
      comments: [
        {
          avatarUrl: '/avatar/Kuman.png',
          name: 'Kuman',
          content: '哈哈哈哈6666123',
          time: '2024-1-1',
        },
        {
          avatarUrl: '/avatar/Kuman.png',
          name: 'cyw',
          content:
            '山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？',
          time: '2024-1-1',
        },
        {
          avatarUrl: '/avatar/Kuman.png',
          name: 'czl',
          content: 'The quick brown fox jumps over the lazy dog',
          time: '2024-1-1',
        },
        {
          avatarUrl: '/avatar/Kuman.png',
          name: 'hwy',
          content:
            '输入：values = [[8,5,2],[6,4,1],[9,7,3]]\n' +
            '输出：285\n' +
            '解释：第一天，从商店 1 购买物品 2 ，开销为 values[1][2] * 1 = 1 。\n' +
            '第二天，从商店 0 购买物品 2 ，开销为 values[0][2] * 2 = 4 。\n' +
            '第三天，从商店 2 购买物品 2 ，开销为 values[2][2] * 3 = 9 。\n' +
            '第四天，从商店 1 购买物品 1 ，开销为 values[1][1] * 4 = 16 。\n' +
            '第五天，从商店 0 购买物品 1 ，开销为 values[0][1] * 5 = 25 。\n' +
            '第六天，从商店 1 购买物品 0 ，开销为 values[1][0] * 6 = 36 。\n' +
            '第七天，从商店 2 购买物品 1 ，开销为 values[2][1] * 7 = 49 。\n' +
            '第八天，从商店 0 购买物品 0 ，开销为 values[0][0] * 8 = 64 。\n' +
            '第九天，从商店 2 购买物品 0 ，开销为 values[2][0] * 9 = 81 。\n' +
            '所以总开销为 285 。\n' +
            '285 是购买所有 m * n 件物品的最大总开销。',
          time: '2024-1-1',
        },
      ],
    });
  },
  'POST /api/makeAComment': (req: Request, res: Response) => {
    res.send({
      status: 'success',
    });
  },
};
