import React from 'react';
import {
  HomeOutlined,
  DesktopOutlined,
  CloudOutlined,
  SmileOutlined,
  CrownOutlined,
  SoundOutlined,
  TabletOutlined,
  AntDesignOutlined,
  SisternodeOutlined,
} from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      // {
      //   path: '/home',
      //   name: '主页',
      //   icon: <HomeOutlined />,
      // },
      {
        path: '/kg',
        name: '事件统计',
        icon: <DesktopOutlined />,
      },
      {
        path: '/address',
        name: '地点统计',
        icon: <CloudOutlined />,
      },
      {
        path: '/statistic',
        name: '数据总览',
        icon: <SmileOutlined />,
      },
      {
        path: '/export',
        name: '数据导出',
        icon: <CrownOutlined />,
      },
      // {
      //   path: '/analyse',
      //   name: '数据分析',
      //   icon: <CloudOutlined />,
      //   routes: [
      //     {
      //       path: '/analyse/keywords',
      //       name: '关键词分析',
      //     },
      //     {
      //       path: '/analyse/wordcloud',
      //       name: '词云分析',
      //     }
      //   ],
      // },
      // {
      //   path: '/question',
      //   name: '知识问答',
      //   icon: <TabletOutlined />,
      //   routes: [
      //     {
      //       path: '/question/user',
      //       name: '问答助手',
      //     },
      //     {
      //       path: '/question/teacher',
      //       name: '教师解答',
      //     }
      //   ],
      // },

    ],
  },
  location: {
    pathname: '/',
  },
};
