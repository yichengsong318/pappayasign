import React from 'react'
import $ from 'jquery';
import { fabric } from 'fabric';
import * as jsPDF from 'jspdf';
import classnames from "classnames";
import TemplateDataVar from '../../variables/templatedata';
//import fabric from 'fabric-webpack'
import "./templatestyles.css";
import "./templateannotate.css";

import {
	Button,
	Badge,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Label,
	Form,
	Input,
	Container,
	TabContent,
	TabPane,
	NavItem,
	NavLink,
	Nav,
	Row,
	Col
  } from "reactstrap";

const axios = require('axios').default;
var PDFJS = require("pdfjs-dist");
//var fabric = require("fabric-webpack");
//var jsPDF = require("jspdf-react");
var pdfPath = "./sample.pdf";
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');

var firebase = require('firebase');


class TemplateAnnotate extends React.Component {
	state = {
		tabs: 1
	  };
	  toggleNavs = (e, state, index) => {
		e.preventDefault();
		this.setState({
		  [state]: index
		});
	  };
 
componentDidMount() { 
var modal = document.querySelectorAll(".modal")
var copybtn = document.getElementById('copy-clipboard-btn');
var mainurl = document.location.hash;
var url = document.location.hash;
var doubleclickobj;
var fileid = '';
var filename = '';
var type = '';
var userid = '';
var email = '';
var recepientemail = '';
var recepientcolor = '';
var useridother = '';
var owner = 'admin';
var grabbedcolor = '';
var docname = '';
var dbpeople = [];



var TemplateAnnotate = function(container_id, toolbar_id, url, filename, options = {}) {
	
	this.number_of_pages = 0;
	this.pages_rendered = 0;
	this.active_tool = 1; // 1 - Free hand, 2 - Text, 3 - Arrow, 4 - Rectangle
	this.fabricObjects = [];
	this.fabricObjectsData = [];
	this.color = '#000';
	this.borderColor = '#000000';
	this.borderSize = 1;
	this.font_size = 16;
	this.active_canvas = 0;
	this.container_id = container_id;
	this.toolbar_id = toolbar_id;
	this.imageurl = '';
	this.Addtext = 'Sample Text';
	this.recepientemail = '';
	this.recepientcolor = '';
	this.filename = filename;
	this.url = url;
	docname = filename;
	var inst = this;

	var loadingTask = PDFJS.getDocument(this.url);
	loadingTask.promise.then(function (pdf) {
	    
	    inst.number_of_pages = pdf.numPages;
		var scale = 1.3;
	    for (var i = 1; i <= pdf.numPages; i++) {
	        pdf.getPage(i).then(function (page) {
				var container = document.getElementById(inst.container_id);
				//var viewport = page.getViewport(1);
				//var scale = (container.clientWidth - 80) / viewport.width;
				var viewport = page.getViewport(scale);
	            var canvas = document.createElement('canvas');
	            document.getElementById(inst.container_id).appendChild(canvas);
	            canvas.className = 'pdf-canvas';
	            canvas.height = viewport.height;
	            canvas.width = viewport.width;
	            var context = canvas.getContext('2d');

	            var renderContext = {
	                canvasContext: context,
	                viewport: viewport
	            };
	            var renderTask = page.render(renderContext);
	            renderTask.then(function () {
	                $('.pdf-canvas').each(function (index, el) {
	                    $(el).attr('id', 'page-' + (index + 1) + '-canvas');
	                });
	                inst.pages_rendered++;
	                if (inst.pages_rendered == inst.number_of_pages) inst.initFabric();
	            });
	        });
	    }
	}, function (reason) {
	    console.error(reason);
	});

	this.initFabric = function () {
		var inst = this;
	    $('#' + inst.container_id + ' canvas').each(function (index, el) {
	        var background = el.toDataURL("image/png");
	        var fabricObj = new fabric.Canvas(el.id, {
	            freeDrawingBrush: {
	                width: 1,
	                color: inst.color
	            }
	        });
		
		fabricObj.on('object:selected', function (e) {
		  e.target.transparentCorners = false;
		  e.target.borderColor = '#cccccc';
		  e.target.cornerColor = '#d35400';
		  e.target.minScaleLimit = 2;
		  e.target.cornerStrokeColor = '#d35400';
		  e.target.cornerSize = 8;
		  e.target.cornerStyle = 'circle';
		  e.target.minScaleLimit = 0;
		  e.target.lockScalingFlip = false;
		  e.target.padding = 5;
		  e.target.selectionDashArray = [10, 5];
		  e.target.borderDashArray = [10, 5];
		});
			inst.fabricObjects.push(fabricObj);
			if (typeof options.onPageUpdated == 'function') {
				fabricObj.on('object:added', function() {
					var oldValue = Object.assign({}, inst.fabricObjectsData[index]);
					inst.fabricObjectsData[index] = fabricObj.toJSON()
					options.onPageUpdated(index + 1, oldValue, inst.fabricObjectsData[index]) 
				})
			}
	        fabricObj.setBackgroundImage(background, fabricObj.renderAll.bind(fabricObj));
			fabricObj.on('after:render', function () {
				inst.fabricObjectsData[index] = fabricObj.toJSON()
				fabricObj.off('after:render')
			})

			
			fabricObj.on({"mouse:up": function(e) {
				//console.log("Mouse up", e);
				//fabricMouseHandler(e, fabricObj);
				if (e.target) {
					//clicked on object
					const objcolor = e.target.backgroundColor;
					const objid = e.target.id;
					if(grabbedcolor != ''){
						function hexToRgb(hex) {
							var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
							return result ? {
							  r: parseInt(result[1], 16),
							  g: parseInt(result[2], 16),
							  b: parseInt(result[3], 16)
							} : null;
						  }
						  
						
						
						console.log(e.target);
						
						var rgbval = hexToRgb(grabbedcolor).r + ', ' + hexToRgb(grabbedcolor).g + ', ' + hexToRgb(grabbedcolor).b;
						var RGB = 'rgb('+rgbval+')';
					}
					else{
						var RGB = '';
					}
					
					if(objcolor == RGB || owner == 'admin' || objid == email){
						console.log('Object selected');
						e.target.lockMovementX = false; e.target.lockMovementY = false;
						var id = fabricObj.getObjects().indexOf(e.target);
						e.target.selectable = true;
						fabricObj.setActiveObject(fabricObj.item(id));
						fabricObj.requestRenderAll();
						e.target.hasControls = true;
						e.target.set("id", email);
					}
					else{
						console.log('Object not selected');
						e.target.selectable = false;
						e.target.lockMovementX = true; e.target.lockMovementY = true;
						e.target.hasControls = false;
					}
				  }else{
					//add rectangle
					if(e.e.type == 'touchstart' || e.e.type == 'touchmove' || e.e.type == 'touchend' || e.e.type == 'touchcancel'){
					
						var x = e.pointer.x;
						var y = e.pointer.y;
						inst.active_canvas = index;
						fabricMouseHandler(e, fabricObj);
					} else if (e.e.type == 'mousedown' || e.e.type == 'mouseup' || e.e.type == 'mousemove' || e.e.type == 'mouseover'|| e.e.type=='mouseout' || e.e.type=='mouseenter' || e.e.type=='mouseleave') {
						var x = e.e.clientX;
						var y = e.e.clientY;
						var click = e.e;
						inst.active_canvas = index;
					inst.fabricClickHandler(click, fabricObj);
					}
				  }
				
				
			  }});

			  fabric.util.addListener(fabricObj.upperCanvasEl, 'dblclick', function(e) {
				if (fabricObj.findTarget(e)) {
					const objType = fabricObj.findTarget(e).type;
					const obj = fabricObj.findTarget(e);
					const objcolor = fabricObj.findTarget(e).backgroundColor; 
					const objid = fabricObj.findTarget(e).id; 
					console.log(objType);
					console.log(obj);
					if(grabbedcolor != ''){
						function hexToRgb(hex) {
							var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
							return result ? {
							  r: parseInt(result[1], 16),
							  g: parseInt(result[2], 16),
							  b: parseInt(result[3], 16)
							} : null;
						  }
						  
						
						var rgbval = hexToRgb(grabbedcolor).r + ', ' + hexToRgb(grabbedcolor).g + ', ' + hexToRgb(grabbedcolor).b;
						var RGB = 'rgb('+rgbval+')';
					}
					else{
						var RGB = '';
					}
					
					if(objcolor == RGB || owner == 'admin' || objid == email){
						var id = fabricObj.getObjects().indexOf(obj);
						obj.selectable = true;
						fabricObj.setActiveObject(fabricObj.item(id));
						obj.lockMovementX = false; obj.lockMovementY = false;
						obj.hasControls = true;
						fabricObj.requestRenderAll();
						
						if (objType === 'image') {
							//alert('double clicked on a image!');
							doubleclickobj = fabricObj.findTarget(e);
							console.log(doubleclickobj);
							obj.set("backgroundColor", 'transparent');
							obj.set("id", email);
							
						}
						else if (objType === 'i-text') {
							
							obj.set("backgroundColor", 'transparent');
							fabricObj.renderAll();
							obj.set("id", email);
						}
					}
					else{
						obj.lockMovementX = true; obj.lockMovementY = true;
						console.log('Email Id is different:' + objid);
						alert("Sorry you don't have enough access to modify this object");
						obj.selectable = false;
						obj.hasControls = false;
					}
					
				}
			});
		});
		
		
	}
	

	function fabricMouseHandler(e, fabricObj){

		$('.tool.active').removeClass('active');
    	$('.icon-color').removeClass('icon-color');
		if (inst.active_tool == 2) {
			var value = inst.Addtext;
			var text = new fabric.IText(value, {
				left: e.pointer.x - fabricObj.upperCanvasEl.getBoundingClientRect().left,
				top: e.pointer.y - fabricObj.upperCanvasEl.getBoundingClientRect().top +300,
				fill: inst.color,
				backgroundColor: inst.recepientcolor,
				id: inst.recepientemail,
				fontSize: inst.font_size,
				selectable: false,
				lockMovementX: true,
				lockMovementY: true,
				hasControls: false
			});
			fabricObj.add(text);
			inst.active_tool = 0;
				 
		$('.icon-color').removeClass('icon-color');
		}
		else if (inst.active_tool == 4) {		        
		var myImg = inst.imageurl;
		fabric.Image.fromURL(myImg, function(oImg) {
		var l = e.pointer.x  - fabricObj.upperCanvasEl.getBoundingClientRect().left;
		var t = e.pointer.y  - fabricObj.upperCanvasEl.getBoundingClientRect().top +250;                
		oImg.scale(0.3);
		oImg.set({'left':l});
		  oImg.set({'top':t});
		  oImg.set({'id':inst.recepientemail});
		  oImg.set({'selectable':false});
		  oImg.set({'lockMovementX':true});
		  oImg.set({'lockMovementY':true});
		  oImg.set({'hasControls':false});
		  oImg.set({'backgroundColor':inst.recepientcolor});
		fabricObj.add(oImg);
		
		},{ crossOrigin: 'Anonymous' });
		inst.active_tool = 0;
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
		}
		else if (inst.active_tool == 5) {		        
				
		var rect = new fabric.Rect({
		left:e.pointer.x  - fabricObj.upperCanvasEl.getBoundingClientRect().left,
		top:e.pointer.y  - fabricObj.upperCanvasEl.getBoundingClientRect().top +250,
		width: 100,
		height: 100,
		fill: 'rgba(0,0,0,0)',
		stroke: inst.color,
		id:inst.recepientemail,
		selectable:false,
		strokeSize: inst.borderSize
		});
		fabricObj.add(rect);
		
		inst.active_tool = 0;
		$('.icon-color').removeClass('icon-color');
		}
		else if (inst.active_tool == 6) {		        
				
		var circle = new fabric.Circle({
		left:e.pointer.x  - fabricObj.upperCanvasEl.getBoundingClientRect().left,
		top:e.pointer.y - fabricObj.upperCanvasEl.getBoundingClientRect().top + 250,
		radius:50,
		fill: 'rgba(0,0,0,0)',
		stroke: inst.color,
		id:inst.recepientemail,
		selectable:false,
		strokeSize: inst.borderSize
		});
		fabricObj.add(circle);
		
		inst.active_tool = 0;
		$('.icon-color').removeClass('icon-color');
		}
	}
	
	

	this.fabricClickHandler = function(event, fabricObj) {
		var inst = this;
		$('.tool.active').removeClass('active');
    	$('.icon-color').removeClass('icon-color');
		
	    if (inst.active_tool == 2) {
			var value = inst.Addtext;
	        var text = new fabric.IText(value, {
	            left: event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left,
	            top: event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top,
				fill: inst.color,
				backgroundColor: inst.recepientcolor,
				id: inst.recepientemail,
	            fontSize: inst.font_size,
				selectable: false,
				lockMovementX: true,
				lockMovementY: true,
				hasControls: false
	        });
	        fabricObj.add(text);
	        inst.active_tool = 0;
		 		
		$('.icon-color').removeClass('icon-color');
	    }
	    else if (inst.active_tool == 4) {		        
		var myImg = inst.imageurl;
		fabric.Image.fromURL(myImg, function(oImg) {
		var l = event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left - 100;
		var t = event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top - 20;                
		oImg.scale(0.5);
		oImg.set({'left':l});
		  oImg.set({'top':t});
		  oImg.set({'id':inst.recepientemail});
		  oImg.set({'selectable':false});
		  oImg.set({'lockMovementX':true});
		  oImg.set({'lockMovementY':true});
		  oImg.set({'hasControls':false});
		  oImg.set({'backgroundColor':inst.recepientcolor});
		fabricObj.add(oImg);
		
		},{ crossOrigin: 'Anonymous' });
		inst.active_tool = 0;
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	    }
	    else if (inst.active_tool == 5) {		        
		        
		var rect = new fabric.Rect({
		left:event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left - 100,
		top:event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top - 20,
		width: 100,
		height: 100,
		fill: 'rgba(0,0,0,0)',
		stroke: inst.color,
		id:inst.recepientemail,
		strokeSize: inst.borderSize,
		selectable: false
		});
		fabricObj.add(rect);
		
		inst.active_tool = 0;
		$('.icon-color').removeClass('icon-color');
	    }
	    else if (inst.active_tool == 6) {		        
		        
		var circle = new fabric.Circle({
		left:event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left - 100,
		top:event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top - 20,
		radius:50,
		fill: 'rgba(0,0,0,0)',
		stroke: inst.color,
		id:inst.recepientemail,
		strokeSize: inst.borderSize,
		selectable: false
		});
		fabricObj.add(circle);
		
		inst.active_tool = 0;
		$('.icon-color').removeClass('icon-color');
	    }
	}
	modal[0].style.display = "none";
	
}






TemplateAnnotate.prototype.enableSelector = function () {
	var inst = this;
	inst.active_tool = 0;
	if (inst.fabricObjects.length > 0) {
	    $.each(inst.fabricObjects, function (index, fabricObj) {
	        fabricObj.isDrawingMode = false;
	    });
	}
}

TemplateAnnotate.prototype.enablePencil = function () {
	var inst = this;
	inst.active_tool = 1;
	if (inst.fabricObjects.length > 0) {
	    $.each(inst.fabricObjects, function (index, fabricObj) {
	        fabricObj.isDrawingMode = true;
	    });
	}
}

TemplateAnnotate.prototype.enableAddText = function (text, recepientemail, recepientcolor) {
	var inst = this;
	inst.Addtext = text;
	inst.recepientemail = recepientemail;
	inst.recepientcolor = recepientcolor;
	inst.active_tool = 2;
	if (inst.fabricObjects.length > 0) {
	    $.each(inst.fabricObjects, function (index, fabricObj) {
	        fabricObj.isDrawingMode = false;
	    });
	}
}

TemplateAnnotate.prototype.enableImage = function (url, recepientemail, recepientcolor) {
	var inst = this;
	inst.recepientemail = recepientemail;
	inst.recepientcolor = recepientcolor;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	inst.active_tool = 4;
	inst.imageurl = url;
	if (inst.fabricObjects.length > 0) {
	    $.each(inst.fabricObjects, function (index, fabricObj) {
	        fabricObj.isDrawingMode = false;
	    });
	}

	
}


TemplateAnnotate.prototype.enableRectangle = function () {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	inst.active_tool = 5;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}
}

TemplateAnnotate.prototype.enableCircle= function () {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	inst.active_tool = 6;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}
}

