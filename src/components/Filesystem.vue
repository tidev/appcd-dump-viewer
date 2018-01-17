<template>
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
			<tr>
				<th>Tree</th>
				<td>
					<TreeNode :node="parseTree(this.dump.status.fs.tree)" />
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import TreeNode from './TreeNode';

const pattern = [
	'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
	'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
].join('|');
const stripRegExp = new RegExp(pattern, 'g');

const treeRegExp = /\[([df?])\] ([^ (\d]+) \(([^)]+)/;

export default {
	components: {
		TreeNode
	},
	methods: {
		parseTree(str) {
			const parse = line => {
				const m = line.match(treeRegExp);
				if (m) {
					const type = m[1];
					const name = m[2];
					const [ files, watchers, links, recursion ] = m[3].split(',').map(part => {
						const m = part.trim().match(/^(\d+)/);
						return m ? m[1] : null;
					});

					return {
						name,
						type,
						files,
						watchers,
						links,
						recursion,
						children: {}
					};
				}
			};

			const split = lines => {
				const children = [];
				let current = null;

				for (let i = 0; i < lines.length; i++) {
					if (lines[i].startsWith(' ├') || lines[i].startsWith(' └')) {
						current = [];
						children.push(current);
					}
					if (current) {
						current.push(lines[i].substring(2));
					}
				}

				return children;
			};

			const walk = (parent, children) => {
				const node = parse(children.shift());
				parent.children[node.name] = node;
				for (const c of split(children)) {
					walk(node, c);
				}
			};

			const lines = str.replace(stripRegExp, '').split(/\r?\n/);
			const tree = parse(lines.shift());

			if (tree) {
				for (const children of split(lines)) {
					walk(tree, children);
				}
			}

			return tree;
		}
	},
	props: [ 'dump' ]
};
</script>
