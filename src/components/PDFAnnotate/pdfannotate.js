import React from 'react'
import $ from 'jquery';
import { fabric } from 'fabric';
import * as jsPDF from 'jspdf';
import classnames from "classnames";
import DataVar from '../../variables/data';
//import fabric from 'fabric-webpack'
import "./styles.css";
import "./pdfannotate.css";

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


class PDFAnnotate extends React.Component {
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
var owner = '';
var grabbedcolor = '';
var recepientrgbval = '';
var docname = '';
var action = '';
var signorderval = false;
var dbpeople = [];
var key = '';
modal[0].style.display = "block";

var Email = {
	send: function(a) {
		return new Promise(function(n, e) {
			// eslint-disable-next-line no-unused-expressions
			a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send";
			var t = JSON.stringify(a);
			Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function(e) {
				n(e)
			})
		})
	},
	ajaxPost: function(e, n, t) {
		var a = Email.createCORSRequest("POST", e);
		// eslint-disable-next-line no-unused-expressions
		a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function() {
			var e = a.responseText;
			null != t && t(e)
		}, a.send(n)
	},
	ajax: function(e, n) {
		var t = Email.createCORSRequest("GET", e);
		// eslint-disable-next-line no-unused-expressions
		t.onload = function() {
			var e = t.responseText;
			null != n && n(e)
		}, t.send()
	},
	createCORSRequest: function(e, n) {
		var t = new XMLHttpRequest();
		return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XMLHttpRequest()).open(e, n) : t = null, t
	}
};



