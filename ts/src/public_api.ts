// This file imports all the necessary AbuseFilter modules and
// makes them available in the global scope so as to enable
// usage in the MediaWiki manner.

import { AbuseFilter } from './AbuseFilter.js';
import { EvaluationContext } from './evaluator/EvaluationContext.js';
import { AbuseFilterFunctions } from './evaluator/functions/AbuseFilterFunctions.js';
import { LocalFunctionExecutor } from './evaluator/functions/LocalFunctionExecutor.js';
import { MultiFunctionExecutor } from './evaluator/functions/MultiFunctionExecutor.js';
import { RemoteFunctionExecutor } from './evaluator/functions/RemoteFunctionExecutor.js';
import { NodeEvaluator } from './evaluator/NodeEvaluator.js';
import { EvaluableNodeFactory } from './evaluator/nodes/EvaluableNodeFactory.js';
import { EvaluableTreeNode } from './evaluator/nodes/EvaluableTreeNode.js';
import { IPAddress } from './evaluator/utils/IPAddress.js';
import { IPUtils } from './evaluator/utils/IPUtils.js';
import { RegexUtils } from './evaluator/utils/regex/RegexUtils.js';
import { Value } from './evaluator/value/Value.js';
import { ValueCalculator } from './evaluator/value/ValueCalculator.js';
import { ValueComparer } from './evaluator/value/ValueComparer.js';
import { ValueStringOperations } from './evaluator/value/ValueStringOperations.js';
import { VariableValue } from './evaluator/value/VariableValue.js';
import { AbuseFilterGUI } from './gui/AbuseFilterGUI.js';
import { ImpactingBoolFilter } from './gui/filters/ImpactingBoolFilter.js';
import { ArrayDefinitionNodeView } from './gui/treeViews/ArrayDefinitionNodeView.js';
import { AssignmentNodeView } from './gui/treeViews/AssignmentNodeView.js';
import { AtomNodeView } from './gui/treeViews/AtomNodeView.js';
import { BlockNodeView } from './gui/treeViews/BlockNodeView.js';
import { FunctionNodeView } from './gui/treeViews/FunctionNodeView.js';
import { IndexNodeView } from './gui/treeViews/IndexNodeView.js';
import { OperatorNodeView } from './gui/treeViews/OperatorNodeView.js';
import { ViewFactory } from './gui/treeViews/ViewFactory.js';
import { NodeValueView } from './gui/value/NodeValueView.js';
import { ProcessedDataView } from './gui/value/ProcessedDataView.js';
import { ValueFormatter } from './gui/value/ValueFormatter.js';
import { AbuseFilterApi } from './mediawiki/AbuseFilterApi.js';
import { TreeNode } from './parser/nodes/TreeNode.js';
import { TreeNodeFactory } from './parser/nodes/TreeNodeFactory.js';
import { Parser } from './parser/Parser.js';
import { ParserException } from './parser/ParserException.js';
import { Token } from './parser/Token.js';
import { Tokenizer } from './parser/Tokenizer.js';
import { FlattenAssociativeOpsTransformer } from './transform/FlattenAssociativeOpsTransformer.js';

const _abuseFilter = {
    createFromFilterId: AbuseFilter.createFromFilterId,
    createFromLogId: AbuseFilter.createFromLogId,
    AbuseFilter,

    api: AbuseFilterApi,

    parser: {
        Parser,
        ParserException,
        Token,
        Tokenizer,
        nodes: {
            TreeNode,
            TreeNodeFactory,
        },
    },

    transform: {
        FlattenAssociativeOpsTransformer,
    },

    evaluator: {
        EvaluationContext,
        NodeEvaluator,
        functions: {
            AbuseFilterFunctions,
            LocalFunctionExecutor,
            MultiFunctionExecutor,
            RemoteFunctionExecutor,
        },
        nodes: {
            EvaluableNodeFactory,
            EvaluableTreeNode,
        },
        utils: {
            IPAddress,
            IPUtils,
            RegexUtils, // TODO: Decouple it from this project
        },
        value: {
            Value,
            ValueCalculator,
            ValueComparer,
            ValueStringOperations,
            VariableValue,
        },
    },

    gui: {
        AbuseFilterGUI,
        filters: {
            ImpactingBoolFilter,
        },
        treeViews: {
            ArrayDefinitionNodeView,
            AssignmentNodeView,
            AtomNodeView,
            BlockNodeView,
            FunctionNodeView,
            IndexNodeView,
            OperatorNodeView,
            ViewFactory,
        },
        value: {
            NodeValueView,
            ProcessedDataView,
            ValueFormatter,
        },
    },
};

mw.libs.abuseFilter = _abuseFilter;
mw.hook('userjs.abuseFilter').fire(_abuseFilter);

// TODO: put this to the GUI package
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
.afa-filter-wrapper {
    text-align: right;
}
.afa-filter-wrapper label {
    margin-left: 0.6em;
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

// The following code is necessary to make the TypeScript compiler
// automatically output type declarations for `mw.libs.abusefilter`
// in a way that does not require maintaining a separate declarations
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace mw {
        //@ts-expect-error TypeScript doesn't allow to redeclare a const, so we force tsc to accept it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const libs: Record<string, any> & {
            abuseFilter: typeof _abuseFilter;
        };
    }
}
