import { createStore } from 'vuex'
import axios from 'axios';
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    contacts: [],
  },
  plugins: [
    createPersistedState()
  ],
  mutations: {
    SET_CONTACTS_TO_STATE: (state, contacts) => {
      state.contacts = contacts
    },
    CHANGE_CONTACT_IN_STATE: (state, contact) => {
      state.contacts.map(function(item) {
        if (item.id === contact.id) {
          item.name = contact.name
          item.address.country = contact.address.country 
          item.address.city = contact.address.city
          item.email = contact.email
          item.phone = contact.phone
          item.favorite = contact.favorite
        }
      })
    },
  },
  actions: {
    GET_CONTACTS_FROM_API({commit}) {
      return axios('https://demo.sibers.com/users', {
          method: 'GET'
      })
      .then((contacts) => {
          commit('SET_CONTACTS_TO_STATE', contacts.data);
          return contacts;
      })
      .catch((error) => {
          console.log(error)
          return error;
      })
    },
    CHANGE_CONTACT({commit}, contact) {
      commit('CHANGE_CONTACT_IN_STATE', contact);
    }
  },
  getters: {
    CONTACTS(state) {
      return state.contacts;
    }
  }
})
