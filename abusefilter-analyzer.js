/*!
 * 
 * This is a script for analyzing AbuseFilter syntax tree.
 * The file is generated from the source code at https://gitlab.wikimedia.org/msz2001/abusefilter-analyzer
 *
 * @author [[w:pl:User:Msz2001]]
 * @license GPLv2 <https://gitlab.wikimedia.org/msz2001/abusefilter-analyzer/-/blob/master/LICENSE>
 *
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AbuseFilter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _evaluator_EvaluationContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _evaluator_functions_AbuseFilterFunctions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(17);
/* harmony import */ var _evaluator_functions_CCNormProvider_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(42);
/* harmony import */ var _evaluator_functions_LocalFunctionExecutor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(16);
/* harmony import */ var _evaluator_NodeEvaluator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);
/* harmony import */ var _evaluator_nodes_EvaluableNodeFactory_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(20);
/* harmony import */ var _evaluator_nodes_EvaluableTreeNode_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(21);
/* harmony import */ var _evaluator_utils_IPAddress_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(19);
/* harmony import */ var _evaluator_utils_IPUtils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(18);
/* harmony import */ var _evaluator_utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(13);
/* harmony import */ var _evaluator_value_Value_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(5);
/* harmony import */ var _evaluator_value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(11);
/* harmony import */ var _evaluator_value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(15);
/* harmony import */ var _evaluator_value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(12);
/* harmony import */ var _evaluator_value_VariableValue_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(4);
/* harmony import */ var _gui_AbuseFilterGUI_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(22);
/* harmony import */ var _gui_filters_ImpactingBoolFilter_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(43);
/* harmony import */ var _gui_treeViews_ArrayDefinitionNodeView_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(25);
/* harmony import */ var _gui_treeViews_AssignmentNodeView_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(28);
/* harmony import */ var _gui_treeViews_AtomNodeView_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(29);
/* harmony import */ var _gui_treeViews_BlockNodeView_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(26);
/* harmony import */ var _gui_treeViews_FunctionNodeView_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(31);
/* harmony import */ var _gui_treeViews_IndexNodeView_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(32);
/* harmony import */ var _gui_treeViews_OperatorNodeView_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(33);
/* harmony import */ var _gui_treeViews_ViewFactory_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(23);
/* harmony import */ var _gui_value_NodeValueView_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(34);
/* harmony import */ var _gui_value_NodeValueViewBase_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(35);
/* harmony import */ var _gui_value_ProcessedDataView_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(24);
/* harmony import */ var _gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(30);
/* harmony import */ var _mediawiki_AbuseFilterApi_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(36);
/* harmony import */ var _parser_nodes_TreeNode_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(44);
/* harmony import */ var _parser_nodes_TreeNodeFactory_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(45);
/* harmony import */ var _parser_Parser_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(37);
/* harmony import */ var _parser_ParserException_js__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(38);
/* harmony import */ var _parser_Token_js__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(39);
/* harmony import */ var _parser_Tokenizer_js__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(40);
/* harmony import */ var _transform_FlattenAssociativeOpsTransformer_js__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(41);
// This file imports all the necessary AbuseFilter modules and
// makes them available in the global scope so as to enable
// usage in the MediaWiki manner.






































