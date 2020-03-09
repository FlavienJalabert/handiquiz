<template>
  <div>
    <form class="md-layout">
    <md-card class="md-layout-item md-size-50 md-small-size-100">
      <md-card-header>
        <div class="md-title">Upload Picture</div>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label>Upload file</label>
              <md-file accept="image/*" multiple @change="onFileSelected"/>
            </md-field>
          </div>
        </div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label>File title</label>
              <md-input v-model="post.title"></md-input>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label>File alternative</label>
              <md-input v-model="post.alt"></md-input>
            </md-field>
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button class="md-button" type="submit" @click="upload">Upload</md-button>
      </md-card-actions>
    </md-card>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFile: File,
      post: {
        title: '',
        alt: '',
      },
    };
  },
  methods: {
    onFileSelected(event) {
      const [selectedFile] = event.target.files;
      this.selectedFile = selectedFile;
    },
    upload() {
      this.post.name = this.selectedFile.name;
      const formData = new FormData();
      formData.append('uploaded', this.selectedFile, this.selectedFile.name);
      this.$store.dispatch('post', { requestUrl: '/upload/add', payload: formData });
      this.$store.dispatch('post', { requestUrl: '/upload/add', payload: this.post });
    },
  },
};
</script>

<style scoped>

</style>
