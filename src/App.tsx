import { useState, useRef } from "react";
import "./App.css";

const ICON_MAP = [
  "banana",
  "seven",
  "cherry",
  "plum",
  "orange",
  "bell",
  "bar",
  "lemon",
  "melon",
];

const ICON_HEIGHT = 79;
const NUM_ICONS = 9;
const TIME_PER_ICON = 100;
const INITIAL_INDEXES = [0, 0, 0, 0];

function App() {
  const [indexes, setIndexes] = useState(INITIAL_INDEXES);
  const [rolling, setRolling] = useState(false);
  const [winCls, setWinCls] = useState("");
  const reelsRef = useRef(null);
  const reel1Ref = useRef(null);
  const reel2Ref = useRef(null);
  const reel3Ref = useRef(null);
  const reel4Ref = useRef(null);

  // Function to roll a single reel
  const roll = (reel: HTMLElement, offset: number = 0): Promise<number> => {
    const delta = (offset + 2) * NUM_ICONS + Math.round(Math.random() * NUM_ICONS);

    return new Promise<number>(resolve => {
      const style = getComputedStyle(reel);
      
      const backgroundPositionY = parseFloat(style.backgroundPositionY);
      const targetBackgroundPositionY =
        backgroundPositionY + delta * ICON_HEIGHT;
      const normTargetBackgroundPositionY =
        targetBackgroundPositionY % (NUM_ICONS * ICON_HEIGHT);

      setTimeout(() => {
        reel.style.transition = `background-position-y ${(8 + 1 * delta) * TIME_PER_ICON}ms cubic-bezier(.40, -0.2, .60, 1.15)`;
        reel.style.backgroundPositionY = `${backgroundPositionY + delta * ICON_HEIGHT}px`;
      }, offset * 150);

      setTimeout(() => {
        reel.style.transition = `none`;
        reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
        resolve(delta % NUM_ICONS);
      }, (8 + 1 * delta) * TIME_PER_ICON + offset * 150);
    });
  };

  const rollAll = () => {
    setRolling(true);

    const reelsList = [
      reel1Ref.current,
      reel2Ref.current,
      reel3Ref.current,
      reel4Ref.current,
    ];

    Promise.all(reelsList.map((reel, i) => roll(reel!, i)))
      .then((deltas) => {
        const newIndexes = deltas.map((delta, i) => (indexes[i] + delta) % NUM_ICONS);
        setIndexes(newIndexes);

        if (newIndexes[0] === newIndexes[1] || newIndexes[1] === newIndexes[2]) {
          const winCls = newIndexes[0] === newIndexes[2] ? "win2" : "win1";
          setWinCls(winCls);
          setTimeout(() => setWinCls(""), 2000);
        }

        setRolling(false);
      });
  };

  return (
    <>
      <div className={`slots ${winCls}`} ref={reelsRef}>
        <div className="reel" ref={reel1Ref}></div>
        <div className="reel" ref={reel2Ref}></div>
        <div className="reel" ref={reel3Ref}></div>
        <div className="reel" ref={reel4Ref}></div>
      </div>
      <button className="roll" onClick={rollAll} disabled={rolling}>
        Roll
      </button>
      <div className="debug">
        {rolling ? "rolling..." : indexes.map((i) => ICON_MAP[i]).join(" - ")}
      </div>
    </>
  );
}

export default App;
