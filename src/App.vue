<template>
	<div id="app">
		<header>
			<span id="dump-file" v-if="dumpFile">{{ dumpFile }}</span>
			<h1>Appc Daemon Dump Viewer</h1>
		</header>
		<div v-if="dump">
			<Status :dump="dump" />
			<Config :dump="dump" />
			<Health :dump="dump" />
			<Log :dump="dump" />
		</div>
		<div class="message" v-else>
			<span v-if="loading">
				Loading...
			</span>
			<span v-else>
				Please drop your dump file here
			</span>
		</div>
	</div>
</template>

<script>
import Config from './components/Config';
import Health from './components/Health';
import Log from './components/Log';
import Status from './components/Status';

export default {
	beforeCreate() {
		document.addEventListener('dragover', evt => evt.preventDefault());

		document.addEventListener('drop', evt => {
			evt.preventDefault();
			const dt = evt.dataTransfer;

			if (dt.files && dt.files.length) {
				this.dumpFile = dt.files[0].name;
				this.loading = true;
				const reader = new FileReader();
				reader.onload = e => this.load(e.target.result);
				reader.readAsText(dt.files[0]);
			} else {
				const url = dt.getData("text");
				if (url) {
					this.loading = true;
					fetch(url)
						.then(response => {
							if (response.ok) {
								return response.text();
							}
							throw new Error(`Response not ok (${response.status})`);
						})
						.then(text => {
							this.dumpFile = url;
							return this.load(text);
						})
						.catch(ex => {
							this.loading = false;
							this.dump = null;
							this.dumpFile = null;
							console.error(ex);
						});
				}
			}
		});
	},
	components: {
		Config,
		Health,
		Log,
		Status
	},
	created() {
    	const url = new URL(window.location);
		if (url.protocol === 'file:') {
			window.loadDump = (dumpFile, dump) => {
				this.dumpFile = dumpFile;
				this.dump = dump;
			};

			const script = document.createElement('script');
			script.onload = () => this.loading = true;
			script.type = 'text/javascript';
			script.src = '../tmp/dump-file.js';

			document.getElementsByTagName('head')[0].appendChild(script);
		}
	},
	data() {
		return {
			dump: null,
			dumpFile: null,
			loading: !!this.dumpFile
		};
	},
	methods: {
		load(str) {
			const p = str.indexOf('{');
			this.dump = JSON.parse(p === -1 ? str : str.substring(p));
		}
	}
};
</script>

<style>
#app {
	height: 100%;
}

#app > header {
	border-bottom: 1px solid #cbcbcb;
	box-shadow: 0 8px 24px rgba(0,0,0,0.1);
	height: 49px;
	margin-bottom: 20px;
}

#app > header > h1 {
	color: #505c66;
	font-size: 18px;
	font-weight: 300;
	line-height: 49px;
	padding: 0 25px;
	text-transform: uppercase;
}

#dump-file {
	float: right;
	line-height: 49px;
	padding: 0 25px;
}

.message {
	align-items: center;
	display: flex;
	height: calc(100% - 70px);
	justify-content: center;
}
</style>
