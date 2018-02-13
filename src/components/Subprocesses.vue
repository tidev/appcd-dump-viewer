<template>
	<div>
		<table v-if="dump.status.subprocesses && dump.status.subprocesses.length">
			<thead>
				<tr>
					<th>PID</th>
					<th>Command</th>
					<th>Uptime</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="proc in dump.status.subprocesses">
					<td>{{ proc.pid }}</td>
					<td>{{ proc | formatCommand }}</td>
					<td class="text-center">{{ proc.startTime | procUptime(dump.status.dumpTime) }}</td>
				</tr>
			</tbody>
		</table>
		<div v-else>
			No subprocesses
		</div>
	</div>
</template>

<script>
import prettyMs from 'pretty-ms';

export default {
	filters: {
		formatCommand(proc) {
			let args = '';
			if (proc.args.length) {
				args = ' ' + proc.args
					.map(a => {
						if (typeof a === 'string' && a.indexOf(' ') !== -1) {
							return `"${a}"`;
						}
						return a;
					})
					.join(' ');
			}
			return proc.command + args;
		},

		procUptime(startTime, dumpTime) {
			if (startTime && dumpTime) {
				return prettyMs(new Date(dumpTime) - new Date(startTime));
			}
			return 'n/a';
		}
	},
	props: [ 'dump' ]
};
</script>
