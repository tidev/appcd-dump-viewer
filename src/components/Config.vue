<template>
	<fieldset>
		<legend>Configuration</legend>

		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in conf">
					<td>{{ item.name }}</td>
					<td>{{ item.value }}</td>
				</tr>
			</tbody>
		</table>
	</fieldset>
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
