<template>
	<div>
		<table>
			<tbody>
				<tr>
					<th>Appc Daemon</th>
					<td>{{ dump.status.version }}</td>
				</tr>
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
				<tr>
					<th>Node.js</th>
					<td>{{ dump.status.node.version }}</td>
				</tr>
				<tr>
					<th>Versions</th>
					<td>
						<table class="versions">
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
	</div>
</template>

<script>
export default {
	created() {
	},
	props: [ 'dump' ]
};
</script>

<style>
#sidebar {
	padding: 10px;
}

.versions th,
.versions td {
	font-size: 11px;
}
</style>
