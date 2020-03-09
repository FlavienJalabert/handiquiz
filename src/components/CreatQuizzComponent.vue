<template>
  <div class="full-control md-layout">
    <slot name="quizCreation" v-if="step === 'quizCreation'">
      <div class="row md-layout-item md-card">
        <md-list>
          <md-card-header>
            <md-toolbar class="md-title">Your images</md-toolbar>
          </md-card-header>
          <draggable
            class="list-group"
            :list="images.images"
            :group="{ name: 'images', pull: 'clone', put: false }"
            :clone="cloneImage"
            tag="div"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
            id="drag"
          >
            <md-list-item
              v-for="(element, index) in images.images"
              :key="index"
            >
              <img
                class="list-group-item"
                :src="element.url"
                :alt="element.alt"
                :title="element.title"
              />
            </md-list-item>
          </draggable>
        </md-list>
      </div>

      <div class="row md-layout-item md-card">
        <md-list>
          <md-card-header>
            <md-toolbar class="md-title">Images to add</md-toolbar>
          </md-card-header>
          <draggable
            class="list-group"
            :list="images.quizImages"
            group="images"
            tag="div"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
            id="drop"
          >
            <md-list-item
              v-for="(element, index) in images.quizImages"
              :key="index"
            >
              <md-button
                title="Remove this image"
                class="md-icon-button md-list-action"
                @click="removeAt(index)"
              >
                <md-icon class="md-primary">remove_circle</md-icon>
              </md-button>
              <slot>
                <img
                  class="list-group-item"
                  :src="element.url"
                  :alt="element.alt"
                  :title="element.title"
                />
                <md-icon class="material-icons">unfold_more</md-icon>
              </slot>
            </md-list-item>
          </draggable>
        </md-list>
      </div>

      <div class="row md-layout-item md-card">
        <md-steppers :md-active-step.sync="active" md-vertical md-linear>
          <md-step
            id="question"
            md-label="Compose Question"
            :md-done.sync="question"
            :md-editable="false"
            :md-error="stepError[0]"
          >

            <md-button class="md-icon-button md-dense" @click="setDone('question', 'response1')">
              <md-icon>arrow_downward</md-icon>
            </md-button>
          </md-step>
          <md-step
            id="response1"
            md-label="First response"
            :md-done.sync="response1"
            :md-editable="false"
            :md-error="stepError[1]"
          >

            <md-button class="md-icon-button md-dense" @click="back('response1', 'question')">
              <md-icon>arrow_upward</md-icon>
            </md-button>
            <md-button class="md-icon-button md-dense" @click="setDone('response1', 'response2')">
              <md-icon>arrow_downward</md-icon>
            </md-button>
          </md-step>
          <md-step
            id="response2"
            md-label="Second response"
            :md-done.sync="response2"
            :md-editable="false"
            :md-error="stepError[2]"
          >

            <md-button class="md-icon-button md-dense" @click="back('response2', 'response1')">
              <md-icon>arrow_upward</md-icon>
            </md-button>
            <md-button class="md-icon-button md-dense" @click="setDone('response2', 'response3')">
              <md-icon>arrow_downward</md-icon>
            </md-button>
          </md-step>
          <md-step
            id="response3"
            md-label="Third response"
            :md-done.sync="response3"
            :md-editable="false"
            :md-error="stepError[3]"
          >

            <md-button class="md-icon-button md-dense" @click="back('response3', 'response2')">
              <md-icon>arrow_upward</md-icon>
            </md-button>
            <md-button class="md-icon-button md-dense" @click="setDone('response3', 'response4')">
              <md-icon>arrow_downward</md-icon>
            </md-button>
          </md-step>
          <md-step
            id="response4"
            md-label="Fourth response"
            :md-done.sync="response4"
            :md-editable="false"
            :md-error="stepError[4]"
          >

            <md-button
              class="md-icon-button md-dense"
              @click="back('response4', 'response3')"
            >
              <md-icon>arrow_upward</md-icon>
            </md-button>
            <md-button
              class="md-icon-button md-dense"
              @click="setDone('response4', 'answerDescription')"
            >
              <md-icon>arrow_downward</md-icon>
            </md-button>
          </md-step>
          <md-step
            id="answerDescription"
            md-label="Answer Description"
            :md-done.sync="answerDescription"
            :md-editable="false"
            :md-error="stepError[5]"
          >

            <md-button
              class="md-icon-button md-dense"
              @click="back('answerDescription', 'response4')"
            >
              <md-icon>arrow_upward</md-icon>
            </md-button>
            <md-button class="md-icon-button md-accent md-dense" @click="confirmQuiz">
              <md-icon>last_page</md-icon>
            </md-button>
          </md-step>
        </md-steppers>
      </div>
    </slot>

    <slot name="quizAnswer" v-if="step === 'quizAnswer'">
      <md-card>
        <md-card-header>
          <div class="md-title">Choose the right Answer</div>
        </md-card-header>
        <md-card-content v-model="finalQuiz">
          <i v-for="(image, index) in finalQuiz.quiz[0].question"
               :key="index">
            <img
              class="list-group-item"
              :src="image.url"
              :alt="image.alt"
              :title="image.title"
            />
          </i>
          <ol>
            <li>
              <i v-for="(image, index) in finalQuiz.quiz[0].response1"
                     :key="index"
              >
                <img
                  class="list-group-item"
                  :src="image.url"
                  :alt="image.alt"
                  :title="image.title"
                />
              </i>
            </li>
            <li>
              <i v-for="(image, index) in finalQuiz.quiz[0].response2"
                   :key="index"
              >
                <img
                  class="list-group-item"
                  :src="image.url"
                  :alt="image.alt"
                  :title="image.title"
                />
              </i>
            </li>
            <li v-if="finalQuiz.quiz[0].response3.length !== 0">
              <i v-for="(image, index) in finalQuiz.quiz[0].response3"
                   :key="index"
              >
                <img
                  class="list-group-item"
                  :src="image.url"
                  :alt="image.alt"
                  :title="image.title"
                />
              </i>
            </li>
            <li v-if="finalQuiz.quiz[0].response4.length !== 0">
              <i v-for="(image, index) in finalQuiz.quiz[0].response4"
                   :key="index"
              >
                <img
                  class="list-group-item"
                  :src="image.url"
                  :alt="image.alt"
                  :title="image.title"
                />
              </i>
            </li>
          </ol>
        </md-card-content>
        <md-card-actions>
          <md-button class="md-primary" @click="validateResponse(1)">1</md-button>
          <md-button class="md-primary" @click="validateResponse(2)">2</md-button>
          <md-button
            class="md-primary"
            v-if="finalQuiz.quiz[0].response3.length !== 0"
            @click="validateResponse(3)"
          >
            3
          </md-button>
          <md-button
            class="md-primary"
            v-if="finalQuiz.quiz[0].response4.length !== 0"
            @click="validateResponse(4)"
          >
            4
          </md-button>
        </md-card-actions>
      </md-card>
      <form
        v-show="responseValidated"
        novalidate
        class="md-layout"
        @submit.prevent="post"
      >
        <md-card>
            <md-card-header>
              <div class="md-title">Select quiz tags</div>
            </md-card-header>
          <md-card-content>
            <md-field>
              <md-select v-model="finalQuiz.tagList" name="tags" id="tags" multiple>
                <md-option v-for="(tag, index) in tags" :key="index" :value="tag">
                  {{tag}}
                </md-option>
              </md-select>
            </md-field>
          </md-card-content>
          <md-card-actions>
            <md-button type="submit" class="md-primary">Create Question</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </slot>
  </div>
