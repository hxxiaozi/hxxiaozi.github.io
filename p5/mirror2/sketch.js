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
  const stepSize = 50;

  // loop through the pixels of the camera feed, based on stepsize
  for (let y = 0; y < capture.height; y += stepSize) {
    for (let x = 0; x < capture.width; x += stepSize) {
      const index = (x + y * capture.width) * 4;

      const r = capture.pixels[index];
      const g = capture.pixels[index + 1];
      const b = capture.pixels[index + 2];

      // get the brightness of the current pixel by averaging the color values
      const brightness = (r + g + b) / 3;
      const squareSize = map(brightness, 0, 255, 0, stepSize * 1.6);

      noStroke();

      colorMode(HSB);

      fill(115 - brightness * 0.5, 75, 100);
      // draw a rectangle using the color of the current pixel. The rectangle size is based on the brightness of pixel

      
      mood = map(brightness, 0, 255, 10, 0);
      
      if (mood >= 6) {
      circle(x, y, stepSize * 1.8-squareSize);
      stroke(0);
      strokeWeight(2);

      line(x - 5, y - 10, x - 5, y);
      line(x + 5, y - 10, x + 5, y);
        noFill();
        arc(x, y + 4, 20, 20, 0 + PI - (PI / 9) * mood, (PI / 9) * mood);
      }else{
        rectMode(CENTER)
      rect(x, y, stepSize * 1.8-squareSize);
      stroke(0);
      strokeWeight(2);

      line(x - 5, y - 10, x - 5, y);
      line(x + 5, y - 10, x + 5, y);
      }

      if (mood <= 4) {
        noFill()
        arc(x, y + 10 + mood*0.5, 15, 15, PI + mood * 0.35, 0 - mood * 0.35);
      }
       if (mood > 4 && mood < 6) {line(x-2-mood*0.5, y+7 +0.2*mood , x+2+mood*0.5, y + 7+0.5*mood);}
    
    }
  }
}
