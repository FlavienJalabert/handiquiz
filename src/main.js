import VueRouter from 'vue-router';
import jwt from 'jsonwebtoken';
import Vue from 'vue';
import axios from 'axios';
import localForage from 'localforage';
import lodash from 'lodash';
import VueMaterial from 'vue-material';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import routes from './router';
import App from './App.vue';

import 'vue-material-design-icons/styles.css';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueMaterial);
Vue.config.productionTip = false;

const router = new VueRouter({ mode: 'history', routes });
const baseURL = process.env.NODE_ENV === 'production' ? 'http://localhost:8443' : 'http://localhost:4000';
const vuexStorage = new VuexPersist({
  key: 'sourcelink',
  asyncStorage: true,
  storage: localForage,
});
const store = new Vuex.Store({
  plugins: [vuexStorage.plugin],
  state: {
    token: null,
    tokenType: null,
    userId: null,
    user: null,
    userRole: ['user'],
    expirationDate: null,
    userName: null,
  },
  getters: {
    /* Partially Implemented not for production use */
    loggedIn: state => !!state.token,
    logRole: state => state.userRole,
    baseUrl: state => state.baseURL,
  },
  mutations: {
    login(state, userData) {
      state.token = userData.token;
      state.tokenType = userData.tokenType;
      state.userId = userData.userId;
      state.userRole = userData.userRole;
      state.expirationDate = userData.expirationDate;
      state.user = userData.user;
      state.userName = userData.userName;
    },
    logout(state) {
      state.token = null;
      state.tokenType = null;
      state.userId = null;
      state.expirationDate = null;
      state.user = null;
      state.userRole = ['user'];
      state.userName = null;
    },
  },
  actions: {
    get({ state }, data) {
      const { requestUrl, query } = data;
      return new Promise((resolve, reject) => {
        axios.get(baseURL + requestUrl, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
          params: query,
        })
          .then(res => resolve(res))
          .catch(error => reject(error));
      });
    },
    post({ state }, data) {
      const { requestUrl, payload } = data;
      return new Promise((resolve, reject) => {
        axios.post(baseURL + requestUrl, payload, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        })
          .then(res => resolve(res))
          .catch(error => reject(error));
      });
    },
    put({ state }, data) {
      const { requestUrl, payload } = data;
      return new Promise((resolve, reject) => {
        axios.put(baseURL + requestUrl, payload, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        })
          .then(res => resolve(res))
          .catch(error => reject(error));
      });
    },
    delete({ state }, data) {
      const { requestUrl, payload } = data;
      return new Promise((resolve, reject) => {
        axios.delete(baseURL + requestUrl, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
          data: payload,
        })
          .then(res => resolve(res))
          .catch(error => reject(error));
      });
    },
    login({ commit }, authData) {
      return new Promise((resolve, reject) => {
        axios.post(`${baseURL}/user/login`,
          {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          })
          .then((res) => {
            const token = jwt.decode(res.data.access_token, { complete: true });
            const expirationDate = new Date(token.payload.exp);

            commit('login', {
              token: res.data.access_token,
              tokenType: token.payload.typ,
              expirationDate,
              userId: token.payload.userId,
              user: token.payload.mail,
              userName: token.payload.displayName,
              userRole: token.payload.roles,
            });
            if (authData.returnUrl) {
              resolve({ msg: 'You are logged in', route: authData.returnUrl });
            } else {
              resolve({ msg: 'You are logged in', route: '/me' });
            }
          })
          .catch(error => reject(error));
      });
    },
    logout({ commit }) {
      commit('logout');
      router.push('/login');
    },
  },
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const { authorize, hasToBeLogged } = to.meta;
  const userRoles = store.getters.logRole;

  // check if route is restricted by role
  if (authorize) {
    // check if roles match (default role is "user" for public pages)
    if (lodash.intersection(authorize, userRoles).length) {
      // check if this page requires login
      if (hasToBeLogged && !store.getters.loggedIn) {
        // user not logged
        return next({ path: '/login', query: { returnUrl: to.path } });
      }
      // not logged but this page doesnt requires login so continue navigation
      // or
      // user role authorised so continue navigation
      return next();
    }
  }
  // page has no restrictions so private by default or user need elevation
  // so redirect to same page if exist or home page
  return next({ path: from.path || '/' });
});

// eslint-disable-next-line no-unused-vars
const app = new Vue(Vue.util.extend({ router, store }, App)).$mount('#app');

// console.log(app);
