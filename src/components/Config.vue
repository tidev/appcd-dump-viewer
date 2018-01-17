<template>
	<table>
		<tbody>
			<tr v-for="item in conf">
				<th>{{ item.name }}</th>
				<td>{{ item.value }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
export default {
	computed: {
		conf() {
			const items = [];

			(function walk(scope, segments) {
				for (const key of Object.keys(scope).sort()) {
					segments.push(key);
					if (scope[key] && typeof scope[key] === 'object') {
						walk(scope[key], segments);
					} else {
						const path = segments.join('.');
						items.push({
							name: path,
							value: JSON.stringify(scope[key])
						});
					}
					segments.pop();
				}
			}(this.dump.config, []));

			return items;
		}
	},
	props: [ 'dump' ]
};
</script>
