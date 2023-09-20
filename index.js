const canvas = document.querySelector(".canvas");
const g = canvas.getContext("2d");
const graphPanel = document.querySelector(".graph-panel");
const input = document.querySelector(".input");

const mouse = {
    x: null,
    y: null,
    clickX: null,
    clickY: null,
    down: false
};

let canvasOffset = null;
let width = null;
let height = null;
let gridWidth = 1;
let gridHeight = 1;
let graphX = 0;
let graphY = 0;
let zoom = 1;
let formula = "tan(x)";
let debug = {calcs: 0};

function resize() {
    width = graphPanel.clientWidth;
    height = graphPanel.clientHeight;
    graphX = width / 2;
    graphY = height / 2;
    gridWidth = 20 * zoom * zoom;
    gridHeight = 20 * zoom * zoom;
    canvasOffset = canvas.getBoundingClientRect().left;
    g.canvas.width = width;
    g.canvas.height = height;
}

function f(x) {
    try {
        const a = math.evaluate(formula, {x: x});
        debug.calcs++;
        return a;
    } catch {
        return null;
    }
}

function main() {
    g.clearRect(0, 0, width, height);

    debug.calcs = 0;

    // Vertical gridlines
    g.strokeStyle = "lightgray";
    g.beginPath();
    
    let lines = Math.floor(width / gridWidth) + 1;
    for (let x = 0; x < lines; x++) {
        g.moveTo(graphX % gridWidth + x * gridWidth, 0);
        g.lineTo(graphX % gridWidth + x * gridWidth, height);
    }
    lines = Math.floor(height / gridHeight) + 1;
    for (let y = 0; y < lines; y++) {
        g.moveTo(0, graphY % gridHeight + y * gridHeight, );
        g.lineTo(width, graphY % gridHeight + y * gridHeight);
    }

    g.stroke()

    // Axes
    g.strokeStyle = "black";
    g.beginPath();
    g.moveTo(0, graphY);
    g.lineTo(width, graphY);
    g.moveTo(graphX, 0);
    g.lineTo(graphX, height);
    g.stroke();

    // Graph
    g.strokeStyle = "red";
    g.beginPath();
    g.moveTo(-100, 0);
    for (let x = 0; x < width; x++) {
        g.lineTo(x, graphY - f((x - graphX) / gridWidth) * gridHeight);
    }
    g.stroke();

    if (mouse.down) {
        graphX = mouse.x + mouse.dragX;
        graphY = mouse.y + mouse.dragY;
    }

    g.font = "18px monospace";
    g.fillText(`Calculations: ${debug.calcs}`, 10, 22);

    window.requestAnimationFrame(main);
}

window.addEventListener("resize", resize);

canvas.addEventListener("mousedown", () => {
    mouse.down = true; 
    mouse.clickX = mouse.x; 
    mouse.clickY = mouse.y;
    mouse.dragX = graphX - mouse.clickX;
    mouse.dragY = graphY - mouse.clickY;
});

window.addEventListener("mouseup", () => {mouse.down = false});

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX - canvasOffset; 
    mouse.y = e.clientY;
});

window.addEventListener("wheel", e => {
    zoom = Math.min(Math.max(0.5, zoom + e.deltaY * -0.001), 4);
    gridWidth = 20 * zoom * zoom;
    gridHeight = 20 * zoom * zoom;
    console.log(zoom);
});

input.addEventListener("input", () => {
    formula = input.value;
});

resize();

main();