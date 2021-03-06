# Puzzl

Puzzl is a modular JavaScript library, usable in both browser and server environments (ES6+).

The main goal is to fill-in some gaps created by the lack of a "standard" JS library. It provides features ranging from basic algorithms and primitives to complex design patterns.

## Prerequisites

### Browser (_`@puzzl/core`, `@puzzl/browser`_)
- Chrome, Firefox, Safari, Edge (only tested against latest versions, mobile is supported)
- Webpack or similar bundler that consumes ES6 modules
- IE11 is NOT officially supported, but some modules might work, if transpiled to ES5 with appropriate polyfills. Use at own risk.

### Server (_`@puzzl/core`_)
- NodeJS v8+
- _Optional_: A runtime ES6 module loader, such as [esm](https://www.npmjs.com/package/esm) or a compile step via Babel, Webpack etc. As a fallback, a CommonJS-compatible build is provided (See [usage](#usage) below).

## Getting started

### Installation

#### Core library
> `npm install @puzzl/core --save-dev`
#### Browser library
> `npm install @puzzl/browser --save-dev`

### Usage

Puzzl doesn't provide a main export, but instead exposes ES6 modules in a structured folder tree. Everything is public and can be imported directly, unless it is marked as `@internal` with a doc-block or the filename contains the keyword `internal`.

```ts
import { capitalize } from "@puzzl/core/lib/string";

console.log(capitalize("john")); // John
```

#### CommonJS compatibility (_`@puzzl/core`_)
Just import from `cjs/` instead of `lib/`:

```ts
import { capitalize } from "@puzzl/core/cjs/string";
```

## Documentation

Each exported class or function has a corresponding doc-block that explains its basic usage, with a basic example where needed. An IDE such as VSCode should pick these up automatically.

More advanced examples can be found in [packages/example/src](packages/example/src).

## Versioning

Puzzl respects [semver](https://semver.org/).

## TypeScript support

Puzzl is a first-class (pun intended) TypeScript citizen.
