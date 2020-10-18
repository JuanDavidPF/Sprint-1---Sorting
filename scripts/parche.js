let liderX;
let liderY;
let liderSize;
let followSize;
let leaderNames;
let initials;
function setup() {
  var myCanvas = createCanvas(1200, 700);
  myCanvas.parent("parche");
  background(255, 255, 255);

  liderSize = 120;
  followSize = 75;
  liderY = 175;
  liderX = liderSize / 2 + 50;
}

function Represent() {
  background(255, 255, 255);
  noStroke();
  let parcheSimilitud = [];

  //title
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(250, 100, 60);
  leaderNames = liderDelParche[0].split(" ");
  initials = "";

  for (let i = 0; i < leaderNames.length; i++) {
    initials += leaderNames[i].substring(0, 1);
  }

  text("El parche de " + liderDelParche[0], 0, 0, width, 100);

  //lider
  fill(250, 100, 60);

  ellipse(liderX, liderY, liderSize, liderSize);

  fill(255, 255, 255);
  textSize(45);
  text(initials, liderX, liderY);

  //calculate distances

  for (let i = 0; i < parche.length; i++) {
    parcheSimilitud.push(parche[i][parche[i].length - 1]);
  }
  mayorSimilitud = Math.max.apply(Math, parcheSimilitud);
  menorSimilitud = Math.min.apply(Math, parcheSimilitud);

  //parche

  for (let i = 0; i < parche.length; i++) {
    fill(250, 250, 250);
    stroke(250, 100, 60);
    strokeWeight(5);

    x = map(
      parche[i][parche[i].length - 1],
      mayorSimilitud,
      menorSimilitud,
      liderX + followSize + 50,
      width - followSize - 40
    );
    y = map(
      parche[i][parche[i].length - 1],
      mayorSimilitud,
      menorSimilitud,
      liderY,
      height - followSize - 40
    );

    ellipse(x, y, followSize, followSize);

    noStroke();
    fill(250, 100, 60);
    textSize(25);
    text(parche[i][parche[i].length - 1].toFixed(2), x, y);
    textSize(16);
    text(parche[i][0], x, y + followSize / 2 + 20);
  }
}
