import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { sessionInterceptor } from './composables/interceptor';
import i18n from '@/i18n.js';
import { createHead } from '@unhead/vue';
import '@/assets/scss/app.scss';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { library } from '@fortawesome/fontawesome-svg-core';
// Import only the specific icons used
import { faPhone, faEnvelope, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
// No regular icons were found, so 'far' import is removed.
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

const head = createHead();
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Add only the specific icons to the library
library.add(faPhone, faEnvelope, faArrowRight, faArrowLeft, faFacebook);

app
  .use(i18n)
  .use(router)
  .use(head)
  .use(pinia)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('QuillEditor', QuillEditor);

sessionInterceptor();

app.mount('#app');