TemplateAnnotate.prototype.deleteSelectedObject = function () {
	var inst = this;
	var activeObject = inst.fabricObjects[inst.active_canvas].getActiveObject();
	if (activeObject)
	{
	     inst.fabricObjects[inst.active_canvas].remove(activeObject);
	}
}



TemplateAnnotate.prototype.ZoomIn = function (){
var inst = this;

//jsonData =  inst.fabricObjects.toJSON();

var container = document.getElementById(inst.container_id);
var scaleX = container.getBoundingClientRect().width / container.offsetWidth;
	console.log(scaleX)
	scaleX = scaleX+0.1;
	container.style.transform = "scale("+ scaleX +")";

}

TemplateAnnotate.prototype.ZoomOut = function (){
var inst = this;
var container = document.getElementById(inst.container_id);
var scaleX = container.getBoundingClientRect().width / container.offsetWidth;
	console.log(scaleX)
	scaleX = scaleX-0.1;
	container.style.transform = "scale("+ scaleX +")";

	
}


TemplateAnnotate.prototype.savePdf = function () {
	
	var inst = this;
	var doc = new jsPDF();
	$.each(inst.fabricObjects, function (index, fabricObj) {
	    if (index != 0) {
	        doc.addPage();
	        doc.setPage(index + 1);
	    }
	    doc.addImage(fabricObj.toDataURL(), 'png', 0, 0);
	});
	doc.save('pappayasign_template_'+inst.filename+'');
	modal[1].style.display = "none";
}





