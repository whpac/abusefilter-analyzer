/**
 * Mass Check gadget for AbuseFilter
 * It allows users to perform a bulk analysis of recent hits of a given filter.
 * It can be invoked from the Special:AbuseLog page, in a view where only hits
 * from a specific filter are shown. The user can then spefify the number of
 * log entries to check, and the gadget will display the filter syntax tree
 * along with the value distribution in each tree node.
 */
import { i18n } from '../../i18n/i18n.js';
import { IEvaluableTreeNode } from '../../model/nodes/IEvaluableTreeNode.js';
import { NodeValueFrequencyView } from './NodeValueFrequencyView.js';

mw.hook('userjs.abuseFilter').add((abuseFilter: typeof mw.libs.abuseFilter) => {
    // Run only on the AbuseLog special page
    if (mw.config.get('wgCanonicalSpecialPageName') !== 'AbuseLog') return;

    const urlParams = new URLSearchParams(window.location.search);
    const filterId = urlParams.get('wpSearchFilter');
    const isSingleFilterLog = filterId && (filterId.indexOf('|') === -1);
    
    if (isSingleFilterLog) {
        displayOnFilterLogPage(filterId);
    }
    
    function displayOnFilterLogPage(filterId: string) {
        const contentElement = document.getElementById('mw-content-text');
        if (!contentElement) return;
    
        const summaryElement = contentElement.querySelector('.mw-specialpage-summary');
        if (!summaryElement) return;
    
        const rootElement = document.createElement('div');
        contentElement.insertBefore(rootElement, summaryElement.nextSibling);
    
        const treeHeader = document.createElement('h3');
        treeHeader.textContent = i18n('afa-masscheck-header');
        contentElement.insertBefore(treeHeader, summaryElement.nextSibling);
    
        const par1 = document.createElement('p');
        par1.textContent = i18n('afa-masscheck-description');
        rootElement.appendChild(par1);

        const form = document.createElement('form');
        rootElement.appendChild(form);
        
        const par2 = document.createElement('p');
        par2.textContent = i18n('afa-masscheck-form-numberlabel') + ' ';
        form.appendChild(par2);

        const input = document.createElement('input');
        input.type = 'number';
        input.value = '50';
        input.min = '1';
        input.style.width = '4em';
        input.style.marginRight = '0.5em';
        par2.appendChild(input);
    
        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = i18n('afa-masscheck-form-submitlabel');
        par2.appendChild(button);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            const count = parseInt(input.value, 10);
            if (isNaN(count) || count < 1) {
                alert(i18n('afa-masscheck-form-negative'));
                return;
            }
            par1.remove();

            const errorContainer = document.createElement('details');
            errorContainer.style.display = 'none'; // Hide if no errors
            const errorSummary = document.createElement('summary');
            errorSummary.textContent = i18n('afa-masscheck-form-errorlog');
            errorContainer.appendChild(errorSummary);
            const errorList = document.createElement('ul');
            errorContainer.appendChild(errorList);
            rootElement.appendChild(errorContainer);
    
            const treeRootElement = document.createElement('div');
            rootElement.appendChild(treeRootElement);
            displayFrequencyAnalysis(
                treeRootElement,
                filterId,
                count,
                (processed, isFinished, logTimestamp) => {
                    if (!isFinished) {
                        par2.textContent = i18n('afa-masscheck-progress', processed, count);
                    } else {
                        if (processed == count) {
                            par2.textContent = i18n('afa-masscheck-progress-finishedall', processed);
                        } else {
                            par2.textContent = i18n('afa-masscheck-progress-finishedsome', processed);
                        }
                        if (logTimestamp) {
                            const logDate = new Date(logTimestamp);
                            par2.textContent += ' ';
                            par2.textContent += i18n('afa-masscheck-progress-date', logDate.toLocaleDateString());
                        }
                    }
                },
                (error) => {
                    const errorItem = document.createElement('li');
                    errorItem.textContent = error.message;
                    errorList.appendChild(errorItem);
                    
                    errorContainer.style.display = 'block';
                }
            );
        });
    }
    
    async function displayFrequencyAnalysis(
        rootElement: HTMLElement,
        filterId: string,
        count: number,
        progressCallback?: (processed: number, isFinished: boolean, logTimestamp?: string) => void,
        errorCallback?: (error: Error) => void
    ) {
        progressCallback?.(0, false);
        const nodeFactory = new abuseFilter.evaluator.nodes.EvaluableNodeFactory();
        const tokenizer = new abuseFilter.parser.Tokenizer();
        const parser = new abuseFilter.parser.Parser(nodeFactory);
    
        const filterText = await abuseFilter.api.fetchAbuseFilterText(filterId);
        const tokens = tokenizer.tokenize(filterText);
        let rootNode = parser.parse(tokens);
    
        const transformer = new abuseFilter.transform.FlattenAssociativeOpsTransformer();
        rootNode = transformer.transform(rootNode, nodeFactory);
    
        const gui = new abuseFilter.gui.AbuseFilterGUI(rootElement);
        const viewFactory = new abuseFilter.gui.treeViews.ViewFactory();
        viewFactory.addDataViewFactory(
            // check if node is IEvaluableTreeNode - only these have values
            (node) => 'getValue' in node
                ? new NodeValueFrequencyView(node as IEvaluableTreeNode)
                : null
        );
        gui.renderSyntaxTree(rootNode, viewFactory);
    
        const functionExecutor = new abuseFilter.evaluator.functions.LocalFunctionExecutor();
        const evaluator = new abuseFilter.evaluator.NodeEvaluator(functionExecutor);
    
        try {
            let processedCount = 0;
            let lastTimestamp: string | undefined;
            for await (const logEntry of abuseFilter.api.fetchAbuseLogEntries(filterId, count)) {
                try {
                    const evaluationContext = new abuseFilter.evaluator.EvaluationContext();
                    const variables = logEntry.details;
                    for (const [key, value] of Object.entries(variables)) {
                        evaluationContext.setVariable(key, abuseFilter.evaluator.value.Value.fromNative(value));
                    }

                    await evaluator.evaluateNode(rootNode, evaluationContext);
                } catch (error) {
                    errorCallback?.(error instanceof Error ? error
                        : new Error(i18n('afa-masscheck-evaluationerror', error)));
                }
                
                // Run also for failed items, so that the total number is reported correctly
                processedCount++;
                lastTimestamp = logEntry.timestamp;
                progressCallback?.(processedCount, false, lastTimestamp);
            }
            progressCallback?.(processedCount, true, lastTimestamp);
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : error;
            rootElement.textContent = i18n('afa-cantload', errorMessage);
        }
    }
});
