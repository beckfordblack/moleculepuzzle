const GAME_WIDTH = 1080;
const GAME_HEIGHT = 1920;

const GRID_COLS = 5;
const GRID_ROWS = 8;
const GRID_SIZE = 160;
const GRID_GAP = 4;

const gameLayer = document.getElementById("game");
const titleLayer = document.getElementById("title");
const scoreLayer = document.getElementById("score");
const boardLayer = document.getElementById("board");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startButton = document.getElementById("startButton");
const retryButton = document.getElementById("retryButton");
const homeButton = document.getElementById("homeButton");
const skipButton = document.getElementById("skipButton");
const finalScore = document.getElementById("finalScore");

const ELEMENTS = [
    {text: "H", color: "#448787"},
    {text: "C", color: "#328a32"},
    {text: "N", color: "#a15d1a"},
    {text: "O", color: "#a73425"}
];

const elementPool = [0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3]

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

let isPointer = false;
let isPlaying = false;
let isGameOver = false;

let score = 0;
let titleTimer;

const selectedPieces = [];

let grid = Array.from(
    {length: GRID_ROWS},
    () => Array(GRID_COLS).fill(null)
);

gameLayer.style.width = `${GAME_WIDTH}px`;
gameLayer.style.height = `${GAME_HEIGHT}px`;

boardLayer.style.width = `${GRID_COLS * (GRID_SIZE + GRID_GAP) - GRID_GAP}px`;
boardLayer.style.height = `${GRID_ROWS * (GRID_SIZE + GRID_GAP) - GRID_GAP}px`;

startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", startGame);
homeButton.addEventListener("click", goHome)
skipButton.addEventListener("click", skip)

window.addEventListener("resize", resizeGame);

document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });

addEventListeners();

function expandFormula(formula) {
    return [...formula.matchAll(/([A-Z][a-z]?)(\d*)/g)]
    .flatMap(([_, element, count]) =>
        Array(Number(count) || 1).fill(element)
);
}

MOLECULES.forEach((e) => {
    e.elements = expandFormula(e.formula)
});

function resizeGame() {
    const scaleX = window.innerWidth / GAME_WIDTH;
    const scaleY = window.innerHeight / GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    gameLayer.style.transform = `scale(${scale})`;
    return scale;
}

const GAME_SCALE = resizeGame();

function startGame() {
    clearBoard();

    isPlaying = true;
    isGameOver = false;

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    titleLayer.textContent = "";
    score = 0;
    scoreLayer.textContent = score;

    createInitialPieces();
}

function gameOver() {
    if (isGameOver) return;

    isGameOver = true;
    isPlaying = false;

    finalScore.textContent = `SCORE: ${score}`;
    gameOverScreen.classList.remove("hidden");
}

function goHome() {
    isPlaying = false;
    isGameOver = false;

    startScreen.classList.remove("hidden");
    gameOverScreen.classList.add("hidden");
}

function skip() {
    addNewpieces();
}

function clearBoard() {
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

function updateGrid() {
    const newGrid = Array.from(
        {length: GRID_ROWS},
        () => Array(GRID_COLS).fill(null)
    );
    document.querySelectorAll(".pieces").forEach((e) => {
        newGrid[e.gridY][e.gridX] = e;
    })
    return newGrid;
}

function createInitialPieces() {
    for (let col = 0; col < GRID_COLS; col++) {
        for (let row = 0; row < 3; row++) {
            createPiece(col, (GRID_ROWS - 1) - row, row * 180);
        }
    }
}

function collapsePieces() {
    for (let col = 0; col< GRID_COLS; col++) {
        let row = GRID_ROWS - 1;
        for (let y = GRID_ROWS - 1; y >= 0; y--) {
            const piece = grid[y][col];
            if (piece === null) continue;
            if (row <= 0) {
                gameOver();
            }
            piece.gridY = row;
            row--;
        }
    }
}

async function addNewpieces() {
    for (let col = 0; col < GRID_COLS; col++) {
        if (Math.random() < 0.3) continue;
        createPiece(col, 0, 0);
    }
    collapsePieces();
    grid = updateGrid();
    const animations = [];
    document.querySelectorAll(".pieces").forEach((piece) => {
        animations.push(animatePiece(piece));
    });
    await Promise.all(animations);
}

function createPiece(gridX, gridY, delay) {
    const piece = document.createElement("div");
    piece.className = "pieces";
    piece.element = elementPool[Math.floor(Math.random() * elementPool.length)];
    boardLayer.appendChild(piece);
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
    animatePiece(piece);
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
    boardLayer.appendChild(line);

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

function addEventListeners() {
    document.addEventListener("pointerdown", (e) => {
        if (!isPlaying || isGameOver) return;
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target?.classList.contains("pieces")) {
            isPointer = true;
            selectPiece(target);
        }
    })

    document.addEventListener("pointerup", (e) => {
        isPointer = false;
        const molecule = findMolecule(selectedPieces);
        if (molecule === null) {
            clearSelection();
            clearLines();
            return;
        }
        showMolecule(molecule.name); 
        score += selectedPieces.length ** 2;
        scoreLayer.textContent = score;
        isPlaying = false;
        clearLines();
        removeSelectedPieces();
        setTimeout(async () => {
            await addNewpieces();
            isPlaying = true;
        }, 350);
    })

    document.addEventListener("pointermove", (e) => {
        if (!isPlaying || isGameOver || !isPointer) return;
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
}

function showMolecule(name) {
    clearTimeout(titleTimer);

    titleLayer.textContent = name;
    titleLayer.style.opacity = "1";

    // titleTimer = setTimeout(() => {
    //     titleLayer.style.opacity = "0";
    // }, 2000);
}

function animateButtons(time) {
    const scale = 1 + Math.sin(time * 0.005) * 0.05;
    startButton.style.scale = scale;
    retryButton.style.scale = scale;
   requestAnimationFrame(animateButtons);
}

requestAnimationFrame(animateButtons);
