var _coord = [];
var _dim = 3;
var _thresh = 0.1;
var _t = 0;
var _n = 1000;
var _box = [1.0,1.0,0];
var _counter = 0;
var _steps = 0;
var _normal = [0,0,1];
var _xaxis = [1,0,0];
var _yaxis = [0,1,0];
var _rot = 0;
var _start = false;
var _delay = 0;
var _xcenter = 0;
var _ycenter = 0;
var _scale = 10;
var _overlay = false;
var _radius = 100;
var _thickness;
var _gravity;
var _base = 10;
var _emscale = 1/200;
var _lineratio = 0.1;
var _v = Math.sqrt(2*_box[0]*_n/2);
var _accscale = 0.1
var _soft = 0.001;
var _depth = 2;
var _depth2 = 0
var _mint = Number.MAX_VALUE;
var _merge = _soft;
var _vmax = 10;
var _vf = _vmax*Math.sqrt(2/_soft);

function create_enter_listener(id,func){
	// find the html element with id="..." 
	// this allows us to look at or change properties of this element.
	temp = document.getElementById(id);
	// we add "something" (a "listener") which reacts when the Enter key is pressed
	// When Enter is pressed, the function func will be executed.
	temp.addEventListener('keydown', function onEvent(e) {
		if (e.key === "Enter") {
			func();
		}
	});
}

// This function is such the mobile website also can have similar functionality to the code above
function create_focus_listener(id,func){
	temp = document.getElementById(id);
	document.getElementById(id).addEventListener("focusout",func);
}

// Similar to the above, except that we can more easier specify that an html button was clicked
// Interesting this would also work for any html element with click functionality
function create_button_listener(id,func){
	document.getElementById(id).addEventListener("click",func);
}

// Once again, this time reacting to the change attributed (this is import for loading files)
function create_file_listener(id,func){
	document.getElementById(id).addEventListener("change",func);
	//document.getElementById(id).onchange = func;
}

function initiate(){
	var temp;
	empty_coord(_n);
	generate_random();
	temp = document.getElementById("delay"); 
	temp.value = _delay;
	temp = document.getElementById("xcenter"); 
	temp.value = _xcenter;
	temp = document.getElementById("ycenter"); 
	temp.value = _ycenter;
	temp = document.getElementById("scale"); 
	temp.value = _scale;
	temp = document.getElementById("threshold"); 
	temp.value = _thresh;
	temp = document.getElementById("timescale"); 
	temp.value = _accscale;
	temp = document.getElementById("radius"); 
	temp.value = _radius;
	temp = document.getElementById("soft"); 
	temp.value = _soft;
	temp = document.getElementById("vmax"); 
	temp.value = _vmax;
	temp = document.getElementById("merge"); 
	temp.value = _merge;
	temp = document.getElementById("rx"); 
	temp.value = _box[0];
	temp = document.getElementById("ry"); 
	temp.value = _box[1];
	temp = document.getElementById("rz"); 
	temp.value = _box[2];
	temp = document.getElementById("vx"); 
	temp.value = _normal[0];
	temp = document.getElementById("vy"); 
	temp.value = _normal[1];
	temp = document.getElementById("vz"); 
	temp.value = _normal[2];
	temp = document.getElementById("vr"); 
	temp.value = _rot;
	temp = document.getElementById("n"); 
	temp.value = _n;
	temp = document.getElementById("v"); 
	temp.value = _v;
	temp = document.getElementById("thickness"); 
	temp.value = _lineratio;
	temp = document.getElementById("depth"); 
	temp.value = _depth;
	temp = document.getElementById("depth2"); 
	temp.value = _depth2;
	draw_stars();
	/*
	In the following lines all listeners which will be needed later are setup
	*/

	// We want the expanse of the board to change when the browser is resized. (However, grid elements stay the same size)
	window.addEventListener('resize', draw_scene);
	// setup all button push events
	create_button_listener("start",press_start);
	create_button_listener("stop",press_stop);
	create_button_listener("step",press_step);
	create_button_listener("save",press_save);
	create_button_listener("random",press_random);
	create_button_listener("tree",press_tree);
	// do "stuff" when a file is selected to initiate a premade GoL cell population
	create_file_listener("load",press_load);
	// Update the variables from the input fields when the Enter button is pressed inside the field.
	create_enter_listener("scale",set_scale);
	create_enter_listener("xcenter",set_xcenter);
	create_enter_listener("ycenter",set_ycenter);
	create_enter_listener("radius",set_radius);
	create_enter_listener("thickness",set_thickness);
	create_enter_listener("depth",set_depth);
	create_enter_listener("depth2",set_depth2);
	create_enter_listener("vx",set_vx);
	create_enter_listener("vy",set_vy);
	create_enter_listener("vz",set_vz);
	create_enter_listener("vr",set_vr);
	create_enter_listener("delay",set_delay);
	create_enter_listener("threshold",set_threshold);
	create_enter_listener("timescale",set_timescale);
	create_enter_listener("soft",set_soft);
	create_enter_listener("vmax",set_vmax);
	create_enter_listener("merge",set_merge);
	// Or update when the field goes out of focus
	create_focus_listener("scale",set_scale);
	create_focus_listener("xcenter",set_xcenter);
	create_focus_listener("ycenter",set_ycenter);
	create_focus_listener("radius",set_radius);
	create_focus_listener("thickness",set_thickness);
	create_focus_listener("depth",set_depth);
	create_focus_listener("depth",set_depth2);
	create_focus_listener("vx",set_vx);
	create_focus_listener("vy",set_vy);
	create_focus_listener("vz",set_vz);
	create_focus_listener("vr",set_vr);
	create_focus_listener("rx",set_rx);
	create_focus_listener("ry",set_ry);
	create_focus_listener("rz",set_rz);
	create_focus_listener("n",set_n);
	create_focus_listener("v",set_v);
	create_focus_listener("delay",set_delay);
	create_focus_listener("threshold",set_threshold);
	create_focus_listener("timescale",set_timescale);
	create_focus_listener("soft",set_soft);
	create_focus_listener("vmax",set_vmax);
	create_focus_listener("merge",set_merge);
}

