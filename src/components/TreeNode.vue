<template>
	<ul class="tree-node">
		<li>
			{{ node.name }}
			<TreeNode
				v-for="(child, index) in Object.values(node.children)"
				:node="child"
				:key="index"
				/>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'TreeNode',
	props: [ 'node' ]
};
</script>

<style>
.tree-node {
	margin-left: 18px;
}
</style>
