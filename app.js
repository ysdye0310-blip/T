const scoreElement = document.getElementById('score');
const comboElement = document.getElementById('combo');
const targetNumberElement = document.getElementById('target-number');
const answerInput = document.getElementById('answer-input');
const feedbackElement = document.getElementById('feedback');
const gameContainer = document.querySelector('.game-container');
const submitBtn = document.getElementById('submit-btn');

let currentScore = 0;
let currentCombo = 0;
let currentTarget = 0;
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
    
    // 1부터 9까지 랜덤 숫자 생성 (0이나 10은 너무 쉬워서 제외하기 위함)
    currentTarget = Math.floor(Math.random() * 9) + 1;
    currentAnswer = 10 - currentTarget;
    
    targetNumberElement.textContent = currentTarget;
    
    // 주관식 입력창 초기화 및 마우스 포커싱!
    answerInput.value = ''; 
    answerInput.focus(); 
    
    feedbackElement.textContent = "짝꿍수를 입력하고 엔터(Enter)나 확인 버튼을 누르세요! 🐶";
    feedbackElement.className = 'feedback';
    submitBtn.classList.remove('pressed');
}

// 폼(Enter키 혹은 확인 버튼) 제출 시 동작하는 함수
function submitAnswer() {
    if (isAnimating) return;
    
    const userInputStr = answerInput.value.trim();
    if (userInputStr === '') {
        // 아무것도 안적고 엔터치면 무시
        answerInput.focus();
        return; 
    }
    
    const userAnswer = parseInt(userInputStr, 10);
    
    if (isNaN(userAnswer)) {
        answerInput.focus();
        return; 
    }
    
    isAnimating = true;
    submitBtn.classList.add('pressed');
    
    if (userAnswer === currentAnswer) {
        // --- 정답 처리 ---
        currentScore += 10 + (currentCombo * 5); // 콤보 보너스는 5점씩!
        currentCombo++;
        
        feedbackElement.textContent = "딩동댕! 🎉 완벽해요! 🌟";
        feedbackElement.className = 'feedback correct';
        
        gameContainer.classList.add('pop');
        setTimeout(() => gameContainer.classList.remove('pop'), 500);
        
        updateScoreBoard();
        
        setTimeout(() => {
            generateQuestion();
        }, 1200);
        
    } else {
        // --- 오답 처리 ---
        currentCombo = 0;
        feedbackElement.textContent = `앗! ${currentTarget}의 짝꿍수는 ${currentAnswer}예요! 😥`;
        feedbackElement.className = 'feedback wrong';
        
        gameContainer.classList.add('shake');
        setTimeout(() => gameContainer.classList.remove('shake'), 400);
        
        updateScoreBoard();
        
        setTimeout(() => {
            generateQuestion();
        }, 2500);
    }
}

function updateScoreBoard() {
    scoreElement.textContent = currentScore;
    comboElement.textContent = currentCombo;
}

// 처음 열었을 때 포커싱
window.addEventListener('DOMContentLoaded', () => {
    initGame();
});

// 아이들이 실수로 다른 곳을 파란 바탕 등 바깥쪽을 클릭했을 때,
// 바로 입력을 이어갈 수 있도록 항상 포커스를 입력창에 유지시켜주는 로직 (UX 향상)
document.body.addEventListener('click', (e) => {
    // 확인 버튼을 직접 누른 경우는 폼 제출이 되므로 간섭하지 않음
    if (e.target !== submitBtn && e.target !== answerInput) {
        // 애니메이션 중이 아닐 때만 강제 포커싱
        if (!isAnimating) {
            answerInput.focus();
        }
    }
});