function press_step(){
	iterate();
}

function press_start(){
	// check for the most recent delay value
	var temp = document.getElementById("delay"); 
	_delay = temp.value;
	_start = true;
	clearInterval(_gravity);
	_gravity = setInterval(iterate,_delay*1000);
}

function press_stop(){
	_start = false;
	clearInterval(_gravity);
}

function press_random(){
	press_stop();
	empty_coord(_n);
	generate_random();
	draw_scene();
}

function press_tree(){
	if(!_overlay){
		_overlay = true;
	}
	else{
		_overlay = false;
	}
	draw_scene();
}

function press_load() {
	// get the file input field from the html document
	var load = document.getElementById("load");
	/* 
	This script is called when a file is selected. We need this if condition to check if a file was actually selected. 
	Otherwise pressing cancel could result in crash. Javascript crashes are not fun.
 	*/
	if (load.files && load.files[0]) {
		// file reader stuff... There was to base off an outside snippet
		// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload for reference of what going on here.
		let reader = new FileReader();
		reader.readAsBinaryString(load.files[0]);
		reader.onload = function (e) {
			// text content of the file
			var data = e.target.result;
			// store the data into a cell collection
			press_stop();
			_coord = parseData(data);
			// sort for futher use
			// and draw
			draw_scene();
		}
	}
}

// parse are text file containing cell coordinates
function parseData(data){
	// target for cell storage
	let csvData = [];
	// line break split to array of the input data string
	let lbreak = data.split("\n");
	/*
	mmhm arrow notations in javascript
	For each line in the file, separate numbers based on the comma
	and store the values as integers into a list.
	*/
	lbreak.forEach(res => {
		csvData.push(res.split(","));
		var l = csvData.length-1;
		for(var i=0;i<2*_dim+2;i++){
			csvData[l][i] = parseFloat(csvData[l][i]);
		}
	});
	// voila, the extracted board
	return csvData;
}

