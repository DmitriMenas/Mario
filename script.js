// Initialize game canvas and context
var canvas = document.createElement("canvas");
canvas.width = 3584;
canvas.height = 345;
var ctx = canvas.getContext("2d");

// Apply inline styles to position the canvas
canvas.style.position = "absolute";
canvas.style.width = "3584px";
canvas.style.height = "345px";

// Listen for keydown events on the window
window.addEventListener('keydown', function(event) {
    // Check if the pressed key is an arrow key
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        // Prevent the default behavior of arrow keys
        event.preventDefault();
    }
});

document.querySelector(".game-container").appendChild(canvas);

// Load background image
var img = new Image();
img.onload = function() {
    // Once the background image is loaded, start loading the character image
    characterImg.src = './assets/character-right.png'; // Start loading the character image
};
img.src = './assets/map.png'; // Replace 'world.png' with the path to your background image file

// Define character size
var characterWidth = 50, characterHeight = 50; // Assign appropriate values

// Load character image
// Load character image
var characterImg = new Image();
characterImg.onload = function() {
    // Define new width and height for the character
    characterWidth = characterImg.width / 8; // Quarter the original width
    characterHeight = characterImg.height / 8; // Quarter the original height

    // Set initial character position
    characterX = 100; // places character on the left side of the screen
    characterY = 165; // places character on the ground

    // Once the character image is loaded, start the game loop
    gameLoop();
};
characterImg.src = './assets/character-right.png';

// Load all character images
var characterImages = {
    'character-left': new Image(),
    'character-right': new Image()
};
characterImages['character-left'].src = './assets/character-left.png';
characterImages['character-right'].src = './assets/character-right.png';

// Define initial character position
var characterX = 100; // Assign a default character position    
var characterY = 208; // Assign a default character position
// Define initial character model
var characterModel = 'character-right'; // Assign a default character model

// Define camera right after your character definitions
var camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    zoom: 2 // Increase for more zoom
};



// Main game loop
function gameLoop() {
    // Update game state
    handleMovement();

    // Update camera position to follow the character
    var cameraOffsetX = 600;
    var backgroundShiftY = -45;
    camera.x = characterX - canvas.width / 2 / camera.zoom + cameraOffsetX;
    camera.y = canvas.height / 2 / camera.zoom + backgroundShiftY;

    // Ensure camera doesn't go out of bounds
    camera.x = Math.max(0, Math.min(img.width - canvas.width / camera.zoom, camera.x));
    camera.y = Math.max(0, Math.min(img.height - canvas.height / camera.zoom, camera.y));

    // Update page scroll position based on character's position
    updateScrollPosition();

    // Render game world
    render();

    // Request next frame
    requestAnimationFrame(gameLoop);
}
// Update page scroll position based on character's position
function updateScrollPosition() {
    // Calculate desired horizontal scroll position based on the character's position and desired offset
    var desiredScrollX = characterX - window.innerWidth / 1 - 160; // Adjust the offset as needed

    // Set the window horizontal scroll position
    window.scrollTo(desiredScrollX, window.scrollY);
}

// Render game world
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image onto canvas, adjusted for camera position and zoom
    ctx.drawImage(img, -camera.x * camera.zoom, -camera.y * camera.zoom, canvas.width * camera.zoom, canvas.height * camera.zoom);

    // Draw character image onto canvas with new width and height, adjusted for camera position and zoom
    var characterImage = characterImages[characterModel];
    if (characterImage && characterImage.complete) {
        ctx.drawImage(characterImage, (characterX - camera.x) * camera.zoom, (characterY - camera.y) * camera.zoom, characterWidth * camera.zoom, characterHeight * camera.zoom);
    }
}

// Movement function based on arrow keys
// Create an object to keep track of which keys are being pressed
var keys = {};

// Listen for keydown and keyup events
window.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});
window.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});


// Add these variables to your script
var gravity = 0.4;
var jumpStrength = 8;
var isJumping = false;
var velocityY = 0;