TemplateAnnotate.prototype.savetoCloudPdf = function () {
	
	var inst = this;

	var today = new Date().toLocaleString().replace(",","");


	console.log('fileid:'+fileid);
    if (fileid ==''){
		filename = randomString(13);
		console.log('filename:'+filename);
	}
	else{
		filename = fileid;

	}
	  var storageRef = firebase.storage().ref(userid + '/Templates/'+filename+'.pdf');
	var task = storageRef.put(TemplateDataVar.TemplateDataURI);
	task.on('state_changed', function progress(snapshot) {
	  console.log('done')
	  
	  url = "#/admin/sign?id=" + encodeURIComponent(filename);
	  console.log(url)
	}, function error(err) {
  
		console.log(err)
	},function complete() {
		console.log('complete')


		var dataarray = [];
		var jsonData = [];
		$.each(inst.fabricObjects, function (index, fabricObj) {
			//console.log(fabricObj.toJSON());
			jsonData[index] = fabricObj.toJSON();
			console.log(jsonData[index]);
			console.log(JSON.stringify(jsonData[index]));
			dataarray.push(JSON.stringify(jsonData[index]));
			//firebase.database().ref(userid + '/Documents/'+filename+'/Data/').child(index).set(JSON.stringify(jsonData[index]));
	
		})

		axios.post('/addtemplatedata', {
			TemplateName: inst.filename,
			TemplateID: filename,
			OwnerEmail: email,
			DateCreated: today,
			DateStatus: today,
			DateSent: '',
			Owner: userid,
			Status: 'Draft',
			Data: dataarray,
			Reciever: []

		  })
		  .then(function (response) {
			console.log(response);
			if(response.data === 'insert done' || response.data === 'update done'){
				var people=[];
		var Reciever = [];
		people = TemplateDataVar.TemplateRecepientArray;
		people.forEach(function(item, index) {
			var recepientName = people[index].name;
			var recepientEmail = people[index].email;
			var recepientOption = people[index].option;
			var recepientColor = colorArray[index];
			if(recepientOption == 'Needs to Sign' || recepientOption == 'Needs to View'){
			console.log(recepientEmail + ',' + recepientName);
			

				  var user = {
					RecepientName: recepientName,
					DocumentName: inst.filename,
					RecepientEmail: recepientEmail,
					RecepientColor: recepientColor,
					RecepientOption: recepientOption,
					RecepientStatus: 'Waiting for Others',
					RecepientDateStatus: today
				  }
				  Reciever.push(user);
				  console.log(Reciever);
				  
			}
		
		});
		
		axios.post('/addtemplatereciever', {
		Status: 'Waiting for Others',
		TemplateID: filename,
		DateSent: today,
		Reciever: Reciever
	
		})
		.then(function (response) {
		console.log(response);
		if(response.data === 'reciever done'){
				window.location.hash = '#/admin/templates';
				url = 'https://pappayasign.herokuapp.com/#/admin/sign?id=' + encodeURIComponent(filename) + '&type=db&u=' + userid;
				modal[1].style.display = "none";
		}
		})
		.catch(function (error) {
		console.log(error);
		modal[1].style.display = "none"
		alert(error);
		
		});
				
			}
		  })
		  .catch(function (error) {
			console.log(error);
			modal[1].style.display = "none";
		  });


		
		
	  
	});
	

	

	
		
}