function press_save() {
	press_stop();
	//start with an emptry csv file string
	var csv = ''; 
	//store the coordinates for each cell.
	// Why do we dislike normal for loops so?
	_coord.forEach(function(row) {  
		csv += row.join(',');  
		csv += "\n";  
	});
	// Remove the last line break, as this will create a broken entry when reading from the csv file.
	csv = csv.slice(0,csv.length-1);
	// the string "a" specifies what type of html element will be created (element of tag <a> (hyperlink) in this case).
	// The element needs to be a hyperlink for the download to work.
	var hiddenElement = document.createElement('a'); 
	// store the data into this hidden element
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
	hiddenElement.target = '_blank';  
	
	//provide the name for the CSV file to be downloaded  
	hiddenElement.download = 'Gravity.csv'; 
	// click to download :)
	hiddenElement.click();  
}  

function set_scale(){
	var temp = document.getElementById("scale"); 
	_scale = temp.value;
	draw_scene();
}

function set_xcenter(){
	var temp = document.getElementById("xcenter"); 
	_xcenter = temp.value;
	draw_scene();
}

function set_ycenter(){
	var temp = document.getElementById("ycenter"); 
	_ycenter = temp.value;
	draw_scene();
}

function set_radius(){
	var temp = document.getElementById("radius"); 
	_radius = temp.value;
	draw_scene();
}

function set_thickness(){
	var temp = document.getElementById("thickness"); 
	_lineratio = temp.value;
	draw_scene();
}

function set_depth(){
	var temp = document.getElementById("depth"); 
	_depth = temp.value;
	draw_scene();
}

function set_depth2(){
	var temp = document.getElementById("depth2"); 
	_depth2 = temp.value;
	draw_scene();
}

function set_vx(){
	var temp = document.getElementById("vx"); 
	_normal[0] = temp.value;
	draw_scene();
}

function set_vy(){
	var temp = document.getElementById("vy"); 
	_normal[1] = temp.value;
	draw_scene();
}

function set_vz(){
	var temp = document.getElementById("vz"); 
	_normal[2] = temp.value;
	draw_scene();
}

function set_vr(){
	var temp = document.getElementById("vr"); 
	_rot = temp.value/180*Math.PI;
	draw_scene();
}

function set_n(){
	var temp = document.getElementById("n"); 
	_n = parseInt(temp.value);
}

function set_v(){
	var temp = document.getElementById("v"); 
	_v = parseFloat(temp.value);
}

function set_rx(){
	var temp = document.getElementById("rx"); 
	_box[0] = parseFloat(temp.value);
}

function set_ry(){
	var temp = document.getElementById("ry"); 
	_box[1] = parseFloat(temp.value);
}

function set_rz(){
	var temp = document.getElementById("rz"); 
	_box[2] = parseFloat(temp.value);
}

// We want to change the speed of the current simulation in the case it is already running.
function set_delay(){
	var delay = document.getElementById("delay"); 
	_delay = delay.value;
	if (_start){
		clearInterval(_gravity);
		_gravity = setInterval(iterate,_delay*1000);
	}
}

function set_threshold(){
	press_stop();
	var temp = document.getElementById("threshold");
	_thresh = parseFloat(temp.value);
}

function set_timescale(){
	press_stop();
	var temp = document.getElementById("timescale");
	_accscale = parseFloat(temp.value);
}

function set_soft(){
	press_stop();
	var temp = document.getElementById("soft");
	_soft = parseFloat(temp.value);
	_vf = Math.sqrt(2/_soft)*_vmax;
}

function set_vmax(){
	press_stop();
	var temp = document.getElementById("vmax");
	_vmax = parseFloat(temp.value);
	_vf = Math.sqrt(2/_soft)*_vmax;
}

function set_merge(){
	press_stop();
	var temp = document.getElementById("merge");
	_merge = parseFloat(temp.value);
}



