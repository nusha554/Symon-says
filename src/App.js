import "./App.scss";
import { useState, useEffect } from "react";
import ColorCard from "./components/ColorCard";
import timeout from "./utils/util";

function App() {
  const [isOn, setIsOn] = useState(false);
  const [hasLost, setHasLost] = useState(false);

  const colorList = ["green", "red", "blue", "yellow"];

  const initPlay = {
    isDisplay: false,
    colors: [],
    score: 0,
    userPlay: false,
    userColors: [],
  };

  const [play, setPlay] = useState(initPlay);
  const [flashColor, setFlashColor] = useState("");
  
  function startHandle() {
    setIsOn(true);
  }

  useEffect(() => {
    if (isOn) {
      setPlay({ ...initPlay, isDisplay: true });
    } else {
      setHasLost(false);
      setPlay(initPlay);
    }
  }, [isOn]);

  useEffect(() => {
    if (isOn && play.isDisplay) {
      let newColor = colorList[Math.floor(Math.random() * 4)];

      const copyColors = [...play.colors];
      copyColors.push(newColor);
      setPlay({ ...play, colors: copyColors });
    }
  }, [isOn, play.isDisplay]);

  useEffect(() => {
    if (isOn && play.isDisplay && play.colors.length) {
      displayColors();
    }
  }, [isOn, play.isDisplay, play.colors.length]);



  // for each color in the game, flash it for 1 second.
  async function displayColors() {
    await timeout(1000);
    for (let i = 0; i < play.colors.length; i++) {

      setFlashColor(play.colors[i]);
      await timeout(600);
      setFlashColor("");
      await timeout(600);


      // Once reaching the last color flashing, get ready for user's input
      if (i === play.colors.length - 1) {
        const copyColors = [...play.colors];
        setPlay({
          ...play,
          isDisplay: false,
          userPlay: true,
          userColors: copyColors.reverse(),
        });
      }
    }
  }

  async function cardColorHandle(userColor) {
    // Only when its user's turn
    if (!play.isDisplay && play.userPlay) {
      const copyUserColors = [...play.userColors];
      const lastColor = copyUserColors.pop();
      setFlashColor(userColor);

      if (userColor === lastColor) {
        if (copyUserColors.length) {
          setPlay({...play, userColors: copyUserColors});
        } else {
          // The last color was done, move to next level
          await timeout(600);
          setPlay({
            ...play, 
            isDisplay: true,
            userPlay: false, 
            score: play.colors.length * 10, 
            userColors:[],
          });
        }    
      } else {
        await timeout(600);
        setPlay({...initPlay, score: play.colors.length * 10});
        setHasLost(true);
      }
      await timeout(600);
      setFlashColor("");
    }
  }

  function endHandle() {
    setIsOn(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div  className= {hasLost ? "cardWrapperLost" : "cardWrapper"}>
          {colorList &&
            colorList.map((v, i) => (
              <ColorCard 
                onClick={() => { 
                  cardColorHandle(v);
                }} 
                flash={flashColor === v} 
                color={v}
              ></ColorCard>
            ))}
        </div>

        {isOn && !play.isDisplay && !play.userPlay && play.score && (
          <div className="lost">
            <div> Final Score: {play.score}</div>
            <button onClick={endHandle} className="closeButton">Play again</button>
          </div>
        )}

        {!isOn && !play.score && (
          <button onClick={startHandle} className="startButton">Play</button>
        )}

        {isOn && (play.isDisplay || play.userPlay) && (
          <div className="score"> {play.score} </div>
        )}

      </header>
    </div>
  );
}

export default App;
