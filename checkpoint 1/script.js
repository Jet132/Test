
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
    } catch (err) {
        console.log(err);
        displayError("press F12 and copy error to report to mod");
        return;
    }
    var comment = document.getElementById('Comment').value;
    if (comment.length > 200) {
        displayError("comment is longer then 200 characters");
        return;
    }
    try {
        databaseRef.child(name + id).set({
            name: name,
            id: id,
            checkpoints: {
                check1: {
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    comment: comment
                }
            }
        }).then(function (snapshot) {
            window.location.href = "./thanks.html";
        }, function (error) {
            databaseRef.child(name + id).child("checkpoints").child("check" + checkpoint).set({
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                comment: comment
            }).then(function (snapshot) {
                window.location.href = "./thanks.html";
            }, function (error) {
                console.log(error);
                displayError("press F12 and copy error to report to mod");
            });

        });
    } catch (err) {
        console.log(err);
        displayError("press F12 and copy error to report to mod");
    }
}

function displayError(error) {
    deleteError();
    var footer = document.createElement("footer");
    var fclass = document.createAttribute("class");
    fclass.value = "w3-container w3-red w3-round";
    var fid = document.createAttribute("id");
    fid.value = "error";
    footer.setAttributeNode(fclass);
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