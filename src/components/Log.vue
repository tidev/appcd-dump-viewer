<template>
	<fieldset>
		<legend>Log</legend>

		<LogMessage v-for="(msg, index) in dump.log" :msg="msg" :key="index" />
	</fieldset>
</template>

<script>
import LogMessage from './LogMessage';

export default {
	components: {
		LogMessage
	},
	props: [ 'dump' ]
};
</script>
