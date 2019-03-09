
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

var regex = /@[^#@:]+#[0-9]+/gm;
var nameRegex = /@([^#@:]+)#[0-9]+/gm;
var idRegex = /@[^#@:]+#([0-9]+)/gm;

const checkpoint = 1;
const endFile = "./thanks.html";
const commentForm = "d/e/1FAIpQLSdBKir7bWWnYQEfx2mT5TR_3UHlEhX8_5rP5vcUB6Q9RVNbfA";

function OK() {
    var rawName = document.getElementById('Name').value;
    regex.lastIndex = 0;
    if (regex.exec(rawName) == null) {
        displayError("please enter your name like it was mentioned");
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
        databaseRef.child(name + id).update({
            checkpoint: checkpoint,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(function (snapshot) {
            saveComment(comment);
            sleep(500);
            window.location.href = endFile;
        }, function (error) {
            databaseRef.child(name + id).once('value').then(function (snapshot) {
                if (snapshot.exists()) {
                    if (snapshot.child("checkpoint").val() == checkpoint) {
                        window.location.href = endFile;
                        //displayError("you can only check in once at each checkpoint");
                    } else {
                        displayError("you reached this checkpoint to fast. Try again later and please report to mod to maybe decrease minimum time.");
                    }
                } else {
                    displayError("account not found: use exact same @ as last time");
                }
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

function saveComment(comment) {
    if(comment === "") return;
    $.ajax({
        url: "https://docs.google.com/forms/" + commentForm + "/formResponse",
        type: "post",
        data: {
            "entry.939889251": checkpoint,
            "entry.427085054": comment
        },
        success: function (data) {
        }
    });
}

function sleep(milliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + milliseconds >= new Date().getTime()) {
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