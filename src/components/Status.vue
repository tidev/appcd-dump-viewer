<template>
	<div>
		<fieldset>
			<legend>Version</legend>
			<table>
				<tbody>
					<tr>
						<th>Appc Daemon</th>
						<td>{{ dump.status.version }}</td>
					</tr>
					<tr>
						<th>Node.js</th>
						<td>{{ dump.status.node.version }}</td>
					</tr>
					<tr>
						<th>Versions</th>
						<td>
							<table>
								<tbody>
									<tr v-for="(ver, type) in dump.status.node.versions">
										<th>{{ type }}</th>
										<td>{{ ver }}</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</fieldset>

		<fieldset>
			<legend>System</legend>
			<table>
				<tbody>
					<tr>
						<th>Platform</th>
						<td>{{ dump.status.system.platform }}</td>
					</tr>
					<tr>
						<th>Architecture</th>
						<td>{{ dump.status.system.arch }}</td>
					</tr>
					<tr>
						<th>CPUs</th>
						<td>{{ dump.status.system.cpus }}</td>
					</tr>
				</tbody>
			</table>
		</fieldset>

		<fieldset>
			<legend>Process</legend>
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
		</fieldset>

		<fieldset>
			<legend>Filesystem</legend>
			<table>
				<tbody>
					<tr>
						<th>Nodes</th>
						<td>{{ dump.status.fs.nodes }}</td>
					</tr>
					<tr>
						<th>FS Watchers</th>
						<td>{{ dump.status.fs.fswatchers }}</td>
					</tr>
					<tr>
						<th>Watchers</th>
						<td>{{ dump.status.fs.watchers }}</td>
					</tr>
					<tr>
						<th>Tree</th>
						<td v-html="fswatcherTree"></td>
					</tr>
				</tbody>
			</table>
		</fieldset>

		<fieldset>
			<legend>Subprocesses</legend>
			<table v-if="dump.status.subprocesses.length">
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
		</fieldset>

		<fieldset>
			<legend>Plugins</legend>

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
		</fieldset>
	</div>
</template>

<script>
import Convert from 'ansi-to-html';
import filesize from 'filesize';
import prettyMs from 'pretty-ms';

const convert = new Convert({
	fg: '#000',
	bg: '#fff'
});

export default {
	computed: {
		fswatcherTree() {
			return `<pre>${convert.toHtml(this.dump.status.fs.tree)}</pre>`;
		},
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
		},

		procUptime(startTime, dumpTime) {
			if (startTime && dumpTime) {
				return prettyMs(new Date(dumpTime) - new Date(startTime));
			}
			return 'n/a';
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
.plugin-unsupported {
	color: #999;
}
</style>
