import { defineConfig } from 'umi';

export default defineConfig({
  proxy: {
    '/use': {
      target: 'http://127.0.0.1:5000/', // 服务器地址
      changeOrigin: true,
      pathRewrite: { '^/use': '/api/v1' },
    },
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/',
      component: '@/layouts/index' ,
      routes: [
            { path: '/', component: '@/pages/home/index' },
            { path: '/kg', component:  '@/pages/kg/index'},
            { path: '/export', component:  '@/pages/export/index'},
            { path: '/statistic', component:  '@/pages/statistic/index'},
            { path: '/address', component: '@/pages/address/index'}
      ],
    },

  ],
  // fastRefresh: {},
  theme: {
    '@theme-green': 'rgba(50, 237, 105, 1)',
    '@theme-blue': 'rgba(61, 113, 185, 1)',
    '@theme-blue8': 'rgba(61, 113, 185, 0.8)',
    '@theme-dark-blue': 'rgba(20, 80, 163, 1)',
    '@theme-light-blue': 'rgba(171, 197, 216, 1)',
    '@white': 'rgba(255, 255, 255, 1)',
    '@white3': 'rgba(255, 255, 255, 0.3)',
    '@white8': 'rgba(255, 255, 255, 0.8)',
    '@content-width': '1200px',
  },
});