</template>
<script>

import draggable from 'vuedraggable';

export default {
  animation: 150,
  components: {
    draggable,
  },
  data() {
    return {
      enabled: true,
      step: 'quizCreation',
      stepError: [null, null, null, null, null, null],
      responseValidated: false,
      active: 'question',
      question: false,
      response1: false,
      response2: false,
      response3: false,
      response4: false,
      answerDescription: false,
      images: {
        images: [],
        quizImages: [],
      },
      tags: [
        'nature',
        'Animals',
        'technology',
        'children',
        'edibles',
        'cheese',
        'other',
      ],
      finalQuiz: {
        quiz: [{
          question: [],
          response1: [],
          response2: [],
          response3: [],
          response4: [],
          correctAnswer: 0,
          answerDescription: [],
        }],
        tagList: [],
      },
    };
  },
  mounted() {
    this.$store.dispatch('get', { requestUrl: '/image/getAll' }).then((response) => {
      this.images.images = response.data.images;
    });
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'images',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
  },
  methods: {
    post() {
      this.$store.dispatch('post', { requestUrl: '/quiz/create', payload: this.finalQuiz });
    },
    validateResponse(id) {
      this.finalQuiz.quiz[0].correctAnswer = id;
      this.responseValidated = true;
    },
    removeAt(idx) {
      this.images.quizImages.splice(idx, 1);
    },
    cloneImage({ url, alt, title }) {
      return {
        url,
        alt,
        title,
      };
    },
    setDone(id, nextStep) {
      this[id] = true;
      this.finalQuiz.quiz[0][id] = this.images.quizImages;
      this.images.quizImages = this.finalQuiz.quiz[0][nextStep];
      this.active = nextStep;
      this.stepError = [null, null, null, null, null, null];
    },
    back(id, previousStep) {
      this[id] = false;
      this.finalQuiz.quiz[0][id] = this.images.quizImages;
      this.images.quizImages = this.finalQuiz.quiz[0][previousStep];
      this.active = previousStep;
      this.stepError = [null, null, null, null, null, null];
    },
    confirmQuiz() {
      this.finalQuiz.quiz[0].answerDescription = this.images.quizImages;
      this.images.quizImages = [];
      if (this.finalQuiz.quiz[0].question.length === 0) {
        this.active = 'question';
        this.stepError[0] = 'Question needs at least one image';
      } else if (this.finalQuiz.quiz[0].response1.length === 0) {
        this.active = 'response1';
        this.stepError[1] = 'Response 1 needs at least one image';
      } else if (this.finalQuiz.quiz[0].response2.length === 0) {
        this.active = 'response2';
        this.stepError[2] = 'Response 2 needs at least one image';
      } else if (this.finalQuiz.quiz[0].answerDescription.length === 0) {
        this.active = 'answerDescription';
        this.stepError[5] = 'Answer description needs at least one image';
      } else {
        this.step = 'quizAnswer';
      }
    },
  },
};
</script>
<style>
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .md-card {
    width: 100%;
  }
  #drag .md-list-item {
    display: inline-block;
    float: left;
  }
  .list-group-item {
    height: 100px;
    width: 100px;
  }
  .list-group {
    max-height: 75vh;
    min-height: 150px;
    list-style: none;
    overflow: auto;
    direction: rtl;
  }
  .list-group::-webkit-scrollbar {
    width: 6px;
    background-color: #F5F5F5;
  }
  .list-group::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
  }
  .list-group::-webkit-scrollbar-thumb {
    background-color: #424242;
  }
  .md-card {
    max-height: 90vh;
  }
  .md-list {
    width: 320px;
    max-width: 100%;
    display: inline-block;
    vertical-align: top;
  }
  .md-stepper-label {
    font-size: 25px;
  }
  slot[name="quizAnswer"] i {
    text-align: justify;
  }
  slot[name="quizAnswer"] img {
    float: left;
  }
</style>
