// The following variables below are all the sound variables and mute/unmute fucntions 
let backgroundMusic = new Audio();
let portalEnterSound = new Audio();
let portalExitSound = new Audio();

backgroundMusic.src = "sounds/bg-music.mp3";
portalEnterSound.src = "sounds/warp-entrance.mp3";
portalExitSound.src = "sounds/warp-exit.mp3";
let backgroundMusicStatus = 0;
let backgroundMusicInterval;

function playBackgroundMusic() {
    backgroundMusic.play();
    if (backgroundMusicStatus == 1) {
        backgroundMusic.volume = 0;
    } else {
        backgroundMusic.volume = 1;
    }
}

function muteBackgroundMusic() {
    const muteBtnImg = document.getElementById("mute-btn-img");
    if (backgroundMusicStatus == 0) {
        muteBtnImg.setAttribute("src", "assets/header/mute.png");
        backgroundMusic.volume = 0;
        backgroundMusicStatus++;
    } else {
        muteBtnImg.setAttribute("src", "assets/header/unmute.png");
        backgroundMusic.volume = 0.5;
        backgroundMusicStatus--;
    }
}

document.getElementById("mute-header-btn").addEventListener("click", muteBackgroundMusic)
//END HERE

// The following lines of codes are for the start animation (click to start)
document.addEventListener('click', () => {
    const portal = document.getElementById('portal');
    const burst = document.getElementById('portal-burst');

    void burst.offsetWidth;
    
    burst.classList.add('expand');
    portal.classList.add('show');

    setTimeout(() => {
    portalEnterSound.play();
    document.getElementById('start-title').style.opacity = '0';
    document.getElementById('start-header').style.opacity = '0';
    document.getElementById('bottom-ct').style.bottom = '-80px';
    document.getElementById('top-ct').style.top = '-80px';
    }, 0);

    setTimeout(() => {
        portal.classList.add('zoom');
    }, 600);

    setTimeout(() => {
        portalExitSound.play();
        document.getElementById('background-img').style.opacity = '0';
        document.getElementById('bottom-ct').style.bottom = '-480px';
        document.getElementById('top-ct').style.top = '-480px';
        portal.classList.add('shrink');
    }, 1900);

    setTimeout(() => {
        document.getElementById('background-img').style.opacity = '0';
    }, 2600);

    setTimeout(() => {
        hideStartScreen();
        startTimer();
        burst.classList.remove('expand');
        portal.classList.remove('show', 'zoom', 'shrink');
    }, 2600);
}, { once: true });
//END HERE


// The following lines of codes include all of the functions and variables needed for you to transition from the start screen to the game board
let startScreenTimer;

function hideStartScreen() {
    document.getElementById("start-screen").style.display = "none";
    playBackgroundMusic();
    backgroundMusicInterval = setInterval(playBackgroundMusic, 120000);
    clearInterval(startScreenTimer);
}
//END HERE

// The following lines of codes hides all the header and gameboard elements, and shows the end message
function endGame(){
    const portal = document.getElementById('portal2');
    
    portal.classList.add('show');

   
    document.getElementById("game-board").style.display = "none"
    document.getElementById("header").style.display = "none"
    clearInterval(backgroundMusicInterval)
    backgroundMusic.volume = 0
    if (score >= 100) {
        document.getElementById("pass-end-screen").style.display = "flex";

        const scrambled = "T01OSUJVUw==";
        const secretCode = atob(scrambled);

        const secretMessage = document.getElementById("secret-message");
        if (secretMessage) {
            secretMessage.innerHTML = "SECRET MESSAGE: <b>" 
                + secretCode + "</b>.";
        }

    } else {
        document.getElementById("fail-end-screen").style.display = "flex"
    }
}

// FAIL SCREEN PORTAL RESET
document.addEventListener("DOMContentLoaded", () => {
    const resetPortal = document.getElementById("portal-reset");
    if (resetPortal) {
        resetPortal.addEventListener("click", () => {
            location.reload();
        });
    }
});
// END HERE


// QUESTION BANK
let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let timer;
let timeLeft = 30;

window.onload = function() {
    setGame();
}

function setGame() {
    //set up the grid in html
    for (let i = 0; i < 9; i++) { //i goes from 0 to 8, stops at 9
        //<div id="0-8"></div>
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, 999); // 1000 miliseconds = 1 second, every 1 second call setMole
    setInterval(setPlant, 999); // 2000 miliseconds = 2 seconds, every 2 second call setPlant
}

function getRandomTile() {
    //math.random --> 0-1 --> (0-1) * 9 = (0-9) --> round down to (0-8) integers
    let num = Math.floor(Math.random() * 6);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    let mole = document.createElement("img");
    mole.src = "./number.gif";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }
    let plant = document.createElement("img");
    plant.src = "./r.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return;
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = "SCORE: " + score; // update score html
    } else if (this == currPlantTile) {
        document.getElementById("score").innerText = "GAME OVER: " + score.toString(); // update score html
        gameOver = true;  // Fixed the typo here
        endGame(true);  // Trigger the end game screen
    }
     else {
        // ❌ wrong → immediate fail
        endGame();
    }
}

function startTimer() {
    timer = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("game-timer-txt").innerText = `Time Left: ${timeLeft}`;
        } else {
            clearInterval(timer);
            endGame(); // End the game when the timer runs out
        }
    }, 1000); // Decrease time every second
    
}


// GAME FUNCTIONS PROPER

function startGame() {
    hideStartScreen();
    startTimer(); // Start the timer when the game starts
}