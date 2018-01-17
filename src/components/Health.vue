<template>
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
