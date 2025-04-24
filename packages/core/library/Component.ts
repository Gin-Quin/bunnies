import { get, isReactive, subscribe } from "@bunnies/signals";

export type Component = {
	name: string;
	attributes: Record<string, unknown>;
	children: Array<Component>;
	element: Element;
};

function renderHTML(component: Component): string {
	return `<${component.name} ${Object.entries(component.attributes)
		.map(([key, value]) => `${key}="${value}"`)
		.join(
			" ",
		)}>${component.children.map(renderHTML).join("")}</${component.name}>`;
}

/**
 * Binds a Bunny's component to an HTML element.
 */
function bind(component: Component, element: Element) {
	for (const name in component.attributes) {
		const attribute = component.attributes[name];
		if (isReactive(attribute)) {
			subscribe(attribute, () => {
				element.setAttribute(name, String(get(attribute)));
			});
		}
	}

	let child = element.firstElementChild;
}
