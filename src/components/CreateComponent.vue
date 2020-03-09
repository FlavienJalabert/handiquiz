<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">Create user</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('firstName')">
                <label for="first-name">First Name</label>
                <md-input
                  name="first-name"
                  id="first-name"
                  autocomplete="given-name"
                  v-model="form.firstName"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.firstName.required">
                  The first name is required
                </span>
                <span class="md-error" v-else-if="!$v.form.firstName.minlength">
                  Invalid first name
                </span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('lastName')">
                <label for="last-name">Last Name</label>
                <md-input
                  name="last-name"
                  id="last-name"
                  autocomplete="family-name"
                  v-model="form.lastName"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.lastName.required">
                  The last name is required
                </span>
                <span class="md-error" v-else-if="!$v.form.lastName.minlength">
                  Invalid last name
                </span>
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('username')">
                <label for="username">UserName</label>
                <md-input
                  type="text"
                  id="username"
                  name="username"
                  autocomplete="username"
                  v-model="form.username"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.username.required">
                  The username is required
                </span>
                <span class="md-error" v-else-if="!$v.form.username.maxlength">
                  Invalid username
                </span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('password')">
                <label for="password">Password</label>
                <md-input
                  name="password"
                  id="password"
                  type="password"
                  v-model="form.password"
                  md-dense :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.password.required">
                  The password is required
                </span>
                <span class="md-error" v-else-if="!$v.form.password.maxlength">
                  Password is not complex enough
                </span>
              </md-field>
            </div>
          </div>

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
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Create user</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="userSaved">
        The user {{ lastUser }} was saved with success!
      </md-snackbar>
      <md-snackbar md-position="center" :md-active.sync="userCannotBeSaved" :md-duration="Infinity">
        <span class="md-error">User cannot be saved</span>
        <md-button class="md-primary" @click="retry">
          <md-progress-spinner
            v-if="sendingRetry"
            :md-diameter="30"
            :md-stroke="3"
            md-mode="indeterminate"
          >
          </md-progress-spinner>
          <span v-else>Retry</span>
        </md-button>
      </md-snackbar>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required,
  email,
  minLength,
  maxLength,
} from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  mixins: [validationMixin],
  data() {
    return {
      form: {
        firstName: null,
        lastName: null,
        username: null,
        email: null,
        password: null,
        roles: ['user'],
        provider: 'local',
      },
      userSaved: false,
      userCannotBeSaved: null,
      sending: false,
      sendingRetry: false,
      sendingError: null,
      lastUser: null,
    };
  },
  validations: {
    form: {
      firstName: {
        required,
        minLength: minLength(3),
      },
      lastName: {
        required,
        minLength: minLength(3),
      },
      username: {
        required,
        maxLength: maxLength(25),
      },
      password: {
        required,
        minlength: minLength(8),
      },
      email: {
        required,
        email,
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
      return null;
    },
    clearForm() {
      this.$v.$reset();
      this.form.firstName = null;
      this.form.lastName = null;
      this.form.username = null;
      this.form.password = null;
      this.form.email = null;
    },
    saveUser() {
      this.sending = true;

      this.$store.dispatch('post', { requestUrl: '/user/add', payload: this.form }).then((response) => {
        this.userSaved = true;
        this.userCannotBeSaved = false;
        this.lastUser = response.data.displayName;
        this.sending = false;
        this.clearForm();
      }).catch((error) => {
        this.userCannotBeSaved = true;
        this.sendingError = error;
        this.sending = false;
      });
    },
    retry() {
      this.sendingRetry = true;

      axios.post(`${this.$store.getters.baseUrl}/user/add`, this.form).then((response) => {
        this.userSaved = true;
        this.userCannotBeSaved = false;
        this.lastUser = response.data.displayName;
        this.sendingRetry = false;
        this.clearForm();
      }).catch((error) => {
        this.userCannotBeSaved = true;
        this.sendingError = error;
        this.sendingRetry = false;
      });
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    },
  },
};
</script>

<style scoped>
  .md-progress-spinner {
    display: inline-block;
  }
</style>
