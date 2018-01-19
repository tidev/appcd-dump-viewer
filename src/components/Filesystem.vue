<template>
	<div>
		<table>
			<tbody>
				<tr>
					<th>Nodes</th>
					<td>{{ dump.status.fs.nodes }}</td>
				</tr>
				<tr>
					<th>FS Watchers</th>
					<td>{{ dump.status.fs.fswatchers }}</td>
				</tr>
				<tr>
					<th>Watchers</th>
					<td>{{ dump.status.fs.watchers }}</td>
				</tr>
			</tbody>
		</table>

		<table id="tree-grid" v-if="root">
			<thead>
				<tr>
					<th>Tree</th>
					<th>Files</th>
					<th>Watchers</th>
					<th>Links</th>
					<th>Recursion</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<ul class="tree">
							<TreeNode :node="root" />
						</ul>
					</td>
					<td class="totals">
						<div v-for="n in totals.files">{{ n === null ? '-' : n }}</div>
					</td>
					<td class="totals">
						<div v-for="n in totals.watchers">{{ n === null ? '-' : n  }}</div>
					</td>
					<td class="totals">
						<div v-for="n in totals.links">{{ n === null ? '-' : n  }}</div>
					</td>
					<td class="totals">
						<div v-for="n in totals.recursion">{{ n === null ? '-' : n  }}</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import TreeNode from './TreeNode';

const pattern = [
	'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
	'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
].join('|');
const stripRegExp = new RegExp(pattern, 'g');

export default {
	components: {
		TreeNode
	},
	created() {
		Object.assign(this, parseTree(this.dump.status.fs.tree));
	},
	props: [ 'dump' ]
};

function parseTree(str) {
	const totals = {
		files:     [],
		watchers:  [],
		links:     [],
		recursion: []
	};

	const treeRegExp = /\[([df?])\] (.*)$/;

	const parse = line => {
		const p = line.lastIndexOf('(');
		if (p === -1) {
			return null;
		}

		const counts = line.substring(p + 1, line.length - 1).split(',');
		line = line.substring(0, p - 1);
		const m = line.match(treeRegExp);
		if (!m) {
			return null;
		}

		const type = m[1];
		const name = m[2];
		if (type !== 'd') {
			counts.unshift(null);
		}

		const [ files, watchers, links, recursion ] = counts.map(part => {
			const m = part && part.trim().match(/^(\d+)/);
			return m ? m[1] : null;
		});
		totals.files.push(files);
		totals.watchers.push(watchers);
		totals.links.push(links);
		totals.recursion.push(recursion);

		return {
			name,
			type,
			files,
			watchers,
			links,
			recursion,
			children: {}
		};
	};

	const walk = (parent, lines) => {
		if (!lines.length) {
			return null;
		}

		let line, node, children, op;

		while (lines.length) {
			line = lines.shift();
			node = parse(line);
			children = [];
			op = line.substring(0, 2);

			parent.children[node.name] = node;

			if (op === ' ├') {
				// find end
				while (lines.length) {
					op = lines[0].substring(0, 2);
					if (op === ' ├' || op === ' └') {
						break;
					}
					children.push(lines.shift().substring(2));
				}
			} else if (op === ' └') {
				children = lines.map(s => s.substring(2));
				lines = [];
			}

			if (children.length) {
				walk(node, children);
			}
		}
	};

	const lines = str.replace(stripRegExp, '').split(/\r?\n/);
	const root = parse(lines.shift());
	walk(root, lines);

	return { root, totals };
}
</script>

<style>
#tree-grid {
	border-collapse: collapse;
}

#tree-grid > tbody > tr {
	background: repeating-linear-gradient(
		0,
		#dee6ea,
		#dee6ea 16px,
		transparent 16px,
		transparent 32px
	);
}

#tree-grid th,
#tree-grid td {
	padding: 0 10px;
}

#tree-grid th:first-child,
#tree-grid td:first-child {
	padding-left: 5px;
}

#tree-grid th:last-child,
#tree-grid td:last-child {
	padding-right: 5px;
}

ul.tree,
ul.tree ul {
	list-style: none;
	margin: 0;
	padding: 0;
}

ul.tree ul {
	margin-left: 2px;
}

ul.tree > li > ul {
	margin-left: 10px;
}

ul.tree li {
	border-left: 1px solid rgb(100, 100, 100);
	line-height: 16px;
	margin: 0;
	padding: 0 0 0 15px;
	position: relative;
}

ul.tree > li {
	padding: 0;
}

ul.tree li > span {
	margin-left: -6px;
}

ul.tree > li:first-child > span {
	margin: 0;
}

ul.tree > li:first-child:before {
	display: none;
}

ul.tree li:last-child {
	border-left: none;
}

ul.tree li:before {
	border-bottom: 1px solid rgb(100, 100, 100);
	color: white;
	content: "";
	display: block;
	height: 10px;
	left: 0;
	position: absolute;
	top: -1px;
	width: 7px;
}

ul.tree li:last-child:before {
	border-left: 1px solid rgb(100, 100, 100);
}

.totals > div {
	line-height: 16px;
	text-align: center;
}
</style>