const _abuseFilter = {
    createFromFilterId: _AbuseFilter_js__WEBPACK_IMPORTED_MODULE_0__.AbuseFilter.createFromFilterId,
    createFromLogId: _AbuseFilter_js__WEBPACK_IMPORTED_MODULE_0__.AbuseFilter.createFromLogId,
    AbuseFilter: _AbuseFilter_js__WEBPACK_IMPORTED_MODULE_0__.AbuseFilter,
    api: _mediawiki_AbuseFilterApi_js__WEBPACK_IMPORTED_MODULE_30__.AbuseFilterApi,
    parser: {
        Parser: _parser_Parser_js__WEBPACK_IMPORTED_MODULE_33__.Parser,
        ParserException: _parser_ParserException_js__WEBPACK_IMPORTED_MODULE_34__.ParserException,
        Token: _parser_Token_js__WEBPACK_IMPORTED_MODULE_35__.Token,
        Tokenizer: _parser_Tokenizer_js__WEBPACK_IMPORTED_MODULE_36__.Tokenizer,
        nodes: {
            TreeNode: _parser_nodes_TreeNode_js__WEBPACK_IMPORTED_MODULE_31__.TreeNode,
            TreeNodeFactory: _parser_nodes_TreeNodeFactory_js__WEBPACK_IMPORTED_MODULE_32__.TreeNodeFactory,
        },
    },
    transform: {
        FlattenAssociativeOpsTransformer: _transform_FlattenAssociativeOpsTransformer_js__WEBPACK_IMPORTED_MODULE_37__.FlattenAssociativeOpsTransformer,
    },
    evaluator: {
        EvaluationContext: _evaluator_EvaluationContext_js__WEBPACK_IMPORTED_MODULE_1__.EvaluationContext,
        NodeEvaluator: _evaluator_NodeEvaluator_js__WEBPACK_IMPORTED_MODULE_5__.NodeEvaluator,
        functions: {
            AbuseFilterFunctions: _evaluator_functions_AbuseFilterFunctions_js__WEBPACK_IMPORTED_MODULE_2__.AbuseFilterFunctions,
            CCNormProvider: _evaluator_functions_CCNormProvider_js__WEBPACK_IMPORTED_MODULE_3__.CCNormProvider,
            LocalFunctionExecutor: _evaluator_functions_LocalFunctionExecutor_js__WEBPACK_IMPORTED_MODULE_4__.LocalFunctionExecutor,
        },
        nodes: {
            EvaluableNodeFactory: _evaluator_nodes_EvaluableNodeFactory_js__WEBPACK_IMPORTED_MODULE_6__.EvaluableNodeFactory,
            EvaluableTreeNode: _evaluator_nodes_EvaluableTreeNode_js__WEBPACK_IMPORTED_MODULE_7__.EvaluableTreeNode,
        },
        utils: {
            IPAddress: _evaluator_utils_IPAddress_js__WEBPACK_IMPORTED_MODULE_8__.IPAddress,
            IPUtils: _evaluator_utils_IPUtils_js__WEBPACK_IMPORTED_MODULE_9__.IPUtils,
            RegexUtils: _evaluator_utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_10__.RegexUtils, // TODO: Decouple it from this project
        },
        value: {
            Value: _evaluator_value_Value_js__WEBPACK_IMPORTED_MODULE_11__.Value,
            ValueCalculator: _evaluator_value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_12__.ValueCalculator,
            ValueComparer: _evaluator_value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_13__.ValueComparer,
            ValueStringOperations: _evaluator_value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_14__.ValueStringOperations,
            VariableValue: _evaluator_value_VariableValue_js__WEBPACK_IMPORTED_MODULE_15__.VariableValue,
        },
    },
    gui: {
        AbuseFilterGUI: _gui_AbuseFilterGUI_js__WEBPACK_IMPORTED_MODULE_16__.AbuseFilterGUI,
        filters: {
            ImpactingBoolFilter: _gui_filters_ImpactingBoolFilter_js__WEBPACK_IMPORTED_MODULE_17__.ImpactingBoolFilter,
        },
        treeViews: {
            ArrayDefinitionNodeView: _gui_treeViews_ArrayDefinitionNodeView_js__WEBPACK_IMPORTED_MODULE_18__.ArrayDefinitionNodeView,
            AssignmentNodeView: _gui_treeViews_AssignmentNodeView_js__WEBPACK_IMPORTED_MODULE_19__.AssignmentNodeView,
            AtomNodeView: _gui_treeViews_AtomNodeView_js__WEBPACK_IMPORTED_MODULE_20__.AtomNodeView,
            BlockNodeView: _gui_treeViews_BlockNodeView_js__WEBPACK_IMPORTED_MODULE_21__.BlockNodeView,
            FunctionNodeView: _gui_treeViews_FunctionNodeView_js__WEBPACK_IMPORTED_MODULE_22__.FunctionNodeView,
            IndexNodeView: _gui_treeViews_IndexNodeView_js__WEBPACK_IMPORTED_MODULE_23__.IndexNodeView,
            OperatorNodeView: _gui_treeViews_OperatorNodeView_js__WEBPACK_IMPORTED_MODULE_24__.OperatorNodeView,
            ViewFactory: _gui_treeViews_ViewFactory_js__WEBPACK_IMPORTED_MODULE_25__.ViewFactory,
        },
        value: {
            NodeValueViewBase: _gui_value_NodeValueViewBase_js__WEBPACK_IMPORTED_MODULE_27__.NodeValueViewBase,
            NodeValueView: _gui_value_NodeValueView_js__WEBPACK_IMPORTED_MODULE_26__.NodeValueView,
            ProcessedDataView: _gui_value_ProcessedDataView_js__WEBPACK_IMPORTED_MODULE_28__.ProcessedDataView,
            ValueFormatter: _gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_29__.ValueFormatter,
        },
    },
};
class WorkaroundCCNormProvider extends _evaluator_functions_CCNormProvider_js__WEBPACK_IMPORTED_MODULE_3__.CCNormProvider {
    async loadConversionTable(url) {
        mw.loader.load(url);
        return new Promise((resolve, reject) => {
            const handler = (table) => {
                if (typeof table !== 'object' || !table) {
                    reject(new Error(`Invalid conversion table format in ${url}`));
                }
                else {
                    resolve(new Map(Object.entries(table)));
                }
                mw.hook('userjs.abuseFilter.equivset').remove(handler);
            };
            mw.hook('userjs.abuseFilter.equivset').add(handler);
        });
    }
}
_evaluator_functions_AbuseFilterFunctions_js__WEBPACK_IMPORTED_MODULE_2__.AbuseFilterFunctions.ccnormProvider = new WorkaroundCCNormProvider('https://gitlab-content.toolforge.org/msz2001/abusefilter-analyzer/-/raw/deploy/equivset.js?mime=text/javascript&maxage=3600');
mw.libs.abuseFilter = _abuseFilter;
mw.hook('userjs.abuseFilter').fire(_abuseFilter);
// TODO: put this to the GUI package
mw.util.addCSS(`
.afa-tree-container, .afa-value {
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
    margin-bottom: 0.5em;
}
.afa-filter-wrapper::after {
    clear: both;
    content: '';
    display: block;
}
.afa-filter-wrapper label {
    margin-left: 0.6em;
}
.afa-silent-button {
    background: none;
    font: inherit;
    appearance: none;
    border: none;
    padding: 0;
    color: inherit;
    cursor: pointer;
    outline: inherit;
    text-align: left;
    margin: 0;
}
.afa-silent-button[disabled] {
    cursor: default;
}

.afa-value, .afa-token { font-family: monospace; word-break: break-all; white-space-collapse: preserve; }
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
.afa-data:empty {
    display: none;
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
    z-index: 1;
    max-height: 60vh;
    overflow: auto;
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

.afa-value-inlay-button {
    background: var(--background-color-neutral, #eaecf0);
    font-size: 0.85em;
    font-family: sans-serif;
    font-weight: bold;
    appearance: none;
    border: none;
    border-radius: 0.2em;
    padding: 0 0.5em;
    color: var(--color-base--subtle, #54595d);
    cursor: pointer;
    outline: inherit;
    margin: 0;
    margin-left: 0.2em;
}

summary {
    width: fit-content;
}

html.skin-theme-clientpref-night .afa-tree-container,
html.skin-theme-clientpref-night .afa-value {
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
    html.skin-theme-clientpref-os .afa-tree-container,
    html.skin-theme-clientpref-night .afa-value {
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


/***/ }),
/* 2 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbuseFilter: () => (/* binding */ AbuseFilter)
/* harmony export */ });
/* harmony import */ var _evaluator_EvaluationContext_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _evaluator_NodeEvaluator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _evaluator_functions_LocalFunctionExecutor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16);
/* harmony import */ var _evaluator_nodes_EvaluableNodeFactory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20);
/* harmony import */ var _evaluator_value_Value_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var _gui_AbuseFilterGUI_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(22);
/* harmony import */ var _gui_treeViews_ViewFactory_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(23);
/* harmony import */ var _gui_value_NodeValueView_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(34);
/* harmony import */ var _mediawiki_AbuseFilterApi_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(36);
/* harmony import */ var _parser_Parser_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(37);
/* harmony import */ var _parser_Tokenizer_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(40);
/* harmony import */ var _transform_FlattenAssociativeOpsTransformer_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(41);












class AbuseFilter {
    constructor(filterText) {
        this.nodeFactory = new _evaluator_nodes_EvaluableNodeFactory_js__WEBPACK_IMPORTED_MODULE_3__.EvaluableNodeFactory();
        const tokenizer = new _parser_Tokenizer_js__WEBPACK_IMPORTED_MODULE_10__.Tokenizer();
        const parser = new _parser_Parser_js__WEBPACK_IMPORTED_MODULE_9__.Parser(this.nodeFactory);
        this.tokens = tokenizer.tokenize(filterText);
        this.rootNode = parser.parse(this.tokens);
        this.defaultContext = new _evaluator_EvaluationContext_js__WEBPACK_IMPORTED_MODULE_0__.EvaluationContext();
        this.functionExecutor = new _evaluator_functions_LocalFunctionExecutor_js__WEBPACK_IMPORTED_MODULE_2__.LocalFunctionExecutor();
    }
    async evaluate() {
        const evaluator = new _evaluator_NodeEvaluator_js__WEBPACK_IMPORTED_MODULE_1__.NodeEvaluator(this.functionExecutor);
        const context = this.defaultContext;
        return await evaluator.evaluateNode(this.rootNode, context);
    }
    getRootNode() {
        return this.rootNode;
    }
    transformWith(transformer) {
        this.rootNode = transformer.transform(this.rootNode, this.nodeFactory);
    }
    walkTree(callback) {
        this.walkTreeInner(this.rootNode, 0, callback, this.defaultContext);
    }
    walkTreeInner(node, currentDepth, callback, context) {
        const value = node.getValue(context);
        callback(node, value, currentDepth);
        for (const child of node.children) {
            this.walkTreeInner(child, currentDepth + 1, callback, context);
        }
    }
    flattenAssociativeOperators() {
        const transformer = new _transform_FlattenAssociativeOpsTransformer_js__WEBPACK_IMPORTED_MODULE_11__.FlattenAssociativeOpsTransformer();
        this.transformWith(transformer);
    }
    renderInto(container, options = {}) {
        options.treeFilters = options.treeFilters || [];
        options.viewFactory = options.viewFactory || new _gui_treeViews_ViewFactory_js__WEBPACK_IMPORTED_MODULE_6__.ViewFactory();
        const gui = new _gui_AbuseFilterGUI_js__WEBPACK_IMPORTED_MODULE_5__.AbuseFilterGUI(container, options.treeFilters);
        const viewFactory = options.viewFactory;
        viewFactory.addDataViewFactory(
        // check if node is IEvaluableTreeNode
        (node) => 'getValue' in node
            ? new _gui_value_NodeValueView_js__WEBPACK_IMPORTED_MODULE_7__.NodeValueView(node, this.defaultContext)
            : null);
        gui.renderSyntaxTree(this.rootNode, viewFactory);
    }
    setVariable(name, value) {
        this.defaultContext.setVariable(name, _evaluator_value_Value_js__WEBPACK_IMPORTED_MODULE_4__.Value.fromNative(value));
    }
    loadVariablesFromLogEntry(logEntry) {
        const variables = logEntry.details;
        for (const [key, value] of Object.entries(variables)) {
            this.setVariable(key, value);
        }
    }
    static async createFromFilterId(filterId) {
        const filterText = await _mediawiki_AbuseFilterApi_js__WEBPACK_IMPORTED_MODULE_8__.AbuseFilterApi.fetchAbuseFilterText(filterId);
        return new AbuseFilter(filterText);
    }
    static async createFromLogId(logId) {
        const logEntry = await _mediawiki_AbuseFilterApi_js__WEBPACK_IMPORTED_MODULE_8__.AbuseFilterApi.fetchAbuseLogEntry(logId);
        const filter = await AbuseFilter.createFromFilterId(logEntry.filter_id);
        filter.loadVariablesFromLogEntry(logEntry);
        return filter;
    }
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EvaluationContext: () => (/* binding */ EvaluationContext)
/* harmony export */ });
/* harmony import */ var _value_VariableValue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

class EvaluationContext {
    /**
     * Creates a new evaluation context.
     * @param parentContext The parent context, if any. If not provided, this context will be the root context.
     */
    constructor(parentContext = null) {
        /** The parent context, used for looking up variable values, will not be changed by this context. */
        this.parentContext = null;
        /** Here our variables will be stored. */
        this.variables = new Map();
        if (parentContext !== null) {
            this.parentContext = parentContext;
            this.rootContext = parentContext.rootContext;
        }
        else {
            this.rootContext = this;
        }
        // We might want to have non-speculative children contexts in future
        // but for now only the root context is non-speculative
        this.isSpeculative = (parentContext !== null);
    }
    getVariable(variableName) {
        // Variable names are case-insensitive in AbuseFilter
        variableName = variableName.toLowerCase();
        // First, look in our collection and if found return the value
        const localValue = this.variables.get(variableName);
        if (localValue != undefined)
            return _value_VariableValue_js__WEBPACK_IMPORTED_MODULE_0__.VariableValue.fromValue(localValue, variableName);
        // If we don't have the variable, perhaps our parent has it
        if (this.parentContext !== null) {
            return this.parentContext.getVariable(variableName);
        }
        return _value_VariableValue_js__WEBPACK_IMPORTED_MODULE_0__.VariableValue.makeUninitialized(variableName);
    }
    setVariable(variableName, newValue) {
        // Variable names are case-insensitive in AbuseFilter
        variableName = variableName.toLowerCase();
        this.variables.set(variableName, newValue);
    }
    createChildContext() {
        const childContext = new EvaluationContext(this);
        return childContext;
    }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VariableValue: () => (/* binding */ VariableValue)
/* harmony export */ });
/* harmony import */ var _Value_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);


/**
 * Represents a variable value, that can be used as a l-value in assignments.
 */
class VariableValue extends _Value_js__WEBPACK_IMPORTED_MODULE_0__.Value {
    constructor(variableName, dataType, value) {
        super(dataType, value);
        this.name = variableName;
    }
    /**
     * Creates a new variable from a Value object.
     * @param value The variable value
     * @param variableName The variable name
     */
    static fromValue(value, variableName) {
        return new VariableValue(variableName, value.dataType, value.value);
    }
    /**
     * Creates a new uninitialized variable.
     * @param variableName The variable name
     */
    static makeUninitialized(variableName) {
        return new VariableValue(variableName, _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Null, null);
    }
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Value: () => (/* binding */ Value)
/* harmony export */ });
/* harmony import */ var _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _ValueConverter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);



/**
 * A class representing a value in the evaluation tree.
 *
 * It has a value-type semantics and therefore is immutable.
 */
class Value {
    get isUndefined() {
        return this.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Undefined;
    }
    constructor(dataType, value) {
        this.dataType = dataType;
        this.value = value;
        if (!this.isValid()) {
            throw new Error(`Invalid value for data type ${dataType}: ${value}`);
        }
    }
    /** Creates a new Value from a token literal */
    static fromTokenLiteral(token) {
        switch (token.type) {
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.StringLiteral:
                return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, token.value);
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.IntLiteral:
                return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, parseInt(token.value));
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.FloatLiteral:
                return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Float, parseFloat(token.value));
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Keyword:
                if (token.value === 'true' || token.value === 'false') {
                    return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Boolean, token.value === 'true');
                }
                if (token.value === 'null') {
                    return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Null, null);
                }
                throw new Error(`Cannot create a value from keyword ${token.value}`);
            default:
                throw new Error(`Cannot create a value from token of type ${token.type}`);
        }
    }
    /** Creates a new Value from a native JavaScript value */
    static fromNative(value) {
        if (value === null) {
            return Value.Null;
        }
        if (value === undefined) {
            return Value.Undefined;
        }
        if (typeof value === 'boolean') {
            return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Boolean, value);
        }
        if (typeof value === 'number') {
            if (Number.isInteger(value)) {
                return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, value);
            }
            return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Float, value);
        }
        if (typeof value === 'string') {
            return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, value);
        }
        if (Array.isArray(value)) {
            return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array, value.map(v => Value.fromNative(v)));
        }
        if (typeof value === 'object') {
            return Value.fromNativeSparseArray(value);
        }
        throw new Error(`Cannot create a value from native value ${value}`);
    }
    static fromNativeSparseArray(value) {
        const keys = Object.keys(value);
        if (keys.length === 0) {
            return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array, []);
        }
        // First, check if all keys are natural numbers
        const isSparseArray = keys.every(key => {
            const numKey = Number(key);
            return !isNaN(numKey) && Number.isInteger(numKey) && numKey >= 0;
        });
        if (!isSparseArray) {
            throw new Error(`Cannot create a sparse array from object with non-numeric keys: ${JSON.stringify(value)}`);
        }
        // Then convert it to an array of Values
        const array = [];
        for (const key of keys) {
            const index = parseInt(key, 10);
            if (isNaN(index) || index < 0) {
                throw new Error(`Invalid index in sparse array: ${key}`);
            }
            // Ensure the array is large enough
            while (array.length <= index) {
                array.push(Value.Null);
            }
            array[index] = Value.fromNative(value[key]);
        }
        return new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array, array);
    }
    /** Returns true if the stored value corresponds to the declared data type */
    isValid() {
        switch (this.dataType) {
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Boolean:
                return typeof this.value === 'boolean';
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer:
                return typeof this.value === 'number' && Number.isInteger(this.value);
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Float:
                return typeof this.value === 'number';
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String:
                return typeof this.value === 'string';
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array:
                if (!Array.isArray(this.value))
                    return false;
                for (const item of this.value) {
                    if (!(item instanceof Value) || !item.isValid())
                        return false;
                }
                return true;
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Null:
                return this.value === null;
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Undefined:
                return this.value === null;
        }
        // Just in case, should never happen
        return false;
    }
    // ! Casting methods
    isTruthy() {
        return this.asBoolean().value;
    }
    toString() {
        return this.toLiteral();
    }
    asBoolean() {
        return _ValueConverter_js__WEBPACK_IMPORTED_MODULE_2__.ValueConverter.toBoolean(this);
    }
    asInt() {
        return _ValueConverter_js__WEBPACK_IMPORTED_MODULE_2__.ValueConverter.toInt(this);
    }
    asFloat() {
        return _ValueConverter_js__WEBPACK_IMPORTED_MODULE_2__.ValueConverter.toFloat(this);
    }
    asString() {
        return _ValueConverter_js__WEBPACK_IMPORTED_MODULE_2__.ValueConverter.toString(this);
    }
    asArray() {
        return _ValueConverter_js__WEBPACK_IMPORTED_MODULE_2__.ValueConverter.toArray(this);
    }
    // ! Array operators
    getElementAt(index) {
        var _a;
        if (this.dataType !== _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array) {
            throw new Error('Cannot index a non-array value');
        }
        const numIndex = index.asInt().value;
        const array = this.value;
        if (numIndex < 0 || numIndex >= array.length) {
            throw new Error('Index out of bounds');
        }
        return (_a = array[numIndex]) !== null && _a !== void 0 ? _a : Value.Undefined;
    }
    setElementAt(index, value) {
        if (this.dataType !== _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array) {
            throw new Error('Cannot index a non-array value');
        }
        const numIndex = index.asInt().value;
        const array = this.value;
        if (numIndex < 0 || numIndex >= array.length) {
            throw new Error('Index out of bounds');
        }
        array[numIndex] = value;
    }
    appendElement(value) {
        if (this.dataType !== _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array) {
            throw new Error('Cannot append to a non-array value');
        }
        this.value.push(value);
    }
    toLiteral() {
        switch (this.dataType) {
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Boolean:
                return this.value ? 'true' : 'false';
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer:
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Float:
                return this.asString().value;
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String: {
                let val = this.value;
                val = val.replace(/\\/g, '\\\\');
                val = val.replace(/"/g, '\\"');
                val = val.replace(/\n/g, '\\n');
                val = val.replace(/\r/g, '\\r');
                val = val.replace(/\t/g, '\\t');
                // TODO: Are there any other? eg. \0, \x00
                return '"' + val + '"';
            }
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array:
                return '[' + this.value.map(v => v.toLiteral()).join(', ') + ']';
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Null:
                return 'null';
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Undefined:
                return 'undefined';
        }
    }
}
/** For convenience, an undefined value */
Value.Undefined = new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Undefined, null);
/** For convenience, a null value */
Value.Null = new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Null, null);
/** For convenience, a true value */
Value.True = new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Boolean, true);
/** For convenience, a false value */
Value.False = new Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Boolean, false);


/***/ }),
/* 6 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TokenType: () => (/* binding */ TokenType)
/* harmony export */ });
/**
 * represents distinct types of tokens that can appear in the filter text.
 * Token types are categories used subsequently by the parser to properly
 * create the output syntax tree.
 */
var TokenType;
(function (TokenType) {
    /** A special type of token designating an end of the input stream. */
    TokenType["EndOfStream"] = "EndOfStream";
    /** A variable or function name. */
    TokenType["Identifier"] = "Identifier";
    /** A reserved word like `in` or `rlike`. */
    TokenType["Keyword"] = "Keyword";
    /** String literal enclosed in quotes or apostrophes. */
    TokenType["StringLiteral"] = "StringLiteral";
    /** Whole number literal; decimal, hexadecimal, octal or binary. */
    TokenType["IntLiteral"] = "IntLiteral";
    /** Literal for a number with fractional part. */
    TokenType["FloatLiteral"] = "FloatLiteral";
    /** One of the operators like `+` or `>=`. */
    TokenType["Operator"] = "Operator";
    /** Left or right parenthesis: `(` or `)`. */
    TokenType["Parenthesis"] = "Parenthesis";
    /** Left or right bracket: `[` or `]`. */
    TokenType["SquareBracket"] = "SquareBracket";
    /** A comma `,`. */
    TokenType["Comma"] = "Comma";
    /** A semicolon `;`. */
    TokenType["StatementSeparator"] = "StatementSeparator";
})(TokenType || (TokenType = {}));


/***/ }),
/* 7 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValueDataType: () => (/* binding */ ValueDataType)
/* harmony export */ });
/**
 * An enum that represents valid types for values to be held in variables.
 */
var ValueDataType;
(function (ValueDataType) {
    ValueDataType["Boolean"] = "boolean";
    ValueDataType["Integer"] = "integer";
    ValueDataType["Float"] = "float";
    ValueDataType["String"] = "string";
    ValueDataType["Array"] = "array";
    ValueDataType["Null"] = "null";
    /** Does not correspond to any AbuseFilter data types, it's used for nodes unevaluated yet */
    ValueDataType["Undefined"] = "undefined";
})(ValueDataType || (ValueDataType = {}));


/***/ }),
/* 8 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValueConverter: () => (/* binding */ ValueConverter)
/* harmony export */ });
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);


/**
 * Provides methods for type converions. These methods resemble PHP's type juggling
 * and behavior of the upstream AbuseFilter extension.
 */
class ValueConverter {
    static toBoolean(value) {
        if (value.isUndefined)
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean, this.toBooleanInner(value));
    }
    static toInt(value) {
        if (value.isUndefined)
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Integer, Math.floor(this.toFloatInner(value)));
    }
    static toFloat(value) {
        if (value.isUndefined)
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float, this.toFloatInner(value));
    }
    static toString(value) {
        if (value.isUndefined)
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.String, this.toStringInner(value));
    }
    static toArray(value) {
        if (value.isUndefined)
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array, this.toArrayInner(value));
    }
    /**
     * Checks if a defined value is truthy
     * @see https://www.php.net/manual/en/language.types.boolean.php#language.types.boolean.casting
     * @param value The value to check, cannot be undefined
     */
    static toBooleanInner(value) {
        if (value.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean) {
            return value.value;
        }
        if (value.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Integer || value.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float) {
            return (value.value !== 0);
        }
        if (value.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.String) {
            return (value.value !== '0' && value.value !== '');
        }
        if (value.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array) {
            return value.value.length !== 0;
        }
        if (value.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Null) {
            return false;
        }
        return true;
    }
    /**
     * Converts a defined value to a number (suitable for integer or float)
     * @param value The value to convert, cannot be undefined
     */
    static toFloatInner(value) {
        switch (value.dataType) {
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Integer:
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float:
                return value.value;
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean:
                return value.value ? 1 : 0;
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Null:
                return 0;
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array:
                return value.value.length;
            default:
                return parseFloat(this.toStringInner(value));
        }
    }
    /**
     * Converts a defined value to a string
     * @param value The value to convert, cannot be undefined
     */
    static toStringInner(value) {
        switch (value.dataType) {
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array:
                return value.value.map(v => v.asString().value).join('\n') + '\n';
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean:
                return value.value ? '1' : ''; // Like PHP's strval()...
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Null:
                return '';
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float: {
                // We have a special case for floats. In JS (1 - 0.1) is stringified as '0.09999999999999998',
                // but we want to return '0.1' like PHP does.
                // Given that JS numbers have 15.95 meaningful digits, 15 seems to be a good compromise.
                // https://stackoverflow.com/a/69152581/8127198
                const preciseFloat = value.value.toPrecision(15);
                return preciseFloat.replace(/\.?0+(e-?\d+)?$/i, '$1'); // Remove trailing zeros
            }
        }
        return '' + value.value;
    }
    /**
     * Converts a defined value to an array
     * @param value The value to convert, cannot be undefined
     */
    static toArrayInner(value) {
        if (value.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array) {
            return value.value;
        }
        return [value];
    }
}


/***/ }),
/* 9 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NodeEvaluator: () => (/* binding */ NodeEvaluator)
/* harmony export */ });
/* harmony import */ var _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _value_Value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _value_VariableValue_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony import */ var _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);
/* harmony import */ var _value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(12);
/* harmony import */ var _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(15);
/* harmony import */ var _functions_LocalFunctionExecutor_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(16);









/**
 * Class responsible for evaluating nodes of the syntax tree.
 */
class NodeEvaluator {
    constructor(functionExecutor) {
        this.functionExecutor = functionExecutor !== null && functionExecutor !== void 0 ? functionExecutor : new _functions_LocalFunctionExecutor_js__WEBPACK_IMPORTED_MODULE_8__.LocalFunctionExecutor();
    }
    /**
     * Evaluates the node and all its children if needed.
     * @param treeNode The tree node to be evaluated
     * @param evaluationContext The context of evaluation, containing all the variables and functions
     */
    async evaluateNode(treeNode, evaluationContext) {
        let value;
        try {
            // Atoms store value literals and variable reads
            if (treeNode.type === _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Atom) {
                const identity = treeNode.identity;
                if (identity.type === _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_4__.TokenType.Identifier) {
                    // Get variable value
                    value = evaluationContext.getVariable(identity.value);
                }
                else {
                    // Else, convert the literal into a value
                    value = _value_Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.fromTokenLiteral(identity);
                }
            }
            else {
                // Evaluate this node
                value = await this.evaluateNodeLazily(treeNode, evaluationContext);
            }
            // Set the value only on success, so handlers don't have to check order of events
            treeNode.setValue(evaluationContext, value);
        }
        catch (e) {
            // Unevaluated nodes have value of undefined so return it from the function as well
            value = _value_Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
            const error = (e instanceof Error) ? e : new Error('' + e);
            treeNode.setError(evaluationContext, error);
        }
        return value;
    }
    /**
     * For logical AND and OR operators evaluates only as many operands as needed
     * (others will be evaluated in a speculative mode). For other operators,
     * it's equivalent to `evaluateNodeGreedily`.
     *
     * The resulting promise is resolved as soon as the result is known, however the
     * execution of remaining nodes in continued in a speculative mode.
     *
     * @param treeNode The tree node to be evaluated
     * @param context The evaluation context
     */
    async evaluateNodeLazily(treeNode, context) {
        if (treeNode.identity.value == '&') {
            return this.evaluateLogicalOperatorLazily(treeNode.children, context, true);
        }
        else if (treeNode.identity.value == '|') {
            return this.evaluateLogicalOperatorLazily(treeNode.children, context, false);
        }
        return this.evaluateNodeGreedily(treeNode, context);
    }
    /**
     * Evaluates all the subnodes first and then calculates the node value. This is not for AtomNodes.
     * @param treeNode The tree node to be evaluated
     * @param context The evaluation context
     */
    async evaluateNodeGreedily(treeNode, context) {
        if (treeNode.type == _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Atom) {
            throw new Error('Cannot evaluate an atom node greedily. Use EvaluatedTreeNode.evaluate instead.');
        }
        // The only node that can't be evaluated using a standard greedy execution is a conditional node
        const nodeType = treeNode.type;
        const tokenValue = treeNode.identity.value;
        if (nodeType == _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Operator && ['?', 'if'].includes(tokenValue)) {
            return this.evaluateConditionalOperatorLazily(treeNode.children, context);
        }
        // This is a greedy evaluation so we can calculate all the children first
        // and then the parent value. The order of evaluation is important (eg. because of variables)
        // but all nodes will use the same context, as there's no speculative execution here.
        const values = [];
        for (const child of treeNode.children) {
            const value = await this.evaluateNode(child, context);
            values.push(value);
        }
        switch (nodeType) {
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Operator:
                return this.calculateOperatorNodeResult(tokenValue, values);
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Assignment:
                return this.calculateAssignmentResult(context, values);
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.IndexAssignment:
                return this.calculateIndexAssignmentResult(values);
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.ArrayIndexing:
                return this.calculateArrayIndexingResult(values);
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.FunctionCall:
                return await this.calculateFunctionCallResult(context, tokenValue, values);
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.ArrayDefinition:
                return this.calculateArrayDefinitionResult(values);
        }
        // If we got here, the node type is not supported
        throw new Error(`Unsupported node type: ${nodeType}`);
    }
    /**
     * Evaluates a tree node corresponding to a logical AND or OR operator.
     * The evaluation is done lazily, so that only as many operands are evaluated as needed.
     * However, the rest of them is still evaluated in a speculative mode.
     *
     * @param operands The operands to be evaluated
     * @param context The evaluation context to use for this evaluation
     * @param neutralElement A neutral element of the logical operation (true for AND, false for OR)
     * @returns A promise representing the result of the logical operation
     */
    async evaluateLogicalOperatorLazily(operands, context, neutralElement) {
        return new Promise((resolve, reject) => {
            const lastOperand = operands[operands.length - 1];
            let wasResolved = false;
            let hasUndefined = false;
            let lastIterationPromise = Promise.resolve();
            for (const operand of operands) {
                lastIterationPromise = lastIterationPromise.then(() => this.evaluateNode(operand, context).then((value) => {
                    if (value.isUndefined) {
                        // We don't really want to treat undefined as true or false
                        // It's just an undefined value
                        hasUndefined = true;
                    }
                    // The non-neutral operand value is returned as-is if it's not last
                    // eg. (0 & true) == 0 but (true & 0) == false
                    // eg. (1 | false) == 1 but (false | 1) == true
                    if (operand == lastOperand) {
                        if (!wasResolved) {
                            const lastValue = value.asBoolean();
                            if (hasUndefined && value.isTruthy() === neutralElement) {
                                resolve(_value_Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined);
                            }
                            else {
                                resolve(lastValue);
                            }
                        }
                        wasResolved = true;
                    }
                    else if (value.isTruthy() !== neutralElement && value.dataType !== _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_2__.ValueDataType.Undefined) {
                        // Undefined never resolves the node
                        // Resolve the whole node, but still keep evaluating other operands
                        if (!wasResolved)
                            resolve(value);
                        wasResolved = true;
                        // Create a new evaluation context, so that the subsequent operands will not
                        // tamper with variable values
                        context = context.createChildContext();
                    }
                })).catch((e) => {
                    // Explicitly propagate the error
                    // It breaks the evaluation but errors should not happen
                    // during evaluation of syntax tree
                    console.error(e);
                    if (!wasResolved) {
                        wasResolved = true;
                        reject(e);
                    }
                });
            }
        });
    }
    /**
     * Evaluates a tree node corresponding to a conditional operator.
     * The evaluation is done lazily, so that only one of the two branches is calculated.
     * However, the other one is still evaluated in a speculative mode.
     *
     * @param operands The operands to be evaluated
     * @param context The evaluation context to use for this evaluation
     * @returns A promise representing the result of the conditional operation
     */
    async evaluateConditionalOperatorLazily(operands, context) {
        const condition = operands[0];
        const ifTrue = operands[1];
        const ifFalse = (operands.length > 2) ? operands[2] : null;
        const conditionValue = await this.evaluateNode(condition, context);
        const childContext = context.createChildContext();
        // Evaluate both branches, but one in a speculative mode
        if (conditionValue.isTruthy()) {
            if (ifFalse !== null) {
                this.evaluateNode(ifFalse, childContext);
            }
            return await this.evaluateNode(ifTrue, context);
        }
        else {
            this.evaluateNode(ifTrue, childContext);
            if (ifFalse === null) {
                return _value_Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Null;
            }
            return await this.evaluateNode(ifFalse, context);
        }
    }
    /**
     * Accepts a set of already computed values for the operator's operands
     * and calculates the result of the operator using them.
     *
     * @param operator The operator to be calculated
     * @param values The operands to be used in the calculation
     * @returns A value of the calculation
     */
    calculateOperatorNodeResult(operator, values) {
        const left = values[0];
        const right = values[1];
        switch (operator) {
            case ';':
                return values[values.length - 1];
            case '&':
                return _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.and(values);
            case '|':
                return _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.or(values);
            case '^':
                return _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.xor(values);
            case '!':
                return _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.not(left);
            case '=':
            case '==':
                return _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_7__.ValueComparer.isLooselyEqualTo(left, right);
            case '!=':
                return _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_7__.ValueComparer.isLooselyInequalTo(left, right);
            case '===':
                return _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_7__.ValueComparer.isStrictlyEqualTo(left, right);
            case '!==':
                return _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_7__.ValueComparer.isStrictlyInequalTo(left, right);
            case '<':
                return _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_7__.ValueComparer.isLessThan(left, right);
            case '<=':
                return _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_7__.ValueComparer.isLessThanOrEqualTo(left, right);
            case '>':
                return _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_7__.ValueComparer.isGreaterThan(left, right);
            case '>=':
                return _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_7__.ValueComparer.isGreaterThanOrEqualTo(left, right);
            case '+':
                // Plus can be unary or binary but both are handled the same way
                return _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.addValues(values);
            case '-':
                // Minus can be unary or binary
                return (right !== undefined) ?
                    _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.subtract(left, right) :
                    _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.negate(left);
            case '*':
                return _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.multiplyValues(values);
            case '/':
                return _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.divide(left, right);
            case '%':
                return _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.modulo(left, right);
            case '**':
                return _value_ValueCalculator_js__WEBPACK_IMPORTED_MODULE_5__.ValueCalculator.pow(left, right);
            case 'in':
                return _value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_6__.ValueStringOperations.contains(right, left);
            case 'contains':
                return _value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_6__.ValueStringOperations.contains(left, right);
            case 'like':
            case 'matches':
                return _value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_6__.ValueStringOperations.testGlob(left, right);
            case 'irlike':
                return _value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_6__.ValueStringOperations.testRegex(left, right, true);
            case 'rlike':
            case 'regex':
                return _value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_6__.ValueStringOperations.testRegex(left, right);
        }
        // If we got here, the operator is unknown
        throw new Error(`Unrecognized operator: ${operator}`);
    }
    /**
     * Performs an assignment of a new value to a variable and returns the new value.
     * @param context The evaluation context where to save the variable
     * @param values Operands of the assignment (variable and new value)
     * @returns The assigned value
     */
    calculateAssignmentResult(context, values) {
        const variable = values[0];
        const newValue = values[1];
        if (!(variable instanceof _value_VariableValue_js__WEBPACK_IMPORTED_MODULE_3__.VariableValue)) {
            throw new Error('Left-hand side of an assignment must be a variable');
        }
        context.setVariable(variable.name, newValue);
        return newValue;
    }
    /**
     * Performs an assignment of a new value to an index of an array and returns the new value.
     * If there's no index provided, the new value is appended to the array.
     * @param values Operands of the index assignment (array, new value, index)
     * @returns The assigned value
     */
    calculateIndexAssignmentResult(values) {
        const array = values[0];
        const newValue = values[1];
        if (values.length == 2) {
            array.appendElement(newValue);
        }
        else {
            const index = values[2];
            array.setElementAt(index, newValue);
        }
        return newValue;
    }
    /**
     * Returns a value at the specified index in the array.
     * @param values The operands of array indexing (array, index)
     * @returns A value at the specified index in the array
     */
    calculateArrayIndexingResult(values) {
        const array = values[0];
        const index = values[1];
        return array.getElementAt(index);
    }
    /**
     * Invokes a specified function and returns the result.
     * @param context The evaluation context
     * @param func Function name
     * @param values Function arguments
     * @returns The function call result
     */
    async calculateFunctionCallResult(context, func, values) {
        return this.functionExecutor.executeFunction(func, context, values);
    }
    /**
     * Creates a new array value from the provided values.
     * @param values Values to be stored in the newly created array
     * @returns The created array
     */
    calculateArrayDefinitionResult(values) {
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_2__.ValueDataType.Array, values);
    }
}


/***/ }),
/* 10 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TreeNodeType: () => (/* binding */ TreeNodeType)
/* harmony export */ });
/**
 * An enumeration of all supported node types in the parser tree.
 */
var TreeNodeType;
(function (TreeNodeType) {
    /**
     * Represents an operator node. It's composed of at least one children that represent
     * the operands.
     */
    TreeNodeType["Operator"] = "Operator";
    /**
     * Represents an assignment node. It's composed of two children:
     * a variable name (string) and a value (tree node).
     */
    TreeNodeType["Assignment"] = "Assignment";
    /**
     * Represents an assignment to an array element node. It's composed of three subnodes:
     * a variable, a value and optionally an index (without index it's appending to array).
     */
    TreeNodeType["IndexAssignment"] = "IndexAssignment";
    /**
     * Represents an array access by index node. It's composed of two children:
     * an array and an offset (both being tree nodes).
     */
    TreeNodeType["ArrayIndexing"] = "ArrayIndexing";
    /**
     * Represents a function call node. It's composed of a function name (string) and
     * a variable number of further arguments (tree nodes).
     */
    TreeNodeType["FunctionCall"] = "FunctionCall";
    /**
     * Represents an array definition node (i.e. array literal). It's composed of a
     * variable number of children, each of them is a value of a single array element (tree nodes).
     */
    TreeNodeType["ArrayDefinition"] = "ArrayDefinition";
    /**
     * Represents a literal node. It has no children.
     */
    TreeNodeType["Atom"] = "Atom";
})(TreeNodeType || (TreeNodeType = {}));


/***/ }),
/* 11 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValueCalculator: () => (/* binding */ ValueCalculator)
/* harmony export */ });
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);


/**
 * Provides methods for performing arithmetic and logical operations on values.
 */
class ValueCalculator {
    /** Performs an addition or concatenation */
    static add(augend, addend) {
        if (augend.isUndefined || addend.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        else if (augend.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.String || addend.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.String) {
            return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.String, augend.asString().value + addend.asString().value);
        }
        else if (augend.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array && addend.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array) {
            return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array, augend.value.concat(addend.value));
        }
        else {
            const res = augend.asFloat().value + addend.asFloat().value;
            const type = (augend.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float) || (addend.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float) ?
                _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float : _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Integer;
            return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(type, res);
        }
    }
    /** Performs an addition of many values */
    static addValues(values) {
        if (values.length === 1) {
            return values[0];
        }
        let result = values[0];
        for (let i = 1; i < values.length; i++) {
            result = ValueCalculator.add(result, values[i]);
        }
        return result;
    }
    /** Subtracts the other value from this one */
    static subtract(minuend, subtrahend) {
        if (minuend.isUndefined || subtrahend.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        const res = minuend.asFloat().value - subtrahend.asFloat().value;
        const type = (minuend.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float) || (subtrahend.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float) ?
            _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float : _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Integer;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(type, res);
    }
    /** Multiplies this value by the other */
    static multiply(multiplicand, multiplier) {
        if (multiplicand.isUndefined || multiplier.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        const res = multiplicand.asFloat().value * multiplier.asFloat().value;
        const type = (multiplicand.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float) || (multiplier.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float) ?
            _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float : _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Integer;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(type, res);
    }
    /** Performs a multiplication of many values */
    static multiplyValues(values) {
        if (values.length === 1) {
            return values[0];
        }
        let result = values[0];
        for (let i = 1; i < values.length; i++) {
            result = ValueCalculator.multiply(result, values[i]);
        }
        return result;
    }
    /** Divides the value by the specified divisor. Throws an error if the divisor is zero. */
    static divide(dividend, divisor) {
        if (divisor.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        if (divisor.asFloat().value === 0) {
            throw new Error('dividebyzero');
        }
        if (dividend.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        const res = dividend.asFloat().value / divisor.asFloat().value;
        const isOperandFloat = (dividend.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float) || (divisor.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float);
        const type = isOperandFloat || (res % 1 !== 0) ? _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float : _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Integer;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(type, res);
    }
    /** Computes a remainder of the division of this value by the other. */
    static modulo(dividend, divisor) {
        if (divisor.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        if (divisor.asFloat().value === 0) {
            throw new Error('dividebyzero');
        }
        if (dividend.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        // AbuseFilter converts operands to int for modulo
        const res = Math.floor(dividend.asFloat().value) % Math.floor(divisor.asFloat().value);
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Integer, res);
    }
    /** Returns the result of raising this value to the given power */
    static pow(base, exponent) {
        if (base.isUndefined || exponent.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        const res = Math.pow(base.asFloat().value, exponent.asFloat().value);
        const isOperandFloat = (base.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float) || (exponent.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float);
        const type = isOperandFloat || (res % 1 !== 0) ? _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float : _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Integer;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(type, res);
    }
    /** Returns an arithmetic negation of the value */
    static negate(value) {
        if (value.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        const res = -value.asFloat().value;
        const type = (res % 1 === 0) ? _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Integer : _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Float;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(type, res);
    }
    /** Performs a logical conjunction of the values. The result is always a boolean or undefined. */
    static and(operands) {
        let hasUndefined = false;
        for (const operand of operands) {
            if (operand.isUndefined) {
                hasUndefined = true;
            }
            else if (!operand.isTruthy()) {
                return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.False;
            }
        }
        return !hasUndefined ? _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.True : _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
    }
    /** Performs a logical alternative of the values. The result is always a boolean or undefined. */
    static or(operands) {
        let hasUndefined = false;
        for (const operand of operands) {
            if (operand.isUndefined) {
                hasUndefined = true;
            }
            else if (operand.isTruthy()) {
                return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.True;
            }
        }
        return !hasUndefined ? _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.True : _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
    }
    /** Performs a logical exclusive alternative of the values. The result is always a boolean or undefined. */
    static xor(operands) {
        let trueCount = 0;
        for (const operand of operands) {
            if (operand.isUndefined) {
                return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
            }
            else if (operand.isTruthy()) {
                trueCount++;
            }
        }
        return (trueCount % 2 === 1) ? _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.True : _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.False;
    }
    /** Returns a boolean negation of the value */
    static not(value) {
        if (value.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        return value.isTruthy() ? _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.False : _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.True;
    }
}


/***/ }),
/* 12 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValueStringOperations: () => (/* binding */ ValueStringOperations)
/* harmony export */ });
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);



/**
 * Provides string operations for values.
 */
class ValueStringOperations {
    /** Checks if this value contains the needle (both are converted to string first) */
    static contains(haystack, needle) {
        if (haystack.isUndefined || needle.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        const thisString = haystack.asString().value;
        const needleString = needle.asString().value;
        if (thisString === '' || needleString === '') {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.False;
        }
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean, thisString.includes(needleString));
    }
    /** Matches the haystack to the substring and returns the place where it occurs */
    static matchSubstring(haystack, needle) {
        if (haystack.isUndefined || needle.isUndefined) {
            return null;
        }
        const haystackString = haystack.asString().value;
        const needleString = needle.asString().value;
        const index = haystackString.indexOf(needleString);
        if (index === -1) {
            return null;
        }
        return {
            start: index,
            end: index + needleString.length,
        };
    }
    /** Checks if this value is matched by the regex pattern */
    static testRegex(subject, pattern, caseInsensitive = false) {
        if (subject.isUndefined || pattern.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        const subjectString = subject.asString().value;
        const patternRegex = this.makeRegex(pattern.asString().value, caseInsensitive);
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean, patternRegex.test(subjectString));
    }
    /** Matches the regex pattern to the subject and returns where it was found */
    static matchRegex(subject, pattern, caseInsensitive = false) {
        if (subject.isUndefined || pattern.isUndefined) {
            return null;
        }
        const patternRegex = this.makeRegex(pattern.asString().value, caseInsensitive);
        return this.match(subject.asString().value, patternRegex);
    }
    /** Converts a regex string into JavaScript regex object */
    static makeRegex(pattern, caseInsensitive) {
        return _utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_2__.RegexUtils.toEcmaRegex(pattern, { i: caseInsensitive, u: true });
    }
    /** Checks if this value is matched by the glob pattern */
    static testGlob(subject, pattern) {
        if (subject.isUndefined || pattern.isUndefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        const subjectString = subject.asString().value;
        const patternRegex = this.globToRegex(pattern.asString().value);
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean, patternRegex.test(subjectString));
    }
    /** Matches the glob pattern to the subject and returns where it was found */
    static matchGlob(subject, pattern) {
        if (subject.isUndefined || pattern.isUndefined) {
            return null;
        }
        const patternRegex = this.globToRegex(pattern.asString().value);
        return this.match(subject.asString().value, patternRegex);
    }
    /** Converts a glob pattern into JavaScript regex object */
    static globToRegex(pattern) {
        // First, escape the pattern according to Regex rules
        pattern = _utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_2__.RegexUtils.escape(pattern);
        // Then substitute the glob wildcards with regex sequences
        pattern = pattern.replace(/\\\*/g, '.*')
            .replace(/\\\?/g, '.')
            .replace(/\\\[!/g, '[^')
            .replace(/\\\[/g, '[')
            .replace(/\\\]/g, ']');
        return new RegExp(pattern, 'u');
    }
    static match(subject, pattern) {
        const match = pattern.exec(subject);
        if (!match) {
            return null;
        }
        return {
            start: match.index,
            end: match.index + match[0].length,
        };
    }
}


/***/ }),
/* 13 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RegexUtils: () => (/* binding */ RegexUtils)
/* harmony export */ });
/* harmony import */ var _PcreParser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);

/**
 * Utility class for processing PCRE regular expressions
 */
class RegexUtils {
    /**
     * Escapes regex special characters in a string according to ECMA regex rules
     * @param str PCRE-compliant regex string
     */
    static escape(str) {
        // We can't parse this string as regex and then add backslash to
        // special characters because the input string is likely not to
        // be a well-formed regex.
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /**
     * Parses a PCRE regex string into an object
     * @param str PCRE-compliant regex string
     */
    static parse(str) {
        const parser = new _PcreParser_js__WEBPACK_IMPORTED_MODULE_0__.PcreParser(str);
        return parser.parse();
    }
    /**
     * Converts a PCRE reges string into an ECMA regex object
     * @param str PCRE-compliant regex string
     * @param flags Default regex flags to use if none are provided
     */
    static toEcmaRegex(regex, flags) {
        const defaultFlags = {
            d: false,
            g: false,
            i: false,
            m: false,
            s: false,
            u: true,
            v: false,
            y: false
        };
        const effectiveFlags = Object.assign(defaultFlags, flags);
        const rootGroup = typeof regex === 'string' ? this.parse(regex) : regex;
        // Extract flags from the root group to apply them to the RegExp object
        for (const option of rootGroup.options) {
            const optionValue = option.startsWith('-') ? false : true;
            const optionName = option.replace(/^-/, '').toLowerCase();
            if (optionName in effectiveFlags) {
                effectiveFlags[optionName] = optionValue;
            }
        }
        // We don't need the options on the root group so clear them
        rootGroup.options.slice(0, rootGroup.options.length);
        let flagString = '';
        for (const [key, value] of Object.entries(effectiveFlags)) {
            if (value) {
                flagString += key;
            }
        }
        const ecmaRegexString = rootGroup.toEcmaRegexString();
        return new RegExp(ecmaRegexString, flagString);
    }
}


/***/ }),
/* 14 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PcreGroup: () => (/* binding */ PcreGroup),
/* harmony export */   PcreParser: () => (/* binding */ PcreParser)
/* harmony export */ });
// For PCRE spec see: https://www.pcre.org/original/doc/html/pcrepattern.html
/**
 * Provides a service of parsing PCRE-compliant regex strings
 * and further converting them to ECMA-compliant regex strings.
 */
class PcreParser {
    constructor(pcreString) {
        this.index = 0;
        this.pcreString = pcreString;
    }
    /** Return the character at the next position without moving the pointer */
    peek(offset = 0) {
        return this.pcreString[this.index + offset];
    }
    /** Moves the pointer and returns the next character */
    next() {
        return this.pcreString[this.index++];
    }
    /** Returns the current parser state, can be used to restore it */
    getState() {
        return { index: this.index };
    }
    /** Restores a previously obtained state */
    restoreState(state) {
        this.index = state.index;
    }
    parse() {
        // Parse options in form (*UTF8) if needed
        const group = this.parseGroup();
        group.isRoot = true;
        group.makeBackreferencesAbsolute();
        const maxBackreference = group.countContainedCapturingGroups();
        group.reifyBackreferencesAbove(maxBackreference);
        return group;
    }
    parseGroup(rootGroup = false) {
        const group = new PcreGroup();
        // Parse group options at the beginning
        if (!rootGroup && this.peek() === '?') {
            // We have some options in this group
            const headerStart = this.index;
            this.next();
            let finishHeader = false;
            let isOptionNegative = false;
            while (!finishHeader && this.index < this.pcreString.length) {
                const optionChar = this.next();
                switch (optionChar) {
                    case ':':
                        group.isCapturing = false;
                        finishHeader = true;
                        break;
                    case 'i':
                    case 'm':
                    case 's':
                    case 'x':
                        group.options.push((isOptionNegative ? '-' : '') + optionChar);
                        break;
                    case '-':
                        isOptionNegative = true;
                        break;
                    case '<':
                        if (this.peek() === '!' || this.peek() === '=') {
                            group.isLookbehind = true;
                            break;
                        }
                    // If not a lookbehind, treat is as a named group
                    // eslint-disable-next-line no-fallthrough
                    case '\'':
                    case 'P': {
                        const endChar = (optionChar === '\'') ? '\'' : '>';
                        if (optionChar === 'P')
                            this.next(); // Skip the opening bracket
                        let name = '';
                        while (this.peek() !== endChar) {
                            name += this.next();
                        }
                        this.next(); // Skip the closing char
                        group.name = name;
                        finishHeader = true;
                        break;
                    }
                    case '=':
                        group.isAssertion = true;
                        finishHeader = true;
                        break;
                    case '!':
                        group.isAssertion = true;
                        group.isNegativeAssertion = true;
                        finishHeader = true;
                        break;
                    default:
                        finishHeader = true;
                        this.index--; // Move back to the character that was not recognized
                        break;
                }
            }
            group.originalHeader = this.pcreString.slice(headerStart, this.index);
        }
        let inEscapeMode = false; // Whether in between of \Q ... \E
        let exitLoop = false;
        while (this.index < this.pcreString.length && !exitLoop) {
            const c = this.next();
            if (!inEscapeMode) {
                switch (c) {
                    case '\\':
                        if (this.peek() === 'Q') {
                            inEscapeMode = true;
                            this.next();
                        }
                        else if (this.peek() === 'E') { // Unmatched \E is ignored
                            this.next();
                        }
                        else {
                            group.addToken(this.parseEscapeSequence(false));
                        }
                        break;
                    case '(':
                        // Check if it's an option setting
                        // Or can be a backreference like (?P=name)
                        if (this.peek() === '?') {
                            let offset = 1;
                            let isOption = true;
                            while (this.peek(offset) !== ')') {
                                const c = this.peek(offset);
                                if (!/[imsx-]/.test(c)) {
                                    isOption = false;
                                    break;
                                }
                                offset++;
                            }
                            if (isOption) {
                                group.addToken(new PcreInternalOption(this.pcreString.slice(this.index - 1, this.index + offset + 1)));
                                this.index += offset + 1;
                                break;
                            }
                            else {
                                if (this.peek(1) === 'P' && this.peek(2) === '=') {
                                    // Named backreference
                                    let name = '';
                                    let offset = 3;
                                    while (this.peek(offset) !== ')') {
                                        name += this.peek(offset);
                                        offset++;
                                    }
                                    this.index += offset + 1;
                                    group.addToken(new PcreBackreference(name, '(?P=' + name + ')'));
                                    break;
                                }
                            }
                        }
                        group.addToken(this.parseGroup());
                        break;
                    case '[':
                        group.addToken(this.parseCharacterClass());
                        break;
                    case ')':
                        exitLoop = true;
                        break;
                    case '{': {
                        const state = this.getState();
                        let min = '';
                        let max = '';
                        let modifier = '';
                        let exact = true;
                        while (this.peek() !== ',' && this.peek() !== '}' && this.index < this.pcreString.length) {
                            min += this.next();
                        }
                        if (this.next() === ',') {
                            exact = false;
                            // The max part is optional
                            while (this.peek() !== '}') {
                                max += this.next();
                            }
                            this.next(); // Skip the closing brace
                        }
                        if (['?', '+'].includes(this.peek()) && !exact) {
                            modifier = this.next();
                        }
                        let quantifier;
                        if (exact) {
                            quantifier = '{' + min + '}' + modifier;
                        }
                        else {
                            quantifier = '{' + min + ',' + max + '}' + modifier;
                        }
                        // Ensure the quantifier is valid
                        if (/^(\{\d+\}|\{\d+,\d*\}[?+]?)/.test(quantifier)) {
                            group.addToken(new PcreMetacharacter(quantifier));
                        }
                        else {
                            this.restoreState(state);
                            group.addToken(new PcreCharacter(c, c));
                        }
                        break;
                    }
                    default:
                        if (c === '^' || c === '$') {
                            group.addToken(new PcreAnchor(c));
                            break;
                        }
                        if (['*', '+', '?'].includes(c)) {
                            // Store lazy and possessive modifiers
                            if (this.peek() === '?') {
                                this.next();
                                group.addToken(new PcreMetacharacter(c + '?'));
                            }
                            else if (this.peek() === '+') {
                                this.next();
                                group.addToken(new PcreMetacharacter(c + '+'));
                            }
                            else {
                                group.addToken(new PcreMetacharacter(c));
                            }
                            break;
                        }
                        if (['.', '|'].includes(c)) {
                            group.addToken(new PcreMetacharacter(c));
                            break;
                        }
                        group.addToken(new PcreCharacter(c, c));
                }
            }
            else {
                if (c === '\\' && this.peek() === 'E') {
                    inEscapeMode = false;
                    this.next();
                }
                else {
                    group.addToken(new PcreCharacter(c, c));
                }
            }
        }
        return group;
    }
    parseEscapeSequence(inCharacterClass) {
        var _a, _b;
        // Move to the next character and include it in the current token
        // Preserve the backslash to denote the special meaning of the next character
        const escapedChar = this.next();
        if (escapedChar === 'c') {
            // Control character, always \cx, where x is ASCII character
            const modifier = this.next();
            if (((_a = modifier.codePointAt(0)) !== null && _a !== void 0 ? _a : -1) <= 255) {
                const charCode = modifier.toUpperCase().charCodeAt(0) ^ 0x40;
                return new PcreCharacter(String.fromCharCode(charCode), '\\c' + modifier);
            }
            else {
                throw new Error(`Invalid control character: \\c${modifier}`);
            }
        }
        else if (escapedChar === 'x') {
            // Hexadecimal character, \xhh or \x{hhhh}
            if (this.peek() === '{') {
                this.next(); // Skip the opening brace
                let hexCode = '';
                while (this.peek() !== '}') {
                    hexCode += this.next();
                }
                this.next(); // Skip the closing brace
                const originalString = '\\x{' + hexCode + '}';
                if (hexCode.length === 0)
                    hexCode = '0';
                return new PcreCharacter(String.fromCodePoint(parseInt(hexCode, 16)), originalString);
            }
            else {
                let hexCode = '';
                for (let j = 0; j < 2; j++) { // up to 2 hex characters
                    if (/[0-9a-h]/i.test(this.peek())) {
                        hexCode += this.next();
                    }
                    else {
                        break;
                    }
                }
                const originalString = '\\x' + hexCode;
                if (hexCode.length === 0)
                    hexCode = '0';
                return new PcreCharacter(String.fromCodePoint(parseInt(hexCode, 16)), originalString);
            }
        }
        else if (escapedChar === 'o') {
            // Octal character, \o{ddd...}
            this.next(); // Skip the opening brace
            let octCode = '';
            while (this.peek() !== '}') {
                octCode += this.next();
            }
            this.next(); // Skip the closing brace
            const originalString = '\\o{' + octCode + '}';
            if (octCode.length === 0)
                octCode = '0';
            return new PcreCharacter(String.fromCodePoint(parseInt(octCode, 8)), originalString);
        }
        else if (/\d/.test(escapedChar)) {
            // Octal character or backreference, up to 3 digits
            let number = escapedChar;
            const permittedDigits = (escapedChar === '0') ? /[0-7]/ : /\d/;
            for (let j = 0; j < 2; j++) {
                if (permittedDigits.test(this.peek())) {
                    number += this.next();
                }
                else {
                    break;
                }
            }
            if (number.startsWith('0')) {
                // Octal character
                return new PcreCharacter(String.fromCodePoint(parseInt(number, 8)), '\\' + number);
            }
            else {
                // Backreference
                return new PcreBackreference(number, '\\' + number);
            }
        }
        else if (escapedChar === 'p' || escapedChar === 'P') {
            // Unicode character class, \p{xx} or \P{xx}
            // or \pX or \p{^xx}
            let charClass = this.next(); // This is either { or a single-character class designator
            if (charClass !== '{') {
                return new PcreWellKnownCharacterClass('\\' + escapedChar + '{' + charClass + '}', '\\' + escapedChar + charClass);
            }
            charClass = '';
            while (this.peek() !== '}') {
                charClass += this.next();
            }
            this.next(); // Skip the closing brace
            if (escapedChar === 'p' && charClass.startsWith('^')) {
                return new PcreWellKnownCharacterClass('\\P{' + charClass.slice(1) + '}', '\\p{' + charClass + '}');
            }
            return new PcreWellKnownCharacterClass('\\' + escapedChar + '{' + charClass + '}');
        }
        else if (/[dhsvw]/i.test(escapedChar) || ((escapedChar === 'N' || escapedChar === 'R') && !inCharacterClass)) {
            return new PcreWellKnownCharacterClass('\\' + escapedChar);
        }
        else if (/[ZzA]/.test(escapedChar) || (!inCharacterClass && escapedChar.toLowerCase() === 'b')) {
            return new PcreAnchor('\\' + escapedChar);
        }
        else if (escapedChar === 'g' || escapedChar === 'k') {
            // Backreference syntax: \g1 or \g{1} or \g{-1} or \g<name> or \k<name> or \k'name' or \k{name}
            if (/[-\d]/.test(this.peek())) {
                let number = this.next();
                while (/[-\d]/.test(this.peek())) {
                    number += this.next();
                }
                return new PcreBackreference(number, '\\' + escapedChar + number);
            }
            const startChar = this.next();
            const endChar = (_b = { '{': '}', '<': '>', '\'': '\'', '"': '"' }[startChar]) !== null && _b !== void 0 ? _b : startChar;
            let name = '';
            while (this.peek() !== endChar) {
                name += this.next();
            }
            this.next(); // Skip the closing char
            return new PcreBackreference(name, '\\' + escapedChar + startChar + name + endChar);
        }
        else {
            const charMapping = {
                'a': '\u0007',
                'b': '\u0008',
                'e': '\u001B',
                'f': '\u000C',
                'n': '\u000A',
                'r': '\u000D',
                't': '\u0009'
            };
            if (escapedChar in charMapping) {
                return new PcreCharacter(charMapping[escapedChar], '\\' + escapedChar);
            }
            else {
                return new PcreCharacter(escapedChar, '\\' + escapedChar);
            }
        }
    }
    parseCharacterClass() {
        const isNegated = this.peek() === '^';
        if (isNegated)
            this.next();
        const charClass = new PcreCharacterClass(isNegated);
        let inEscapeMode = false; // Whether in between of \Q ... \E
        while (this.index < this.pcreString.length) {
            const c = this.next();
            if (!inEscapeMode) {
                let token;
                // TODO: Parse [[:alpha:]] and similar
                if (c === '\\') {
                    if (this.peek() === 'Q') {
                        inEscapeMode = true;
                        this.next();
                        continue;
                    }
                    else if (this.peek() === 'E') {
                        inEscapeMode = false;
                        this.next();
                        continue;
                    }
                    else {
                        token = this.parseEscapeSequence(true);
                    }
                }
                else if (c === ']') {
                    if (charClass.isEmpty) {
                        // Unescaped ] is allowed at the beginning of the character class
                        token = new PcreCharacter(']', ']');
                    }
                    else {
                        break;
                    }
                }
                else {
                    token = new PcreCharacter(c, c);
                }
                if (this.peek() === '-' && this.peek(1) !== ']') {
                    this.next();
                    const rangeEnd = this.next();
                    const nextToken = (rangeEnd === '\\') ?
                        this.parseEscapeSequence(true) : new PcreCharacter(rangeEnd, rangeEnd);
                    charClass.addCharacter([token, nextToken]);
                }
                else {
                    charClass.addCharacter(token);
                }
            }
            else {
                if (c === '\\' && this.peek() === 'E') {
                    inEscapeMode = false;
                    this.next();
                }
                else {
                    charClass.addCharacter(new PcreCharacter(c, c));
                }
            }
        }
        return charClass;
    }
}
const getDefaultEmulateOptions = () => ({ multiline: false, ignoreCase: false, inAssertion: false, inCharacterClass: false });
class PcreGroup {
    constructor() {
        this.isRoot = false;
        this.isCapturing = true;
        this.name = null;
        // If isAssertion is true, the following describe the type of this assertion
        // If isAssertion is false, the following have no effect on the group
        this.isAssertion = false;
        this.isLookbehind = false;
        this.isNegativeAssertion = false;
        this.originalHeader = '';
        this.options = [];
        this.tokens = [];
    }
    addToken(token) {
        this.tokens.push(token);
    }
    toEcmaRegexString(emulateOptions) {
        if (emulateOptions === undefined) {
            emulateOptions = getDefaultEmulateOptions();
        }
        else {
            // Not to bubble the changes to the parent group
            emulateOptions = Object.assign({}, emulateOptions);
        }
        emulateOptions.ignoreCase || (emulateOptions.ignoreCase = this.options.includes('i'));
        emulateOptions.multiline || (emulateOptions.multiline = this.options.includes('m'));
        emulateOptions.ignoreCase && (emulateOptions.ignoreCase = !this.options.includes('-i'));
        emulateOptions.multiline && (emulateOptions.multiline = !this.options.includes('-m'));
        let groupContent = '';
        for (const token of this.tokens) {
            if (token instanceof PcreInternalOption) {
                emulateOptions.ignoreCase || (emulateOptions.ignoreCase = token.options.includes('i'));
                emulateOptions.multiline || (emulateOptions.multiline = token.options.includes('m'));
                emulateOptions.ignoreCase && (emulateOptions.ignoreCase = !token.options.includes('-i'));
                emulateOptions.multiline && (emulateOptions.multiline = !token.options.includes('-m'));
                continue;
            }
            groupContent += token.toEcmaRegexString(emulateOptions);
        }
        if (this.isRoot)
            return groupContent;
        let str = '(';
        if (this.isAssertion) {
            str += '?';
            if (this.isLookbehind)
                str += '<';
            str += this.isNegativeAssertion ? '!' : '=';
            emulateOptions.inAssertion = true;
        }
        else {
            if (!this.isCapturing)
                str += '?:';
            else if (this.name !== null)
                str += `?<${this.name}>`;
        }
        str += groupContent;
        str += ')';
        return str;
    }
    getOriginalString() {
        const groupContent = this.tokens.map(t => t.getOriginalString()).join('');
        if (this.isRoot)
            return groupContent;
        let str = '(' + this.originalHeader;
        str += groupContent;
        str += ')';
        return str;
    }
    makeBackreferencesAbsolute(startingGroupIndex = 0) {
        for (const token of this.tokens) {
            if (token instanceof PcreBackreference) {
                token.makeAbsolute(startingGroupIndex);
            }
            else if (token instanceof PcreGroup) {
                if (token.isCapturing && !token.isAssertion)
                    startingGroupIndex++;
                token.makeBackreferencesAbsolute(startingGroupIndex);
            }
        }
    }
    countContainedCapturingGroups() {
        let count = 0;
        for (const token of this.tokens) {
            if (token instanceof PcreGroup) {
                if (token.isCapturing && !token.isAssertion)
                    count++;
                count += token.countContainedCapturingGroups();
            }
        }
        return count;
    }
    reifyBackreferencesAbove(numberOfGroups) {
        // \1 to \9 are always backreferences!
        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            if (token instanceof PcreBackreference) {
                if (token.isNumbered && token.number > numberOfGroups && token.number > 9) {
                    // Insert substitutes instead of the backreference
                    const substitutes = token.reifyBackreference();
                    this.tokens.splice(i, 1, ...substitutes);
                }
            }
            else if (token instanceof PcreGroup) {
                token.reifyBackreferencesAbove(numberOfGroups);
            }
        }
    }
}
class PcreCharacterClass {
    get isEmpty() {
        return this.characters.length === 0;
    }
    constructor(isNegated) {
        this.characters = [];
        this.isNegated = isNegated;
    }
    addCharacter(character) {
        this.characters.push(character);
    }
    toEcmaRegexString(emulateOptions) {
        if (emulateOptions === undefined) {
            emulateOptions = getDefaultEmulateOptions();
        }
        else {
            // Not to bubble the changes to the parent group
            emulateOptions = Object.assign({}, emulateOptions);
        }
        emulateOptions.inCharacterClass = true;
        let str = '[';
        if (this.isNegated)
            str += '^';
        str += this.characters.map(t => {
            if (Array.isArray(t)) {
                return this.makeEcmaStringForRange(emulateOptions, t[0], t[1]);
            }
            else {
                return t.toEcmaRegexString(emulateOptions);
            }
        }).join('');
        str += ']';
        return str;
    }
    getOriginalString() {
        let str = '[';
        if (this.isNegated)
            str += '^';
        str += this.characters.map(t => {
            if (Array.isArray(t)) {
                return t.map(tt => tt.getOriginalString()).join('-');
            }
            else {
                return t.getOriginalString();
            }
        }).join('');
        str += ']';
        return str;
    }
    makeEcmaStringForRange(emulateOptions, token1, token2) {
        const emulateOptionsCopy = Object.assign({}, emulateOptions);
        emulateOptionsCopy.ignoreCase = false; // So that the character won't do its own adjustments
        const str1 = token1.toEcmaRegexString(emulateOptionsCopy);
        const str2 = token2.toEcmaRegexString(emulateOptionsCopy);
        if (!emulateOptions.ignoreCase) {
            return str1 + '-' + str2;
        }
        const isUpperCase = (c) => c === c.toUpperCase() && c !== c.toLowerCase();
        const isLowerCase = (c) => c === c.toLowerCase() && c !== c.toUpperCase();
        const isNoCase = (c) => !isUpperCase(c) && !isLowerCase(c);
        const areSameCase = (c1, c2) => isUpperCase(c1) === isUpperCase(c2) && !isNoCase(c1);
        // If the two characters are the same case, we can just use the range two times
        if (areSameCase(str1, str2)) {
            return str1.toLowerCase() + '-' + str2.toLowerCase() + str1.toUpperCase() + '-' + str2.toUpperCase();
        }
        // Iterate over the range and list all the upper- and lowercase subranges to include
        // The resulting regex will not be optimal, but it should contain all the necessary characters
        const sameCaseSubranges = [];
        const addSubrange = (start, end) => {
            // We need to have .toLowerCase() and .toUpperCase() to emulate the case-insensitive behavior
            sameCaseSubranges.push([start.toLowerCase(), end.toLowerCase()]);
            sameCaseSubranges.push([start.toUpperCase(), end.toUpperCase()]);
        };
        let currentSubrangeStart = null;
        let currentSubrangeEnd = null;
        const codePointStart = str1.codePointAt(0);
        const codePointEnd = str2.codePointAt(0);
        for (let i = codePointStart; i <= codePointEnd; i++) {
            const c = String.fromCodePoint(i);
            if (currentSubrangeStart === null) {
                if (!isNoCase(c)) {
                    currentSubrangeStart = c;
                    currentSubrangeEnd = c;
                }
            }
            else {
                // Continue the current subrange
                if (areSameCase(currentSubrangeStart, c)) {
                    currentSubrangeEnd = c;
                }
                else {
                    // We either stumbled upon a different case or a symbol
                    // In any case, we finish the current subrange
                    addSubrange(currentSubrangeStart, currentSubrangeEnd);
                    // Either start a new subrange or reset the current one
                    currentSubrangeStart = isNoCase(c) ? null : c;
                    currentSubrangeEnd = currentSubrangeStart;
                }
            }
        }
        if (currentSubrangeStart !== null && currentSubrangeEnd !== null) {
            addSubrange(currentSubrangeStart, currentSubrangeEnd);
        }
        let rangeString = str1 + '-' + str2;
        for (const [start, end] of sameCaseSubranges) {
            if (codePointStart <= start.codePointAt(0) && end.codePointAt(0) <= codePointEnd) {
                continue; // The range is already covered
            }
            if (start === end) {
                rangeString += start;
            }
            else {
                rangeString += start + '-' + end;
            }
        }
        return rangeString;
    }
}
class PcreWellKnownCharacterClass {
    constructor(classDesignator, originalString) {
        this.classDesignator = classDesignator;
        this.originalString = originalString !== null && originalString !== void 0 ? originalString : classDesignator;
    }
    toEcmaRegexString(emulateOptions) {
        emulateOptions !== null && emulateOptions !== void 0 ? emulateOptions : (emulateOptions = getDefaultEmulateOptions());
        // \h is not supported in ECMA regex
        if (this.classDesignator.toLowerCase() === '\\h') {
            const useNegative = this.classDesignator === '\\H';
            const horizontalSpaces = [
                0x9, 0x20, 0xa0, 0x1680, 0x180e, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004,
                0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x202f, 0x205f, 0x3000
            ];
            const characters = horizontalSpaces.map(c => '\\u{' + c.toString(16) + '}').join('');
            if (emulateOptions.inCharacterClass)
                return characters;
            let str = '[';
            if (useNegative)
                str += '^';
            str += characters;
            str += ']';
            return str;
        }
        // \v is not supported in ECMA regex
        if (this.classDesignator.toLowerCase() === '\\v') {
            const useNegative = this.classDesignator === '\\V';
            const verticalSpaces = [
                0xa, 0xb, 0xc, 0xd, 0x85, 0x2028, 0x2029
            ];
            const characters = verticalSpaces.map(c => '\\u{' + c.toString(16) + '}').join('');
            if (emulateOptions.inCharacterClass)
                return characters;
            let str = '[';
            if (useNegative)
                str += '^';
            str += characters;
            str += ']';
            return str;
        }
        // \N and \R are not supported in ECMA regex
        if (this.classDesignator === '\\R') {
            if (emulateOptions.inCharacterClass)
                return '\\n\\r\\f\\x0b\\x85\\u2028\\u2029';
            return '(?:\\n|\\r|\\r\\n|\\f|\\x0b|\\x85|\\u2028|\\u2029)';
        }
        if (this.classDesignator === '\\N') {
            return '[^\\n\\r\\f\\x0b\\x85\\u2028\\u2029]';
        }
        return this.classDesignator;
    }
    getOriginalString() {
        return this.originalString;
    }
}
/* [:...:] style classes (TODO: find a way to implement this as \p{...} or others)
  alnum    \p{Xan}       letters and digits
  alpha    \p{L}         letters
  ascii    [\0-\xff]     character codes 0 - 127
  blank    \h            space or tab only
  cntrl    \p{Cc}        control characters
  digit    \p{Nd}        decimal digits (same as \d)
  graph                  printing characters, excluding space
  lower    \p{Ll}        lower case letters
  print                  printing characters, including space
  punct    [\p{S}\p{P}]  printing characters, excluding letters and digits and space
  space    \p{Xps}       white space (the same as \s from PCRE 8.34)
  upper    \p{Lu}        upper case letters
  word     \p{Xwd}       "word" characters (same as \w)
  xdigit   [\da-fA-F]    hexadecimal digits
*/
class PcreAnchor {
    constructor(anchor) {
        this.anchor = anchor;
    }
    toEcmaRegexString(emulateOptions) {
        emulateOptions !== null && emulateOptions !== void 0 ? emulateOptions : (emulateOptions = getDefaultEmulateOptions());
        // Word boundary are supported in ECMA regex
        if (this.anchor.toLowerCase() === '\\b')
            return this.anchor;
        /* Transform in multiline
            ^ -> (?:^|(?<=\n))
            $ -> (?:$|(?=\n))

            Transform always
            \A -> ^
            \Z -> \n?$
            \z -> $
        */
        if (emulateOptions.multiline) {
            // We don't place assertions into assertions
            if (this.anchor === '^')
                return !emulateOptions.inAssertion ? '(?:^|(?<=\\n))' : '(?:^|\\n)';
            if (this.anchor === '$')
                return !emulateOptions.inAssertion ? '(?:$|(?=\\n))' : '(?:$|\\n)';
        }
        if (this.anchor === '\\A')
            return '^';
        if (this.anchor === '\\Z')
            return '\\n?$';
        if (this.anchor === '\\z')
            return '$';
        return this.anchor;
    }
    getOriginalString() {
        return this.anchor;
    }
}
class PcreMetacharacter {
    constructor(character) {
        this.character = character;
    }
    toEcmaRegexString() {
        return this.character;
    }
    getOriginalString() {
        return this.character;
    }
}
class PcreCharacter {
    constructor(character, originalString) {
        this.character = character;
        this.originalString = originalString;
    }
    toEcmaRegexString(emulateOptions) {
        emulateOptions !== null && emulateOptions !== void 0 ? emulateOptions : (emulateOptions = getDefaultEmulateOptions());
        // For readability, instead of using numeric escape
        switch (this.character) {
            case '\0': return '\\0';
            case '\n': return '\\n';
            case '\r': return '\\r';
            case '\t': return '\\t';
            case '\v': return '\\v';
            case '\f': return '\\f';
        }
        if (!/\p{L}|\p{M}|\p{N}|\p{P}|\p{S}|\p{Zs}/u.test(this.character)) {
            // Non-printable character, per https://en.wikipedia.org/wiki/Graphic_character#Unicode
            const codePoint = this.character.codePointAt(0);
            if (codePoint !== undefined && codePoint <= 31) {
                const hexCode = codePoint.toString(16);
                if (hexCode.length <= 2)
                    return '\\x' + hexCode.padStart(2, '0');
                if (hexCode.length <= 4)
                    return '\\u' + hexCode.padStart(4, '0');
                return '\\u{' + hexCode + '}';
            }
        }
        if (['.', '^', '$', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|', '\\'].includes(this.character)) {
            return '\\' + this.character;
        }
        if (this.character === '-' && emulateOptions.inCharacterClass) {
            return '\\-';
        }
        if (emulateOptions.ignoreCase) {
            const lowercase = this.character.toLowerCase();
            const uppercase = this.character.toUpperCase();
            if (lowercase !== uppercase) {
                const chars = lowercase + uppercase;
                if (emulateOptions.inCharacterClass)
                    return chars; // Don't duplicate the brackets
                return '[' + chars + ']';
            }
        }
        return this.character;
    }
    getOriginalString() {
        return this.originalString;
    }
}
class PcreBackreference {
    get isRelative() {
        return /^-\d+$/.test(this.patternRef);
    }
    get isNumbered() {
        return /^-?\d+$/.test(this.patternRef);
    }
    get number() {
        return this.isNumbered ? parseInt(this.patternRef) : null;
    }
    constructor(patternRef, originalString) {
        this.patternRef = patternRef;
        this.originalString = originalString;
    }
    toEcmaRegexString() {
        if (this.isNumbered) {
            return '\\' + this.patternRef;
        }
        else {
            return '\\k<' + this.patternRef + '>';
        }
    }
    getOriginalString() {
        return this.originalString;
    }
    makeAbsolute(lastGroupNumber) {
        if (this.isRelative) {
            const relativeIndex = parseInt(this.patternRef);
            this.patternRef = (lastGroupNumber + relativeIndex + 1).toString();
        }
    }
    reifyBackreference() {
        // Named and relative backreferences can't be reified
        // In order to reify a relative backreference, one has to make it absolute first
        if (!this.isNumbered || this.isRelative)
            return [this];
        let octalCode = '';
        for (const c of this.patternRef) {
            if (!/[0-7]/.test(c))
                break;
            octalCode += c;
        }
        let charCode = 0;
        if (octalCode.length > 0) {
            charCode = parseInt(octalCode, 8);
        }
        const reified = [
            new PcreCharacter(String.fromCodePoint(charCode), '\\' + octalCode)
        ];
        if (octalCode.length < this.patternRef.length) {
            const rest = this.patternRef.slice(octalCode.length);
            for (const c of rest) {
                reified.push(new PcreCharacter(c, c));
            }
        }
        return reified;
    }
}
class PcreInternalOption {
    constructor(originalString) {
        this.originalString = originalString;
        this.options = [];
        // Strip (? and )
        const optionString = originalString.slice(2, -1);
        let negativeOptions = false;
        for (const option of optionString) {
            if (option === '-') {
                negativeOptions = true;
                continue;
            }
            if (negativeOptions) {
                this.options.push('-' + option);
            }
            else {
                this.options.push(option);
            }
        }
    }
    toEcmaRegexString() {
        return '';
    }
    getOriginalString() {
        return this.originalString;
    }
}


/***/ }),
/* 15 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValueComparer: () => (/* binding */ ValueComparer)
/* harmony export */ });
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Value_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);


/**
 * Provides methods for comparing values.
 */
class ValueComparer {
    /**
     * Checks if the values are strictly equal.
     * Strict equality requires the data types and values to be
     * exactly the same.
     */
    static isStrictlyEqualTo(a, b) {
        const areEqual = ValueComparer.areEqual(a, b, true);
        return ValueComparer.boolOrUndefined(areEqual);
    }
    /**
     * Checks if the values are not strictly equal.
     */
    static isStrictlyInequalTo(a, b) {
        const areEqual = ValueComparer.areEqual(a, b, true);
        return ValueComparer.boolOrUndefined((areEqual === undefined) ? undefined : !areEqual);
    }
    /**
     * Checks if the values are loosely equal.
     * Loose equality allows for different data types to be equal
     */
    static isLooselyEqualTo(a, b) {
        const areEqual = ValueComparer.areEqual(a, b, false);
        return ValueComparer.boolOrUndefined(areEqual);
    }
    /**
     * Checks if the values are not loosely equal.
     */
    static isLooselyInequalTo(a, b) {
        const areEqual = ValueComparer.areEqual(a, b, false);
        return ValueComparer.boolOrUndefined((areEqual === undefined) ? undefined : !areEqual);
    }
    /**
     * Checks if the first value is less than the second.
     */
    static isLessThan(a, b) {
        const compareResult = ValueComparer.compare(a, b);
        if (compareResult === ComparisonResult.Undefined)
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean, compareResult == ComparisonResult.LessThan);
    }
    /**
     * Checks if the first value is less than or equal to the second.
     */
    static isLessThanOrEqualTo(a, b) {
        const compareResult = ValueComparer.compare(a, b);
        if (compareResult === ComparisonResult.Undefined)
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean, compareResult != ComparisonResult.GreaterThan);
    }
    /**
     * Checks if the first value is greater than the second.
     */
    static isGreaterThan(a, b) {
        const compareResult = ValueComparer.compare(a, b);
        if (compareResult === ComparisonResult.Undefined)
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean, compareResult == ComparisonResult.GreaterThan);
    }
    /**
     * Checks if the first value is greater than or equal to the second.
     */
    static isGreaterThanOrEqualTo(a, b) {
        const compareResult = ValueComparer.compare(a, b);
        if (compareResult === ComparisonResult.Undefined)
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean, compareResult != ComparisonResult.LessThan);
    }
    /**
     * Checks if the values are equal.
     * @param strict Pass true for strict equality check.
     */
    static areEqual(a, b, strict = false) {
        if (a.isUndefined || b.isUndefined) {
            // Original implementation does not allow for undefined values - errors are raised instead
            // and the execution in stopped. We want to continue so that comparison to undefined has to be
            // implemented. Since two undefined values can be equal or not and the same is true for defined
            // and undefined, we just return undefined here.
            return undefined;
        }
        else if (a.dataType !== _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array && b.dataType !== _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array) {
            // Scalar types are simply compared by value
            const typesMatch = a.dataType === b.dataType || !strict;
            return typesMatch && a.asString().value === b.asString().value;
        }
        else if (a.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array && b.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array) {
            // Arrays are compared elementwise
            const data1 = a.value;
            const data2 = b.value;
            if (data1.length !== data2.length) {
                return false;
            }
            for (let i = 0; i < data1.length; i++) {
                if (!ValueComparer.areEqual(data1[i], data2[i], strict)) {
                    return false;
                }
            }
            return true;
        }
        else {
            // Trying to compare an array to something else
            if (strict) {
                return false;
            }
            if (a.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array && a.value.length === 0) {
                return (b.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean && !b.isTruthy()) ||
                    b.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Null;
            }
            else if (b.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array && b.value.length === 0) {
                return (a.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean && !a.isTruthy()) ||
                    a.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Null;
            }
            else {
                return false;
            }
        }
    }
    /** Performs a numerical or textual comparison of the values. */
    static compare(a, b) {
        if (a.isUndefined || b.isUndefined) {
            return ComparisonResult.Undefined;
        }
        const value1 = a.asString().value;
        const value2 = b.asString().value;
        // See https://www.php.net/manual/en/language.types.numeric-strings.php
        const isNumeric = (value) => /^\s*[+-]?(\d+\.?\d*|\.\d+)(E[+-]?\d+)?\s*$/i.test(value);
        // If both are numeric, compare numerically,
        // otherwise compare as strings
        if (isNumeric(value1) && isNumeric(value2)) {
            const number1 = parseFloat(value1);
            const number2 = parseFloat(value2);
            if (number1 < number2) {
                return ComparisonResult.LessThan;
            }
            else if (number1 > number2) {
                return ComparisonResult.GreaterThan;
            }
            else {
                return ComparisonResult.Equal;
            }
        }
        else {
            if (value1 < value2) {
                return ComparisonResult.LessThan;
            }
            else if (value1 > value2) {
                return ComparisonResult.GreaterThan;
            }
            else {
                return ComparisonResult.Equal;
            }
        }
    }
    static boolOrUndefined(value) {
        if (value === undefined) {
            return _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value.Undefined;
        }
        else {
            return new _Value_js__WEBPACK_IMPORTED_MODULE_1__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Boolean, value);
        }
    }
}
var ComparisonResult;
(function (ComparisonResult) {
    ComparisonResult[ComparisonResult["LessThan"] = -1] = "LessThan";
    ComparisonResult[ComparisonResult["Equal"] = 0] = "Equal";
    ComparisonResult[ComparisonResult["GreaterThan"] = 1] = "GreaterThan";
    ComparisonResult[ComparisonResult["Undefined"] = 1000] = "Undefined";
})(ComparisonResult || (ComparisonResult = {}));


/***/ }),
/* 16 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocalFunctionExecutor: () => (/* binding */ LocalFunctionExecutor)
/* harmony export */ });
/* harmony import */ var _AbuseFilterFunctions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);

/**
 * Function executor that looks a function up in the local function registry
 * and executes it.
 *
 * Uses functions defined in the AbuseFilterFunctions class.
 */
class LocalFunctionExecutor {
    async executeFunction(functionName, context, args) {
        const func = _AbuseFilterFunctions_js__WEBPACK_IMPORTED_MODULE_0__.AbuseFilterFunctions.getFunction(functionName);
        if (func === undefined) {
            throw new Error(`Function ${functionName} is unknown or cannot be executed locally`);
        }
        return func(context, args);
    }
}


/***/ }),
/* 17 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbuseFilterFunctions: () => (/* binding */ AbuseFilterFunctions)
/* harmony export */ });
/* harmony import */ var _value_Value_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _utils_IPUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18);
/* harmony import */ var _utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
/* harmony import */ var _value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12);
/* harmony import */ var _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(15);






/**
 * A collection of the functions available in the AbuseFilter upstream.
 */
class AbuseFilterFunctions {
    /** Returns a function by its name */
    static getFunction(name) {
        return AbuseFilterFunctions.functions.get(name);
    }
    /** Converts the input text to the lowercase */
    static async lcase(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'lcase');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, args[0].asString().value.toLowerCase());
    }
    /** Converts the input text to the uppercase */
    static async ucase(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'ucase');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, args[0].asString().value.toUpperCase());
    }
    /** Returns the length of the input text or number of elements in an array */
    static async lengthFunc(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'length');
        const input = args[0];
        if (input.isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        if (input.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array) {
            return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, input.value.length);
        }
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, input.asString().value.length);
    }
    /** Converts the input to a string */
    static async string(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'string');
        return args[0].asString();
    }
    /** Converts the input to an integer */
    static async int(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'int');
        return args[0].asInt();
    }
    /** Converts the input to a float */
    static async float(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'float');
        return args[0].asFloat();
    }
    /** Converts the input to a boolean */
    static async bool(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'bool');
        return args[0].asBoolean();
    }
    /** Normalizes the input string using multiple AbuseFilter functions */
    static async norm(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'norm');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        let output = await AbuseFilterFunctions.normalizeConfusibleCharacters(args[0].asString().value);
        output = AbuseFilterFunctions.removeRepeatingCharacters(output);
        output = AbuseFilterFunctions.removeSpecialCharacters(output);
        output = AbuseFilterFunctions.removeWhitespaces(output);
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, output);
    }
    /** Normalizes the input string, replacing confusible characters by a class representant */
    static async ccnorm(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'ccnorm');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const normalized = await AbuseFilterFunctions.normalizeConfusibleCharacters(args[0].asString().value);
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, normalized);
    }
    /** Checks if the first string contains any of the subsequent ones. All arguments are cc-normalized */
    static async ccnorm_contains_any(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'ccnorm_contains_any');
        const input = args[0];
        if (input.isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const normalizedInput = await AbuseFilterFunctions.normalizeConfusibleCharacters(input.asString().value);
        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            if (args[i].isUndefined) {
                hasUndefined = true;
                continue;
            }
            const normalizedArg = await AbuseFilterFunctions.normalizeConfusibleCharacters(args[i].asString().value);
            const contains = normalizedInput.includes(normalizedArg);
            if (contains) {
                return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.True;
            }
        }
        return !hasUndefined ? _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.False : _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
    }
    /** Checks if the first string contains all of the subsequent ones. All arguments are cc-normalized */
    static async ccnorm_contains_all(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'ccnorm_contains_all');
        const input = args[0];
        if (input.isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const normalizedInput = await AbuseFilterFunctions.normalizeConfusibleCharacters(input.asString().value);
        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            if (args[i].isUndefined) {
                hasUndefined = true;
                continue;
            }
            const normalizedArg = await AbuseFilterFunctions.normalizeConfusibleCharacters(args[i].asString().value);
            const contains = normalizedInput.includes(normalizedArg);
            if (!contains) {
                return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.False;
            }
        }
        return !hasUndefined ? _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.True : _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
    }
    /** Returns the number of non-alphanumeric characters divided by the total number of characters in the argument */
    static async specialratio(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'specialratio');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const input = args[0].asString().value;
        if (input.length === 0) {
            return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Float, 0);
        }
        const inputNoSpecials = AbuseFilterFunctions.removeSpecialCharacters(input);
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Float, 1 - (inputNoSpecials.length / input.length));
    }
    /** Removes all non-alphanumeric characters from the input */
    static async rmspecials(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rmspecials');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, AbuseFilterFunctions.removeSpecialCharacters(args[0].asString().value));
    }
    /** Removes repeating characters from the input */
    static async rmdoubles(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rmdoubles');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, AbuseFilterFunctions.removeRepeatingCharacters(args[0].asString().value));
    }
    /** Removes whitespace characters from the input */
    static async rmwhitespace(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rmwhitespace');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, AbuseFilterFunctions.removeWhitespaces(args[0].asString().value));
    }
    /**
     * Returns the number of occurrences of the first string in the second one.
     * If a single argument is given, it's split by commas and the number of elements is returned
     */
    static async count(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, [1, 2], 'count');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const needle = args[0].asString().value;
        if (args.length === 1) {
            if (args[0].dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array) {
                return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, args[0].value.length);
            }
            return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, needle.split(',').length);
        }
        if (needle.length === 0) {
            return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, 0);
        }
        if (args[1].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const haystack = args[1].asString().value;
        let count = 0;
        let index = 0;
        while ((index = haystack.indexOf(needle, index)) !== -1) {
            index += needle.length; // So that "aa" is contained once in "aaa"
            count++;
        }
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, count);
    }
    /**
     * Returns the number of occurrences of the pattern in the second string.
     * If a single argument is given, it's split by commas and the number of elements is returned
     */
    static async rcount(context, args) {
        var _a;
        AbuseFilterFunctions.assertArgumentCount(args, [1, 2], 'rcount');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const pattern = args[0].asString().value;
        if (args.length === 1) {
            return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, pattern.split(',').length);
        }
        if (args[1].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const input = args[1].asString().value;
        const regex = _utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_3__.RegexUtils.toEcmaRegex(pattern, { g: true, u: true });
        const matches = input.match(regex);
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, (_a = matches === null || matches === void 0 ? void 0 : matches.length) !== null && _a !== void 0 ? _a : 0);
    }
    /**
     * Returns an array of all matches of the pattern in the input string.
     * If the pattern is not found, an empty array is returned.
     */
    static async get_matches(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 2, 'get_matches');
        if (args[0].isUndefined || args[1].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const pattern = args[0].asString().value;
        const input = args[1].asString().value;
        const regex = _utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_3__.RegexUtils.parse(pattern);
        const nativeRegex = _utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_3__.RegexUtils.toEcmaRegex(regex, { u: true });
        let matches = input.match(nativeRegex);
        matches !== null && matches !== void 0 ? matches : (matches = Array(1 + regex.countContainedCapturingGroups()).fill(undefined));
        // Now we need to convert the array of strings to an array of Values
        // However, if a group did not match, it will be `undefined` in the array and we replace it into false
        const matchesValues = matches.map(m => m !== undefined ? new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, m) : _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.False);
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array, matchesValues);
    }
    /** Checks if the IP address is in the specified range */
    static async ip_in_range(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 2, 'ip_in_range');
        return AbuseFilterFunctions.ip_in_ranges(context, args);
    }
    /** Checks if the IP address is in any of the specified ranges */
    static async ip_in_ranges(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'ip_in_ranges');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        // We want to silence errors from mismatched IP versions being compared
        // and treat such a case as an ordinary "not in range"
        const ip = args[0].asString().value;
        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            if (args[i].isUndefined) {
                hasUndefined = true;
                continue;
            }
            try {
                const range = args[i].asString().value;
                if (_utils_IPUtils_js__WEBPACK_IMPORTED_MODULE_2__.IPUtils.isInRange(ip, range)) {
                    return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.True;
                }
            }
            catch (e) {
                // Ignore, go to the next range
            }
        }
        return !hasUndefined ? _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.False : _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
    }
    /** Checks if the first string contains any of the subsequent ones */
    static async contains_any(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'contains_any');
        const input = args[0];
        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            const contains = _value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_4__.ValueStringOperations.contains(input, args[i]);
            if (contains.isUndefined) {
                hasUndefined = true;
            }
            else if (contains.isTruthy()) {
                return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.True;
            }
        }
        return !hasUndefined ? _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.False : _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
    }
    /** Checks if the first string contains all of the subsequent ones */
    static async contains_all(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'contains_all');
        const input = args[0];
        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            const contains = _value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_4__.ValueStringOperations.contains(input, args[i]);
            if (contains.isUndefined) {
                hasUndefined = true;
            }
            else if (!contains.isTruthy()) {
                return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.False;
            }
        }
        return !hasUndefined ? _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.True : _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
    }
    /** Checks if the first element is equal to any of the subsequent ones */
    static async equals_to_any(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, [2, Infinity], 'equals_to_any');
        const input = args[0];
        let hasUndefined = false;
        for (let i = 1; i < args.length; i++) {
            const areEqual = _value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_5__.ValueComparer.isStrictlyEqualTo(input, args[i]);
            if (areEqual.isUndefined) {
                hasUndefined = true;
            }
            else if (areEqual.isTruthy()) {
                return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.True;
            }
        }
        return !hasUndefined ? _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.False : _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
    }
    /** Returns a substring of the input string */
    static async substr(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, [2, 3], 'substr');
        if (args[0].isUndefined || args[1].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const input = args[0].asString().value;
        const start = args[1].asInt().value;
        if (args.length === 2) {
            return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, input.substring(start));
        }
        else {
            if (args[2].isUndefined)
                return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
            const length = args[2].asInt().value;
            const end = Math.min(start + length, input.length);
            return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, input.substring(start, end));
        }
    }
    /** Returns the position of the first occurrence of the pattern in the input string */
    static async strpos(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, [2, 3], 'strpos');
        if (args[0].isUndefined || args[1].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const input = args[0].asString().value;
        const pattern = args[1].asString().value;
        let offset = 0;
        if (args.length === 3) {
            if (args[2].isUndefined)
                return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
            offset = args[2].asInt().value;
        }
        if (pattern.length === 0) {
            return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, -1);
        }
        if (offset >= input.length) {
            return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, -1);
        }
        const index = input.indexOf(pattern, offset);
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer, index);
    }
    /** Replaces all occurrences of the pattern in the input string with the replacement */
    static async str_replace(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 3, 'str_replace');
        if (args.some(v => v.isUndefined))
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const input = args[0].asString().value;
        const pattern = args[1].asString().value;
        const replacement = args[2].asString().value;
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, input.replaceAll(pattern, replacement));
    }
    /** Replaces all occurrences of the regex pattern in the input string with the replacement */
    static async str_replace_regexp(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 3, 'str_replace_regexp');
        if (args.some(v => v.isUndefined))
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const input = args[0].asString().value;
        const pattern = args[1].asString().value;
        const replacement = args[2].asString().value;
        const regex = _utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_3__.RegexUtils.toEcmaRegex(pattern, { g: true, u: true });
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, input.replace(regex, replacement));
    }
    /** Escapes the special characters in the input string */
    static async rescape(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'rescape');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const escaped = _utils_regex_RegexUtils_js__WEBPACK_IMPORTED_MODULE_3__.RegexUtils.escape(args[0].asString().value);
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, escaped);
    }
    /** Sets the variable in the context */
    static async set(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 2, 'set');
        const value = args[1];
        if (!args[0].isUndefined) {
            const variableName = args[0].asString().value;
            context.setVariable(variableName, value);
        }
        return value;
    }
    /** Sanitizes the input string */
    static async sanitize(context, args) {
        AbuseFilterFunctions.assertArgumentCount(args, 1, 'sanitize');
        if (args[0].isUndefined)
            return _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
        const input = args[0].asString().value;
        // Replicate PHP html_entity_decode() behavior
        const sanitized = input.replace(/&(#\d+|#x[0-9a-f]+|quot|amp|lt|gt);/gi, function (match, charCodeRaw) {
            switch (charCodeRaw) {
                case 'quot': return '"';
                case 'amp': return '&';
                case 'lt': return '<';
                case 'gt': return '>';
            }
            let charCode;
            if (charCodeRaw.startsWith('#x')) {
                charCode = parseInt(charCodeRaw.slice(2), 16);
            }
            else {
                charCode = parseInt(charCodeRaw.slice(1), 10);
            }
            return String.fromCharCode(charCode);
        });
        return new _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, sanitized);
    }
    //! Utility functions for other functions
    static removeSpecialCharacters(s) {
        return s.replace(/[^\p{L}\p{N}\s]/ug, '');
    }
    static removeRepeatingCharacters(s) {
        return s.replace(/(.)\1+/ug, '$1');
    }
    static removeWhitespaces(s) {
        return s.replace(/\s+/ug, '');
    }
    static async normalizeConfusibleCharacters(s) {
        const ccnormProvider = AbuseFilterFunctions.ccnormProvider;
        if (ccnormProvider === undefined) {
            throw new Error('CCNormProvider is not specified. Please set AbuseFilterFunctions.ccnormProvider before using ccnorm functions.');
        }
        await ccnormProvider.initializeIfNeeded();
        return ccnormProvider.ccnorm(s);
    }
    //! Utility functions for checking the argument count
    /**
     * Ensures that the provided number of arguments matches the expected count.
     * @param args The arguments actually provided
     * @param expectedCount An expected number of arguments, either a single number or a range [min, max]
     * @param functionName The function name, used for error messages
     */
    static assertArgumentCount(args, expectedCount, functionName) {
        const providedCount = args.length;
        if (typeof expectedCount === 'number') {
            expectedCount = [expectedCount, expectedCount];
        }
        if (providedCount < expectedCount[0] || providedCount > expectedCount[1]) {
            throw new Error(`Function ${functionName} expects ${expectedCount[0]} to ${expectedCount[1]} arguments, but got ${providedCount}`);
        }
    }
}
/** A map of all AbuseFilter functions */
AbuseFilterFunctions.functions = new Map([
    ['lcase', AbuseFilterFunctions.lcase],
    ['ucase', AbuseFilterFunctions.ucase],
    ['length', AbuseFilterFunctions.lengthFunc],
    ['string', AbuseFilterFunctions.string],
    ['int', AbuseFilterFunctions.int],
    ['float', AbuseFilterFunctions.float],
    ['bool', AbuseFilterFunctions.bool],
    ['norm', AbuseFilterFunctions.norm],
    ['ccnorm', AbuseFilterFunctions.ccnorm],
    ['ccnorm_contains_any', AbuseFilterFunctions.ccnorm_contains_any],
    ['ccnorm_contains_all', AbuseFilterFunctions.ccnorm_contains_all],
    ['specialratio', AbuseFilterFunctions.specialratio],
    ['rmspecials', AbuseFilterFunctions.rmspecials],
    ['rmdoubles', AbuseFilterFunctions.rmdoubles],
    ['rmwhitespace', AbuseFilterFunctions.rmwhitespace],
    ['count', AbuseFilterFunctions.count],
    ['rcount', AbuseFilterFunctions.rcount],
    ['get_matches', AbuseFilterFunctions.get_matches],
    ['ip_in_range', AbuseFilterFunctions.ip_in_range],
    ['ip_in_ranges', AbuseFilterFunctions.ip_in_ranges],
    ['contains_any', AbuseFilterFunctions.contains_any],
    ['contains_all', AbuseFilterFunctions.contains_all],
    ['equals_to_any', AbuseFilterFunctions.equals_to_any],
    ['substr', AbuseFilterFunctions.substr],
    ['strlen', AbuseFilterFunctions.lengthFunc],
    ['strpos', AbuseFilterFunctions.strpos],
    ['str_replace', AbuseFilterFunctions.str_replace],
    ['str_replace_regexp', AbuseFilterFunctions.str_replace_regexp],
    ['rescape', AbuseFilterFunctions.rescape],
    ['set', AbuseFilterFunctions.set],
    ['set_var', AbuseFilterFunctions.set],
    ['sanitize', AbuseFilterFunctions.sanitize],
]);


/***/ }),
/* 18 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IPUtils: () => (/* binding */ IPUtils)
/* harmony export */ });
/* harmony import */ var _IPAddress_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);

/**
 * Provides operations on IP addresses and ranges.
 */
class IPUtils {
    static isIPv4(ip) {
        return _IPAddress_js__WEBPACK_IMPORTED_MODULE_0__.IPAddress.fromV4String(ip) !== null;
    }
    static isIPv6(ip) {
        return _IPAddress_js__WEBPACK_IMPORTED_MODULE_0__.IPAddress.fromV6String(ip) !== null;
    }
    /**
     * Checks if the IP address is in the given range.
     *
     * The range can be specified in the following ways:
     * - CIDR notation (e.g. 10.0.0.0/8)
     * - IP range (e.g. 10.0.0.3 - 10.0.2.5)
     * - single IP address (e.g. 10.1.2.3)
     *
     * @param ip The IP address to check
     * @param range The range to check against
     */
    static isInRange(ip, range) {
        const ipAddr = _IPAddress_js__WEBPACK_IMPORTED_MODULE_0__.IPAddress.fromString(ip);
        if (ipAddr === null)
            return false;
        if (range.includes('/')) {
            const [start, end] = IPUtils.getCidrRangeBounds(range);
            return ipAddr.compare(start) >= 0 && ipAddr.compare(end) <= 0;
        }
        if (range.includes('-')) {
            const [start, end] = IPUtils.getHyphenRangeBounds(range);
            return ipAddr.compare(start) >= 0 && ipAddr.compare(end) <= 0;
        }
        const single = _IPAddress_js__WEBPACK_IMPORTED_MODULE_0__.IPAddress.fromString(range);
        if (single === null)
            return false;
        return ipAddr.compare(single) === 0;
    }
    /**
     * Returns the start and end IP addresses of the given CIDR range.
     * @param cidr The CIDR range
     */
    static getCidrRangeBounds(cidr) {
        const parts = cidr.split('/');
        if (parts.length !== 2)
            throw new Error('Invalid CIDR notation');
        const ip = _IPAddress_js__WEBPACK_IMPORTED_MODULE_0__.IPAddress.fromString(parts[0]);
        if (ip === null)
            throw new Error('Invalid IP address');
        const mask = parseInt(parts[1]);
        if (isNaN(mask) || mask < 0)
            throw new Error('Invalid CIDR mask');
        if (ip.type === 'IPv4' && mask > 32)
            throw new Error('Invalid CIDR mask for IPv4 address');
        if (ip.type === 'IPv6' && mask > 128)
            throw new Error('Invalid CIDR mask for IPv6 address');
        const partMax = ip.type === 'IPv4' ? 0xff : 0xffff;
        const partSize = ip.type === 'IPv4' ? 8 : 16;
        const startParts = [];
        const endParts = [];
        for (let i = 0; i < ip.parts.length; i++) {
            const part = ip.parts[i];
            // If we are in a part that is fully covered by the mask, we can just copy the source
            if ((i + 1) * partSize <= mask) {
                startParts.push(part);
                endParts.push(part);
                continue;
            }
            // If we are in a part that is not covered by the mask, we need to set the start to 0 and the end to the maximum value
            if (i * partSize >= mask) {
                startParts.push(0);
                endParts.push(partMax);
                continue;
            }
            // Else, this part is partially covered by the mask
            const maskBits = mask - i * partSize;
            const rangeBits = partSize - maskBits;
            const partMask = (partMax << rangeBits) & partMax;
            const startPart = part & partMask;
            const endPart = part | (partMask ^ partMax);
            startParts.push(startPart);
            endParts.push(endPart);
        }
        return [new _IPAddress_js__WEBPACK_IMPORTED_MODULE_0__.IPAddress(ip.type, startParts), new _IPAddress_js__WEBPACK_IMPORTED_MODULE_0__.IPAddress(ip.type, endParts)];
    }
    /**
     * Returns the start and end IP addresses of the given range in a hyphen notation.
     * @param range The IP range
     */
    static getHyphenRangeBounds(range) {
        const parts = range.split('-');
        if (parts.length !== 2)
            throw new Error('Invalid IP range');
        const start = _IPAddress_js__WEBPACK_IMPORTED_MODULE_0__.IPAddress.fromString(parts[0].trim());
        if (start === null)
            throw new Error('Invalid start IP address');
        const end = _IPAddress_js__WEBPACK_IMPORTED_MODULE_0__.IPAddress.fromString(parts[1].trim());
        if (end === null)
            throw new Error('Invalid end IP address');
        if (start.type !== end.type)
            throw new Error('IP address types do not match');
        return [start, end];
    }
}


/***/ }),
/* 19 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IPAddress: () => (/* binding */ IPAddress)
/* harmony export */ });
/**
 * Represents an IP address.
 */
class IPAddress {
    constructor(type, parts) {
        this.type = type;
        this.parts = parts;
        if (type === 'IPv4') {
            if (parts.length !== 4)
                throw new Error('Invalid number of parts for IPv4 address');
            for (const part of parts) {
                if (part < 0 || part > 255)
                    throw new Error('Invalid part for IPv4 address');
            }
        }
        else {
            if (parts.length !== 8)
                throw new Error('Invalid number of parts for IPv6 address');
            for (const part of parts) {
                if (part < 0 || part > 65535)
                    throw new Error('Invalid part for IPv6 address');
            }
        }
    }
    /**
     * Compares this IP address to another one.
     * @param other The other IP address to compare to
     * @returns 0 if addresses are equal, -1 if this address is smaller, 1 if this address is larger
     */
    compare(other) {
        if (this.type !== other.type)
            throw new Error('Cannot compare different IP address types');
        for (let i = 0; i < this.parts.length; i++) {
            if (this.parts[i] < other.parts[i])
                return -1;
            if (this.parts[i] > other.parts[i])
                return 1;
        }
        return 0;
    }
    /**
     * Creates a new IPAddress object from a string. Returns null if the string is not a valid IP address.
     * @param ip The IP address string
     */
    static fromString(ip) {
        var _a;
        return (_a = IPAddress.fromV4String(ip)) !== null && _a !== void 0 ? _a : IPAddress.fromV6String(ip);
    }
    /**
     * Creates a new IPAddress object from a IPv4 string. Returns null if the string is not a valid IPv4 address.
     * @param ip The IP address string
     */
    static fromV4String(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4)
            return null;
        const partsNum = parts.map(part => parseInt(part));
        for (const num of partsNum) {
            if (isNaN(num) || num < 0 || num > 255)
                return null;
        }
        return new IPAddress('IPv4', partsNum);
    }
    /**
     * Creates a new IPAddress object from a IPv6 string. Returns null if the string is not a valid IPv6 address.
     * @param ip The IP address string
     */
    static fromV6String(ip) {
        if (ip.includes(':::'))
            return null;
        const doubleColons = (ip.match(/::/g) || []).length;
        if (doubleColons > 1)
            return null;
        const colonCount = (ip.match(/:/g) || []).length;
        if (colonCount > 7)
            return null;
        // Ensure that our IP has 7 colons, i.e. 8 parts
        // Some parts may be empty, they will be trated as zeros
        // 9 - colonCount: we're adding (7-colonCount) colons, but the double colon is removed
        const filled = ip.replace('::', ':'.repeat(9 - colonCount));
        const parts = filled.split(':').map(part => part === '' ? '0' : part);
        if (parts.length != 8)
            return null;
        const partsNum = parts.map(part => parseInt(part, 16));
        for (const num of partsNum) {
            if (isNaN(num) || num < 0 || num > 65535)
                return null;
        }
        return new IPAddress('IPv6', partsNum);
    }
}


/***/ }),
/* 20 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EvaluableNodeFactory: () => (/* binding */ EvaluableNodeFactory)
/* harmony export */ });
/* harmony import */ var _EvaluableTreeNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);

/**
 * Factory class that produces instances of EvaluableTreeNode.
 */
class EvaluableNodeFactory {
    createNode(type, identity, children) {
        return new _EvaluableTreeNode_js__WEBPACK_IMPORTED_MODULE_0__.EvaluableTreeNode(type, identity, children);
    }
}


/***/ }),
/* 21 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EvaluableTreeNode: () => (/* binding */ EvaluableTreeNode)
/* harmony export */ });
/* harmony import */ var _value_Value_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

/**
 * Represents a node in the abstract syntax tree that can store
 * values and errors from evaluations. The node can be evaluated
 * more than once with different contexts; it can store multiple
 * sets of values and errors.
 */
class EvaluableTreeNode {
    constructor(type, identity, children = []) {
        /** Holds all the values from evaluations of this node */
        this.valueByContext = new Map();
        this.onValueSetCallbacks = [];
        /** Holds all the errors from evaluations of this node */
        this.errorsByContext = new Map();
        this.onErrorCallbacks = [];
        this.type = type;
        this.identity = identity;
        this.children = children;
    }
    setValue(evaluationContext, value) {
        this.valueByContext.set(evaluationContext.rootContext, value);
        for (const callback of this.onValueSetCallbacks) {
            callback(this, evaluationContext);
        }
    }
    getValue(evaluationContext) {
        var _a;
        return (_a = this.valueByContext.get(evaluationContext.rootContext)) !== null && _a !== void 0 ? _a : _value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value.Undefined;
    }
    hasValue(evaluationContext) {
        return this.valueByContext.has(evaluationContext.rootContext);
    }
    getContextsWithValue() {
        return Array.from(this.valueByContext.keys());
    }
    addOnValueSetCallback(callback) {
        this.onValueSetCallbacks.push(callback);
    }
    setError(evaluationContext, error) {
        var _a;
        const errors = (_a = this.errorsByContext.get(evaluationContext)) !== null && _a !== void 0 ? _a : [];
        errors.push(error);
        this.errorsByContext.set(evaluationContext, errors);
        for (const callback of this.onErrorCallbacks) {
            callback(this, evaluationContext);
        }
    }
    getErrors(evaluationContext) {
        var _a;
        return (_a = this.errorsByContext.get(evaluationContext)) !== null && _a !== void 0 ? _a : [];
    }
    hasErrors(evaluationContext) {
        return this.errorsByContext.has(evaluationContext);
    }
    getContextsWithErrors() {
        return Array.from(this.errorsByContext.keys());
    }
    addOnErrorCallback(callback) {
        this.onErrorCallbacks.push(callback);
    }
}


/***/ }),
/* 22 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbuseFilterGUI: () => (/* binding */ AbuseFilterGUI)
/* harmony export */ });
/* harmony import */ var _treeViews_ViewFactory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);

class AbuseFilterGUI {
    constructor(wrapperElement, filters = []) {
        this.rootNodeView = null;
        this.filterState = {};
        this.lastDebouncedUpdate = 0;
        this.isUpdateScheduled = false;
        this.wrapperElement = wrapperElement;
        this.wrapperElement.classList.add('afa-tree-container');
        this.filters = filters;
        this.loadSavedFilterState();
    }
    /**
     * Renders the tree, representing the syntax of the given AbuseFilter
     * @param rootNode The root node of the syntax tree to render
     * @param viewFactory The factory to use to create views for the nodes
     */
    renderSyntaxTree(rootNode, viewFactory) {
        viewFactory !== null && viewFactory !== void 0 ? viewFactory : (viewFactory = new _treeViews_ViewFactory_js__WEBPACK_IMPORTED_MODULE_0__.ViewFactory());
        this.rootNodeView = viewFactory.createView(rootNode);
        const rootNodeElement = this.rootNodeView.render();
        if (rootNodeElement.tagName === 'DETAILS') {
            rootNodeElement.removeAttribute('open');
        }
        this.wrapperElement.textContent = '';
        const filterWrapper = document.createElement('div');
        filterWrapper.classList.add('afa-filter-wrapper');
        this.wrapperElement.appendChild(filterWrapper);
        this.displayExpandCollapseButton(filterWrapper);
        this.displayFilterCheckboxes(filterWrapper);
        for (const filter of this.filters) {
            filter.initialize(this.rootNodeView, () => this.updateFilteringDebounced());
        }
        this.updateFiltering();
        this.wrapperElement.appendChild(rootNodeElement);
    }
    displayExpandCollapseButton(wrapperElement) {
        const button = document.createElement('button');
        button.textContent = 'Expand/Collapse all';
        button.style.float = 'left';
        button.style.marginRight = '1em';
        button.addEventListener('click', () => {
            // If there are any collapsed, expand the tree
            // If there are none collapsed, collapse the tree
            const collapsedDetails = this.wrapperElement.querySelectorAll('details:not([open])');
            const shownCollapsedDetails = Array.from(collapsedDetails).filter(el => el.style.display !== 'none');
            const detailsTags = this.wrapperElement.querySelectorAll('details');
            if (shownCollapsedDetails.length > 0) {
                for (const details of detailsTags) {
                    details.setAttribute('open', '');
                }
            }
            else {
                for (const details of detailsTags) {
                    details.removeAttribute('open');
                }
            }
        });
        wrapperElement.prepend(button);
    }
    displayFilterCheckboxes(filterWrapper) {
        var _a;
        if (this.filters.length === 0)
            return;
        filterWrapper.append('Options: ');
        for (const filter of this.filters) {
            const filterKey = filter.constructor.name;
            const filterCheckbox = document.createElement('input');
            filterCheckbox.type = 'checkbox';
            filterCheckbox.checked = (_a = this.filterState[filterKey]) !== null && _a !== void 0 ? _a : false;
            filterCheckbox.addEventListener('change', () => {
                this.filterState[filterKey] = filterCheckbox.checked;
                this.updateFiltering();
                this.saveFilterState();
            });
            const filterLabel = document.createElement('label');
            filterLabel.textContent = filter.name;
            filterLabel.title = filter.description;
            filterLabel.prepend(filterCheckbox);
            filterWrapper.appendChild(filterLabel);
        }
    }
    /**
     * Loads the saved filter state from the local storage.
     * It does not change the state of checkboxes, only the internal state.
     */
    loadSavedFilterState() {
        try {
            const savedState = localStorage.getItem('afa-filter-state');
            if (savedState !== null) {
                this.filterState = JSON.parse(savedState);
            }
        }
        catch (e) {
            console.error('Failed to load saved filter state:', e);
            this.filterState = {};
        }
    }
    /**
     * Saves the current filter state to the local storage, so that
     * they could be reused on next page view.
     */
    saveFilterState() {
        localStorage.setItem('afa-filter-state', JSON.stringify(this.filterState));
    }
    /**
     * Applies the filters to the tree, but if the function was called in the
     * last 100ms, it will delay the update to prevent excessive re-rendering.
     */
    updateFilteringDebounced() {
        if (this.rootNodeView === null)
            return;
        const delay = 100;
        if (Date.now() - this.lastDebouncedUpdate >= delay) {
            this.isUpdateScheduled = false;
            this.updateFiltering();
            this.lastDebouncedUpdate = Date.now();
            return;
        }
        else if (!this.isUpdateScheduled) {
            this.isUpdateScheduled = true;
            setTimeout(() => this.updateFilteringDebounced(), delay);
        }
    }
    /**
     * Reapplies the filters to the tree, based on the currently selected filters
     */
    updateFiltering() {
        if (this.rootNodeView === null)
            return;
        const filtersToApply = this.filters.filter((filter) => this.filterState[filter.constructor.name]);
        this.resetFilters();
        for (const filter of filtersToApply) {
            filter.apply(this.rootNodeView);
        }
    }
    /**
     * Displays all nodes in the tree, that might have been hidden by filters
     */
    resetFilters() {
        const nodeQueue = [this.rootNodeView];
        while (nodeQueue.length > 0) {
            const node = nodeQueue.shift();
            for (const child of node.children) {
                nodeQueue.push(child);
            }
            node.show();
        }
    }
}


/***/ }),
/* 23 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewFactory: () => (/* binding */ ViewFactory)
/* harmony export */ });
/* harmony import */ var _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _value_ProcessedDataView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);
/* harmony import */ var _ArrayDefinitionNodeView_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);
/* harmony import */ var _AssignmentNodeView_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(28);
/* harmony import */ var _AtomNodeView_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(29);
/* harmony import */ var _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _FunctionNodeView_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(31);
/* harmony import */ var _IndexNodeView_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(32);
/* harmony import */ var _OperatorNodeView_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(33);









/**
 * A factory for creating views for nodes in the syntax tree.
 */
class ViewFactory {
    constructor() {
        this.dataViewFactories = [];
    }
    /**
     * Creates a view for the given node and all its children.
     * @param node The node to create a view for.
     */
    createView(node) {
        const childViews = [];
        for (const child of node.children) {
            childViews.push(this.createView(child));
        }
        return this.createViewWithChildren(node, childViews);
    }
    /**
     * Creates a view for the specific node and puts the children views in it.
     * @param node The node to create a view for.
     * @param childViews The already-created children views.
     */
    createViewWithChildren(node, childViews) {
        // Atoms don't use the dataView, so we can skip creating it
        if (node.type === _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Atom) {
            return new _AtomNodeView_js__WEBPACK_IMPORTED_MODULE_4__.AtomNodeView(node);
        }
        const dataView = this.createDataView(node);
        switch (node.type) {
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.ArrayDefinition:
                return new _ArrayDefinitionNodeView_js__WEBPACK_IMPORTED_MODULE_2__.ArrayDefinitionNodeView(node, childViews, dataView);
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Assignment:
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.IndexAssignment:
                return new _AssignmentNodeView_js__WEBPACK_IMPORTED_MODULE_3__.AssignmentNodeView(node, childViews, dataView);
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.ArrayIndexing:
                return new _IndexNodeView_js__WEBPACK_IMPORTED_MODULE_7__.IndexNodeView(node, childViews, dataView);
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Operator:
                return new _OperatorNodeView_js__WEBPACK_IMPORTED_MODULE_8__.OperatorNodeView(node, childViews, dataView);
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.FunctionCall:
                return new _FunctionNodeView_js__WEBPACK_IMPORTED_MODULE_6__.FunctionNodeView(node, childViews, dataView);
            default:
                return new _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_5__.BlockNodeView(node, childViews, dataView);
        }
    }
    /**
     * Adds a factory for creating data views for nodes.
     * If there are multiple factories specified, multiple
     * data views will be added to nodes.
     * @param factory The factory to add.
     */
    addDataViewFactory(factory) {
        this.dataViewFactories.push(factory);
    }
    /**
     * Creates a data view for the given node.
     * @param node The node to create a data view for.
     */
    createDataView(node) {
        const dataView = new _value_ProcessedDataView_js__WEBPACK_IMPORTED_MODULE_1__.ProcessedDataView();
        for (const factory of this.dataViewFactories) {
            const view = factory(node);
            if (view !== null) {
                dataView.addView(view);
            }
        }
        return dataView;
    }
}


/***/ }),
/* 24 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProcessedDataView: () => (/* binding */ ProcessedDataView)
/* harmony export */ });
/**
 * A view for displaying all the data associated with a node.
 */
class ProcessedDataView {
    constructor() {
        this.element = document.createElement('span');
        this.element.classList.add('afa-data');
    }
    /**
     * Adds a new view to this one.
     * @param view The view to add to this view.
     */
    addView(view) {
        this.element.appendChild(view.render());
    }
    render() {
        return this.element;
    }
}


/***/ }),
/* 25 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArrayDefinitionNodeView: () => (/* binding */ ArrayDefinitionNodeView)
/* harmony export */ });
/* harmony import */ var _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26);

class ArrayDefinitionNodeView extends _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_0__.BlockNodeView {
    constructor() {
        super(...arguments);
        this.canInline = true;
    }
    renderAsInline() {
        const elements = this.children.map((child) => child.render());
        const element = document.createElement('span');
        element.appendChild(this.createTokenNode('['));
        for (let i = 0; i < elements.length; i++) {
            if (i > 0) {
                element.appendChild(this.createTokenNode(', '));
            }
            element.appendChild(elements[i]);
        }
        element.appendChild(this.createTokenNode(']'));
        return element;
    }
    renderBlockHeader() {
        const element = document.createElement('span');
        element.textContent = 'Array definition';
        return element;
    }
    getBlockHints() {
        return (index) => index.toString();
    }
    isInline() {
        if (!super.isInline())
            return false;
        if (this.children.length > 8)
            return false;
        let totalLength = 0;
        for (const child of this.children) {
            totalLength += child.render().textContent.length;
        }
        return totalLength < 100;
    }
}


/***/ }),
/* 26 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BlockNodeView: () => (/* binding */ BlockNodeView)
/* harmony export */ });
/* harmony import */ var _BaseNodeView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27);

/**
 * Base class for views of nodes with children.
 */
class BlockNodeView extends _BaseNodeView_js__WEBPACK_IMPORTED_MODULE_0__.BaseNodeView {
    constructor(node, childViews, dataView) {
        super(node, childViews);
        this.canInline = false;
        this.element = null;
        this.dataView = dataView;
    }
    render() {
        if (this.element === null) {
            this.element = this.isInline() ? this.renderAsInline() : this.renderAsBlock();
        }
        return this.element;
    }
    isInline() {
        if (!this.canInline)
            return false;
        return super.isInline();
    }
    /** Renders the node in inline mode */
    renderAsInline() {
        // By default it'll render as block
        return this.renderAsBlock();
    }
    /** Renders the node in block mode */
    renderAsBlock() {
        const element = document.createElement('details');
        element.setAttribute('open', '');
        const summary = document.createElement('summary');
        element.appendChild(summary);
        const header = this.renderBlockHeader();
        header.classList.add('afa-block-header');
        summary.appendChild(header);
        summary.append(' ');
        summary.appendChild(this.dataView.render());
        if (this.children.length > 0) {
            const childrenListElement = document.createElement('ul');
            element.appendChild(childrenListElement);
            const hints = this.getBlockHints();
            for (let i = 0; i < this.children.length; i++) {
                const childElement = document.createElement('li');
                let hint = null;
                if (typeof hints === 'function') {
                    hint = hints(i);
                }
                else if (hints[i]) {
                    hint = hints[i];
                }
                const childView = this.children[i];
                const renderedChild = childView.render();
                if (hint !== null) {
                    const hintView = this.renderHintView(hint);
                    let hintRoot = childElement;
                    if (renderedChild.tagName === 'DETAILS') {
                        const summaryElements = renderedChild.getElementsByTagName('summary');
                        if (summaryElements.length > 0) {
                            hintRoot = summaryElements[0];
                        }
                    }
                    hintRoot.prepend(hintView, ' ');
                }
                childElement.appendChild(renderedChild);
                childrenListElement.appendChild(childElement);
            }
        }
        return element;
    }
    /** Prepares an element for the block header */
    renderBlockHeader() {
        const header = document.createElement('span');
        header.append(`${this.treeNode.type}(${this.treeNode.identity.type} ${this.treeNode.identity.value})`);
        return header;
    }
    /**
     * Returns hints to be used when displaying this node.
     * Hints can be either specified as an array or there can
     * be a generator function returned.
     */
    getBlockHints() {
        return [];
    }
    /**
     * Renders an element for the hint.
     * @param hint The hint to render.
     */
    renderHintView(hint) {
        const element = document.createElement('span');
        element.classList.add('afa-hint');
        element.append(hint);
        return element;
    }
    /**
     * Renders the token as an element.
     * @param token The token string to display
     * @param classes Additional CSS classes to apply
     */
    createTokenNode(token, classes = []) {
        const element = document.createElement('span');
        element.classList.add('afa-token');
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        element.append(token);
        return element;
    }
}


/***/ }),
/* 27 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseNodeView: () => (/* binding */ BaseNodeView)
/* harmony export */ });
/**
 * Base class for views of nodes with children.
 */
class BaseNodeView {
    get isHidden() {
        const element = this.render();
        return element.style.display === 'none';
    }
    constructor(node, childViews) {
        this.treeNode = node;
        this.children = childViews;
    }
    isInline() {
        return this.children.every(child => child.isInline() && !child.stopsInlining());
    }
    stopsInlining() {
        return false;
    }
    show() {
        const element = this.render();
        element.style.display = '';
    }
    hide() {
        const element = this.render();
        element.style.display = 'none';
    }
}


/***/ }),
/* 28 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssignmentNodeView: () => (/* binding */ AssignmentNodeView)
/* harmony export */ });
/* harmony import */ var _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(26);


class AssignmentNodeView extends _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_1__.BlockNodeView {
    constructor(node, childViews, dataView) {
        // For index assignment, change the order to make it more natural
        if (node.type === _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.IndexAssignment && childViews.length === 3) {
            childViews = [childViews[0], childViews[2], childViews[1]];
        }
        super(node, childViews, dataView);
        this.canInline = true;
    }
    renderAsInline() {
        const isIndexAssignment = this.treeNode.type === _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.IndexAssignment;
        const isArrayAppend = isIndexAssignment && this.children.length === 2;
        const isArrayAssign = isIndexAssignment && this.children.length === 3;
        const element = document.createElement('span');
        element.appendChild(this.children[0].render());
        if (isArrayAppend) {
            element.appendChild(this.createTokenNode('[]'));
        }
        else if (isArrayAssign) {
            element.appendChild(this.createTokenNode('['));
            element.appendChild(this.children[1].render());
            element.appendChild(this.createTokenNode(']'));
        }
        element.appendChild(this.createTokenNode(' := ', ['afa-operator']));
        element.appendChild(this.children[!isArrayAssign ? 1 : 2].render());
        return element;
    }
    renderBlockHeader() {
        const element = document.createElement('span');
        const isArrayAssign = this.treeNode.type === _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.IndexAssignment;
        if (isArrayAssign) {
            if (this.children.length === 3) {
                element.append('Assignment to array index');
            }
            else {
                element.append('Append to array');
            }
        }
        else {
            element.append('Assignment');
        }
        return element;
    }
    getBlockHints() {
        switch (this.treeNode.type) {
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Assignment:
                return ['variable', 'value'];
            case _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.IndexAssignment:
                return this.children.length === 3 ?
                    ['array', 'index', 'value'] : ['array', 'value'];
            default:
                return [];
        }
    }
}


/***/ }),
/* 29 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AtomNodeView: () => (/* binding */ AtomNodeView)
/* harmony export */ });
/* harmony import */ var _value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30);
/* harmony import */ var _BaseNodeView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(27);


/**
 * A view for an atom node in the syntax tree.
 */
class AtomNodeView extends _BaseNodeView_js__WEBPACK_IMPORTED_MODULE_1__.BaseNodeView {
    constructor(treeNode) {
        super(treeNode, []);
        this.element = null;
    }
    render() {
        if (this.element === null) {
            this.element = _value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_0__.ValueFormatter.formatLiteral(this.treeNode.identity);
        }
        return this.element;
    }
    isInline() {
        return true;
    }
}


/***/ }),
/* 30 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValueFormatter: () => (/* binding */ ValueFormatter)
/* harmony export */ });
/* harmony import */ var _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);


class ValueFormatter {
    /**
     * Prepares a value to be displayed in the GUI. For some data types, a maximum length can be specified.
     * Values that are too long will be truncated an a button to expand the value will be shown.
     * @param value The value to pretty-print
     * @param maxLength The maximum length of the string to be displayed.
     */
    static formatValue(value, maxLength) {
        switch (value.dataType) {
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Undefined:
                return this.formatKeyword('undefined');
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Null:
                return this.formatKeyword('null');
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Boolean:
                return this.formatKeyword(value.isTruthy() ? 'true' : 'false');
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Integer:
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Float:
                return this.formatNumberLiteral(value.asString().value);
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String:
                return this.formatStringLiteral(value.value, maxLength);
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array:
                return this.processArrayValue(value);
        }
    }
    static formatLiteral(token) {
        switch (token.type) {
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Identifier: {
                const wrapper = this.makeWrapper('identifier');
                wrapper.textContent = token.value;
                return wrapper;
            }
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.StringLiteral:
                return ValueFormatter.formatStringLiteral(token.value);
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.IntLiteral:
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.FloatLiteral:
                return ValueFormatter.formatNumberLiteral(token.value);
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Keyword:
                return ValueFormatter.formatKeyword(token.value);
        }
        throw new Error('Unknown token type');
    }
    static makeWrapper(dataType) {
        const wrapper = document.createElement('span');
        wrapper.classList.add('afa-value', 'afa-value-' + dataType);
        return wrapper;
    }
    static formatKeyword(value) {
        const wrapper = this.makeWrapper('keyword');
        wrapper.textContent = value;
        if (value === 'true') {
            wrapper.classList.add('afa-value-bool', 'afa-value-true');
        }
        else if (value === 'false') {
            wrapper.classList.add('afa-value-bool', 'afa-value-false');
        }
        return wrapper;
    }
    static formatNumberLiteral(value) {
        const wrapper = this.makeWrapper('number');
        wrapper.textContent = value;
        return wrapper;
    }
    static formatStringLiteral(value, maxLength) {
        const wrapper = this.makeWrapper('string');
        const escapedValue = this.escapeString(value);
        if (maxLength !== undefined && value.length > maxLength) {
            wrapper.append('"');
            const truncatedValue = escapedValue.substring(0, maxLength);
            const contentTextNode = document.createTextNode(truncatedValue);
            wrapper.appendChild(contentTextNode);
            const expandButton = this.createInlayButton('»', () => {
                contentTextNode.textContent = escapedValue;
                expandButton.style.display = 'none';
                collapseButton.style.display = '';
            });
            expandButton.title = `Show the whole value (${escapedValue.length} characters)`;
            const collapseButton = this.createInlayButton('←', () => {
                contentTextNode.textContent = truncatedValue;
                expandButton.style.display = '';
                collapseButton.style.display = 'none';
            });
            collapseButton.style.display = 'none';
            collapseButton.title = 'Collapse the value';
            wrapper.appendChild(expandButton);
            wrapper.append('"');
            wrapper.appendChild(collapseButton);
        }
        else {
            wrapper.textContent = `"${escapedValue}"`;
        }
        return wrapper;
    }
    static processArrayValue(value) {
        const wrapper = this.makeWrapper(value.dataType);
        wrapper.appendChild(document.createTextNode('['));
        const array = value.value;
        for (let i = 0; i < array.length; i++) {
            if (i > 0) {
                wrapper.appendChild(document.createTextNode(', '));
            }
            wrapper.appendChild(this.formatValue(array[i]));
        }
        wrapper.appendChild(document.createTextNode(']'));
        return wrapper;
    }
    static createInlayButton(caption, clickHandler) {
        const button = document.createElement('button');
        button.classList.add('afa-value-inlay-button');
        button.textContent = caption;
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            clickHandler();
        });
        return button;
    }
    /** Escapes special characters in a string for display in double quotes */
    static escapeString(value) {
        return value
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
    }
}


/***/ }),
/* 31 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FunctionNodeView: () => (/* binding */ FunctionNodeView)
/* harmony export */ });
/* harmony import */ var _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26);

class FunctionNodeView extends _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_0__.BlockNodeView {
    constructor() {
        super(...arguments);
        this.canInline = true;
    }
    renderAsInline() {
        const element = document.createElement('span');
        element.appendChild(this.createTokenNode(this.treeNode.identity.value, ['afa-function']));
        element.appendChild(this.createTokenNode('('));
        element.appendChild(this.children[0].render());
        for (let i = 1; i < this.children.length; i++) {
            element.appendChild(this.createTokenNode(', '));
            element.appendChild(this.children[i].render());
        }
        element.appendChild(this.createTokenNode(')'));
        element.append(' ');
        element.appendChild(this.dataView.render());
        return element;
    }
    stopsInlining() {
        return true;
    }
    renderBlockHeader() {
        const element = document.createElement('span');
        element.append('Call function ');
        element.append(this.createTokenNode(this.treeNode.identity.value, ['afa-function']));
        return element;
    }
    getBlockHints() {
        // We only provide hints for functions with more than one argument.
        // Unary functions are usually self-explanatory.
        const functionName = this.treeNode.identity.value;
        switch (functionName) {
            case 'ccnorm_contains_any':
            case 'ccnorm_contains_all':
            case 'contains_any':
            case 'contains_all':
                return (index) => index === 0 ? 'haystack' : `needle ${index}`;
            case 'count':
                return this.children.length === 2 ? ['needle', 'haystack'] : ['string'];
            case 'rcount':
            case 'get_matches':
                return this.children.length === 2 ? ['regex', 'subject'] : ['string'];
            case 'ip_in_range':
                return ['ip', 'range'];
            case 'ip_in_ranges':
                return (index) => index === 0 ? 'ip' : `range ${index}`;
            case 'equals_to_any':
                return (index) => index === 0 ? 'tested' : `value ${index}`;
            case 'substr':
                return ['string', 'start', 'length'];
            case 'str_replace':
                return ['string', 'search', 'replaceBy'];
            case 'str_replace_regexp':
                return ['string', 'regex', 'replaceBy'];
            case 'set':
            case 'set_var':
                return ['variable', 'value'];
            default:
                return [];
        }
    }
    isInline() {
        if (!super.isInline())
            return false;
        if (this.children.length > 4)
            return false;
        let totalLength = 0;
        for (const child of this.children) {
            totalLength += child.render().textContent.length;
        }
        return totalLength < 100;
    }
}


/***/ }),
/* 32 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IndexNodeView: () => (/* binding */ IndexNodeView)
/* harmony export */ });
/* harmony import */ var _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26);

class IndexNodeView extends _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_0__.BlockNodeView {
    constructor() {
        super(...arguments);
        this.canInline = true;
    }
    renderAsInline() {
        const element = document.createElement('span');
        element.appendChild(this.children[0].render());
        element.appendChild(this.createTokenNode('['));
        element.appendChild(this.children[1].render());
        element.appendChild(this.createTokenNode(']'));
        return element;
    }
    renderBlockHeader() {
        const element = document.createElement('span');
        element.textContent = 'Get element at index';
        return element;
    }
    getBlockHints() {
        return ['array', 'index'];
    }
}


/***/ }),
/* 33 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OperatorNodeView: () => (/* binding */ OperatorNodeView)
/* harmony export */ });
/* harmony import */ var _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26);

class OperatorNodeView extends _BlockNodeView_js__WEBPACK_IMPORTED_MODULE_0__.BlockNodeView {
    constructor() {
        super(...arguments);
        this.canInline = true;
    }
    renderAsInline() {
        const element = document.createElement('span');
        if (this.arity === 1) {
            element.append(this.createTokenNode(this.treeNode.identity.value, ['afa-operator']));
            element.appendChild(this.children[0].render());
        }
        else {
            let getOperator = () => this.treeNode.identity.value;
            if (['if', '?'].includes(this.treeNode.identity.value)) {
                getOperator = (index) => index === 1 ? '?' : ':';
            }
            element.appendChild(this.children[0].render());
            for (let i = 1; i < this.children.length; i++) {
                const operator = getOperator(i);
                const isKeyword = /^[a-z]+$/i.test(operator);
                const nodeClass = isKeyword ? 'afa-keyword' : 'afa-operator';
                element.append(this.createTokenNode(' ' + getOperator(i) + ' ', [nodeClass]));
                element.appendChild(this.children[i].render());
            }
            // We do it only for non-unary operators because those are trivial to understand
            element.append(' ');
            element.appendChild(this.dataView.render());
        }
        return element;
    }
    stopsInlining() {
        return this.arity > 1;
    }
    get arity() {
        return this.children.length;
    }
    renderBlockHeader() {
        const operator = this.treeNode.identity.value;
        const element = document.createElement('span');
        if (operator === ';') {
            element.append('Statement sequence');
        }
        else {
            const isKeyword = /^[a-z]+$/i.test(operator);
            const nodeClass = isKeyword ? 'afa-keyword' : 'afa-operator';
            element.append('Operator ');
            element.append(this.createTokenNode(operator, [nodeClass]));
        }
        return element;
    }
    getBlockHints() {
        const operator = this.treeNode.identity.value;
        switch (operator) {
            case 'in':
                return ['needle', 'haystack'];
            case 'contains':
                return ['haystack', 'needle'];
            case 'like':
            case 'matches':
                return ['subject', 'glob'];
            case 'regex':
            case 'rlike':
            case 'irlike':
                return ['subject', 'regex'];
            case '?':
            case 'if':
                return ['test', 'ifTrue', 'ifFalse'];
        }
        return [];
    }
}


/***/ }),
/* 34 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NodeValueView: () => (/* binding */ NodeValueView)
/* harmony export */ });
/* harmony import */ var _NodeValueViewBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(35);
/* harmony import */ var _ValueFormatter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30);


/**
 * A view for displaying the value of a node when it's ready.
 */
class NodeValueView extends _NodeValueViewBase_js__WEBPACK_IMPORTED_MODULE_0__.NodeValueViewBase {
    /**
     * @param node The node for which to display the value.
     * @param evaluationContext The context for which to fetch the value.
     */
    constructor(node, evaluationContext) {
        super();
        this.element = document.createElement('span');
        this.element.textContent = '...';
        this.relevantContext = evaluationContext;
        this.listenToChanges(node);
    }
    onValueSet(value, context) {
        if (context.rootContext != this.relevantContext.rootContext)
            return;
        this.element.textContent = '';
        const maxLength = 15;
        const formattedValue = _ValueFormatter_js__WEBPACK_IMPORTED_MODULE_1__.ValueFormatter.formatValue(value);
        if (formattedValue.textContent.length <= maxLength) {
            this.setViewContent(formattedValue, null);
        }
        else {
            const shortenedValue = this.shortenValue(value, maxLength);
            this.setViewContent(shortenedValue, formattedValue);
        }
    }
    onErrorSet(errors, context) {
        if (context.rootContext != this.relevantContext.rootContext)
            return;
        const shortText = document.createElement('span');
        shortText.classList.add('afa-data-error');
        shortText.textContent = 'Errors: ' + errors.length;
        if (context.isSpeculative) {
            shortText.classList.add('afa-data-error-speculative');
            shortText.textContent += ' (speculative)';
        }
        const longText = document.createElement('span');
        longText.textContent = errors.map(e => e.message).join('\n');
        this.setViewContent(shortText, longText);
    }
    setViewContent(shortValue, longValue) {
        this.element.textContent = '';
        this.element.appendChild(shortValue);
        if (longValue !== null) {
            const moreContainer = document.createElement('span');
            moreContainer.classList.add('afa-data-more');
            moreContainer.appendChild(longValue);
            this.element.appendChild(moreContainer);
        }
    }
}


/***/ }),
/* 35 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NodeValueViewBase: () => (/* binding */ NodeValueViewBase)
/* harmony export */ });
/* harmony import */ var _evaluator_value_Value_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _ValueFormatter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(30);



class NodeValueViewBase {
    render() {
        return this.element;
    }
    /**
     * Starts listening to value changes and errors on the given node.
     * This method calls the appropriate handlers also with the values
     * and errors that are initially present in the node.
     * @param node The node to listen to for changes.
     */
    listenToChanges(node) {
        for (const context of node.getContextsWithErrors()) {
            this.onErrorSet(node.getErrors(context), context);
        }
        node.addOnErrorCallback((node, context) => {
            this.onErrorSet(node.getErrors(context), context);
        });
        for (const context of node.getContextsWithValue()) {
            this.onValueSet(node.getValue(context), context);
        }
        node.addOnValueSetCallback((node, context) => {
            this.onValueSet(node.getValue(context), context);
        });
    }
    /**
     * Renders the value in a shortened form.
     * @param value The value to render.
     * @param maxLength The maximum length of the value to display.
     * @returns The shortened value as an HTML element.
     */
    shortenValue(value, maxLength) {
        // Scalars usually don't need shortening
        switch (value.dataType) {
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.Array:
                return this.shortenArray(value);
            case _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String:
                return this.shortenString(value, maxLength);
            default:
                return _ValueFormatter_js__WEBPACK_IMPORTED_MODULE_2__.ValueFormatter.formatValue(value);
        }
    }
    shortenArray(value) {
        const arrayLength = value.value.length;
        const element = document.createElement('span');
        element.textContent = `array(${arrayLength})`;
        return element;
    }
    shortenString(value, maxLength) {
        const beginning = value.value.substring(0, maxLength - 3);
        const beginningValue = new _evaluator_value_Value_js__WEBPACK_IMPORTED_MODULE_0__.Value(_model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_1__.ValueDataType.String, beginning);
        const element = document.createElement('span');
        element.appendChild(_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_2__.ValueFormatter.formatValue(beginningValue));
        element.append('...');
        return element;
    }
}


/***/ }),
/* 36 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbuseFilterApi: () => (/* binding */ AbuseFilterApi)
/* harmony export */ });
var __await = (undefined && undefined.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (undefined && undefined.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
class AbuseFilterApi {
    static async fetchAbuseFilterText(filterId) {
        let api = this.getApi();
        if (filterId.toString().startsWith('global-')) {
            filterId = filterId.toString().replace('global-', '');
            api = new mw.ForeignApi('https://meta.wikimedia.org/w/api.php');
        }
        const response = await api.get({
            action: 'query',
            list: 'abusefilters',
            abfprop: 'id|pattern',
            abfstartid: filterId,
            abflimit: 1
        });
        const filterObject = response.query.abusefilters[0];
        if (filterObject.id == filterId) {
            if (filterObject.pattern)
                return filterObject.pattern;
            throw new Error('You don\'t have permission to view this filter');
        }
        throw new Error(`Filter ${filterId} not found`);
    }
    static async fetchAbuseLogEntry(logId) {
        var _a, _b;
        const api = this.getApi();
        const response = await api.get({
            action: 'query',
            list: 'abuselog',
            afllogid: logId,
            aflprop: 'ids|details',
            maxage: 3600, // log entries don't change, so we can cache them for a long time
            smaxage: 43200,
        });
        const logObject = (_b = (_a = response === null || response === void 0 ? void 0 : response.query) === null || _a === void 0 ? void 0 : _a.abuselog) === null || _b === void 0 ? void 0 : _b[0];
        if (logObject !== undefined) {
            return logObject;
        }
        throw new Error('Log entry does not exist or you have no permissions to view it');
    }
    static fetchAbuseLogEntries(filterId, limit) {
        var _a, _b, _c;
        return __asyncGenerator(this, arguments, function* fetchAbuseLogEntries_1() {
            const api = this.getApi();
            let remaining = limit;
            let aflStart = 'now';
            while (remaining > 0 && aflStart !== undefined) {
                const apiLimit = Math.min(remaining, 5000); // API limit is 5000
                const response = yield __await(api.get({
                    action: 'query',
                    list: 'abuselog',
                    aflfilter: filterId,
                    afllimit: apiLimit,
                    aflstart: aflStart,
                    aflprop: 'ids|details|timestamp',
                    maxage: 600, // new log entries will appear in the list as the time passess, so cache time shouldn't be too long
                    smaxage: 1800,
                }));
                const logObjects = (_a = response === null || response === void 0 ? void 0 : response.query) === null || _a === void 0 ? void 0 : _a.abuselog;
                if (logObjects === undefined) {
                    throw new Error(`Unable to fetch log entries for filter ${filterId}. You might not have permission to view them.`);
                }
                for (const logObject of logObjects) {
                    yield yield __await(logObject);
                }
                remaining -= (_b = logObjects.length) !== null && _b !== void 0 ? _b : 0;
                aflStart = (_c = response.continue) === null || _c === void 0 ? void 0 : _c.aflstart;
            }
        });
    }
    static getApi() {
        return new mw.Api({
            //@ts-expect-error types-mediawiki doesn't yet have 'userAgent' field
            userAgent: 'abusefilter-analyzer (User:Msz2001)'
        });
    }
}


/***/ }),
/* 37 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Parser: () => (/* binding */ Parser)
/* harmony export */ });
/* harmony import */ var _ParserException_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38);
/* harmony import */ var _Token_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(39);
/* harmony import */ var _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(10);




/**
 * A parser for the AbuseFilter syntax.
 * @param TNode The type of the nodes in the expression tree.
 *
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AFPTreeParser.php
 */
class Parser {
    // TODO: It'd be better to use some Queue<Token> like structure to avoid using mPos and mCur
    constructor(nodeFactory) {
        /** Stores the sequence of tokens that the parser is currently processing. */
        this.tokens = [];
        /** The current token */
        this.currentToken = new _Token_js__WEBPACK_IMPORTED_MODULE_1__.Token(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.EndOfStream, _Token_js__WEBPACK_IMPORTED_MODULE_1__.Token.EOF, 0, 0);
        /** The position of the current token */
        this.mPos = -1; // -1 so that the first call to move() sets it to 0
        this.nodeFactory = nodeFactory;
    }
    /**
     * Parses a list of AbuseFilter tokens into an expression tree.
     *
     * @param tokens The tokens to parse.
     * @returns The parsed expression tree.
     */
    parse(tokens) {
        this.tokens = tokens;
        const tree = this.doLevelEntry();
        if (tree === null) {
            // When the filter is empty, return a null token instead of no tree at all.
            // AbuseFilter evaluates empty tree to null, so this is a valid representation.
            return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Atom, new _Token_js__WEBPACK_IMPORTED_MODULE_1__.Token(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Keyword, 'null', 0, 0), []);
        }
        return tree;
    }
    /**
     * Advances the parser to the next token in the filter code.
     */
    move() {
        this.mPos++;
        this.currentToken = this.tokens[this.mPos];
    }
    /**
     * Get the next token. This is similar to move() but doesn't change class members,
     *   allowing to look ahead without rolling back the state.
     */
    getNextToken() {
        return this.tokens[this.mPos + 1];
    }
    /**
     * getState() function allows parser state to be rollbacked to several tokens
     * back.
     *
     * @return AFPParserState
     */
    getState() {
        return [this.currentToken, this.mPos];
    }
    /**
     * setState() function allows parser state to be rollbacked to several tokens
     * back.
     * TODO: This should not be needed at all
     * @param AFPParserState state
     */
    setState(state) {
        this.currentToken = state[0];
        this.mPos = state[1];
    }
    /* Levels */
    /**
     * Handles unexpected characters after the expression.
     * @returns Null only if no statements
     */
    doLevelEntry() {
        const result = this.doLevelSemicolon();
        // At the top level, the filter consists of a single expression.
        // Thus, the only legal token to be found later is the end of the stream.
        if (this.currentToken.type !== _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.EndOfStream) {
            throw new _ParserException_js__WEBPACK_IMPORTED_MODULE_0__.ParserException('unexpectedatend', this.currentToken.startPosition, [this.currentToken.type]);
        }
        return result;
    }
    /** Handles the semicolon operator. */
    doLevelSemicolon() {
        const statements = [];
        let token;
        do {
            // At the first iteration it can be garbage but the variable is used only
            // if there are at least two statements. It's guaranteed to be set correctly then.
            token = this.currentToken;
            this.move();
            if (this.currentToken.type === _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.EndOfStream ||
                (this.currentToken.type === _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Parenthesis && this.currentToken.value == ')')) {
                // Handle special cases which the other parser handled in doLevelAtom
                break;
            }
            // Allow empty statements.
            if (this.currentToken.type === _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.StatementSeparator) {
                continue;
            }
            statements.push(this.doLevelSet());
        } while (this.currentToken.type === _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.StatementSeparator);
        // Flatten the tree if possible.
        if (statements.length === 0) {
            return null;
        }
        else if (statements.length === 1) {
            return statements[0];
        }
        else {
            return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, statements);
        }
    }
    /** Handles variable assignment. */
    doLevelSet() {
        if (this.currentToken.type === _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Identifier) {
            const variableNode = this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Atom, this.currentToken, []);
            // Speculatively parse the assignment statement assuming it can
            // potentially be an assignment, but roll back if it isn't.
            // @todo Use this.getNextToken for clearer code
            const initialState = this.getState();
            this.move();
            if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, ':=')) {
                const token = this.currentToken;
                this.move();
                const value = this.doLevelSet();
                return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Assignment, token, [variableNode, value]);
            }
            if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.SquareBracket, '[')) {
                this.move();
                // Parse index offset.
                let index = 'append';
                if (!(this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.SquareBracket, ']'))) {
                    this.setState(initialState);
                    this.move();
                    index = this.doLevelSemicolon();
                    if (!this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.SquareBracket, ']')) {
                        this.throwExpectedNotFound(this.currentToken, ']');
                    }
                }
                this.move();
                if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, ':=')) {
                    const token = this.currentToken;
                    this.move();
                    const value = this.doLevelSet();
                    if (index === 'append') {
                        return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.IndexAssignment, token, [variableNode, value]);
                    }
                    else {
                        // TODO: index could be null, but the original parser acts this way
                        return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.IndexAssignment, token, [variableNode, value, index]);
                    }
                }
            }
            // If we reached this point, we did not find an assignment. Roll back
            // and assume this was just a literal.
            this.setState(initialState);
        }
        return this.doLevelConditions();
    }
    /** Handles ternary operator and if-then-else-end. */
    doLevelConditions() {
        if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Keyword, 'if')) {
            const token = this.currentToken;
            this.move();
            const condition = this.doLevelBoolOps();
            if (!this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Keyword, 'then')) {
                this.throwExpectedNotFound(this.currentToken, 'then');
            }
            this.move();
            const valueIfTrue = this.doLevelConditions();
            const args = [condition, valueIfTrue];
            if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Keyword, 'else')) {
                this.move();
                const valueIfFalse = this.doLevelConditions();
                args.push(valueIfFalse);
            }
            if (!this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Keyword, 'end')) {
                this.throwExpectedNotFound(this.currentToken, 'end');
            }
            this.move();
            return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, args);
        }
        const condition = this.doLevelBoolOps();
        if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, '?')) {
            const token = this.currentToken;
            this.move();
            const valueIfTrue = this.doLevelConditions();
            if (!this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, ':')) {
                this.throwExpectedNotFound(this.currentToken, ':');
            }
            this.move();
            const valueIfFalse = this.doLevelConditions();
            return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, [condition, valueIfTrue, valueIfFalse]);
        }
        return condition;
    }
    /** Handles logic operators. */
    doLevelBoolOps() {
        let leftOperand = this.doLevelCompares();
        const ops = ['&', '|', '^'];
        while (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, ops)) {
            const token = this.currentToken;
            this.move();
            const rightOperand = this.doLevelCompares();
            leftOperand = this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, [leftOperand, rightOperand]);
        }
        return leftOperand;
    }
    /** Handles comparison operators. */
    doLevelCompares() {
        let leftOperand = this.doLevelSumRels();
        const equalityOps = ['==', '===', '!=', '!==', '='];
        const orderOps = ['<', '>', '<=', '>='];
        // Only allow either a single operation, or a combination of a single equalityOps and a single
        // orderOps. This resembles what PHP does, and allows `a < b == c` while rejecting `a < b < c`
        let allowedOps = equalityOps.concat(orderOps);
        while (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, allowedOps)) {
            const token = this.currentToken;
            allowedOps = equalityOps.includes(token.value) ? orderOps : equalityOps;
            this.move();
            const rightOperand = this.doLevelSumRels();
            leftOperand = this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, [leftOperand, rightOperand]);
        }
        return leftOperand;
    }
    /** Handle addition and subtraction. */
    doLevelSumRels() {
        let leftOperand = this.doLevelMulRels();
        const ops = ['+', '-'];
        while (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, ops)) {
            const token = this.currentToken;
            this.move();
            const rightOperand = this.doLevelMulRels();
            leftOperand = this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, [leftOperand, rightOperand]);
        }
        return leftOperand;
    }
    /** Handles multiplication and division. */
    doLevelMulRels() {
        let leftOperand = this.doLevelPow();
        const ops = ['*', '/', '%'];
        while (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, ops)) {
            const token = this.currentToken;
            this.move();
            const rightOperand = this.doLevelPow();
            leftOperand = this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, [leftOperand, rightOperand]);
        }
        return leftOperand;
    }
    /** Handles exponentiation. */
    doLevelPow() {
        let base = this.doLevelBoolInvert();
        while (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, '**')) {
            const token = this.currentToken;
            this.move();
            const exponent = this.doLevelBoolInvert();
            base = this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, [base, exponent]);
        }
        return base;
    }
    /** Handles boolean inversion. */
    doLevelBoolInvert() {
        if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, '!')) {
            const token = this.currentToken;
            this.move();
            const argument = this.doLevelKeywordOperators();
            return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, [argument]);
        }
        return this.doLevelKeywordOperators();
    }
    /** Handles keyword operators. */
    doLevelKeywordOperators() {
        const leftOperand = this.doLevelUnarys();
        const token = this.currentToken;
        const availableKeywords = ['in', 'like', 'contains', 'matches', 'rlike', 'irlike', 'regex'];
        if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Keyword, availableKeywords)) {
            this.move();
            const rightOperand = this.doLevelUnarys();
            return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, [leftOperand, rightOperand]);
        }
        return leftOperand;
    }
    /** Handles unary operators. */
    doLevelUnarys() {
        if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Operator, ['+', '-'])) {
            const token = this.currentToken;
            this.move();
            const argument = this.doLevelArrayElements();
            return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Operator, token, [argument]);
        }
        return this.doLevelArrayElements();
    }
    /** Handles accessing an array element by an offset. */
    doLevelArrayElements() {
        let array = this.doLevelParenthesis();
        while (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.SquareBracket, '[')) {
            const token = this.currentToken;
            const index = this.doLevelSemicolon(); // TODO: index could be null, but the original parser acts this way
            array = this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.ArrayIndexing, token, [array, index]);
            if (!this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.SquareBracket, ']')) {
                this.throwExpectedNotFound(this.currentToken, ']');
            }
            this.move();
        }
        return array;
    }
    /** Handles parenthesis. */
    doLevelParenthesis() {
        if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Parenthesis, '(')) {
            const next = this.getNextToken();
            if (next.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Parenthesis, ')')) {
                // Empty parentheses are never allowed
                this.throwUnexpectedToken(this.currentToken);
            }
            const result = this.doLevelSemicolon(); // TODO: result could be null, but the original parser acts this way
            if (!this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Parenthesis, ')')) {
                this.throwExpectedNotFound(this.currentToken, ')');
            }
            this.move();
            return result;
        }
        return this.doLevelFunction();
    }
    /** Handles function calls. */
    doLevelFunction() {
        let next = this.getNextToken();
        if (this.currentToken.type === _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Identifier && next.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Parenthesis, '(')) {
            const token = this.currentToken;
            this.move();
            const args = [];
            next = this.getNextToken();
            if (!next.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Parenthesis, ')')) {
                do {
                    const thisArg = this.doLevelSemicolon();
                    if (thisArg !== null) {
                        args.push(thisArg);
                    }
                } while (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Comma));
            }
            else {
                this.move();
            }
            if (!this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Parenthesis, ')')) {
                this.throwExpectedNotFound(this.currentToken, ')');
            }
            this.move();
            return this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.FunctionCall, token, args);
        }
        return this.doLevelAtom();
    }
    /** Handle literals. */
    doLevelAtom() {
        const tok = this.currentToken.value;
        let result;
        switch (this.currentToken.type) {
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Identifier:
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.StringLiteral:
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.FloatLiteral:
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.IntLiteral:
                result = this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Atom, this.currentToken, []);
                break;
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Keyword:
                if (['true', 'false', 'null'].includes(tok)) {
                    result = this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.Atom, this.currentToken, []);
                    break;
                }
                throw new _ParserException_js__WEBPACK_IMPORTED_MODULE_0__.ParserException('unrecognisedkeyword', this.currentToken.startPosition, [tok]);
            case _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.SquareBracket:
                if (this.currentToken.value === '[') {
                    const token = this.currentToken;
                    const array = [];
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        this.move();
                        if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.SquareBracket, ']')) {
                            break;
                        }
                        array.push(this.doLevelSet());
                        if (this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.SquareBracket, ']')) {
                            break;
                        }
                        if (!this.currentToken.is(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.Comma)) {
                            this.throwExpectedNotFound(this.currentToken, ', or ]');
                        }
                    }
                    result = this.nodeFactory.createNode(_model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_3__.TreeNodeType.ArrayDefinition, token, array);
                    break;
                }
            // Fallthrough expected
            default:
                this.throwUnexpectedToken(this.currentToken);
        }
        this.move();
        return result;
    }
    /**
     * Throws an exception stating that the found token was not expected
     * @param currentToken The unexpected token.
     */
    throwUnexpectedToken(currentToken) {
        throw new _ParserException_js__WEBPACK_IMPORTED_MODULE_0__.ParserException('unexpectedtoken', currentToken.startPosition, [
            currentToken.type,
            currentToken.value
        ]);
    }
    /**
     * Throws an exception stating that an expected token was not found.
     * @param currentToken The current token.
     * @param expected The expected token.
     */
    throwExpectedNotFound(currentToken, expected) {
        throw new _ParserException_js__WEBPACK_IMPORTED_MODULE_0__.ParserException('expectednotfound', currentToken.startPosition, [
            expected,
            currentToken.type,
            currentToken.value
        ]);
    }
}
/*
Parsing levels:
0. Entry
1. Semicolon-separated statements
2. Assignments
3. Conditions
4. Logical operators
5. Comparison operators
6. Arithmetic operators (addition)
7. Arithmetic operators (multiplication)
8. Arithmetic operators (exponentiation)
9. Boolean negation
10. Keyword operators
11. Unary arithmetic operators
12. Array indexing
13. Parentheses
14. Function calls
15. Atoms (literals, variables)
*/ 


/***/ }),
/* 38 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ParserException: () => (/* binding */ ParserException)
/* harmony export */ });
/**
 * A simple class modelling a parser exception.
 */
class ParserException extends Error {
    constructor(message, position, data) {
        super(message);
        this.position = position;
        this.data = data;
    }
    toString() {
        return `ParserException: ${this.message} at position ${this.position} with data: ${this.data.join(', ')}`;
    }
}


/***/ }),
/* 39 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Token: () => (/* binding */ Token)
/* harmony export */ });
/* harmony import */ var _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);

/**
 * Represents a token found in the input sequence.
 */
class Token {
    /**
     * @param type The token type.
     * @param value The value of the token. For end of stream tokens, use Token.EOF.
     */
    constructor(type, value, startPosition, length) {
        this.type = type;
        this.value = value;
        this.startPosition = startPosition;
        this.length = length;
        if (type === _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.EndOfStream)
            this.value = Token.EOF;
    }
    /**
     * Convenience function for checking the token type and value.
     * @param type The token type to check.
     * @param value The token value to check. Can be a string, an array of strings or null.
     * @returns True if type and value are equal. If value is an array, returns true if the token value is in the array.
     */
    is(type, value) {
        if (value === undefined) {
            return this.type === type;
        }
        if (typeof value === 'string') {
            return this.type === type && this.value === value;
        }
        return this.type === type && value.includes(this.value);
    }
}
/** A value for EndOfStream tokens. */
Token.EOF = '';


/***/ }),
/* 40 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tokenizer: () => (/* binding */ Tokenizer)
/* harmony export */ });
/* harmony import */ var _Token_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(39);
/* harmony import */ var _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);


/**
 * Essential class for AbuseFilter rule preparation before actual parsing.
 *
 * Converts the string representation of an expression into a sequence of tokens.
 *
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AbuseFilterTokenizer.php
 */
class Tokenizer {
    constructor() {
        /** Regular expression to find beginning of a comment after potentially some whitespaces. */
        this.commentStartRegex = /\s*\/\*/y;
        /** Regular expression to find operators. Ordered so that the longest will try to be mathed first. */
        this.operatorsRegex = /(!==|!=|!|\*\*|\*|\/|\+|-|%|&|\||\^|:=|\?|:|<=|<|>=|>|===|==|=)/y;
        /** Regular expression to match numbers in varying bases. */
        this.numberRegex = /(?:0([xbo]))?([0-9A-Fa-f]+(?:\.\d*)?|\.\d+)(?!\w)/y;
        /**
         * Regular expression to match identifiers and keywords. We allow for identifiers starting with digit,
         * they are however caught earlier when parsing numbers.
         */
        this.identifierRegex = /[0-9A-Za-z_]+/y;
    }
    /**
     * Converts the input string into a sequence of tokens.
     *
     * @param input The input string to tokenize.
     * @returns An array of tokens ending with EndOfStream token.
     */
    tokenize(input) {
        const tokens = [];
        // Initialize the token variable with a dummy token.
        // Its position will make our parser start at the beginning of the input.
        // The actual type is not important here, as the parser will replace it immediately.
        let token = new _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.EndOfStream, _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token.EOF, 0, 0);
        do {
            token = this.getNextToken(input, token.startPosition + token.length);
            tokens.push(token);
        } while (token.type != _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.EndOfStream);
        return tokens;
    }
    /**
     * Returns the next token from the input string.
     *
     * @param input The input string to tokenize.
     * @param startOffset The position in the input string to start searching for the next token.
     * @returns The next token in the input string.
     */
    getNextToken(input, startOffset) {
        var _a, _b, _c;
        // Skip comments first. Don't treat them as tokens at all.
        this.commentStartRegex.lastIndex = startOffset;
        while (this.commentStartRegex.test(input)) {
            // We found a comment start. Let's find the end of the comment.
            const commentEnd = input.indexOf('*/', this.commentStartRegex.lastIndex);
            if (commentEnd === -1) {
                // TODO: Decide on the error handling strategy.
                throw new Error('Unclosed comment');
            }
            startOffset = commentEnd + 2;
            this.commentStartRegex.lastIndex = startOffset;
        }
        // Skip whitespaces.
        while (startOffset < input.length && Tokenizer.whitespaces.includes(input[startOffset])) {
            startOffset++;
        }
        // If we reached the end of the input, return the EOF token.
        // Any further rules will not adjust startOffset, so we can safely do the check here.
        if (startOffset >= input.length) {
            return new _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.EndOfStream, _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token.EOF, startOffset, 0);
        }
        const firstChar = input[startOffset];
        // Punctuation
        const punctuationToken = Tokenizer.punctuationTokens.get(firstChar);
        if (punctuationToken !== undefined) {
            return new _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token(punctuationToken, firstChar, startOffset, 1);
        }
        // String literals
        if (firstChar === '"' || firstChar === '\'') {
            return this.readStringLiteral(input, startOffset);
        }
        // Operators
        this.operatorsRegex.lastIndex = startOffset;
        const operatorMatch = this.operatorsRegex.exec(input);
        if (operatorMatch !== null) {
            return new _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.Operator, operatorMatch[0], startOffset, operatorMatch[0].length);
        }
        // Numbers
        this.numberRegex.lastIndex = startOffset;
        const numberMatch = this.numberRegex.exec(input);
        if (numberMatch !== null) {
            const baseChar = (_a = numberMatch[1]) !== null && _a !== void 0 ? _a : 'd';
            const base = (_b = Tokenizer.numberBases.get(baseChar)) !== null && _b !== void 0 ? _b : 10;
            const number = (_c = numberMatch[2]) !== null && _c !== void 0 ? _c : '0';
            const tokenLength = numberMatch[0].length;
            // TODO: Vulnerable to malformed data like `0xfa.07` or `0b23` (has to try/catch and throw)
            // TODO: Check if we need to parse non-decimal floats
            // TODO: Maybe abandon the complex regex and use simple parser like for strings
            // Checking for being NaN is needed, otherwise token `a` will be interpreted as
            // `0x0a` and not as an identifier
            if (number.indexOf('.') !== -1) {
                const numberValue = parseFloat(number);
                if (!isNaN(numberValue)) {
                    return new _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.FloatLiteral, numberValue.toString(), startOffset, tokenLength);
                }
            }
            else {
                const numberValue = parseInt(number, base);
                if (!isNaN(numberValue)) {
                    return new _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.IntLiteral, numberValue.toString(), startOffset, tokenLength);
                }
            }
        }
        // Identifiers and keywords
        this.identifierRegex.lastIndex = startOffset;
        const identifierMatch = this.identifierRegex.exec(input);
        if (identifierMatch !== null) {
            let identifier = identifierMatch[0];
            const tokenLength = identifier.length;
            const isKeyword = Tokenizer.keywords.has(identifier);
            const tokenType = isKeyword ? _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.Keyword : _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.Identifier;
            if (isKeyword) {
                // Identifiers are case-insensitive so normalize them to lowercase
                // We could also normalize the identifiers but it can make them unreadable
                identifier = identifier.toLowerCase();
            }
            return new _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token(tokenType, identifier, startOffset, tokenLength);
        }
        return new _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.EndOfStream, _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token.EOF, startOffset, 0);
    }
    /**
     * Reads a string literal from the input string.
     *
     * @param input The input string to read the string literal from.
     * @param startOffset The position in the input string to start reading the string literal from.
     * @returns The string literal token.
     */
    readStringLiteral(input, startOffset) {
        const quoteChar = input[startOffset];
        // Stores the parsed string content, i.e. `\n` will be stored as a newline character etc.
        let stringContent = '';
        let offset = startOffset + 1;
        while (offset < input.length) {
            const char = input[offset];
            if (char === quoteChar) {
                // The string ends here.
                // We calculate the token length by offsets in the input stream, because the string
                // content may not be the same length as the token in the input string
                // (eg. \n is two bytes in input).
                return new _Token_js__WEBPACK_IMPORTED_MODULE_0__.Token(_model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.StringLiteral, stringContent, startOffset, offset - startOffset + 1);
            }
            else if (char === '\\') {
                if (offset + 1 >= input.length) {
                    // Unmatched escape at the end of the string
                    stringContent += '\\';
                    offset++;
                    break;
                }
                else {
                    const nextChar = input[offset + 1];
                    let escapeSequenceLength = 2;
                    switch (nextChar) {
                        case '\\':
                            stringContent += '\\';
                            break;
                        case 'n':
                            stringContent += '\n';
                            break;
                        case 'r':
                            stringContent += '\r';
                            break;
                        case 't':
                            stringContent += '\t';
                            break;
                        case quoteChar:
                            stringContent += quoteChar;
                            break;
                        case 'x':
                            // Ensure that the full `\xAB` sequence fits in the input string
                            if (offset + 3 < input.length) {
                                const charCode = input.substring(offset + 2, offset + 4);
                                if (/^[0-9A-F]{2}$/i.test(charCode)) {
                                    stringContent += String.fromCharCode(parseInt(charCode, 16));
                                    escapeSequenceLength = 4;
                                }
                                else {
                                    stringContent += '\\x';
                                }
                            }
                            else {
                                stringContent += '\\x';
                            }
                            break;
                        default:
                            stringContent += '\\' + nextChar;
                            break;
                    }
                    offset += escapeSequenceLength;
                }
            }
            else {
                // Copy the whole chunk without escape characters to the output variable.
                // chunkEnd is the exclusive end of the chunk.
                const nextBackslash = input.indexOf('\\', offset);
                const nextQuote = input.indexOf(quoteChar, offset);
                let chunkEnd = input.length;
                if (nextBackslash !== -1)
                    chunkEnd = nextBackslash;
                if (nextQuote !== -1)
                    chunkEnd = Math.min(chunkEnd, nextQuote);
                const chunk = input.substring(offset, chunkEnd);
                stringContent += chunk;
                offset = chunkEnd;
            }
        }
        // If we reached the end of the input, the string is unclosed.
        // TODO: Decide on the error handling strategy.
        throw new Error('Unclosed string literal');
    }
}
/** Characters to be ignored when between tokens. */
Tokenizer.whitespaces = [' ', '\t', '\n', '\v', '\f', '\r'];
/** General mapping of puntuation characters into their respective token types. */
Tokenizer.punctuationTokens = new Map([
    ['(', _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.Parenthesis],
    [')', _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.Parenthesis],
    ['[', _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.SquareBracket],
    [']', _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.SquareBracket],
    [',', _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.Comma],
    [';', _model_tokens_TokenType_js__WEBPACK_IMPORTED_MODULE_1__.TokenType.StatementSeparator],
]);
/** Mapping of base characters to their respective numeric base. */
Tokenizer.numberBases = new Map([
    ['x', 16],
    ['b', 2],
    ['o', 8],
]);
/** Lists all digits that are legal for a number in a given base */
Tokenizer.digitsInBases = new Map([
    [2, '01'],
    [8, '01234567'],
    [10, '0123456789'],
    [16, '0123456789ABCDEF'],
]);
/** Set of keywords recognized by the tokenizer. */
Tokenizer.keywords = new Set([
    'in', 'like', 'true', 'false', 'null', 'contains', 'matches',
    'rlike', 'irlike', 'regex', 'if', 'then', 'else', 'end',
]);


/***/ }),
/* 41 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FlattenAssociativeOpsTransformer: () => (/* binding */ FlattenAssociativeOpsTransformer)
/* harmony export */ });
/* harmony import */ var _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);

/**
 * Transforms a tree by flattening associative operators.
 */
class FlattenAssociativeOpsTransformer {
    transform(node, nodeFactory) {
        let children = node.children;
        const isOperator = node.type === _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Operator;
        const isAssociative = ['&', '|', '^', '+', '*'].includes(node.identity.value);
        if (isOperator && isAssociative) {
            children = this.flatten(node);
        }
        const newChildren = children.map(child => this.transform(child, nodeFactory));
        return nodeFactory.createNode(node.type, node.identity, newChildren);
    }
    /**
     * Returns an array of children that the root node can have in order to achieve a more shallow tree
     * @param node Root node of the tree to flatten
     */
    flatten(node) {
        const flattened = [];
        for (const child of node.children) {
            if (child.type === _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Operator && child.identity.value === node.identity.value) {
                flattened.push(...this.flatten(child));
            }
            else {
                flattened.push(child);
            }
        }
        return flattened;
    }
}


/***/ }),
/* 42 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CCNormProvider: () => (/* binding */ CCNormProvider)
/* harmony export */ });
/**
 * This class provides a way to normalize visually-confusible characters, based on
 * a conversion table fetched from a specified URL.
 * The conversion table maps characters to their normalized forms.
 */
class CCNormProvider {
    /**
     * Creates an instance of CCNormProvider.
     * @param ccnormUrl The URL to the conversion table JSON file.
     */
    constructor(ccnormUrl) {
        this.ccnormUrl = ccnormUrl;
    }
    /**
     * Initializes the conversion table if it has not been loaded yet.
     * This method fetches the conversion table from the specified URL and stores it.
     */
    async initializeIfNeeded() {
        if (this.conversionTable !== undefined) {
            return; // Already initialized
        }
        this.conversionTable = await this.loadConversionTable(this.ccnormUrl);
    }
    async loadConversionTable(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch conversion table from ${url}: ${response.statusText}`);
        }
        const data = await response.json();
        if (typeof data !== 'object' || data === null) {
            throw new Error(`Invalid conversion table format in ${url}`);
        }
        return new Map(Object.entries(data));
    }
    /**
     * Normalizes the input string by replacing visually-confusible characters
     * with their normalized forms based on the conversion table.
     * @param input The input string to normalize.
     * @returns The normalized string.
     */
    ccnorm(input) {
        if (this.conversionTable === undefined) {
            throw new Error('CCNormProvider is not initialized. Call initializeIfNeeded() first.');
        }
        let output = '';
        for (const char of input) {
            const normalizedChar = this.conversionTable.get(char);
            if (normalizedChar !== undefined) {
                output += normalizedChar;
            }
            else {
                output += char; // Keep the original character if no conversion is found
            }
        }
        return output;
    }
}


