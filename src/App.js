import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

const jsonData = {
  options: [
    {
      question: "Question 1",
      answers: ["a", "b", "c", "d"],
      correct: 0,
      correctImageUrl: "/img1correct.gif",
      wrongImageUrl: "/img1wrong.gif",
    },
    {
      question: "Question 2",
      answers: ["a", "b", "c", "d"],
      correct: 2,
      correctImageUrl: "/img2correct.gif",
      wrongImageUrl: "/img2wrong.gif",
    },
  ],
};

const GIF_WIDTH = 200;
const GIF_HEIGHT = 136.3;

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [hadWrongAnswer, setHadWrongAnswer] = useState(false);
  const refPanel = useRef(null);

  useEffect(() => {
    setQuestions(jsonData.options);
  }, []);

  const handleAnswerClick = (index) => {
    const isCorrect = questions[currentQuestionIndex].correct === index;
    setSelectedAnswer(index);
    if (!hadWrongAnswer) setHadWrongAnswer(!isCorrect);
    const { clientWidth: panelWidth, clientHeight: panelHeight } =
      refPanel.current;

    const rect = refPanel.current.getBoundingClientRect();
    const panelTop = rect.top;
    const panelBottom = panelTop + panelHeight;
    const panelLeft = rect.left;
    const panelRight = panelLeft + panelWidth;
    let top, left;
    let isValidPosition = false;
    do {
      top = Math.floor(
        Math.random() * document.documentElement.clientHeight - GIF_HEIGHT
      ); //adjust position so it wont overlapp with question panel
      left = Math.floor(
        Math.random() * document.documentElement.clientWidth - GIF_WIDTH
      );
      console.log(top);
      // console.log("top", top + GIF_HEIGHT < panelTop);
      // console.log("bottom", top + GIF_HEIGHT > panelBottom);
      console.log("Height", panelTop, top + GIF_HEIGHT, panelBottom);
      console.log("Width", panelLeft, left + GIF_WIDTH, panelRight);
      console.log(
        "Check: ",
        panelTop < top + GIF_HEIGHT &&
          top + GIF_HEIGHT < panelBottom &&
          panelLeft < left + GIF_WIDTH &&
          left + GIF_WIDTH < panelRight
      );
      //check if gif is not overlapping with question panel
      if (
        panelTop < top + GIF_HEIGHT &&
        top + GIF_HEIGHT < panelBottom &&
        panelLeft < left + GIF_WIDTH &&
        left + GIF_WIDTH < panelRight
      ) {
        console.log("Invalid");
      } else isValidPosition = true;
    } while (!isValidPosition);

    const imageUrl = isCorrect
      ? questions[currentQuestionIndex].correctImageUrl
      : questions[currentQuestionIndex].wrongImageUrl;

    setDisplayedImages([...displayedImages, { top, left, imageUrl }]);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      }, 500);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      }, 500);
    }
  };

  const resetGame = () => {
    window.location.reload();
  };

  return (
    <div className="panel" ref={refPanel}>
      {currentQuestionIndex < questions.length ? (
        <>
          <h1 className="question">
            {questions[currentQuestionIndex].question}
          </h1>
          <div className="buttonPanel">
            {questions[currentQuestionIndex].answers.map((answer, index) => (
              <button
                key={index}
                style={{
                  backgroundColor:
                    selectedAnswer === index
                      ? questions[currentQuestionIndex].correct === index
                        ? "green"
                        : "red"
                      : "initial", // Use default color when no answer is selected
                }}
                onClick={() => handleAnswerClick(index)}
              >
                {answer}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="panel">
          {hadWrongAnswer ? (
            <>
              <h1 className="question">Game Over</h1>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button onClick={resetGame}>Try Again</button>
              </div>
            </>
          ) : (
            <h1 className="question">Congratulations!</h1>
          )}
        </div>
      )}
      <div className="imageContainer">
        {displayedImages.map((img, i) => (
          <img
            key={i}
            src={img.imageUrl}
            alt="Feedback"
            style={{
              position: "absolute",
              top: `${img.top}px`,
              left: `${img.left}px`,
              zIndex: 2,
              hegith: GIF_HEIGHT,
              width: GIF_WIDTH,
              maxWidth: "100%",
            }}
          />
        ))}
      </div>
    </div>
  );
}
