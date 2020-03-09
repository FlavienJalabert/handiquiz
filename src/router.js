import HomeComponent from './components/HomeComponent.vue';
import CreateComponent from './components/CreateComponent.vue';
import IndexComponent from './components/IndexComponent.vue';
import LoginComponent from './components/LoginComponent.vue';
import EditComponent from './components/EditComponent.vue';
import quizzAnswer from './components/QuizzComponent.vue';
import PicureComponent from './components/PictureComponent.vue';
import CreatQuizzComponent from './components/CreatQuizzComponent.vue';

export default [
  {
    name: 'home',
    path: '/',
    component: HomeComponent,
    meta: {
      authorize: ['user'],
    },
  },
  {
    name: 'register',
    path: '/createUser',
    component: CreateComponent,
    meta: {
      authorize: ['admin'],
    },
  },
  {
    name: 'login',
    path: '/login',
    component: LoginComponent,
    meta: {
      authorize: ['user'],
    },
  },
  {
    name: 'me',
    path: '/me',
    component: IndexComponent,
    meta: {
      authorize: ['user', 'helper', 'admin'],
      hasToBeLogged: true,
    },
  },
  {
    name: 'edit',
    path: '/edit/:id',
    component: EditComponent,
    meta: {
      authorize: ['user', 'helper', 'admin'],
      hasToBeLogged: true,
    },
  },
  {
    name: 'quizz',
    path: '/quizz',
    component: quizzAnswer,
    meta: {
      authorize: ['user', 'helper', 'admin'],
    },
  },
  {
    name: 'Picture',
    path: '/upload',
    component: PicureComponent,
    meta: {
      authorize: ['helper', 'admin'],
    },
  },
  {
    name: 'Create',
    path: '/create',
    component: CreatQuizzComponent,
    meta: {
      authorize: ['helper', 'admin'],
    },
  },
  // otherwise redirect to home
  { path: '*', redirect: '/' },
];
