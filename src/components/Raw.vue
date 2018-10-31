<template>
	<div class="terminal">{{ JSON.stringify(this.dump, null, '  ') }}</div>
</template>

<script>
export default {
	props: [ 'dump' ]
};
</script>
