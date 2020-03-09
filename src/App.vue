<template>
  <div class="page-container">
    <md-app md-mode="reveal" md-theme="default">
      <md-app-toolbar class="md-primary" md-elevation="0">
        <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Quizz</span>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>Navigation</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>arrow_back</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>

          <md-list-item class="nav-item">
            <router-link
              :to="{ name: 'home' }"
              tag="md-button"
              class="md-icon-button md-dense"
            ><md-icon>home</md-icon></router-link>
            <router-link
              tag="md-button"
              :to="{ name: 'home' }"
              class="md-primary md-theme-default"
            >
              Home
            </router-link>
          </md-list-item>

          <md-list-item v-if="hasRole('admin')" class="nav-item">
            <router-link
              tag="md-button"
              :to="{name: 'Create'}"
              class="md-icon-button md-dense"
            ><md-icon>create</md-icon></router-link>
            <router-link
              tag="md-button"
              :to="{name: 'Create'}"
              class="md-primary md-theme-default"
            >
              Create quiz
            </router-link>
          </md-list-item>

          <md-list-item v-if="hasRole('admin')" class="nav-item">
            <router-link tag="md-button" :to="{name: 'Picture'}" class="md-icon-button md-dense">
              <md-icon>add_box</md-icon>
            </router-link>
            <router-link
              tag="md-button"
              :to="{name: 'Picture'}"
              class="md-primary md-theme-default"
            >
              Add Pictures
            </router-link>
          </md-list-item>

          <md-list-item v-if="hasRole('admin')" class="nav-item">
            <router-link tag="md-button" :to="{name: 'register'}" class="md-icon-button md-dense">
              <md-icon>person_add</md-icon>
            </router-link>
            <router-link
              tag="md-button"
              :to="{name: 'register'}"
              class="md-primary md-theme-default"
            >
              Add user
            </router-link>
          </md-list-item>

          <md-list-item v-if="!loggedIn" class="nav-item">
            <router-link tag="md-button" to="/login" class="md-icon-button md-dense">
              <md-icon>input</md-icon>
            </router-link>
            <router-link
              tag="md-button"
              to="/login"
              class="md-primary md-theme-default"
            >
              Login
            </router-link>
          </md-list-item>

          <slot v-else>
            <md-list-item class="nav-item">
              <router-link
                tag="md-button"
                :to="{name: 'me'}"
                class="md-icon-button md-dense"
              ><md-icon>person</md-icon></router-link>
              <router-link
                tag="md-button"
                :to="{name: 'me'}"
                class="md-primary md-theme-default"
              >
                My user
              </router-link>
            </md-list-item>

            <md-list-item class="nav-item">
              <md-button @click="toggleDialog" class="md-icon-button md-accent md-dense">
                <md-icon>power_settings_new</md-icon>
              </md-button>
              <md-button @click="toggleDialog" class="md-accent md-theme-default">
                logout
              </md-button>
            </md-list-item>
          </slot>
        </md-list>
      </md-app-drawer>

      <md-app-content> <!-- md-theme="my-theme" -->
        <transition name="slide-left">
          <router-view></router-view>
        </transition>
      </md-app-content>
    </md-app>

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Log Out</md-dialog-title>
      <md-dialog-content>are you sure you want to logout ?</md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="logout">logout</md-button>
        <md-button class="md-primary" @click="toggleDialog">cancel</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-snackbar :md-active.sync="showSnackbar">
      <span>Logged out</span>
      <md-button class="md-primary" @click="toggleSnackBar">Close</md-button>
    </md-snackbar>
  </div>
</template>

<style lang="scss">
  @import "~material-design-icons/iconfont/material-icons.css";

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
  .md-content {
    min-height: 93vh;
  }
  a.md-button:hover {
    color: var(--md-theme-default-background, #424242);
    text-decoration: none;
  }
  a.md-button {
    margin: 0;
    min-width: 30px;
  }
  a.md-button .md-icon {
    vertical-align: middle;

  }
</style>

<script>

export default {
  data: () => ({
    menuVisible: false,
    showDialog: false,
    showSnackbar: false,
  }),
  computed: {
    loggedIn() { return this.$store.getters.loggedIn; },
    loggedOut() { return !this.$store.getters.loggedIn; },
  },
  methods: {
    hasRole(role) { return this.$store.getters.logRole.indexOf(role) !== -1; },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    toggleDialog() {
      this.showDialog = !this.showDialog;
    },
    toggleSnackBar() {
      this.showSnackbar = this.loggedOut === true && this.showSnackbar === false;
    },
    logout() {
      this.showDialog = false;
      this.$store.dispatch('logout');
      this.toggleSnackBar();
    },
  },
};
</script>
