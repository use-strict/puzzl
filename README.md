# Puzzle

Puzzle is a modular JavaScript library, usable in both browser and server environments (ES6+).

The main goal is to fill-in some gaps created by the lack of a "standard" JS library. It provides features ranging from basic algorithms and primitives to complex design patterns.

## Prerequisites

An environment supporting ES6 (ES2015) or newer.

### Server
- NodeJS v8+

### Browser
- Webpack or similar bundler supporting ES6
- Chrome, Firefox, Safari, Edge (only tested against latest versions, mobile is supported)
- IE11 is NOT officially supported, but some modules might work, provided they are transpiled to ES5 with appropriate polyfills

## Getting started

### Installation

#### Core library:
> `npm install @puzzle/core --save-dev`
#### Browser library:
> `npm install @puzzle/browser --save-dev`

### Usage

Puzzle doesn't provide a main export, but instead exposes ES6 modules in a structured folder tree. Everything is public and can be imported directly, unless it is marked as `@internal` with a doc-block or the filename contains the keyword `internal`.

```ts
import { capitalize } from "@puzzle/core/lib/string";

console.log(capitalize("john")); // John
```

## Documentation

Each exported class or function has a corresponding doc-block that explains its basic usage, with a basic example where needed. An IDE such as VSCode should pick these up automatically.

More advanced examples can be found in [packages/example/src](packages/example/src).

## Versioning

Puzzle respects [https://semver.org/](semver).

## TypeScript support

Puzzle is a first-class (pun intended) TypeScript citizen.