/***/ }),
/* 43 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImpactingBoolFilter: () => (/* binding */ ImpactingBoolFilter)
/* harmony export */ });
/* harmony import */ var _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);

/**
 * Implements a node view filter that hides nodes with boolean values
 * that do not impact the result of the filter.
 * For example, for (true & true & false), only the last will be shown.
 */
class ImpactingBoolFilter {
    constructor(evaluationContext) {
        this.name = 'Show only impacting booleans';
        this.description = 'Hides most operands of AND that evaluate to true and of OR that ' +
            'evaluate to false. The resulting tree will be shorter and will contain only rules affecting ' +
            'the final result.';
        this.relevantEvaluationContext = evaluationContext;
    }
    initialize(nodeView, reapply) {
        const node = nodeView.treeNode;
        if (!('getValue' in node)) {
            return;
        }
        this.listenForChanges(node, reapply);
    }
    listenForChanges(nodeView, callback) {
        nodeView.addOnValueSetCallback(callback);
        nodeView.addOnErrorCallback(callback);
        for (const child of nodeView.children) {
            this.listenForChanges(child, callback);
        }
    }
    apply(nodeView) {
        if (!('getValue' in nodeView.treeNode)) {
            // Don't filter out non-evaluable nodes
            return;
        }
        // Inline nodes can be only shown or collapsed as a whole
        // Don't enter into them
        if (nodeView.isInline()) {
            return;
        }
        for (const child of nodeView.children) {
            this.apply(child);
        }
        const treeNode = nodeView.treeNode;
        this.hideInsignificantChildren(treeNode, nodeView);
        this.hideWithNoVisibleChildren(nodeView);
    }
    hideInsignificantChildren(node, view) {
        const nodeType = node.type;
        const nodeToken = node.identity;
        if (nodeType != _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_0__.TreeNodeType.Operator)
            return;
        switch (nodeToken.value) {
            case '&':
                this.hideInsignificantAndChildren(node, view);
                break;
            case '|':
                this.hideInsignificantOrChildren(node, view);
                break;
        }
    }
    hideInsignificantAndChildren(node, view) {
        const parentValue = node.getValue(this.relevantEvaluationContext);
        if (parentValue.isTruthy() !== false) {
            // If the parent is true, keep all children visible
            // They are all significant, even though true is recessive for AND
            return;
        }
        for (const child of view.children) {
            if (child.isHidden || !('getValue' in child.treeNode)) {
                continue;
            }
            const childNode = child.treeNode;
            const childValue = childNode.getValue(this.relevantEvaluationContext);
            if (childValue.isTruthy() === true) {
                child.hide();
            }
        }
    }
    hideInsignificantOrChildren(node, view) {
        const parentValue = node.getValue(this.relevantEvaluationContext);
        if (parentValue.isTruthy() !== true) {
            // If the parent is false, keep all children visible
            // They are all significant, even though false is recessive for OR
            return;
        }
        for (const child of view.children) {
            if (child.isHidden || !('getValue' in child.treeNode)) {
                continue;
            }
            const childNode = child.treeNode;
            const childValue = childNode.getValue(this.relevantEvaluationContext);
            if (childValue.isTruthy() === false) {
                child.hide();
            }
        }
    }
    hideWithNoVisibleChildren(view) {
        if (view.children.length === 0) {
            return;
        }
        // There's no point in showing child-less nodes
        if (view.children.every(child => child.isHidden)) {
            view.hide();
        }
    }
}


