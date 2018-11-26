# Developing

## Setting up

You will need node 8+ and npm 5+ installed on your system.

> `$ npm install`

## Building

> `$ npm run build`

or

> `$ npm run watch`

You can also build within VSCode with the default build command.

## Design principles and guidelines

### Architecture
- Use dependency injection everywhere (no service location)
- No state stored in ES modules / no side-effects
- Boilerplate and factories shall be grouped under a special "recipe" module/folder

### Version management
- Respect semver
- Document breaking changes in CHANGELOG.md
- Make as few breaking changes as possible
- Because there is no main export, a change in anything that's exported and not marked as internal can be a breaking change

### Sub-modules and exports
- No main export (we don't want to import the entire library)
- Only export ES6/TypeScript modules
- Internal symbols must be marked with `@internal`. Files that export only internals must be named `internal.ts`