var boundaries = [
    { x: 0, y: 208, width: 1103, height: 31 },// Ground    1
    { x: 256, y: 144, width: 15, height: 15 }, // 1 block
    { x: 320, y: 144, width: 80, height: 15 }, //4 block long
    { x: 352, y: 80, width: 15, height: 15 }, //1 block
    { x: 448, y: 175, width: 30, height: 32 }, //short tube
    { x: 608, y: 160, width: 30, height: 48}, //medium tube
    { x: 736, y: 144, width: 30, height: 64}, //tall tube
    { x: 912, y: 144, width: 30, height: 64}, //tall tube
    { x: 1136, y: 208, width: 239, height: 31 }, // Ground 2
    { x: 1232, y: 144, width: 47, height: 15}, // 3 block
    { x: 1280, y: 80, width: 127, height: 15}, // 6? block
    { x: 1424, y: 208, width: 1023, height: 31}, // Ground 3
    { x: 1456, y: 80, width: 63, height: 15}, // 4 block
    { x: 1504, y: 144, width: 15, height: 15}, // 1 block
    { x: 1600, y: 144, width: 31, height: 15}, //2 block
    { x: 1696, y: 144, width: 15, height: 15}, //1 block
    { x: 1744, y: 144, width: 15, height: 15}, //1 block
    { x: 1744, y: 80, width: 15, height: 15}, //1 block
    { x: 1792, y: 144, width: 15, height: 15}, //1 block
    { x: 1888, y: 144, width: 15, height: 15}, //1 block
    { x: 1936, y: 80, width: 47, height: 15}, //3 block
    { x: 2048, y: 80, width: 63, height: 15}, //4 block
    { x: 2064, y: 144, width: 31, height: 15}, //2 block
    { x: 2144, y: 192, width: 63, height: 15}, //stacked obstacle- up
    { x: 2160, y: 176, width: 47, height: 15}, //stacked obstacle- up
    { x: 2176, y: 160, width: 31, height: 15}, //stacked obstacle- up
    { x: 2192, y: 144, width: 15, height: 15}, //stacked obstacle- up
    { x: 2240, y: 144, width: 15, height: 15}, //stacked obstacle-down
    { x: 2240, y: 160, width: 31, height: 15}, //stacked obstacle-down
    { x: 2240, y: 176, width: 47, height: 15}, //stacked obstacle-down
    { x: 2240, y: 192, width: 63, height: 15}, //stacked obstacle-down
    { x: 2368, y: 192, width: 79, height: 15}, //stacked obstacle- up
    { x: 2384, y: 176, width: 63, height: 15}, //stacked obstacle- up
    { x: 2400, y: 160, width: 47, height: 15}, //stacked obstacle- up
    { x: 2416, y: 144, width: 31, height: 15}, //stacked obstacle- up
    { x: 2480, y: 208, width: 1103, height: 31},// Ground 4
    { x: 2480, y: 144, width: 15, height: 15}, //stacked obstacle-down
    { x: 2480, y: 160, width: 31, height: 15}, //stacked obstacle-down
    { x: 2480, y: 176, width: 47, height: 15}, //stacked obstacle-down
    { x: 2480, y: 192, width: 63, height: 15}, //stacked obstacle-down
    { x: 2608, y: 175, width: 30, height: 32 }, //short tube
    { x: 2688, y: 144, width: 63, height: 15}, //4 block
    { x: 2864, y: 175, width: 30, height: 32 }, //short tube
    { x: 2896, y: 192, width: 143, height: 15}, //stacked obstacle- up
    { x: 2912, y: 176, width: 127, height: 15}, //stacked obstacle- up
    { x: 2928, y: 160, width: 111, height: 15}, //stacked obstacle- up
    { x: 2944, y: 144, width: 95, height: 15}, //stacked obstacle- up
    { x: 2960, y: 128, width: 79, height: 15}, //stacked obstacle- up
    { x: 2976, y: 112, width: 63, height: 15}, //stacked obstacle- up
    { x: 2992, y: 96, width: 47, height: 15}, //stacked obstacle- up
    { x: 3008, y: 80, width: 31, height: 15}, //stacked obstacle- up
    { x: 3168, y: 192, width: 15, height: 15, exit: true}, // Flag
];

// Define the image URLs array
var imageUrls = [
    './assets/flag.png',
];

// Call the dropFlag function when the character reaches the exit point
function handleMovement() {
    // Check if the character reaches the exit point
    for (var i = 0; i < boundaries.length; i++) {
        var boundary = boundaries[i];
        if (boundary.exit && characterX + characterWidth > boundary.x && characterX < boundary.x + boundary.width &&
            characterY + characterHeight > boundary.y && characterY < boundary.y + boundary.height) {
            dropFlag(); // Trigger the flag dropping animation
            return; // Exit the function
        }
    }
}

function handleMovement() {
    // Define movement speed
    var moveSpeed = 3;

    // Calculate new position
    var newX = characterX;
    var newY = characterY;

    // Handle horizontal movement
    if (keys["ArrowLeft"]) {
        newX -= moveSpeed;
        characterModel = 'character-left';
    }
    if (keys["ArrowRight"]) {
        newX += moveSpeed;
        characterModel = 'character-right';
    }

    // Handle jumping
    if (keys["ArrowUp"] && !isJumping) {
        velocityY = -jumpStrength;
        isJumping = true;
    }

    // Apply gravity
    velocityY += gravity;
    newY += velocityY;

    // Debugging: Print character position before collision detection
    console.log("Character Position Before Collision Detection: ", newX, newY);

    // Collision detection
    for (var i = 0; i < boundaries.length; i++) {
        var boundary = boundaries[i];
        
            // Check vertical collision
        if (newX + characterWidth > boundary.x && newX < boundary.x + boundary.width &&
            newY + characterHeight > boundary.y && newY < boundary.y + boundary.height) {
            // Check if the character is falling and collides with the top of the boundary
            if (velocityY > 0 && newY < boundary.y) {
                newY = boundary.y - characterHeight; // Land on the top of the boundary
                velocityY = 0; // Reset velocity
                isJumping = false; // Reset jump state
            }
            // Check if the character is jumping and collides with the bottom of the boundary
            else if (velocityY < 0 && newY > boundary.y) {
                newY = boundary.y + boundary.height; // Hit the bottom of the boundary
                velocityY = 0; // Reset velocity
            }
        }
        let buffer = 5; // Adjust as needed
            // Check horizontal collision
        if (newY + characterHeight > boundary.y && newY < boundary.y + boundary.height &&
            newX + characterWidth > boundary.x && newX < boundary.x + boundary.width) {
            // Check if moving left
            if (keys["ArrowLeft"]) {
                newX = boundary.x + boundary.width + buffer; // Adjust position to the right of the boundary
            }
            // Check if moving right
            if (keys["ArrowRight"]) {
                newX = boundary.x - characterWidth - buffer; // Adjust position to the left of the boundary
            }
        }
    }

    // Debugging: Print character position after collision detection
    console.log("Character Position After Collision Detection: ", newX, newY);

    // Update character position
    characterX = newX;
    characterY = newY;
}
// this is a test.