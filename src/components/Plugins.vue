<template>
	<div id="plugin-info">
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
					<th>Plugin</th>
					<th>Version</th>
					<th>Type</th>
					<th>Path</th>
					<th>Node.js</th>
					<th>Status</th>
					<th class="text-center">Startup<br>Time</th>
					<th class="text-center">Active<br>Requests</th>
					<th class="text-center">Total<br>Requests</th>
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
				</tr>
			</tbody>
		</table>
		<div v-else>
			No plugins
		</div>
	</div>
</template>

<script>
import prettyMs from 'pretty-ms';

export default {
	computed: {
		pluginPaths() {
			return this.dump.status.plugins.paths.sort();
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
	props: [ 'dump' ]
};
</script>

<style>
#plugin-info th,
#plugin-info td {
	white-space: nowrap;
}

.plugin-unsupported {
	color: #999;
}
</style>
