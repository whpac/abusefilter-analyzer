import { EvaluationContext } from './evaluator/EvaluationContext.js';
import { LocalFunctionExecutor } from './evaluator/functions/LocalFunctionExecutor.js';
import { MultiFunctionExecutor } from './evaluator/functions/MultiFunctionExecutor.js';
import { RemoteFunctionExecutor } from './evaluator/functions/RemoteFunctionExecutor.js';
import { NodeEvaluator } from './evaluator/NodeEvaluator.js';
import { EvaluableNodeFactory } from './evaluator/nodes/EvaluableNodeFactory.js';
import { Value } from './evaluator/value/Value.js';
import { AbuseFilterGUI } from './gui/AbuseFilterGUI.js';
import { ViewFactory } from './gui/treeViews/ViewFactory.js';
import { NodeValueFrequencyView } from './gui/value/NodeValueFrequencyView.js';
import { AbuseFilterApi } from './mediawiki/AbuseFilterApi.js';
import { IEvaluableTreeNode } from './model/nodes/IEvaluableTreeNode.js';
import { Parser } from './parser/Parser.js';
import { Tokenizer } from './parser/Tokenizer.js';
import { FlattenAssociativeOpsTransformer } from './transform/FlattenAssociativeOpsTransformer.js';

function displayOnFilterLogPage(filterId: string) {
    const contentElement = document.getElementById('mw-content-text');
    if (!contentElement) return;

    const summaryElement = contentElement.querySelector('.mw-specialpage-summary');
    if (!summaryElement) return;

    const rootElement = document.createElement('div');
    contentElement.insertBefore(rootElement, summaryElement.nextSibling);

    const treeHeader = document.createElement('h3');
    treeHeader.textContent = 'Check filter on recent log entries';
    contentElement.insertBefore(treeHeader, summaryElement.nextSibling);

    const par1 = document.createElement('p');
    par1.textContent = 'You can use this tool to evaluate the filter on a specified number of recent log entries. ' +
        'This may be useful to see what conditions are triggered and how many times.';
    rootElement.appendChild(par1);

    const par2 = document.createElement('p');
    par2.textContent = 'Number of log entries to check: ';
    const input = document.createElement('input');
    input.type = 'number';
    input.value = '50';
    input.min = '1';
    input.style.width = '4em';
    input.style.marginRight = '0.5em';
    par2.appendChild(input);

    const button = document.createElement('button');
    button.textContent = 'Start';
    button.addEventListener('click', () => {
        const count = parseInt(input.value, 10);
        if (isNaN(count) || count < 1) {
            alert('Please enter a valid positive number.');
            return;
        }
        button.disabled = true;
        button.textContent = 'Loading...';
        displayFrequencyAnalysis(rootElement, filterId, count);
    });
    par2.appendChild(button);
    rootElement.appendChild(par2);
}

async function displayFrequencyAnalysis(rootElement: HTMLElement, filterId: string, count: number) {
    const nodeFactory = new EvaluableNodeFactory();
    const tokenizer = new Tokenizer();
    const parser = new Parser(nodeFactory);

    const filterText = await AbuseFilterApi.fetchAbuseFilterText(filterId);
    const tokens = tokenizer.tokenize(filterText);
    let rootNode = parser.parse(tokens);

    const transformer = new FlattenAssociativeOpsTransformer();
    rootNode = transformer.transform(rootNode, nodeFactory);

    const gui = new AbuseFilterGUI(rootElement);
    const viewFactory = new ViewFactory();
    viewFactory.addDataViewFactory(
        // check if node is IEvaluableTreeNode - only these have values
        (node) => 'getValue' in node
            ? new NodeValueFrequencyView(node as IEvaluableTreeNode)
            : null
    );
    gui.renderSyntaxTree(rootNode, viewFactory);

    const functionExecutor = new MultiFunctionExecutor([
        new LocalFunctionExecutor(),
        new RemoteFunctionExecutor()
    ]);
    const evaluator = new NodeEvaluator(functionExecutor);

    try {
        for await (const logEntry of AbuseFilterApi.fetchAbuseLogEntries(filterId, count)) {
            try {
                const evaluationContext = new EvaluationContext();
                const variables = logEntry.details;
                for (const [key, value] of Object.entries(variables)) {
                    evaluationContext.setVariable(key, Value.fromNative(value));
                }
        
                await evaluator.evaluateNode(rootNode, evaluationContext);
            } catch (error) {
                // TODO: Display somehow
                console.error('Error evaluating log entry:', error);
            }
        }
    } catch (error) {
        console.error(`Can't load the abuse filter: ${error}`);
    }
}

export function main2() {
    // Run only on the AbuseLog special page
    if (mw.config.get('wgCanonicalSpecialPageName') !== 'AbuseLog') return;

    const urlParams = new URLSearchParams(window.location.search);
    const filterId = urlParams.get('wpSearchFilter');
    
    if (filterId) {
        displayOnFilterLogPage(filterId);
    }
}
