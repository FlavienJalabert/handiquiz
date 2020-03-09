<template>
  <div>
    <div v-if="listEmpty">
      <div v-if="hasRole('admin')">
        <md-empty-state
          md-icon="widgets"
          md-label="Create your first quiz"
          md-description="Creating quiz, you'll be able to upload
          your images and create your first quiz.">
          <router-link
            v-if="imagesEmpty"
            tag="md-button"
            :to="{name : 'Picture' }"
            class="md-raised md-theme-default md-primary"
          >
            <span>Upload first image</span>
          </router-link>
          <router-link
            v-else
            tag="md-button"
            :to="{name : 'Create' }"
            class="md-raised md-theme-default md-primary"
          >
            <span>Create first Quiz</span>
          </router-link>
        </md-empty-state>
      </div>
      <div v-else>
        <md-empty-state
          md-rounded
          md-icon="access_time"
          md-label="Nothing to show :("
          md-description="You will see here every quiz once they are created by your administrator,
          if something is wrong, please contact your administrator.">
        </md-empty-state>
      </div>
    </div>
    <div v-else class="full-control">
      <div class="list">
        <md-list :md-expand-single="expandSingle">
          <md-list-item md-expand :md-expanded.sync="expandNews">
            <md-icon>whatshot</md-icon>
            <span class="md-list-item-text">News</span>

            <md-list slot="md-expand">
              <md-list-item class="md-inset">World</md-list-item>
              <md-list-item class="md-inset">Europe</md-list-item>
              <md-list-item class="md-inset">South America</md-list-item>
            </md-list>
          </md-list-item>

          <md-list-item md-expand>
            <md-icon>videogame_asset</md-icon>
            <span class="md-list-item-text">Games</span>

            <md-list slot="md-expand">
              <md-list-item class="md-inset">Console</md-list-item>
              <md-list-item class="md-inset">PC</md-list-item>
              <md-list-item class="md-inset">Phone</md-list-item>
            </md-list>
          </md-list-item>

          <md-list-item md-expand>
            <md-icon>video_library</md-icon>
            <span class="md-list-item-text">Video</span>

            <md-list slot="md-expand">
              <md-list-item class="md-inset">Humor</md-list-item>
              <md-list-item class="md-inset">Music</md-list-item>
              <md-list-item class="md-inset">Movies</md-list-item>
              <md-list-item class="md-inset">TV Shows</md-list-item>
            </md-list>
          </md-list-item>

          <md-list-item>
            <md-icon>shopping_basket</md-icon>
            <span class="md-list-item-text">Shop</span>
          </md-list-item>
        </md-list>
      </div>
      <div class="control">
        <md-switch v-model="expandSingle">Expand Only One</md-switch>
        <md-checkbox v-model="expandNews">Expand News</md-checkbox>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      quizList: [],
      listEmpty: true,
      imagesEmpty: false,
    };
  },
  methods: {
    hasRole(role) {
      return this.$store.getters.logRole.indexOf(role) !== -1;
    },
  },
  mounted() {
    this.$store.dispatch('get', { requestUrl: '/image/getAll' }).then((res) => {
      this.imagesEmpty = res.images === [];
      this.$store.dispatch('get', { requestUrl: '/quiz/getAll' }).then((quiz) => {
        this.quizList = quiz.data;
        this.listEmpty = this.quizList.length === 0;
      });
    });
  },

};
</script>
