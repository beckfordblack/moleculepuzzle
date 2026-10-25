const GAME_WIDTH = 1080;
const GAME_HEIGHT = 1920;

const GRID_COLS = 5;
const GRID_ROWS = 8;
const GRID_SIZE = 160;
const GRID_GAP = 4;

const gameElement = document.getElementById("game");
const backgroundCanvas = document.getElementById("background");
const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const loadingScreen = document.getElementById("loadingScreen");

const moleculeNameElement = document.getElementById("moleculeName");
const scoreElement = document.getElementById("currentScore");
const highScoreElement = document.getElementById("bestScore");
const rankingScoreElement = document.getElementById("gameOverScore");
const boardElement = document.getElementById("board");

const startButton = document.getElementById("startButton");
const retryButton = document.getElementById("retryButton");
const homeButton = document.querySelectorAll(".homeButton");
const skipButton = document.getElementById("skipButton");
const rankingSubmitArea = document.getElementById("rankingSubmission");

const playerName = document.getElementById("playerName");
const submitScoreButton = document.getElementById("submitScoreButton");
const submitStatus = document.getElementById("submitStatus");
const rankingList = document.getElementById("rankingList");

const backgroundCtx = backgroundCanvas.getContext("2d");

const ELEMENTS = [
    {text: "H", color: "#448787"},
    {text: "C", color: "#328a32"},
    {text: "N", color: "#a15d1a"},
    {text: "O", color: "#a73425"}
];
const ELEMENT_POOL = [0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3]
const MOLECULES = [
    {name: "水素", formula: "H2"},
    {name: "酸素", formula: "O2"},
    {name: "オゾン", formula: "O3"},
    {name: "窒素", formula: "N2"},

    {name: "水", formula: "H2O"},
    {name: "過酸化水素", formula: "H2O2"},
    {name: "一酸化炭素", formula: "C1O1"},
    {name: "二酸化炭素", formula: "C1O2"},
    {name: "炭酸", formula: "H2C1O3"},

    {name: "アンモニア", formula: "N1H3"},
    {name: "ヒドラジン", formula: "N2H4"},
    {name: "ヒドロキシルアミン", formula: "N1H3O1"},
    {name: "一酸化窒素", formula: "N1O1"},
    {name: "二酸化窒素", formula: "N1O2"},
    {name: "一酸化二窒素", formula: "N2O1"},
    {name: "亜硝酸", formula: "H1N1O2"},
    {name: "硝酸", formula: "H1N1O3"},

    {name: "メタン", formula: "C1H4"},
    {name: "エタン", formula: "C2H6"},
    {name: "プロパン", formula: "C3H8"},
    {name: "ブタン", formula: "C4H10"},

    {name: "エチレン", formula: "C2H4"},
    {name: "プロピレン", formula: "C3H6"},
    {name: "ブタジエン", formula: "C4H6"},
    {name: "アセチレン", formula: "C2H2"},
    {name: "プロパジエン", formula: "C3H4"},

    {name: "シクロブタン", formula: "C4H8"},
    {name: "ベンゼン", formula: "C6H6"},

    {name: "メタノール", formula: "C1H4O1"},
    {name: "エタノール", formula: "C2H6O1"},
    {name: "プロパノール", formula: "C3H8O1"},
    
    {name: "ジエチルエーテル", formula: "C4H10O"},

    {name: "ホルムアルデヒド", formula: "C1H2O1"},
    {name: "アセトアルデヒド", formula: "C2H4O1"},
    {name: "アセトン", formula: "C3H6O1"},
    {name: "2-ブタノン", formula: "C4H8O1"},

    {name: "ギ酸", formula: "C1H2O2"},
    {name: "酢酸", formula: "C2H4O2"},
    {name: "プロピオン酸", formula: "C3H6O2"},
    {name: "乳酸", formula: "C3H6O3"},
    {name: "ピルビン酸", formula: "C3H4O3"},
    {name: "シュウ酸", formula: "C2H2O4"},
    {name: "クエン酸", formula: "C6H8O7"},

    {name: "シアン化水素", formula: "H1C1N1"},
    {name: "シアノゲン", formula: "C2N2"},
    {name: "シアンアミド", formula: "C1H2N2"},
    {name: "アセトニトリル", formula: "C2H3N1"},
    {name: "プロピオニトリル", formula: "C3H5N1"},
    {name: "イソシアン酸", formula: "H1N1C1O1"},
    
    {name: "メチルアミン", formula: "C1H5N1"},
    {name: "エチルアミン", formula: "C2H7N1"},
    {name: "トリメチルアミン", formula: "C3H9N1"},
    {name: "アミノメタノール", formula: "C1H5N1O1"},

    {name: "ホルムアミド", formula: "C1H3N1O1"},
    {name: "アセトアミド", formula: "C2H5N1O1"},
    {name: "尿素", formula: "C1H4N2O1"},

    {name: "グリシン", formula: "C2H5N1O2"},
    {name: "アラニン", formula: "C3H7N1O2"},
    {name: "アスパラギン酸", formula: "C4H7N1O4"},
    {name: "グルタミン酸", formula: "C5H9N1O4"},
    {name: "アスパラギン", formula: "C4H8N2O3"},

    {name: "グルコース", formula: "C6H12O6"},
    {name: "アデニン", formula: "C5H5N5"},
    {name: "シトシン", formula: "C4H5N3O1"},
    {name: "チミン", formula: "C5H6N2O2"},
    {name: "ウラシル", formula: "C4H4N2O3"},
    {name: "尿酸", formula: "C5H4N4O3"},
    {name: "カフェイン", formula: "C8H10N4O2"},
]

