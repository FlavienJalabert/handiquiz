<template>
  <div>
    <form class="md-layout" @submit.prevent="upload">
    <md-card class="md-layout-item md-size-50 md-small-size-100">
      <md-card-header>
        <div class="md-title">Upload Picture</div>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label>Upload file</label>
              <md-file accept="image/*" aria-required="true" multiple @change="onFileSelected"/>
            </md-field>
          </div>
        </div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label>File title</label>
              <md-input aria-required="true" v-model="post.title"></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label>File alternative</label>
              <md-input aria-required="true" v-model="post.alt"></md-input>
            </md-field>
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button class="md-button" type="submit">Upload</md-button>
      </md-card-actions>
    </md-card>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFiles: [File],
      post: {
        title: '',
        alt: '',
        name: [],
      },
    };
  },
  methods: {
    onFileSelected(event) {
      this.selectedFiles = event.target.files;
    },
    upload() {
      const formData = new FormData();
      this.selectedFiles.forEach((file, index) => {
        this.post.name[index] = file.name;
        formData.append(`upload${index}`, file, file.name);
      });
      this.$store.dispatch('post', { requestUrl: '/upload/add', payload: formData });
      this.$store.dispatch('post', { requestUrl: '/upload/add', payload: this.post });
    },
  },
};
</script>

<style scoped>

</style>
