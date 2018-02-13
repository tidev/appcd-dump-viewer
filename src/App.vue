<template>
	<v-app>
		<header>
			<span id="dump-file" v-if="dumpFile">{{ dumpFile }}</span>
			<h1>Appc Daemon Dump Viewer</h1>
		</header>
		<v-content id="container" v-if="dump">
			<Sidebar id="sidebar" :dump="dump" />
			<v-tabs id="tab-container" v-model="active" dark>
				<v-tab :href="'#process'" ripple>
					Process
				</v-tab>
				<v-tab :href="'#config'" ripple>
					Config
				</v-tab>
				<v-tab :href="'#health'" ripple>
					Health
				</v-tab>
				<v-tab :href="'#filesystem'" ripple>
					Filesystem
				</v-tab>
				<v-tab :href="'#subprocesses'" ripple>
					Subprocesses
				</v-tab>
				<v-tab :href="'#plugins'" ripple>
					Plugins
				</v-tab>
				<v-tab :href="'#log'" ripple>
					Log
				</v-tab>
				<v-tab :href="'#raw'" ripple>
					Raw
				</v-tab>
				<v-tab-item class="pa-2" :id="'process'">
					<div class="tab-item-container">
						<Process :dump="dump" />
					</div>
				</v-tab-item>
				<v-tab-item class="pa-2" :id="'config'">
					<div class="tab-item-container">
						<Config :dump="dump" />
					</div>
				</v-tab-item>
				<v-tab-item class="pa-2" :id="'health'">
					<div class="tab-item-container">
						<Health :dump="dump" />
					</div>
				</v-tab-item>
				<v-tab-item class="pa-2" :id="'filesystem'">
					<div class="tab-item-container">
						<Filesystem :dump="dump" />
					</div>
				</v-tab-item>
				<v-tab-item class="pa-2" :id="'subprocesses'">
					<div class="tab-item-container">
						<Subprocesses :dump="dump" />
					</div>
				</v-tab-item>
				<v-tab-item class="pa-2" :id="'plugins'">
					<div class="tab-item-container">
						<Plugins :dump="dump" />
					</div>
				</v-tab-item>
				<v-tab-item :id="'log'">
					<div class="tab-item-container">
						<Log :dump="dump" />
					</div>
				</v-tab-item>
				<v-tab-item :id="'raw'">
					<div class="tab-item-container">
						<Raw :dump="dump" />
					</div>
				</v-tab-item>
			</v-tabs>
		</v-content>
		<v-container id="dropzone" v-else fluid fill-height>
			<span v-if="loading">
				Loading...
			</span>
			<span v-else>
				Please drop your dump file here
			</span>
		</v-container>
	</v-app>
</template>

<script>
import Config from './components/Config';
import Filesystem from './components/Filesystem';
import Health from './components/Health';
import Log from './components/Log';
import Plugins from './components/Plugins';
import Process from './components/Process';
import Raw from './components/Raw';
import Sidebar from './components/Sidebar';
import Subprocesses from './components/Subprocesses';

export default {
	beforeCreate() {
		document.addEventListener('dragover', evt => evt.preventDefault());

		document.addEventListener('drop', evt => {
			evt.preventDefault();
			const dt = evt.dataTransfer;

			if (dt.files && dt.files.length) {
				const { name } = dt.files[0];
				this.loading = true;
				const reader = new FileReader();
				reader.onload = e => this.load(name, e.target.result);
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
						.then(text => this.load(url, text))
						.catch(ex => {
							this.loading = false;
							// this.dump = null;
							// this.dumpFile = null;
							console.error(ex);
						});
				}
			}
		});
	},
	components: {
		Config,
		Filesystem,
		Health,
		Log,
		Plugins,
		Process,
		Raw,
		Sidebar,
		Subprocesses
	},
	created() {
    	const url = new URL(window.location);
		if (url.protocol === 'file:' || url.hostname === 'localhost') {
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
			active:   'process',
			dump:     null,
			dumpFile: null,
			loading:  !!this.dumpFile
		};
	},
	methods: {
		load(dumpFile, str) {
			const p = str.indexOf('{');
			this.dump = JSON.parse(p === -1 ? str : str.substring(p));
			this.dumpFile = dumpFile;
		}
	}
};
</script>

<style>
#app {
	display: flex;
	height: 100vh;
	width: 100vw;
}

.application {
	flex-grow: 1;
}

.application-wrap {
	flex: 0 0 auto;
}

#app header {
	border-bottom: 1px solid #cbcbcb;
	height: 49px;
}

#app header > h1 {
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

#sidebar {
	background: radial-gradient(farthest-side at 50% 0, rgba(96,96,96,1) 0, rgba(68,68,68,1) 100%);
	box-shadow: inset 0 8px 24px rgba(0,0,0,0.1);
	color: #fff;
	flex-shrink: 0;
	overflow-y: auto;
	text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
	width: 300px;
}

#container {
	flex: 1 1 auto;
	min-height: 0;
}

#container > .content--wrap {
	display: flex;
}

#tab-container {
	background: linear-gradient(90deg, rgba(0,0,0,0.3) 0, rgba(0,0,0,0) 5px) repeat-y;
	display: flex;
	flex-direction: column;
	width: 100%;
}

.tab-item-container {
	display: flex;
	min-height: 100%;
}

#dropzone {
	box-shadow: inset 0 8px 24px rgba(0,0,0,0.1);
	justify-content: center;
}

.tabs__items {
	display: flex;
	flex: 1 1 auto;
}

.tabs__content {
	overflow: auto !important;
}
</style>
