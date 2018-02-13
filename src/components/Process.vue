<template>
	<table id="process-info">
		<tbody>
			<tr>
				<th>PID</th>
				<td>{{ dump.status.pid || 'n/a' }}</td>
			</tr>
			<tr>
				<th>Startup Time</th>
				<td>{{ dump.status.startupTime ? (dump.status.startupTime * 1000) : 'n/a' | prettyTime }}</td>
			</tr>
			<tr>
				<th>Uptime</th>
				<td>{{ dump.status.uptime || 'n/a' | prettyTime }}</td>
			</tr>
			<tr>
				<th>execPath</th>
				<td>{{ dump.status.process && dump.status.process.execPath || 'n/a' }}</td>
			</tr>
			<tr>
				<th>execArgv</th>
				<td>{{ dump.status.process && dump.status.process.execArgv || 'n/a' }}</td>
			</tr>
			<tr>
				<th>argv</th>
				<td>{{ dump.status.process && dump.status.process.argv || 'n/a' }}</td>
			</tr>
			<tr>
				<th>env</th>
				<td v-if="dump.status.process">
					<table>
						<tbody>
							<tr v-for="(value, name) in dump.status.process.env">
								<th>{{ name }}</th>
								<td>{{ value }}</td>
							</tr>
						</tbody>
					</table>
				</td>
				<td v-else>n/a</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import filesize from 'filesize';
import prettyMs from 'pretty-ms';

export default {
	filters: {
		prettyTime(value) {
			value = parseFloat(value);
			return isNaN(value) ? 'n/a' : prettyMs(value);
		}
	},
	props: [ 'dump' ]
};
</script>

<style>
#process-info th {
	white-space: nowrap;
}
</style>
