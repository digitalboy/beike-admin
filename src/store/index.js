// src/store/index.js
import { createStore } from "vuex";

export default createStore({
  state: {
    token: "",
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {
    setToken({ commit }, token) {
      commit("setToken", token);
    },
  },
  modules: {},
});
