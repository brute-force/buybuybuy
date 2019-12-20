export const state = () => ({
  companyName: '',
  ticker: ''
});

export const mutations = {
  setCompanyName (state, companyName) {
    state.companyName = companyName;
  },
  setTicker (state, ticker) {
    state.ticker = ticker;
  }
};

export const actions = {
  setCompanyName ({ commit }, companyName) {
    commit('setCompanyName', companyName);
  },
  setTicker ({ commit }, ticker) {
    commit('setTicker', ticker);
  }
};

export const getters = {
  companyName: state => state.companyName,
  ticker: state => state.ticker
};