var PDFAnnotate = function(container_id, toolbar_id, url, filename, options = {}) {
	
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
				try {
					document.getElementById(inst.container_id).appendChild(canvas);
				} catch (error) {
					
				}
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
				console.log("Mouse up", e);
				//fabricMouseHandler(e, fabricObj);
				try {
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
				} catch (error) {
					
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
							document.getElementById("signature-container").style.visibility = "visible";
							document.getElementById("signature-container").style.height = "100%";
							document.getElementById("tabcontent").style.display = "block";
							document.getElementById("image-container").style.display = "block";
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
		
		try {
			var addobjbtn = document.getElementById('addobjbtn');
			addobjbtn.addEventListener('click', function(event) {
			pdf.AddObj();
		});
		addobjbtn.click();
		} catch (error) {
			
		}
		
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
	
}


PDFAnnotate.prototype.AddObj = function () {

try {
if(type == 'home'){
	modal[0].style.display = "none";
}
else{
	try {
		if (fileid == ''){
			console.log('no file id found');
			modal[0].style.display = "none";
		}
		else{
			var inst = this;
			console.log('file id found');
			axios.post('/getdocdata', {
				DocumentID: fileid
				})
				.then(function (response) {
				console.log(response);
				if(response.data.Status === 'doc data done'){
				  var DocumentData = response.data.Data;
				  $.each(inst.fabricObjects, function (index, fabricObj) {
					console.log(index);

						  fabricObj.loadFromJSON(DocumentData[index], function () {
							fabricObj.renderAll();
							fabricObj.trigger("mouse:up", {
								pageX: 700,
								pageY: 400
							});
							fabricObj.getObjects().forEach(function (targ) {
								console.log(targ);
								targ.selectable = false;
								targ.hasControls = false;
															
							});
							modal[0].style.display = "none";
						})
				});
				}
				})
				.catch(function (error) {
				console.log(error);
				modal[0].style.display = "none";
				});

			
		}
	} catch (error) {
		
	}
	
}
	
} catch (error) {
	modal[0].style.display = "none";
}

}




PDFAnnotate.prototype.enableSelector = function () {
	var inst = this;
	inst.active_tool = 0;
	if (inst.fabricObjects.length > 0) {
	    $.each(inst.fabricObjects, function (index, fabricObj) {
	        fabricObj.isDrawingMode = false;
	    });
	}
}

PDFAnnotate.prototype.enablePencil = function () {
	var inst = this;
	inst.active_tool = 1;
	if (inst.fabricObjects.length > 0) {
	    $.each(inst.fabricObjects, function (index, fabricObj) {
	        fabricObj.isDrawingMode = true;
	    });
	}
}

PDFAnnotate.prototype.enableAddText = function (text, recepientemail, recepientcolor) {
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

PDFAnnotate.prototype.enableImage = function (url, recepientemail, recepientcolor) {
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


PDFAnnotate.prototype.enableRectangle = function () {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	inst.active_tool = 5;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}
}

PDFAnnotate.prototype.enableCircle= function () {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	inst.active_tool = 6;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}
}

PDFAnnotate.prototype.deleteSelectedObject = function () {
	var inst = this;
	var activeObject = inst.fabricObjects[inst.active_canvas].getActiveObject();
	if (activeObject)
	{
	     inst.fabricObjects[inst.active_canvas].remove(activeObject);
	}
}



PDFAnnotate.prototype.ZoomIn = function (){
var inst = this;

//jsonData =  inst.fabricObjects.toJSON();

var container = document.getElementById(inst.container_id);
var scaleX = container.getBoundingClientRect().width / container.offsetWidth;
	console.log(scaleX)
	scaleX = scaleX+0.1;
	container.style.transform = "scale("+ scaleX +")";

}

PDFAnnotate.prototype.ZoomOut = function (){
var inst = this;
var container = document.getElementById(inst.container_id);
var scaleX = container.getBoundingClientRect().width / container.offsetWidth;
	console.log(scaleX)
	scaleX = scaleX-0.1;
	container.style.transform = "scale("+ scaleX +")";

	
}


PDFAnnotate.prototype.savePdf = function () {
	
	var inst = this;
	var doc = new jsPDF();
	$.each(inst.fabricObjects, function (index, fabricObj) {
	    if (index != 0) {
	        doc.addPage();
	        doc.setPage(index + 1);
	    }
	    doc.addImage(fabricObj.toDataURL(), 'png', 0, 0);
	});
	doc.save('pappayasign_'+inst.filename+'');
	modal[1].style.display = "none";
}

PDFAnnotate.prototype.checkallupdated = function () {
	
	var inst = this;
	var count = 0;
	if(useridother==""){
		pdf.savetoCloudPdf();
	}
	else if(userid==useridother){
		pdf.savetoCloudPdf();
	}
	else if(userid!=useridother){
	$.each(inst.fabricObjects, function (index, fabricObj) {
	    fabricObj.getObjects().forEach(function (targ) {
			console.log(targ);
			targ.selectable = false;
			targ.hasControls = false;
			if (targ.backgroundColor === recepientrgbval){
					count = count + 1;
					console.log(count);
			}
			
		});
	});
	if(count === 0){
		pdf.savetoCloudPdf();
	}
	else{
		alert('Please add all details to continue');
		modal[1].style.display = "none";
	}
	
	}

}





PDFAnnotate.prototype.savetoCloudPdf = function () {
	
	var inst = this;

	var today = new Date().toLocaleString().replace(",","");
	console.log('action:'+action);

	if(action === '' || action === 'correct' || typeof action === 'undefined'){

	if(useridother==""){
		

	console.log('fileid:'+fileid);
    if (fileid ===''){
		filename = randomString(13);
		console.log('filename:'+filename);
	}
	else{
		filename = fileid;

	}
	  var storageRef = firebase.storage().ref(userid + '/Documents/'+filename+'.pdf');
	var task = storageRef.put(DataVar.DataURI);
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

		axios.post('/adddocumentdata', {
			DocumentName: inst.filename,
			DocumentID: filename,
			OwnerEmail: email,
			DateCreated: today,
			DateStatus: today,
			DateSent: '',
			Owner: userid,
			Status: 'Draft',
			SignOrder: DataVar.SignOrder,
			Data: dataarray,
			Reciever: []

		  })
		  .then(function (response) {
			console.log(response);
			if(response.data === 'insert done' || response.data === 'update done'){
				document.getElementById("emailbtncontainer").style.display = "block";
				url = 'https://pappayasign.herokuapp.com/#/admin/sign?id=' + encodeURIComponent(filename) + '&type=db&u=' + userid;
				modal[1].style.display = "none";
			}
		  })
		  .catch(function (error) {
			console.log(error);
			modal[1].style.display = "none";
		  });
  
		  }); 
		
	}
	

	else if(userid==useridother){
		var jsonData = [];
		var dataarray = [];

		$.each(inst.fabricObjects, function (index, fabricObj) {
			//console.log(fabricObj.toJSON());
			jsonData[index] = fabricObj.toJSON();
			console.log(jsonData[index]);
			console.log(JSON.stringify(jsonData[index]));
			dataarray.push(JSON.stringify(jsonData[index]));
			
			
		})
		axios.post('/updatedocumentdata', {
			DocumentID: filename,
			DateStatus: today,
			Data: dataarray,

		  })
		  .then(function (response) {
			console.log(response);
			if(response.data === 'insert done' || response.data === 'update done'){
				document.getElementById("emailbtncontainer").style.display = "block";
				url = 'https://pappayasign.herokuapp.com/#/admin/sign?id=' + encodeURIComponent(filename) + '&type=db&u=' + userid;
				modal[1].style.display = "none";
			}
		  })
		  .catch(function (error) {
			console.log(error);
			modal[1].style.display = "none";
		  });
	}

	else if(userid!=useridother){
		var completedcount = 0;
		var recievercount = 0;
		var totalcount = 0;
		var jsonData = [];
		var dataarray = [];

		$.each(inst.fabricObjects, function (index, fabricObj) {
			//console.log(fabricObj.toJSON());
			jsonData[index] = fabricObj.toJSON();
			console.log(jsonData[index]);
			console.log(JSON.stringify(jsonData[index]));
			dataarray.push(JSON.stringify(jsonData[index]));
			
			
		})

		axios.post('/updatedocumentdata', {
			DocumentID: filename,
			DateStatus: today,
			Data: dataarray,

		  })
		  .then(function (response) {
			console.log(response);
			if(response.data === 'insert done' || response.data === 'update done'){

				
				var recepientkey = '';
				completedcount = 0;
				recievercount = 0;


				axios.post('/getReciever', {
					DocumentID: filename
					})
					.then(function (response) {
					console.log(response);
					if(response.data.Status === 'got recievers'){
					var recievers = response.data.Reciever;
					var status = response.data.DocStatus;
					
					
					recievers.forEach(function(item, index) {
						recievercount = recievercount + 1;
						if(recievers[index].RecepientStatus === 'Completed'){
							completedcount = completedcount + 1;
						}
						if(recievers[index].RecepientEmail === email){
							var recepient_index = index;
							recepientkey = index;
							console.log(recepient_index);

							recievers[index].RecepientStatus = 'Completed';
							recievers[index].RecepientDateStatus = today;

							axios.post('/updaterecieverdata', {
								Reciever: recievers,
								DocumentID: filename
								})
								.then(function (response) {
								console.log(response);
								if(response.data === 'update reciever done'){
									
									axios.post('/getRequests', {
										UserID: userid
										})
										.then(function (response) {
										console.log(response);
										if(response.data.Status === 'got request'){
										var request = response.data.Request;
										var status = response.data.DocStatus;
									
										
										request.forEach(function(item, index) {
											if(request[index].DocumentID === filename){
												var recepient_index = index;
												console.log(recepient_index);
												request[index].RecepientStatus = 'Completed';
												request[index].RecepientDateStatus = today;
		
												axios.post('/updaterequestdata', {
													UserID: userid,
													Request: request
													})
													.then(function (response) {
													console.log(response);
													
													})
													.catch(function (error) {
													console.log(error);
													
													});
											}
											
										});
										}
										})
										.catch(function (error) {
										console.log(error);
										
										});
								}
								
								})
								.catch(function (error) {
								console.log(error);
								
								});


								console.log('Completed Log: '+completedcount);
								console.log('Reciever Length: '+ recievercount);

								if(completedcount == recievercount){
									var doc = new jsPDF();
									$.each(inst.fabricObjects, function (index, fabricObj) {
										if (index != 0) {
											doc.addPage();
											doc.setPage(index + 1);
										}
										doc.addImage(fabricObj.toDataURL(), 'png', 0, 0);
									});
									var dataURI = doc.output('datauristring');
									console.log(dataURI);
									
									
									dbpeople.forEach(function(item, index) {
										var recepientName = dbpeople[index].name;
										var recepientEmail = dbpeople[index].email;
										var recepientOption = dbpeople[index].option;
										var recepientColor = colorArray[index];
										console.log(recepientEmail + ',' + recepientName);
									
									axios.post('/sendmailattachments', {
											to: recepientEmail,
											body: '<div><p>Hello '+recepientName+', Please find the signed document in the attachment.</p></div>',
											subject: "PappayaSign: Sign Request",
											attachments: {   // utf-8 string as an attachment
												filename: 'PappayaSign_Completed.pdf',
												path: dataURI 
											}
											
										})
										.then(function (response) {
											console.log(response);
											console.log('doc sent to next user');
											})
										.catch(function (error) {
											
										});

								});
								axios.post('/updatedocumentstatus', {
									DocumentID: filename,
									Status: 'Completed'
						
								})
								.then(function (response) {
									console.log(response);
									if(response.data === 'insert done' || response.data === 'update done'){
										window.location.hash = "#/admin/sendsuccess";
									}
								})
								.catch(function (error) {
									console.log(error);
									modal[1].style.display = "none";
								});

									
									}

							


								if(signorderval === true){
							
									var nextuser = parseInt(recepientkey) + 1;
									var currentuser = parseInt(recepientkey);
									var nextuseremail = recievers[nextuser].RecepientEmail;
									var nextusername =  recievers[nextuser].RecepientName;
									console.log(nextuser);
									if(currentuser === totalcount){
										console.log('no additional users left');
									}
									else if(currentuser < totalcount){
										try {
											var nextuserurl = 'https://pappayasign.herokuapp.com/#/admin/sign?id='+filename+'&type=db&u='+useridother+'&key='+nextuser+'';
									

										axios.post('/getrequestuser', {
											UserEmail: nextuseremail
											})
											.then(function (response) {
											console.log(response);
											if(response.data.Status === 'user found'){
											axios.post('/postrequest', {
												UserID: response.data.UserID,
												DocumentName: docname,
												DocumentID: filename,
												From: useridother,
												FromEmail: email,
												RecepientStatus: 'Need to Sign',
												RecepientDateStatus: today
									
												})
												.then(function (response) {
												console.log(response);
												if(response.data === 'user found'){
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
											
											});
										
										axios.post('/sendmail', {
											to: nextuseremail,
											body: `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign.</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, `+nextusername+`</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. </p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="`+nextuserurl+`" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`,
											subject: "PappayaSign: Sign Request"
											
										})
										.then(function (response) {
											console.log(response);
											window.location.hash = "#/admin/sendsuccess";
											console.log('doc sent to next user');
											})
										.catch(function (error) {
											
										});

								} catch (error) {
									
								}
									}

							}


						}
						
					});

					
					}
					modal[1].style.display = "none";
					window.location.hash = "#/admin/sendsuccess";
					})
					.catch(function (error) {
					console.log(error);
					
					});

			}
		  })
		  .catch(function (error) {
			console.log(error);
			modal[1].style.display = "none";
		  });


			

				   
		
	}
}
else if(action === 'create'){
		filename = randomString(13);
		console.log('filename:'+filename);
	
	  var storageRef = firebase.storage().ref(userid + '/Documents/'+filename+'.pdf');
	var task = storageRef.put(DataVar.DataURI);
	task.on('state_changed', function progress(snapshot) {
	  console.log('done')
	  
	  url = "#/admin/sign?id=" + encodeURIComponent(filename);
	  console.log(url)
	}, function error(err) {
  
		console.log(err)
	},function complete() {
		console.log('complete')
		
		var jsonData = [];
		$.each(inst.fabricObjects, function (index, fabricObj) {
			//console.log(fabricObj.toJSON());
			jsonData[index] = fabricObj.toJSON();
			console.log(jsonData[index]);
			console.log(JSON.stringify(jsonData[index]));

			firebase.database().ref(userid + '/Documents/'+filename+'/Data/').child(index).set(JSON.stringify(jsonData[index]));
			modal[1].style.display = "none";
			
		})
		document.getElementById("emailbtncontainer").style.display = "block";
		url = 'https://pappayasign.herokuapp.com/#/admin/sign?id=' + encodeURIComponent(filename) + '&type=db&u=' + userid;
		
		firebase.database().ref(userid + '/Documents/'+filename).child('OwnerEmail').set(email);
		firebase.database().ref(userid + '/Documents/'+filename).child('Status').set('Draft');
		firebase.database().ref(userid + '/Documents/'+filename).child('DateCreated').set(today);
		firebase.database().ref(userid + '/Documents/'+filename).child('DateStatus').set(today);
		firebase.database().ref(userid + '/Documents/'+filename).child('DocumentName').set(inst.filename);
		firebase.database().ref(userid +  '/Documents/'+filename).child('Owner').set(userid);
		
	  
	});
	 
}	
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


PDFAnnotate.prototype.setBrushSize = function (size) {
	var inst = this;
	$.each(inst.fabricObjects, function (index, fabricObj) {
	    fabricObj.freeDrawingBrush.width = size;
	});
}

PDFAnnotate.prototype.setColor = function (color) {
	var inst = this;
	inst.color = color;
	$.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.freeDrawingBrush.color = color;
    });
}

PDFAnnotate.prototype.setBorderColor = function (color) {
	var inst = this;
	inst.borderColor = color;
}

PDFAnnotate.prototype.setFontSize = function (size) {
	this.font_size = size;
}

PDFAnnotate.prototype.setBorderSize = function (size) {
	this.borderSize = size;
}

PDFAnnotate.prototype.clearActivePage = function () {
	var inst = this;
	$.each(inst.fabricObjects, function (index, fabricObj) {
		var bg = fabricObj.backgroundImage;
			fabricObj.clear();
			fabricObj.setBackgroundImage(bg, fabricObj.renderAll.bind(fabricObj));
	})

}

PDFAnnotate.prototype.Reload = function () {
	var inst = this;
	$.each(inst.fabricObjects, function (index, fabricObj) {
		fabricObj.renderAll();
	})
	console.log('reloaded');

}

PDFAnnotate.prototype.serializePdf = function() {
	var inst = this;
	return JSON.stringify(inst.fabricObjects, null, 4);
}



PDFAnnotate.prototype.loadFromJSON = function(jsonData) {
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



document.getElementById('fileinput').addEventListener('input', function(input) {
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
		pdf = new PDFAnnotate('pdf-container', 'toolbar', url, input.srcElement.files[0].name); 
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


document.getElementById('imageinput').addEventListener('input', function(input) {
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

 

document.getElementById("zoominbtn").addEventListener("click", function(){
	pdf.ZoomIn();
	
}, false);

document.getElementById("zoomoutbtn").addEventListener("click", function(){
	pdf.ZoomOut();
	
}, false);

var clearbtn = document.getElementById('clearbtn');
clearbtn.addEventListener('click', function(event) {
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

var deletebtn = document.getElementById('deletebtn');
deletebtn.addEventListener('click', function(event) {
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

var savebtn = document.getElementById('savebtn');
savebtn.addEventListener('click', function(event) {
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

var selectbtn = document.getElementById('selectbtn');
selectbtn.addEventListener('click', function(event) {
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

var rectanglebtn = document.getElementById('rectanglebtn');
rectanglebtn.addEventListener('click', function(event) {
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

var circlebtn = document.getElementById('circlebtn');
circlebtn.addEventListener('click', function(event) {
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


var textbtn = document.getElementById('textbtn');
textbtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('recepientselect');
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


var namebtn = document.getElementById('namebtn');
namebtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('recepientselect');
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

var companybtn = document.getElementById('companybtn');
companybtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('recepientselect');
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


var titlebtn = document.getElementById('titlebtn');
titlebtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('recepientselect');
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


var initialbtn = document.getElementById('initialbtn');
initialbtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	modal[5].style.display = "block";
	var select = document.getElementById('recepientselect');
	recepientemail = select.options[select.selectedIndex].value;
	recepientcolor = select.options[select.selectedIndex].style.backgroundColor;
});

var datebtn = document.getElementById('datebtn');
datebtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('recepientselect');
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

var penbtn = document.getElementById('penbtn');
penbtn.addEventListener('click', function(event) {
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


var signaturebtn = document.getElementById('signaturebtn');
signaturebtn.addEventListener('click', function(event) {
    var element = ($(event.target).hasClass('tool')) ? $(event.target) : $(event.target).parents('.tool').first();
    $('.tool.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
	$(element).addClass('active');
    const icon = this.querySelector('i');
	icon.classList.add('icon-color');
	var select = document.getElementById('recepientselect');
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

var openfilebtn = document.getElementById('openfilebtn');
openfilebtn.addEventListener('click', function(event) {
	$('.icon-color').removeClass('icon-color');
    $('.tool.active').removeClass('active');
    document.getElementById("fileinput").click();
});


var imagebtn = document.getElementById('imagebtn');
imagebtn.addEventListener('click', function(event) {
	$('.icon-color').removeClass('icon-color');
    $('.tool.active').removeClass('active');
    document.getElementById("imageinput").click();
});

function clearPDF() {
    const myNode = document.getElementById("pdf-container");
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

$('.color-tool').click(function () {
$('.color-tool.active').removeClass('active');
$(this).addClass('active');
$('.icon-color').removeClass('icon-color');
var color = $(this).get(0).style.backgroundColor;
try {
	pdf.setColor(color);
} catch (error) {
	alert('Please add a document first!');
}

});

var colortool = document.getElementById('colortool');
colortool.addEventListener('input', function(event) {
    console.log('color');
    
    var colord = colortool.value;
     var selectcolor = document.getElementById('selectcolor');
    selectcolor.style.backgroundColor  = colord;
    console.log(colord);
    pdf.setColor(colord);
});

var selectcolor = document.getElementById('selectcolor');
selectcolor.addEventListener('click', function(event) {
	$('.icon-color').removeClass('icon-color');
    document.getElementById("colortool").click();
});

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
	email = getCookie('useremail');
	console.log(userid);
	console.log(email);

	
		var optiondefault = document.createElement('option');
		optiondefault.value = email;
		optiondefault.style.backgroundColor = '#BDBDBD';
		optiondefault.innerHTML='Default(Me)';
		$( "#recepientselect" ).append(optiondefault);

			try {
			var storageRef = firebase.storage().ref();
			storageRef.child(userid + '/Signature/signature.png').getDownloadURL().then(function(url){
			// `url` is the download URL for 'images/stars.jpg'

			// This can be downloaded directly:
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.onload = function(event) {
			var blob = xhr.response;
			};
			xhr.open('GET', url);
			xhr.send();

			// Or inserted into an <img> element:
			console.log(url)
			var img = document.getElementById('imgc');
			img.setAttribute('crossOrigin', 'anonymous');
			img.src = url;


			}).catch(function(error) {
			// Handle any errors
			});
			} catch (error) {
			
			}


			try {
			var mainurl = document.location.hash,
			params = mainurl.split('?')[1].split('&'),
			data = {}, tmp;
			for (var i = 0, l = params.length; i < l; i++) {
			tmp = params[i].split('=');
			data[tmp[0]] = tmp[1];
			}
			filename = data.id;
			type = data.type;
			useridother = data.u;
			try {
			action = data.action;
			} catch (error) {
			console.log('no action');
			}
			console.log(type);
			console.log(userid);
			console.log(useridother);
			fileid = data.id;
			} catch (error) {

			}



			if(filename=='' || useridother == ''){
			console.log('No file in url');
			modal[0].style.display = "none";
			owner = 'admin';
			try {
			if(DataVar.OnlySigner == true){
				document.getElementById('getlinkbtn').style.display = 'none';
			}
			var people=[];
			people = DataVar.RecepientArray;
			people.forEach(function(item, index) {
			if(people[index].option == 'Needs to Sign'){
				var option = document.createElement('option');
				option.value = people[index].email;
				option.style.backgroundColor = colorArray[index];
				option.innerHTML=''+people[index].name+'';
				$( "#recepientselect" ).append(option);
			}
			
			});
			} catch (error) {
			
			}

			document.getElementById('recieverfinishbtn').style.display = 'none';
			document.getElementById('moreoptions').style.display = 'none';
			try {
			if(DataVar.DataPath != ''){
				console.log(DataVar.DataPath);
				pdf = new PDFAnnotate('pdf-container', 'toolbar', DataVar.DataPath, DataVar.DocName, {
					onPageUpdated: (page, oldData, newData) => {
						//modal[0].style.display = "block";
						console.log(page, oldData, newData);
						
					}
				
				});
			}
			else{
				console.log('No Data File Found');
				window.location.hash = "#/admin/index";
			}
			
			} catch (error) {
			console.log(error);
			}
			}
			else{
			if(userid!=useridother){
			try {
				document.getElementById('openfilebtn').style.display = 'none';
			document.getElementById('penbtn').style.display = 'none';
			document.getElementById('textbtn').style.display = 'none';
			document.getElementById('signaturebtn').style.display = 'none';
			document.getElementById('imagebtn').style.display = 'none';
			document.getElementById('circlebtn').style.display = 'none';
			document.getElementById('rectanglebtn').style.display = 'none';
			document.getElementById('deletebtn').style.display = 'none';
			document.getElementById('selectcolor').style.display = 'none';
			document.getElementById('getlinkbtn').style.display = 'none';
			document.getElementById('clearbtn').style.display = 'none';
			document.getElementById('datebtn').style.display = 'none';
			document.getElementById('namebtn').style.display = 'none';
			document.getElementById('titlebtn').style.display = 'none';
			document.getElementById('companybtn').style.display = 'none';
			document.getElementById('initialbtn').style.display = 'none';
			document.getElementById('recepientselect').style.display = 'none';
			document.getElementById('fieldscolumn').style.display = 'none';
			document.getElementById('recepientscolumn').style.display = 'none';
			} catch (error) {
				
			}
			

			var remail = '';
			

			axios.post('/getReciever', {
				DocumentID: fileid
				})
				.then(function (response) {
				console.log(response);
				console.log(email);
				if(response.data.Status === 'got recievers'){
				  var recievers = response.data.Reciever;
				  var status = response.data.DocStatus;
				  if(status === 'Void' || status === 'Deleted' || status === 'Correcting'){
					modal[0].style.display = "none";
					window.location.hash='#/admin/index';
				}
				  recievers.forEach(function(item, index) {
					  console.log(item);
					dbpeople.push({name: recievers[index].RecepientName, email: recievers[index].RecepientEmail, option:recievers[index].RecepientOption});
					if(item.RecepientEmail === email){
						grabbedcolor = item.RecepientColor;
						remail = item.RecepientEmail;
						console.log(grabbedcolor);
						function hexToRgb(hex) {
						var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
						return result ? {
							r: parseInt(result[1], 16),
							g: parseInt(result[2], 16),
							b: parseInt(result[3], 16)
						} : null;
						}

						var rgbval = hexToRgb(grabbedcolor).r + ', ' + hexToRgb(grabbedcolor).g + ', ' + hexToRgb(grabbedcolor).b;
						recepientrgbval = 'rgb('+rgbval+')';
					}
					  
				  });
				}
				})
				.catch(function (error) {
				console.log(error);
				
				});


			if(action === 'correct'){
			try {
			action = 'create';
			var people=[];
			people = DataVar.RecepientArray;
			people.forEach(function(item, index) {
			if(people[index].option == 'Needs to Sign'){
				var option = document.createElement('option');
				option.value = people[index].email;
				option.style.backgroundColor = colorArray[index];
				option.innerHTML=''+people[index].name+'';
				$( "#recepientselect" ).append(option);
			}
			
			});
			} catch (error) {
			
			}
			}

			else if(action === 'create' ){
			try {
			action = 'create';
			document.getElementById('recieverfinishbtn').style.display = 'none';
			document.getElementById('recieverfinishlaterbtn').style.display = 'none';
			document.getElementById('recieverdeclinebtn').style.display = 'none';
			document.getElementById('openfilebtn').style.display = 'none';
			document.getElementById('textbtn').style.display = 'block';
			document.getElementById('signaturebtn').style.display = 'block';
			document.getElementById('imagebtn').style.display = 'block';
			document.getElementById('deletebtn').style.display = 'block';
			document.getElementById('getlinkbtn').style.display = 'block';
			document.getElementById('clearbtn').style.display = 'block';
			document.getElementById('datebtn').style.display = 'block';
			document.getElementById('namebtn').style.display = 'block';
			document.getElementById('titlebtn').style.display = 'block';
			document.getElementById('companybtn').style.display = 'block';
			document.getElementById('initialbtn').style.display = 'block';
			document.getElementById('recepientselect').style.display = 'block';
			document.getElementById('fieldscolumn').style.display = 'block';
			document.getElementById('recepientscolumn').style.display = 'block';
			var people=[];
			people = DataVar.RecepientArray;
			people.forEach(function(item, index) {
			if(people[index].option == 'Needs to Sign'){
				var option = document.createElement('option');
				option.value = people[index].email;
				option.style.backgroundColor = colorArray[index];
				option.innerHTML=''+people[index].name+'';
				$( "#recepientselect" ).append(option);
			}
			
			});
			} catch (error) {
			
			}
			}

			}
			else{
			document.getElementById('recieverfinishbtn').style.display = 'none';
			document.getElementById('moreoptions').style.display = 'none';
			owner = 'admin';


			axios.post('/getReciever', {
				DocumentID: fileid
				})
				.then(function (response) {
				console.log(response);
				if(response.data.Status === 'got recievers'){
				  var recievers = response.data.Reciever;
				  var status = response.data.DocStatus;
				  if(status === 'Void'){
					modal[0].style.display = "none";
					window.location.hash='#/admin/index';
				}
				}
				})
				.catch(function (error) {
				console.log(error);
				
				});


						if(action === 'correct'){
							try {
								action = 'correct';
								var people=[];
								people = DataVar.RecepientArray;
								userid = useridother;
								people.forEach(function(item, index) {
								if(people[index].option == 'Needs to Sign'){
									var option = document.createElement('option');
									option.value = people[index].email;
									option.style.backgroundColor = colorArray[index];
									option.innerHTML=''+people[index].name+'';
									$( "#recepientselect" ).append(option);
								}
								
							});
							} catch (error) {
								
							}
						}
					
						else if(action === 'create' ){
							try {
								action = 'create';
								var people=[];
								people = DataVar.RecepientArray;
								userid = useridother;
								people.forEach(function(item, index) {
								if(people[index].option == 'Needs to Sign'){
									var option = document.createElement('option');
									option.value = people[index].email;
									option.style.backgroundColor = colorArray[index];
									option.innerHTML=''+people[index].name+'';
									$( "#recepientselect" ).append(option);
								}
								
							});
							} catch (error) {
								
							}
						}
			
			
			}

			var storageRef = firebase.storage().ref();
			storageRef.child(useridother + '/Documents/'+filename+'.pdf').getDownloadURL().then(function(url)     {
			// `url` is the download URL for 'images/stars.jpg'

			// This can be downloaded directly:
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.onload = function(event) {
			var blob = xhr.response;
			};
			xhr.open('GET', url);
			xhr.send();

			// Or inserted into an <img> element:
				console.log(url)
				modal[0].style.display = "block";
				pdf = new PDFAnnotate('pdf-container', 'toolbar', url, 'defaultfile', {
				onPageUpdated: (page, oldData, newData) => {
					//modal[0].style.display = "block";
					console.log(page, oldData, newData);
					
				}
			
			});
			
			}).catch(function(error) {
				modal[0].style.display = "none";
			// Handle any errors
			});


			}
	
	

	
} else {
	// no user
	//window.location.hash = "#/auth/login";
	modal[0].style.display = "none";
	modal[4].style.display = "block";
	document.getElementById('getlinkbtn').style.display = 'none';

}

	
	}
	catch(err){
	console.log('no data');
	modal[0].style.display = "none";
	
	
	}


	var startnouserbtn = document.getElementById('startnouserbtn');
	startnouserbtn.addEventListener('click', function(event) {
	if (document.getElementById('signtermscheck').checked) {
		modal[4].style.display = "none";
		modal[0].style.display = "block";

		userid = 'none';
			  
			  var optiondefault = document.createElement('option');
			  optiondefault.value = email;
			  optiondefault.style.backgroundColor = '#BDBDBD';
				optiondefault.innerHTML='Default(Me)';
				$( "#recepientselect" ).append(optiondefault);

	try {
		var mainurl = document.location.hash,
	params = mainurl.split('?')[1].split('&'),
	data = {}, tmp;
	    for (var i = 0, l = params.length; i < l; i++) {
		 tmp = params[i].split('=');
		 data[tmp[0]] = tmp[1];
	    }
	 filename = data.id;
	 fileid= data.id;
	 type = data.type;
	 useridother = data.u;
	 console.log(type);
	 console.log(userid);
	 console.log(useridother);
	 fileid = data.id;
	 key = data.key;
	 console.log('key:'+key);
	} catch (error) {
		
	}
	


	 if(filename=='' || useridother == ''){
		console.log('No file in url');
		modal[0].style.display = "none";
		owner = 'admin';
		try {
			var people=[];
			people = DataVar.RecepientArray;
			people.forEach(function(item, index) {
			if(people[index].option == 'Needs to Sign'){
				var option = document.createElement('option');
				option.value = people[index].email;
				option.style.backgroundColor = colorArray[index];
				option.innerHTML=''+people[index].name+'';
				$( "#recepientselect" ).append(option);
			}
			
		});
		} catch (error) {
			
		}
		
		document.getElementById('recieverfinishbtn').style.display = 'none';
		document.getElementById('moreoptions').style.display = 'none';
		try {
			if(DataVar.DataPath != ''){
				console.log(DataVar.DataPath);
				pdf = new PDFAnnotate('pdf-container', 'toolbar', DataVar.DataPath, DataVar.DocName, {
					onPageUpdated: (page, oldData, newData) => {
						//modal[0].style.display = "block";
						console.log(page, oldData, newData);
						
					}
				
				});
			}
			else{
				console.log('No Data File Found');
			}
			
	} catch (error) {
		console.log(error);
	}
	}
	else{
		if(userid!=useridother){
			try {
				document.getElementById('openfilebtn').style.display = 'none';
			document.getElementById('penbtn').style.display = 'none';
			document.getElementById('textbtn').style.display = 'none';
			document.getElementById('signaturebtn').style.display = 'none';
			document.getElementById('imagebtn').style.display = 'none';
			document.getElementById('circlebtn').style.display = 'none';
			document.getElementById('rectanglebtn').style.display = 'none';
			document.getElementById('deletebtn').style.display = 'none';
			document.getElementById('selectcolor').style.display = 'none';
			document.getElementById('getlinkbtn').style.display = 'none';
			document.getElementById('clearbtn').style.display = 'none';
			document.getElementById('datebtn').style.display = 'none';
			document.getElementById('namebtn').style.display = 'none';
			document.getElementById('titlebtn').style.display = 'none';
			document.getElementById('companybtn').style.display = 'none';
			document.getElementById('initialbtn').style.display = 'none';
			document.getElementById('recepientselect').style.display = 'none';
			document.getElementById('fieldscolumn').style.display = 'none';
			document.getElementById('recepientscolumn').style.display = 'none';


			if(key != ''){
				axios.post('/getReciever', {
					DocumentID: fileid
					})
					.then(function (response) {
					console.log(response);
					if(response.data.Status === 'got recievers'){
					  var recievers = response.data.Reciever;
					  var status = response.data.DocStatus;
					  if(status === 'Void' || status === 'Deleted' || status === 'Correcting'){
						modal[0].style.display = "none";
						window.location.hash='#/admin/index';
					}
					  recievers.forEach(function(item, index) {
						dbpeople.push({name: recievers[index].RecepientName, email: recievers[index].RecepientEmail, option:recievers[index].RecepientOption});
												  
					  });
					  grabbedcolor = recievers[key].RecepientColor;
					remail = recievers[key].RecepientEmail;
					email = recievers[key].RecepientEmail;
					console.log(grabbedcolor);
					console.log(remail);
					function hexToRgb(hex) {
					var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
					return result ? {
						r: parseInt(result[1], 16),
						g: parseInt(result[2], 16),
						b: parseInt(result[3], 16)
					} : null;
					}

					var rgbval = hexToRgb(grabbedcolor).r + ', ' + hexToRgb(grabbedcolor).g + ', ' + hexToRgb(grabbedcolor).b;
					recepientrgbval = 'rgb('+rgbval+')';
					}
					})
					.catch(function (error) {
					console.log(error);
					
					});
			}
			

	  
			} catch (error) {
				
			}
			

		}
		else{
			try {
				document.getElementById('recieverfinishbtn').style.display = 'none';
				document.getElementById('moreoptions').style.display = 'none';
			} catch (error) {
				
			}
			
			owner = 'admin';

			axios.post('/getReciever', {
				DocumentID: fileid
				})
				.then(function (response) {
				console.log(response);
				if(response.data.Status === 'got recievers'){
				  var recievers = response.data.Reciever;
				  var status = response.data.DocStatus;
				  if(status === 'Void'){
					modal[0].style.display = "none";
					window.location.hash='#/admin/index';
				}
				}
				})
				.catch(function (error) {
				console.log(error);
				
				});
			
		}
		
		var storageRef = firebase.storage().ref();
		storageRef.child(useridother + '/Documents/'+filename+'.pdf').getDownloadURL().then(function(url)     {
		    // `url` is the download URL for 'images/stars.jpg'

		   // This can be downloaded directly:
		   var xhr = new XMLHttpRequest();
		    xhr.responseType = 'blob';
		    xhr.onload = function(event) {
		    var blob = xhr.response;
		    };
		    xhr.open('GET', url);
		    xhr.send();

		     // Or inserted into an <img> element:
			  console.log(url)
			  modal[0].style.display = "block";
			  pdf = new PDFAnnotate('pdf-container', 'toolbar', url, 'defaultfile', {
				onPageUpdated: (page, oldData, newData) => {
					//modal[0].style.display = "block";
					console.log(page, oldData, newData);
					
				}
			
			});
			
		     }).catch(function(error) {
				modal[0].style.display = "none";
		     // Handle any errors
		});

		
	}
	}
	else{          
		alert('Please agree to our terms and conditions to continue');
	}
	

});
	
	 


window.onclick = function(e){
  if(e.target == modal[0]){
	modal[2].style.display = "none";
	modal[3].style.display = "none";
  }
}

  var getlinkbtn = document.getElementById('getlinkbtn');
  getlinkbtn.addEventListener('click', function(event) {
	try {
		modal[1].style.display = "block";
		pdf.savetoCloudPdf()
	} catch (error) {
		alert('There are no changes to save');
	}

});

  var recieverfinishbtn = document.getElementById('recieverfinishbtn');
  recieverfinishbtn.addEventListener('click', function(event) {

		modal[1].style.display = "block";
		pdf.checkallupdated();
		

});

var recieverfinishlaterbtn = document.getElementById('recieverfinishlaterbtn');
recieverfinishlaterbtn.addEventListener('click', function(event) {

	window.location.hash = "#/admin/manage";
	  

});

var recieverdeclinebtn = document.getElementById('recieverdeclinebtn');
recieverdeclinebtn.addEventListener('click', function(event) {

	firebase.database().ref(useridother+ '/Documents/'+filename+'/').child('Status').set('Declined');
	window.location.hash = "#/admin/index";

});


var sendemail = document.getElementById('sendemailbtn');
sendemail.addEventListener('click', function(event) {
	window.location.hash = '#/admin/review?id='+filename+'';
});


var addinitialmodalbtn = document.getElementById('addinitialmodalbtn');
addinitialmodalbtn.addEventListener('click', function(event) {
	//modal[3].style.display = "block";
	var initialval = document.getElementById('addinitialval').value;
	if(initialval == ''){
		alert('Please enter your initials');
	}
	else{
		try {
			pdf.enableAddText(initialval, recepientemail, recepientcolor);
			modal[5].style.display = "none";
		} catch (error) {
			modal[5].style.display = "none";
			alert('Please add a document first!');
			$('.tool-button.active').removeClass('active');
		$('.icon-color').removeClass('icon-color');
		}
	}
	
	
});

var closeinitialmodalbtn = document.getElementById('closeinitialmodalbtn');
closeinitialmodalbtn.addEventListener('click', function(event) {
	modal[5].style.display = "block";

});




var Point = (function () {
	function Point(x, y, time) {
		this.x = x;
		this.y = y;
		this.time = time || Date.now();
	}
	Point.prototype.distanceTo = function (start) {
		return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
	};
	Point.prototype.equals = function (other) {
		return this.x === other.x && this.y === other.y && this.time === other.time;
	};
	Point.prototype.velocityFrom = function (start) {
		return this.time !== start.time
			? this.distanceTo(start) / (this.time - start.time)
			: 0;
	};
	return Point;
}());

var Bezier = (function () {
	function Bezier(startPoint, control2, control1, endPoint, startWidth, endWidth) {
		this.startPoint = startPoint;
		this.control2 = control2;
		this.control1 = control1;
		this.endPoint = endPoint;
		this.startWidth = startWidth;
		this.endWidth = endWidth;
	}
	Bezier.fromPoints = function (points, widths) {
		var c2 = this.calculateControlPoints(points[0], points[1], points[2]).c2;
		var c3 = this.calculateControlPoints(points[1], points[2], points[3]).c1;
		return new Bezier(points[1], c2, c3, points[2], widths.start, widths.end);
	};
	Bezier.calculateControlPoints = function (s1, s2, s3) {
		var dx1 = s1.x - s2.x;
		var dy1 = s1.y - s2.y;
		var dx2 = s2.x - s3.x;
		var dy2 = s2.y - s3.y;
		var m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
		var m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };
		var l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
		var l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
		var dxm = m1.x - m2.x;
		var dym = m1.y - m2.y;
		var k = l2 / (l1 + l2);
		var cm = { x: m2.x + dxm * k, y: m2.y + dym * k };
		var tx = s2.x - cm.x;
		var ty = s2.y - cm.y;
		return {
			c1: new Point(m1.x + tx, m1.y + ty),
			c2: new Point(m2.x + tx, m2.y + ty)
		};
	};
	Bezier.prototype.length = function () {
		var steps = 10;
		var length = 0;
		var px;
		var py;
		for (var i = 0; i <= steps; i += 1) {
			var t = i / steps;
			var cx = this.point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
			var cy = this.point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
			if (i > 0) {
				var xdiff = cx - px;
				var ydiff = cy - py;
				length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
			}
			px = cx;
			py = cy;
		}
		return length;
	};
	Bezier.prototype.point = function (t, start, c1, c2, end) {
		return (start * (1.0 - t) * (1.0 - t) * (1.0 - t))
			+ (3.0 * c1 * (1.0 - t) * (1.0 - t) * t)
			+ (3.0 * c2 * (1.0 - t) * t * t)
			+ (end * t * t * t);
	};
	return Bezier;
}());

function throttle(fn, wait) {
	if (wait === void 0) { wait = 250; }
	var previous = 0;
	var timeout = null;
	var result;
	var storedContext;
	var storedArgs;
	var later = function () {
		previous = Date.now();
		timeout = null;
		result = fn.apply(storedContext, storedArgs);
		if (!timeout) {
			storedContext = null;
			storedArgs = [];
		}
	};
	return function wrapper() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			args[_i] = arguments[_i];
		}
		var now = Date.now();
		var remaining = wait - (now - previous);
		storedContext = this;
		storedArgs = args;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = fn.apply(storedContext, storedArgs);
			if (!timeout) {
				storedContext = null;
				storedArgs = [];
			}
		}
		else if (!timeout) {
			timeout = window.setTimeout(later, remaining);
		}
		return result;
	};
}

var SignaturePad = (function () {
	function SignaturePad(canvas, options) {
		if (options === void 0) { options = {}; }
		var _this = this;
		this.canvas = canvas;
		this.options = options;
		this._handleMouseDown = function (event) {
			if (event.which === 1) {
				_this._mouseButtonDown = true;
				_this._strokeBegin(event);
			}
		};
		this._handleMouseMove = function (event) {
			if (_this._mouseButtonDown) {
				_this._strokeMoveUpdate(event);
			}
		};
		this._handleMouseUp = function (event) {
			if (event.which === 1 && _this._mouseButtonDown) {
				_this._mouseButtonDown = false;
				_this._strokeEnd(event);
			}
		};
		this._handleTouchStart = function (event) {
			event.preventDefault();
			if (event.targetTouches.length === 1) {
				var touch = event.changedTouches[0];
				_this._strokeBegin(touch);
			}
		};
		this._handleTouchMove = function (event) {
			event.preventDefault();
			var touch = event.targetTouches[0];
			_this._strokeMoveUpdate(touch);
		};
		this._handleTouchEnd = function (event) {
			var wasCanvasTouched = event.target === _this.canvas;
			if (wasCanvasTouched) {
				event.preventDefault();
				var touch = event.changedTouches[0];
				_this._strokeEnd(touch);
			}
		};
		this.velocityFilterWeight = options.velocityFilterWeight || 0.7;
		this.minWidth = options.minWidth || 0.5;
		this.maxWidth = options.maxWidth || 2.5;
		this.throttle = ('throttle' in options ? options.throttle : 16);
		this.minDistance = ('minDistance' in options
			? options.minDistance
			: 5);
		if (this.throttle) {
			this._strokeMoveUpdate = throttle(SignaturePad.prototype._strokeUpdate, this.throttle);
		}
		else {
			this._strokeMoveUpdate = SignaturePad.prototype._strokeUpdate;
		}
		this.dotSize =
			options.dotSize ||
				function dotSize() {
					return (this.minWidth + this.maxWidth) / 2;
				};
		this.penColor = options.penColor || 'black';
		this.backgroundColor = options.backgroundColor || 'rgba(0,0,0,0)';
		this.onBegin = options.onBegin;
		this.onEnd = options.onEnd;
		this._ctx = canvas.getContext('2d');
		this.clear();
		this.on();
	}
	SignaturePad.prototype.clear = function () {
		var ctx = this._ctx;
		var canvas = this.canvas;
		ctx.fillStyle = this.backgroundColor;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		this._data = [];
		this._reset();
		this._isEmpty = true;
	};
	SignaturePad.prototype.fromDataURL = function (dataUrl, options, callback) {
		var _this = this;
		if (options === void 0) { options = {}; }
		var image = new Image();
		var ratio = options.ratio || window.devicePixelRatio || 1;
		var width = options.width || this.canvas.width / ratio;
		var height = options.height || this.canvas.height / ratio;
		this._reset();
		image.onload = function () {
			_this._ctx.drawImage(image, 0, 0, width, height);
			if (callback) {
				callback();
			}
		};
		image.onerror = function (error) {
			if (callback) {
				callback(error);
			}
		};
		image.src = dataUrl;
		this._isEmpty = false;
	};
	SignaturePad.prototype.toDataURL = function (type, encoderOptions) {
		if (type === void 0) { type = 'image/png'; }
		switch (type) {
			case 'image/svg+xml':
				return this._toSVG();
			default:
				return this.canvas.toDataURL(type, encoderOptions);
		}
	};
	SignaturePad.prototype.on = function () {
		this.canvas.style.touchAction = 'none';
		this.canvas.style.msTouchAction = 'none';
		if (window.PointerEvent) {
			this._handlePointerEvents();
		}
		else {
			this._handleMouseEvents();
			if ('ontouchstart' in window) {
				this._handleTouchEvents();
			}
		}
	};
	SignaturePad.prototype.off = function () {
		this.canvas.style.touchAction = 'auto';
		this.canvas.style.msTouchAction = 'auto';
		this.canvas.removeEventListener('pointerdown', this._handleMouseDown);
		this.canvas.removeEventListener('pointermove', this._handleMouseMove);
		document.removeEventListener('pointerup', this._handleMouseUp);
		this.canvas.removeEventListener('mousedown', this._handleMouseDown);
		this.canvas.removeEventListener('mousemove', this._handleMouseMove);
		document.removeEventListener('mouseup', this._handleMouseUp);
		this.canvas.removeEventListener('touchstart', this._handleTouchStart);
		this.canvas.removeEventListener('touchmove', this._handleTouchMove);
		this.canvas.removeEventListener('touchend', this._handleTouchEnd);
	};
	SignaturePad.prototype.isEmpty = function () {
		return this._isEmpty;
	};
	SignaturePad.prototype.fromData = function (pointGroups) {
		var _this = this;
		this.clear();
		this._fromData(pointGroups, function (_a) {
			var color = _a.color, curve = _a.curve;
			return _this._drawCurve({ color: color, curve: curve });
		}, function (_a) {
			var color = _a.color, point = _a.point;
			return _this._drawDot({ color: color, point: point });
		});
		this._data = pointGroups;
	};
	SignaturePad.prototype.toData = function () {
		return this._data;
	};
	SignaturePad.prototype._strokeBegin = function (event) {
		var newPointGroup = {
			color: this.penColor,
			points: []
		};
		if (typeof this.onBegin === 'function') {
			this.onBegin(event);
		}
		this._data.push(newPointGroup);
		this._reset();
		this._strokeUpdate(event);
	};
	SignaturePad.prototype._strokeUpdate = function (event) {
		var x = event.clientX;
		var y = event.clientY;
		var point = this._createPoint(x, y);
		var lastPointGroup = this._data[this._data.length - 1];
		var lastPoints = lastPointGroup.points;
		var lastPoint = lastPoints.length > 0 && lastPoints[lastPoints.length - 1];
		var isLastPointTooClose = lastPoint
			? point.distanceTo(lastPoint) <= this.minDistance
			: false;
		var color = lastPointGroup.color;
		if (!lastPoint || !(lastPoint && isLastPointTooClose)) {
			var curve = this._addPoint(point);
			if (!lastPoint) {
				this._drawDot({ color: color, point: point });
			}
			else if (curve) {
				this._drawCurve({ color: color, curve: curve });
			}
			lastPoints.push({
				time: point.time,
				x: point.x,
				y: point.y
			});
		}
	};
	SignaturePad.prototype._strokeEnd = function (event) {
		this._strokeUpdate(event);
		if (typeof this.onEnd === 'function') {
			this.onEnd(event);
		}
	};
	SignaturePad.prototype._handlePointerEvents = function () {
		this._mouseButtonDown = false;
		this.canvas.addEventListener('pointerdown', this._handleMouseDown);
		this.canvas.addEventListener('pointermove', this._handleMouseMove);
		document.addEventListener('pointerup', this._handleMouseUp);
	};
	SignaturePad.prototype._handleMouseEvents = function () {
		this._mouseButtonDown = false;
		this.canvas.addEventListener('mousedown', this._handleMouseDown);
		this.canvas.addEventListener('mousemove', this._handleMouseMove);
		document.addEventListener('mouseup', this._handleMouseUp);
	};
	SignaturePad.prototype._handleTouchEvents = function () {
		this.canvas.addEventListener('touchstart', this._handleTouchStart);
		this.canvas.addEventListener('touchmove', this._handleTouchMove);
		this.canvas.addEventListener('touchend', this._handleTouchEnd);
	};
	SignaturePad.prototype._reset = function () {
		this._lastPoints = [];
		this._lastVelocity = 0;
		this._lastWidth = (this.minWidth + this.maxWidth) / 2;
		this._ctx.fillStyle = this.penColor;
	};
	SignaturePad.prototype._createPoint = function (x, y) {
		var rect = this.canvas.getBoundingClientRect();
		return new Point(x - rect.left, y - rect.top, new Date().getTime());
	};
	SignaturePad.prototype._addPoint = function (point) {
		var _lastPoints = this._lastPoints;
		_lastPoints.push(point);
		if (_lastPoints.length > 2) {
			if (_lastPoints.length === 3) {
				_lastPoints.unshift(_lastPoints[0]);
			}
			var widths = this._calculateCurveWidths(_lastPoints[1], _lastPoints[2]);
			var curve = Bezier.fromPoints(_lastPoints, widths);
			_lastPoints.shift();
			return curve;
		}
		return null;
	};
	SignaturePad.prototype._calculateCurveWidths = function (startPoint, endPoint) {
		var velocity = this.velocityFilterWeight * endPoint.velocityFrom(startPoint) +
			(1 - this.velocityFilterWeight) * this._lastVelocity;
		var newWidth = this._strokeWidth(velocity);
		var widths = {
			end: newWidth,
			start: this._lastWidth
		};
		this._lastVelocity = velocity;
		this._lastWidth = newWidth;
		return widths;
	};
	SignaturePad.prototype._strokeWidth = function (velocity) {
		return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
	};
	SignaturePad.prototype._drawCurveSegment = function (x, y, width) {
		var ctx = this._ctx;
		ctx.moveTo(x, y);
		ctx.arc(x, y, width, 0, 2 * Math.PI, false);
		this._isEmpty = false;
	};
	SignaturePad.prototype._drawCurve = function (_a) {
		var color = _a.color, curve = _a.curve;
		var ctx = this._ctx;
		var widthDelta = curve.endWidth - curve.startWidth;
		var drawSteps = Math.floor(curve.length()) * 2;
		ctx.beginPath();
		ctx.fillStyle = color;
		for (var i = 0; i < drawSteps; i += 1) {
			var t = i / drawSteps;
			var tt = t * t;
			var ttt = tt * t;
			var u = 1 - t;
			var uu = u * u;
			var uuu = uu * u;
			var x = uuu * curve.startPoint.x;
			x += 3 * uu * t * curve.control1.x;
			x += 3 * u * tt * curve.control2.x;
			x += ttt * curve.endPoint.x;
			var y = uuu * curve.startPoint.y;
			y += 3 * uu * t * curve.control1.y;
			y += 3 * u * tt * curve.control2.y;
			y += ttt * curve.endPoint.y;
			var width = curve.startWidth + ttt * widthDelta;
			this._drawCurveSegment(x, y, width);
		}
		ctx.closePath();
		ctx.fill();
	};
	SignaturePad.prototype._drawDot = function (_a) {
		var color = _a.color, point = _a.point;
		var ctx = this._ctx;
		var width = typeof this.dotSize === 'function' ? this.dotSize() : this.dotSize;
		ctx.beginPath();
		this._drawCurveSegment(point.x, point.y, width);
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();
	};
	SignaturePad.prototype._fromData = function (pointGroups, drawCurve, drawDot) {
		for (var _i = 0, pointGroups_1 = pointGroups; _i < pointGroups_1.length; _i++) {
			var group = pointGroups_1[_i];
			var color = group.color, points = group.points;
			if (points.length > 1) {
				for (var j = 0; j < points.length; j += 1) {
					var basicPoint = points[j];
					var point = new Point(basicPoint.x, basicPoint.y, basicPoint.time);
					this.penColor = color;
					if (j === 0) {
						this._reset();
					}
					var curve = this._addPoint(point);
					if (curve) {
						drawCurve({ color: color, curve: curve });
					}
				}
			}
			else {
				this._reset();
				drawDot({
					color: color,
					point: points[0]
				});
			}
		}
	};
	SignaturePad.prototype._toSVG = function () {
		var _this = this;
		var pointGroups = this._data;
		var ratio = Math.max(window.devicePixelRatio || 1, 1);
		var minX = 0;
		var minY = 0;
		var maxX = this.canvas.width / ratio;
		var maxY = this.canvas.height / ratio;
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', this.canvas.width.toString());
		svg.setAttribute('height', this.canvas.height.toString());
		this._fromData(pointGroups, function (_a) {
			var color = _a.color, curve = _a.curve;
			var path = document.createElement('path');
			if (!isNaN(curve.control1.x) &&
				!isNaN(curve.control1.y) &&
				!isNaN(curve.control2.x) &&
				!isNaN(curve.control2.y)) {
				var attr = "M " + curve.startPoint.x.toFixed(3) + "," + curve.startPoint.y.toFixed(3) + " " +
					("C " + curve.control1.x.toFixed(3) + "," + curve.control1.y.toFixed(3) + " ") +
					(curve.control2.x.toFixed(3) + "," + curve.control2.y.toFixed(3) + " ") +
					(curve.endPoint.x.toFixed(3) + "," + curve.endPoint.y.toFixed(3));
				path.setAttribute('d', attr);
				path.setAttribute('stroke-width', (curve.endWidth * 2.25).toFixed(3));
				path.setAttribute('stroke', color);
				path.setAttribute('fill', 'none');
				path.setAttribute('stroke-linecap', 'round');
				svg.appendChild(path);
			}
		}, function (_a) {
			var color = _a.color, point = _a.point;
			var circle = document.createElement('circle');
			var dotSize = typeof _this.dotSize === 'function' ? _this.dotSize() : _this.dotSize;
			circle.setAttribute('r', dotSize.toString());
			circle.setAttribute('cx', point.x.toString());
			circle.setAttribute('cy', point.y.toString());
			circle.setAttribute('fill', color);
			svg.appendChild(circle);
		});
		var prefix = 'data:image/svg+xml;base64,';
		var header = '<svg' +
			' xmlns="http://www.w3.org/2000/svg"' +
			' xmlns:xlink="http://www.w3.org/1999/xlink"' +
			(" viewBox=\"" + minX + " " + minY + " " + maxX + " " + maxY + "\"") +
			(" width=\"" + maxX + "\"") +
			(" height=\"" + maxY + "\"") +
			'>';
		var body = svg.innerHTML;
		if (body === undefined) {
			var dummy = document.createElement('dummy');
			var nodes = svg.childNodes;
			dummy.innerHTML = '';
			for (var i = 0; i < nodes.length; i += 1) {
				dummy.appendChild(nodes[i].cloneNode(true));
			}
			body = dummy.innerHTML;
		}
		var footer = '</svg>';
		var data = header + body + footer;
		return prefix + btoa(data);
	};
	return SignaturePad;
}());








var wrapper = document.getElementById("signature-pad");
var clearButton = wrapper.querySelector("[data-action=clear]");
var AddtoDocBtn = wrapper.querySelector("[data-action=add-to-doc]");
var CancelBtn = wrapper.querySelector("[data-action=cancel]");
var canvas = wrapper.querySelector("canvas");
var signaturePad = new SignaturePad(canvas, {
// It's Necessary to use an opaque color when saving image as JPEG;
// this option can be omitted if only saving as PNG or SVG
backgroundColor: 'rgb(255, 255, 255)'
});

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
// When zoomed out to less than 100%, for some very strange reason,
// some browsers report devicePixelRatio as less than 1
// and only part of the canvas is cleared then.
var ratio =  Math.max(window.devicePixelRatio || 1, 1);

// This part causes the canvas to be cleared
canvas.width = canvas.offsetWidth * ratio;
canvas.height = canvas.offsetHeight * ratio;
canvas.getContext("2d").scale(ratio, ratio);

// This library does not listen for canvas changes, so after the canvas is automatically
// cleared by the browser, SignaturePad#isEmpty might still return false, even though the
// canvas looks empty, because the internal data of this library wasn't cleared. To make sure
// that the state of this library is consistent with visual state of the canvas, you
// have to clear it manually.
signaturePad.clear();
}

// On mobile devices it might make more sense to listen to orientation change,
// rather than window resize events.
window.onresize = resizeCanvas;
resizeCanvas();

function download(dataURL, filename) {
var link = document.createElement('a');
link.href = dataURL;
link.download = filename;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function dataURLToBlob(dataURL) {
// Code taken from https://github.com/ebidel/filer.js
var parts = dataURL.split(';base64,');
var contentType = parts[0].split(":")[1];
var raw = window.atob(parts[1]);
var rawLength = raw.length;
var uInt8Array = new Uint8Array(rawLength);

for (var i = 0; i < rawLength; ++i) {
  uInt8Array[i] = raw.charCodeAt(i);
}

return new Blob([uInt8Array], { type: contentType });
}

clearButton.addEventListener("click", function (event) {
signaturePad.clear();
});






AddtoDocBtn.addEventListener("click", function (event) {
	if (signaturePad.isEmpty()) {
	  alert("Please provide a signature first.");
	} else {
	  var dataURL = signaturePad.toDataURL('image/svg+xml');
	  //download(dataURL, "signature.svg");
	  //pdf.enableImage(dataURL);
	  doubleclickobj.setSrc(dataURL);
	  pdf.Reload();
	  document.getElementById("signature-container").style.visibility = "hidden";
	document.getElementById("signature-container").style.height = 0;
	
	document.getElementById("image-container").style.display = "none";
	document.getElementById("tabcontent").style.display = "none";
	}
	});


	CancelBtn.addEventListener("click", function (event) {
		document.getElementById("signature-container").style.visibility = "hidden";
	document.getElementById("signature-container").style.height = "0px";
	
	document.getElementById("image-container").style.display = "none";
	document.getElementById("tabcontent").style.display = "none";
	$('.tool-button.active').removeClass('active');
    $('.icon-color').removeClass('icon-color');
		});

	var cancelselectbtn = document.getElementById("cancelselectbtn")	
	cancelselectbtn.addEventListener("click", function (event) {
		document.getElementById("signature-container").style.visibility = "hidden";
	document.getElementById("signature-container").style.height = "0px";
	
	document.getElementById("image-container").style.display = "none";
	document.getElementById("tabcontent").style.display = "none";
	$('.tool-button.active').removeClass('active');
	$('.icon-color').removeClass('icon-color');
		});


	var addtodocselectbtn = document.getElementById('addtodocselectbtn');
	addtodocselectbtn.addEventListener('click', function(event) {
	var imgsrc = document.getElementById("imgc").src;
	var request = new XMLHttpRequest();
	request.open('GET', imgsrc, true);
	request.responseType = 'blob';
	request.onload = function() {
		var reader = new FileReader();
		reader.readAsDataURL(request.response);
		reader.onload =  function(e){
			console.log('DataURL:', e.target.result);
			var URL = e.target.result;
			doubleclickobj.setSrc(URL);
		};
	};
	request.send();
	
	
	document.getElementById("signature-container").style.visibility = "hidden";
	document.getElementById("signature-container").style.height = "0px";
	document.getElementById("image-container").style.display = "none";
	document.getElementById("tabcontent").style.display = "none";
});



var droptogglesign = 0;

$(document).on('click','.actionsign', function() {  
    $('.dropdown-menu2').css({"display": "none"});
    if(droptogglesign === 0){
    $(this).parent().children('#dropdown')[0].style.display = 'block';
    droptogglesign = 1;
    }
    else if(droptogglesign === 1){
		droptogglesign = 0;
      $(this).parent().children('#dropdown')[0].style.display = 'none';
    }
  });


}




render() {
    
    return (
	<div>
	<Row>

<Col lg="12" className="py-3">
<div id="moreoptions" className="btn-group float-right m-2 px-4">
<button type="button" className="btn btn-neutral actionsign ">Other Actions</button>
<button type="button"  className="btn btn-neutral actionsign dropdown-toggle dropdown-toggle-split"></button>
<div className="dropdown-menu2" id="dropdown">
<button className="dropdown-item " id="recieverfinishlaterbtn" type="button">Finish Later</button>
<div className="dropdown-divider"></div>
<button className="dropdown-item " id="recieverdeclinebtn" type="button">Decline</button>
<button className="dropdown-item "  type="button">Print & Sign</button>
<button className="dropdown-item "  type="button">Void</button>
<button className="dropdown-item "  type="button">Correct</button>
<div className="dropdown-divider"></div>
<button className="dropdown-item "  type="button">Help & Support</button>
<button className="dropdown-item "  type="button">About Pappayasign</button>
<button className="dropdown-item "  type="button">View History</button>
<button className="dropdown-item "  type="button">View Certificate(PDF)</button>
<button className="dropdown-item "  type="button">Session Information</button>
</div>
</div>
<button type="button" id="recieverfinishbtn" className="btn m-2 float-right px-4 btn-primary ">Finish</button>

</Col>
</Row>
	<Row>
	<div id="editortoolbar" className="editortoolbar">
	<button id="zoominbtn" color="neutral" className="tool"><i className="material-icons" >zoom_in</i></button>
	<button id="zoomoutbtn" color="neutral" className="tool"><i className="material-icons" >zoom_out</i></button>
	
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
  	<div><p>Sending Email, This dialog will automatically close after sending.</p><div className="lds-dual-ring"></div></div>
  </div>
</div>

<div className="modal">
  <div className="modal-content">
  <div><p>Please Wait.</p><div className="lds-dual-ring"></div></div>
  </div>
</div>

<div className="modal">
  <div className="modal-content">
  <div >
  <div className="mb-4 mb-xl-0"><h5>Please Review and Act on These Documents: </h5></div>
	<Row>
	<Col xs="12">
	<div className="custom-control custom-control-alternative custom-checkbox">
		<input
		className="custom-control-input"
		id="signtermscheck"
		
		type="checkbox"
		/>
		<label
		className="custom-control-label"
		htmlFor="signtermscheck"
		>
		<span className="text-muted">
		I agree to use electronic records, signature and 
		{" "}
		<a href="#" onClick={e => e.preventDefault()}>
		Electronic Record and Signature Discolsure
		</a>
		</span>
		</label>
	</div>
	</Col>
		<Col lg="12" className="justify-content-center p-2 py-3">
		<Button id="startnouserbtn" className="close-btn px-4 " > Continue</Button>
		</Col>
		</Row>
		
	
	</div>
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
			id="addinitialval"
			placeholder="Initials"
			type="text"
		/>
		</FormGroup>
		</Col>
		
		<Col lg="6">
		<Button id="addinitialmodalbtn" className="close-btn float-right px-4" > Add</Button>
		</Col>
		<Col lg="6">
		<Button id="closeinitialmodalbtn" className="cancel-btn float-left px-4" > Close</Button>
		</Col>
		</Row>
		
	
	</div>
  </div>
</div>






	<Col lg="2">	
	<div id="toolbar" className="toolbar">
	<div className ="divider">
	<div className="col my-3 p-2">
		<h6 className="text-uppercase text-black ls-1 mb-1 float-left">
			File
		</h6>
	</div>
	<hr className="my-1" />
	</div>
	<button id="openfilebtn" className="tool"><i className="material-icons" >insert_drive_file</i>Open</button>
	<button id="savebtn" color="neutral" className="tool"><i className="material-icons" >get_app</i>Save</button>
	<div className ="divider" id="fieldscolumn">
	<div className="col my-3 p-2">
		<h6 className="text-uppercase text-black ls-1 mb-1 float-left">
			Fields
		</h6>
	</div>
	<hr className="my-1" />
	</div>
	<button id="signaturebtn" color="neutral" className="tool"><i className="material-icons" >gesture</i>Signature</button>
	<button id="imagebtn" color="neutral" className="tool"><i className="material-icons" >image</i>Image</button>
	<button id="datebtn" color="neutral" className="tool"><i className="material-icons" >today</i>Date</button>
	<button id="penbtn" color="neutral" className="tool"><i className="material-icons" >edit</i>Pen</button>
	<button id="textbtn" color="neutral" className="tool"><i className=" material-icons" >text_fields</i>Text</button>
	<button id="circlebtn" color="neutral" className="tool"><i className="material-icons" >panorama_fish_eye</i>Circle</button>
	<button id="rectanglebtn" color="neutral" className="tool"><i className="material-icons" >crop_din</i>Rectangle</button>
	<div className ="divider">
	<div className="col my-3 p-2">
		<h6 className="text-uppercase text-black ls-1 mb-1 float-left">
			Tools
		</h6>
	</div>
	<hr className="my-1" />
	</div>
	<button id="selectbtn" color="neutral" className="tool"><i className="material-icons" >pan_tool</i>Select</button>
	<button id="deletebtn" color="neutral" className="tool"><i className="material-icons" >delete_forever</i>Delete</button>
	<button id="clearbtn" color="neutral" className="tool"><i className="material-icons" >clear</i>Clear</button>
	<input id="fileinput" type="file" accept="application/pdf"></input>
	<input id="imageinput" type="file" accept="image/*"></input>
	
	<Button id="addobjbtn" className="tool"></Button>
	
	<Button className="color-tool tool" id="selectcolor" style={{backgroundColor: '#000'}}></Button>
	<input type="color" className="color-tool" id="colortool" name="favcolor"></input>
	
	</div>
	</Col>

	<Col lg="8">
	<Row>
	<Col lg="12">
	<div id='signature-container'>
	 
	 <div className="nav-wrapper">
          <Nav
            className="nav-fill flex-column flex-md-row"
            id="tabs-icons-text"
            pills
            role="tablist"
          >
            <NavItem>
              <NavLink
                aria-selected={this.state.tabs === 1}
                className={classnames("mb-sm-1 mb-md-0", {
                  active: this.state.tabs === 1
                })}
                onClick={e => this.toggleNavs(e, "tabs", 1)}
                href="#pablo"
                role="tab"
              >
                Draw
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                aria-selected={this.state.tabs === 2}
                className={classnames("mb-sm-1 mb-md-0", {
                  active: this.state.tabs === 2
                })}
                onClick={e => this.toggleNavs(e, "tabs", 2)}
                href="#pablo"
                role="tab"
              >
                
                Select
              </NavLink>
            </NavItem>
          </Nav>
        </div>
            <TabContent activeTab={"tabs" + this.state.tabs} id="tabcontent">
              <TabPane tabId="tabs1">
			  <div id="signatureview" className="mdl-dialog mb-3 col-lg-12 col-md-12" >
				<div className='card-body p-0'>
				<div id="signature-pad" className="signature-pad">
				<div className="signature-pad--body" >
					<canvas></canvas>
				</div>
				<div className="signature-pad--footer">
					<div className="description">Sign above</div>

					<div className="signature-pad--actions">
				<div>
					<Button className="m-2 float-right" color="neutral" type="button" data-action="clear">Clear</Button>

				</div>
				<div>
				<Button className="m-2" id="addtodoc" color="primary" type="button" data-action="add-to-doc">Add To Document</Button>
				<Button className="m-2" id="cancel" color="neutral" type="button" data-action="cancel">Cancel</Button>
				</div>
					</div>
				</div>
				</div>
				</div>
				</div>
              </TabPane>
              <TabPane tabId="tabs2">
			  <div  className="mdl-dialog mb-3 col-lg-12 col-md-12" >
				<div className='card-body p-0 signature-pad--body'>
					
					<div id="image-container">
						<img crossOrigin="anonymous"  id="imgc"className="imgclass" ></img>
					</div>
					
				</div>
				<div className="select-pad--actions">
				<Button className="m-2 float-right" id="cancelselectbtn" color="neutral" type="button" >Cancel</Button>
				<Button className="m-2 float-right" id="addtodocselectbtn" color="primary" type="button" >Add To Document</Button>
				
				</div>
				</div>
              </TabPane>
            </TabContent>
	 
	 </div>
	 </Col>
	 </Row>	
	 <Row>

	 
	<div id="container" >
	<div id="pdf-container" style={{
		height: '550px'
	}}></div>
	</div>
	</Row>

	<Col lg="12" className="py-3">
<Button id="getlinkbtn" className="m-2 float-left px-4" color="primary" type="button">Save</Button>
<div lg="6" id="emailbtncontainer">
<Button id="sendemailbtn" className="m-2 float-right px-4" color="primary" type="button">Next</Button>
</div>

</Col>
	
	
	<div>	
	
	 </div>
	 </Col>
	 <Col lg="2">
		<div id="recepientsbar" className="recepientsbar">
		<div className ="divider" id="customfieldscolumn">
		<div className="col my-3 p-2">
		<h6 className="text-uppercase text-black ls-1 mb-1 float-left">
		Custom Fields
		</h6>
		</div>
		<hr className="my-1" />
		</div>
		<button id="initialbtn" color="neutral" className="tool"><i className="material-icons" >text_format</i>Initial</button>
		<button id="namebtn" color="neutral" className="tool"><i className=" material-icons" >person</i>Name</button>
		<button id="companybtn" color="neutral" className="tool"><i className=" material-icons" >apartment</i>Company</button>
		<button id="titlebtn" color="neutral" className="tool"><i className=" material-icons" >work</i>Title</button>
		<div className ="divider" id="recepientscolumn">
		<div className="col my-3 p-2">
		<h6 className="text-uppercase text-black ls-1 mb-1 float-left">
		Recepients
		</h6>
		</div>
		<hr className="my-1" />
		</div>
		<select id="recepientselect" className="form-control selectpicker form-control-sm" >
		</select>
		 </div>
	 </Col>
	 
	 </Row>	
	</div>
    )
  }

}

export default PDFAnnotate;