function draw_stars(){
	// get the canvas element in the html document
	var main = document.getElementById("main");
	// we do this because the canvas width was never explicitly defined in the css or html file
	// If we don't do this the drawing is blurred.
	// this comment will still need to be reviewed for a better explanation.
	main.width = main.clientWidth;
	main.height = main.clientHeight;
	var w = main.width;
	var  h = main.height;
	// we plan on making a 2D image. The other context option would be using WebGL(3d)
	var context = main.getContext('2d');
	// clear and previous drawing on the whole canvas
	context.clearRect(0,0,w,h);
	//This is used to avoid blurring of grid lines and similar. Depending if the canvas proportions are even or odd numbers in pixels and might shift the canvas coordinates by 0.5 pixels.
	if(w%2==0){
		context.translate(0.5, 0);
	}
	if(h%2==0){
		context.translate(0, 0.5);
	}
	axis_transform();
	context.strokeStyle = "rgba(255, 255, 255, 1)";
	context.fillStyle = "rgba(255, 255, 255, 1)";
	var s = h;
	if(h>w){
		s=w;
	}
	var unit = s/_base*100/_scale;
	var x_s = w/2;
	var y_s = h/2;
	var rad_ = _radius/100*s*_emscale;
	for(var i=0;i<_coord.length;i++){
		var x = 0;
		var y = 0;
		var rad = rad_*Math.pow(_coord[i][2*_dim],1/3);
		for(var j=0;j<_dim;j++){
			x+=_coord[i][j]*_xaxis[j];
			y+=_coord[i][j]*_yaxis[j];
		}
		context.beginPath();
		context.arc((x-_xcenter)*unit+x_s, (y-_ycenter)*unit+y_s, rad, 0, 2 * Math.PI);
		context.fill();
	}
}

function draw_tree(){
	temp = [];
	for(var j=0; j<_coord.length;j++){
		temp.push(empty_array(_dim*2+2));
		for(var k=0;k<_dim*2+2;k++){
			temp[j][k] = _coord[j][k];
		}
	}
	var tree = new node();
	build_tree(tree,temp);
	var main = document.getElementById("main");
	var context = main.getContext('2d');
	var w = main.width;
	var  h = main.height;
	if(w%2==0){
		context.translate(0.5, 0);
	}
	if(h%2==0){
		context.translate(0, 0.5);
	}
	var s = h;
	if(h>w){
		s=w;
	}
	var unit = s/_base*100/_scale;
	var x_s = w/2;
	var y_s = h/2;
	var rad_ = _radius/100*s*_emscale*_lineratio;
	var th = Math.ceil(Math.log(_coord.length) / Math.log(2));
	var stack = [[tree,0]];
	var lines = [[[0,0,0],[1,0,0]],[[0,0,0],[0,1,0]],[[1,0,0],[1,1,0]],[[0,1,0],[1,1,0]],
	[[0,0,1],[1,0,1]],[[0,0,1],[0,1,1]],[[1,0,1],[1,1,1]],[[0,1,1],[1,1,1]],
	[[0,0,0],[0,0,1]],[[1,0,0],[1,0,1]],[[0,1,0],[0,1,1]],[[1,1,0],[1,1,1]]];
	while(stack.length>0){
		temp = stack.pop();
		var tr = temp[0];
		if(tr.left!=null && temp[1]<_depth){
			if(temp[1]>=_depth2){
				var r = Math.floor((temp[1]-_depth2)/Math.min(th,(_depth-_depth2-1))*255);
				var b = 255-r;
				context.strokeStyle = "rgba("+r.toString()+", 0, "+b.toString()+" , 1)";
				context.fillStyle = "rgba("+r.toString()+", 0, "+b.toString()+" , 1)";
				context.beginPath();
				var rad = rad_*Math.pow(tr.m,1/3);
				context.lineWidth = rad;
				var x = 0;
				var y = 0;
				for(var j=0;j<_dim;j++){
					x+=tr.com[j]*_xaxis[j];
					y+=tr.com[j]*_yaxis[j];
				}
				context.arc((x-_xcenter)*unit+x_s, (y-_ycenter)*unit+y_s, rad, 0, 2 * Math.PI);
				context.fill();
				// for the bounding box
				for(var i=0;i<lines.length;i++){
					var x0 = 0;
					var y0 = 0;
					var x1 = 0;
					var y1 = 0;
					for(var j=0;j<_dim;j++){
						x0+=tr.bb[j][lines[i][0][j]]*_xaxis[j];
						y0+=tr.bb[j][lines[i][0][j]]*_yaxis[j];
						x1+=tr.bb[j][lines[i][1][j]]*_xaxis[j];
						y1+=tr.bb[j][lines[i][1][j]]*_yaxis[j];
					}
					context.beginPath();
					context.moveTo((x0-_xcenter)*unit+x_s,(y0-_ycenter)*unit+y_s);
					context.lineTo((x1-_xcenter)*unit+x_s,(y1-_ycenter)*unit+y_s);
					context.stroke();
				}
			}
			stack.push([tr.left,temp[1]+1]);
			stack.push([tr.right,temp[1]+1]);
		}
	}
}