var randomString = function (len, bits)
{
    bits = bits || 36;
    var outStr = "", newStr;
    while (outStr.length < len)
    {
        newStr = Math.random().toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr.toUpperCase();
};


TemplateAnnotate.prototype.setBrushSize = function (size) {
	var inst = this;
	$.each(inst.fabricObjects, function (index, fabricObj) {
	    fabricObj.freeDrawingBrush.width = size;
	});
}

TemplateAnnotate.prototype.setColor = function (color) {
	var inst = this;
	inst.color = color;
	$.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.freeDrawingBrush.color = color;
    });
}

TemplateAnnotate.prototype.setBorderColor = function (color) {
	var inst = this;
	inst.borderColor = color;
}

TemplateAnnotate.prototype.setFontSize = function (size) {
	this.font_size = size;
}

TemplateAnnotate.prototype.setBorderSize = function (size) {
	this.borderSize = size;
}

TemplateAnnotate.prototype.clearActivePage = function () {
	var inst = this;
	$.each(inst.fabricObjects, function (index, fabricObj) {
		var bg = fabricObj.backgroundImage;
			fabricObj.clear();
			fabricObj.setBackgroundImage(bg, fabricObj.renderAll.bind(fabricObj));
	})

}

TemplateAnnotate.prototype.Reload = function () {
	var inst = this;
	$.each(inst.fabricObjects, function (index, fabricObj) {
		fabricObj.renderAll();
	})
	console.log('reloaded');

}

