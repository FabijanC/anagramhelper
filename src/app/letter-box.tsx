import { Dispatch, SetStateAction } from "react";
import { State } from "./page";

// TODO define directly
type LetterBoxProps = {
  name: string;
  state: State;
  stateUpdater: Dispatch<SetStateAction<State>>;
};

function isLetter(s: string): boolean {
  return s.length === 1 && s.toUpperCase() != s.toLowerCase();
}

class LetterCounter {
  map: { [key: string]: number } = {};

  static fromArr(symbols: Array<string>): LetterCounter {
    const counter = new LetterCounter();

    for (const symbol of symbols) {
      if (isLetter(symbol)) {
        counter.add(symbol);
      }
    }

    return counter;
  }

  toArr(): Array<string> {
    const a = [];
    for (const letter in this.map) {
      for (let i = 0; i < this.map[letter]; i++) {
        a.push(letter);
      }
    }
    return a;
  }

  add(letter: string) {
    const oldCount = this.get(letter);
    this.map[letter] = oldCount + 1;
  }

  set(letter: string, count: number) {
    this.map[letter] = count;
  }

  get(letter: string): number {
    return letter in this.map ? this.map[letter] : 0;
  }

  /** Perform `this` - `other` */
  diff(other: LetterCounter): LetterCounter {
    const diff = new LetterCounter();
    for (const letter in this.map) {
      const thisCount = this.get(letter);
      const otherCount = other.get(letter);
      if (thisCount > otherCount) {
        diff.set(letter, thisCount - otherCount);
      }
    }

    return diff;
  }

  containsAll(other: LetterCounter): boolean {
    for (const letter in other.map) {
      if (this.get(letter) < other.get(letter)) {
        return false;
      }
    }
    return true;
  }
}

type HashSet = { [key: string]: boolean };

/**
 * Returns a new array containing letters from `arr`, without the letters from `counter`.
 * Also updates `counter` by removing from it.
 */
function removeCountedLettersFromArr(
  arr: Array<string>,
  counter: LetterCounter
): [Array<string>, LetterCounter] {
  const removedCount = new LetterCounter();
  const removableIndices: HashSet = {};
  for (const removedLetter in counter.map) {
    const removedLetterCount = counter.get(removedLetter);
    let timesRemoved = 0;
    let lastIndex = -1;
    while (true) {
      lastIndex = arr.indexOf(removedLetter, lastIndex + 1);
      if (lastIndex === -1) {
        break;
      }

      timesRemoved++;
      removableIndices[lastIndex] = true;
      removedCount.add(removedLetter);

      if (timesRemoved === removedLetterCount) {
        break;
      }
    }
  }

  const filteredArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (!removableIndices[i]) {
      filteredArr.push(arr[i]);
    }
  }

  return [filteredArr, removedCount];
}

export default function LetterBox(props: LetterBoxProps) {
  return (
    <textarea
      name={props.name}
      value={props.state[props.name].join("")}
      onChange={(e) => {
        const newLetterArr = e.target.value.toUpperCase().split("");
        e.preventDefault();
        switch (props.name) {
          case "original": {
            const oldOriginalCounter = LetterCounter.fromArr(
              props.state.original
            );
            const newOriginalCounter = LetterCounter.fromArr(newLetterArr);

            // original: just apply the value from the event
            props.state.original = newLetterArr;

            // material: add what is added to original
            const addedLetters = newOriginalCounter.diff(oldOriginalCounter);
            props.state.material.push(...addedLetters.toArr());

            let removedLetters = oldOriginalCounter.diff(newOriginalCounter);
            // material: remove what is removed from original, and update the removables
            [props.state.material, removedLetters] =
              removeCountedLettersFromArr(props.state.material, removedLetters);

            // anagram: if anything remains after removal from material, remove here
            [props.state.anagram] = removeCountedLettersFromArr(
              props.state.anagram,
              removedLetters
            );
            break;
          }
          case "material":
            // cannot just add new material
            break;
          case "anagram": {
            const oldAnagramCounter = LetterCounter.fromArr(
              props.state.anagram
            );
            const newAnagramCounter = LetterCounter.fromArr(newLetterArr);

            const oldMaterialCounter = LetterCounter.fromArr(
              props.state.material
            );

            // at most one of these counters is non-empty
            const addedLetters = newAnagramCounter.diff(oldAnagramCounter);
            const removedLetters = oldAnagramCounter.diff(newAnagramCounter);

            if (oldMaterialCounter.containsAll(addedLetters)) {
              [props.state.material] = removeCountedLettersFromArr(
                props.state.material,
                addedLetters
              );
              props.state.anagram = newLetterArr;
              props.state.material.push(...removedLetters.toArr());
            }

            break;
          }
          default: // do nothing
            break;
        }

        props.stateUpdater({
          original: props.state.original,
          material: props.state.material,
          anagram: props.state.anagram,
        });
      }}
    ></textarea>
  );
}