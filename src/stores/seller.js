import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";

let mongo_seller_api = "https://localhost:7287/api/sellers/";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    sellers: []
  },

  mutations: {
    fetchSeller(state, { res }){
      state.sellers = res.data;
    },
    addSeller(state, { payload }) {
      state.sellers.push(payload);
    },
    editSeller(state, { payload }){
      state.sellers[payload.index] = { 
        sellerCode: payload.seller_code,
        sellerName: payload.seller_name,
      }
    }
  },

  actions: {
    async fetchSeller({ commit }) {
      await Axios.get(mongo_seller_api)
        .then(res => commit("fetchSeller", { res }))
        .catch(err => alert(err));
    },
    async addSeller({ commit }, payload) {
      await Axios.post(mongo_seller_api, payload)
        .then(() => commit("addSeller", { payload }))
        .catch(err => alert(err));
    },
    async editSeller( {commit}, payload){
      await Axios.put(mongo_seller_api + payload.id, payload)
        .then(() => commit("editSeller", { payload }))
        .catch(err => alert(err));
    }
  },

  getters: {
    sellers: state => state.sellers
  }
});