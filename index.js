function countLetters(s) {
  const counter = {};
  for (const c of s) {
    if (!(c in counter)) {
      counter[c] = 0;
    }

    counter[c]++;
  }

  return counter;
}

function subtractCounter(counter1, counter2) {
  const newCounter = {};
  for (const e1 in counter1) {
    const newCount = counter1[e1] - (counter2[e1] || 0);
    if (newCount < 0) {
      const s1 = JSON.stringify(counter1);
      const s2 = JSON.stringify(counter2);
      throw new Error(
        `Invalid new count for ${e1}: ${newCount}. Subtracting: ${s1} - ${s2}`
      );
    }

    newCounter[e1] = newCount;
  }

  return newCounter;
}

function isEmpty(counter) {
  for (const letter in counter) {
    if (counter[letter] > 0) {
      return false;
    }
  }

  return true;
}

/** `true` if all letters of s2 contained in s1; `false` otherwise */
function contains(s1, s2) {
  const counter1 = countLetters(s1);
  const counter2 = countLetters(s2);

  for (const letter in counter2) {
    if ((counter1[letter] || 0) < counter2[letter]) {
      return false;
    }
  }

  return true;
}

function isLetter(c) {
  return c.length === 1 && c.toUpperCase() != c.toLowerCase();
}

function isPrintable(c) {
  return c.length === 1;
}

function stringSubtract(s1, s2) {
  let lettersOnlyS1 = "";
  for (const c of s1) {
    if (isLetter(c)) {
      lettersOnlyS1 += c;
    }
  }

  for (const char of s2) {
    const i = lettersOnlyS1.indexOf(char);
    if (i === -1) {
      continue;
    }

    lettersOnlyS1 = lettersOnlyS1.slice(0, i) + lettersOnlyS1.slice(i + 1);
  }

  return lettersOnlyS1;
}

// Capitalize all input in original
function keepCapitalized(id) {
  document.querySelector(id).addEventListener("input", function (event) {
    const selectionStart = event.target.selectionStart;
    const selectionEnd = event.target.selectionEnd;
    const input = event.target;
    input.value = input.value.toUpperCase();
    input.selectionStart = selectionStart;
    input.selectionEnd = selectionEnd;
  });
}

keepCapitalized("#original");
keepCapitalized("#anagram");

/**
 * `inputs` should be an array of html textarea/input elements from which the removal of character `c`
 * should be attempted. First tries from the first member of `inputs` etc, then second, etc.
 * Stops trying on successful removal.
 */
function removeFrom(inputs, c) {
  if (c.length === 0) {
    return;
  }

  for (const input of inputs) {
    const removableIndex = input.value.indexOf(c);
    if (removableIndex !== -1) {
      const newVal =
        input.value.slice(0, removableIndex) +
        input.value.slice(removableIndex + 1);
      input.value = newVal;
      break;
    }
  }
}

function receiveIfLetter(input, c) {
  if (isLetter(c)) {
    input.value += c;
  }
}

/**
 * Get removable chars from `s` starting at position `pos`,
 * depending on `command` and `ctrlKey` pressed.
 */
function getDeletable(s, pos, command, ctrlKey) {
  const deletable = [];
  if (command === "Backspace") {
    if (ctrlKey) {
      // find first non-whitespace char
      let i = pos - 1;
      for (; /\s/.test(s.charAt(i)); --i);

      for (; i >= 0 && /\S/.test(s.charAt(i)); --i) {
        deletable.push(s.charAt(i));
      }
    } else {
      deletable.push(s.charAt(pos - 1));
    }
  } else if (command === "Delete") {
    if (ctrlKey) {
      // find first non-whitespace char
      let i = pos;
      for (; /\s/.test(s.charAt(i)); ++i);

      for (; i < s.length && /\S/.test(s.charAt(i)); ++i) {
        deletable.push(s.charAt(i));
      }
    } else {
      deletable.push(s.charAt(pos));
    }
  }

  return deletable;
}

document.querySelector("#original").addEventListener("cut", function (event) {
  const input = event.target;

  const selectionStart = input.selectionStart;
  const selectionEnd = input.selectionEnd;

  const material = document.querySelector("#material");
  const anagram = document.querySelector("#anagram");
  const targetInputs = [material, anagram];

  for (let i = selectionStart; i < selectionEnd; i++) {
    removeFrom(targetInputs, input.value.charAt(i));
  }
});

