# Signals

A micro signal library working for every runtime.


## Features

- Use proxies for objects
- Can handle primitives
- Can be used as the real value
- Microtask manager
- Several utility functions: watch, subscribe, derived, effect, reactive, isReactive, isObject, get, set

## Usage

```ts
import { reactive, watch, get, set } from "signals";

const count = reactive(0);

watch(count, () => {
  console.log(count);
});

```
