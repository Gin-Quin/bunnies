import { Component } from "./Component";

function Box();

export function Box(
	properties: Record<string, unknown> = {},
	...children: Array<Component>
) {}
