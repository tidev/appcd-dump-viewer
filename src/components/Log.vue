<template>
	<pre id="output"><LogMessage
		v-for="(msg, index) in dump.log"
		:msg="msg"
		:key="index"
		/></pre>
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

<style>
@font-face {
	font-family: 'Source Code Pro';
	font-style: normal;
	font-weight: 400;
	src: local('Source Code Pro'), local('SourceCodePro-Regular'), url(/static/css/sourcecodepro.woff2) format('woff2');
	unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}

#output {
	background-color: #000;
	color: #fff;
	font-family: 'Source Code Pro', monospace;
	font-size: 11px;
	font-weight: 800;
	line-height: 14px;
	margin: 0;
	padding: 10px;
}
</style>
