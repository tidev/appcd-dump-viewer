<template>
	<div v-html="message"></div>
</template>

<script>
import AnsiUp from 'ansi_up';
import sprintf from 'sprintf';

const ansiup = new AnsiUp();

export default {
	computed: {
		message() {
			let { args, message } = this.msg;

			if (Array.isArray(args)) {
				args = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, '    ') : arg);
				message = args.length > 1 ? sprintf.apply(null, args) : args[0];
			}

			return message
				.trim()
				.split(/\r?\n/)
				.map(line => `${ansiup.ansi_to_html(line)}`)
				.join('\n');
		}
	},
	props: [ 'msg' ]
};
</script>
