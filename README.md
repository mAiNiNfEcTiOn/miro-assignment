# Miro.com's Assignment

## How to use this

### Install dependencies
* Run `yarn` or `npm i` in the root directory of the project

### Run on development mode
* Run `yarn start` or `npm start`

### Build the artifact to deploy
* Run `yarn build` or `npm build`. This will generate a `dist` folder with the necessary files to upload.

## Where can I check this live?

Right here in this repo's github page: [https://maininfection.github.io/miro-assignment/](https://maininfection.github.io/miro-assignment/)

## API

### Usage

All JS API methods are available through the container's node.

#### addNewEmail

```js
const targetContainer = document.getElementById('emails-input');
EmailsInput(targetContainer);

targetContainer.addNewEmail();
```

This method adds a random e-mail to the input

#### getAllEmails

```js
const targetContainer = document.getElementById('emails-input');
EmailsInput(targetContainer);

const allEmails = targetContainer.getAllEmails();
```

You get something like:

```js
[
  {
    isValid: false,
    value: 'not-an-email',
  },
  {
    isValid: true,
    value: 'valid-email@domain.tld',
  }
]
```

#### replaceAllEmails

```js
const targetContainer = document.getElementById('emails-input');
EmailsInput(targetContainer);

const allEmails = targetContainer.replaceAllEmails();
```

This method removes the existing entries and adds random valid e-mails in the same quantity as before

#### subscribe

```js
const targetContainer = document.getElementById('emails-input');
EmailsInput(targetContainer);

const logEmailsStartingWithMiro = (event) => {
  event.data.forEach((entry) => {
    if (entry.data.value.toLowerCase().startsWith('miro')) {
      console.log('Found one: ', entry.value);
    }
  });
}

const unsubscribeFn = targetContainer.subscribe();
```

This method provides a similar interface that you get in an _Observable_ pattern.

Basically when you subscribe you receive changes that happen in the list of e-mails (`ADDITION` or `REMOVAL`).

The entries have the following format:

```js
{
  event: 'ADDITION'|'REMOVAL',
  data: [
    {
      isValid: false,
      value: 'not-an-email',
    },
    {
      isValid: true,
      value: 'valid-email@domain.tld',
    }
  ]
}
```

If after a certain time you'd like to unsubscribe, just execute the _unsubscribe_ function - which is provided as a return value when the subscription is created:

```js
unsubscribeFn();

// From here onwards the subscribe callback won't be executed anymore
// If you want to listen to changes again you need to subscribe again
```