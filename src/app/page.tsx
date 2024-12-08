"use client";

import { useState } from "react";
import LetterBox from "./letter-box";

export class State {
  original: string[] = [];
  material: string[] = [];
  anagram: string[] = [];
}

export default function Home() {
  const [state, stateUpdater] = useState(new State());

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <LetterBox name="original" state={state} stateUpdater={stateUpdater} />
        <LetterBox name="material" state={state} stateUpdater={stateUpdater} />
        <LetterBox name="anagram" state={state} stateUpdater={stateUpdater} />
      </main>
    </div>
  );
}
