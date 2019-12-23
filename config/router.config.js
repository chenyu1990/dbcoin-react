export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            name: '统计分析',
            icon: 'bar-chart',
            path: '/',
            component: './stat',
          },
          {
            path: '/contract',
            name: '合约',
            icon: 'profile',
            routes: [
              {
                name: '矿机计划',
                icon: 'audit',
                path: '/contract/plan',
                component: './contract/plan',
              },
              {
                name: '售卖合约',
                icon: 'unordered-list',
                path: '/contract/list',
                component: './contract/list',
              },
              {
                name: '合约订单',
                icon: 'ordered-list',
                path: '/contract/order',
                component: './contract/order',
              },
            ],
          },
          {
            path: '/wallet',
            name: '中央钱包',
            icon: 'wallet',
            component: './wallet',
          },
          {
            path: '/member',
            name: '用户',
            icon: 'team',
            routes: [
              {
                name: '基本资料',
                icon: 'user',
                path: '/member/list',
                component: './user/list',
              },
              {
                name: '详细资料',
                icon: 'solution',
                path: '/member/profile',
                component: './user/profile',
              },
              {
                name: '等级配置',
                icon: 'menu',
                path: '/member/level',
                component: './user/level',
              },
            ],
          },
          {
            path: '/transaction',
            name: '流水',
            icon: 'transaction',
            routes: [
              {
                name: '区块链交易',
                icon: 'deployment-unit',
                path: '/transaction/blockchain',
                component: './transaction/blockchain',
              },
              {
                name: '财务流水',
                icon: 'retweet',
                path: '/transaction/contract',
                component: './transaction/contract',
              },
            ],
          },
          {
            path: '/article',
            name: '文章',
            icon: 'file-word',
            component: './article/list',
          },
          {
            path: '/article/:id',
            hideInMenu: true,
            component: './article/content',
          },
          {
            path: '/feedback',
            name: '反馈',
            icon: 'message',
            component: './feedback',
          },
          {
            path: '/system',
            name: '系统配置',
            icon: 'setting',
            routes: [
              {
                path: '/system/setting/',
                name: '全局设置',
                icon: 'global',
                component: './system/setting',
              },
              {
                path: '/system/ad/',
                name: '广告',
                icon: 'youtube',
                component: './system/ad',
              },
              {
                path: '/system/menu/',
                name: '菜单管理',
                icon: 'menu',
                component: './system/menu',
              },
              {
                path: '/system/role/',
                name: '角色管理',
                icon: 'user',
                component: './system/role',
              },
              {
                path: '/system/logger/',
                name: '系统日志',
                component: './system/logger',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
