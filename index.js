document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });

const gameLayer = document.getElementById("game");
const boardLayer = document.getElementById("board");
const titleLayer = document.getElementById("title");

const GAME_WIDTH = 1080;
const GAME_HEIGHT = 1920;

gameLayer.style.width = `${GAME_WIDTH}px`;
gameLayer.style.height = `${GAME_HEIGHT}px`;

function resizeGame() {
    const scaleX = window.innerWidth / GAME_WIDTH;
    const scaleY = window.innerHeight / GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    gameLayer.style.transform = `scale(${scale})`;
    return scale;
}

window.addEventListener("resize", resizeGame);
const GAME_SCALE = resizeGame();

const GRID_COLS = 5;
const GRID_ROWS = 8;
const GRID_SIZE = 160;
const GRID_GAP = 20;

boardLayer.style.width = `${GRID_COLS * (GRID_SIZE + GRID_GAP) - GRID_GAP}px`;
boardLayer.style.height = `${GRID_ROWS * (GRID_SIZE + GRID_GAP) - GRID_GAP}px`;

const ELEMENTS = [
    {text: "H", color: "#4987ae"},
    {text: "C", color: "#2c8a5d"},
    {text: "N", color: "#9f6035"},
    {text: "O", color: "#9d333e"}
];

const MOLECULES = [
    {text: "水素", elements: ["H", "H"]},
    {text: "酸素", elements: ["O", "O"]},
    {text: "窒素", elements: ["N", "N"]},
    {text: "水", elements: ["H", "H", "O"]},
    {text: "オゾン", elements: ["O", "O", "O"]},
    {text: "アンモニア", elements: ["N", "H", "H", "H"]},
    {text: "一酸化炭素", elements: ["C", "O"]},
    {text: "二酸化炭素", elements: ["C", "O", "O"]},
    {text: "一酸化窒素", elements: ["N", "O"]},
    {text: "二酸化窒素", elements: ["N", "O", "O"]},
    {text: "一酸化二窒素", elements: ["N", "N", "O"]},
    {text: "過酸化水素", elements: ["H", "H", "O", "O"]},
    {text: "メタン", elements: ["C", "H", "H", "H", "H"]},

    {text: "酢酸", elements: ["C", "H", "H", "H", "C", "O", "O", "H"]}
]

function createPiece(gridX, gridY, delay) {
    const piece = document.createElement("div");
    piece.className = "pieces";
    piece.element = Math.floor(Math.random() * ELEMENTS.length);
    boardLayer.appendChild(piece);
    grid[gridY][gridX] = piece;

    const element = ELEMENTS[piece.element];
    piece.textContent = element.text;
    piece.style.background = `
        radial-gradient(
            circle,
            ${element.color + "22"} 0%,
            ${element.color + "99"} 100%
        )
    `;
    piece.style.border = `3px solid ${element.color}`;
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
    if (piece.isAnimating) return;
    piece.isAnimating = true;
    let scaleSpeed = 0;
    let moveSpeed = 0;
    function animate(){
        const targetY =
            piece.gridY * (GRID_SIZE + GRID_GAP)

        scaleSpeed += (1 - piece.scale) * 0.12;
        scaleSpeed *= 0.9;
        piece.scale += scaleSpeed;

        const distance = targetY - piece.animatedY;

        if (distance !== 0) {
            moveSpeed += 2 * Math.sign(distance);
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
            return;
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

let grid = Array.from({length: GRID_ROWS}, () => 
    Array(GRID_COLS).fill(null)
);
const selectPieces = [];
let isPointer = false;

for (let col = 0; col < GRID_COLS; col++) {
    for (let row = 0; row < 3; row++) {
        createPiece(col, row, col * 50 + (2 - row) * 180);
    }
}

let isGameOver = false;
function gameOver() {
    isGameOver = true;
    titleLayer.textContent = "GAME OVER"
}

document.addEventListener("pointerdown", (e) => {
    if (isGameOver) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (target?.classList.contains("pieces")) {
        isPointer = true;
        addPiece(target);
    }
})

document.addEventListener("pointerup", (e) => {
    isPointer = false;
    const molecule = isMolecule(selectPieces);
    selectPieces.forEach((piece) => {
        piece.style.filter = "brightness(1)";
        piece.style.border = 
        `3px solid ${ELEMENTS[piece.element].color}`;
        if (molecule != null) {
            grid[piece.gridY][piece.gridX] = null;
            piece.remove()
        }
    });
    selectPieces.length = 0;
    document.querySelectorAll(".lines").forEach((e) => {
        e.remove();
    })

    if (molecule === null) return;
    showMolecule(molecule);  
    for (let col = 0; col< GRID_COLS; col++) {
        let row = 1;
        for (let y= 0; y < GRID_ROWS; y++) {
            const piece = grid[y][col];
            if (piece === null) continue;
            if (row >= GRID_ROWS) {
                gameOver();
                return;
            }
            piece.gridY = row;
            row++;
        }
    }

    for (let i = 0; i < GRID_COLS; i++) {
            createPiece(i, 0, 0);
    }

    const newGrid = Array.from(
        {length: GRID_ROWS},
        () => Array(GRID_COLS).fill(null)
    );
    document.querySelectorAll(".pieces").forEach((e) => {
        newGrid[e.gridY][e.gridX] = e;
    })
    grid = newGrid;

    document.querySelectorAll(".pieces").forEach((piece) => {
        animatePiece(piece);
    });
})

document.addEventListener("pointermove", (e) => {
    if (isGameOver || !isPointer) return;

    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target?.classList.contains("pieces")) return;
    if (selectPieces.includes(target)) {
        const index = selectPieces.findIndex(i => i === target);
        if (index === selectPieces.length - 2) {
            const last = selectPieces[selectPieces.length - 1]
            last.style.filter = "brightness(1)";
            last.style.border = 
                `3px solid ${ELEMENTS[last.element].color}`;
            selectPieces.splice(selectPieces.length - 1, 1)
            document.querySelectorAll(".lines").forEach(element => {
                element.remove();
            })
            drawLine();
        }
        return;
    }
    const gapX = Math.abs(target.gridX - selectPieces[selectPieces.length - 1].gridX);
    const gapY = Math.abs(target.gridY - selectPieces[selectPieces.length - 1].gridY);
    if (gapX + gapY !== 1) return;
    document.querySelectorAll(".lines").forEach(element => {
        element.remove();
    })
    addPiece(target);
    drawLine();

})

function addPiece(piece) {
    const element = ELEMENTS[piece.element];

    piece.style.filter = "brightness(1.6)";
    piece.style.border = 
        `5px solid ${element.color}`;

    piece.scale = 1.3;
    animatePiece(piece);

    selectPieces.push(piece);
}

let titleTimer;
function showMolecule(molecule) {
    clearTimeout(titleTimer);

    titleLayer.textContent = molecule.text;
    titleLayer.style.opacity = "1";

    titleTimer = setTimeout(() => {
        titleLayer.style.opacity = "0";
    }, 2000);
}

function drawLine() {
    for (let i = 1; i < selectPieces.length; i++) {
        createLine(selectPieces[i].gridX, selectPieces[i].gridY, selectPieces[i - 1].gridX, selectPieces[i - 1].gridY)
    }
}

function createLine(x, y, x2, y2) {
    const dx = x2 - x;
    const dy = y2 - y;

    const line = document.createElement("div");
    line.className = "lines";
    line.style.zIndex = -1;
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

function isMolecule(pieces) {
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