let isPointerDown = false;
let isPlaying = false;
let isGameOver = false;
let isSubmitting = false;

let currentScore = 0;
let bestScore = Number(localStorage.getItem("highScore")) || 0;

let formedMolecule = null;
let displayMode = "name";

const selectedPieces = [];
let grid = Array.from(
    {length: GRID_ROWS},
    () => Array(GRID_COLS).fill(null)
);

init();

animateBG();

//init
function init() {
    highScoreElement.textContent = `${bestScore}`;
    
    gameElement.style.width = `${GAME_WIDTH}px`;
    gameElement.style.height = `${GAME_HEIGHT}px`;

    backgroundCanvas.width = GAME_WIDTH;
    backgroundCanvas.height = GAME_HEIGHT;
    
    boardElement.style.width = `${GRID_COLS * (GRID_SIZE + GRID_GAP) - GRID_GAP}px`;
    boardElement.style.height = `${GRID_ROWS * (GRID_SIZE + GRID_GAP) - GRID_GAP}px`;
    
    startButton.addEventListener("click", startGame);
    retryButton.addEventListener("click", startGame);
    homeButton.forEach(button => {
        button.addEventListener("click", returnTitle);
    });
    skipButton.addEventListener("click", skipTurn);
    submitScoreButton.addEventListener("click", handleScoreSubmission);
    
    window.addEventListener("resize", resizeGame);
    document.addEventListener('dblclick', function(e) {
        e.preventDefault();
    }, { passive: false });

    registerEventListeners();

    MOLECULES.forEach((e) => {
        e.elements = expandFormula(e.formula)
    });
    
    resizeGame();
    hideLoadingScreen();
}
function resizeGame() {
    const scaleX = window.innerWidth / GAME_WIDTH;
    const scaleY = window.innerHeight / GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    gameElement.style.transform = `scale(${scale})`;
    return scale;
}
async function hideLoadingScreen() {
    const images = [...document.querySelectorAll("img")];
    await Promise.all(
        images.map(img => {
            if (img.complete && img.naturalWidth > 0) {
                return Promise.resolve();
            }
            return img.decode().catch(() => {});
        })
    );
    loadingScreen.classList.add("hidden");
}

//game
async function startGame() {
    resetBoard();

    isPlaying = false;
    isGameOver = false;

    titleScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameOverScreen.classList.add("hidden");

    moleculeNameElement.textContent = "";
    currentScore = 0;
    scoreElement.textContent = currentScore;

    await createInitialPieces();
    isPlaying = true;
}
function endGame() {
    isGameOver = true;
    isPlaying = false;
    
    
    rankingSubmitArea.style.display = "none";

    rankingScoreElement.textContent = `SCORE: ${currentScore}`;
    
    gameScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
    
    submitScore("gest");
    loadRanking();
}
function returnTitle() {
    isPlaying = false;
    isGameOver = false;

    highScoreElement.textContent = `${bestScore}`;

    titleScreen.classList.remove("hidden");
    gameScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
}
async function skipTurn() {
    if (!isPlaying || isGameOver) return;
    isPlaying = false;
    await addNewPieces();
    isPlaying = true;
}