function draw_scene(){
	draw_stars();
	if(_overlay){
		draw_tree();
	}
}

function iterate(){
	// see if points need to be merged
	if(_merge>0){
		merge_points();
	}
	runge_kutta(_coord);
	draw_scene();
	console.log("Number of particles: "+(_coord.length).toString());
	console.log("Number of force calculations from beginning: "+_counter.toString());
}

class node{
	constructor(){
		// total mass of the node
		this.m = 0;
		// Center of mass of the node
		this.com = empty_array(_dim);
		// top down acceleration working down from this node
		this.ca = empty_array(_dim);
		// distance furthest away from the center of mass
		this.dist = 0;
		// mass weighted variance of the node
		this.s2 = 0;
		// bounding box of the node
		this.bb=[[0,0],[0,0],[0,0]];
		// children nodes
		this.left = null;
		this.right = null;
		// index of nodes with a single element
		this.index = -1;
		// splitting plane. dim and location
		this.split = [0,0];
		//parent node
		this.parent = null;
		this.vm = empty_array(_dim);
		this.vrel = 0;
	}
}

function empty_array(n){
	a = [];
	for(var i=0;i<n;i++){
		a.push(0);
	}
	return a;
}

// choose the dimension which results in the sets with the smallest coordinate variance
function split(coord){
	// cho

	var dim = 0; 
	var l = coord.length;
	var mid = Math.floor(l/2);
	var m = []
	for(var j=0; j<_dim; j++){
		m.push([coord[0][j],coord[0][j]]);
		for(var i=1;i<coord.length;i++){
			if(coord[i][j]<m[j][0]){
				m[j][0]=coord[i][j];
			}
			if(coord[i][j]>m[j][1]){
				m[j][1]=coord[i][j];
			}
		}
	}
	var max_dist = m[0][1]-m[0][0];
	for(var j=1; j<_dim; j++){
		var d = m[j][1]-m[j][0];
		if(d>max_dist){
			max_dist = d;
			dim = j;
		}
	}
	return dim;
}

function build_tree(tree,coord){
	var l = coord.length;
	var s2 = empty_array(_dim);
	for(var i=0;i<_dim;i++){
		tree.bb[i][0] = coord[0][i];
		tree.bb[i][1] = coord[0][i];
	}
	// calculate the center of mass
	for(var i=0; i<l;i++){
		tree.m+=coord[i][2*_dim];
		for(var j=0;j<_dim;j++){
			tree.com[j]+=coord[i][j]*coord[i][2*_dim];
			s2[j]+=coord[i][j]*coord[i][j]*coord[i][2*_dim];
			tree.vm[j]+=_coord[i][j+_dim];
			if(tree.bb[j][0]>coord[i][j]){
				tree.bb[j][0] = coord[i][j];
			}
			if(tree.bb[j][1]<coord[i][j]){
				tree.bb[j][1] = coord[i][j];
			}
		}
	}
	for(var j=0;j<_dim;j++){
		tree.com[j]/=tree.m;
		s2[j] = s2[j]/tree.m-tree.com[j]*tree.com[j];
		tree.s2+=s2[j];
		tree.vm[j]/=_coord.length;
	}
	if(l>1){
		// find the distance to the point furthest from the center of mass
		var dist = 0;
		var vrel = 0;
		for(var i=0; i<l;i++){
			var d2 = 0;
			var v2 = 0;
			for(var j=0;j<_dim;j++){
				var d = tree.com[j]-coord[i][j];
				d2+=d*d;
				var v=tree.vm[j]-coord[i][j+_dim];
				v2+=v*v;
			}
			if(d2>dist){
				dist=d2;
			}
			if(v2>vrel){
				vrel=v2;
			}
		}
		tree.dist = dist;
		tree.vrel = vrel;
		if(vrel>0 && Math.max(dist,_soft*_soft)/vrel<_mint){
			_mint = Math.max(dist,_soft*_soft)/vrel;
		}
		var mid = Math.floor(l/2);
		var dim = split(coord);
		coord.sort(function(a,b){return a[dim]-b[dim];});
		// split the coordinates into two groups based on the "best" splitting dimension
		var coord2 = coord.splice(0,mid);
		tree.split[0] = dim;
		tree.split[1] = (coord[0][dim]+coord2[mid-1][dim])*0.5;
		tree.left = new node();
		tree.left.parent = tree;
		build_tree(tree.left,coord);
		tree.right = new node();
		tree.right.parent = tree;
		build_tree(tree.right,coord2);
	}
	// in the case of a single point store its index in the tree
	else{
		tree.index = coord[0][2*_dim+1];
	}
}

