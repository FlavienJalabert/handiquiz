<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">Log in</div>
        </md-card-header>

        <md-card-content>
          <md-field :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="form.email"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
            <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
          </md-field>
          <md-field :class="getValidationClass('pwd')">
            <label for="pwd">Password</label>
            <md-input
              type="password"
              name="pwd"
              id="pwd"
              autocomplete="password"
              v-model="form.pwd"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.form.pwd.required">Your password is required</span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Log in</md-button>
        </md-card-actions>
      </md-card>
    </form>

    <md-snackbar :md-active.sync="showSnackbar" :md-persistent="true">
      <span>{{this.logInfo}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required,
  email,
} from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  data() {
    return {
      form: {
        email: '',
        pwd: '',
      },
      sending: false,
      logInfo: '',
      showSnackbar: false,
    };
  },
  computed: {
    loggedIn() { return this.$store.getters.loggedIn; },
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      pwd: {
        required,
      },
    },
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty,
        };
      }
      return false;
    },
    login() {
      this.sending = true;
      this.$store.dispatch('login', { email: this.form.email, password: this.form.pwd, returnUrl: this.$route.query.returnUrl })
        .then((res) => {
          this.logInfo = res.msg;
          this.showSnackbar = true;
          this.$router.push(res.route);
        })
        .catch((error) => {
          this.sending = false;
          this.logInfo = error;
          this.showSnackbar = true;
        });
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.login();
      }
    },
  },
};
</script>

<style scoped>
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
</style>
