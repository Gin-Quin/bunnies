import { Component } from "./Component";

export class ElementComponent extends Component {
	constructor(
		public readonly properties: Record<string, unknown> = {},
		public readonly children: Array<unknown> = [],
	) {
		super();
	}
}
