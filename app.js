 let userNumbers = [];
let drawnNumbers = [];
let isDrawing = false;


const elements = {
    userGrid: document.getElementById('userNumberGrid'),
    selectedDisplay: document.getElementById('selectedNumbers'),
    drawnDisplay: document.getElementById('drawnNumbers'),
    loadingAnimation: document.getElementById('spinningBalls'),
    resultCard: document.getElementById('resultCard'),
    resultContent: document.getElementById('matchInfo'),
    clearBtn: document.getElementById('clearBtn'),
    randomBtn: document.getElementById('randomBtn'),
    drawBtn: document.getElementById('drawBtn'),
    resetBtn: document.getElementById('resetBtn')
};

const GAME_CONFIG = {
    totalNumbers: 49,
    selectCount: 6,
    drawDelay: 1000
};

// grid yapısı 
function createNumberGrid() {
    elements.userGrid.innerHTML = '';
    
    for (let i = 1; i <= GAME_CONFIG.totalNumbers; i++) {
        const numberElement = document.createElement('div');
        numberElement.className = 'number';
        numberElement.textContent = i;
        numberElement.addEventListener('click', () => selectNumber(i, numberElement));
        elements.userGrid.appendChild(numberElement);
    }
}

// seçilen sayılar
function selectNumber(number, element) {
    if (isDrawing) return;
    
    if (userNumbers.includes(number)) {
        userNumbers = userNumbers.filter(n => n !== number);
        element.classList.remove('selected');
    } else if (userNumbers.length < GAME_CONFIG.selectCount) {
        userNumbers.push(number);
        element.classList.add('selected');
    }
    
    updateSelectedDisplay();
}

//sayıları yazdırma kısmı
function updateSelectedDisplay() {
    elements.selectedDisplay.innerHTML = '';
    
    if (userNumbers.length === 0) {
        elements.selectedDisplay.innerHTML = '<span class="placeholder">6 sayı seçiniz</span>';
        return;
    }
    
    userNumbers.sort((a, b) => a - b).forEach(number => {
        const numberElement = document.createElement('div');
        numberElement.className = 'selected-number';
        numberElement.textContent = number;
        elements.selectedDisplay.appendChild(numberElement);
    });
    
    //sayılar seçildiğinde feedback
    if (userNumbers.length === GAME_CONFIG.selectCount) {
        const confirmMsg = document.createElement('p');
        confirmMsg.style.cssText = 'color: #4CAF50; font-weight: bold; margin-top: 10px;';
        confirmMsg.textContent = '✓ 6 sayı seçildi!';
        elements.selectedDisplay.appendChild(confirmMsg);
    }
}

//random seçim butonu 
function randomSelect() {
    if (isDrawing) return;

    userNumbers = [];
    document.querySelectorAll('.number').forEach(el => el.classList.remove('selected'));
    
    // random 6 sayı
    while (userNumbers.length < GAME_CONFIG.selectCount) {
        const randomNum = Math.floor(Math.random() * GAME_CONFIG.totalNumbers) + 1;
        if (!userNumbers.includes(randomNum)) {
            userNumbers.push(randomNum);
        }
    }
    
    //sayıların background
    userNumbers.forEach(num => {
        const element = Array.from(document.querySelectorAll('.number'))
            .find(el => parseInt(el.textContent) === num);
        if (element) element.classList.add('selected');
    });
    
    updateSelectedDisplay();
}

