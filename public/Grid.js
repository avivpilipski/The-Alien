export const gridSize = 40; // Reduced grid size
export const mapCols = Math.floor(window.innerWidth * 0.75 / gridSize); // 75% of screen width
export const mapRows = Math.floor(window.innerHeight / gridSize);
const mapWidth = mapCols * gridSize;
const mapHeight = mapRows * gridSize;

// helper for snap to grid
export function snapToGrid(value) {
    return Math.round(value / gridSize) * gridSize;
}

// Initializes the stage
export const stage = new Konva.Stage({
    container: 'container',
    width: mapWidth,
    height: mapHeight
});

// Create a layer for the sprites and interactions
export const layer = new Konva.Layer();
stage.add(layer);

// Draws the fence cutting the map in half
export function drawFence() {
    const fenceY = Math.floor(mapRows / 2) * gridSize + gridSize / 2 - 2;
    for (let i = 0; i < mapCols; i++) {
        const fenceTile = new Konva.Rect({
            x: i * gridSize,
            y: fenceY,
            width: gridSize,
            height: 4,
            fill: '#D3D3D3'
        });
        layer.add(fenceTile);
    }
}
drawFence();

// Creates the player sprite
const spriteSize = gridSize * 0.7;
const spriteOffset = (gridSize - spriteSize) / 2;

export const player = new Konva.Rect({
    x: Math.floor(mapCols / 4) * gridSize + spriteOffset,
    y: Math.floor(mapRows / 2 - 2) * gridSize + spriteOffset,
    width: spriteSize,
    height: spriteSize,
    fill: 'blue'
});
layer.add(player);

// Creates the NPC
export const npc = new Konva.Rect({
    x: Math.floor((mapCols / 4) * 3) * gridSize + spriteOffset,
    y: Math.floor(mapRows / 2 + 1) * gridSize + spriteOffset,
    width: spriteSize,
    height: spriteSize,
    fill: 'green'
});
layer.add(npc);

// Movement speed
const speed = gridSize;

// Adds keyboard controls for movement. wasd and arrow keys
export function handlePlayerMovement(e) {
    let newX = player.x();
    let newY = player.y();

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            newY -= speed;
            break;
        case 'ArrowDown':
        case 's':
            newY += speed;
            break;
        case 'ArrowLeft':
        case 'a':
            newX -= speed;
            break;
        case 'ArrowRight':
        case 'd':
            newX += speed;
            break;
    }

    newX = Math.min(Math.max(snapToGrid(newX - spriteOffset), 0), mapWidth - gridSize) + spriteOffset;
    newY = Math.min(Math.max(snapToGrid(newY - spriteOffset), 0), mapHeight - gridSize) + spriteOffset;

    const fenceY = Math.floor(mapRows / 2) * gridSize + gridSize / 2 - 2;
    const isAboveFence = newY + spriteSize <= fenceY;
    const isBelowFence = newY >= fenceY + 4;

    if (!(isAboveFence || isBelowFence)) return;

    player.position({ x: newX, y: newY });
    layer.batchDraw();
}

layer.draw();
