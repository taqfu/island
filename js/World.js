function Game(sizeOfX, sizeOfY){
    var waterPercent=.05;
    this.directions = [0, "n", "ne", "e", "se", "s", "sw", "w", "nw"];
    this.numOfIslandSquares=0;
    this.distanceFromShore = 10;

    this.maxNumOfIslandSquares = 8000; //randomNumber(1000, 43200);
    this.sizeOfX = sizeOfX;
    this.sizeOfY = sizeOfY;
    this.map = new Array(new Array());
    this.maxWaitTime = 1000;
    this.startFrom = {x:this.sizeOfX/2, y: this.sizeOfY/2};
    this.distance=1;

    this.connectWater = connectWater;
    this.direction = checkDirection;
    this.fillEast = fillEast;
    this.fillHoles = fillHoles;
    this.fillSeed = fillSeed;
    this.fillSouth = fillSouth;
    this.increase = increaseDistance;
    this.landNeighbor = landTile;
    this.seedWater = seedWater;
    this.next = nextLand;
    this.seed = generateIslandSeed;
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
    $("#gameScreen").html("GENERATING ISLAND");
    this.seed();
    //this.fillSeed();
    console.log(this.numOfIslandSquares);

    this.fillHoles();
    console.log(this.numOfIslandSquares);

    this.maxNumOfWaterSquares = this.numOfIslandSquares*(waterPercent/100);
    console.log(this.maxNumOfWaterSquares);
    var waterSeeds = this.seedWater();
    this.connectWater(waterSeeds);
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

function closestWaterSeed(location, waterSeeds){
    var closest;
    var closestDistance;
    for(var seedNum=0;seedNum<waterSeeds.length;seedNum++){
        var distance = distanceBetweenTwoPoints(location, waterSeeds[seedNum]);
        if (location!==waterSeeds[seedNum]){
            if ((!closest && !closestDistance) || closestDistance>distance){
                closest=seedNum;
                closestDistance = distance;
            }

        }
    }
    console.log(closest, closestDistance);
}
function connectWater(waterSeeds){
    for(var seedNum=0;seedNum<waterSeeds.length;seedNum++){
        //console.log("CONNECTING WATER", seedNum);
        seedsByDistance = sortSeedsByDistance(waterSeeds[seedNum], waterSeeds);
        //console.log(seedNum, seedsByDistance)
    }
}

function distanceBetweenTwoPoints(a, b){
    return Math.floor(Math.sqrt(Math.pow((a["x"]-b["x"]), 2)+Math.pow((a["y"]-b["y"]),2)));
}
function sortSeedsByDistance(location, waterSeeds){
    var seedDistances = new Array();
    var sortedSeedDistances = new Array();
    for(var seedNum=0;seedNum<waterSeeds.length;seedNum++){
        if (location!==waterSeeds[seedNum]){
            seedDistances.push(distanceBetweenTwoPoints(location, waterSeeds[seedNum]));
        } else if (location===waterSeeds[seedNum]){
            seedDistances.push("SELF");
        }
        sortedSeedDistances.push(null);
    }
    var maxDistance = 0;
    var lastDistance = 0;
    for (var numOfWaterSeeds=0;numOfWaterSeeds<sortedSeedDistances.length-1;numOfWaterSeeds++){
        var minDistance = 1000*1000;


        for(var seedNum=0;seedNum<seedDistances.length;seedNum++){
            if ((seedDistances[seedNum]>=lastDistance && seedDistances[seedNum]<minDistance) && sortedSeedDistances.indexOf(seedNum)===-1){
                minDistance = seedDistances[seedNum];
                currentNumber = seedNum;

            }
            if (seedDistances[seedNum]>maxDistance){
                maxDistance = seedDistances[seedNum];
            }
        }
        sortedSeedDistances[numOfWaterSeeds]=currentNumber;
        lastDistance=minDistance;
    }
    return sortedSeedDistances;
}
function fillEast(fromX, toX, y){
    for(var x=fromX;x<toX;x++){
        if (this.map[x][y]===0){
            this.numOfIslandSquares++;
            this.map[x][y]=1;
        }
    }
}
function fillHoles(){
  for(var y=0;y<this.sizeOfY;y++){
      for(var x=0;x<this.sizeOfX;x++){
          var num_of_sides=0;
          if (this.map[x][y]===0){
              if (this.next({x:x, y:y}, "n")!=false){
                  num_of_sides++;
              }
              if (this.next({x:x, y:y}, "e")!=false){
                  num_of_sides++;
              }
              if (this.next({x:x, y:y}, "s")!=false){
                  num_of_sides++;
              }
              if (this.next({x:x, y:y}, "w")!=false){
                  num_of_sides++;
              }
              if (num_of_sides===4){
                  this.map[x][y]=1;
                  this.numOfIslandSquares++;
              }
              //console.log(x, y, num_of_sides);

          }
      }
  }

}

function fillSeed(){
    var maxFillSpace = 15;
    for(var y=0;y<this.sizeOfY;y++){
        for(var x=0;x<this.sizeOfX;x++){


            if (this.map[x][y]>0 && this.map[x+1][y]===0  ){
                var eastLand = this.next({x:x, y:y}, "e");
                if (eastLand!=false && eastLand["x"]-x<maxFillSpace){
                    this.fillEast(x, eastLand["x"], y);
                }
            }
            if (this.map[x][y]>0 && this.map[x][y+1]===0  ){
                var southLand = this.next({x:x, y:y}, "s");
                if (southLand!=false && southLand["y"]-y<maxFillSpace){

                    this.fillSouth(x, y, southLand["y"]);
                }
            }

        }
    }
}

function fillSouth(x, fromY, toY){
  for(var y=fromY;y<toY;y++){
      if (this.map[x][y]===0){
          this.numOfIslandSquares++;
          this.map[x][y]=1;
      }
  }

}

function generateIslandSeed(){
    var d = new Date();
    var startTime = d.getTime();
    this.map[this.startFrom["x"]][this.startFrom["y"]]=1;
    var maximumDistance=0;
    var newPositionFound=false;
    var num=0;
    var position = this.startFrom;
    $("#gameScreen").html("GENERATING WORLD");

    while (this.numOfIslandSquares<this.maxNumOfIslandSquares){
        d = new Date();
        currentTime = d.getTime();
        var searchingForNeighbors=true;
        while (searchingForNeighbors){
            openNeighbors = this.open(position, this.distance);
            if (openNeighbors.length===0){
                this.distance++;
                maximumDistance = this.distance;

            } else if (openNeighbors.length>0){
                searchingForNeighbors=false;
                this.distance=1;
            }
        }

        randomNeighbor = randomNumber(1, openNeighbors.length)-1;
        nextPosition = openNeighbors[randomNeighbor];



        if (currentTime - startTime > this.maxWaitTime && num<11){
            num++;
            startTime = currentTime;
            maximumDistance++;
            this.distance = maximumDistance;
        } else if (currentTime - startTime > this.maxWaitTime && num>10){
            this.numOfIslandSquares=this.maxNumOfIslandSquares;
        }
        if(newPositionFound){
            this.distance=1;
            newPositionFound=false;
        }

        positionStatus = this.status(nextPosition, this.distance);

        if (positionStatus[0]===0){
            position = this.startFrom;
            this.increase();
            if (this.distance<maximumDistance){
              this.distance=maximumDistance;
            } else {
                maximumDistance = this.distance;
            }
            newPositionFound=true;
        } else if (positionStatus[0]>0){
            this.map[nextPosition["x"]][nextPosition["y"]]=1;
            position = nextPosition;
            this.numOfIslandSquares++;
        }
    }
}
function increaseDistance(){
  var increasingDistance = true;
  while (increasingDistance){
    this.distance++;
    seedStatus = this.status(this.startFrom, this.distance);
    if (seedStatus[0]>0){
        increasingDistance=false;
    }
  }
}
function landTile(location, distance){
    var islandsLocations = new Array();
    for(directionNum=1; directionNum<this.directions.length;directionNum++){
        locationToBeChecked = this.direction(location, this.directions[directionNum], distance);

        if (locationToBeChecked!==false && this.map[locationToBeChecked["x"]][locationToBeChecked["y"]]===1){
          islandsLocations.push(locationToBeChecked);
        }
    }
    return islandsLocations;
}

function seedWater(){
    var waterSeeds = new Array();
    var clearToSeed=false;
    var numOfWaterSquares = 0;
    while (numOfWaterSquares<this.maxNumOfWaterSquares){
        var randX = randomNumber(1,this.sizeOfX)-1;
        var randY = randomNumber(1,this.sizeOfY)-1;


        if (this.map[randX][randY]===1){
            for (distance=1; distance<=this.distanceFromShore;distance++){
                var status = this.status({x:randX, y:randY}, distance);
                if (status[0]===0){
                    clearToSeed=true;
                } else if (status[0]>0){
                    distance=this.distanceFromShore;
                    clearToSeed=false;
                }
            }
            if (clearToSeed){
                this.map[randX][randY]=2;
                waterSeeds.push({x:randX, y:randY});
                numOfWaterSquares++;
            }
        }
    }
    return waterSeeds;
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
function nextLand(position, direction){
    if (direction==="n"){
        for (var y=position["y"]-1;y>0;y--){
            if (this.map[position["x"]][y]===1){
                return {x:position["x"], y:y};
            }
        }
    }
    if (direction==="e"){
        for (var x=position["x"]+1;x<this.sizeOfX;x++){
            if (this.map[x][position["y"]]===1){
                return {x:x, y:position["y"]};
            }
        }
    }
    if (direction==="s"){
      for (var y=position["y"]+1;y<this.sizeOfY;y++){
          if (this.map[position["x"]][y]===1 ){
              return {x:position["x"], y:y};
          }
      }
  }
  if (direction==="w"){
      for (var x=position["x"]-1;x>0;x--){
          if (this.map[x][position["y"]]===1 ){
              return {x:x, y:position["y"]};
          }
      }
  }
    return false;
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

      if (x===this.startFrom["x"] || y===this.startFrom["y"]){
          screen = screen + " axis";
      }

      else if (this.map[x][y]==0){
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
