import { derived, get, reactive, set, watch } from "../source/v1/index";

const value = reactive(12);
const branch = reactive(true);
const a = reactive(1);
const b = reactive(2);
const doubled = derived(() => get(value) * 2);
const branched = derived(() => (get(branch) ? get(a) : get(b)));

console.log("Doubled value:", get(doubled));

watch(doubled, () => console.log("Doubled value changed!", get(doubled)));

watch(value, () => console.log("YOOOOOOO Value changed!", get(value)));
watch(value, () => console.log("AHAHAH Value changed!", get(value)));

// watch(branch, () => console.log("Branch changed!", get(branch)));
// watch(a, () => console.log("A changed!", get(a)));
// watch(b, () => console.log("B changed!", get(b)));
// watch(branched, () => console.log("Branched value changed!", get(branched)));

set(value, 21);
set(value, 22);

// set(branch, false);
// set(a, 10);
// set(b, 20);
