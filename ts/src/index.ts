import { AbuseFilter } from './AbuseFilter.js';
import { TreeNodeType } from './model/nodes/TreeNodeType.js';
import { IValue } from './model/value/IValue.js';
import { ValueDataType } from './model/value/ValueDataType.js';

// Sample code to evaluate an AbuseFilter from wptest1.t

const filterText = `/* Filter 30 from English Wikipedia (large deletion from article by new editors) */
user_groups_test := ["*"];
new_size_test := 100;
article_namespace_test := 0;
edit_delta_test := -5000;
added_lines_test := '';

!("autoconfirmed" in user_groups_test) & (new_size_test > 50) & (article_namespace_test == 0) &
	(edit_delta_test < -2000) & !("#redirect" in lcase(added_lines_test))
`;

const filter = new AbuseFilter(filterText);
filter.evaluate().then((value) => {
    filter.walkTree((node, value, depth) => {
        const indent = '  '.repeat(depth);
        let nodeIdentity = `(${node.identity.type} ${node.identity.value})`;
        switch (node.type) {
            // Skip identity for certain node types when it's not useful
            case TreeNodeType.Assignment:
            case TreeNodeType.ArrayDefinition:
                nodeIdentity = '';
                break;
            // Function names will always be identifiers
            case TreeNodeType.FunctionCall:
                nodeIdentity = `(${node.identity.value})`;
                break;
        }
        console.log(`${indent}${node.type}${nodeIdentity} -> ${formatValue(value)}`);
    });

    console.log(`\nResult: ${formatValue(value)}`);
});

function formatValue(value: IValue): string {
    const dataType = value.dataType;
    if (dataType === ValueDataType.Undefined) {
        return dataType;
    }
    const actualValue = value.value;
    return `${dataType}(${actualValue})`;
}