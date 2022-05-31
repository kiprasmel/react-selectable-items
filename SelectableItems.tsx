/* eslint-disable indent */

import React, { FC, useRef, useEffect } from "react";

export type Unselected = 0;
export type FirstItem = 1;
export type NumberWith01<T extends number = number> = Unselected | FirstItem | T;

export type IndividualItemsProps<T extends number = number> = React.HTMLAttributes<HTMLDivElement> & {
	count: NumberWith01<T>;
	nth?: NumberWith01<T>;
};

export type SelectionStrategy = "all-before-and-current" | "only-current"; // TODO `| ({ selectedUpUntil, nth }) => boolean`
export type SelectionDirection = "left-to-right" | "right-to-left";

export type Wrapper = FC<{ children: any }>;

export type SelectableItemsProps<T extends number = number> = IndividualItemsProps<T> & {
	/**
	 * inclusive
	 */
	selectedUpUntil: NumberWith01<T>;
	setSelectedUpUntil: (nthOrZero: NumberWith01<T>) => void;

	selectionStrategy: SelectionStrategy;
	/**
	 * @default {"left-to-right"}
	 */
	selectionDirection?: SelectionDirection;

	/**
	 * @default {true}
	 */
	stopPropagation?: boolean;

	/**
	 * 1st item needs to be wrapped in an additional div,
	 * because otherwise it takes the full width of the parent
	 * and clicking further to the right
	 * will toggle the 1st item, instead of doing nothing.
	 */
	isFirst?: boolean;

	ItemEmpty: React.ElementType;
	ItemSelected: React.ElementType;

	Wrapper?: Wrapper;
};

export const selectableItemsClassPrefix = "selectable-items";
export const classNames = {
	initialWrapper: selectableItemsClassPrefix + "__initial-wrapper",

	item: selectableItemsClassPrefix + "__item",
	mItemFirst: selectableItemsClassPrefix + "__item--first",
	mItemLast: selectableItemsClassPrefix + "__item--last",

	mItemStateSelected: selectableItemsClassPrefix + "__item--selected",
	mItemStateNotSelected: selectableItemsClassPrefix + "__item--not-selected",
} as const;

export function SelectableItems<T extends number = number>({
	count,
	nth = 1,
	//
	stopPropagation = true,
	//
	selectedUpUntil,
	setSelectedUpUntil,
	selectionStrategy,
	selectionDirection = "left-to-right",
	//
	isFirst = true,
	//
	ItemEmpty,
	ItemSelected,
	//
	Wrapper = ({ children }) => <div className={classNames.initialWrapper}>{children}</div>,
	//
	...props
}: SelectableItemsProps<T>) {
	let isLast: boolean;
	let hasRenderedAll: boolean;
	let nextNth: NumberWith01<T>;

	if (selectionDirection === "left-to-right") {
		isLast = nth === count;
		hasRenderedAll = nth > count;
		nextNth = (nth + 1) as NumberWith01<T>;
	} else if (selectionDirection === "right-to-left") {
		if (isFirst) {
			nth = count;
		}

		isLast = nth === 1;
		hasRenderedAll = nth <= 0;
		nextNth = (nth - 1) as NumberWith01<T>;
	} else {
		assertNever(selectionDirection);
	}

	const NoWrapper: Wrapper = ({ children }) => <>{children}</>;
	const ActualWrapper: Wrapper = isFirst ? Wrapper : NoWrapper;

	const isSelected: boolean =
		selectionStrategy === "all-before-and-current"
			? selectedUpUntil >= nth
			: selectionStrategy === "only-current"
			? selectedUpUntil === nth
			: assertNever(selectionStrategy);

	const itemClassname: string =
		classNames.item +
		(isFirst
			? " " + classNames.mItemFirst //
			: isLast
			? " " + classNames.mItemLast
			: "") +
		(isSelected
			? " " + classNames.mItemStateSelected //
			: " " + classNames.mItemStateNotSelected);

	const ItemComponent = isSelected ? ItemSelected : ItemEmpty;

	const handleSelectionClick = () => {
		const wantsToToggle = selectedUpUntil === nth;
		setSelectedUpUntil(
			wantsToToggle
				? isSelected //
					? 0
					: nth
				: nth
		);
	};

	const buttonRef = useRef<HTMLDivElement | null>(null);

	const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (stopPropagation) {
			e.stopPropagation();
		}

		handleSelectionClick();
	};

	// accessibility
	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const keys = ["Enter", "Spacebar", " "];

		if (!keys.includes(e.key)) {
			return;
		}

		e.preventDefault();

		handleSelectionClick();

		/**
		 * this will not work, because we focus,
		 * but then the component gets re-rendered
		 * & you lose the focus.
		 * see instead the `useEffect` below.
		 */
		// buttonRef.current?.focus();
	};
	useEffect(() => {
		const isTheOneSelected = selectedUpUntil === nth;
		if (buttonRef.current && isTheOneSelected) {
			buttonRef.current.focus();
		}
	}, []);

	if (hasRenderedAll) {
		return null;
	}

	return (
		<ActualWrapper>
			<div
				className={itemClassname}
				role="button"
				tabIndex={0}
				{...props}
				style={{ display: "inline-block", cursor: "pointer", ...(props.style || {}) }}
				key={nth}
				onClick={onClick}
				ref={buttonRef}
				onKeyDown={onKeyDown}
			>
				<ItemComponent />
			</div>

			<SelectableItems
				{...props}
				style={{ paddingLeft: "4px", ...(props.style || {}) }}
				//
				nth={nextNth}
				count={count}
				isFirst={false}
				//
				ItemEmpty={ItemEmpty}
				ItemSelected={ItemSelected}
				//
				stopPropagation={stopPropagation}
				//
				selectedUpUntil={selectedUpUntil}
				setSelectedUpUntil={setSelectedUpUntil}
				selectionStrategy={selectionStrategy}
				selectionDirection={selectionDirection}
				//
				Wrapper={Wrapper}
			/>
		</ActualWrapper>
	);
}

export function assertNever(x: never): never {
	throw new Error(`assertNever: expected ${x} to be never`);
}
