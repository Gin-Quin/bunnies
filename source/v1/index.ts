type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
	x: infer I,
) => void
	? I
	: never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type Subscriber = () => void;
type Unsubscriber = () => void;
type UnknownObject = Record<string | symbol, unknown>;

const $value = Symbol("value");
const $subscriptions = Symbol("subscriptions");
const $fields = Symbol("fields");

type Context = Set<Reactive<any>>;
const $scope = new Array<Context>();
let $capturer: Context | undefined;

const queueMicrotask =
	globalThis.queueMicrotask ??
	((callback: () => any) => Promise.resolve().then(callback));

const tasks = new Set<() => void>();

const queue = (callback: () => void) => {
	tasks.add(callback);
	if (tasks.size === 1) {
		queueMicrotask(() => {
			for (const task of tasks) {
				task();
			}
			tasks.clear();
		});
	}
};

const $context = {
	add(variable: Reactive<any>) {
		$capturer?.add(variable);
	},
	push: (context: Context = new Set()) => {
		$scope.push(context);
		$capturer = context;
	},
	pop: () => {
		const result = $scope.pop() ?? new Set();
		$capturer = $scope[$scope.length - 1];
		return result;
	},
};

export type Reactive<Value> = Value & {
	[$value]: Value;
	[$subscriptions]: Array<Subscriber>;
};

export function isReactive<T>(value: T): value is Reactive<T> {
	return $value in (value as any);
}

export function isReactiveObject<T>(
	value: Reactive<T> | T,
): value is ReactiveObject<T> {
	return $fields in (value as any);
}

type BroadType<T> = IsUnion<T> extends true
	? T
	: T extends number
		? number
		: T extends string
			? string
			: T extends boolean
				? boolean
				: T extends bigint
					? bigint
					: T extends symbol
						? symbol
						: T;

export class ReactivePrimitive<Value> {
	[$value]: Value;
	[$subscriptions] = new Array<Subscriber>();

	constructor(value: Value) {
		this[$value] = value;
	}

	valueOf(): Value {
		return this[$value];
	}
}

export type ReactiveObject<Value> = Reactive<Value> & {
	[$fields]: Record<string | symbol, Reactive<any>>;
};

export function get<T>(variable: Reactive<T>): T {
	if (isReactive(variable)) {
		$context.add(variable);
		return variable[$value];
	} else {
		return variable;
	}
}

export function set<T>(variable: Reactive<T>, newValue: T): Reactive<T> {
	if (newValue !== variable[$value]) {
		const oldValue = (variable[$value] = newValue);
		variable[$value] = newValue;

		if (isReactiveObject(variable)) {
			// in case of object, we reset the cached fields
			variable[$fields] = {};
		}

		for (const subscription of variable[$subscriptions]) {
			queue(subscription);
		}
	}
	return variable;
}

export function watch<T>(
	variables: Reactive<T> | Array<Reactive<T>> | Set<Reactive<T>>,
	callback: Subscriber,
): () => void {
	if (Array.isArray(variables) || variables instanceof Set) {
		const unsubscribers = new Array<Unsubscriber>();
		for (const variable of variables) {
			unsubscribers.push(watch(variable, callback));
		}
		return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
	} else {
		variables[$subscriptions].push(callback);
		return () => unsubscribe(variables, callback);
	}
}

export function subscribe<T>(
	variable: Reactive<T>,
	callback: Subscriber,
): void {
	variable[$subscriptions].push(callback);
}

export function unsubscribe<T>(
	variable: Reactive<T>,
	callback: Subscriber,
): boolean {
	const index = variable[$subscriptions].indexOf(callback);
	if (index !== -1) {
		variable[$subscriptions].splice(index, 1);
		return true;
	}
	return false;
}

export const isObject = (value: any): value is UnknownObject =>
	typeof value === "object" && value !== null;

export function reactive<Value>(value: Value): Reactive<BroadType<Value>> {
	if (!isObject(value)) {
		return new ReactivePrimitive(value) as any;
	}

	const reactiveObject = Object.create(value) as ReactiveObject<any>;
	reactiveObject[$fields] = {};
	reactiveObject[$subscriptions] = new Array<Subscriber>();
	reactiveObject[$value] = value;

	return new Proxy(reactiveObject, {
		get(target, key) {
			return (target[$fields][key] ??= reactive(target[$value][key]));
		},
		set(target, key, newValue) {
			const property = (target[$fields][key] ??= reactive(target[$value][key]));
			set(property, newValue);
			return true;
		},
	}) as any;
}

export function derived<T>(callback: () => T): Reactive<T> {
	const derivedSignal = reactive(undefined) as Reactive<T>;
	effect(() => set(derivedSignal, callback()));
	return derivedSignal;
}

export function effect(callback: () => any): void {
	// run the callback and capture the signals
	$context.push();
	callback();
	const capturedSignals = $context.pop();

	for (const signal of capturedSignals) {
		subscribe(signal, runCallback);
	}

	function runCallback() {
		$context.push();
		callback();
		const newCapturedSignals = $context.pop();

		for (const signal of capturedSignals) {
			if (!newCapturedSignals.has(signal)) {
				unsubscribe(signal, runCallback);
				capturedSignals.delete(signal);
			}
		}

		for (const signal of newCapturedSignals) {
			if (!capturedSignals.has(signal)) {
				capturedSignals.add(signal);
				subscribe(signal, runCallback);
			}
		}
	}
}

/**
	// React [63 characters]
	const [number, setNumber] = useState(0)

	setNumber(number + 1)

	// Solid [71 characters]
	const [number, setNumber] = createSignal(0)

	setNumber(number() + 1)

	// Vue [38 characters]
	const number = ref(0)

	number.value++

	// Svelte [33 characters]
	let number = $state(0)

	number++

	// Bunny 1 [52 characters]
	const number = reactive(0)

	set(number, number + 1)

	// Bunny 2 [51 characters]
	const number = reactive(0)

	number(number() + 1)

	// Bunny 3 [59 characters]
	const number = reactive(0)

	number.set(number.get() + 1)
 */