/***/ }),
/* 44 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TreeNode: () => (/* binding */ TreeNode)
/* harmony export */ });
/**
 * Represents a single node in the parser tree. It chan contain other nodes or simple values.
 *
 * Based on https://phabricator.wikimedia.org/diffusion/EABF/browse/master/includes/Parser/AFPTreeNode.php
 */
class TreeNode {
    constructor(type, identity, children = []) {
        this.type = type;
        this.identity = identity;
        this.children = children;
    }
}


/***/ }),
/* 45 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TreeNodeFactory: () => (/* binding */ TreeNodeFactory)
/* harmony export */ });
/* harmony import */ var _TreeNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);

/**
 * A simple tree node factory that produces `TreeNode` instances.
 */
class TreeNodeFactory {
    createNode(type, identity, children) {
        return new _TreeNode_js__WEBPACK_IMPORTED_MODULE_0__.TreeNode(type, identity, children);
    }
}


/***/ }),
/* 46 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ViewFactoryWithAugmented_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47);
/**
 * Hit Details gadget for AbuseFilter
 * It presents the filter evaluation tree for a given log entry.
 * It is automatically invoked on Special:AbuseLog page in a 'details' view for
 * a specific log entry. The gadget will display the syntax tree, along with the
 * values of all the nodes in it.
 */

