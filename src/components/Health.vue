<template>
	<div id="health-info">
		<table>
			<tbody>
				<tr>
					<th>Load Avg</th>
					<td>
						<table>
							<tbody>
								<tr>
									<th>1 min</th>
									<td>{{ dump.status.system.loadavg[0] }}</td>
								</tr>
								<tr>
									<th>5 min</th>
									<td>{{ dump.status.system.loadavg[1] }}</td>
								</tr>
								<tr>
									<th>15 min</th>
									<td>{{ dump.status.system.loadavg[2] }}</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr>
					<th>Memory Total</th>
					<td>{{ dump.status.system.memory.total | filesize }}</td>
				</tr>
				<tr>
					<th>Memory Free</th>
					<td>{{ dump.status.system.memory.free | filesize }}</td>
				</tr>
				<tr>
					<th>RSS</th>
					<td>{{ dump.status.memory.rss | filesize }}</td>
				</tr>
				<tr>
					<th>Heap Total</th>
					<td>{{ dump.status.memory.heapTotal | filesize }}</td>
				</tr>
				<tr>
					<th>Used Total</th>
					<td>{{ dump.status.memory.heapUsed | filesize }}</td>
				</tr>
			</tbody>
		</table>

		<table class="proc-health">
			<tbody v-for="proc in procData">
				<tr v-for="row in proc">
					<td v-for="col in row">{{ col }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import filesize from 'filesize';

export default {
	created() {
		const { status } = this.dump;

		const lookup = {};
		for (const proc of this.dump.health) {
			lookup[proc.pid] = proc;
		}

		const sections = {
			cpu:       'CPU',
			freemem:   'Free Mem',
			rss:       'RSS',
			heapTotal: 'Heap Total',
			heapUsed:  'Heap Used'
		};

		const metrics = {
			min: 'Min',
			avg: 'Avg',
			max: 'Max'
		};

		this.procData = [];

		const add = (name, pid) => {
			const proc = [];
			this.procData.push(proc);

			let row = [ name, '' ];
			for (const name of Object.values(sections)) {
				row.push(name);
			}
			proc.push(row);
			let first = true;

			for (const [ metric, label ] of Object.entries(metrics)) {
				row = [];
				if (first) {
					row.push(`pid: ${pid}`);
					first = false;
				} else {
					row.push('');
				}
				row.push(metric);
				for (const type of Object.keys(sections)) {
					if (lookup[pid][type]) {
						const value = lookup[pid][type][metric].toFixed(1);
						row.push(type === 'cpu' ? `${value}%` : filesize(value));
					} else {
						row.push('n/a');
					}
				}
				proc.push(row);
			}
		};

		add(`Daemon Core`, status.pid);

		for (const plugin of status.plugins.registered) {
			if (plugin.pid) {
				add(`${plugin.name}@${plugin.version}`, plugin.pid);
			}
		}
	},
	filters: {
		filesize
	},
	methods: {
		getMetric(proc, type, metric) {
			if (proc[type]) {
				const value = proc[type][metric].toFixed(1);
				return type === 'cpu' ? `${value}%` : filesize(value);
			}
			return 'n/a';
		}
	},
	props: [ 'dump' ]
};
</script>

<style>
#health-info th,
#health-info td {
	white-space: nowrap;
}

.proc-health {
	margin-top: 10px;
}

.proc-health > tbody > tr > td {
	text-align: right;
}

.proc-health > tbody > tr:first-child > td {
	font-weight: bold;
	padding-top: 10px;
	text-align: center;
}

.proc-health > tbody > tr > td:first-child {
	text-align: left;
}
</style>
