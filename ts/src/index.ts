// Import the whole AbuseFilter Analyzer library
import './public_api.js';

// And then include the gadgets
// They load themselves as a response to userjs.abuseFilter hook
// so we don't need to do anything else here
import './gadgets/hitDetails/main.js';
import './gadgets/massCheck/main.js';
