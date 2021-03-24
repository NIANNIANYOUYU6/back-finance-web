import Vuex from 'vuex';

export default new Vuex.Store({
  state: {
    account: '',
    currentChain: '',
  },
  mutations: {
    // 更新信息
    setState(state, payload) {
      Object.assign(state, payload);
    },
  },
  actions: {},
  modules: {},
});