TemplateAnnotate.prototype.serializePdf = function() {
	var inst = this;
	return JSON.stringify(inst.fabricObjects, null, 4);
}



TemplateAnnotate.prototype.loadFromJSON = function(jsonData) {
	var inst = this;
	$.each(inst.fabricObjects, function (index, fabricObj) {
		if (jsonData.length > index) {
			fabricObj.loadFromJSON(jsonData[index], function () {
				inst.fabricObjectsData[index] = fabricObj.toJSON()
			})
		}
	})
}


var pdf;



document.getElementById('tfileinput').addEventListener('input', function(input) {
	try {
		console.log(input.target.value);
	console.log(input.srcElement.files[0].name);

    var file = input.srcElement.files[0];
	console.log(input.srcElement.files[0].name);

  var reader = new FileReader();
    reader.readAsDataURL(file);

  reader.onload = function() {
     var url = reader.result;
	 clearPDF();
	 modal[0].style.display = "block";
	 try {
		pdf = new TemplateAnnotate('tpdf-container', 'toolbar', url, input.srcElement.files[0].name); 
	 } catch (error) {
		 alert('Please Select a Valid Document');
	 }
	
  };

  reader.onerror = function() {
    console.log(reader.error);
    alert('Error Opening File');
  };
	} catch (error) {
		console.log(error);
	}
	
});


document.getElementById('timageinput').addEventListener('input', function(input) {
	try {
		var select = document.getElementById('recepientselect');
		recepientemail = select.options[select.selectedIndex].value;
		console.log(input.target.value);
	console.log(input.srcElement.files[0].name);
    var file = input.srcElement.files[0];
	console.log(input.srcElement.files[0].name);

  var reader = new FileReader();
    reader.readAsDataURL(file);

  reader.onload = function() {
	 var url = reader.result;
	 try {
		pdf.enableImage(url, recepientemail, recepientcolor);
	 } catch (error) {
		alert('Invalid Image');
	 }
     
  };

  reader.onerror = function() {
    console.log(reader.error);
    alert('Error Opening File');
  };
	} catch (error) {
		console.log(error)
	}
	
});

 

