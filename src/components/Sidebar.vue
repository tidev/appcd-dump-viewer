<template>
	<div>
		<table>
			<tbody>
				<tr>
					<th>Appc Daemon</th>
					<td>{{ dump.status.version || 'n/a' }}</td>
				</tr>
				<tr>
					<th>Platform</th>
					<td>{{ dump.status.system ? dump.status.system.platform : 'n/a' }}</td>
				</tr>
				<tr>
					<th>Architecture</th>
					<td>{{ dump.status.system ? dump.status.system.arch : 'n/a' }}</td>
				</tr>
				<tr>
					<th>CPUs</th>
					<td>{{ dump.status.system ? dump.status.system.cpus : 'n/a' }}</td>
				</tr>
				<tr>
					<th>Node.js</th>
					<td>{{ dump.status.node ? dump.status.node.version : 'n/a' }}</td>
				</tr>
				<tr>
					<th>Versions</th>
					<td v-if="dump.status.node">
						<table class="versions">
							<tbody>
								<tr v-for="(ver, type) in dump.status.node.versions">
									<th>{{ type }}</th>
									<td>{{ ver }}</td>
								</tr>
							</tbody>
						</table>
					</td>
					<td v-else>n/a</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
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
