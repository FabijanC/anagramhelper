function isLetter(code) {
    return code >= 65 && code <= 90 || code >= 97 || code <= 122;
}

$("#up").on("keydown", e => {
    let up = $("#up");
    let down = $("#down");
    let code = e.keyCode;
    
    let ss = up[0].selectionStart, se = up[0].selectionEnd;
    
    if (code != 8 && code != 46) {
        return;
    }
    
    e.preventDefault();
    
    let oldval = up.val(), deleted;
    
    if (ss === se) {
        if (code === 8) {
            if (ss === 0) {
                return;
            }
            deleted = oldval[ss-1];
            up.val(oldval.substring(0, ss-1) + oldval.substring(ss));
            up[0].selectionStart = up[0].selectionEnd = ss-1;
        } else { // code == 46
            if (se == up.val().length) {
                return;
            }
            deleted = oldval[ss];
            up.val(oldval.substring(0, ss) + oldval.substring(ss+1));
            up[0].selectionStart = up[0].selectionEnd = ss;
        }
    } else {
        up.val(oldval.substring(0, ss) + oldval.substring(se));
        deleted = oldval.substring(ss, se);
    }
    down.val(down.val()+deleted.replace(/\W/, ""));
});

$("#up").on("keypress", e => {
    e.preventDefault();
    let up = $("#up");
    let down = $("#down");
    let code = e.keyCode;

    if (code >= 97 && code <= 122) {
        code -= 97-65;
    }
    let pressed = String.fromCharCode(code);
    
    let material = down.val();
    
    if (code >= 65 && code <= 90) {                    
        if (material.indexOf(pressed) == -1) {
            return;
        }
        down.val(material.replace(pressed, ""));
    }
    
    let oldval = up.val();
    let newval = oldval.substring(0, up[0].selectionStart) + pressed + oldval.substring(up[0].selectionEnd);
    let se = up[0].selectionEnd;
    up.val(newval);
    up[0].selectionStart = up[0].selectionEnd = se+1;
});

$("#down").on("keypress", e => {
    e.preventDefault();
    let up = $("#up");
    let down = $("#down");
    let code = e.keyCode;
    if (code >= 97 && code <= 122) {
        code -= 97-65;
    }
    let pressed = String.fromCharCode(code);
    
    let oldval = down.val();
    let newval = oldval.substring(0, down[0].selectionStart) + pressed + oldval.substring(down[0].selectionEnd);
    let newStartSelection = down[0].selectionEnd+pressed.length;
    down.val(newval);
    down[0].selectionStart = newStartSelection;
    down[0].selectionEnd = newStartSelection;
});

$("#shuffle").on("click", e => {
    var arr = $("#down").val().split("");
    var curr = arr.length, tmp, randIndex;
    
    while (0 !== curr) {
        rand = Math.floor(Math.random()*curr);
        --curr;
        
        tmp = arr[curr];
        arr[curr] = arr[rand];
        arr[rand] = tmp;
    }
    
    $("#down").val(arr.join(""));
});