function tree_forces(source,target,cont){
	_steps++;
	// check if the current target's distance results in a value below threshold
	var dist = 0;
	for(var j=0; j<_dim; j++){
		var d = source.com[j]-target.com[j];
		dist+=d*d;
	}
	var value = dist;
	// we are at the correct distance to calculate accelerations
	// we calculate accelerations for the current node and the target node
	// quick online calculation of max of source.dist and target.dist
	//Math.max(th,ch): th > ch ? th : ch
	if (Math.max(source.dist,target.dist)<=_thresh*_thresh*value){
		_counter++;
		dist = Math.sqrt(dist);
		dist+=_soft;
		var temp = 1/(dist*dist*dist);
		for(var j=0; j<_dim; j++){
			var f = -(source.com[j]-target.com[j])*temp;
			source.ca[j]+=f*target.m;
			target.ca[j]-=f*source.m;
		}
	}
	// we have to dive deeper into the trees to handle force interaction
	else
	{
		// find out which subtree will lead to the greater reduction of max distance of one of the children (this implies half of that nodes contained points)
		var reduce = -Number.MAX_VALUE;
		if(source.left!=null){
			reduce = source.dist-Math.max(source.left.dist,source.right.dist);
			//reduce = source.s2*-(source.left.s2*source.left.m+source.right.s2*source.right.m);
			//reduce = source.dist;
		}
		// distance reduction of the target node
		var reducet = -Number.MAX_VALUE;
		if(target.left!=null){
			reducet = target.dist-Math.max(target.left.dist,target.right.dist);
			//reducet = target.s2*target.m-(target.left.s2*target.left.m+target.right.s2*target.right.m);
			//reducet = target.dist;
		}
		if(reduce<reducet){
			tree_forces(source,target.left,false);
			tree_forces(source,target.right,false);
		}
		else{
			tree_forces(source.left,target,false);
			tree_forces(source.right,target,false);
		}
	}
	// finally, we need to calculate the internal forces of both nodes. But only for the "original children path"
	// we want the program to crash, if it would not be true that source and target are siblings
	if(source.left!=null && cont==true){
		tree_forces(source.left,source.right,true);
	}
	if(target.left!=null && cont==true){
		tree_forces(target.left,target.right,true);
	}
}

function get_acceleration(tree,ca,accel){
	if(tree.index!=-1){
		for(var i=0;i<_dim;i++){
			accel[tree.index][i] = tree.ca[i]+ca[i];
		}
	}
	else{
		var temp = ca.slice(0,_dim);
		for(var i=0;i<_dim;i++){
			temp[i]+=tree.ca[i];
		}
		get_acceleration(tree.left,temp,accel);
		get_acceleration(tree.right,temp,accel);
	}
}

