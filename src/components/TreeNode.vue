<template>
	<li>
		<span><i :class="iconClass"></i> {{ node.name }}</span>
		<ul v-if="Object.keys(node.children).length">
			<TreeNode
				v-for="(child, index) in Object.values(node.children)"
				:node="child"
				:key="index"
				/>
		</ul>
	</li>
</template>

<script>
export default {
	computed: {
		iconClass() {
			const { type } = this.node;
			return `icon-${type === 'd' ? 'directory' : type === 'f' ? 'file' : 'unknown'}`;
		}
	},
	name: 'TreeNode',
	props: [ 'node' ]
};
</script>
