const treeContainer = document.getElementById('tree-container');
const canvas = document.getElementById('canvas');
const tree = document.getElementById('tree');

let isDragging = false;
let startX;
let startY;
let scrollLeft;
let scrollTop;

treeContainer.addEventListener('wheel', function(event) {
    event.preventDefault();

    const delta = Math.sign(event.deltaY);
    const zoomValue = parseFloat(window.getComputedStyle(canvas).zoom);

    if (zoomValue - delta > -0.2 && zoomValue - delta < 3) {
        canvas.style.zoom = zoomValue - delta * 0.05;
        tree.style.zoom = zoomValue - delta * 0.05;
    }
});

treeContainer.addEventListener('mouseup', () => {
    isDragging = false;
    treeContainer.style.cursor = 'default';
    treeContainer.style.removeProperty('user-select');
});

treeContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    treeContainer.style.cursor = 'grabbing';
    treeContainer.style.userSelect = 'none';
    startX = e.pageX - treeContainer.offsetLeft;
    startY = e.pageY - treeContainer.offsetTop;
    scrollLeft = treeContainer.scrollLeft;
    scrollTop = treeContainer.scrollTop;
});

treeContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.pageX - treeContainer.offsetLeft;
    const y = e.pageY - treeContainer.offsetTop;
    const dragX = x - startX;
    const dragY = y - startY;
    treeContainer.scrollLeft = scrollLeft - dragX;
    treeContainer.scrollTop = scrollTop - dragY;
});

