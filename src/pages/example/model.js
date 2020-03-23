export default {

  namespace: 'counter',

  state: {
    num: 0
  },

  reducers: {
    add(state, { num }) {
      return { ...state, num }
    },

    dec(state, { num }) {
      return { ...state, num }
    },
  }
}
