
var config = {
    apiKey: "AIzaSyDiCiSDgtMdiBld4gExarNqPScJ6NbvLGY",
    authDomain: "cb-puzzel.firebaseapp.com",
    databaseURL: "https://cb-puzzel.firebaseio.com",
    projectId: "cb-puzzel",
    storageBucket: "cb-puzzel.appspot.com",
    messagingSenderId: "280161814307"
};
firebase.initializeApp(config);
var databaseRef = firebase.database().ref('passwords/');
var cooldown = 10;

var maxTries = 5;
var tries = maxTries;
var secCountdown = cooldown;
var counter = setInterval(function () {
    secCountdown--;
    console.log(secCountdown, tries);
    if (secCountdown != 0) {
        return;
    }
    secCountdown = cooldown;
    if (tries == maxTries) {
        return
    }
    tries++;
}, 1000);

var secCounter = null

function OK() {
    if (tries == 0) {
        return;
    }
    tries--;

    var password = sha256(document.getElementById('password').value);
    try {
        databaseRef.child(password).once('value').then(function (snapshot) {
            if (snapshot.child('link').val() != null) {
                window.location.href = snapshot.child('link').val();
            } else {
                if (tries <= 0) {
                    displayError("You tried to many times. Wait for " + secCountdown.toString() + " seconds.");
                    secCounter = setInterval(function () {
                        updateError("You tried to many times. Wait for " + secCountdown.toString() + " seconds.");
                        if (secCountdown == 1) {
                            clearInterval(secCounter);
                            setTimeout(function () {
                                deleteError();
                            }, 1000);
                        }
                    }, 1000);
                } else {
                    displayError("The password is incorrect. Tries: " + tries.toString());
                        
                }
            }
        }, function (error) {
            console.log(error);
            displayError("The password is incorrect");
        });
    } catch (err) {
        console.log(err);
        displayError("press F12 and copy error to report to mod");
    }
}

var sha256 = function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    };
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j;
    var result = ''
    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += '\x80'
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00'
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return;
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16);
        var oldHash = hash;
        hash = hash.slice(0, 8);
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            var w15 = w[i - 15], w2 = w[i - 2];
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                + ((e & hash[5]) ^ ((~e) & hash[6]))
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                ) | 0
                );
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

            hash = [(temp1 + temp2) | 0].concat(hash);
            hash[4] = (hash[4] + temp1) | 0;
        }

        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

function displayError(error) {
    if (document.getElementById('ferror') != null) {
        updateError(error);
        return;
    }
    var footer = document.createElement("footer");
    var fclass = document.createAttribute("class");
    fclass.value = "w3-container w3-red w3-round";
    var fid = document.createAttribute("id");
    fid.value = "ferror";
    footer.setAttributeNode(fclass);
    footer.setAttributeNode(fid);

    var para = document.createElement("p");
    var text = document.createTextNode("ERROR: " + error);
    var pid = document.createAttribute("id");
    pid.value = "error";
    para.appendChild(text);
    para.setAttributeNode(pid);

    footer.appendChild(para);
    var parent = document.getElementById('card');
    parent.appendChild(footer);
}

function updateError(error) {
    var text = document.getElementById('error');
    text.innerHTML = 'ERROR: ' + error;
}

function deleteError() {
    var parent = document.getElementById('card');
    var error = document.getElementById('ferror');
    if (error == null) {
        return;
    }
    parent.removeChild(error);
}