document.getElementById("tzoominbtn").addEventListener("click", function(){
	pdf.ZoomIn();
	
}, false);

document.getElementById("tzoomoutbtn").addEventListener("click", function(){
	pdf.ZoomOut();
	
}, false);

var tclearbtn = document.getElementById('tclearbtn');
tclearbtn.addEventListener('click', function(event) {
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	try {
		pdf.clearActivePage();
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
    
});

var tdeletebtn = document.getElementById('tdeletebtn');
tdeletebtn.addEventListener('click', function(event) {
    $('.tool.active').removeClass('active');
	$('.icon-color').removeClass('icon-color');
	try {
		pdf.deleteSelectedObject();
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});

var tsavebtn = document.getElementById('tsavebtn');
tsavebtn.addEventListener('click', function(event) {
    $('.tool.active').removeClass('active');
	$('.icon-color').removeClass('icon-color');
	modal[1].style.display = "block";
	try {
		pdf.savePdf();
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});

var tselectbtn = document.getElementById('tselectbtn');
tselectbtn.addEventListener('click', function(event) {
	var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
    icon.classList.add('icon-color');
	try {
		pdf.enableSelector();
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});

var trectanglebtn = document.getElementById('trectanglebtn');
trectanglebtn.addEventListener('click', function(event) {
	var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
    icon.classList.add('icon-color');
	try {
		pdf.enableRectangle();
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});

var tcirclebtn = document.getElementById('tcirclebtn');
tcirclebtn.addEventListener('click', function(event) {
	var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
    icon.classList.add('icon-color');
	try {
		pdf.enableCircle();
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});


var ttextbtn = document.getElementById('ttextbtn');
ttextbtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('trecepientselect');
	recepientemail = select.options[select.selectedIndex].value;
	recepientcolor = select.options[select.selectedIndex].style.backgroundColor;
	console.log(recepientemail);
	try {
		pdf.enableAddText('Text', recepientemail, recepientcolor);
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});


var tnamebtn = document.getElementById('tnamebtn');
tnamebtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('trecepientselect');
	recepientemail = select.options[select.selectedIndex].value;
	recepientcolor = select.options[select.selectedIndex].style.backgroundColor;
	try {
		pdf.enableAddText('Name', recepientemail, recepientcolor);
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});

var tcompanybtn = document.getElementById('tcompanybtn');
tcompanybtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('trecepientselect');
	recepientemail = select.options[select.selectedIndex].value;
	recepientcolor = select.options[select.selectedIndex].style.backgroundColor;
	try {
		pdf.enableAddText('Company', recepientemail, recepientcolor);
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});


var ttitlebtn = document.getElementById('ttitlebtn');
ttitlebtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('trecepientselect');
	recepientemail = select.options[select.selectedIndex].value;
	recepientcolor = select.options[select.selectedIndex].style.backgroundColor;
	try {
		pdf.enableAddText('Title', recepientemail, recepientcolor);
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});


var tinitialbtn = document.getElementById('tinitialbtn');
tinitialbtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	modal[5].style.display = "block";
	var select = document.getElementById('trecepientselect');
	recepientemail = select.options[select.selectedIndex].value;
	recepientcolor = select.options[select.selectedIndex].style.backgroundColor;
});

var tdatebtn = document.getElementById('tdatebtn');
tdatebtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('trecepientselect');
	recepientemail = select.options[select.selectedIndex].value;
	recepientcolor = select.options[select.selectedIndex].style.backgroundColor;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	today = mm + '/' + dd + '/' + yyyy;
	try {
		pdf.enableAddText(today, recepientemail, recepientcolor);
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});

var tpenbtn = document.getElementById('tpenbtn');
tpenbtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
    icon.classList.add('icon-color');
	try {
		pdf.enablePencil();
	} catch (error) {
		alert('Please add a document first!');
		$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	}
	
});


var tsignaturebtn = document.getElementById('tsignaturebtn');
tsignaturebtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('trecepientselect');
	recepientemail = select.options[select.selectedIndex].value;
	recepientcolor = select.options[select.selectedIndex].style.backgroundColor;
	//pdf.enablePencil();
	console.log('signpress');
	var dataUrl = 'data:image/png;base64,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';
	try {
		pdf.enableImage(dataUrl, recepientemail, recepientcolor);
	} catch (error) {
		alert('Add a Document');
	}
	
});

var topenfilebtn = document.getElementById('topenfilebtn');
topenfilebtn.addEventListener('click', function(event) {
	$('.icon-color').removeClass('icon-color');
    $('.tool.active').removeClass('active');
    document.getElementById("tfileinput").click();
});


var timagebtn = document.getElementById('timagebtn');
timagebtn.addEventListener('click', function(event) {
	$('.icon-color').removeClass('icon-color');
    $('.tool.active').removeClass('active');
    document.getElementById("imageinput").click();
});

function clearPDF() {
    const myNode = document.getElementById("tpdf-container");
    myNode.innerHTML = '';
}

