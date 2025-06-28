import { i18n } from '../i18n/i18n.js';
import { ITreeNode } from '../model/nodes/ITreeNode.js';
import { ITreeFilter } from './filters/ITreeFilter.js';
import { INodeView } from './treeViews/INodeView.js';
import { ViewFactory } from './treeViews/ViewFactory.js';

export class AbuseFilterGUI {
    private readonly wrapperElement: HTMLElement;
    private readonly filters: ITreeFilter[];
    private rootNodeView: INodeView | null = null;
    private filterState: Record<string, boolean> = {};

    public constructor(wrapperElement: HTMLElement, filters: ITreeFilter[] = []) {
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
    public renderSyntaxTree(rootNode: ITreeNode, viewFactory?: ViewFactory): void {
        viewFactory ??= new ViewFactory();

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

    private displayExpandCollapseButton(wrapperElement: HTMLElement): void {
        const button = document.createElement('button');
        button.textContent = i18n('afa-gui-expandall');
        button.style.float = 'left';
        button.style.marginRight = '1em';
        button.addEventListener('click', () => {
            // If there are any collapsed, expand the tree
            // If there are none collapsed, collapse the tree
            const collapsedDetails = this.wrapperElement.querySelectorAll('details:not([open])') as NodeListOf<HTMLElement>;
            const shownCollapsedDetails = Array.from(collapsedDetails).filter(el => el.style.display !== 'none');

            const detailsTags = this.wrapperElement.querySelectorAll('details');
            if (shownCollapsedDetails.length > 0) {
                for (const details of detailsTags) {
                    details.setAttribute('open', '');
                }
            } else {
                for (const details of detailsTags) {
                    details.removeAttribute('open');
                }
            }
        });
        wrapperElement.prepend(button);
    }

    private displayFilterCheckboxes(filterWrapper: HTMLElement): void {
        if (this.filters.length === 0) return;

        filterWrapper.append(i18n('afa-gui-options'), ' ');
        for (const filter of this.filters) {
            const filterKey = filter.constructor.name;

            const filterCheckbox = document.createElement('input');
            filterCheckbox.type = 'checkbox';
            filterCheckbox.checked = this.filterState[filterKey] ?? false;
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
    private loadSavedFilterState(): void {
        try {
            const savedState = localStorage.getItem('afa-filter-state');
            if (savedState !== null) {
                this.filterState = JSON.parse(savedState);
            }
        } catch (e) {
            console.error('Failed to load saved filter state:', e);
            this.filterState = {};
        }
    }

    /**
     * Saves the current filter state to the local storage, so that
     * they could be reused on next page view.
     */
    private saveFilterState(): void {
        localStorage.setItem('afa-filter-state', JSON.stringify(this.filterState));
    }

    private lastDebouncedUpdate: number = 0;
    private isUpdateScheduled: boolean = false;
    /**
     * Applies the filters to the tree, but if the function was called in the
     * last 100ms, it will delay the update to prevent excessive re-rendering.
     */
    private updateFilteringDebounced(): void {
        if (this.rootNodeView === null) return;
        const delay = 100;

        if (Date.now() - this.lastDebouncedUpdate >= delay) {
            this.isUpdateScheduled = false;
            this.updateFiltering();
            this.lastDebouncedUpdate = Date.now();
            return;
        } else if (!this.isUpdateScheduled) {
            this.isUpdateScheduled = true;
            setTimeout(() => this.updateFilteringDebounced(), delay);
        }
    }

    /**
     * Reapplies the filters to the tree, based on the currently selected filters
     */
    private updateFiltering(): void {
        if (this.rootNodeView === null) return;

        const filtersToApply = this.filters.filter(
            (filter) => this.filterState[filter.constructor.name]
        );

        this.resetFilters();
        for (const filter of filtersToApply) {
            filter.apply(this.rootNodeView);
        }
    }

    /**
     * Displays all nodes in the tree, that might have been hidden by filters
     */
    private resetFilters(): void {
        const nodeQueue: INodeView[] = [this.rootNodeView!];
        while (nodeQueue.length > 0) {
            const node = nodeQueue.shift()!;
            for (const child of node.children) {
                nodeQueue.push(child);
            }
            node.show();
        }
    }
}