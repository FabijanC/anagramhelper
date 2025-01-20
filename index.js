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

function isLetter(c) {
  return c.length === 1 && c.toUpperCase() != c.toLowerCase();
}

function isPrintable(c) {
  return c.length === 1;
}

document.querySelector("#original").addEventListener("input", function (event) {
  const input = event.target;
  input.value = input.value.toUpperCase();
});

/**
 * `inputs` should be an array of html textarea/input elements from which the removal of character `c`
 * should be attempted. First tries from the first member of `inputs` etc, then second, etc.
 * Stops trying on successful removal.
 */
function removeFrom(c, inputs) {
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

document.querySelector("#original").addEventListener("cut", function (event) {
  const input = event.target;

  const selectionStart = input.selectionStart;
  const selectionEnd = input.selectionEnd;

  const material = document.querySelector("#material");
  const anagram = document.querySelector("#anagram");
  const targetInputs = [material, anagram];

  for (let i = selectionStart; i < selectionEnd; i++) {
    removeFrom(input.value.charAt(i), targetInputs);
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
    removeFrom(input.value.charAt(i), targetInputs);
  }

  material.value += event.clipboardData.getData("text");
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
      switch (event.key) {
        case "Backspace":
          removeFrom(input.value.charAt(selectionStart - 1), targetInputs);
          break;
        case "Delete":
          removeFrom(input.value.charAt(selectionStart), targetInputs);
          break;
        default:
          break;
      }
    }

    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      (isPrintable(event.key) && !event.ctrlKey)
    ) {
      for (let i = selectionStart; i < selectionEnd; i++) {
        removeFrom(input.value.charAt(i), targetInputs);
      }
    } else {
      return;
    }

    if (isLetter(event.key) && !event.ctrlKey) {
      material.value += event.key.toUpperCase();
    }
  });

document
  .querySelector("#anagram")
  .addEventListener("keydown", function (event) {
    event.preventDefault();

    const input = event.target;
    const originalValue = input.value;
    const caretPosition = input.selectionStart;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    let newValue = originalValue; // This will store the "after event" value

    if (selectionStart !== selectionEnd) {
      // There's a selection (text is highlighted)
      const selectedText = originalValue.slice(selectionStart, selectionEnd);

      switch (event.key) {
        case "Backspace":
          // If backspace is pressed, we remove the selected text
          newValue =
            originalValue.slice(0, selectionStart) +
            originalValue.slice(selectionEnd);
          break;
        case "Delete":
          // If delete is pressed, we also remove the selected text
          newValue =
            originalValue.slice(0, selectionStart) +
            originalValue.slice(selectionEnd);
          break;
        default:
          if (event.key.length === 1) {
            // If a character is typed, we replace the selected text with the new character
            newValue =
              originalValue.slice(0, selectionStart) +
              event.key +
              originalValue.slice(selectionEnd);
          }
          break;
      }
    } else {
      // No selection, just modify the caret position
      switch (event.key) {
        case "Backspace":
          if (caretPosition > 0) {
            // Remove the character before the caret
            newValue =
              originalValue.slice(0, caretPosition - 1) +
              originalValue.slice(caretPosition);
          }
          break;
        case "Delete":
          if (caretPosition < originalValue.length) {
            // Remove the character at the caret position
            newValue =
              originalValue.slice(0, caretPosition) +
              originalValue.slice(caretPosition + 1);
          }
          break;
        case "Enter":
          // Simulate Enter (newline) at caret position
          newValue =
            originalValue.slice(0, caretPosition) +
            "\n" +
            originalValue.slice(caretPosition);
          break;
        default:
          if (event.key.length === 1) {
            // Insert character at caret position
            newValue =
              originalValue.slice(0, caretPosition) +
              event.key +
              originalValue.slice(caretPosition);
          }
          break;
      }
    }

    console.log("New content after key event:", newValue);
  });
