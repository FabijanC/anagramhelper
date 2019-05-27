function isLetter(code) {
    let chr = String.fromCharCode(code);
    return chr.toUpperCase() != chr.toLowerCase();
    //return code >= 65 && code <= 90 || code >= 97 || code <= 122;
}

function keepChars(str) {
    var ret = "";
    for (var i = 0; i < str.length; ++i) {
        if (isLetter(str.charCodeAt(i))) {
            ret += str.charAt(i);
        }
    }
    return ret;
}

$("#anagram").on("keydown", e => {
    let anagram = $("#anagram");
    let original = $("#original");
    let code = e.keyCode;
    
    let ss = anagram[0].selectionStart, se = anagram[0].selectionEnd;
    
    if (code != 8 && code != 46) {
        return;
    }
    
    e.preventDefault();
    
    let oldval = anagram.val(), deleted;
    
    if (ss === se) {
        if (code === 8) {
            if (ss === 0) {
                return;
            }
            deleted = oldval[ss-1];
            anagram.val(oldval.substring(0, ss-1) + oldval.substring(ss));
            anagram[0].selectionStart = anagram[0].selectionEnd = ss-1;
        } else { // code == 46
            if (se == anagram.val().length) {
                return;
            }
            deleted = oldval[ss];
            anagram.val(oldval.substring(0, ss) + oldval.substring(ss+1));
            anagram[0].selectionStart = anagram[0].selectionEnd = ss;
        }
    } else {
        anagram.val(oldval.substring(0, ss) + oldval.substring(se));
        deleted = oldval.substring(ss, se);
    }
    
    original.val(original.val() + keepChars(deleted));
});

$("#anagram").on("keypress", e => {
    e.preventDefault();
    let anagram = $("#anagram");
    let original = $("#original");
    let code = e.keyCode;

    code = String.fromCharCode(code).toUpperCase().charCodeAt(0);
    let pressed = String.fromCharCode(code);
    
    let material = original.val();
    
    if (isLetter(code) && pressed === pressed.toUpperCase()) {                    
        if (material.indexOf(pressed) == -1) {
            return;
        }
        original.val(material.replace(pressed, ""));
    }
    
    let oldval = anagram.val();
    let newval = oldval.substring(0, anagram[0].selectionStart) + pressed + oldval.substring(anagram[0].selectionEnd);
    let se = anagram[0].selectionEnd;
    anagram.val(newval);
    anagram[0].selectionStart = anagram[0].selectionEnd = se+1;
});

$("#original").on("keypress", e => {
    e.preventDefault();
    let anagram = $("#anagram");
    let original = $("#original");
    let code = e.keyCode;
    
    code = String.fromCharCode(code).toUpperCase().charCodeAt(0);
    let pressed = String.fromCharCode(code).toUpperCase();
    
    let oldval = original.val();
    let newval = oldval.substring(0, original[0].selectionStart) + pressed + oldval.substring(original[0].selectionEnd);
    let newStartSelection = original[0].selectionEnd+pressed.length;
    original.val(newval);
    original[0].selectionStart = newStartSelection;
    original[0].selectionEnd = newStartSelection;
});

$("#shuffle").on("click", e => {
    var arr = $("#original").val().split("");
    var curr = arr.length, tmp, randIndex;
    
    while (0 !== curr) {
        rand = Math.floor(Math.random()*curr);
        --curr;
        
        tmp = arr[curr];
        arr[curr] = arr[rand];
        arr[rand] = tmp;
    }
    
    $("#original").val(arr.join(""));
});