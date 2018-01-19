<template>
	<div id="output" v-html="output"></div>
</template>

<script>
import AnsiUp from 'ansi_up';
import sprintf from 'sprintf';

export default {
	created() {
		const ansiup = new AnsiUp();
		const output = [];

		for (const msg of this.dump.log) {
			let { args, message } = msg;

			if (Array.isArray(args)) {
				args = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, '    ') : arg);
				message = args.length > 1 ? sprintf.apply(null, args) : args[0];
			}

			for (const line of message.trim().split(/\r?\n/)) {
				output.push(ansiup.ansi_to_html(line));
			}
		}

		this.output = output.length ? output.join('<br>') : 'No log output';
	},
	data() {
		return {
			output: ''
		};
	},
	props: [ 'dump' ]
};
</script>

<style>
#output {
	background-color: #000;
	color: #fff;
	font-family: 'Source Code Pro', monospace;
	font-size: 11px;
	font-weight: bold;
	line-height: 14px;
	margin: 0;
	padding: 10px;
	white-space: pre-wrap
}
</style>
