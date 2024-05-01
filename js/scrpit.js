// js that is responsible for the working of the typing game

const typingText = document.querySelector(".typing-text p"),
      inpField = document.querySelector(".wrapper .input-field"),
      tryAgainBtn = document.querySelector(".content button"),
      timeTag = document.querySelector(".time span b"),
      mistakeTag = document.querySelector(".mistake span"),
      wpmTag = document.querySelector(".wpm span"),
      cpmTag = document.querySelector(".cpm span");

    let timer,
      maxTime = 30,
      timeLeft = maxTime,
      charIndex = mistakes = isTyping = 0;

    function loadParagraph() {
      //getting random item from the paragraph array, splitting all the characters of it, adding each character inside span and then adding this span inside p tag
      const ranIndex = Math.floor(Math.random() * paragraphs.length);
      typingText.innerHTML = "";//to clear the innerHTML for when the game is reseted 
      paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`
        typingText.innerHTML += span;
      });
      //for making the first letter blink so that someone can type
      typingText.querySelectorAll("span")[0].classList.add("active");
      document.addEventListener("keydown", () => inpField.focus());
      typingText.addEventListener("click", () => inpField.focus());
    }

    function initTyping() {
      let characters = typingText.querySelectorAll("span");
      let typedChar = inpField.value.split("")[charIndex];
      if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!animationStarted) {
          animationStarted = true;
        }
        // the code will run if the user has typed less than total characters and timer is greater than 0 
        if (!isTyping) {//once the timer start, it wont start again in every key clicked 
          timer = setInterval(initTimer, 1000);
          isTyping = true;
        }
        // if user hasnt entered any character or pressed backspace
        if (typedChar == null) {
          if (charIndex > 0) {
            charIndex--;
            //decrement mistake if only the charIndex contains incorrect class 
            if (characters[charIndex].classList.contains("incorrect")) {
              mistakes--;
            }
            // decrement charIndex and removing correct and incorrect class for the earsed character
            characters[charIndex].classList.remove("correct", "incorrect");
          }
        } else {
          if (characters[charIndex].innerText == typedChar) {
            characters[charIndex].classList.add("correct");
            // if user typed character and shown character matched then add the correct class else add the incorrect class(increment the mistake)
          } else {
            mistakes++;
            characters[charIndex].classList.add("incorrect");
          }
          charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");


        // if wpm value is 0, empty, or infinity then setting its value to 0
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
      } else {
        clearInterval(timer);
        inpField.value = "";
      }
    }

    function initTimer() {
      if (timeLeft > 0) {
        // If time is greater than 0, decrement the timer
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;

      }
      if (timeLeft == 0) {
        // If the time is 0, clear the interval and execute what was previously in the stop button's click event
        clearInterval(timer);

        // This code was previously in the stopButton's click event
        animationStarted = false;
      }
    }
    function resetGame() {
      location.reload()
    }

    loadParagraph();
    inpField.addEventListener("input", initTyping);
    tryAgainBtn.addEventListener("click", resetGame);  