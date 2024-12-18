import './public_api.js';

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

    const filter = await mw.libs.abuseFilter.createFromLogId(logId);
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
