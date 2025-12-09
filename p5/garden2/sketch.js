let palettes = {
  Spring: ["orange", "yellowgreen", "cornsilk", "lightblue", "lightsalmon"],
  Summer: ["gold", "orangered", "green", "dodgerblue","darkgreen"],
  Fall:   ["olivedrab", "wheat", "peru", "firebrick","goldenrod"],
  Winter: ["thistle", "beige", "lightcyan", "lightpink","powderblue",]
};

let theme, bgCol;
let paletteSelect, fadeSlider, bgSelect, sizeSlider, swFactorSlider, frSlider;
let uiContainer, toggleButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noStroke();

  theme = palettes.Spring;
  bgCol = color("black");

  // --- UI container ---
  uiContainer = createDiv('').id('ui-container');

  // Palette selector
  uiContainer.child(createSpan('Palette: ').class('ui-label'));
  paletteSelect = createSelect().class('ui-select');
  for (let p in palettes) paletteSelect.option(p);
  paletteSelect.changed(() => theme = palettes[paletteSelect.value()]);
  uiContainer.child(paletteSelect);

  // Fade slider
  uiContainer.child(createP(''));
  uiContainer.child(createSpan('Fade Rate: ').class('ui-label'));
  fadeSlider = createSlider(0, 100, 20, 10).class('ui-slider');
  uiContainer.child(fadeSlider);

  // Background selector
  uiContainer.child(createP(''));
  uiContainer.child(createSpan('Background: ').class('ui-label'));
  bgSelect = createSelect().class('ui-select');
  ["black","Gainsboro","azure","grey"].forEach(opt => bgSelect.option(opt));
  bgSelect.changed(() => bgCol = color(bgSelect.value()));
  uiContainer.child(bgSelect);

  // Size slider
  uiContainer.child(createP(''));
  uiContainer.child(createSpan('Size: ').class('ui-label'));
  sizeSlider = createSlider(50, 200, 120, 10).class('ui-slider');
  uiContainer.child(sizeSlider);

  // Stroke weight factor slider
  uiContainer.child(createP(''));
  uiContainer.child(createSpan('Stroke Weight: ').class('ui-label'));
  swFactorSlider = createSlider(0.5, 2, 1, 0.1).class('ui-slider');
  uiContainer.child(swFactorSlider);

  // FrameRate slider
  uiContainer.child(createP(''));
  uiContainer.child(createSpan('FrameRate: ').class('ui-label'));
  frSlider = createSlider(6, 60, 12, 2).class('ui-slider');
  uiContainer.child(frSlider);

  // Hide UI by default
  uiContainer.hide();

  // --- Toggle button ---
  toggleButton = createButton('Settings').id('toggle-button');
  toggleButton.mousePressed(() => {
    if (uiContainer.elt.style.display !== 'none') {
      uiContainer.hide();
      toggleButton.html('Settings');
    } else {
      uiContainer.show();
      toggleButton.html('Hide');
    }
  });

  background(bgCol);
}


function draw() {
  let fadeAmt = fadeSlider.value();
  let fr = frSlider.value();
  frameRate(fr);

  background(red(bgCol), green(bgCol), blue(bgCol), fadeAmt);
  push();
  noStroke();
  fill((red(bgCol)+green(bgCol)+blue(bgCol))/3 < 128 ? 255 : 0);
  textSize(16);
  textAlign(RIGHT);
  text("Click & Hold to paint flowers", windowWidth*0.95, 28);
  pop();

  if (mouseIsPressed) {
    drawFlower(mouseX, mouseY);
  }
}


function drawFlower(x, y, styleType=null) {
  push();
  translate(x, y);
  let strokeCol = random(theme);
  stroke(strokeCol);

  let maxSize = sizeSlider.value();
  let size = random(maxSize * 0.5, maxSize);
  let swFactor = swFactorSlider.value();
  let sw = size * swFactor * 0.2;

  let dc1 = size/100*random(2, 10), dc2 = size/100*random(20, 30),
      dc3 = size/100*random(2, 10), dc4 = size/100*random(20, 30);

  if (!styleType) styleType = random() < 0 ? "A" : "B";

  if (styleType === "A") {
    drawingContext.setLineDash([dc1, dc2, dc3, dc4]);
    strokeCap(ROUND);
    strokeWeight(sw*2);
    noFill();
    circle(0, 0, size/2);

    noStroke();
    fill(random(theme));
    circle(0, 0, size/3);

  } else {
    drawingContext.setLineDash([dc1, dc2, dc3, dc4]);
    strokeCap(ROUND);
    strokeWeight(sw*2);
    noFill();
    circle(0, 0, size/2);

    noStroke();
    fill(random(theme));
    circle(0, 0, size/3);

    stroke(random(theme));
    strokeWeight(sw/3);
    drawingContext.setLineDash([1,  size/100*random(8, 15)]);
    strokeCap(ROUND);
    noFill();
    circle(0, 0, size/3);
  }

  drawingContext.setLineDash([]);
  drawingContext.shadowBlur = 0;
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(bgCol);
}