document.querySelector("#original").addEventListener("paste", function (event) {
  const input = event.target;

  const selectionStart = input.selectionStart;
  const selectionEnd = input.selectionEnd;

  const material = document.querySelector("#material");
  const anagram = document.querySelector("#anagram");
  const targetInputs = [material, anagram];

  for (let i = selectionStart; i < selectionEnd; i++) {
    removeFrom(targetInputs, input.value.charAt(i));
  }

  for (const char of event.clipboardData.getData("text")) {
    if (isLetter(char)) {
      material.value += char.toUpperCase();
    }
  }
});

document
  .querySelector("#original")
  .addEventListener("keydown", function (event) {
    const input = event.target;

    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    const material = document.querySelector("#material");
    const anagram = document.querySelector("#anagram");
    const targetInputs = [material, anagram];

    if (selectionStart === selectionEnd) {
      const deletable = getDeletable(
        input.value,
        selectionStart,
        event.key,
        event.ctrlKey
      );

      if (deletable.length) {
        for (const letter of deletable) {
          removeFrom(targetInputs, letter);
        }
        return;
      } else if (!isLetter(event.key)) {
        return;
      }
    }

    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      (isPrintable(event.key) && !event.ctrlKey)
    ) {
      for (let i = selectionStart; i < selectionEnd; i++) {
        removeFrom(targetInputs, input.value.charAt(i));
      }
    } else {
      return;
    }

    if (isLetter(event.key) && !event.ctrlKey) {
      material.value += event.key.toUpperCase();
    }
  });

document.querySelector("#anagram").addEventListener("cut", function (event) {
  const input = event.target;

  const selectionStart = input.selectionStart;
  const selectionEnd = input.selectionEnd;

  const material = document.querySelector("#material");

  for (let i = selectionStart; i < selectionEnd; i++) {
    receiveIfLetter(material, input.value.charAt(i));
  }
});

document.querySelector("#anagram").addEventListener("paste", function (event) {
  const input = event.target;

  const selectionStart = input.selectionStart;
  const selectionEnd = input.selectionEnd;

  const deleted = input.value.slice(selectionStart, selectionEnd);
  const pasted = event.clipboardData.getData("text");

  // if (pasted - deleted) all in material: ok
  const diffLetters = stringSubtract(pasted, deleted);
  const material = document.querySelector("#material");

  if (contains(material.value, diffLetters)) {
    for (const diffLetter of diffLetters) {
      removeFrom([material], diffLetter);
    }
    // inserted by default
  } else {
    event.preventDefault();
  }
});

document
  .querySelector("#anagram")
  .addEventListener("keydown", function (event) {
    const input = event.target;

    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    const material = document.querySelector("#material");

    if (selectionStart === selectionEnd) {
      const deletable = getDeletable(
        input.value,
        selectionStart,
        event.key,
        event.ctrlKey
      );

      if (deletable.length) {
        for (const letter of deletable) {
          receiveIfLetter(material, letter);
        }
        return;
      } else if (!isLetter(event.key)) {
        return;
      }
    }

    if (event.ctrlKey) {
      if (event.key === "Backspace" || event.key === "Delete") {
        for (let i = selectionStart; i < selectionEnd; i++) {
          receiveIfLetter(material, input.value.charAt(i));
        }
      }
      return;
    }

    // TODO pasting not working in anagram if: original = "ABC ABC", material = "", anagram = "ABC ABC" and pasting "ABC ABC" over "C ABC"

    const insertable = event.key.toUpperCase();

    if (event.key === "Backspace" || event.key === "Delete") {
      for (let i = selectionStart; i < selectionEnd; i++) {
        receiveIfLetter(material, input.value.charAt(i));
      }
      return;
    } else if (!isPrintable(event.key)) {
      return;
    } else if (
      isLetter(insertable) &&
      material.value.indexOf(insertable) === -1
    ) {
      event.preventDefault();
      return;
    }

    for (let i = selectionStart; i < selectionEnd; i++) {
      receiveIfLetter(material, input.value.charAt(i));
    }

    // insert from material into anagram if char available
    if (material.value.indexOf(insertable) === -1 || !isLetter(event.key)) {
      // prevent insertion in the anagram field
      event.preventDefault();
      return;
    }

    // the default action will insert this in the anagram field
    if (isLetter(event.key) && !event.ctrlKey) {
      removeFrom([material], insertable);
    }
  });

document.querySelector("#shuffle").addEventListener("click", () => {
  const material = document.querySelector("#material");
  const letters = material.value.split("");

  for (let i = 0; i < letters.length; i++) {
    const randIndex = Math.floor(Math.random() * i);

    const tmp = letters[i];
    letters[i] = letters[randIndex];
    letters[randIndex] = tmp;
  }

  material.value = letters.join("");
});
