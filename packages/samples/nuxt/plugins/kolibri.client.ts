import { defineNuxtPlugin } from '#app';

import { defineCustomElements } from '@public-ui/components/dist/loader';
import { register } from '@public-ui/components';
import { ITZBund } from '@public-ui/themes';

import '@public-ui/components/dist/kolibri/kolibri.esm.js';

console.log('test?');

export default defineNuxtPlugin((nuxtApp) => {
	register(ITZBund, defineCustomElements)
		.then(() => console.log('Components registered'))
		.catch(console.warn);
});

// export default defineNuxtPlugin({
// 	setup() {
// 		register(ITZBund, defineCustomElements)
// 			.then(() => console.log('Components registered'))
// 			.catch(console.warn);
// 	},
// });

// export default {
// 	install() {
// 		register(ITZBund, defineCustomElements)
// 			.then(() => console.log('Components registered'))
// 			.catch(console.warn);
// 	},
// };
