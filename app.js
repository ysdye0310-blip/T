const scoreElement = document.getElementById('score');
const comboElement = document.getElementById('combo');
const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const feedbackElement = document.getElementById('feedback');
const buttons = document.querySelectorAll('.option-btn');
const gameContainer = document.querySelector('.game-container');

let currentScore = 0;
let currentCombo = 0;
let currentAnswer = 0;
let isAnimating = false;

function initGame() {
    currentScore = 0;
    currentCombo = 0;
    updateScoreBoard();
    generateQuestion();
}

function generateQuestion() {
    isAnimating = false;
    
    // 2~9단 생성
    const num1 = Math.floor(Math.random() * 8) + 2; 
    const num2 = Math.floor(Math.random() * 9) + 1;
    
    currentAnswer = num1 * num2;
    
    num1Element.textContent = num1;
    num2Element.textContent = num2;
    
    // 오답 생성 (정답과 비슷한 값들 위주로 배치하여 생각하게 만듦)
    let options = new Set();
    options.add(currentAnswer);
    
    while(options.size < 4) {
        let wrongMod = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
        let randomWrong = currentAnswer + (wrongMod * num1); // 구구단 배수 기준 오답
        
        // 너무 똑같은 값 방지 및 양수 보장
        if (randomWrong <= 0 || randomWrong === currentAnswer) {
            randomWrong = currentAnswer + Math.floor(Math.random() * 10) + 1;
        }
        
        options.add(randomWrong);
    }
    
    // Set을 배열로 변환하고 랜덤하게 섞기
    let optionsArray = Array.from(options);
    optionsArray.sort(() => Math.random() - 0.5);
    
    // 버튼에 값 할당 및 클릭 이벤트 연결
    buttons.forEach((btn, index) => {
        btn.textContent = optionsArray[index];
        btn.classList.remove('pressed'); // 이전 상태 초기화
        btn.onclick = () => checkAnswer(optionsArray[index], btn);
    });
    
    feedbackElement.textContent = "어느 것이 정답일까요? 🤔";
    feedbackElement.className = 'feedback';
}

function checkAnswer(selected, btn) {
    if (isAnimating) return;
    isAnimating = true;
    
    btn.classList.add('pressed'); // 눌린 효과
    
    if (selected === currentAnswer) {
        // --- 정답 ---
        currentScore += 10 + (currentCombo * 2); // 콤보 시 보너스 추가
        currentCombo++;
        
        feedbackElement.textContent = "딩동댕! 🎉 대단해! 🌟";
        feedbackElement.className = 'feedback correct';
        
        // 애니메이션 효과
        gameContainer.classList.add('pop');
        setTimeout(() => gameContainer.classList.remove('pop'), 500);
        
        updateScoreBoard();
        
        setTimeout(() => {
            generateQuestion();
        }, 1200);
        
    } else {
        // --- 오답 ---
        currentCombo = 0;
        feedbackElement.textContent = `앗, 틀렸어요! 정답은 ${currentAnswer} 😢`;
        feedbackElement.className = 'feedback wrong';
        
        // 오답 화면 흔들림 효과
        gameContainer.classList.add('shake');
        setTimeout(() => gameContainer.classList.remove('shake'), 400);
        
        updateScoreBoard();
        
        setTimeout(() => {
            generateQuestion();
        }, 1500);
    }
}

function updateScoreBoard() {
    scoreElement.textContent = currentScore;
    comboElement.textContent = currentCombo;
}

// 스크립트 로드 시 게임 시작
initGame();
