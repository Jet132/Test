
var config = {
    apiKey: "AIzaSyDiCiSDgtMdiBld4gExarNqPScJ6NbvLGY",
    authDomain: "cb-puzzel.firebaseapp.com",
    databaseURL: "https://cb-puzzel.firebaseio.com",
    projectId: "cb-puzzel",
    storageBucket: "cb-puzzel.appspot.com",
    messagingSenderId: "280161814307"
};
firebase.initializeApp(config);
var databaseRef = firebase.database().ref('users/');

const nameRegex = /@([a-zA-Z]+)#[0-9]+/gm;
const idRegex = /@[a-zA-Z]+#([0-9]+)/gm;

const checkpoint = 1;

function OK() {
    var rawName = document.getElementById('Name').value;
    var name = nameRegex.exec(rawName)[1];
    var id = parseInt(idRegex.exec(rawName)[1]);

    createAccount(name, id);

    var comment = document.getElementById('Comment').value;
    saveCheckpoint(name, id, comment);

    console.log(rawName, name, id, comment);
}

function createAccount(name, id) {
    databaseRef.child(name + id).set({
        name: name,
        id: id,
    });
}

function saveCheckpoint(name, id, comment) {
    var timestamp = new Date().getTime();

    databaseRef.child(name + id).child("checkpoints").child(checkpoint).set({
        timestamp: timestamp,
        comment: comment,
    });
}