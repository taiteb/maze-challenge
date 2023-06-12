let cols, rows;
let w = 15;
let grid = [];

let stack = [];

let shapes = [];

let current;

function setup() {
  createCanvas(600, 600);
  cols = floor(width / w);
  rows = floor(height / w);
  // frameRate(35);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  current = grid[0];
}

function draw() {
  background(51);
  for (let i = 0; i < grid.length; i++) {
    // grid[i].show();
  }

  if (shapes.length > 0){
    for (let i = 0; i < shapes.length; i++){
      shapes[i].show();
    }
  }

  current.visited = true;
  let next = current.checkNeighbors();
  if (next) {
    next.visited = true;

    stack.push(current);

    current = next;
    // } else if (stack.length > 0) {
  } else {
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
  this.shapestack = [];
  for (let i = 0; i < stack.length; i++){
    this.shapestack[i] = stack[i];
  }
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

  this.r = random(2, 15);

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

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
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
    fill(0, 0, 255, 100);
    rect(x, y, w, w);
  }

  this.show = function () {
    let x = this.i * w;
    let y = this.j * w;
    stroke(255);
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }

    if (this.visited) {
      noStroke();
      fill(0, 255, 0, 100);
      rect(x, y, w, w);
    }
  }



}