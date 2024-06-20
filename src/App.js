import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import useSound from "use-sound";

const jsonData = {
  options: [
    {
      question: "Сидячи біля вікна вагона потяга, хлопчик почав рахувати телеграфні стовпи. Він нарахував 10 стовпів. Яку відстань пройшов за цей час поїзд, якщо відстань між стовпами 50м?",
      answers: ["900м", "450м", "500м", "550м"],
      correct: 1,
      correctImageUrl: "/img1correct.gif",
      wrongImageUrl: "/shrek.webp"
    },
    {
      question: "Як звали першого хлопця твоєї подруги Швець Анастасії?",
      answers: ["Саша", "Влад", "Сергій", "Женя"],
      correct: 3,
      correctImageUrl: "/img2correct.gif",
      wrongImageUrl: "/shrek.webp"
    },
    {
      question: "В тебе є дівчина Жигун Юлія. Який з цих фактів про неї правда?",
      answers: ["Грала в карти на гроші в школі", "Має шрам після автоаварії", "Вивчала азербайджанську мову", "Гуляла вночі на кладовищі"],
      correct: 0,
      correctImageUrl: "/img3correct.gif",
      wrongImageUrl: "/shrek.webp"
    },
    {
      question: "Згадаємо за що ти отримав диплом. Як умовно чиста продукція позначається у моделі міжгалузевого балансу?",
      answers: ["z", "y", "x", "a"],
      correct: 0,
      correctImageUrl: "/img4correct.gif",
      wrongImageUrl: "/shrek.webp"
    },
    {
      question: "В тебе є подруга Ткаченко Анастасія. Ти був знайомий з її татом. Яке її по батькові?",
      answers: ["Ігорівна", "Володимирівна", "Юріївна", "Андріївна"],
      correct: 2,
      correctImageUrl: "/img5correct.gif",
      wrongImageUrl: "/shrek.webp"
    },
    {
      question: "Як звали твою вчительку інформатики у школі?",
      answers: ["Олена Вікторівна", "Людмила Олексіївна", "Тетяна Аксентіївна", "Катерина Вікторівна"],
      correct: 0,
      correctImageUrl: "/img6correct.gif",
      wrongImageUrl: "/shrek.webp"
    },
    {
      question: "В 2009 році один чоловік заплатив за 2 піци 10.000 біткоїнів. А що зробив ти за кусок піци в 2020 році?",
      answers: ["Заплатив 50 гривень", "Поїхав в інше місто", "З'їв муху", "Дав пизди Яценко Микиті на Трухановому острові"],
      correct: 3,
      correctImageUrl: "/img7correct.png",
      wrongImageUrl: "/shrek.webp"
    },
    {
      question: "В аніме “Атака титанів” був титан на ім'я Бін. Яка характеристика йому відповідає?",
      answers: ["4-метровий з блакитними очима", "7-метровий з коротким коричневим волоссям", "6-метровий з дуже великою головою", "6-метровий з довгим світлим волоссям"],
      correct: 1,
      wrongImageUrl: "/shrek.webp"
    }
  ],
};

const GIF_WIDTH = 150;
const GIF_HEIGHT = 150;

export default function App() {
  const [playCorrect] = useSound('/correct.mp3')
  const [playIncorrect] = useSound('/incorrect.mp3')
  const [playVictory] = useSound('/victory.mp3')
  const [playDefeat] = useSound('/defeat.mp3')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [hadWrongAnswer, setHadWrongAnswer] = useState(false);
  const refPanel = useRef(null);
  const refContainer = useRef(null);

  useEffect(() => {
    setQuestions(jsonData.options);
  }, []);

  const handleAnswerClick = (index) => {
    const isCorrect = questions[currentQuestionIndex].correct === index;
    setSelectedAnswer(index);
    if(currentQuestionIndex === jsonData.options.length-1) {
      if(hadWrongAnswer || !isCorrect) {
        setHadWrongAnswer(true)
        playDefeat()
      }
      else {
        playVictory()
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        return
      }
    } else if (isCorrect) {
      playCorrect()
    } else {
      playIncorrect()
    }
    if (!hadWrongAnswer) setHadWrongAnswer(!isCorrect);
    const { clientWidth: panelWidth, clientHeight: panelHeight } =
      refPanel.current;
    const images = Array.from(refContainer.current.childNodes)
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

      const checkHasErrors = (itemLeft, itemRight, itemTop, itemBottom) => {
        let horizontalCheck = itemLeft < left + GIF_WIDTH && left < itemRight
        let verticalCheck = itemTop < top + GIF_HEIGHT && top < itemBottom

        return top < 0 || left < 0 || (horizontalCheck && verticalCheck);
      }

      const result = [[panelLeft, panelRight, panelTop, panelBottom], ...images.map(({x, y, clientWidth, clientHeight},i) => {
        return [x, x + clientWidth, y, y + clientHeight]
      })]
        .map(param => checkHasErrors(...param))
        .filter(hasError => hasError);

      if(!result.length) isValidPosition = true
    } while (!isValidPosition);

    const imageUrl = isCorrect
      ? questions[currentQuestionIndex].correctImageUrl
      : questions[currentQuestionIndex].wrongImageUrl;

    setDisplayedImages([...displayedImages, { top, left, imageUrl }]);

    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
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
                <button onClick={resetGame} style={{height: 'auto'}}>Try Again</button>
              </div>
            </>
          ) : (
            <div className={'column'}>
              <h1 className="question" style={{margin: '0 auto'}}>МОЛОДЕЦЬ!!!</h1>
              <p className={'text'}>
                Ти вдало пройшов цей тест, тому отримуєш приз - СЮРПРИЗ ВЕЧІРКУ!!!
                22 червня о 16:00 тебе будуть чекати в твоїй квартирі
                (додаткова умова: 22 червня о 15:00 тобі назначена зустріч з Ткаченко Анастасією в твоїй квартирі. У вас відбудеться обмін твоїх ключів на 1 годину проведення часу за кавою/пивом з Гуменою Варварою)
                Дрес-код: гарний (по можливості)
                Підготовлена їжа, закуски, напої вітаються. Приємного очікування!
              </p>
            </div>
          )}
        </div>
      )}
      <div className="imageContainer" ref={refContainer}>
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
