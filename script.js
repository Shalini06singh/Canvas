const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const textInput = document.getElementById("text-input");
const addTextButton = document.getElementById("add-text");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");
const fontSizeInput = document.getElementById("font-size");

let fontSize = parseInt(fontSizeInput.value, 10);
let texts = [];
let undoneActions = [];
let selectedText = null;
let isDragging = false;

// Set default font
ctx.font = `${fontSize}px Arial`;

fontSizeInput.addEventListener("input", () => {
  fontSize = parseInt(fontSizeInput.value, 10);
  ctx.font = `${fontSize}px Arial`;
});

// Add text
addTextButton.addEventListener("click", () => {
  const text = textInput.value.trim();
  if (text) {
    texts.push({ text, x: 100, y: 100, fontSize });
    textInput.value = "";
    undoneActions = [];
    redraw();
  }
});

// Undo
undoButton.addEventListener("click", () => {
  if (texts.length > 0) {
    undoneActions.push(texts.pop());
    redraw();
  }
});

// Redo
redoButton.addEventListener("click", () => {
  if (undoneActions.length > 0) {
    texts.push(undoneActions.pop());
    redraw();
  }
});

// Draw all texts
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  texts.forEach((t) => {
    ctx.font = `${t.fontSize}px Arial`;
    ctx.fillText(t.text, t.x, t.y);
  });
}

// Check if mouse is over text
function isMouseOverText(x, y, text) {
  const textWidth = ctx.measureText(text.text).width;
  const textHeight = text.fontSize;
  return (
    x >= text.x &&
    x <= text.x + textWidth &&
    y <= text.y &&
    y >= text.y - textHeight
  );
}

// Select and move text
canvas.addEventListener("mousedown", (e) => {
  const { offsetX, offsetY } = e;
  selectedText = texts.find((text) => isMouseOverText(offsetX, offsetY, text));
  if (selectedText) {
    isDragging = true;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging && selectedText) {
    const { offsetX, offsetY } = e;
    selectedText.x = offsetX;
    selectedText.y = offsetY;
    redraw();
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
  selectedText = null;
});