mw.hook('userjs.abuseFilter').add((abuseFilter) => {
    // Run only on the AbuseLog special page
    if (mw.config.get('wgCanonicalSpecialPageName') !== 'AbuseLog')
        return;
    const pageName = mw.config.get('wgPageName');
    const logMatch = pageName.match(/\/(\d+)$/);
    const logId = logMatch === null || logMatch === void 0 ? void 0 : logMatch[1];
    if (logId) {
        displayOnLogEntryPage(logId);
    }
    async function displayOnLogEntryPage(logId) {
        const fieldset = document.querySelector('#mw-content-text > fieldset');
        if (!fieldset)
            return;
        const referenceHeader = fieldset.querySelector('h3');
        if (!referenceHeader)
            return;
        const treeHeader = document.createElement('h3');
        treeHeader.textContent = 'Filter evaluation tree';
        fieldset.insertBefore(treeHeader, referenceHeader);
        const rootElement = document.createElement('div');
        rootElement.textContent = 'Loading...';
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
                viewFactory: new _ViewFactoryWithAugmented_js__WEBPACK_IMPORTED_MODULE_0__.ViewFactoryWithAugmented(filter.defaultContext),
            });
            await filter.evaluate();
        }
        catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : ('' + error);
            rootElement.textContent = `Can't load the abuse filter: ${errorMessage}`;
        }
    }
});


