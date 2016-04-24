function Game(sizeOfX, sizeOfY){
    this.directions = [0, "n", "ne", "e", "se", "s", "sw", "w", "nw"];
    this.sizeOfX = sizeOfX;
    this.sizeOfY = sizeOfY;
    this.map = new Array(new Array());

    this.direction = checkDirection;
    this.fartherRange = increaseDistance;
    this.open = openLocations;
    this.random = randomLocation;
    this.show = showWorld;
    this.status = locationStatus;

    for (x=0;x<this.sizeOfX;x++){
      this.map.push([]);
      for (y=0;y<this.sizeOfY;y++){
        this.map[x].push(0);
      }
    }
    var numOfIslandSquares=0;
    //var randNum =
    var maxNumOfIslandSquares = 1000; //randomNumber(1800, 86400);
    var seed = {x:this.sizeOfX/2, y:this.sizeOfY/2};
    this.map[seed["x"]][seed["y"]]=1;
    var seedDistance=1;
    var seedStatus;
    var position = seed;
    var randomSearch=0;
    $("#gameScreen").html("GENERATING WORLD");

    while (numOfIslandSquares<maxNumOfIslandSquares){
        console.log ("START", numOfIslandSquares, maxNumOfIslandSquares);
        openNeighbors = this.open(position, seedDistance);
        console.log("Open neighbors found: ", openNeighbors.length, position, seedDistance);

        randomNeighbor = randomNumber(1, openNeighbors.length)-1;
        console.log("Random neighbor chosen: ", randomNeighbor);

        nextPosition = openNeighbors[randomNeighbor];
        //console.log("seed", seed, seedDistance);
        seedStatus = this.status(seed, seedDistance);
        console.log("position - map ", this.map[nextPosition["x"]][nextPosition["y"]], "POS", nextPosition, "/", openNeighbors, randomNeighbor);
        positionStatus = this.status(nextPosition, seedDistance);
        console.log("status", positionStatus[0], seedStatus[0]);

        if (positionStatus[0]>0 && nextPosition && this.map[nextPosition["x"]][nextPosition["y"]]===0){
            console.log("if 1");
            this.map[nextPosition["x"]][nextPosition["y"]]=1;
            position = nextPosition;
            numOfIslandSquares++;
        } else if (positionStatus[0]===0 && seedStatus[0]===0){
            this.fartherRange();
            console.log("if 2 - new seedDistance:", seedDistance);
        } else if ((positionStatus[0]===0 && seedStatus[0]===1)  && this.map[nextPosition["x"]][nextPosition["y"]]===0){
            this.map[nextPosition["x"]][nextPosition["y"]]=1;
            this.fartherRange();
            console.log("if 3 - new seedDistance:", seedDistance);
        } else {
            console.log("else");
            position = seed;
        }
        console.log ("END", numOfIslandSquares, maxNumOfIslandSquares);
        console.log();
    }
    console.log(numOfIslandSquares, maxNumOfIslandSquares);
    $("#gameScreen").html(this.show());
}

function checkDirection(location, direction, units){
	leftOrRight=false;
	upOrDown=false;
	if (direction===0){
		return {x:x, y:y};
	} else if(direction.indexOf("w")>-1){
		if (location["x"]-units<0){
			return false;
		}
		leftOrRight = location["x"]-units;
	} else if(direction.indexOf("e")>-1){
		leftOrRight = location["x"]+units;
	}

	if(direction.indexOf("s")>-1){
		if (location["y"]+units>=this.sizeOfY){
			return false;
		}
		upOrDown = location["y"]+units;
	}  else if(direction.indexOf("n")>-1){
		if (location["y"]-units<0){
			return false;
		}
		upOrDown = location["y"]-units;
	}

	if (!leftOrRight && upOrDown){
		x=location["x"];
		y=upOrDown;
	} else if (!upOrDown && leftOrRight){
		x=leftOrRight;
		y=location["y"];
	} else if (leftOrRight && upOrDown){

		x=leftOrRight;
		y=upOrDown;
	}
	return {x:x, y:y};
}

function increaseDistance(){
  var increasingDistance = true;
  while (increasingDistance){
    this.seedDistance++;
    seedStatus = this.status(this.seed, this.seedDistance);
    if (seedStatus[0]>0){
        increasingDistance=false;
    }
  }
}

function locationStatus(location, distance){
    var status = new Array();
    var locationToBeChecked;

    for (i=0;i<10;i++){
        status.push(0);
    }

    for(directionNum=1; directionNum<this.directions.length;directionNum++){
        locationToBeChecked = this.direction(location, this.directions[directionNum],distance);
        if (locationToBeChecked!==false){
          status[this.map[locationToBeChecked["x"]][locationToBeChecked["y"]]]++;
        }
    }
    return status;
}
function randomLocation (){
    var randX = randomNumber(1, this.sizeOfX)-1;
    var randY = randomNumber(1, this.sizeOfY)-1;
    return {x:randX, y:randY};
}

function openLocations(location, distance){
    var openLocations = new Array();
    for(directionNum=1; directionNum<this.directions.length;directionNum++){
        locationToBeChecked = this.direction(location, this.directions[directionNum], distance);

        if (locationToBeChecked!==false && this.map[locationToBeChecked["x"]][locationToBeChecked["y"]]===0){
          openLocations.push(locationToBeChecked);
        }
    }
    return openLocations;
}
function showWorld(){
  var screen = "";
	for (y=0;y<this.sizeOfY;y++){
		screen =  screen + "<div class='row'>";
		for (x=0;x<this.sizeOfX;x++){
			screen = screen + "<div class='cell"
			if (this.map[x][y]==0){
				screen = screen + " neutral"
			} else if (this.map[x][y]==1){
				screen = screen + " red"
			} else if (this.map[x][y]==2){
				screen = screen + " blue"
			} else if (this.map[x][y]==3){
				screen = screen + " green"
			} else if (this.map[x][y]==4){
				screen = screen + " yellow"
			} else if (this.map[x][y]==5){
				screen = screen + " grey"
			} else if (this.map[x][y]==6){
				screen = screen + " orange"
			}
			screen = screen + "'></div>";
		}
		screen = screen + "</div>";
	}
	return screen;
}
