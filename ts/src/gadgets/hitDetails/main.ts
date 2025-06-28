/**
 * Hit Details gadget for AbuseFilter
 * It presents the filter evaluation tree for a given log entry.
 * It is automatically invoked on Special:AbuseLog page in a 'details' view for
 * a specific log entry. The gadget will display the syntax tree, along with the
 * values of all the nodes in it.
 */

import { i18n } from '../../i18n/i18n.js';
import { ViewFactoryWithAugmented } from './ViewFactoryWithAugmented.js';

mw.hook('userjs.abuseFilter').add((abuseFilter: typeof mw.libs.abuseFilter) => {
    // Run only on the AbuseLog special page
    if (mw.config.get('wgCanonicalSpecialPageName') !== 'AbuseLog') return;
    
    const pageName = mw.config.get('wgPageName');
    const logMatch = pageName.match(/\/(\d+)$/);
    const logId = logMatch?.[1];

    if (logId) {
        displayOnLogEntryPage(logId);
    }

    async function displayOnLogEntryPage(logId: string) {
        const fieldset = document.querySelector('#mw-content-text > fieldset');
        if (!fieldset) return;
    
        const referenceHeader = fieldset.querySelector('h3');
        if (!referenceHeader) return;
    
        const treeHeader = document.createElement('h3');
        treeHeader.textContent = i18n('afa-hitdetails-header');
        fieldset.insertBefore(treeHeader, referenceHeader);
    
        const rootElement = document.createElement('div');
        rootElement.textContent = i18n('afa-loading');
        fieldset.insertBefore(rootElement, referenceHeader);
    
        try {
            const filter = await abuseFilter.createFromLogId(logId);
            filter.flattenAssociativeOperators();
    
            const impactingBoolFilter = new abuseFilter.gui.filters.ImpactingBoolFilter(filter.defaultContext);
            const filters = [
                impactingBoolFilter,
            ];
            filter.renderInto(rootElement, {
                treeFilters: filters,
                viewFactory: new ViewFactoryWithAugmented(filter.defaultContext),
            });
            await filter.evaluate();
        } catch (error: unknown) {
            const errorMessage = (error instanceof Error) ? error.message : error;
            rootElement.textContent = i18n('afa-cantload', errorMessage);
        }
    }
});