/***/ }),
/* 47 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewFactoryWithAugmented: () => (/* binding */ ViewFactoryWithAugmented)
/* harmony export */ });
/* harmony import */ var _gui_treeViews_ViewFactory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
/* harmony import */ var _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _AugmentedOperatorNodeView_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(48);



class ViewFactoryWithAugmented extends _gui_treeViews_ViewFactory_js__WEBPACK_IMPORTED_MODULE_0__.ViewFactory {
    constructor(evaluationContext) {
        super();
        this.evaluationContext = evaluationContext;
    }
    createViewWithChildren(node, childViews) {
        if (!('getValue' in node)) {
            throw new Error('Only evaluable nodes can be used with this view factory');
        }
        const augmentedOperators = ['in', 'contains', 'like', 'matches', 'regex', 'rlike', 'irlike'];
        if (node.type === _model_nodes_TreeNodeType_js__WEBPACK_IMPORTED_MODULE_1__.TreeNodeType.Operator
            && augmentedOperators.includes(node.identity.value)) {
            const dataView = this.createDataView(node);
            return new _AugmentedOperatorNodeView_js__WEBPACK_IMPORTED_MODULE_2__.AugmentedOperatorNodeView(node, childViews, dataView, this.evaluationContext);
        }
        return super.createViewWithChildren(node, childViews);
    }
}


