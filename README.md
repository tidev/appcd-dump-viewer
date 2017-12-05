# Appc Daemon Dump Viewer

The [Appc Daemon](https://github.com/appcelerator/appc-daemon) has a `dump` command that generates
a JSON object containing the daemon's config, status, health, and log messages. This file can be
cumbersome to grok, so this tool will allow the data to be rendered in a format that is easier to
read.

## Usage

Open the `dist/index.html` file in a web browser, then drag and drop the file or a link into the
browser. A web server is not required.

## Node.js API

### launch()

### launch(dumpFile)

### launch(dumpFile, cleanupTimer)

Opens the dump viewer in the default browser.

 * `dumpFile` - (String) Optional path to the JSON dump file to load. The dump file is converted to
   a temporary JavaScript file and loaded via JSONP. If the temporary file already exists, it will
   be overwritten by the new file.

 * `cleanupTimer` - (Number) Optional number of milliseconds to wait before deleting the temporary
   JavaScript file. By default the temporary JavaScript file is not deleted.

Returns a `Promise` which resolves once the browser has launched.

#### Example

```js
import launch from 'appcd-dump-viewer';

launch('/path/to/dump.json');
```
