# Bunnies

Bunnies is a concept of a frontend framework based on signals, without any compilation step.

It's also intended to be a frontend framework built for Bun.

## Thoughts

It's impossible to have a frontend framework without either:
1. A compilation step for signals (automatically transforming values to signals in the markup)
2. DOM comparison like React
3. Or an ugly syntax (forcing users to write computed signals everyhere, like `computed(() => x + y)` instead of `x + y`)

So, I'm going to stop this project for now. My focus should really be on creating a new programming language, that solves naturally these issues, rather than trying to tweak Javascript like other frontend frameworks already did.

It was fun creating my own signal library though.
