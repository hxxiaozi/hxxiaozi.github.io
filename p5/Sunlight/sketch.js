// Rozin Mirror Starter

let capture;
let mood;

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide();
}

function draw() {
  clear();

  capture.loadPixels();

  // ensure we're getting a capture feed before doing any operations on the feed
  if (capture.pixels.length > 0) {
    mirror();
  }
}

// Edit the mirror function below
function mirror() {
  // tip: choose a number that divides evenly into your capture width (640)
  const stepSize = 40;

  // loop through the pixels of the camera feed, based on stepsize
  for (let y = 0; y < capture.height; y += stepSize) {
    for (let x = 0; x < capture.width; x += stepSize) {
      const index = (x + y * capture.width) * 4;

      const r = capture.pixels[index];
      const g = capture.pixels[index + 1];
      const b = capture.pixels[index + 2];

      // get the brightness of the current pixel by averaging the color values
      const brightness = (r + g + b) / 3;
      const squareSize = map(255-brightness, 0, 255, 15, stepSize * 1.5);

     


      fill(r,g,b)
 
  
    
       
      push()
      
      translate(x,y)
      t = millis() / 1000
      rotate(t/20)
      translate(-x,-y)
  
      
      strokeWeight(5);
      
      
      stroke(r,g,b,brightness*squareSize/30-80)
     
      line(x-windowWidth*2, y,x,y)
    
      pop()
      
      noStroke();
      circle(x, y, stepSize * 1.5 - squareSize);
      
      
     

      
    }
  }
}