// Runge-Kutta gravity motion approximation
function runge_kutta(orig){
	var l = orig.length;
	var temp = [];
	var a = [];
	var v = [];
	var r = [];
	for(var i=0;i<4;i++){
		temp.push([]);
		a.push([]);
		v.push([]);
		r.push([]);
		for(var j=0; j<l;j++){
			a[i].push([]);
			v[i].push([]);
			r[i].push([]);
			temp[i].push(empty_array(_dim*2+2));
			for(var k=0;k<_dim*2+2;k++){
				temp[i][j][k] = orig[j][k];
			}
			a[i][j].push(empty_array(_dim));
			v[i][j].push(empty_array(_dim));
			r[i][j].push(empty_array(_dim));
			for(var k=0;k<_dim;k++){
				r[i][j][k] = orig[j][k];
				v[i][j][k] = orig[j][k+_dim];
			}
		}
	}
	// first round of coordinates
	tree = new node();
	_mint = Number.MAX_VALUE;
	build_tree(tree,temp[0]);
	_t = Math.sqrt(_mint)*_accscale;
	//_t = _accscale*(_soft/_vf);
	tree_forces(tree.left,tree.right,true);
	get_acceleration(tree,empty_array(_dim),a[0]);
	//min_timestep(tree,a[0]);
	// we need to determine the step size first
	var rk1 = [0,_t*0.5,_t*0.5,_t];
	var rk2 = [_t,2*_t,2*_t,_t];
	// all following rounds
	for(var i=1; i<4; i++){
		for(var j=0;j<l; j++){
			for(var k=0;k<_dim; k++){
				r[i][j][k] = r[0][j][k]+v[i-1][j][k]*rk1[i];
				v[i][j][k] = v[0][j][k]+a[i-1][j][k]*rk1[i];
				temp[i][j][k] = r[i][j][k];
			}
		}
		tree = new node();
		build_tree(tree,temp[i]);
		tree_forces(tree.left,tree.right,true);
		get_acceleration(tree,empty_array(_dim),a[i]);
	}
	// finally add everything together for the final computation step
	for(var i=0;i<4;i++){
		for(var j=0;j<l;j++){
			for(var k=0; k<_dim; k++){
				orig[j][k]+=rk2[i]*v[i][j][k]/6;
				orig[j][k+_dim]+=rk2[i]*a[i][j][k]/6;
			}
		}
	}
	// max velocity check
	for(var j=0;j<l;j++){
		var v = 0;
		for(var k=0; k<_dim; k++){
			v+=orig[j][k+_dim]*orig[k+_dim];
		}
		v = Math.sqrt(v);
		if(v>_vf){
			for(var k=0; k<_dim; k++){
				orig[j][k+_dim]*=_vf/v;
			}
		}
	}
}

// this function assumes that point is already in the tree. We didn't store the splitting planes
// which would normally be stored in a kd tree.
function nearest_neighbor(point,tree){
	// find the node this point is in
	var temp = tree;
	while(temp.index==-1){
		var left = true;
		for(var i=0;i<_dim;i++){
			if(point[i]<temp.left.bb[i][0]||point[i]>temp.left.bb[i][1]){
				left=false;
				break;
			}
		}
		if(left){
			temp = temp.left;
		}
		else{
			temp = temp.right;
		}
	}
	var min_dist = Number.MAX_VALUE;
	var index = -1;
	// go to the parent node of the starting node
	var top = temp.parent;
	while(top!=null){
		var stack = [top];
		while(stack.length>0){
			temp = stack.pop();
			if(temp.index==-1){
				var children = [temp.left,temp.right];
				for(var j=0;j<children.length;j++){
					var contains = true;
					for(var i=0;i<_dim;i++){
						if(point[i]<children[j].bb[i][0]||point[i]>children[j].bb[i][1]){
							contains=false;
							break;
						}
					}
					if(!contains){
						var dist = 0;
						for(var i=0;i<_dim;i++){
							var d = 0;
							if(point[i]<children[j].bb[i][0]){
								d = point[i]-children[j].bb[i][0];
							}
							if(point[i]>children[j].bb[i][1]){
								d = point[i]-children[j].bb[i][1];
							}
							dist+=d*d;
						}
						if(dist<min_dist){
							stack.push(children[j]);
						}
					}
				}
			}
			else{
				var dist = 0;
				for(var i=0;i<_dim;i++){
					var d = point[i]-temp.com[i];
					dist+=d*d
				}
				if(dist<min_dist){
					min_dist=dist;
					index = temp.index;
				}
			}
		}
		top = top.parent;
	}
	return [min_dist,index];
}

function min_timestep(tree,a){
	_t = Number.MAX_VALUE;
	/*
	for(var i=0;i<_coord[i].length;i++){
		var dist = nearest_neighbor(_coord[i],tree);
		var temp = 0;
		for(var j=0;j<_dim;j++){
			temp+=a[i][j]*a[i][j]
		}
		var t = Math.sqrt(Math.sqrt(dist))*_accscale/Math.sqrt(temp);
		if(t<_t){
			_t = t;
		}
	}*/
	for(var i=0;i<_coord.length;i++){
		var temp = 0;
		for(var j=0;j<_dim;j++){
			temp+=a[i][j]*a[i][j]
		}
		var t = _accscale/temp;
		if(t<_t){
			_t = t;
		}
	}
}

