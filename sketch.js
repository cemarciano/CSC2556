// data[i] is the x-coordinate of data point *i*
var data = [];
// clusters[i] is the x-coordinate location of cluster *i*
var clusters = [];
// data2cluster[i] is the number of the cluster assigned to data point *i*
var data2cluster = [];

var insertingData, insertingCentroids, islearning, step;

var colors = ["blue", "red", "yellow", "green", "pink", "white"];
var colorc = 0;

var instruction = "Tap on the Screen to Insert Data Points...   Press Enter to Insert Cluster Centroids";

var button;
var sel;
var mu_input;
var mu = "0";
var sigma_input;
var sigma = "1";
var numContents_input;
var numContents = "15";

var manualMode = false;

function setup () {
    insertingData = true;
    insertingCentroids = false;
    islearning = false;
    step = false;
    numContents_input = createInput(numContents);
    numContents_input.input(updateNumContents);
    button = createButton('Generate random points');
    button.mouseClicked(generateData);
    sel = createSelect();
    sel.option('Normal Distribution');
    sel.selected('Normal Distribution');
    mu_input = createInput(mu);
    mu_input.input(updateMu);
    sigma_input = createInput(sigma);
    sigma_input.input(updateSigma);
    //sel.changed(undefined);
    createCanvas(windowWidth, windowHeight);
}

function draw () {



    let offsetX = windowWidth - 130
    let offsetY = windowHeight - 0.3*windowHeight
    let arrowSlope = 40


    if ((mouseX > windowWidth - offsetX) && (mouseX < offsetX) && (mouseY < offsetY + 70) && (mouseY > offsetY - 70)) {
        manualMode = true;
    } else {
        manualMode = false;
    }




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

    // Instructions rectangle:
    rect(windowWidth/2 - 350, 100, 700, 350, 20);
    fill(30);
    textSize(24);
    text("OR", windowWidth/2 - 12, 280);
    textSize(20);
    text("Generate content based\non a distribution:", windowWidth/2 - 320, 140);
    textAlign(CENTER);
    text("Click on the real\nline below to add\ncontent manually\n(or both!)", windowWidth/2 + 175, 225);
    noStroke();
    textSize(17);
    text("Number of contents:", windowWidth/2 - 230, 212);
    numContents_input.size(60);
    numContents_input.position(windowWidth/2 - 320, 225);
    text("Distribution:", windowWidth/2 - 257, 275);
    sel.position(windowWidth/2 - 320, 287);
    text("Parameters:", windowWidth/2 - 265, 335);
    // Mu (mean):
    text("\u03BC:", windowWidth/2 - 307, 360);
    mu_input.size(30);
    mu_input.position(windowWidth/2 - 290, 345);
    // Sigma squared (variance):
    text("\u03C3\u00B2:", windowWidth/2 - 220, 360);
    sigma_input.size(30);
    sigma_input.position(windowWidth/2 - 200, 345);
    // Button to generate:
    button.position(windowWidth/2 - 250, 400);
    // "OR" separation:
    stroke(0);
    strokeWeight(1.5);
    line(windowWidth/2, 117, windowWidth/2, 255);
    line(windowWidth/2, 290, windowWidth/2, 435);
    noStroke();
    textAlign(LEFT);

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
    if (manualMode == true) {
        drawingContext.setLineDash([5, 15]);
        line(mouseX, 0, mouseX, windowHeight);
        drawingContext.setLineDash([]);
        fill(100);
        ellipse(mouseX, offsetY, 15, 15);
    }


    noFill();
    noStroke();
    // Draws data points:
    for (var i = 0; i < data.length; i++) {
        noStroke();
        fill(color(colors[data2cluster[i]]));
        ellipse(data[i], offsetY, 9, 9);
    }
    // Draws centroids:
    for (var i = 0; i < clusters.length; i++) {
        noStroke();
        fill(color(colors[i]));
        ellipse(clusters[i], offsetY, 20, 20);
    }
    noFill();
}

function mouseClicked () {
    if (manualMode == true) {
        // If user is currently inserting data points:
        if (insertingData) {
            data.push(mouseX);
            data2cluster.push(5);
        // If user is currently inserting clusters:
        } else if (insertingCentroids) {
            clusters.push(mouseX);
            colorc++;
        }
    }
}

function keyPressed () {
    if (keyCode === ENTER) {
        if (insertingData == true && insertingCentroids == false) {
            insertingData = false;
            insertingCentroids = true;
            instruction = "Tap on the Screen to Insert Cluster Centroids...   Press Enter to Start Clustering";
        } else if (insertingData == false && insertingCentroids == true) {
            insertingCentroids = false;
            islearning = true;
            instruction = "Press Enter to Assign the Clusters to Data Points...";
        } else if (insertingData == false && insertingCentroids == false && islearning == true) {
            if (step) {
                for (var i = 0; i < clusters.length; i++) {
                    clusters[i] = findClusterPos(i);
                }
                instruction = "Press Enter to Assign the Clusters to Data Points...";
            } else {
                for (var i = 0; i < data.length; i++) {
                    // Finds the closest centroid to data point *i*:
                    data2cluster[i] = closestCentroid(i);
                }
                instruction = "Press Enter to Update the Cluster Centroids...";
            }
            step = !step;
        }
    }
}

// Calculates position of cluster *n*:
function findClusterPos(cluster) {
    var sumX = 0, count = 0;
    var avgX;
    // For each data point:
    for (var i = 0; i < data.length; i++) {
        // If data point *i* is assigned to cluster *n*:
        if (data2cluster[i] == cluster) {
            sumX += data[i];
            count++;
        }
    }
    avgX = Math.trunc(sumX / count);
    return avgX;
}

// Returns the closest centroid to data point *x*:
function closestCentroid (x) {
    var minIndex = 0;
    var minDistance = distanceLine(data[x], clusters[minIndex]);
    for (var i = 1; i < clusters.length; i++) {
        var dis = distanceLine(data[x], clusters[i]);
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

function generateData(){
    console.log("Called")
    gaussian_mean = windowWidth/2 + parseInt(mu)*(windowWidth/20);
    gaussian_stddev = parseInt(sigma)*(windowWidth/20);
    for (i = 0; i < parseInt(numContents); i++) {
        data.push(randomGaussian(gaussian_mean, gaussian_stddev));
        data2cluster.push(5);
    }
}


function updateNumContents(){
    numContents = this.value();
}

function updateMu(){
    mu = this.value();
}

function updateSigma(){
    sigma = this.value();
}