//çekilişin fonksiyonu
async function drawNumbers() {
    if (isDrawing || userNumbers.length !== GAME_CONFIG.selectCount) return;
    
    isDrawing = true;
    elements.drawBtn.disabled = true;
    elements.drawBtn.textContent = 'Çekiliş Yapılıyor...';
    
    
    elements.loadingAnimation.classList.add('active');
    elements.drawnDisplay.innerHTML = '';
    
    //çekilişin random 6 sayısı
    drawnNumbers = [];
    while (drawnNumbers.length < GAME_CONFIG.selectCount) {
        const randomNum = Math.floor(Math.random() * GAME_CONFIG.totalNumbers) + 1;
        if (!drawnNumbers.includes(randomNum)) {
            drawnNumbers.push(randomNum);
        }
    }
    
    //sayılsrı yazdırma
    for (let i = 0; i < drawnNumbers.length; i++) {
        await new Promise(resolve => setTimeout(resolve, GAME_CONFIG.drawDelay));
        
        const numberElement = document.createElement('div');
        numberElement.className = 'drawn-number';
        numberElement.textContent = drawnNumbers[i];
        
        //kontrol
        if (userNumbers.includes(drawnNumbers[i])) {
            numberElement.classList.add('match');
        }
        
        elements.drawnDisplay.appendChild(numberElement);
    }
    
    // işlem bittiğinde loadingi silme 
    elements.loadingAnimation.classList.remove('active');
    
   
    showResults();
    isDrawing = false;
    elements.drawBtn.disabled = false;
    elements.drawBtn.textContent = 'Çekiliş Başlat';
}

//çekiliş sonucu
function showResults() {
    const matches = userNumbers.filter(num => drawnNumbers.includes(num));
    const matchCount = matches.length;
    
    elements.resultCard.style.display = 'block';
    elements.resultContent.innerHTML = `
        <div class="match-count">${matchCount} Eşleşme!</div>
        <p><strong>Seçtiğiniz sayılar:</strong> ${userNumbers.sort((a, b) => a - b).join(', ')}</p>
        <p><strong>Çekilen sayılar:</strong> ${drawnNumbers.sort((a, b) => a - b).join(', ')}</p>
        ${matchCount > 0 ? `<p style="color: #4CAF50; font-weight: bold;">Eşleşen sayılar: ${matches.sort((a, b) => a - b).join(', ')}</p>` : ''}
    `;
    
    elements.resultCard.style.animation = 'bounceIn 0.6s ease';
}

//seçilen kısmı silme
function clearSelection() {
    if (isDrawing) return;
    
    userNumbers = [];
    document.querySelectorAll('.number').forEach(el => el.classList.remove('selected'));
    updateSelectedDisplay();
}

//çekilişi sıfırlama
function resetGame() {
    if (isDrawing) return;
    
    clearSelection();
    drawnNumbers = [];
    elements.drawnDisplay.innerHTML = '';
    elements.resultCard.style.display = 'none';
    elements.loadingAnimation.classList.remove('active');
}

//klavye tuşalrı için
function handleKeyboardInput(e) {
    if (isDrawing) return;
    
    const key = e.key;
  
    if (key === 'Enter' && userNumbers.length === GAME_CONFIG.selectCount) {
        drawNumbers();
    }
    
    //space ile random butonu aktif
    if (key === ' ') {
        e.preventDefault();
        randomSelect();
    }
}

// butonlar
function initializeEventListeners() {
    
    elements.clearBtn.addEventListener('click', clearSelection);
    elements.randomBtn.addEventListener('click', randomSelect);
    elements.drawBtn.addEventListener('click', drawNumbers);
    elements.resetBtn.addEventListener('click', resetGame);
    
    document.addEventListener('keydown', handleKeyboardInput);
}

//çekilişi başlatma
function initializeGame() {
    createNumberGrid();
    updateSelectedDisplay();
    initializeEventListeners();
    
    //alertle biliglendirme kısmı
    setTimeout(() => {
        alert(`🎲 Sayısal Çekiliş Oyununa Hoş Geldiniz! 🎲\n\n• 6 sayı seçin veya "Rastgele Seç" butonuna basın\n• "Çekiliş Başlat" butonuna basarak çekilişi başlatın\n• Enter tuşu ile çekiliş yapabilirsiniz\n• Space tuşu ile rastgele seçim yapabilirsiniz`);
    }, 500);
}

document.addEventListener('DOMContentLoaded', initializeGame);