function clickFile() {
	$('.icon-color').removeClass('icon-color');
	var inputtag = document.createElement('span');
	inputtag.innerHTML = '<input id="fileinput" type="file" accept="application/pdf" value="Click me" onchange="openPDF(this)" style="display:none;">'
	document.getElementById('toolbar').appendChild(inputtag);
    document.getElementById("fileinput").click();
}

function clickImageFile() {
	$('.icon-color').removeClass('icon-color');
	var imagetag = document.createElement('span');
	imagetag.innerHTML = '<input id="imageinput" type="file" accept="image/*" value="Click me" onchange="openImage(this)" style="display:none;">'
	document.getElementById('toolbar').appendChild(imagetag);
    document.getElementById("imageinput").click();
}


function clearPage() {
	try {
		pdf.clearActivePage();
	} catch (error) {
		alert('Please add a document first!');
	}
    
}





var colorArray = ['#E6EE9C', '#B6EDD8', '#FFCDD3', '#90CAF9', '#E1BEE7', '#A5D6A7', '#B3E2E3', '#BCAAA4', '#E0E0E0', '#FFAB00', '#64DD17', '#00B8D4', '#00BFA5']


function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') c = c.substring(1, c.length);
	  if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
	}

try{
	
	userid = getCookie('uid');

	if (userid) {

	console.log('user logged in');
	console.log(userid);
	email = getCookie('useremail');

	
	var optiondefault = document.createElement('option');
		  optiondefault.value = email;
		  optiondefault.style.backgroundColor = '#BDBDBD';
			optiondefault.innerHTML='Default(Me)';
			$( "#trecepientselect" ).append(optiondefault);

	try {
		if(TemplateDataVar.TemplateDataPath != ''){
			console.log(TemplateDataVar.TemplateDataPath);
			pdf = new TemplateAnnotate('tpdf-container', 'toolbar', TemplateDataVar.TemplateDataPath, TemplateDataVar.TemplateDocName, {
				onPageUpdated: (page, oldData, newData) => {
					//modal[0].style.display = "block";
					console.log(page, oldData, newData);
					
				}
			
			});
		}
		else{
			console.log('No Data File Found');
		}
		var tpeople=[];
		tpeople = TemplateDataVar.TemplateRecepientArray;
		console.log(tpeople);
		tpeople.forEach(function(item, index) {
		if(tpeople[index].option == 'Needs to Sign'){
			var toption = document.createElement('option');
			toption.value = tpeople[index].email;
			toption.style.backgroundColor = colorArray[index];
			toption.innerHTML=''+tpeople[index].name+'';
			$( "#trecepientselect" ).append(toption);
		}
		});
				
		} catch (error) {
			console.log(error);
		}

	
	
	

	
} else {
	// no user
	//window.location.hash = "#/auth/login";
	modal[0].style.display = "none";
	modal[4].style.display = "block";

}

	
	}
	catch(err){
	console.log('no data');
	modal[0].style.display = "none";
	
	
	}

		


window.onclick = function(e){
  if(e.target == modal[0]){
	modal[2].style.display = "none";
	modal[3].style.display = "none";
  }
}

  var tgetlinkbtn = document.getElementById('tgetlinkbtn');
  tgetlinkbtn.addEventListener('click', function(event) {
	try {
		modal[1].style.display = "block";
		pdf.savetoCloudPdf()
	} catch (error) {
		alert('There are no changes to save');
	}

});

  



var taddinitialmodalbtn = document.getElementById('taddinitialmodalbtn');
taddinitialmodalbtn.addEventListener('click', function(event) {
	//modal[3].style.display = "block";
	var initialval = document.getElementById('addinitialval').value;
	if(initialval == ''){
		alert('Please enter your initials');
	}
	else{
		try {
			pdf.enableAddText(initialval, recepientemail, recepientcolor);
			modal[3].style.display = "none";
		} catch (error) {
			modal[3].style.display = "none";
			alert('Please add a document first!');
			$('.tool-button.active').removeClass('active');
		$('.icon-color').removeClass('icon-color');
		}
	}
	
	
});

var tcloseinitialmodalbtn = document.getElementById('tcloseinitialmodalbtn');
tcloseinitialmodalbtn.addEventListener('click', function(event) {
	modal[5].style.display = "block";
	
	
	
});








}




