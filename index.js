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
    {text: "H", col: "#4987ae"},
    {text: "C", col: "#2c8a5d"},
    {text: "N", col: "#9f6035"},
    {text: "O", col: "#9d333e"}
];

const MOLECULES = [
    {text: "水素", con: ["H", "H"]},
    {text: "酸素", con: ["O", "O"]},
    {text: "窒素", con: ["N", "N"]},
    {text: "水", con: ["H", "H", "O"]},
    {text: "オゾン", con: ["O", "O", "O"]},
    {text: "アンモニア", con: ["N", "H", "H", "H"]},
    {text: "一酸化炭素", con: ["C", "O"]},
    {text: "二酸化炭素", con: ["C", "O", "O"]},
    {text: "一酸化窒素", con: ["N", "O"]},
    {text: "二酸化窒素", con: ["N", "O", "O"]},
    {text: "一酸化二窒素", con: ["N", "N", "O"]},
    {text: "過酸化水素", con: ["H", "H", "O", "O"]},
    {text: "メタン", con: ["C", "H", "H", "H", "H"]},

    {text: "酢酸", con: ["C", "H", "H", "H", "C", "O", "O", "H"]}
]

function creatSelect(col, row, d) {
    const piece = document.createElement("div");
    piece.className = "pieces";
    piece.element = Math.floor(Math.random() * ELEMENTS.length);
    boardLayer.appendChild(piece);
    grid[row][col] = piece;

    piece.textContent = ELEMENTS[piece.element].text;
    piece.style.background = `
        radial-gradient(
            circle,
            ${ELEMENTS[piece.element].col + "22"} 0%,
            ${ELEMENTS[piece.element].col + "99"} 100%
        )
    `;
    piece.style.border = 
        `3px solid ${ELEMENTS[piece.element].col}`;
    piece.style.width = `${GRID_SIZE}px`;
    piece.style.height = `${GRID_SIZE}px`;
    piece.GridX = col;
    piece.GridY = row;
    piece.style.left = 
        `${piece.GridX * (GRID_SIZE + GRID_GAP)}px`;
    piece.style.top = `0px`;
    piece.animeY = - 180 - d;
    piece.scale = 1;
    piece.style.transform = 
                `translateY(${piece.animeY}px)`;
    piece.isAnimating = false;
    animates(piece);
}

function animates(p) {
    if (p.isAnimating) return;
    p.isAnimating = true;
    let scaleSpeed = 0;
    let isScale = true;
    let fallSpeed = 0;
    let isFall = true
    const targetY = p.GridY * (GRID_SIZE + GRID_GAP)
    function animate(){
        scaleSpeed += (1 - p.scale) * 0.12;
        scaleSpeed *= 0.9;
        p.scale += scaleSpeed;
        isScale = true;
        if (Math.abs(p.scale - 1) < 0.01 && Math.abs(scaleSpeed) < 0.01) {
            p.scale = 1;
            scaleSpeed = 0;
            isScale = false;
        }
        fallSpeed += 2 * (targetY - p.animeY > 0) - 1;
        p.animeY += fallSpeed;
        isFall = true;
        if (Math.abs(targetY - p.animeY) < Math.abs(fallSpeed)) {
            p.animeY = targetY;
            p.style.transform = 
                `translateY(${p.animeY}px) scale(${p.scale})`;
            fallSpeed = 0;
            isFall = false;
        }
        p.style.transform = 
                `translateY(${p.animeY}px) scale(${p.scale})`;
        if (!isScale && !isFall) {
            p.isAnimating = false;
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
        creatSelect(col, row, col * 50 + (2 - row) * 180);
    }
}

document.addEventListener("pointerdown", (e) => {
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
        `3px solid ${ELEMENTS[piece.element].col}`;
        if (molecule != null) {
            grid[piece.GridY][piece.GridX] = null;
            piece.remove()
        }
    });
    selectPieces.length = 0;
    document.querySelectorAll(".lines").forEach((e) => {
        e.remove();
    })
    if (molecule === null) return;
    titleLayer.textContent = molecule.text;
    for (let col = 0; col< GRID_COLS; col++) {
        let row = 1;
        for (let y= 0; y < GRID_ROWS; y++) {
            const piece = grid[y][col];
            if (piece === null) continue;
            piece.GridY = row;
            animates(piece);
            row++;
        }
    }
    for (let i = 0; i < GRID_COLS; i++) {
            creatSelect(i, 0, 0);
    }
    const newGrid = Array.from(
        {length: GRID_ROWS},
        () => Array(GRID_COLS).fill(null)
    );
    document.querySelectorAll(".pieces").forEach((e) => {
        newGrid[e.GridY][e.GridX] = e;
    })
    grid = newGrid;
})

document.addEventListener("pointermove", (e) => {
    if (!isPointer) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target?.classList.contains("pieces")) return;
    if (selectPieces.includes(target)) {
        const index = selectPieces.findIndex(i => i === target);
        if (index === selectPieces.length - 2) {
            const last = selectPieces[selectPieces.length - 1]
            last.style.filter = "brightness(1)";
            last.style.border = 
                `3px solid ${ELEMENTS[last.element].col}`;
            selectPieces.splice(selectPieces.length - 1, 1)
            document.querySelectorAll(".lines").forEach(element => {
                element.remove();
            })
            genLine();
        }
        return;
    }
    const gapX = Math.abs(target.GridX - selectPieces[selectPieces.length - 1].GridX);
    const gapY = Math.abs(target.GridY - selectPieces[selectPieces.length - 1].GridY);
    if (gapX + gapY !== 1) return;
    document.querySelectorAll(".lines").forEach(element => {
        element.remove();
    })
    addPiece(target);
    genLine();

})

function addPiece(t) {
    t.style.filter = "brightness(1.6)";
    t.style.border = 
        `5px solid ${ELEMENTS[t.element].col}`;

    t.scale = 1.3;
    animates(t);

    selectPieces.push(t);
}

function genLine() {
    for (let i = 1; i < selectPieces.length; i++) {
        createLine(selectPieces[i].GridX, selectPieces[i].GridY, selectPieces[i - 1].GridX, selectPieces[i - 1].GridY)
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

function isMolecule(s) {
    const sSort = s
        .map((e) => ELEMENTS[e.element].text)
        .sort();
    return MOLECULES.find((molecule) => {
        const mSort = [...molecule.con].sort();
        
        return (
            sSort.length === mSort.length &&
            sSort.every((value, index) => value === mSort[index])
        );
    }) ?? null;
}
