import Vuex from "vuex";
import axios from "axios";

// let mongo_seller_api = "https://localhost:7287/api/sellers/";

export const store = new Vuex.Store({
  state: {
    sellers: [],
    loading: false,
    error: null
  },
  mutations: {
    setSellers(state, sellers) {
      state.sellers = sellers;
      console.log('mutations')
      console.log(state.sellers)
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchSellers({ commit }) {
      commit('setLoading', true);
      commit('setError', null);
      try {
        const response = await axios.get("https://localhost:7287/api/sellers");
        commit('setSellers', response.data);
        console.log(response.data)
      } catch (error) {
        commit('setError', error.message);
        console.error("Error fetching sellers:", error);
      } finally {
        commit('setLoading', false);
      }
    }
  },
});