function merge_points(){
	var temp = [];
	for(var j=0; j<_coord.length;j++){
		temp.push(empty_array(_dim*2+2));
		for(var k=0;k<_dim*2+2;k++){
			temp[j][k] = _coord[j][k];
		}
	}
	var tree = new node();
	build_tree(tree,temp);
	temp = [];
	var reverse = [];
	var visited = [];
	for(var j=0; j<_coord.length;j++){
		reverse.push([]);
		visited.push(false);
		temp.push(empty_array(_dim*2+2));
		for(var k=0;k<_dim*2+2;k++){
			temp[j][k] = _coord[j][k];
		}
	}
	var nearest = [];
	for(var i=0; i<temp.length;i++){
		var res = nearest_neighbor(temp[i],tree);
		nearest.push([]);
		if(res[0]<_merge*_merge){
			nearest[i].push(res[1]);
			reverse[res[1]].push(i);
		}
	}
	var coord = [];
	var l = 2*_dim+1;
	var m = 2*_dim;
	for(var i=0; i<temp.length;i++){
		if(!visited[i]){
			coord.push(empty_array(2*_dim+2));
			var stack = [];
			var stack2 = [];
			stack.push(i);
			// go through all neighbors which are linked
			while(stack.length>0){
				var s = stack.pop();
				if(!visited[s]){
					visited[s] = true;
					stack2.push(s);
					for(var j=0;j<nearest[i].length;j++){
						stack.push(nearest[i][j]);
					}
					for(var j=0;j<reverse[i].length;j++){
						stack.push(reverse[i][j]);
					}
				}
			}
			for(var j=0;j<stack2.length;j++){
				var len = coord.length-1;
				for(var k=0;k<m; k++){
					coord[len][k]+=temp[stack2[j]][k]*temp[stack2[j]][m];
				}
				coord[len][m]+=temp[stack2[j]][m];
				coord[len][l] = len;
			}
			for(var k=0;k<m; k++){
				coord[len][k]/=coord[len][m];
			}
		}
	}
	_coord = coord;
}

function generate_random(){
	for(var i=0;i<_coord.length;i++){
		var v = 0;
		for(var j=0;j<_dim;j++){
			_coord[i][j]=-_box[j]*0.5+Math.random()*_box[j];
			_coord[i][j+_dim] = randn()*_box[j];
			v+=_coord[i][j+_dim]*_coord[i][j+_dim];
		}
		v = _v/Math.sqrt(v)
		for(var j=0;j<_dim;j++){
			_coord[i][j+_dim]*=v;
		}
		_coord[i][2*_dim] = 1;
		_coord[i][2*_dim+1] = i;
	}
}

function empty_coord(n){
	_coord =[];
	for(var i=0;i<n;i++){
		_coord.push(empty_array(_dim*2+2));
	}
}

// Standard Normal variate using Box-Muller transform.
function randn() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function quaternion_mult(a,b){
	return [[a[0]*b[0]-a[1]*b[1]-a[2]*b[2]-a[3]*b[3]],
		[a[0]*b[1]+a[1]*b[0]+a[2]*b[3]-a[3]*b[2]],
		[a[0]*b[2]-a[1]*b[3]+a[2]*b[0]+a[3]*b[1]],
		[a[0]*b[3]+a[1]*b[2]-a[2]*b[1]+a[3]*b[0]]];
}

function axis_transform(){
	var c = Math.cos(_rot/2);
	var s = Math.sin(_rot/2);
	var n = 0;
	for(var i=0;i<_dim;i++){
		n+=_normal[i]*_normal[i];
	}
	n = Math.sqrt(n);
	for(var i=0;i<_dim;i++){
		_normal[i]/=n;
	}
	var q = [c,s*_normal[0],s*_normal[1],s*_normal[2]];
	var q_1 = [c,-s*_normal[0],-s*_normal[1],-s*_normal[2]];
	var x = [0,1,0,0];
	x = quaternion_mult(quaternion_mult(q,x),q_1);
	_xaxis = [x[1],x[2],x[3]];
	var y = [0,0,1,0];
	y = quaternion_mult(quaternion_mult(q,y),q_1);
	_yaxis = [y[1],y[2],y[3]];
}