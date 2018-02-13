<template>
	<div class="terminal" v-html="output"></div>
</template>

<script>
import AnsiUp from 'ansi_up';
import sprintf from 'sprintf';

export default {
	computed: {
		output() {
			const ansiup = new AnsiUp();
			const output = [];

			for (const msg of this.dump.log) {
				let { args, message } = msg;
				let ts;

				if (Array.isArray(args)) {
					// this is the old appc daemon v1.0.x format
					args = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, '    ') : arg);
					ts = msg.ts && `<span style="color:#bb00bb">${new Date(msg.ts).toISOString()}</span> `;
					message = args.length > 1 ? sprintf.apply(null, args) : args[0];
				}

				for (const line of message.trim().split(/\r?\n/)) {
					output.push((ts || '') + ansiup.ansi_to_html(line));
				}
			}

			return output.length ? output.join('<br>') : 'No log output'
		}
	},
	props: [ 'dump' ]
};
</script>
