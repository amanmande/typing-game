// js responsible for the canvas

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Car properties
var carWidth = 60;
var carHeight = 30;
var carX = 20; // Start car at the beginning of the canvas
var carY = canvas.height / 2 - carHeight / 2;
var wheelRadius = 10;
var wheelY = carY + carHeight; // Y position of the wheels

// Tree properties
var treeWidth = 20; // Main animation loop
var treeHeight = 80;
var treeSpacing = 200; // Spacing between trees
var treeSpeed = 2; // Speed of trees
var trees = [];
var animationStarted = false;

// Road properties
var roadWidth = canvas.width;
var roadHeight = canvas.height / 2;
var roadY = canvas.height / 4;
var stripeWidth = 60;
var stripeHeight = 10;
var stripeSpacing = 80; // Spacing between stripes
var roadStripes = [];

// Function to initialize road stripes
function initializeRoadStripes() {
  for (var i = 0; i < canvas.width; i += stripeSpacing) {
    roadStripes.push({
      x: i,
      y: roadY + roadHeight / 2 - stripeHeight / 2,
      width: stripeWidth,
      height: stripeHeight,
    });
  }
}

initializeRoadStripes(); // Initialize road stripes

// Function to fill a region with a specified color using flood fill algorithm
function floodFill(x, y, fillColor, targetColor) {
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  var stack = [[x, y]];

  while (stack.length) {
    var newPos, x_, y_, pixelPos, reachLeft, reachRight;

    newPos = stack.pop();
    x_ = newPos[0];
    y_ = newPos[1];

    pixelPos = (y_ * canvas.width + x_) * 4;

    while (y_-- >= 0 && matchStartColor(pixelPos, targetColor)) {
      pixelPos -= canvas.width * 4;
    }

    pixelPos += canvas.width * 4;
    ++y_;
    reachLeft = false;
    reachRight = false;

    while (y_++ < canvas.height - 1 && matchStartColor(pixelPos, targetColor)) {
      colorPixel(pixelPos, fillColor);

      if (x_ > 0) {
        if (matchStartColor(pixelPos - 4, targetColor)) {
          if (!reachLeft) {
            stack.push([x_ - 1, y_]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x_ < canvas.width - 1) {
        if (matchStartColor(pixelPos + 4, targetColor)) {
          if (!reachRight) {
            stack.push([x_ + 1, y_]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      pixelPos += canvas.width * 4;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  function matchStartColor(pixelPos, targetColor) {
    var r = data[pixelPos];
    var g = data[pixelPos + 1];
    var b = data[pixelPos + 2];

    return r === targetColor[0] && g === targetColor[1] && b === targetColor[2];
  }

  function colorPixel(pixelPos, fillColor) {
    data[pixelPos] = fillColor[0];
    data[pixelPos + 1] = fillColor[1];
    data[pixelPos + 2] = fillColor[2];
    data[pixelPos + 3] = 255;
  }
}

// Function to draw wheels
function drawWheels() {
  // Left wheel
  drawArcFilled(carX + 15, wheelY, wheelRadius, "red");
  // Right wheel
  drawArcFilled(carX + carWidth - 15, wheelY, wheelRadius, "red");
}

// Function to draw an arc and fill with color
function drawArcFilled(x, y, radius, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

// Function to draw tree leaves
function drawTreeLeaves(tree) {
  floodFill(
    tree.x + treeWidth / 2,
    canvas.height - treeHeight - 30,
    [0, 255, 0],
    [255, 255, 255]
  );
}

// Function to draw trees
function drawTrees() {
  if (!animationStarted) return;

  for (var i = 0; i < trees.length; i++) {
    var tree = trees[i];
    // Draw tree
    ctx.fillStyle = "brown";
    ctx.fillRect(
      tree.x + treeWidth / 2 - 5,
      canvas.height - treeHeight,
      10,
      treeHeight
    );
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(tree.x, canvas.height - treeHeight);
    ctx.lineTo(tree.x + treeWidth / 2, canvas.height - treeHeight - 60);
    ctx.lineTo(tree.x + treeWidth, canvas.height - treeHeight);
    ctx.closePath();
    ctx.fill();
    // Update tree position
    tree.x -= treeSpeed;
    // If the tree has moved off the canvas, remove it from the array
    if (tree.x + treeWidth < 0) {
      trees.splice(i, 1);
      i--; // Adjust the index after removing the tree
    }
  }
}

// Function to draw the car
function drawCar() {
  // Draw car body
  ctx.fillStyle = "blue";
  ctx.fillRect(carX, carY, carWidth, carHeight);

  // Draw car top
  ctx.fillStyle = "black";
  ctx.fillRect(carX + 10, carY - 10, carWidth - 20, carHeight - 20);
  ctx.fillStyle = "yellow";
  drawArc(carX + 15, carY + carHeight, 10); // Left wheel
  drawArc(carX + carWidth - 15, carY + carHeight, 10); // Right wheel

  // Draw wheels
  drawWheels();
}

// Function to draw an arc using Bresenham's algorithm
function drawArc(x, y, radius, color) {
  var d = 3 - 2 * radius;
  var x_ = 0;
  var y_ = radius;

  while (x_ <= y_) {
    drawPixel(x + x_, y + y_, color);
    drawPixel(x - x_, y + y_, color);
    drawPixel(x + x_, y - y_, color);
    drawPixel(x - x_, y - y_, color);
    drawPixel(x + y_, y + x_, color);
    drawPixel(x - y_, y + x_, color);
    drawPixel(x + y_, y - x_, color);
    drawPixel(x - y_, y - x_, color);

    if (d < 0) {
      d = d + 4 * x_ + 6;
    } else {
      d = d + 4 * (x_ - y_) + 10;
      y_--;
    }
    x_++;
  }
}

// Function to draw a pixel and fill with color
function drawPixel(x, y, color) {
  ctx.fillRect(x, y, 1, 1);
}

// Function to draw a pixel
function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

// Function to draw the road
function drawRoad() {
  ctx.fillStyle = "gray";
  ctx.fillRect(0, roadY, roadWidth, roadHeight);

  // Draw road stripes
  ctx.fillStyle = "white";
  for (var i = 0; i < roadStripes.length; i++) {
    var stripe = roadStripes[i];
    ctx.fillRect(stripe.x, stripe.y, stripe.width, stripe.height);
  }
}

// Function to clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to add new trees
function addTrees() {
  if (!animationStarted) return;

  if (
    trees.length === 0 ||
    canvas.width - trees[trees.length - 1].x >= treeSpacing
  ) {
    var newTree = {
      x: canvas.width,
      speed: treeSpeed,
    };
    trees.push(newTree);
  }
}
//function to calculate the speed (wpm)
function updateTreeSpeed() {
  var wpm = Math.ceil(document.querySelector(".wpm span").innerText);
  treeSpeed = wpm / 4;
}

setInterval(updateTreeSpeed, 1000); //changes the speed of the tree

// Main animation loop
function draw() {
  if (timeLeft > 0) {
    clearCanvas();
    drawRoad();
    drawTrees();
    drawCar();
    addTrees();
    requestAnimationFrame(draw);

    // moves the road according to the speed(wpm)
    var wpm = parseInt(document.querySelector(".wpm span").innerText);
    var treeSpeed = wpm / 5; // Adjust this factor to suit the speed

    for (var i = 0; i < roadStripes.length; i++) {
      roadStripes[i].x -= treeSpeed;
      if (roadStripes[i].x < -stripeWidth) {
        roadStripes[i].x = canvas.width;
      }
    }
  }

  if (timeLeft == 0) {
    console.log("done");
  }
}
// Start the animation
draw();
