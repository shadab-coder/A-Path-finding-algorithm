document.body.style.padding='0px';
document.body.style.margin='0px';
var c=document.querySelector('#canvas');
var h=c.getContext('2d');
var grid=[];
c.width=400;
c.height=400;
var width=20;
var row=c.width/width;
var col=c.height/width;
var openSet=[];
var closeSet=[];
var temp;
for(var j=0;j<row;j++){
	for(var k=0;k<col;k++){
	 grid.push(new Cell(j,k,width));
	}
}

var start;
var end;
grid.forEach(function(cell){cell.draw()});


c.addEventListener('mousedown',check);
c.addEventListener('mousemove',blockGrid);
c.addEventListener('mouseup',clearBlock);


var blockgrid=false;


function clearBlock(){
if(blockgrid==true){
	blockgrid=false;
	}
}

function blockGrid(e){
var temp=Math.floor(e.clientX/width) + row*Math.floor(e.clientY/width);
if(blockgrid==true  && start!==grid[temp] && end!=grid[temp]){
	grid[temp].block=true;
	grid[temp].update("black");
	}
}


function Cell(i,j,w){
this.i=i;
this.j=j;
this.w=w;
this.x=w*j;
this.y=w*i;
this.block=false;
this.visited=false;
this.neighbour=[];
this.g=0;
this.h=Infinity;
this.f=Infinity;
this.previous=null;
this.checkNeighbour=function(){
if(this.i<row-1 && grid[row*(this.i+1)+this.j] && !grid[row*(this.i+1)+this.j].visited && !grid[row*(this.i+1)+this.j].block){
this.neighbour.push(grid[row*(this.i+1)+(this.j)]);
}

if(this.j<col-1 && grid[row*(this.i)+this.j+1] && !grid[row*(this.i)+this.j+1].visited && !grid[row*(this.i)+this.j+1].block ){
this.neighbour.push(grid[row*(this.i)+(this.j+1)]);
}

if(this.i>1 && grid[row*(this.i-1)+this.j] && !grid[row*(this.i-1)+this.j].visited && !grid[row*(this.i-1)+this.j].block){
this.neighbour.push(grid[row*(this.i-1)+(this.j)]);
}

if(this.j>1 && grid[row*(this.i)+this.j-1] && !grid[row*(this.i)+this.j-1].visited && !grid[row*(this.i)+this.j-1].block){
this.neighbour.push(grid[row*(this.i)+(this.j-1)]);
}

if(this.j<col-1 && this.i<row-1 && !grid[row*(this.i+1)+this.j+1].visited&& !grid[row*(this.i+1)+this.j+1].block){
this.neighbour.push(grid[row*(this.i+1)+(this.j+1)]);
}

if(this.j>=1 && this.i>=1 && !grid[row*(this.i-1)+this.j-1].visited && !grid[row*(this.i-1)+this.j-1].block){
this.neighbour.push(grid[row*(this.i-1)+(this.j-1)]);
}

if(this.j<col-1 && this.i>=1 && !grid[row*(this.i-1)+this.j+1].visited && !grid[row*(this.i-1)+this.j+1].block){
this.neighbour.push(grid[row*(this.i-1)+(this.j+1)]);
}

if(this.j>=1 && this.i<row-1 && !grid[row*(this.i+1)+this.j-1].visited&& !grid[row*(this.i+1)+this.j-1].block){
this.neighbour.push(grid[row*(this.i+1)+(this.j-1)]);
}
return this.neighbour;
};
this.draw= function(){
h.strokeRect(this.x,this.y,this.w,this.w);

};
this.update=function(color){
h.fillStyle=color;
h.fillRect(this.x,this.y,this.w,this.w);
};


}

var current;



function animate(){
if(openSet.length>0 && !end.visited){
var min=openSet[0].h;
var minIndex=0;
for(var k=0; k<openSet.length;k++){
if(openSet[k].h<min){
minIndex=k;
min=openSet[k].h;
}
}
current=openSet.splice(minIndex,1);
current[0].update('blue');
current[0].visited=true;
temp=current[0].checkNeighbour();
console.log(temp);
for(var k=0;k<temp.length;k++){
	if(!openSet.includes(temp[k])){
		temp[k].previous=current[0];
		temp[k].g=current[0].g+10;
		temp[k].h=hueristic(temp[k]);
		temp[k].f=temp[k].g+temp[k].h;
		openSet.push(temp[k]);
		}else if(temp[k].f<openSet[openSet.indexOf(temp[k])].f){
			remove(openSet,temp[k])
			openSet.push(temp[k]);
			}
	}
}else{
console.log("stop")
temp=end;
while(temp){
closeSet.push(temp);
temp=temp.previous;
}
closeSet.forEach(function(cell){cell.update('green');});
clearInterval(clear);
}

openSet.forEach(function(cell){cell.update('gray');});
start.update("red");
end.update('orange');
}
var clear;
var started;

function startPath(){
if(!started){
started=true;
openSet.push(start);
clear=setInterval(animate,500);
addEventListener('keydown',stop);
}
}

function stop(e){
console.log('stop');
if(e.key=='s'){
clearInterval(clear);
}
}


function hueristic(cell){
var hyp=14;
var i=end.i;
var j=end.j;

var hypdis=Math.min(Math.abs(cell.i-i),Math.abs(cell.j-j));
return hypdis*14+(Math.max(Math.abs(cell.i-i),Math.abs(cell.j-j))-hypdis)*10;

}


function remove(arr,cell){
for(var k=arr.length-1;k>=0;k--){
if(arr[k]==cell){
 return arr.splice(k,1);
}
}
}

var selectSource=false;
var selectDestination=false;

function locateSource(){
selectSource=true;
document.querySelector("#locateSource").disabled=true;
}

function locateDestination(){
selectDestination=true;
document.querySelector("#locateDestination").disabled=true;
}

var blockPath=false;
function closePath(){
blockPath=true;
document.querySelector("#blockPath").disabled=true;
}


function check(e){
var temp=Math.floor(e.clientX/width) + row*Math.floor(e.clientY/width);
if(selectSource==true){
selectSource=false;
start=grid[temp];
start.update('red');
}else if(selectDestination==true && start!=grid[temp]){
selectDestination=false;
end=grid[temp];
end.update('orange');
console.log(end);
}
if(start!=grid[temp] && end!=grid[temp] && blockPath==true){
blockgrid=true;
grid[temp].block=true;
grid[temp].update("black");
}
}
