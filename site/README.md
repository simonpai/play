* Core narrative is like the original novel. 
* UI middleware utilizes it to do its best to represent it in another media.
* UI middleware provides player implementation, but can use information from other sources as well.
* Different type of games require different paradigms.

* If UI can block narrative?

* Can we utilize async generator?
* [Saga](https://redux-saga.js.org/)

```js
// narrative
async function* narrative() {
  yield* ...;
  yield* ...;
}

// UI
for await (const event of narrative()) {
  // this naturaly blocks
  // ...
}

// but how to pipe events from components?
```
