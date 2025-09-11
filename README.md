# play

## axiom

Write your game logic like game logic.
* Reduce cognitive load
* Customizable

* UI implements a role in the activity

* DI
* define activity
* decorate activity?

* Natural control flow direction

* Async generator is a state machine
* Remember Redux Saga?

Challenge
* how to interrupt activity?
  * superuser
* load/save/autosave state
* scene transition





* scene vs actor
  * 1 scene to many actors
  * scene takes queued actions, morph state, and generates events
  * actor takes events and generates actions
  * or... are they the same thing?
* components
  * representation
    * UI
    * loading
    * cutscene
    * sound
    * writing?
  * computer player, NPC
  * alternative
    * auto player
    * headless
    * piecewise testing

* Keeping interface a function call -> hooks style

```js
async function main() {

  while (true) {
    // game loop

    const aftermath = await stage(sub)({});

    break;
  }

}

async function sub(context, args) {

  let state = ...; // create or load state

  while (true) {
    // stage loop
    break;
  }

  // ...
  return {}; // ...
}
```
