import React from "react";

export type Unselected = 0;
export type FirstItem = 1;
export type NumberWith01<T extends number = number> = Unselected | FirstItem | T;

export type IndividualItemsProps<T extends number = number> = React.HTMLAttributes<HTMLDivElement> & {
	count: NumberWith01<T>;
	nth?: NumberWith01<T>;
};

export type SelectionStrategy = "all-before-and-current" | "only-current" | "current-and-all-after"; // TODO `| ({ selectedUpUntil, nth }) => boolean`

export type SelectableItemsProps<T extends number = number> = IndividualItemsProps<T> & {
	/**
	 * inclusive
	 */
	selectedUpUntil: NumberWith01<T>;
	setSelectedUpUntil: (nthOrZero: NumberWith01<T>) => void;
	selectionStrategy: SelectionStrategy;

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
};

export function SelectableItems<T extends number = number>({
	count,
	nth = 1,
	//
	stopPropagation = true,
	//
	selectedUpUntil,
	setSelectedUpUntil,
	selectionStrategy,
	//
	isFirst = true,
	//
	ItemEmpty,
	ItemSelected,
	//
	...props
}: SelectableItemsProps<T>) {
	if (count <= 0) {
		return null;
	}
	/**
	 * hard to prove with types, but the `count <= 0`
	 * check above should cover it.
	 */
	const nextNth: NumberWith01<T> = (nth + 1) as NumberWith01<T>;
	const nextCount: NumberWith01<T> = (count - 1) as NumberWith01<T>;

	// const A = ({ children }: React.PropsWithChildren<{}>) => <div>{children}</div>;
	const A = ({ children }: any) => <div>{children}</div>;
	const B = ({ children }: any) => <>{children}</>;
	const Wrapper = isFirst ? A : B;

	const isSelected: boolean =
		selectionStrategy === "all-before-and-current"
			? selectedUpUntil >= nth
			: selectionStrategy === "only-current"
			? selectedUpUntil === nth
			: selectionStrategy === "current-and-all-after"
			? selectedUpUntil <= nth
			: assertNever(selectionStrategy);

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

	const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (stopPropagation) {
			e.stopPropagation();
		}

		handleSelectionClick();
	};

	return (
		<Wrapper>
			<div
				role="button"
				tabIndex={0}
				{...props}
				style={{ display: "inline", ...(props.style || {}) }}
				key={count}
				onClick={onClick}
			>
				<ItemComponent />

				<SelectableItems
					{...props}
					style={{ marginLeft: "4px", ...(props.style || {}) }}
					//
					nth={nextNth}
					count={nextCount}
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
				/>
			</div>
		</Wrapper>
	);
}

export function assertNever(x: never): never {
	throw new Error(`assertNever: expected ${x} to be never`);
}

