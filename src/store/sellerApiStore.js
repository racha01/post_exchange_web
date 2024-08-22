import axios from "axios";
import Vuex from "vuex";

let mongo_seller_api = "https://localhost:7287/api/sellers/";

export const store = new Vuex.Store({
  state: {
    sellers: [],
  },

  mutations: {
    getSeller(state, { res }) {
      state.sellers = res.data;
    },
    addSeller(state, { payload }) {
      state.sellers.push(payload);
    },
    editSeller(state, { payload }) {
      state.sellers[payload.index] = {
        sellerCode: payload.seller_code,
        sellerName: payload.seller_name,
      };
    },
  },
  // "https://localhost:7287/api/sellers"
  actions: {
    async getSeller({ commit }) {
      await axios
        .get(mongo_seller_api)
        .then((res) => commit("getSeller", { res }))
        .catch((err) => alert(err));
    },
    async addSeller({ commit }, payload) {
      await axios
        .post(mongo_seller_api, payload)
        .then(() => commit("addSeller", { payload }))
        .catch((err) => alert(err));
    },
    async editSeller({ commit }, payload) {
      await axios
        .put(mongo_seller_api + payload.id, payload)
        .then(() => commit("editSeller", { payload }))
        .catch((err) => alert(err));
    },
  },

  getters: {
    items: (state) => state.sellers,
  },
});
