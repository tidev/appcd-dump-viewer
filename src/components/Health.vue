<template>
	<fieldset>
		<legend>Health</legend>

		<table>
			<tbody>
				<tr>
					<th>Load Avg</th>
					<td>{{ dump.status.system.loadavg.join(', ') }}</td>
				</tr>
				<tr>
					<th>Memory</th>
					<td>
						<table>
							<tbody>
								<tr>
									<th>Total</th>
									<td>{{ dump.status.system.memory.total | filesize }}</td>
								</tr>
								<tr>
									<th>Free</th>
									<td>{{ dump.status.system.memory.free | filesize }}</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr>
					<th>RSS</th>
					<td>{{ dump.status.memory.rss | filesize }}</td>
				</tr>
				<tr>
					<th>Heap</th>
					<td>
						<table>
							<tbody>
								<tr>
									<th>Total</th>
									<td>{{ dump.status.memory.heapTotal | filesize }}</td>
								</tr>
								<tr>
									<th>Used</th>
									<td>{{ dump.status.memory.heapUsed | filesize }}</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
	</fieldset>
</template>

<script>
import filesize from 'filesize';

export default {
	filters: {
		filesize
	},
	props: [ 'dump' ]
};
</script>
