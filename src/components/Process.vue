<template>
	<table>
		<tbody>
			<tr>
				<th>PID</th>
				<td>{{ dump.status.pid }}</td>
			</tr>
			<tr>
				<th>Startup Time</th>
				<td>{{ dump.status.startupTime || 'n/a' }}</td>
			</tr>
			<tr>
				<th>Uptime</th>
				<td>{{ dump.status.uptime | prettyTime }}</td>
			</tr>
			<tr>
				<th>execPath</th>
				<td>{{ dump.status.process.execPath }}</td>
			</tr>
			<tr>
				<th>execArgv</th>
				<td>{{ dump.status.process.execArgv }}</td>
			</tr>
			<tr>
				<th>argv</th>
				<td>{{ dump.status.process.argv }}</td>
			</tr>
			<tr>
				<th>env</th>
				<td>
					<table>
						<tbody>
							<tr v-for="(value, name) in dump.status.process.env">
								<th>{{ name }}</th>
								<td>{{ value }}</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<tr>
				<th>Health</th>
				<td>
					<table>
						<thead>
							<tr>
								<th class="text-center" colspan="3">CPU</th>
								<th class="text-center" colspan="3">Free Mem</th>
								<th class="text-center" colspan="3">RSS</th>
								<th class="text-center" colspan="3">Heap Total</th>
								<th class="text-center" colspan="3">Heap Used</th>
							</tr>
							<tr>
								<th>Min</th>
								<th>Avg</th>
								<th>Max</th>
								<th>Min</th>
								<th>Avg</th>
								<th>Max</th>
								<th>Min</th>
								<th>Avg</th>
								<th>Max</th>
								<th>Min</th>
								<th>Avg</th>
								<th>Max</th>
								<th>Min</th>
								<th>Avg</th>
								<th>Max</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'cpu', 'min') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'cpu', 'avg') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'cpu', 'max') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'freemem', 'min') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'freemem', 'avg') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'freemem', 'max') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'rss', 'min') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'rss', 'avg') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'rss', 'max') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'heapTotal', 'min') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'heapTotal', 'avg') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'heapTotal', 'max') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'heapUsed', 'min') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'heapUsed', 'avg') }}</td>
								<td class="text-center">{{ getProcHealth(dump.status.pid, 'heapUsed', 'max') }}</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import filesize from 'filesize';
import prettyMs from 'pretty-ms';

export default {
	created() {
		this.healthLookup = {};
		for (const proc of this.dump.health) {
			this.healthLookup[proc.pid] = proc;
		}
	},
	filters: {
		prettyTime(value) {
			value = parseFloat(value);
			return isNaN(value) ? 'n/a' : prettyMs(value);
		}
	},
	methods: {
		getProcHealth(pid, type, metric) {
			if (pid && this.healthLookup[pid]) {
				const value = this.healthLookup[pid][type][metric].toFixed(1);
				return type === 'cpu' ? `${value}%` : filesize(value);
			}
			return 'n/a';
		}
	},
	props: [ 'dump' ]
};
</script>

<style>
</style>
