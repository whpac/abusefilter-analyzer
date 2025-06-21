NOTE: This repository is being developed at [Wikimedia GitLab](https://gitlab.wikimedia.org/msz2001/abusefilter-analyzer). If you're seeing this on GitHub and would like to create a new issue, please navigate to GitLab.

# MediaWiki AbuseFilter library for client-side use

This library is basically a reimplementation of MediaWiki [AbuseFilter engine](https://www.mediawiki.org/wiki/Extension:AbuseFilter) for JavaScript, so that rules can be run and debugged directly in the browser.

AbuseFilter is an extension to MediaWiki that enables administrators to configure rules to be evaluated before an edit it saved or some other actions are performed. If one of these rules match, it can prevent the user from completing the action. Other measures can be taken as well.

The user interface of AbuseFilter extension allows administrators to view all the actions that matched any of the filters. However, there is no built-in debugger for that. Therefore, invocations of any complex filter may prove hard to analyse, especially when the action seems to be a false-positive result.

This repository contains a library for processing the abuse filters in JavaScript environments as well as a few gadgets designed specifically for use inside MediaWiki to help administrators with their work.

*This library has been developed independently from the original AbuseFilter extension and by no means is a part of it.*

## Included gadgets
* [Hit Details](./ts/src/gadgets/hitDetails/main.ts) – the most basic gadget around abuse filters. It renders a syntax tree and displays values in its every node. It can be really useful when inspecting details of a single abuse log entry, in order to better know what caused the filter to be triggered on an action.
* [Mass Check](./ts/src/gadgets/massCheck/main.ts) – it has a similar functionality to Hit Details, but is used on a series of hits of the same filter. It can be used to look for unnecessary conditions inside the filters, as it can summarize values in each tree node from multiple invocations.

## Use cases for JavaScript AbuseFilter library

As the AbuseFilter API does not provide options to inspect the data flow during filter execution, this library has been written. It mimicks the characteristics of original filter parser and evaluator, but exposes the whole sytax tree and allows for detailed inspection of values in every of the tree nodes.

The most basic application of this library is to help abuse filter editors to debug the filters. However, since it's designed to be highly extensible, gadget creators can reuse this library to perform other tasks related to abuse filters.

Since this library is (almost*) completely run in the user browser, it's not limited by any rate limits or insufficient priviledges that a user could be normally subject to. Thus, it can be exploited for instance to prepare a frequency analysis of which rules are the most commonly matched (which in turn, could help optimize the filters).

*Almost all actions are run in the browser – only the `ccnorm` function family is deferred to the MediaWiki server. The original character substitution table comprises of almost 10k rules that, expessed as code, weighs around 100kB of unnecessary burden. This behavior will eventually change, but for now these functions are run on the server. This means that only users with enough priviledges on the wiki can run them.

### Features

Below are notable features of this library:
* Calculate and retain values in every node of the syntax tree.
* Evaluate the whole tree, even if short-circuiting would normally happen (but the rest of the tree is executed speculatively, without impact on the final result).
* Report evaluation errors where they happen, but continue evaluation.
* Supports PCRE regex syntax.
* Adaptable to various use cases.
* A single syntax tree can be evaluated multiple times (for different contexts) and all results will be kept.

### Known limitations

* The library is not yet internationalizable. Most of the messages are in English, while some errors are just code strings.
* It's impossible to create `AbuseFilter` objects, using a version of a filter older than the most recent: MediaWiki does not provide API for this.
* Some variables are generated and saved by AbuseFilter only if they are explicitly read by the filter (in the specific execution path). Therefore, if you are loading an existing log entry, some variables could be `null`, even though they would have another value at the actual execution.
* `ccnorm` family functions are not implemented yet.
* PCRE regular expressions are translated into native JS objects using a custom-build library. It can be imperfect.

## Library documentation

The library is exposed under `mw.libs.abusefilter` global object. It consists of four more or less independent packages:
* [Parser](./docs/Parser.md) (`mw.libs.abusefilter.parser`) – code responsible for filter tokenization and parsing is here;
* [Evaluator](./docs/Evaluator.md) (`mw.libs.abusefilter.evaluator`) – implements the logic to handle values and operations on them, including functions defined by the AbuseFilter extension;
* [Tree transformations](./docs/Transform.md) (`mw.libs.abusefilter.transform`) – stores code that transforms syntax trees;
* [GUI](./docs/GUI.md) (`mw.libs.abusefilter.gui`) – module responsible for displaying the syntax tree and parts of it.

This division into packages resembles how [source TypeScript](./ts/src/) files are structured in this repo. There's however one additional TS package present – [`model`](./docs/Model.md) – that contains interfaces and enums used by other packages. As it doesn't contain any executable code, it's not exported to JavaScript distribution files. Documentation for this module provides some insights into this library's internal data model.

Apart from the above-mentioned packages, there are two classes available outside of any package: `AbuseFilter` and `api`. The first provides a general interface for working with abuse filters, dispatching all necessary operations to proper packages. The latter is a helper object for handling requests to MediaWiki API, regarding filters.

More detailed documentation can be found in the linked files.

## Examples

In the example below, the abuse log entry with id 123 is fetched from the wiki you're currently on. It's then parsed and evaluated in the context of fetched log details. The obtained value is displayed in an alert window.
```js
const filter = await mw.libs.abuseFilter.createFromLogId(123);
const value = await filter.evaluate();
alert(value.toLiteral());
```

The second example, in turn, illustrates how a filter can be constructed from scratch. The provided expression will be parsed and evaluated with the specified variables.
```js
const filter = new mw.libs.abusefilter.AbuseFilter('true & foo == "bar"');
filter.setVariable('foo', 'bar');
const value = await filter.evaluate();
if (value.isTruthy()) {
    alert('The filter matched');
} else {
    alert('The filter did not match');
}
```

`AbuseFilter` constructor is good for simple use cases. Some more complex could require the user to manually set up objects that take part in the parsing and evaluation processes. See the constructor of [`AbuseFilter` class](./ts/src/AbuseFilter.ts) for an example or refer to documentations of the relevant modules, as linked above.

## Building

This repository contains the source TypeScript files. In order to use it, you'll likely need to compile them into JavaScript. This can be done by running `npm run build`. This will first generate output files in the `js/` directory and then combine them into a single output: `dist/abusefilter-analyzer.js`.

## License

The code provided in this repository is licensed under the GNU GPLv2 license.

If you are reusing the combined JavaScript file, it's sufficient to include a link to the [LICENSE](./LICENSE) file to fulfill the requirement of attaching a permission notice with this software.

This software includes files based on the original work of [AbuseFilter](https://www.mediawiki.org/wiki/Extension:AbuseFilter) authors, which is available under the GNU GPLv2 license. Origin of such files is denoted in their headers, with link to the source code and description of the changes that were made.
