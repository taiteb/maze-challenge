// defining grid agent moves through
let cols, rows;
let w = 8;
let grid = [];
// list of locations finder agent has moved through
let stack = [];
// List of shapes as defined by stack once agent has reached no available neighbors
let shapes = [];
// sets current position of finder
let current;

function setup() {
  createCanvas(600, 600);
  // making grid
  cols = floor(width / w);
  rows = floor(height / w);
  // frameRate(35);

  // fills grid with cells that have location properties, visited toggle, list of available neighbors
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  // starting position top right corner
  current = grid[0];
}

function draw() {
  background(51);
  // if a stack has been filled & a new shape obj created, show it
  if (shapes.length > 0){
    for (let i = 0; i < shapes.length; i++){
      shapes[i].show();
    }
  }

  // if it's still actively looking for spots, show where it's going
  if (stack.length > 0){
    current.highlight();
  }

  // for every cycle, marked that the current location has been visited
  current.visited = true;
  // see if there's an available neighbor for the agent to move to; if it can, mark that the next index has been visited, push the current location to the stack, and set the next value as current for the next cycle
  let next = current.checkNeighbors();
  if (next) {
    next.visited = true;

    stack.push(current);

    current = next;
    // } else if (stack.length > 0) {
  } else {
    // if the agent can no longer move anywhere, push current to stack, create new shape obj with values from stack & push it to shapes, reset the stack, set a new starting location at an unvisited location
    stack.push(current);
    let newshape = new shapeify();
    shapes.push(newshape);
    // console.log(shapes[0]);
    stack = [];
    for (let i = 0; i < grid.length; i++){
      if (!grid[i].visited){
        current = grid[i];
      }
    }
  }
}

function shapeify() {
  // make new list that will copy the values from the global stack
  this.shapestack = [];
  for (let i = 0; i < stack.length; i++){
    this.shapestack[i] = stack[i];
  }

  // I'll be trying to figure out how to find the outer parameters of what's been visited here, to draw an outline. right now this does nothing and isn't called in draw()
  this.showShape = function() {
    stroke(0, 255, 0);
    beginShape();
    
    for (let i = 0; i < this.shapestack.length; i++) {
      var x = this.shapestack[i].i * w;
      var y = this.shapestack[i].j * w;
      vertex(x, y);
    }
    for (let i = 0; i < this.shapestack.length; i++){
      var x = (this.shapestack[i].i * w) - w;
      var y = (this.shapestack[i].j * w) - w;
      vertex(x,y);
    }
    endShape();
    
  }

  // Set a random radius for the circles on a by-object basis to give variation, with a max of the width of the grid
  this.r = random(2, w);

  // draw a circle in the center of the square for each index in shapestack
  this.show = function(){
    noStroke();
    fill(0, 255, 0);
    for (i = 0; i < this.shapestack.length; i++){
      var x = this.shapestack[i].i * w;
      var y = this.shapestack[i].j * w;
      circle(x + (w/2), y + (w/2), this.r);
    }
  }
}

// finds the index of grid squares in relation to current square, given that they are within bounds 
function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.visited = false;
  // Top, right, bottom, left
  this.checkNeighbors = function () {
    let neighbors = [];
    let top = grid[index(i, j - 1)];
    let right = grid[index(i + 1, j)];
    let bottom = grid[index(i, j + 1)];
    let left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  this.highlight = function () {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill(0, 0, 255);
    rect(x, y, w, w);
  }
}