import * as firebase from 'firebase';
import config from './../constants/config';

firebase.initializeApp(config);

export function createGame(gameData) {
  return firebase
    .database()
    .ref(`games/${gameData.gameCode}`)
    .set(gameData);
}

export function fetchGames() {
  return firebase
    .database()
    .ref('games')
    .orderByKey();
}

export function addPlayerToGame(gameCode, playerData) {
  return firebase
    .database()
    .ref(`games/${gameCode}/players`)
    .push(playerData);
}

export function updatePlayer(gameCode, playerId, newPlayerData) {
  return firebase
    .database()
    .ref(`games/${gameCode}/players/${playerId}`)
    .set(newPlayerData);
}

export function updateGame(gameCode, newGameData) {
  return firebase
    .database()
    .ref(`games/${gameCode}`)
    .set(newGameData);
}

export function fetchGameByCode(code) {
  return firebase.database().ref(`games/${code}`);
}

export default firebase;
