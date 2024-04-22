import { AbuseFilter } from './AbuseFilter.js';

async function main() {
    const body = document.getElementById('bodyContent') ?? document.body;
    const rootElement = document.createElement('div');
    body.appendChild(rootElement);

    const filter = await AbuseFilter.createFromFilterId(3);
    filter.flattenAssociativeOperators();
    filter.renderInto(rootElement);
    filter.evaluate();
}
main();

mw.util.addCSS(`
.afa-value, .afa-token { font-family: monospace; }
.afa-value-keyword { color: blue; }
.afa-value-string { color: brown; }
.afa-value-number { color: darkgreen; }
.afa-value-identifier { color: teal; }
.afa-keyword { color: purple; }
.afa-function { color: #8f6300; }
.afa-hint { display: inline-block; background: #eee; padding: 0 0.5em; border-radius: 0.5em; margin-right: 0.5em; font-size:0.85em; color:#666; }
.afa-data { margin-left: 0.7em; display: inline-block; border: 1px solid #aaa; padding: 0 0.5em; border-radius: 0.5em; background: #f4f4f4; font-size: 0.85em; }

.afa-data .afa-value-bool::before {
    content: '';
    width: 0.75em;
    height: 0.75em;
    display: inline-block;
    border-radius: 50%;
    background: #999;
    margin-right: 0.3em;
}
.afa-data .afa-value-true::before { background: green; }
.afa-data .afa-value-false::before { background: red; }

.afa-tree-container {
    border: 1px solid #ccc;
    padding: 0.5em;
    margin: 0.5em 0;
    border-radius: 0.25em;
    background: #fcfcfc;
}
`);