//background
function fillCircle(x, y, r, c) {
    backgroundCtx.fillStyle = c;
    backgroundCtx.beginPath();
    backgroundCtx.arc(x, y, r, 0, Math.PI * 2);
    backgroundCtx.fill();
}
function drawMolecule(x, y, c, t) {
    backgroundCtx.strokeStyle = "white";
    backgroundCtx.lineWidth = 5;
    backgroundCtx.save();
    backgroundCtx.translate(x, y + Math.sin(t * 0.0008) * 20);
    backgroundCtx.rotate(0.0002 * t);
    for (let i = 0; i < 3; i++) {
        backgroundCtx.beginPath();
        backgroundCtx.moveTo(0, 0);
        backgroundCtx.lineTo(0, 100);
        backgroundCtx.stroke();
        fillCircle(0, Math.sin((0.0002 * t + 2.09 * i) / Math.PI * 15) * 20 + 100, 20, "#76c2d8");
        backgroundCtx.rotate(2.09);
    }
    fillCircle(0, 0, 40, c);
    backgroundCtx.restore();
}
function drawParticle(x, r, c, t) {
    let y = t * 0.1 % 1920;
    const d = (0.999993 ** ((x - 540) ** 2)) * (0.999997 ** ((y - 960) ** 2))
    x = x + d * Math.sign(x - 540) * 400
    fillCircle(x, y, r, c)
}
function animateBG() {
    function animate(t) {
        backgroundCtx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
        drawParticle(500, 10, "#276ab9", t + 4000)
        drawParticle(400, 20, "#085dd4", t + 16000)
        drawParticle(300, 10, "#bf6b35", t + 8000)
        drawParticle(200, 20, "#085dd4", t)
        drawParticle(100, 10, "#276ab9", t + 12000)
        drawParticle(600, 10, "#276ab9", t + 1000)
        drawParticle(700, 20, "#085dd4", t + 9000)
        drawParticle(800, 10, "#276ab9", t + 13000)
        drawParticle(900, 20, "#085dd4", t + 5000)
        drawParticle(1000, 10, "#bf6b35", t + 17000)

        drawMolecule(220, 280, "#3c9679", t);
        drawMolecule(1000, 500, "#d34842", - t);
        drawMolecule(180, 1460, "#0e7dda", t + 1800);
        drawMolecule(850, 1750, "#b86130", 1800 - t);

        fillCircle(130, -50, 300, "#ffffff15");
        fillCircle(320, 1900, 180, "#ffffff0f");
        fillCircle(-30, 1400, 150, "#ffffff09");
        fillCircle(0, 800, 80, "#ffffff25");
        fillCircle(1050, 1000, 100, "#ffffff09");
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

//board
function resetBoard() {
    document.querySelectorAll(".pieces").forEach((e) => {
        e.remove();
    })
    clearLines();
    grid = Array.from(
        {length: GRID_ROWS},
        () => Array(GRID_COLS).fill(null)
    );
    selectedPieces.length = 0;
}
function rebuildGrid() {
    const newGrid = Array.from(
        {length: GRID_ROWS},
        () => Array(GRID_COLS).fill(null)
    );
    document.querySelectorAll(".pieces").forEach((e) => {
        newGrid[e.gridY][e.gridX] = e;
    })
    return newGrid;
}
function dropPieces() {
    for (let col = 0; col< GRID_COLS; col++) {
        let row = GRID_ROWS - 1;
        for (let y = GRID_ROWS - 1; y >= 0; y--) {
            const piece = grid[y][col];
            if (piece === null) continue;
            if (row <= 0 && !isGameOver) {
                isGameOver = true;
                setTimeout(() => {
                    endGame();
                }, 1500);
            }
            piece.gridY = row;
            row--;
        }
    }
}

//Pieces
function createPiece(gridX, gridY, delay) {
    const piece = document.createElement("div");
    piece.className = "pieces";
    piece.element = ELEMENT_POOL[Math.floor(Math.random() * ELEMENT_POOL.length)];
    boardElement.appendChild(piece);
    grid[gridY][gridX] = piece;
    
    const element = ELEMENTS[piece.element];
    piece.textContent = element.text;
    piece.style.background = element.color;
    piece.style.width = `${GRID_SIZE}px`;
    piece.style.height = `${GRID_SIZE}px`;
    piece.gridX = gridX;
    piece.gridY = gridY;
    piece.style.left = 
    `${gridX * (GRID_SIZE + GRID_GAP)}px`;
    piece.style.top = `0px`;
    piece.animatedY = - 180 - delay;
    piece.scale = 1;
    piece.style.transform = 
    `translateY(${piece.animatedY}px)`;
    piece.isAnimating = false;
}
async function createInitialPieces() {
    for (let col = 0; col < GRID_COLS; col++) {
        for (let row = 0; row < 3; row++) {
            createPiece(col, (GRID_ROWS - 1) - row, row * 180);
        }
    }
    const animations = [];
    document.querySelectorAll(".pieces").forEach((piece) => {
        animations.push(animatePiece(piece));
    });
    await Promise.all(animations);
}
async function addNewPieces() {
    for (let col = 0; col < GRID_COLS; col++) {
        if (Math.random() < 0.2) continue;
        createPiece(col, 0, 0);
    }
    dropPieces();
    grid = rebuildGrid();
    const animations = [];
    document.querySelectorAll(".pieces").forEach((piece) => {
        animations.push(animatePiece(piece));
    });
    await Promise.all(animations);
}
function animatePiece(piece) {
    if (piece.isAnimating) return Promise.resolve();
    piece.isAnimating = true;
    return new Promise((resolve) => {
        let scaleSpeed = 0;
        let moveSpeed = 0;
        function animate(){
            const targetY =
                piece.gridY * (GRID_SIZE + GRID_GAP)
    
            scaleSpeed += (1 - piece.scale) * 0.2;
            scaleSpeed *= 0.8;
            piece.scale += scaleSpeed;
    
            const distance = targetY - piece.animatedY;
    
            if (distance !== 0) {
                moveSpeed += 2;
                piece.animatedY += moveSpeed;
                if (Math.abs(distance) < Math.abs(moveSpeed)) {
                    piece.animatedY = targetY;
                    moveSpeed = 0;
                }
            }
            
            piece.style.transform = 
                    `translateY(${piece.animatedY}px) scale(${piece.scale})`;
            
            const scaleDone = 
                Math.abs(piece.scale - 1) < 0.01 && 
                Math.abs(scaleSpeed) < 0.01;
    
            const moveDone = 
                Math.abs(targetY - piece.animatedY) < 0.01 &&
                moveSpeed === 0;
    
            if (scaleDone && moveDone) {
                piece.scale = 1;
                piece.animatedY = targetY;
                piece.isAnimating = false;
                resolve();
                return;
            }
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    });
}

//selection
function selectPiece(piece) {
    const element = ELEMENTS[piece.element];

    piece.style.filter = "brightness(1.6)";
    piece.style.border = 
        `5px solid ${element.color}`;

    piece.scale = 1.2;
    animatePiece(piece);

    selectedPieces.push(piece);
}
function clearSelection() {
    selectedPieces.forEach((piece) => {
        piece.style.filter = 
            "brightness(1)";
        piece.style.border = 
            `3px solid ${ELEMENTS[piece.element].color}`;
    });
    selectedPieces.length = 0;
}
function removeSelectedPieces() {
    selectedPieces.forEach((piece) => {
        grid[piece.gridY][piece.gridX] = null;
        piece.animate([
            {
                transform: `translateY(${piece.animatedY}px) scale(1)`,
                opacity: 1
            },
            {
                transform: `translateY(${piece.animatedY}px) scale(1.3)`,
                opacity: 1,
                offset: 0.3
            },
            {
                transform: `translateY(${piece.animatedY}px) scale(0)`,
                opacity: 0
            }
        ],{
            duration: 300,
            easing: "ease-out"
        });
        setTimeout(() => {
            piece.remove();
        }, 300);
    });
    selectedPieces.length = 0;
}

//molecule
function expandFormula(formula) {
    return [...formula.matchAll(/([A-Z][a-z]?)(\d*)/g)]
    .flatMap(([_, element, count]) =>
        Array(Number(count) || 1).fill(element)
);
}
function findMolecule(pieces) {
    const selectedElements = pieces
        .map((piece) => ELEMENTS[piece.element].text)
        .sort();

    return MOLECULES.find((molecule) => {
        const moleculeElements = [...molecule.elements].sort(); 
        return (
            selectedElements.length === moleculeElements.length &&
            selectedElements.every(
                (element, index) =>
                    element === moleculeElements[index]
            )
        );
    }) ?? null;
}
function toSubscript(formula) {
    const subscript = "₀₁₂₃₄₅₆₇₈₉";
    return formula.replace(/\d/g, n =>
        n === "1" ? "" : [...n].map(d => subscript[d]).join("")
    );
}
function displayMolecule(displayMode) {
    if (displayMode === "name") {
        moleculeNameElement.textContent = formedMolecule.name;
    } else {
        moleculeNameElement.textContent = toSubscript(formedMolecule.formula);
    }
    moleculeNameElement.animate([
        {
            transform: "scale(0)"
        },
        {
            transform: "scale(1.3)",
            offset: 0.3
        },
        {
            transform: "scale(1)"
        }
    ], {
        duration: 200,
        easing: "ease-out"        
    });
}

//line
function drawLine() {
    for (let i = 1; i < selectedPieces.length; i++) {
        createLine(selectedPieces[i].gridX, selectedPieces[i].gridY, selectedPieces[i - 1].gridX, selectedPieces[i - 1].gridY)
    }
}
function createLine(x, y, x2, y2) {
    const dx = x2 - x;
    const dy = y2 - y;

    const line = document.createElement("div");
    line.className = "lines";
    boardElement.appendChild(line);

    if (dx === 0) {
        line.style.width = `12px`;
        line.style.height = `${GRID_GAP + 40}px`;
    } else {
        line.style.width = `${GRID_GAP + 40}px`;
        line.style.height = `12px`;
    }
    line.style.left = 
        `${x * (GRID_SIZE + GRID_GAP) + GRID_SIZE / 2 + dx * (GRID_SIZE + GRID_GAP) / 2}px`;
    line.style.top = 
        `${y * (GRID_SIZE + GRID_GAP) + GRID_SIZE / 2 + dy * (GRID_SIZE + GRID_GAP) / 2}px`;
}
function clearLines() {
    document.querySelectorAll(".lines").forEach((e) => {
        e.remove();
    })
}

//events
function registerEventListeners() {
    document.addEventListener("pointerdown", (e) => {
        if (!isPlaying || isGameOver || isPointerDown) return;
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target?.classList.contains("pieces")) {
            isPointerDown = true;
            selectPiece(target);
        }
    })

    document.addEventListener("pointerup", (e) => {
        isPointerDown = false;
        const molecule = findMolecule(selectedPieces);
        if (molecule === null) {
            clearSelection();
            clearLines();
            return;
        }
        
        formedMolecule = molecule;
        displayMode = "name";
        displayMolecule("name"); 
        currentScore += selectedPieces.length ** 2;
        scoreElement.textContent = currentScore;
        if (currentScore > bestScore) {
            bestScore = currentScore;
            localStorage.setItem("highScore", bestScore);
        }
        isPlaying = false;
        clearLines();
        removeSelectedPieces();
        setTimeout(async () => {
            await addNewPieces();
            isPlaying = true;
        }, 350);
    })

    document.addEventListener("pointermove", (e) => {
        if (!isPlaying || isGameOver || !isPointerDown) return;
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (!target?.classList.contains("pieces")) return;
        if (selectedPieces.includes(target)) {
            const index = selectedPieces.findIndex(i => i === target);
            if (index === selectedPieces.length - 2) {
                const last = selectedPieces[selectedPieces.length - 1]
                last.style.filter = "brightness(1)";
                last.style.border = 
                    `3px solid ${ELEMENTS[last.element].color}`;
                selectedPieces.splice(selectedPieces.length - 1, 1)
                clearLines();
                drawLine();
            }
            return;
        }
        const gapX = Math.abs(target.gridX - selectedPieces[selectedPieces.length - 1].gridX);
        const gapY = Math.abs(target.gridY - selectedPieces[selectedPieces.length - 1].gridY);
        if (gapX + gapY !== 1) return;
        clearLines();
        selectPiece(target);
        drawLine();
    })
    moleculeNameElement.addEventListener("pointerdown", (e)=> {
        if (displayMode === "name") {
            displayMode = "elements";
        } else {
            displayMode = "name";
        }
        displayMolecule(displayMode);
    })
}

//ranking
async function handleScoreSubmission() {
    if (isSubmitting) return;
    const name = playerName.value.trim();
    if (!name) {
        submitStatus.textContent = "名前を入力してください";
        return;
    }
    isSubmitting = true;
    submitStatus.textContent = "登録中...";
    await submitScore(name);
    await loadRanking();
};
async function submitScore(name) {
    try {
        const { saveScore } = await import("./firestore.js");
        await saveScore(name, currentScore);
        submitStatus.textContent = "登録しました";
    } catch (error) {
        console.error(error);
        submitStatus.textContent = "登録に失敗しました";
    } finally {
        isSubmitting = false;
    }
}
async function loadRanking() {
    try {
        const { getRanking } = await import("./firestore.js");
        const scores = await getRanking();
        rankingList.replaceChildren();
        scores.forEach((data) => {
            const item = document.createElement("li");
            item.textContent = `${data.name} : ${data.score}`;
            rankingList.appendChild(item);
        });
    } catch (error) {
        console.log(error);
        rankingList.textContent = `${error.code ?? error.message}`;
    }
}
