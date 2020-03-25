import Firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyDVkCjkWawZ8Q3-FySWkIw5zpbQHOOW7c0",
    authDomain: "hihello-11ed0.firebaseapp.com",
    databaseURL: "https://hihello-11ed0.firebaseio.com",
    projectId: "hihello-11ed0",
    storageBucket: "hihello-11ed0.appspot.com",
    messagingSenderId: "779339698003",
    appId: "1:779339698003:web:0d996d6c6b20fc4ba41ba6"
  };
 
  const appConfig =  Firebase.initializeApp(firebaseConfig);

  export const auth = Firebase.auth();
  export const db = appConfig.database();
  export const time = Firebase.database.ServerValue.TIMESTAMP
  