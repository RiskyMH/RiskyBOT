# `discord-api-parser`

A package that works like a wrapper and parses raw Discord API.

This basically accepts the raw HTTP response and puts it into classes with types.

## Notes

This is not fully designed to be used as a library, but rather to just help with the RiskyBOT project.

## Examples

### Parsing a User

```js
import { User } from "discord-api-parser";

const user = new User(rawUser);
```

### Parsing an Interaction

```js
import { parseRawInteraction } from "discord-api-parser";

const interaction = parseRawInteraction(rawInteraction);
```

Or parsing an Interaction and knowing the type of interaction:

```js
import { ChatInputInteraction } from "discord-api-parser";

const interaction = new ChatInputInteraction(rawInteraction);
```
