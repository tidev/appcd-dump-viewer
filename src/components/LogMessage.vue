<template>
	<div v-html="message"></div>
</template>

<script>
import Convert from 'ansi-to-html';
import moment from 'moment';
import sprintf from 'sprintf';

const convert = new Convert({
	fg: '#000',
	bg: '#fff'
});

export default {
	computed: {
		message() {
			let { args, ns, ts } = this.msg;
			ns = ns ? `[${ns}] ` : '';
			ts = ts ? `<span class="pull-right ts">${moment(new Date(ts)).format('h:mm:ss a')}</span>` : '';
			args = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, '    ') : arg);

			const msg = args.length > 1 ? sprintf.apply(null, args) : args[0];
			return msg
				.split(/\r?\n/)
				.map(line => convert.toHtml(`<pre>${ts}${ns}${line}</pre>`))
				.join('\n');
		}
	},
	props: [ 'msg' ]
};
</script>

<style>
.ts {
	color: #666;
}
</style>
