import Vuex from 'vuex';
import axios from 'axios';

export default new Vuex.Store({
  state: {
    data: [],
    loading: false,
    error: null,
  },
  mutations: {
    SET_DATA(state, payload) {
      state.data = payload;
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    async fetchData({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      try {
        const response = await axios.get('https://localhost:7287/api/sellers');
        commit('SET_DATA', response.data);
      } catch (error) {
        commit('SET_ERROR', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    getData: (state) => state.data,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});