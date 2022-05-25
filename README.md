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
	/>
}
	
function StarEmpty() {
	return <span>⭐</span>
}

function StarFilled() {
	return <span>🌠</span>
}

```

## License

[MIT](./LICENSE) (c) 2022 Kipras Melnikovas

