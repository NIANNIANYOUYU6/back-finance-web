import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './styles/index.scss';
import './styles/antv.scss';
import './styles/iconfont.css';
import './styles/font.css';

import VueI18n from './common/lang';

import { tranNumber } from './common/extend-vue'
import './common/extend-vue'

const app = createApp(App);
app.config.globalProperties.$tranNumber = tranNumber;

app.use(store);
app.use(Antd);
app.use(router);
app.use(VueI18n);

app.mount('#app');
