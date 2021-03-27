var data = [];
var mean = [];

var c = [];

var isdata, ismean, islearning, step;

var colors = ["blue", "red", "yellow", "green", "pink", "white"];
var colorc = 0;

var instruction = "Tap on the Screen to Insert Data Points...   Press Enter to Insert Cluster Centroids";

var button;

function setup () {
  isdata = true;
  ismean = false;
  islearning = false;
  step = false;
  button = createButton('Generate random points');

  createCanvas(windowWidth, windowHeight);

}

function draw () {


  let offsetX = windowWidth - 130
  let offsetY = windowHeight - 0.3*windowHeight
  let arrowSlope = 40


  button.position(windowWidth/2 - 100, offsetY*0.5);


  background(51);

  fill(250);
  textFont('monospace');
  textSize(25);
  text("Strategic Content Production", 15, 40);
  textSize(20);
  text(instruction, 15, windowHeight - 30);
  fill(100);
  textSize(15);
  text("Note : Use Maximum 5 Clusters", 15, windowHeight - 7);
  text("Authors : Carlos Marciano", windowWidth - 270, 40);
  text("Fengwei Sun", windowWidth - 187, 60);
  text("Vedic Sharma", windowWidth - 187, 80);
  fill(200);
  textSize(35);
  text("\u211D", offsetX - 20, offsetY + 80);

  // Real line:
  stroke(255);
  strokeWeight(2);
  line(windowWidth - offsetX, offsetY, offsetX, offsetY);
  // Arrows:
  strokeWeight(3);
  line(windowWidth - offsetX, offsetY, windowWidth - offsetX + arrowSlope, offsetY + 0.7*arrowSlope);
  line(windowWidth - offsetX, offsetY, windowWidth - offsetX + arrowSlope, offsetY - 0.7*arrowSlope);
  line(offsetX, offsetY, offsetX - arrowSlope, offsetY - 0.7*arrowSlope);
  line(offsetX, offsetY, offsetX - arrowSlope, offsetY + 0.7*arrowSlope);

  // Dashed line:
  if ((mouseX > windowWidth - offsetX) && (mouseX < offsetX)) {
      drawingContext.setLineDash([5, 15]);
      line(mouseX, 0, mouseX, windowHeight);
      drawingContext.setLineDash([]);
      fill(100);
      ellipse(mouseX, offsetY, 15, 15);
  }


  noFill();
  noStroke();
  for (var i = 0; i < data.length; i++) {
    noStroke();
    fill(color(colors[c[i]]));
    ellipse(data[i], offsetY, 10, 10);
  }
  for (var i = 0; i < mean.length; i++) {
    noStroke();
    fill(color(colors[i]));
    ellipse(mean[i], offsetY, 20, 20);
  }
  noFill();
}

function mouseClicked () {
  if (isdata) {
    data.push(mouseX);
    c.push(5);
  } else if (ismean) {
    mean.push(mouseX);
    colorc++;
  }
}

function keyPressed () {
  if (keyCode === ENTER) {
    if (isdata == true && ismean == false) {
      isdata = false;
      ismean = true;
      instruction = "Tap on the Screen to Insert Cluster Centroids...   Press Enter to Start Clustering";
    } else if (isdata == false && ismean == true) {
      ismean = false;
      islearning = true;
      instruction = "Press Enter to Assign the Clusters to Data Points...";
    } else if (isdata == false && ismean == false && islearning == true) {
      if (step) {
        for (var i = 0; i < mean.length; i++) {
          mean[i] = average(i);
        }
        instruction = "Press Enter to Assign the Clusters to Data Points...";
      } else {
        for (var i = 0; i < data.length; i++) {
          c[i] = closestCentroid(i);
        }
        instruction = "Press Enter to Update the Cluster Centroids...";
      }
      step = !step;
    }
  }
}

function average (n) {

  var sumX = 0, count = 0;
  var avgX;

  for (var i = 0; i < data.length; i++) {
    if (c[i] == n) {
      sumX += data[i];
      count++;
    }
  }

  avgX = Math.trunc(sumX / count);

  return avgX;
}

function closestCentroid (n) {

  var minIndex = 0;
  //var minDistance = distanceSquare(data[n][0], data[n][1], mean[minIndex][0], mean[minIndex][1]);
  var minDistance = distanceLine(data[n], mean[minIndex]);

  for (var i = 1; i < mean.length; i++) {
    //var dis = distanceSquare(data[n][0], data[n][1], mean[i][0], mean[i][1]);
    var dis = distanceLine(data[n], mean[n]);

    if (dis < minDistance) {
      minDistance = dis;
      minIndex = i;
    }
  }

  return minIndex;
}

function distanceLine (x1, x2) {
    return Math.abs(x1 - x2);
}

function distanceSquare (x1, y1, x2, y2) {
  return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}
