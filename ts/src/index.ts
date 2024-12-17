import { AbuseFilter } from './AbuseFilter.js';

async function displayOnLogPage(logId: string) {
    const fieldset = document.querySelector('#mw-content-text > fieldset');
    if (!fieldset) return;

    const referenceHeader = fieldset.querySelector('h3');
    if (!referenceHeader) return;

    const treeHeader = document.createElement('h3');
    treeHeader.textContent = 'Filter evaluation tree';
    fieldset.insertBefore(treeHeader, referenceHeader);

    const rootElement = document.createElement('div');
    rootElement.textContent = 'Loading...';
    fieldset.insertBefore(rootElement, referenceHeader);

    const filter = await AbuseFilter.createFromLogId(logId);
    filter.flattenAssociativeOperators();
    filter.renderInto(rootElement);
    filter.evaluate();
}

function main() {
    // Run only on the AbuseLog special page
    if (mw.config.get('wgCanonicalSpecialPageName') !== 'AbuseLog') return;

    const pageName = mw.config.get('wgPageName');
    const logMatch = pageName.match(/\/(\d+)$/);
    const logId = logMatch?.[1];

    if (logId) {
        displayOnLogPage(logId);
    }
}
main();

mw.util.addCSS(`
.afa-tree-container {
    --afa-color-value-keyword: blue;
    --afa-color-value-string: brown;
    --afa-color-value-number: darkgreen;
    --afa-color-value-identifier: teal;
    --afa-color-keyword: purple;
    --afa-color-function: #8f6300;
    --afa-color-true: green;
    --afa-color-false: red;
}

.afa-value, .afa-token { font-family: monospace; }
.afa-value-keyword { color: var(--afa-color-value-keyword); }
.afa-value-string { color: var(--afa-color-value-string); }
.afa-value-number { color: var(--afa-color-value-number); }
.afa-value-identifier { color: var(--afa-color-value-identifier); }
.afa-keyword { color: var(--afa-color-keyword); }
.afa-function { color: var(--afa-color-function); }
.afa-hint {
    display: inline-block;
    background: var(--background-color-neutral, #eaecf0);
    padding: 0 0.5em;
    border-radius: 0.5em;
    font-size: 0.85em;
    color: var(--color-base--subtle, #54595d);
}
.afa-data {
    margin-left: 0.7em;
    display: inline-block;
    border: 1px solid var(--border-color-base, #a2a9b1);
    padding: 0 0.5em;
    border-radius: 0.5em;
    background: var(--background-color-neutral, #eaecf0);
    font-size: 0.85em;
}

.afa-data .afa-value-bool::before {
    content: '';
    width: 0.75em;
    height: 0.75em;
    display: inline-block;
    border-radius: 50%;
    background: #999;
    margin-right: 0.3em;
}
.afa-data .afa-value-true::before { background: var(--afa-color-true); }
.afa-data .afa-value-false::before { background: var(--afa-color-false); }

.afa-data .afa-data-more {
    position: absolute;
    margin-top: -0.3em;
    left: 1em;
    right: 1em;
    background: var(--background-color-neutral, #eaecf0);
    border: 1px solid var(--border-color-base, #a2a9b1);
    padding: 0.5em;
    border-radius: 0.5em;
    display: none;
    box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.2);
}
.afa-data:hover .afa-data-more { display: block; }

.afa-data-error:not(.afa-data-error-speculative) { color: red; font-weight: bold; }

.afa-tree-container {
    border: 1px solid var(--border-color-subtle, #c8ccd1);
    padding: 0.5em;
    margin: 0.5em 0;
    border-radius: 0.25em;
    background: var(--background-color-neutral-subtle, #f8f9fa);
}

.afa-tree-container ul {
    list-style-type: none;
    padding-left: 0;
    margin-left: 2.5em;
}

.afa-tree-container ul:has(> li > details) > li:not(:has(> details)) {
    padding-left: 1em;
}

html.skin-theme-clientpref-night .afa-tree-container {
    --afa-color-value-keyword: #749afa;
    --afa-color-value-string: #e08870;
    --afa-color-value-number: #b6f2b6;
    --afa-color-value-identifier: #a8e7ff;
    --afa-color-keyword: #e173ff;
    --afa-color-function: #ffd77e;
    --afa-color-true: #0d0;
    --afa-color-false: #f33;
}

@media screen and (prefers-color-scheme: dark) {
    html.skin-theme-clientpref-os .afa-tree-container {
        --afa-color-value-keyword: #749afa;
        --afa-color-value-string: #e08870;
        --afa-color-value-number: #b6f2b6;
        --afa-color-value-identifier: #a8e7ff;
        --afa-color-keyword: #e173ff;
        --afa-color-function: #ffd77e;
        --afa-color-true: #0d0;
        --afa-color-false: #f33;
    }
}
`);
