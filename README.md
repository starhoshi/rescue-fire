# rescue-fire

The deployment of Cloud Functions is very slow. Deployment is normally completed in 30 seconds, but it can take more than 10 minutes. It is a waste of time to wait a few minutes just by rewriting one line.

Let's emulate functions locally with rescue-fire and do TDD.

## TODO

* [x] Firestore
* [ ] Realtime Database
* [ ] Analytics
* [ ] Auth
* [ ] Pub/Sub
* [ ] Strage

## Concept

rescue-fire can only create `functions.Event <DeltaDocumentSnapshot>`. But this is enough to simulate Cloud Functions.

Let's write a Cloud Functions test with this event.

## Note

The event created by rescue-fire is not complete. We think that it is enough to write tests, but keep in mind that it is different from the actual event.

## Installation

```
npm install rescue-fire --only=dev
yarn add --dev rescue-fire
```

## Usage

orderable.ts uses rescue-fire to write tests. please refer.
https://github.com/starhoshi/orderable.ts/blob/master/orderable/src/__tests__/orderable.test.ts

### 1. Prepare Google Cloud Account Credentials

Download the service account key json file.

[https://firebase.google.com/docs/admin/setup?authuser=0#add_firebase_to_your_app](https://firebase.google.com/docs/admin/setup?authuser=0#add_firebase_to_your_app)

This json file is sensitive, be careful.

> Important: This file contains sensitive information, including your service account's private encryption key. Keep it confidential and never store it in a public repository.

### 2. Install testing library

Please use your favorite testing library.

For example, in the case of [Jest](https://facebook.github.io/jest/):

```
npm install jest --only=dev
yarn add --dev jest
```

### 3. Write a test

Let's create a function to update name when user is created. The code of the function is as follows.

This sample is written in TypeScript.

```ts
const changeName = (event: functions.Event<DeltaDocumentSnapshot>) => {
  console.log('old name', event.data.data().name)
  return event.data.ref.update({ name: 'new name' })
}
```

The test will be like this.

```ts
import 'jest'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as Rescue from 'rescue-fire'

// Set up to run firebase in local.
beforeAll(() => {
  const serviceAccount = require('./your-firebase-adminsdk.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
})

test('update name', async () => {
  // prepare
  const data = {name: 'name'}
  const user = await admin.firestore().collection('user').add(data)
  const event = Rescue.event(user, data)

  // start Cloud Functions
  await changeName(event)

  // expect name changed
  const updatedUser = await admin.firestore().collection('user').doc(user.id).get()
  expect(updatedUser.data()!.name).toBe('new name')
})
```

Cloud Functions can be developed with TDD. :tada: (strictly not TDD :smile:)  
This is a very small function, but larger functions can also be developed in this way.

Optional Parameters defenitions is [here](https://github.com/starhoshi/rescue-fire/blob/master/src/index.ts#L18).

### 4. Finally, create Functions

```ts
exports.updateUser = functions.firestore
  .document('users/{userId}')
  .onCreate(event => {
    return changeName(event)
})
```

Let's take a coffee break while deploying.
