import { AbuseFilter } from './AbuseFilter.js';
import { AbuseFilterGUI } from './gui/AbuseFilterGUI.js';

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
filter.flattenAssociativeOperators();
const gui = new AbuseFilterGUI(document.getElementById('bodyContent') ?? document.body);
gui.renderSyntaxTree(filter);
filter.evaluate();