/***/ }),
/* 48 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AugmentedOperatorNodeView: () => (/* binding */ AugmentedOperatorNodeView)
/* harmony export */ });
/* harmony import */ var _gui_treeViews_OperatorNodeView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33);
/* harmony import */ var _PatternExplorerPopup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49);


class AugmentedOperatorNodeView extends _gui_treeViews_OperatorNodeView_js__WEBPACK_IMPORTED_MODULE_0__.OperatorNodeView {
    constructor(node, childViews, dataView, evaluationContext) {
        super(node, childViews, dataView);
        this.evaluationContext = evaluationContext;
    }
    createTokenNode(token, classes = []) {
        const treeNode = this.treeNode;
        const element = document.createElement('button');
        element.classList.add('afa-token', 'afa-silent-button');
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        element.append(token);
        const buttonTitle = 'Click to see details of the match';
        // Enable the button only if the node matched anything in the current context
        element.disabled = treeNode.getValue(this.evaluationContext).isTruthy() !== true;
        if (!element.disabled) {
            element.title = buttonTitle;
        }
        treeNode.addOnValueSetCallback((_, ec) => {
            if (ec !== this.evaluationContext)
                return;
            element.disabled = treeNode.getValue(ec).isTruthy() !== true;
            if (!element.disabled) {
                element.title = buttonTitle;
            }
        });
        element.addEventListener('click', () => {
            this.displayPopup(element);
        });
        return element;
    }
    displayPopup(anchor) {
        const children = this.treeNode.children;
        const argValues = children.map(child => child.getValue(this.evaluationContext));
        const args = this.interpretArguments(argValues, this.treeNode.identity.value);
        const popup = new _PatternExplorerPopup_js__WEBPACK_IMPORTED_MODULE_1__.PatternExplorerPopup(args.pattern, args.subject, args.mode);
        popup.display(anchor);
    }
    /**
     * Decodes the order of the arguments, depending on the operator.
     * @param values The operands of the operator
     * @param operator The operator
     * @returns Returns an object with two properties: subject (the whole tested string) and pattern (regex/glob pattern or substring)
     */
    interpretArguments(values, operator) {
        const modes = {
            'in': 'substring',
            'contains': 'substring',
            'like': 'glob',
            'matches': 'glob',
            'regex': 'regex',
            'rlike': 'regex',
            'irlike': 'regex-i',
        };
        if (operator === 'in') {
            return {
                subject: values[1],
                pattern: values[0],
                mode: modes[operator]
            };
        }
        else {
            return {
                subject: values[0],
                pattern: values[1],
                mode: modes[operator]
            };
        }
    }
}


