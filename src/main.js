import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App';

Vue.config.productionTip = false;
Vue.use(Vuetify);

import('../node_modules/vuetify/dist/vuetify.min.css');

new Vue({
	el: '#app',
	template: '<App/>',
	components: { App }
});
