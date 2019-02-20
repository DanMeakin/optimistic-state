# Optimistic state

This repository contains a simple example implementing optimistic state within a Redux store.

## Usage

Clone, `yarn` and open a Node repl.

Import the basics:

```
const { store } = require('./index.js');
const { addNote, updateNote, deleteNote } = require('./src/actions.js');
```

You can now get the store state and dispatch actions.

```
store.dispatch(addNote({ id: '123', note: 'Hello, world.' }));
store.dispatch(updateNote({ id: '123', note:' Goodbye, world.' }));
```

To emulate a failed API call, set a truthy `mockFail` value on the optimistic command payload object:

```
const deleteAction = deleteNote({ id: '123' });

// This is a total hack, but is just for mocking API failure so probably is okay.
action.meta.optimistic.command[1].mockFail = true;

store.dispatch(deleteAction);
```

The call should fail, resulting in the state change brought about by the delete being reversed. You can see this more clearly by subscribing to the store and printing the state to console:

```
store.subscribe(() => {
  const state = store.getState();
  console.log({ state })
})
```

This will show the state changing to its new optimistic value, and reverting again.
