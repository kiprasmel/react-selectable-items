# react-selectable-items

render a row of selectable items

## example

create a feedback rating component with stars as the items

```ts
import { SelectableItems, Unselected } from 'react-selectable-items'

type FeedbackRating = Unselected | 1 | 2 | 3 | 4 | 5

export function Stars() {
	const [starsSelectedUpUntil, setStarsSelectedUpUntil] = useState<FeedbackRating>(0)
	
	console.log({ starsSelectedUpUntil })

	return <SelectableItems<FeedbackRating>
		count={5}
		
		ItemEmpty={StarEmpty}
		ItemSelected={StarFilled}
		
		selectedUpUntil={starsSelectedUpUntil}
		setSelectedUpUntil={setStarsSelectedUpUntil}
		
		selectionStrategy="all-before-and-current"
		selectionDirection="left-to-right"
	/>
}
	
function StarEmpty() {
	return <span>⭐</span>
}

function StarFilled() {
	return <span>🌠</span>
}

```

### styling

though, we've never actually used this ourselves

```css
.selectable-items__initial-wrapper { }

.selectable-items__item { }

.selectable-items__item--selected { }
.selectable-items__item--not-selected { }

.selectable-items__item--first { }
.selectable-items__item--last { }

```

## example with an error state

you can do all the same, but additionally provide a `Wrapper` prop,
thus overriding our default & very minimal wrapper,
and in your Wrapper you can e.g. show a red border if the field was required but wasn't selected.

```ts
import styled from '@emotion/styled';

export function Stars() {
	const [starsSelectedUpUntil, setStarsSelectedUpUntil] = useState<FeedbackRating>(0)
	const [hasError, setHasError] = useState<boolean>(false)

	return <SelectableItems<FeedbackRating>
		count={5}
		
		ItemEmpty={StarEmpty}
		ItemSelected={StarFilled}
		
		selectedUpUntil={starsSelectedUpUntil}
		setSelectedUpUntil={setStarsSelectedUpUntil}
		
		selectionStrategy="all-before-and-current"
		selectionDirection="left-to-right"

		Wrapper={({ children }) => (
			<ErrorBorderWrapper hasError={!!hasError}>
				{children}
			</ErrorBorderWrapper>
		)}
	/>
}

const ErrorBorderWrapper = styled.div<{ hasError: boolean }>`
	display: inline-block;

	${({ hasError }) =>
		!hasError
			? ``
			: `
		border: 1px solid red;
		border-radius: 4px;
	`}
`;

```

## License

[MIT](./LICENSE) (c) 2022 Kipras Melnikovas
