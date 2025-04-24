import { signal, computed, effect, tick } from "@maverick-js/signals"

const value = signal(12)
const doubled = computed(() => value() * 2)

console.log("Doubled value:", doubled())

effect(() => console.log("YOOOOOOO Value changed!", value()))
effect(() => console.log("YOOOOOOO Value changed!", value()))
effect(() => console.log("YOOOOOOO Value changed!", value()))
effect(() => console.log("AHAHAH Value changed!", value()))
effect(() => console.log("Doubled value changed!", doubled()))
effect(() => console.log("HEHEHE Doubled value changed!", doubled()))

value.set(21)

console.log({ value, doubled })



return <Component
	style={{
		color: 'red', // statique
		fontSize: 2 * size, // dynamique
	}}
>
	Hello world
</Component>

return [
	Component {
		style.color = 'red'
		style.fontSize = 2 * size
		
		- Text { "Hello world" }
	}
]


return Box {
	align = "center"

	- Button {}
	- Button {}
}

return Box({
	align = "center"
}, [
	Button()
	Button()
])

return Box({
	align: "center"
}, [
	Button(),
	Button(),
])

return Button({
	label: "Click me"
})


// #1 Svelte
<div
	class="Field {variant}"
	style:height={resolveSize(height)}
	style:flex={flex ? 1 : undefined}
	on:click
	on:keydown
	role="textbox"
	tabindex={undefined}
>
	{#if $$slots.before}
		<div class="before">
			<slot name="before" />
		</div>
	{/if}

	<div class="content">
		<div class="label">
			<slot name="label">
				{label}
			</slot>
		</div>
		<div class="value">
			<slot />
		</div>
	</div>

	{#if $$slots.after}
		<div class="after">
			<slot name="after" />
		</div>
	{/if}
</div>


// #2 Typescript
div({
	class: `Field ${variant}`,
	style: {
		height: resolveSize(height),
		flex: flex ? 1 : undefined,
	},
	onClick,
	onKeydown,
	role: "textbox",
	tabindex: undefined,
}, [
	before && div({
		class: "before"
	}, [before()]),

	div({
		class: "content"
	}, [
		div({
			class: "label"
		}, [label]),
	])

	after && div({
		class: "after"
	}, [after()]),
])

// #3 Fa
Box {
	className = `Field ${variant}`
	style.height = resolveSize(height)
	style.flex = flex ? 1 : undefined

	role = "textbox"
	tabindex = undefined

	onClick
	onKeydown

	- before && Box {
		className = "before"
		- before()
	}

	- label
	- ...children

	- after && Box {
		className = "after"
		- after()
	}
}
