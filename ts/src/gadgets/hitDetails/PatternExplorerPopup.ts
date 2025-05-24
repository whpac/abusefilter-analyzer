import { Match, ValueStringOperations } from '../../evaluator/value/ValueStringOperations.js';
import { ValueFormatter } from '../../gui/value/ValueFormatter.js';
import { IValue } from '../../model/value/IValue.js';

export type MatchingMode = 'regex' | 'regex-i' | 'glob' | 'substring';
export class PatternExplorerPopup {
    protected readonly pattern: IValue;
    protected readonly subject: IValue;
    protected readonly matchingMode: MatchingMode;

    /**
     * Creates a new PatternExplorerPopup instance.
     * @param pattern The regex/glob pattern or substring to be searched for
     * @param subject The whole tested string
     * @param matchingMode The matching mode, which can be 'regex', 'glob', or 'substring'
     */
    public constructor(pattern: IValue, subject: IValue, matchingMode: MatchingMode) {
        this.pattern = pattern;
        this.subject = subject;
        this.matchingMode = matchingMode;
    }

    public display(attachToNode: HTMLElement | null): void {
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

    protected makePatternBlock(): HTMLElement {
        const patternBlock = document.createElement('p');
        patternBlock.append('Pattern: ');
        patternBlock.append(ValueFormatter.formatValue(this.pattern, 100));
        return patternBlock;
    }

    protected makeSubjectBlock(): HTMLElement {
        let match: Match | null = null;
        if (this.matchingMode === 'substring') {
            match = ValueStringOperations.matchSubstring(this.subject, this.pattern);
        } else if (this.matchingMode === 'glob') {
            match = ValueStringOperations.matchGlob(this.subject, this.pattern);
        } else {
            match = ValueStringOperations.matchRegex(this.subject, this.pattern, this.matchingMode === 'regex-i');
        }

        if (match === null) {
            console.log(`PatternExplorerPopup: No match found for pattern "${this.pattern.asString().value}" in subject "${this.subject.asString().value}". Matching mode: ${this.matchingMode}`);
            const noMatchBlock = document.createElement('p');
            noMatchBlock.textContent = 'No match found';
            return noMatchBlock;
        }

        // This intentionally does not format the subject as usual, because it it
        // for sure a string and we don't want to be sensitive to what the formatter does.
        return this.extractAndHighlightMatch(this.subject.asString().value!, match, 250);
    }

    protected isLongValue(value: IValue): boolean {
        // A value is considered long if it has more than 40 characters
        return value.asString().value!.length > 40;
    }

    protected extractAndHighlightMatch(str: string, match: Match, windowSize: number): HTMLElement {
        const wrapper = document.createElement('p');
        wrapper.classList.add('afa-value', 'afa-value-string');
        wrapper.append('"');
        if (match.start > 0) {
            const fragmentStart = match.start < windowSize ? 0 : match.start - windowSize;
            const leadingFragment = str.substring(fragmentStart, match.start);
            wrapper.append(ValueFormatter.escapeString(leadingFragment));
        }

        const highlightedPart = document.createElement('mark');
        const matchedFragment = str.substring(match.start, match.end);
        highlightedPart.textContent = ValueFormatter.escapeString(matchedFragment);
        wrapper.appendChild(highlightedPart);

        if (match.end < str.length) {
            const fragmentEnd = match.end + windowSize < str.length ? match.end + windowSize : str.length;
            const trailingFragment = str.substring(match.end, fragmentEnd);
            wrapper.append(ValueFormatter.escapeString(trailingFragment));
        }
        wrapper.append('"');
        return wrapper;
    }
}

export type ValueFrequencies = {
    value: IValue,
    count: number
}[];