render() {
    
    return (
	<div>
	<Row>
	<div id="teditortoolbar" className="editortoolbar">
	<button id="tzoominbtn" color="neutral" className="tool"><i className="material-icons" >zoom_in</i></button>
	<button id="tzoomoutbtn" color="neutral" className="tool"><i className="material-icons" >zoom_out</i></button>
	
	</div>	
 
	<div className="modal">
  <div className="modal-content">
    <div><p>Please wait while we set things up for you.</p><div className="lds-dual-ring"></div></div>
	
  </div>
</div>

 
	<div className="modal">
  <div className="modal-content">
	<div><p>Please wait while we save the changes you have made.</p><div className="lds-dual-ring"></div></div>
	
  </div>
</div>

<div className="modal">
  <div className="modal-content">
  <div >
  <div className="mb-4 mb-xl-0"><h5>Please enter your Initials: </h5></div>
	<Row>
		
	<Col lg="12">
	<FormGroup>
		<Input
			className="form-control-alternative"
			id="taddinitialval"
			placeholder="Initials"
			type="text"
		/>
		</FormGroup>
		</Col>
		
		<Col lg="6">
		<Button id="taddinitialmodalbtn" className="close-btn float-right px-4" > Add</Button>
		</Col>
		<Col lg="6">
		<Button id="tcloseinitialmodalbtn" className="cancel-btn float-left px-4" > Close</Button>
		</Col>
		</Row>
		
	
	</div>
  </div>
</div>
 

	<Col lg="2">	
	<div id="ttoolbar" className="toolbar">
	<div className ="divider">
	<div className="col my-3 p-2">
		<h6 className="text-uppercase text-black ls-1 mb-1 float-left">
			File
		</h6>
	</div>
	<hr className="my-1" />
	</div>
	<button id="topenfilebtn" className="tool"><i className="material-icons" >insert_drive_file</i>Open</button>
	<button id="tsavebtn" color="neutral" className="tool"><i className="material-icons" >get_app</i>Save</button>
	<div className ="divider" id="fieldscolumn">
	<div className="col my-3 p-2">
		<h6 className="text-uppercase text-black ls-1 mb-1 float-left">
			Fields
		</h6>
	</div>
	<hr className="my-1" />
	</div>
	<button id="tsignaturebtn" color="neutral" className="tool"><i className="material-icons" >gesture</i>Signature</button>
	<button id="timagebtn" color="neutral" className="tool"><i className="material-icons" >image</i>Image</button>
	<button id="tdatebtn" color="neutral" className="tool"><i className="material-icons" >today</i>Date</button>
	<button id="tpenbtn" color="neutral" className="tool"><i className="material-icons" >edit</i>Pen</button>
	<button id="ttextbtn" color="neutral" className="tool"><i className=" material-icons" >text_fields</i>Text</button>
	<button id="tcirclebtn" color="neutral" className="tool"><i className="material-icons" >panorama_fish_eye</i>Circle</button>
	<button id="trectanglebtn" color="neutral" className="tool"><i className="material-icons" >crop_din</i>Rectangle</button>
	<div className ="divider">
	<div className="col my-3 p-2">
		<h6 className="text-uppercase text-black ls-1 mb-1 float-left">
			Tools
		</h6>
	</div>
	<hr className="my-1" />
	</div>
	<button id="tselectbtn" color="neutral" className="tool"><i className="material-icons" >pan_tool</i>Select</button>
	<button id="tdeletebtn" color="neutral" className="tool"><i className="material-icons" >delete_forever</i>Delete</button>
	<button id="tclearbtn" color="neutral" className="tool"><i className="material-icons" >clear</i>Clear</button>
	<input id="tfileinput" type="file" accept="application/pdf"></input>
	<input id="timageinput" type="file" accept="image/*"></input>
	
	<Button id="taddobjbtn" className="tool"></Button>
	
	<Button className="color-tool tool" id="selectcolor" style={{backgroundColor: '#000'}}></Button>
	<input type="color" className="color-tool" id="colortool" name="favcolor"></input>
	
	</div>
	</Col>

	<Col lg="8">
		
	 <Row>

	 
	<div id="tcontainer" >
	<div id="tpdf-container" style={{
		height: '550px'
	}}></div>
	</div>
	</Row>
	
	<div>	
	<Row>

	 <Col lg="12">
	<Button id="tgetlinkbtn" className="m-2 float-right px-4" color="primary" type="button">Save</Button>
	 </Col>
	 </Row>
	 </div>
	 </Col>
	 <Col lg="2">
		<div id="trecepientsbar" className="recepientsbar">
		<div className ="divider" id="tcustomfieldscolumn">
		<div className="col my-3 p-2">
		<h6 className="text-uppercase text-black ls-1 mb-1 float-left">
		Custom Fields
		</h6>
		</div>
		<hr className="my-1" />
		</div>
		<button id="tinitialbtn" color="neutral" className="tool"><i className="material-icons" >text_format</i>Initial</button>
		<button id="tnamebtn" color="neutral" className="tool"><i className=" material-icons" >person</i>Name</button>
		<button id="tcompanybtn" color="neutral" className="tool"><i className=" material-icons" >apartment</i>Company</button>
		<button id="ttitlebtn" color="neutral" className="tool"><i className=" material-icons" >work</i>Title</button>
		<div className ="divider" id="recepientscolumn">
		<div className="col my-3 p-2">
		<h6 className="text-uppercase text-black ls-1 mb-1 float-left">
		Recepients
		</h6>
		</div>
		<hr className="my-1" />
		</div>
		<select id="trecepientselect" className="form-control selectpicker form-control-sm" >
		</select>
		 </div>
	 </Col>
	 
	 </Row>	
	</div>
    )
  }

}

export default TemplateAnnotate;