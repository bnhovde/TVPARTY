# TVPARTY

Framework for building multiplayer games for the tv.

## What is it?

TVPARTY is a react app with some helpers on place for building real-time multiplayer games like kahoot or jackbox.

## Example version with games

[TVPARTY with example games](https://github.com/bnhovde/TVPARTY-example)

## Running locally:

```
npm install
npm start
```

## Creating a new game

TVPARTY provides a few helper methods and events, but it's up to you to build your own games.

> TIP: Have a look at the [example repo](https://github.com/bnhovde/TVPARTY-example) inspiration.

To create a new game:

* 1: Create a new folder in the `/Games` directory to hold your game logic.
* 2: Add any static assets (images etc) to the `/public/assets/[gameName]` folder.
* 3: Add your game to the `/Games/games.js` file to make it available to the app.
* 4: Go wild!

## API

The `GameWrapper` is a higher-order component that will provides the following props and API:

Props:

```
isHost          - (Bool)    True if host, false if player
gameData        - (Object)  All game data (real-time)
gameCode        - (String)  4-digit game code
currentPlayer   - (Object)  Current player data
currentPlayerId - (String)  Current player id
socket          - (Object)  Socket.io object (for attaching event listeners)
```

Events:

### `updateGameData(gameCode, data)`

Post updates to firebase

#### Parameters

* gameCode (String) 4-digit code of game to modify
* data (Object) Data object (replaces old data)

### `updatePlayerData(gameCode, playerId, data)`

Post updates to firebase

#### Parameters

* gameCode (String) 4-digit code of game to modify
* playerId (String) playerId to modify
* data (Object) Data object (replaces old data)

### `sendEvent(data)`

Send generic websocket event from player. (Events are sent to players in current room only!)

#### Parameters

* data (Object) Data to send

#### Example

```
  // In gamepad.js (player controller)
  this.props.sendEvent({
    type: 'submitClicked',
    player: playerName,
  });

  // In splash.js (A game host scene)
  this.props.socket.on('event', data => {
    if (data.type === 'submitClicked') {
      console.log('submit clicked!', data);
    }
  };
```

### `speak(message)`

Text-to-speech output with queuing built in using the native webSpeechAPI.

#### Parameters

* message (string) The text to read aloud

#### Example

```
  this.props.speak(`${data.name} has joined the game!`);
```

#### Tips:

If you want automatic linting (using prettier), add the prettier ext to your editor and enable `formatOnSave`.

The `/Primitives` folder contains a bunch of useful UI elements you can use. These are built with styled components. You're free to create your own UI and style it however you like.

#### Useful links

[Syncing esling with prettier](https://howtoember.wordpress.com/2017/04/20/syncing-eslint-with-prettier/)

## Authors

[Bård Nyheim Hovde](https://github.com/bnhovde) and [Audun Øygard](https://github.com/apers)
