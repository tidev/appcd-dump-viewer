const fileUrl = require('file-url');
const fs = require('fs');
const opn = require('opn');
const path = require('path');

module.exports = function launch(dumpFile, cleanupTimer) {
	const tmpdir = path.join(__dirname, 'tmp');
	const outFile = path.join(tmpdir, `dump-file.js`);

	const cleanup = () => {
		if (fs.existsSync(outFile)) {
			fs.unlinkSync(outFile);
		}
	};

	return Promise.resolve()
		.then(() => {
			if (!dumpFile) {
				return;
			}

			if (typeof dumpFile !== 'string') {
				throw new TypeError('Expected dump file to be a string');
			}

			if (!fs.existsSync(dumpFile)) {
				throw new Error('Dump file does not exist');
			}

			return new Promise(resolve => {
				if (!fs.existsSync(tmpdir)) {
					fs.mkdirSync(tmpdir);
				}

				const out = fs.createWriteStream(outFile, { autoClose: false, flags: 'w' });

				out.write(`;loadDump(${JSON.stringify(dumpFile)}, `);

				fs.createReadStream(dumpFile)
					.on('end', () => {
						out.end(');');
						resolve();
					})
					.pipe(out);
			});
		})
		.then(() => opn(fileUrl('./dist/index.html'), { wait: false }))
		.then(() => cleanupTimer && setTimeout(cleanup, cleanupTimer))
		.catch(err => {
			cleanup();
			throw err;
		});
};
