<template>
	<div>
		<table>
			<tbody>
				<tr>
					<th>Search Paths</th>
					<td>
						<div v-for="pluginPath in pluginPaths">
							{{ pluginPath }}
						</div>
					</td>
				</tr>
			</tbody>
		</table>

		<table v-if="dump.status.plugins.registered.length">
			<thead>
				<tr>
					<th rowspan="2">Plugin</th>
					<th rowspan="2">Version</th>
					<th rowspan="2">Type</th>
					<th rowspan="2">Path</th>
					<th rowspan="2">Node.js</th>
					<th rowspan="2">Status</th>
					<th class="text-center" rowspan="2">Startup<br>Time</th>
					<th class="text-center" rowspan="2">Active<br>Requests</th>
					<th class="text-center" rowspan="2">Total<br>Requests</th>
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
				<tr v-for="plugin in dump.status.plugins.registered" :class="{ 'plugin-unsupported': !plugin.supported }">
					<td>{{ plugin.name }}</td>
					<td>{{ plugin.version }}</td>
					<td>{{ plugin.type }}</td>
					<td>{{ plugin.path }}</td>
					<td>{{ plugin.nodeVersion }}</td>
					<td :title="plugin.stack">{{ plugin | formatPluginStatus }}</td>
					<td class="text-center">{{ plugin.startupTime | prettyTime }}</td>
					<td class="text-center">{{ plugin.activeRequests }}</td>
					<td class="text-center">{{ plugin.totalRequests }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'cpu', 'min') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'cpu', 'avg') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'cpu', 'max') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'freemem', 'min') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'freemem', 'avg') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'freemem', 'max') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'rss', 'min') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'rss', 'avg') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'rss', 'max') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'heapTotal', 'min') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'heapTotal', 'avg') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'heapTotal', 'max') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'heapUsed', 'min') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'heapUsed', 'avg') }}</td>
					<td class="text-center">{{ getProcHealth(plugin.pid, 'heapUsed', 'max') }}</td>
				</tr>
			</tbody>
		</table>
		<div v-else>
			No plugins
		</div>
	</div>
</template>

<script>
import filesize from 'filesize';
import prettyMs from 'pretty-ms';

export default {
	computed: {
		pluginPaths() {
			return this.dump.status.plugins.paths.sort();
		}
	},
	created() {
		this.healthLookup = {};
		for (const proc of this.dump.health) {
			this.healthLookup[proc.pid] = proc;
		}
	},
	filters: {
		formatPluginStatus(plugin) {
			let status = '';
			if (plugin.error) {
				status = plugin.error;
			} else if (plugin.pid) {
				if (plugin.type === 'external') {
					status = `Active, PID=${plugin.pid || 'null'}`;
				} else {
					status = 'Active';
				}
			} else {
				status = 'Inactive';
				if (plugin.exitCode !== undefined && plugin.exitCode !== null) {
					status = `Inactive, exit code=${plugin.exitCode}`;
				}
			}
			return status;
		},

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
			return '-';
		}
	},
	props: [ 'dump' ]
};
</script>

<style>
.plugin-unsupported {
	color: #999;
}
</style>