/***/ }),
/* 49 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PatternExplorerPopup: () => (/* binding */ PatternExplorerPopup)
/* harmony export */ });
/* harmony import */ var _evaluator_value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30);


class PatternExplorerPopup {
    /**
     * Creates a new PatternExplorerPopup instance.
     * @param pattern The regex/glob pattern or substring to be searched for
     * @param subject The whole tested string
     * @param matchingMode The matching mode, which can be 'regex', 'glob', or 'substring'
     */
    constructor(pattern, subject, matchingMode) {
        this.pattern = pattern;
        this.subject = subject;
        this.matchingMode = matchingMode;
    }
    display(attachToNode) {
        const content = document.createElement('div');
        content.append(this.makePatternBlock());
        content.append(this.makeSubjectBlock());
        const $anchor = attachToNode ? $(attachToNode) : undefined;
        // Adjust the popup width based on the values to be shown
        const useWidePopup = this.isLongValue(this.pattern) || this.isLongValue(this.subject);
        mw.loader.using(['oojs-ui-core', 'oojs-ui-widgets'], () => {
            const popup = new OO.ui.PopupWidget({
                autoClose: true,
                padded: true,
                width: useWidePopup ? window.innerWidth * 0.9 : 350,
                $content: $(content),
                $floatableContainer: $anchor,
                anchor: !!attachToNode,
                head: true,
                label: 'Match details',
            });
            $(document.body).append(popup.$element);
            popup.toggle(true);
        });
    }
    makePatternBlock() {
        const patternBlock = document.createElement('p');
        patternBlock.append('Pattern: ');
        patternBlock.append(_gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_1__.ValueFormatter.formatValue(this.pattern, 100));
        return patternBlock;
    }
    makeSubjectBlock() {
        let match = null;
        if (this.matchingMode === 'substring') {
            match = _evaluator_value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_0__.ValueStringOperations.matchSubstring(this.subject, this.pattern);
        }
        else if (this.matchingMode === 'glob') {
            match = _evaluator_value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_0__.ValueStringOperations.matchGlob(this.subject, this.pattern);
        }
        else {
            match = _evaluator_value_ValueStringOperations_js__WEBPACK_IMPORTED_MODULE_0__.ValueStringOperations.matchRegex(this.subject, this.pattern, this.matchingMode === 'regex-i');
        }
        if (match === null) {
            console.log(`PatternExplorerPopup: No match found for pattern "${this.pattern.asString().value}" in subject "${this.subject.asString().value}". Matching mode: ${this.matchingMode}`);
            const noMatchBlock = document.createElement('p');
            noMatchBlock.textContent = 'No match found';
            return noMatchBlock;
        }
        // This intentionally does not format the subject as usual, because it it
        // for sure a string and we don't want to be sensitive to what the formatter does.
        return this.extractAndHighlightMatch(this.subject.asString().value, match, 250);
    }
    isLongValue(value) {
        // A value is considered long if it has more than 40 characters
        return value.asString().value.length > 40;
    }
    extractAndHighlightMatch(str, match, windowSize) {
        const wrapper = document.createElement('p');
        wrapper.classList.add('afa-value', 'afa-value-string');
        wrapper.append('"');
        if (match.start > 0) {
            const fragmentStart = match.start < windowSize ? 0 : match.start - windowSize;
            const leadingFragment = str.substring(fragmentStart, match.start);
            wrapper.append(_gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_1__.ValueFormatter.escapeString(leadingFragment));
        }
        const highlightedPart = document.createElement('mark');
        const matchedFragment = str.substring(match.start, match.end);
        highlightedPart.textContent = _gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_1__.ValueFormatter.escapeString(matchedFragment);
        wrapper.appendChild(highlightedPart);
        if (match.end < str.length) {
            const fragmentEnd = match.end + windowSize < str.length ? match.end + windowSize : str.length;
            const trailingFragment = str.substring(match.end, fragmentEnd);
            wrapper.append(_gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_1__.ValueFormatter.escapeString(trailingFragment));
        }
        wrapper.append('"');
        return wrapper;
    }
}


/***/ }),
/* 50 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _NodeValueFrequencyView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
var __asyncValues = (undefined && undefined.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};

mw.hook('userjs.abuseFilter').add((abuseFilter) => {
    // Run only on the AbuseLog special page
    if (mw.config.get('wgCanonicalSpecialPageName') !== 'AbuseLog')
        return;
    const urlParams = new URLSearchParams(window.location.search);
    const filterId = urlParams.get('wpSearchFilter');
    const isSingleFilterLog = filterId && (filterId.indexOf('|') === -1);
    if (isSingleFilterLog) {
        displayOnFilterLogPage(filterId);
    }
    function displayOnFilterLogPage(filterId) {
        const contentElement = document.getElementById('mw-content-text');
        if (!contentElement)
            return;
        const summaryElement = contentElement.querySelector('.mw-specialpage-summary');
        if (!summaryElement)
            return;
        const rootElement = document.createElement('div');
        contentElement.insertBefore(rootElement, summaryElement.nextSibling);
        const treeHeader = document.createElement('h3');
        treeHeader.textContent = 'Check filter on recent log entries';
        contentElement.insertBefore(treeHeader, summaryElement.nextSibling);
        const par1 = document.createElement('p');
        par1.textContent = 'You can use this tool to evaluate the filter on a specified number of recent log entries. ' +
            'This may be useful to see what conditions are triggered and how many times.';
        rootElement.appendChild(par1);
        const form = document.createElement('form');
        rootElement.appendChild(form);
        const par2 = document.createElement('p');
        par2.textContent = 'Number of log entries to check: ';
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
        button.textContent = 'Start';
        par2.appendChild(button);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            const count = parseInt(input.value, 10);
            if (isNaN(count) || count < 1) {
                alert('Please enter a valid positive number.');
                return;
            }
            par1.remove();
            const errorContainer = document.createElement('details');
            errorContainer.style.display = 'none'; // Hide if no errors
            const errorSummary = document.createElement('summary');
            errorSummary.textContent = 'Error log';
            errorContainer.appendChild(errorSummary);
            const errorList = document.createElement('ul');
            errorContainer.appendChild(errorList);
            rootElement.appendChild(errorContainer);
            const treeRootElement = document.createElement('div');
            rootElement.appendChild(treeRootElement);
            displayFrequencyAnalysis(treeRootElement, filterId, count, (processed, isFinished, logTimestamp) => {
                if (!isFinished) {
                    par2.textContent = 'Processed ' + processed + ' / ' + count + ' log entries.';
                }
                else {
                    if (processed == count) {
                        par2.textContent = 'Processed all ' + count + ' log entries.';
                    }
                    else {
                        par2.textContent = 'Processed ' + processed + ' log entries – no more were available.';
                    }
                    if (logTimestamp) {
                        const logDate = new Date(logTimestamp);
                        par2.textContent += ' The oldest log entry is from ' + logDate.toLocaleString() + '.';
                    }
                }
            }, (error) => {
                const errorItem = document.createElement('li');
                errorItem.textContent = error.message;
                errorList.appendChild(errorItem);
                errorContainer.style.display = 'block';
            });
        });
    }
    async function displayFrequencyAnalysis(rootElement, filterId, count, progressCallback, errorCallback) {
        var _a, e_1, _b, _c;
        progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback(0, false);
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
            ? new _NodeValueFrequencyView_js__WEBPACK_IMPORTED_MODULE_0__.NodeValueFrequencyView(node)
            : null);
        gui.renderSyntaxTree(rootNode, viewFactory);
        const functionExecutor = new abuseFilter.evaluator.functions.LocalFunctionExecutor();
        const evaluator = new abuseFilter.evaluator.NodeEvaluator(functionExecutor);
        try {
            let processedCount = 0;
            let lastTimestamp;
            try {
                for (var _d = true, _e = __asyncValues(abuseFilter.api.fetchAbuseLogEntries(filterId, count)), _f; _f = await _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const logEntry = _c;
                    try {
                        const evaluationContext = new abuseFilter.evaluator.EvaluationContext();
                        const variables = logEntry.details;
                        for (const [key, value] of Object.entries(variables)) {
                            evaluationContext.setVariable(key, abuseFilter.evaluator.value.Value.fromNative(value));
                        }
                        await evaluator.evaluateNode(rootNode, evaluationContext);
                    }
                    catch (error) {
                        errorCallback === null || errorCallback === void 0 ? void 0 : errorCallback(error instanceof Error ? error : new Error('Unknown error during evaluation: ' + error));
                    }
                    // Run also for failed items, so that the total number is reported correctly
                    processedCount++;
                    lastTimestamp = logEntry.timestamp;
                    progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback(processedCount, false, lastTimestamp);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback(processedCount, true, lastTimestamp);
        }
        catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : ('' + error);
            rootElement.textContent = `Can't load the abuse filter: ${errorMessage}`;
        }
    }
});


/***/ }),
/* 51 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NodeValueFrequencyView: () => (/* binding */ NodeValueFrequencyView)
/* harmony export */ });
/* harmony import */ var _evaluator_value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _gui_value_NodeValueViewBase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(35);
/* harmony import */ var _gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(30);
/* harmony import */ var _ValueFrequencyPopup_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(52);




/**
 * A view for displaying the most frequent values of a node at multiple evaluations.
 */
class NodeValueFrequencyView extends _gui_value_NodeValueViewBase_js__WEBPACK_IMPORTED_MODULE_1__.NodeValueViewBase {
    /**
     * @param node The node for which to display the value.
     * @param evaluationContext The context for which to fetch the value.
     */
    constructor(node) {
        super();
        // This is not optimal for large data sets, but it's good enough for now
        this.values = [];
        // This is the total number of values and error sets that have been reported by the relevant node
        this.totalEvaluationsCount = 0;
        this.errors = [];
        this.updateTimeoutReference = null;
        this.element = document.createElement('button');
        this.element.classList.add('afa-silent-button');
        this.element.type = 'button';
        this.element.title = 'Click to see the value frequency';
        this.element.textContent = '...';
        this.listenToChanges(node);
        // For the initial render, display the value immediately as we are sure that there's
        // only a single initial rendering.
        this.updateViewImmediate();
        this.element.addEventListener('click', (e) => {
            const popup = new _ValueFrequencyPopup_js__WEBPACK_IMPORTED_MODULE_3__.ValueFrequencyPopup();
            popup.display(this.values, this.errors, this.element);
            // So as not to trigger expand/collapse on the parent <details>
            e.stopPropagation();
            e.preventDefault();
        });
    }
    onValueSet(value) {
        this.totalEvaluationsCount++;
        let found = false;
        for (const entry of this.values) {
            // undefined needs to be handled separately, as by definition they are never equal
            // and here we want to treat them as equal
            if (_evaluator_value_ValueComparer_js__WEBPACK_IMPORTED_MODULE_0__.ValueComparer.areEqual(entry.value, value, true) || (entry.value.isUndefined && value.isUndefined)) {
                entry.count++;
                found = true;
                break;
            }
        }
        if (!found) {
            this.values.push({ value, count: 1 });
        }
        this.scheduleViewUpdate();
    }
    onErrorSet(errors, context) {
        if (context.isSpeculative) {
            // We only display 'real' errors, not speculative ones
            return;
        }
        this.totalEvaluationsCount++;
        this.errors.unshift(...errors);
        this.scheduleViewUpdate();
    }
    /**
     * Schedule an update of the view. Updates will be performed at most once every 50ms.
     */
    scheduleViewUpdate() {
        if (this.updateTimeoutReference !== null) {
            return;
        }
        this.updateTimeoutReference = window.setTimeout(() => {
            this.updateTimeoutReference = null;
            this.updateViewImmediate();
        }, 50);
    }
    /**
     * Updates the view to show the most frequent value.
     * The update is done immediately. For performance reasons, such updates should
     * be usually deferred by a few milliseconds, so that multiple new values can be added
     * at the same time.
     */
    updateViewImmediate() {
        if (this.values.length === 0) {
            this.element.textContent = '...';
            return;
        }
        this.values.sort((a, b) => b.count - a.count);
        const mostFrequent = this.values[0];
        const frequency = mostFrequent.count / this.totalEvaluationsCount;
        if (frequency < 0.3) {
            const message = document.createElement('span');
            message.textContent = 'multiple values';
            this.setViewContent(message, null);
            return;
        }
        const maxLength = 15;
        const formattedValue = _gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_2__.ValueFormatter.formatValue(mostFrequent.value);
        if (formattedValue.textContent.length <= maxLength) {
            this.setViewContent(formattedValue, frequency);
        }
        else {
            const shortenedValue = this.shortenValue(mostFrequent.value, maxLength);
            this.setViewContent(shortenedValue, frequency);
        }
    }
    setViewContent(value, frequency) {
        this.element.textContent = '';
        this.element.appendChild(value);
        if (frequency !== null) {
            // Floor so that we don't display 100% for e.g. 99.5%
            frequency = Math.floor(frequency * 100);
            this.element.append(` (${frequency}%)`);
        }
        if (this.errors.length > 0) {
            this.element.append(`, ${this.errors.length} errors`);
        }
    }
}


/***/ }),
/* 52 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValueFrequencyPopup: () => (/* binding */ ValueFrequencyPopup)
/* harmony export */ });
/* harmony import */ var _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30);


class ValueFrequencyPopup {
    display(valueFrequencies, errors, attachToNode) {
        const content = document.createElement('div');
        if (valueFrequencies.length > 0) {
            content.appendChild(this.makeMainContent(valueFrequencies));
        }
        if (valueFrequencies.length > 0 && errors.length > 0) {
            content.appendChild(document.createElement('hr'));
        }
        if (errors.length > 0) {
            content.appendChild(this.makeErrorContent(errors));
        }
        const $anchor = attachToNode ? $(attachToNode) : undefined;
        // Adjust the popup width based on the values to be shown
        const useWidePopup = valueFrequencies.some(entry => this.isLongValue(entry.value));
        mw.loader.using(['oojs-ui-core', 'oojs-ui-widgets'], () => {
            const popup = new OO.ui.PopupWidget({
                autoClose: true,
                padded: true,
                width: useWidePopup ? window.innerWidth * 0.9 : 350,
                $content: $(content),
                $floatableContainer: $anchor,
                anchor: !!attachToNode,
                head: true,
                label: 'Value frequency',
            });
            $(document.body).append(popup.$element);
            popup.toggle(true);
        });
    }
    makeMainContent(valueFrequencies) {
        const container = document.createElement('ul');
        for (const entry of valueFrequencies) {
            const value = document.createElement('li');
            value.append(`${entry.count} times: `);
            value.appendChild(_gui_value_ValueFormatter_js__WEBPACK_IMPORTED_MODULE_1__.ValueFormatter.formatValue(entry.value, 200));
            container.appendChild(value);
        }
        return container;
    }
    makeErrorContent(errors) {
        const container = document.createElement('div');
        container.append(`Errors (${errors.length}): `);
        const list = document.createElement('ul');
        container.appendChild(list);
        for (const entry of errors) {
            const value = document.createElement('li');
            value.textContent = entry.message;
            list.appendChild(value);
        }
        return container;
    }
    isLongValue(value) {
        if (value.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.String) {
            return value.value.length >= 40;
        }
        else if (value.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array) {
            const arrayValue = value;
            const hasPotentiallyLongValues = arrayValue.value.some(v => v.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.String || v.dataType === _model_value_ValueDataType_js__WEBPACK_IMPORTED_MODULE_0__.ValueDataType.Array);
            if (hasPotentiallyLongValues) {
                return true;
            }
            return arrayValue.value.length >= 10;
        }
        else {
            // Primitive types (numbers, bools, etc.) are always considered short
            return false;
        }
    }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _public_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _gadgets_hitDetails_main_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(46);
/* harmony import */ var _gadgets_massCheck_main_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(50);
// Import the whole AbuseFilter Analyzer library

// And then include the gadgets
// They load themselves as a response to userjs.abuseFilter hook
// so we don't need to do anything else here



})();

/******/ })()
;