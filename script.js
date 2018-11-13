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

const regex = /@[^#@:]+#[0-9]+/gm;
const nameRegex = /@([^#@:]+)#[0-9]+/gm;
const idRegex = /@[^#@:]+#([0-9]+)/gm;

const checkpoint = 1;

function OK() {
    deleteError();
    var rawName = document.getElementById('Name').value;
    regex.lastIndex = 0;
    if (regex.exec(rawName) == null) {
        displayError("please enter your name like it was @ed");
        return;
    }
    nameRegex.lastIndex = 0;
    idRegex.lastIndex = 0;
    try {
        var name = nameRegex.exec(rawName)[1];
        var id = parseInt(idRegex.exec(rawName)[1]);
        var comment = document.getElementById('Comment').value;
    } catch (err) {
        displayError("press F12 and copy error to report to mod");
    }

    try {
        createAccount(name, id, comment);
    } catch (err) {
        displayError("press F12 and copy error to report to mod");
    }

    console.log(rawName, name, id, comment);
    deleteError();
    window.location.href = "./thanks.html"
    //window.close();
}

function createAccount(name, id, comment) {
    databaseRef.child(name + id).once('value').then(function (snapshot) {
        if (snapshot.exists()) {
            console.log("Account already created");
            saveCheckpoint(name, id, comment);
        } else {
            var timestamp = new Date().getTime();
            databaseRef.child(name + id).set({
                name: name,
                id: id,
                checkpoints: {
                    check1: {
                        timestamp: timestamp,
                        comment: comment
                    }
                }
            });
        }
    });
    
}

function saveCheckpoint(name, id, comment) {
    var timestamp = new Date().getTime();
    databaseRef.child(name + id).child("checkpoints").child("check"+checkpoint).set({
        timestamp: timestamp,
        comment: comment
    });
}

function displayError(error) {
    var footer = document.createElement("footer");
    var fatt = document.createAttribute("class");
    fatt.value = "w3-container w3-red w3-round";
    var fid = document.createAttribute("id");
    fid.value = "error";
    footer.setAttributeNode(fatt);
    footer.setAttributeNode(fid);

    var para = document.createElement("p");
    var text = document.createTextNode("ERROR: " + error);
    para.appendChild(text);

    footer.appendChild(para);
    var parent = document.getElementById('card');
    parent.appendChild(footer);
}

function deleteError() {
    var parent = document.getElementById('card');
    var error = document.getElementById('error');
    if (error == null) {
        return;
    }
    parent.removeChild(error);
}