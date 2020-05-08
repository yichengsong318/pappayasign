import { fabric } from 'fabric'
import $ from 'jquery'
import * as jsPDF from 'jspdf'
import React from 'react'
import { Button, Col, FormGroup, Input, Row } from 'reactstrap'
import TemplateDataVar from '../../variables/templatedata'
import './templateannotate.css'
//import fabric from 'fabric-webpack'
import './templatestyles.css'
import SignManager from "../SignManager";
import InitialManager from "../InitialManager";

const axios = require('axios').default
var PDFJS = require('pdfjs-dist')
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry')


class TemplateAnnotate extends React.Component {
  state = {
    tabs: 1,
    showSignModal: false,
    showInitialModal: false
  }

toggleSignModal = () => {
    const {showSignModal} = this.state;
    this.setState({
      showSignModal: !showSignModal

      })
  }

  toggleInitialModal = () => {
    const {showInitialModal} = this.state;
    this.setState({
      showInitialModal: !showInitialModal

      })
  }

  
  toggleNavs = (e, state, index) => {
    e.preventDefault()
    this.setState({
      [state]: index,
    })
  }

  doubleclickobj = null;
    pdf = null;

	saveSign = (e) => {
	    if (e.signatureBox) {
            this.doubleclickobj.setSrc(e.signatureBox);

            this.doubleclickobj.set(
                "backgroundColor",
                "transparent"
            );
            this.doubleclickobj.set({ width: 60, height: 20, scaleX: 0.6, scaleY: 0.6, });
            this.pdf.Reload();
            
            this.toggleSignModal();
        } else {
	        alert('Please set your signature!')
        }
    }

    saveInitial = (e) => {
	    if (e.initialsBox) {
            this.doubleclickobj.setSrc(e.initialsBox);

            this.doubleclickobj.set(
                "backgroundColor",
                "transparent"
            );
            this.doubleclickobj.set({ width: 60, height: 20, scaleX: 0.6, scaleY: 0.6, });
            this.pdf.Reload();
            this.toggleInitialModal();
        } else {
	        alert('Please set your initials!')
        }
    }

  componentDidMount() {

    var global = this;

    var modal = document.querySelectorAll('.modal')
    var copybtn = document.getElementById('copy-clipboard-btn')
    var mainurl = document.location.hash
    var url = document.location.hash
    var doubleclickobj
    var fileid = ''
    var filename = ''
    var type = ''
    var userid = ''
    var email = ''
    var recepientemail = ''
    var recepientcolor = ''
    var useridother = ''
    var owner = 'admin'
    var grabbedcolor = ''
    var docname = ''
    var dbpeople = []
    var signimage = ''
    var initialimage = ''
    var username = ''
    var usertitle = ''

    var TemplateAnnotate = function (
      container_id,
      toolbar_id,
      url,
      filename,
      options = {}
    ) {
      this.number_of_pages = 0
      this.pages_rendered = 0
      this.active_tool = 1 // 1 - Free hand, 2 - Text, 3 - Arrow, 4 - Rectangle
      this.fabricObjects = []
      this.fabricObjectsData = []
      this.color = '#000'
      this.borderColor = '#000000'
      this.borderSize = 1
      this.font_size = 16
      this.active_canvas = 0
      this.container_id = container_id
      this.toolbar_id = toolbar_id
      this.imageurl = ''
      this.Addtext = 'Sample Text'
      this.recepientemail = ''
      this.recepientcolor = ''
      this.filename = filename
      this.url = url
      docname = filename
      var inst = this

      var loadingTask = PDFJS.getDocument(this.url)
      loadingTask.promise.then(
        function (pdf) {
          inst.number_of_pages = pdf.numPages
          var scale = 1.3
          for (var i = 1; i <= pdf.numPages; i++) {
            pdf.getPage(i).then(function (page) {
              var container = document.getElementById(inst.container_id)
              //var viewport = page.getViewport(1);
              //var scale = (container.clientWidth - 80) / viewport.width;
              var viewport = page.getViewport(scale)
              var canvas = document.createElement('canvas')
              document.getElementById(inst.container_id).appendChild(canvas)
              canvas.className = 'pdf-canvas'
              canvas.height = viewport.height
              canvas.width = viewport.width
              var context = canvas.getContext('2d')

              var renderContext = {
                canvasContext: context,
                viewport: viewport,
              }
              var renderTask = page.render(renderContext)
              renderTask.then(function () {
                $('.pdf-canvas').each(function (index, el) {
                  $(el).attr('id', 'page-' + (index + 1) + '-canvas')
                })
                inst.pages_rendered++
                if (inst.pages_rendered == inst.number_of_pages)
                  inst.initFabric()
              })
            })
          }
        },
        function (reason) {
          console.error(reason)
        }
      )

      this.initFabric = function () {
        var inst = this
        $('#' + inst.container_id + ' canvas').each(function (index, el) {
          var background = el.toDataURL('image/png')
          var fabricObj = new fabric.Canvas(el.id, {
            freeDrawingBrush: {
              width: 1,
              color: inst.color,
            },
          })

          fabricObj.on('object:selected', function (e) {
            e.target.transparentCorners = false
            e.target.borderColor = '#cccccc'
            e.target.cornerColor = '#d35400'
            e.target.minScaleLimit = 2
            e.target.cornerStrokeColor = '#d35400'
            e.target.cornerSize = 8
            e.target.cornerStyle = 'circle'
            e.target.minScaleLimit = 0
            e.target.lockScalingFlip = true
            e.target.lockUniScaling = true
            e.target.hasRotatingPoint = false
            e.target.padding = 5
            e.target.selectionDashArray = [10, 5]
            e.target.borderDashArray = [10, 5]
          })
          inst.fabricObjects.push(fabricObj)
          if (typeof options.onPageUpdated == 'function') {
            fabricObj.on('object:added', function () {
              var oldValue = Object.assign({}, inst.fabricObjectsData[index])
              inst.fabricObjectsData[index] = fabricObj.toJSON()
              options.onPageUpdated(
                index + 1,
                oldValue,
                inst.fabricObjectsData[index]
              )
            })
          }
          fabricObj.setBackgroundImage(
            background,
            fabricObj.renderAll.bind(fabricObj)
          )
          fabricObj.on('after:render', function () {
            inst.fabricObjectsData[index] = fabricObj.toJSON()
            fabricObj.off('after:render')
          })

          fabricObj.on({
            'mouse:up': function (e) {
              ////console.log("Mouse up", e);
              $('#templatedragabbleImageText').hide()
              $('#templatedragabbleImageSign').hide()
              $('#templatedragabbleImageInitial').hide()
              //fabricMouseHandler(e, fabricObj);
              if (e.target) {
                //clicked on object
                const objcolor = e.target.backgroundColor
                const objid = e.target.id
                if (grabbedcolor != '') {
                  function hexToRgb(hex) {
                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                      hex
                    )
                    return result
                      ? {
                          r: parseInt(result[1], 16),
                          g: parseInt(result[2], 16),
                          b: parseInt(result[3], 16),
                        }
                      : null
                  }

                  //console.log(e.target);

                  var rgbval =
                    hexToRgb(grabbedcolor).r +
                    ', ' +
                    hexToRgb(grabbedcolor).g +
                    ', ' +
                    hexToRgb(grabbedcolor).b
                  var RGB = 'rgb(' + rgbval + ')'
                } else {
                  var RGB = ''
                }

                if (objcolor == RGB || owner == 'admin' || objid == email) {
                  //console.log('Object selected');
                  e.target.lockMovementX = false
                  e.target.lockMovementY = false
                  var id = fabricObj.getObjects().indexOf(e.target)
                  e.target.selectable = true
                  fabricObj.setActiveObject(fabricObj.item(id))
                  fabricObj.requestRenderAll()
                  e.target.hasControls = true
                  e.target.set('id', email)
                } else {
                  //console.log('Object not selected');
                  e.target.selectable = false
                  e.target.lockMovementX = true
                  e.target.lockMovementY = true
                  e.target.hasControls = false
                }
              } else {
                //add rectangle
                if (
                  e.e.type == 'touchstart' ||
                  e.e.type == 'touchmove' ||
                  e.e.type == 'touchend' ||
                  e.e.type == 'touchcancel'
                ) {
                  var x = e.pointer.x
                  var y = e.pointer.y
                  inst.active_canvas = index
                  fabricMouseHandler(e, fabricObj)
                } else if (
                  e.e.type == 'mousedown' ||
                  e.e.type == 'mouseup' ||
                  e.e.type == 'mousemove' ||
                  e.e.type == 'mouseover' ||
                  e.e.type == 'mouseout' ||
                  e.e.type == 'mouseenter' ||
                  e.e.type == 'mouseleave'
                ) {
                  var x = e.e.clientX
                  var y = e.e.clientY
                  var click = e.e
                  inst.active_canvas = index
                  inst.fabricClickHandler(click, fabricObj)
                }
              }
            },
          })

          fabric.util.addListener(
            fabricObj.upperCanvasEl,
            'dblclick',
            function (e) {
              if (fabricObj.findTarget(e)) {
                const objType = fabricObj.findTarget(e).type
                const obj = fabricObj.findTarget(e)
                const objcolor = fabricObj.findTarget(e).backgroundColor
                const objid = fabricObj.findTarget(e).id
                //console.log(objType);
                //console.log(obj);
                if (grabbedcolor != '') {
                  function hexToRgb(hex) {
                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                      hex
                    )
                    return result
                      ? {
                          r: parseInt(result[1], 16),
                          g: parseInt(result[2], 16),
                          b: parseInt(result[3], 16),
                        }
                      : null
                  }

                  var rgbval =
                    hexToRgb(grabbedcolor).r +
                    ', ' +
                    hexToRgb(grabbedcolor).g +
                    ', ' +
                    hexToRgb(grabbedcolor).b
                  var RGB = 'rgb(' + rgbval + ')'
                } else {
                  var RGB = ''
                }

                if (objcolor == RGB || owner == 'admin' || objid == email) {
                  var id = fabricObj.getObjects().indexOf(obj)
                  obj.selectable = true
                  fabricObj.setActiveObject(fabricObj.item(id))
                  obj.lockMovementX = false
                  obj.lockMovementY = false
                  obj.hasControls = true
                  fabricObj.requestRenderAll()

                  if (objType === 'image') {
                    //alert('double clicked on a image!');
                    global.doubleclickobj = fabricObj.findTarget(e);
                    if(obj.width === obj.height){
                      if(initialimage != ''  && objcolor != 'transparent'){

                        global.doubleclickobj.setSrc(initialimage);
                        global.doubleclickobj.set(
                            "backgroundColor",
                            "transparent"
                        );
                        global.doubleclickobj.set({ width: 60, height: 20, scaleX: 0.6, scaleY: 0.6, });
                        setTimeout(function(){fabricObj.requestRenderAll(); }, 10); 
                        global.pdf.Reload();
                      }
                      else {
                        global.toggleInitialModal();
                        setTimeout(function(){fabricObj.requestRenderAll(); }, 10);
                        //global.doubleclickobj.set({ width: 60, height: 20, scaleX: 0.6, scaleY: 0.6, });
                      }
                    }
                    else{
                      if(signimage != ''  && objcolor != 'transparent'){

                        global.doubleclickobj.setSrc(signimage);
                        global.doubleclickobj.set(
                            "backgroundColor",
                            "transparent"
                        );
                        global.doubleclickobj.set({ width: 60, height: 20, scaleX: 0.6, scaleY: 0.6, });
                        setTimeout(function(){fabricObj.requestRenderAll(); }, 10); 
                        global.pdf.Reload();
                      }
                      else {
                        global.toggleSignModal();
                        setTimeout(function(){fabricObj.requestRenderAll(); }, 10);
                        //global.doubleclickobj.set({ width: 60, height: 20, scaleX: 0.6, scaleY: 0.6, });
                      }
                    }
                    
                    obj.set('id', email)
                  } else if (objType === 'i-text') {
                    if(username != ''){
                      if(obj.text === 'Name'){
                        obj.set('text',username);
                        setTimeout(function(){fabricObj.requestRenderAll(); }, 10);
                      }
                      else if(obj.text === 'Title'){
                        obj.set('text',usertitle);
                        setTimeout(function(){fabricObj.requestRenderAll(); }, 10);
                      }
                    }
                    obj.set('backgroundColor', 'transparent')
                    fabricObj.renderAll()
                    obj.set('id', email)
                  }
                } else {
                  obj.lockMovementX = true
                  obj.lockMovementY = true
                  //console.log('Email Id is different:' + objid);
                  alert(
                    "Sorry you don't have enough access to modify this object"
                  )
                  obj.selectable = false
                  obj.hasControls = false
                }
              }
            }
          )
        })
      }

      function fabricMouseHandler(e, fabricObj) {
        $('.tool.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
        if (inst.active_tool == 2) {
          var value = inst.Addtext
          var text = new fabric.IText(value, {
            left:
              e.pointer.x -
              fabricObj.upperCanvasEl.getBoundingClientRect().left,
            top:
              e.pointer.y -
              fabricObj.upperCanvasEl.getBoundingClientRect().top +
              300,
            fill: inst.color,
            backgroundColor: inst.recepientcolor,
            id: inst.recepientemail,
            fontSize: inst.font_size,
            selectable: false,
            lockMovementX: true,
            lockMovementY: true,
            hasControls: false,
          })
          fabricObj.add(text)
          inst.active_tool = 0

          $('.icon-color').removeClass('icon-color')
        } else if (inst.active_tool == 4) {
          var myImg = inst.imageurl
          fabric.Image.fromURL(
            myImg,
            function (oImg) {
              var l =
                e.pointer.x -
                fabricObj.upperCanvasEl.getBoundingClientRect().left
              var t =
                e.pointer.y -
                fabricObj.upperCanvasEl.getBoundingClientRect().top +
                250
              oImg.scale(0.2)
              oImg.set({ left: l })
              oImg.set({ top: t })
              oImg.set({ id: inst.recepientemail })
              oImg.set({ selectable: false })
              oImg.set({ lockMovementX: true })
              oImg.set({ lockMovementY: true })
              oImg.set({ hasControls: false })
              oImg.set({ backgroundColor: inst.recepientcolor })
              fabricObj.add(oImg)
            },
            { crossOrigin: 'Anonymous' }
          )
          inst.active_tool = 0
          $('.tool-button.active').removeClass('active')
          $('.icon-color').removeClass('icon-color')
        } else if (inst.active_tool == 5) {
          var rect = new fabric.Rect({
            left:
              e.pointer.x -
              fabricObj.upperCanvasEl.getBoundingClientRect().left,
            top:
              e.pointer.y -
              fabricObj.upperCanvasEl.getBoundingClientRect().top +
              250,
            width: 100,
            height: 100,
            fill: 'rgba(0,0,0,0)',
            stroke: inst.color,
            id: inst.recepientemail,
            selectable: false,
            strokeSize: inst.borderSize,
          })
          fabricObj.add(rect)

          inst.active_tool = 0
          $('.icon-color').removeClass('icon-color')
        } else if (inst.active_tool == 6) {
          var circle = new fabric.Circle({
            left:
              e.pointer.x -
              fabricObj.upperCanvasEl.getBoundingClientRect().left,
            top:
              e.pointer.y -
              fabricObj.upperCanvasEl.getBoundingClientRect().top +
              250,
            radius: 50,
            fill: 'rgba(0,0,0,0)',
            stroke: inst.color,
            id: inst.recepientemail,
            selectable: false,
            strokeSize: inst.borderSize,
          })
          fabricObj.add(circle)

          inst.active_tool = 0
          $('.icon-color').removeClass('icon-color')
        }
      }

      this.fabricClickHandler = function (event, fabricObj) {
        var inst = this
        $('.tool.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')

        if (inst.active_tool == 2) {
          var value = inst.Addtext
          var text = new fabric.IText(value, {
            left:
              event.clientX -
              fabricObj.upperCanvasEl.getBoundingClientRect().left +
              50,
            top:
              event.clientY -
              fabricObj.upperCanvasEl.getBoundingClientRect().top +
              30,
            fill: inst.color,
            backgroundColor: inst.recepientcolor,
            id: inst.recepientemail,
            fontSize: inst.font_size,
            selectable: false,
            lockMovementX: true,
            lockMovementY: true,
            hasControls: false,
          })
          fabricObj.add(text)
          inst.active_tool = 0

          $('.icon-color').removeClass('icon-color')
        } else if (inst.active_tool == 4) {
          var myImg = inst.imageurl
          fabric.Image.fromURL(
            myImg,
            function (oImg) {
              var l =
                event.clientX -
                fabricObj.upperCanvasEl.getBoundingClientRect().left -
                200
              var t =
                event.clientY -
                fabricObj.upperCanvasEl.getBoundingClientRect().top -
                20
              oImg.scale(0.3)
              oImg.set({ left: l })
              oImg.set({ top: t })
              oImg.set({ id: inst.recepientemail })
              oImg.set({ selectable: false })
              oImg.set({ lockMovementX: true })
              oImg.set({ lockMovementY: true })
              oImg.set({ hasControls: false })
              oImg.set({ backgroundColor: inst.recepientcolor })
              fabricObj.add(oImg)
            },
            { crossOrigin: 'Anonymous' }
          )
          inst.active_tool = 0
          $('.tool-button.active').removeClass('active')
          $('.icon-color').removeClass('icon-color')
        } else if (inst.active_tool == 5) {
          var rect = new fabric.Rect({
            left:
              event.clientX -
              fabricObj.upperCanvasEl.getBoundingClientRect().left -
              100,
            top:
              event.clientY -
              fabricObj.upperCanvasEl.getBoundingClientRect().top -
              20,
            width: 100,
            height: 100,
            fill: 'rgba(0,0,0,0)',
            stroke: inst.color,
            id: inst.recepientemail,
            strokeSize: inst.borderSize,
            selectable: false,
          })
          fabricObj.add(rect)

          inst.active_tool = 0
          $('.icon-color').removeClass('icon-color')
        } else if (inst.active_tool == 6) {
          var circle = new fabric.Circle({
            left:
              event.clientX -
              fabricObj.upperCanvasEl.getBoundingClientRect().left -
              100,
            top:
              event.clientY -
              fabricObj.upperCanvasEl.getBoundingClientRect().top -
              20,
            radius: 50,
            fill: 'rgba(0,0,0,0)',
            stroke: inst.color,
            id: inst.recepientemail,
            strokeSize: inst.borderSize,
            selectable: false,
          })
          fabricObj.add(circle)

          inst.active_tool = 0
          $('.icon-color').removeClass('icon-color')
        }
      }
      modal[0].style.display = 'none'
      $('#tpdf-container').css("z-index", "0");
      $('#tcontainer').css("z-index", "0");
      $('.pdf-canvas').css("z-index", "0");
      $('canvas').css("z-index", "0");
    }

    TemplateAnnotate.prototype.enableSelector = function () {
      var inst = this
      inst.active_tool = 0
      if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.isDrawingMode = false
        })
      }
    }

    TemplateAnnotate.prototype.enablePencil = function () {
      var inst = this
      inst.active_tool = 1
      if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.isDrawingMode = true
        })
      }
    }

    TemplateAnnotate.prototype.enableAddText = function (
      text,
      recepientemail,
      recepientcolor
    ) {
      var inst = this
      inst.Addtext = text
      inst.recepientemail = recepientemail
      inst.recepientcolor = recepientcolor
      inst.active_tool = 2
      if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.isDrawingMode = false
        })
      }
    }

    TemplateAnnotate.prototype.enableImage = function (
      url,
      recepientemail,
      recepientcolor
    ) {
      var inst = this
      inst.recepientemail = recepientemail
      inst.recepientcolor = recepientcolor
      var fabricObj = inst.fabricObjects[inst.active_canvas]
      inst.active_tool = 4
      inst.imageurl = url
      if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.isDrawingMode = false
        })
      }
    }

    TemplateAnnotate.prototype.enableRectangle = function () {
      var inst = this
      var fabricObj = inst.fabricObjects[inst.active_canvas]
      inst.active_tool = 5
      if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.isDrawingMode = false
        })
      }
    }

    TemplateAnnotate.prototype.enableCircle = function () {
      var inst = this
      var fabricObj = inst.fabricObjects[inst.active_canvas]
      inst.active_tool = 6
      if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.isDrawingMode = false
        })
      }
    }

    TemplateAnnotate.prototype.deleteSelectedObject = function () {
      var inst = this
      var activeObject = inst.fabricObjects[
        inst.active_canvas
      ].getActiveObject()
      if (activeObject) {
        inst.fabricObjects[inst.active_canvas].remove(activeObject)
      }
    }

    TemplateAnnotate.prototype.ZoomIn = function () {
      var inst = this

      //jsonData =  inst.fabricObjects.toJSON();

      var container = document.getElementById(inst.container_id)
      var scaleX =
        container.getBoundingClientRect().width / container.offsetWidth
      //console.log(scaleX)
      scaleX = scaleX + 0.1
      container.style.transform = 'scale(' + scaleX + ')'
    }

    TemplateAnnotate.prototype.ZoomOut = function () {
      var inst = this
      var container = document.getElementById(inst.container_id)
      var scaleX =
        container.getBoundingClientRect().width / container.offsetWidth
      //console.log(scaleX)
      scaleX = scaleX - 0.1
      container.style.transform = 'scale(' + scaleX + ')'
    }

    TemplateAnnotate.prototype.savePdf = function () {
      var inst = this
      var doc = new jsPDF()
      $.each(inst.fabricObjects, function (index, fabricObj) {
        if (index != 0) {
          doc.addPage()
          doc.setPage(index + 1)
        }
        doc.addImage(fabricObj.toDataURL(), 'png', 0, 0)
      })
      doc.save('pappayasign_template_' + inst.filename + '')
      modal[1].style.display = 'none'
    }

    TemplateAnnotate.prototype.savetoCloudPdf = function () {
      var inst = this

      var today = new Date().toLocaleString().replace(',', '')

      //console.log('fileid:'+fileid);
      if (fileid == '') {
        filename = randomString(13)
        //console.log('filename:'+filename);
      } else {
        filename = fileid
      }

      axios
        .post('/templateupload', {
          UserID: userid,
          filename: filename,
          filedata: TemplateDataVar.TemplateDataPath,
        })
        .then(function (response) {
          console.log(response)
          if (response.data === 'document upload success') {
            //console.log('completed');
            var dataarray = []
            var jsonData = []
            $.each(inst.fabricObjects, function (index, fabricObj) {
              ////console.log(fabricObj.toJSON());
              jsonData[index] = fabricObj.toJSON()
              //console.log(jsonData[index]);
              //console.log(JSON.stringify(jsonData[index]));
              dataarray.push(JSON.stringify(jsonData[index]))
            })

            var dataarray = []
            var jsonData = []
            $.each(inst.fabricObjects, function (index, fabricObj) {
              ////console.log(fabricObj.toJSON());
              jsonData[index] = fabricObj.toJSON()
              //console.log(jsonData[index]);
              //console.log(JSON.stringify(jsonData[index]));
              dataarray.push(JSON.stringify(jsonData[index]))
            })

            axios
              .post('/addtemplatedata', {
                TemplateName: inst.filename,
                TemplateID: filename,
                OwnerEmail: email,
                DateCreated: today,
                DateStatus: today,
                DateSent: '',
                Owner: userid,
                Status: 'Draft',
                Data: dataarray,
                Reciever: [],
              })
              .then(function (response) {
                console.log(response)
                if (
                  response.data === 'insert done' ||
                  response.data === 'update done'
                ) {
                  var people = []
                  var Reciever = []
                  people = TemplateDataVar.TemplateRecepientArray
                  people.forEach(function (item, index) {
                    var recepientName = people[index].name
                    var recepientEmail = people[index].email
                    var recepientOption = people[index].option
                    var recepientColor = colorArray[index]
                    if (
                      recepientOption == 'Needs to Sign' ||
                      recepientOption == 'Needs to View'
                    ) {
                      //console.log(recepientEmail + ',' + recepientName);

                      var user = {
                        RecepientName: recepientName,
                        DocumentName: inst.filename,
                        RecepientEmail: recepientEmail,
                        RecepientColor: recepientColor,
                        RecepientOption: recepientOption,
                        RecepientStatus: 'Waiting for Others',
                        RecepientDateStatus: today,
                      }
                      Reciever.push(user)
                      //console.log(Reciever);
                    }
                  })

                  axios
                    .post('/addtemplatereciever', {
                      Status: 'Waiting for Others',
                      TemplateID: filename,
                      DateSent: today,
                      Reciever: Reciever,
                    })
                    .then(function (response) {
                      console.log(response)
                      if (response.data === 'reciever done') {
                        window.location.hash = '#/admin/templates'
                        url =
                          'https://pappayasign.herokuapp.com/#/admin/sign?id=' +
                          encodeURIComponent(filename) +
                          '&type=db&u=' +
                          userid
                        modal[1].style.display = 'none'
                      }
                    })
                    .catch(function (error) {
                      console.log(error)
                      modal[1].style.display = 'none'
                      alert(error)
                    })
                }
              })
              .catch(function (error) {
                console.log(error)
                modal[1].style.display = 'none'
              })
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[1].style.display = 'none'
        })
    }

    var randomString = function (len, bits) {
      bits = bits || 36
      var outStr = '',
        newStr
      while (outStr.length < len) {
        newStr = Math.random().toString(bits).slice(2)
        outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length))
      }
      return outStr.toUpperCase()
    }

    TemplateAnnotate.prototype.setBrushSize = function (size) {
      var inst = this
      $.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.freeDrawingBrush.width = size
      })
    }

    TemplateAnnotate.prototype.setColor = function (color) {
      var inst = this
      inst.color = color
      $.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.freeDrawingBrush.color = color
      })
    }

    TemplateAnnotate.prototype.setBorderColor = function (color) {
      var inst = this
      inst.borderColor = color
    }

    TemplateAnnotate.prototype.setFontSize = function (size) {
      this.font_size = size
    }

    TemplateAnnotate.prototype.setBorderSize = function (size) {
      this.borderSize = size
    }

    TemplateAnnotate.prototype.clearActivePage = function () {
      var inst = this
      $.each(inst.fabricObjects, function (index, fabricObj) {
        var bg = fabricObj.backgroundImage
        fabricObj.clear()
        fabricObj.setBackgroundImage(bg, fabricObj.renderAll.bind(fabricObj))
      })
    }

    TemplateAnnotate.prototype.Reload = function () {
      var inst = this
      $.each(inst.fabricObjects, function (index, fabricObj) {
        setTimeout(function(){fabricObj.requestRenderAll(); }, 10); 
      })
      //console.log('reloaded');
    }

    TemplateAnnotate.prototype.serializePdf = function () {
      var inst = this
      return JSON.stringify(inst.fabricObjects, null, 4)
    }

    TemplateAnnotate.prototype.loadFromJSON = function (jsonData) {
      var inst = this
      $.each(inst.fabricObjects, function (index, fabricObj) {
        if (jsonData.length > index) {
          fabricObj.loadFromJSON(jsonData[index], function () {
            inst.fabricObjectsData[index] = fabricObj.toJSON()
          })
        }
      })
    }

    var pdf

    document
      .getElementById('trecepientselect')
      .addEventListener('change', function () {
        var select = document.getElementById('trecepientselect')
        recepientcolor =
          select.options[select.selectedIndex].style.backgroundColor
        //console.log(recepientcolor);
        if (recepientcolor != 'rgb(189, 189, 189)') {
          document.getElementById(
            'templatedragabbleImageSign'
          ).style.backgroundColor = recepientcolor
          document.getElementById(
            'templatedragabbleImageText'
          ).style.backgroundColor = recepientcolor
          document.getElementById(
            'templatedragabbleImageInitial'
          ).style.backgroundColor = recepientcolor

          var elements = document.getElementsByClassName('tool')
          for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = recepientcolor
          }
        } else {
          var elements = document.getElementsByClassName('tool')
          for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = 'transparent'
          }

          document.getElementById(
            'templatedragabbleImageSign'
          ).style.backgroundColor = recepientcolor
          document.getElementById(
            'templatedragabbleImageText'
          ).style.backgroundColor = recepientcolor
          document.getElementById(
            'templatedragabbleImageInitial'
          ).style.backgroundColor = recepientcolor
        }
      })

    document.addEventListener('mousemove', function (e) {
      $('#templatedragabbleImageSign').css({
        left: e.clientX - 200,
        top: e.clientY - 70,
      })
      $('#templatedragabbleImageText').css({
        left: e.clientX - 100,
        top: e.clientY - 30,
      })
      $('#templatedragabbleImageInitial').css({
        left: e.clientX - 100,
        top: e.clientY - 70,
      })
    })

    document.addEventListener('dragover', function (e) {
      $('#templatedragabbleImageSign').css({
        left: e.clientX - 200,
        top: e.clientY - 70,
      })
      $('#templatedragabbleImageText').css({
        left: e.clientX - 100,
        top: e.clientY - 30,
      })
      $('#templatedragabbleImageInitial').css({
        left: e.clientX - 100,
        top: e.clientY - 70,
      })
    })

    $('#templatedragabbleImageSign').hide()
    $('#templatedragabbleImageText').hide()
    $('#templatedragabbleImageInitial').hide()
    recepientcolor = '#bdbdbd'

    document.getElementById(
      'templatedragabbleImageSign'
    ).style.backgroundColor = recepientcolor
    document.getElementById(
      'templatedragabbleImageText'
    ).style.backgroundColor = recepientcolor
    document.getElementById(
      'templatedragabbleImageInitial'
    ).style.backgroundColor = recepientcolor

    document
      .getElementById('tfileinput')
      .addEventListener('input', function (input) {
        try {
          //console.log(input.target.value);
          //console.log(input.srcElement.files[0].name);

          var file = input.srcElement.files[0]
          //console.log(input.srcElement.files[0].name);

          var reader = new FileReader()
          reader.readAsDataURL(file)

          reader.onload = function () {
            var url = reader.result
            clearPDF()
            modal[0].style.display = 'block'
            try {
              global.pdf = new TemplateAnnotate(
                'tpdf-container',
                'toolbar',
                url,
                input.srcElement.files[0].name
              )
            } catch (error) {
              alert('Please Select a Valid Document')
            }
          }

          reader.onerror = function () {
            //console.log(reader.error);
            alert('Error Opening File')
          }
        } catch (error) {
          console.log(error)
        }
      })

    document
      .getElementById('timageinput')
      .addEventListener('input', function (input) {
        try {
          var select = document.getElementById('recepientselect')
          recepientemail = select.options[select.selectedIndex].value
          //console.log(input.target.value);
          //console.log(input.srcElement.files[0].name);
          var file = input.srcElement.files[0]
          //console.log(input.srcElement.files[0].name);

          var reader = new FileReader()
          reader.readAsDataURL(file)

          reader.onload = function () {
            var url = reader.result
            try {
              global.pdf.enableImage(url, recepientemail, recepientcolor)
            } catch (error) {
              alert('Invalid Image')
            }
          }

          reader.onerror = function () {
            //console.log(reader.error);
            alert('Error Opening File')
          }
        } catch (error) {
          console.log(error)
        }
      })

    document.getElementById('tzoominbtn').addEventListener(
      'click',
      function () {
        global.pdf.ZoomIn()
      },
      false
    )

    document.getElementById('tzoomoutbtn').addEventListener(
      'click',
      function () {
        global.pdf.ZoomOut()
      },
      false
    )

    var tclearbtn = document.getElementById('tclearbtn')
    tclearbtn.addEventListener('click', function (event) {
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      try {
        global.pdf.clearActivePage()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var tdeletebtn = document.getElementById('tdeletebtn')
    tdeletebtn.addEventListener('click', function (event) {
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      try {
        global.pdf.deleteSelectedObject()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var tsavebtn = document.getElementById('tsavebtn')
    tsavebtn.addEventListener('click', function (event) {
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      modal[1].style.display = 'block'
      try {
        global.pdf.savePdf()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var tselectbtn = document.getElementById('tselectbtn')
    tselectbtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      try {
        global.pdf.enableSelector()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var trectanglebtn = document.getElementById('trectanglebtn')
    trectanglebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      try {
        global.pdf.enableRectangle()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var tcirclebtn = document.getElementById('tcirclebtn')
    tcirclebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      try {
        global.pdf.enableCircle()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var ttextbtn = document.getElementById('ttextbtn')
    ttextbtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('trecepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      //console.log(recepientemail);
      try {
        global.pdf.enableAddText('Text', recepientemail, recepientcolor)
        $('#templatedragabbleImageText').show()
        $('#templatedragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
      } catch (error) {
        alert('Please add a document first!')
        $('#templatedragabbleImageText').hide()
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var tnamebtn = document.getElementById('tnamebtn')
    tnamebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('trecepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      try {
        global.pdf.enableAddText('Name', recepientemail, recepientcolor)
        $('#templatedragabbleImageText').show()
        $('#templatedragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
      } catch (error) {
        alert('Please add a document first!')
        $('#templatedragabbleImageText').hide()
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var tcompanybtn = document.getElementById('tcompanybtn')
    tcompanybtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('trecepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      try {
        global.pdf.enableAddText('Company', recepientemail, recepientcolor)
        $('#templatedragabbleImageText').show()
        $('#templatedragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
      } catch (error) {
        alert('Please add a document first!')
        $('#templatedragabbleImageText').hide()
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var ttitlebtn = document.getElementById('ttitlebtn')
    ttitlebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('trecepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      try {
        global.pdf.enableAddText('Title', recepientemail, recepientcolor)
        $('#templatedragabbleImageText').show()
        $('#templatedragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
      } catch (error) {
        alert('Please add a document first!')
        $('#templatedragabbleImageText').hide()
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    

    var tdatebtn = document.getElementById('tdatebtn')
    tdatebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('trecepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = today.getFullYear()

      today = mm + '/' + dd + '/' + yyyy
      try {
        global.pdf.enableAddText(today, recepientemail, recepientcolor)
        $('#templatedragabbleImageText').show()
        $('#templatedragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
      } catch (error) {
        alert('Please add a document first!')
        $('#templatedragabbleImageText').hide()
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var tpenbtn = document.getElementById('tpenbtn')
    tpenbtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      try {
        global.pdf.enablePencil()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var tsignaturebtn = document.getElementById('tsignaturebtn')
    tsignaturebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('trecepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      //pdf.enablePencil();
      //console.log('signpress');

      var dataUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAxwAAADICAYAAABiQOesAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAC3iSURBVHja7J1pmF1VmajfVBIgAZIiEARlCCDzYIHQgs0QEAQnLBQRFLRwbIfujrZ2Pz3c7tjX2933drcdp0YUNVFERZQgKqggQUTBARIUGQSsgDIHUkyBTOf++FZ1iuJU1T5nrzPW+z7PeRJC1V5777PP3t971vq+b0qlUkFERERERKQRTFE4RERERERE4RARERERkc4WjilTpkz087ntZErBn3Ncx3Vcx3Vcx3Vcx3Vcx3Xc9hv3OeNUKpUpCofjOq7jOq7jOq7jOq7jOq7jtkQ4KhNs3DfKcR3XcR3XcR3XcR3XcR3XcRUOx3Vcx3Vcx3Vcx3Vcx3Vcx1U4fKMc13Ed13Ed13Ed13Ed13EVDhEREREREYVDREREREQUDhERERERUTgUDhERERERUThEREREREThEBERERERhUPhEBERERERhUNERERERBQOERERERFROBQOERERERFROEREREREROEQERERERGFQ+EQERERERGFQ0REREREFA4REREREZm0BlJ5tlIoHCIiIiIionCIiIiIiEjnC4dnSEREREREFA4REREREVE4RERERERE4VA4RERERERE4RAREREREYVDREREREQUDoVD8jMdmAXsDewD7A/snF69wBbp5zYDngIeBu4A7gF+BawA7iK6VlY8ndLMG6KIiGBcKAqHtC1zgO2AHYG5wB7AbsALgR3Sa1YSkmE2Ao8CdwP3A78Fbk2vR4A/AkOeWlE4REQUDmnfx2mV5+sUhUNyMwN4CfBS4EhiNmMWsDkxozE9vaayqZHklHSBrgfWAuuANcDTSThuAL4N/NzTKwqHiIjCIQqHTD6mArsCewG7A4cCfcDBmbZ/C3AlcC2x1OoOXGIlCoeIiMIhHS8c1Z6+Xm1SjZ2AVwP9wJ7AtsSMxmZAT8ltbyRmPB4jlludn14Pe9pF4RARUThE4ZDuZhdgP+AY4HDgiCQajeQnwCXAZcDNvgWicIiIKByicEh3sgNwHPAG4AQiL2Ma5Wc0JrqInyFmOs4DvgCs8q0QhUNEROEQhUO6h5lsmtU4HvgToipVs1kGfAW4Ahj0bRGFQ0RE4RCFQ7qDQ4HXA68CDmzhfgwR1as+A1zo2yIKh4iIwiEKh3Q2M4nKUycn2dibZ/fRaAWrgXOBc4D7iJK6IgqHiIjCIQqHdBA9RG7GocCpRDWqPdto/34ALAZ+TDQHFFE4REQUDlE4pIPYAngxUfL2pCQbm7fR/v0B+G6Sjut8u0ThEBFROEThkM6gJ8lGH5GzcTLwwjbd15uBfyWSyEUUDhERhUMUDukAZgKHEDMbLydmNrZo0319FFgIfMK3TRQOERGFQxQOaX96gX2JnI12ntkYZiPwsfR6CFjvWygKh4iIwiEKh7QvryHyNk4hZjZmtPn+biBK434O+DXwsG+hKBwiIgqHKBzSvrwZeGn6c3YH7O964Brga0QjwLt8C0XhEBFROEThkPblAOBI4C+BfTpEOK4nZjkuB273LRSFQ0RE4RCFQ9qXmcBewGuB1xE5HDMbIAlTM11T64GbgIuBpcBvfAubG6B3w4NI4RARUThE4ZDm0UPkbWxLLKt6O7BHxu1vAFalMbbOtL1bgW8TsxzLfQtbG6B34oNJ4RARUThE4ZDWsC/wBqI87v7AZiUuwLuB3yc5WEXkh+wL7AfsWFI47iWWU30R+JlvW/sE6KMfUqN/r10eYgqHiIjCIQqHtIbNge2AtwDvBHarczsPAt8jZiF+DjyThOMY4K3A0SX2cSOwmkgYPwdY5tvWHQF6Mx9wCoeIiMIhjX++KhwyHvsTZXL7gYOJZVdFWE0scfpZEoHrgMdG/P8DgX8ATlM4FI5WPvAUDhERhUMUDmkt04mZjrcTMx27FPidJ5JsfBW4lJjlWJcEYZgDgL8HTi8pHPexaUnVtb5d3Skc4z38yi7VUjhERBQOab5weIakGgcR3cdfCRyaRKQa9wA/Aa5Krzuq/MxmxGzJh4HXlxSOu4HLgC8RsyjS5cKR+8GpcIiIKByicEj7sANwBpF7sRfP7UT+AHAlMbNxLfDoGNvZGXgZMEDkctTLhiQ030lj/sq3SOEQERGlQxQO6Wz2AY4l+nQcS/TUgOjyfQWxvOknwEPjbOPoJBvHAbuWFI7lwLeAS4CbfXsUDhERUT5E4ZDOZ0uietXZRC7G40SuxvnAL4kcjqr3KSLp/N3AAmD3EcJSD+uJZVtfTX8O+tYoHCIioniIwiHdwZ7AkcARRO3l7wHXAI+Md38i+m58EHgvz12SVY9wXAIsJkruPujbonCIiIjiIQqHdA/TgRcBM4EVwNAEP78jMJ+YGTkhw/hrgc8DnyFyOZ7yLVE4RERE8RCFQ7qLrYFpRD+MiSLRo4H3EYniz8sw9gbgo8B/Ecu4Nvh2KBwiIqJ0iMIhk49pRN7He4EPAXMyycYDwD8SsxyicIiIiOIhLQoPqsQLUxQOaSbbAocQzQNfnwSkLI8RFao+RuRxiMIhIiJKhygcMhnvOcBLgbOA44E9Mm33ZuBi4CIif0QUDhERUTykQ4SjMkbQKFIP04meG38F7EL5ylTDfA84F/gZ4/f8EIVDRESUDlE4pEvZFngJ8E6gP+N2nwQ+DXwCuJeJk9VF4RAREaVDFA7pQg4D3g+8CtiGaPpXlnVEV/OPE8ni6xQOhUNERJQOUThkcjEdmAucAfwlsHPGbQ8C3wa+QjT76ySmpg/kRoVDRESUDlE4FA6pn+2JRPE3E4nivRm3/X3gU8C1wKMdcj5mEmWBNye6oz+RXgqHiIgoHaJwKBxSBy8hSuCeBLyAfEupVgHnAZ8EHmyj451FLBmbm/6ckyRjC2AzYKv09+lE/5A1RB7KU8Az6dieAh4nEuAfAO5XOEREROkQhUPk2fSkwPp04APAvsQyohw8APwCWEL03VjXJsc8B9gHeCGwX/pzT2A7ogv7lBGfnykjPpSVdAxPJgF5GPgj8GuizO+v0n+3XXSvcIiIiMIhCoe0iq2Bo4C3EbMbW2bc9rXAF4ArgZUtPMYZwK5JMnYhZnB2BJ6X/v68JBu1soFYInYPcDdwJ3Af8HvgD8BtwGqFQ0RElA5ROGQysx/w58CpwGxiCVEO1gCfJbqK392iY+tJAnUAcHgSqhcTpX8bwXqim/pNxGzH5enPluet5BaOeh84io+IiNIhCodMHqYSieEvB/4iBeS5eAS4hiiBe1kKxJvJNGJp2CFsWi41PMPR24TxHydmOJYDNwI/AW4gcj8UDhERUThE4ZBJwWzi2/7TgVcTS4xyXLgbiU7inwF+kORjQxOOpyeJxjTgRcBx6bgOIpLBW8F6NpUEvgT4JbC2BQKmcIiIiNIhCoc0nR2BdwNvIvIaNs8UYK8CLkzCcSvN61+xGXAo0bjwKGA3YmZj6xaf5/XA74h8jm8DVxA5HwqHD+p6mQcsAPrSfy8HlgLLPLMiHRDhddF9UOlQOBQOGfP+kOTiKODvgWMybvs+4Drgy0TvjaeacCxbEDkZexPd0V+Z/t6O/ISo2PVD4F6aWLVL4WjIQ7YP6Afmp7/PrvKjK5MQLEtSMFhy6EVEY85qLAEGvMWJKBwKhygc0mp6UnD0BuA0YPeM274BOIfI27iX5pSHPRx4BbF0aj9itmaLNj33q4GbgcXA12hiI0GFI+uxDxAzDC+q49dXJGlYnFk2lA4RhUPpEIVD2obtgLOAtxAJ1Vtl2OYGYAg4H/g4cFeDj2Ea0axvf+Bk4HVEUnin8H3gXCKxflUzxEzhyHLMfSnozzEruCKJwfKCPz+PKLdchGNxeZWIwqFwiMIhrbgnpAtrH+DDRBncLcnT5O9xotfGEuBqGl8GdpskGq8nZjV2Ik8OSrN4iCiXex7wLYWjIx6oA0k2Zmfe9AfSdidiERPPbgzjLIeIwqF0iMIhLROO5xF5Du8hKlTlYAPRafvTRCWmRlalmkksmfpT4I3ACR3+nnwZ+CRwCw1eXqVwlJaNLzZwiCKCsIziMytXE3klIhClwPupbxmfKBwKh8KhcEjNnEAspTqW6LBdlo1EYvhlxDewvyCqMjXqbrovMTPzuiQeczr8/VhBJBJ/M0mbwtF+D9E+opdKo5lIOhQOqYV5STL6R1w3xgQKh9IhNV+fCofUynbA+4C3ATsQZWTL8iTw8xQsXUrMbmS/hxHf0B0EHE8spTqoS96TNUTp4E8SSeRrFI62e4AO0rz8oLMZ+1voRRRfUnVJCjRlcjF/hGTsakygcCgconBIs5lOVKb6ADE7MJ2oVlWWB4ilVF9Mf29EmdctgYOJJVSvArZP/9YNDM8QnUP0LbmbBjUFVDjqOsYBGruUajRD6XM6OEYweVUGcZHuYyFRNW2i/CJjAoVD4ZDSwuEZkvHYO4nGm4nKTqWvR+AxoqP4vwM/asS9i+ivcQRR9vZE8pbwbSeuB74EfJfo26BwtMfDc5DmVz8bbznUYuCtJX5fupNlFFtuZ6CgcCgdonBIQzmFSBQ/lKjwVJa1wG+Ai4n8g1sasM+zia7hb0rCMYc8y8DakSdT0PBfRLUvhaP1D80+mpO7UY3xytqOJx1XE8tpVnvLUzgUDoVD4RCFQ5pJLzHd/n5ixiAHjwNfIcq63p7+O7dsHJlE6Xg6q8dGvdwP/O8UUK4hc+K9wlHz8S1IAliUjxAFAJaP+Lf5RCL4W2vYziXp8zo4zs/MTz/Tm/57dRp7sbc7hUPhUDgUDlE4pNlsARwA/AWxnKon03YHgX9JAU7uqlRbE8u+ziSWgW1Pnl4h7c7jRDPAzxG5HE8rHC19aC6uQRQmarQ3LwnBeJ3JVySJWOZtSxQOhUPhEIVDOok9gFcn2Tgs0zbvJZJXP03kcOSkBzicaOj3KiL3pBk8BtxJNOR7kOiJ8WSSqWlE/4+ZwIwkQM8HdiOS73OxgVhOtRj4MfBHhaOlD82iQVzRnIneFBiOlo4hIul3UZudgvlJlOaN+LfVxAxOu0lRL5Fs38emWZ/hL0aWU7ybe9nxR18HzRpf4aiN4etkOfUtPxzreht+LwYZf4ayq4XDmFThkMnJScDbiUZ5O2bY3jrgCuCrKdC6O+O+zkiB/BnEMpQ9mnSOhoAb0oPidqJM7UPptZbIG9mWyCHpTRLUl87p/uTrcL4euIdIHF9MdCJXONpfOGopQdvHs/NCPp5ko2jQsyhto4gs1EN/+uy9tuBxLxohH30FpWnBGAF40d9fzKalY/PT9iba35XpdxaRN79lIJ2z1xa4xyxN7/XgiN8dqON8VbsG+pi4QtWwHE90Tsu8H0XO10CJa4SCsrs8baPa2CM/08dSXJ7npW3OZ/yZytHX3OJq8qFwiMIh3cafAX+TAvkcCddDRAnXc4mcg5zLfnYD3pBeB9P4ZVR3JNG4Efhd+u/hGY5qpWmn8OwZjt2BQ4CXkacvSCWdzxuBfwa+r3B0hHCs5NmzAEUCtHkTBFWME2w14pvs+Wm/6smVuiQFcn0UK9s7VpA3v+DvfyQFwksp3ghx5P1rIP1uGfrTPtRzvoYlcwHwT3Wcr2V1HHeRc7qwxPuxsOA4C+s85tH3ySJiNb/AtV1EOOal/X5rifO7JL3fqxUOUTik2+gB5gIfBj5Inqn0DSlA/w/gwoz7Oi0F8v1En5CDG3heNhCzNHekB82305/19g+ZB7wzBTHbp2Mpy33A3wJfJvp0KByteWAuonijvecEFA0it3D0psD5rSX3a0UKyi5ugnAsST9bppBEmT4lizOdr2UFry+Fo37hGGD8PjoTCccCaiscUVh2FQ5pJ7+o8pyeonBIUeYS377/Gfk6Dt9BdBM/P4lHLmYQ3cPPJpYpbdXA83JvesBcS8wk3A6sKrG9qUSp4dOA1wB7ZtjHR4F/BT5P5JZkaQSocNR8fLUGGytTQLW4gbuVUzh6qZ5TUiagKrKsp6xw5KJW6ch9voqicNQnHIsKCPBY4+QS8THPl8IhCod0Cy8mciFeCeybYXsbgYuIMrg3Ag/nuCcl2TiM+Capv4Hn42miCtR3iPyTnxJJ4bk4BPhrItl9KuVmlB4lSg4vJpZ6PaZwtOSB2Ud9fThWsmnJz2CbCkergud2Eg6I2dTlmc+9wtF64VhBzD7PrnOc5Q3+bHykUqkspIsxJu1u4ajU8dCR7uUkYlnOwUSZ2bI8Saw9XkQsG1mXaT/nJzE6gcjhaBQrUgD4gxTEP5R5+9slaXobkWBeJl/m8bSfXyGqgN2vcLTsoVk28FiRxHEZeSoV5RKOpRRLDO924ShaYWwRxZfXKRytF44y1+JiGjOzMZpTKpXKUoVDFA7p2M85kUdwNvB/UiBclmeAm4jlJV/NtJ8ziG+g3kH025jboOv1caK87AXE2u+7G3TepxPJ7u9IAeqcEttaA9wMfAP4FrGUTeFozUNzgPHXgNfCSjY156tXPnIIR85j6nThgIlnOVq1XwpH84Wjn2J5SDkYAvoqlcqg0iEKh3QiU4lv2N9NLPHJkQ9xF/GN+/lE7kMO9iKWe50KvIQ8ydbVuI6YKfghsbzlmQYKx1HAm4iqVfNKbGstkTh+MZHH8RuFo6UPzUYEeCuIb80XN1k4etPnYHYLT2m7CccSxi/VOki5BHWFozOEoxWfjSWVSmVA4RCFQzqRWURviHcQzf5y9Ii4DPgscH0KhMsK0Ryig/iZxGzA1g04D6uJmYHziWpPjzT4vE9PQcnJwFkU65UwFhuJnJPvAP+PTP04FI66j7OXxuU7DBFL8YqKR1nhKBrwjWQlm5qZjQxG6w16cwrHEM9ertZLfEu9a43HN9YXBAPUNxu0gk0Vy3pLXjsKR3OEo9bPxtVs6rExyKYmmf3Utlxxt26d5VA4FA7pbl4AHE18035CJuH4HPAvRIWntSW3NRv4EyLX4RXEDEwj+m1cnx4G302StL7B531qOrZXAO8Djij54d9IzCr9L4Wj66VjOEDtZ+Ik87LCMVhDML4yBdxjBX7ziFmaWnNBcgnHcP+P1VX+3wJqqzC2zRjbWV7je/4Rqjd66037tIDav0Effb4W0ZzGf5NNOFYXPIdD6bO6bJyfmU8snyyyva6d5VA4FA7pbg4iZjZOJjp1Ty+xrWeIkrH/TrGOsxMxM8nQaUmGdmrA8Q8BtxC5JheSKeG6Bg5PD+CXZ9jWr4gGgFcRS856SsjQhkqlsirngU4m4RghHYtpXLL1UApUljdIOPooXnVrRdqX1QV+doDaZgFyCEeRZO9apKPaPs0Dfp/xvRve5tIaJaZIc7qyIkqJ96OThONqNs1I9KX9WU7x3I2i7/Pw521ZAekYqlQqvcqGKBzSaRxFVFM5kUjMLjN78ADRb+PzRPJymRv9FKJHxTtSgDKLPLMvo7mRWP61lFhGtbbJ538P4GNJ+MpyF9HV/UfAlnXKY086z2sqlcqPFI4sxz2f+rtylw1oygSWRYO9lSlYWl3Dfi+ieBWnHMKxG8VKDg8WfJ+q7VMtwlJLed156WdnlzxfCkfxz9QiNlVYrMZiilWmquVYazreSqWyjC5C4VA4pPs5Jd0UD0wXUZlr4Cai98bFlE9c7iO+RXpd2rfcPJn292tJjv7QpPO9GZGDMjtJwX7AnxMNDMvyOJH0fmuSx3oS63vSPj5dqVTOVjiyHn9/Ckpzr6cfL+AvE1gW/d16unD3UjzhtqxwrKB4jlRREaq2T0spNpv18XQd1EItMqNw1C8cRWfqiorpKTWKeC/FZk66ri+HwqFwSPczAHyUyOUoy1XAZ4ArKdeNe2vg7URuw840ZmbjFuBTxFKqJ8jXJ2Sih/du6bUXsUTsAKLz+PMzbH8jUSJ3LfUvpxrez0ruaXuF43+Of16S6f6M8jFWEFcmsCwaVG1TY1A1zGKKfUtcVjgmqiqVK8BdTrGlT0VnW0YHoo8qHA0VjqH02SxyLbf6ptR1eRwKh8Ih3cuUFMi/h0g03ibDNr+eHia3peC3HnYi8jUGiPyN3KwHfk3ka1xILENqBL3Ajum8bk8sCZub/m2HJHhz099nUS53pjF3lFE3EIWjIcffmwK1YQGpt8TmUNpWzsCyyIkv2ghvrC87iuRylBWOWgLcfop9w1xtn4qcr/EqXE1E0fdS4ahPDorO1PVRPLepUVxdqVTm00UoHAqHdC/TiP4b7ySm67fNsM3PAH9H8W/iqnEq8F6iatMWDTjulcB5xLeeD9CYnI1eIhn/xcAL0993TvIxnMzdkz5vI/+ucEw+4agW8NYrH9WCrnYWjqIBajOFo8w+Nfp8LaL+5V4Kx8QUnakrepwKh8KhcCgcQqzx34lYuvQuys1wbCSWJX2CWJ5VT7O8XuClxLeeJ9GYXhu/JUpjfpNMpWNHsC2wdxKLfZJo7AE8L/3b9I67oygcOY99HrUto+lNwdZf1vA71QK5dhaOfuqfTZiMwpEj+FY4yr8vCofCoXAoHFIDs4gqUANEQ73eEtt6OgVTn02vJ+vYxtFEzsbLk2zk7rXxOFE967NE6cqnM257R6LqzElEPsb+REL41I6+oygcOY55Ppuq3dQTIAxQvIRstVyFMoHlagqU6Cxx71hEuW/sJ5twLKVYUrrCoXAoG6JwSNuwHbEW9UyiksasEttaRZTDXUJUfFpTw+9unoL104iKVI0oHfqH9DD6CnAFeZr6bZf2e3dgX2Jd9r7EbMaMrrijKBxljnVeCpbeWmMgWI3lFEtGrhY0lQksi/7uKSkYrpVB6i9B247CUUTQyjxny54vhSOPcPRSbtmwwqFwKBwKx6RiR2IJ03CH8TJLmO5JN/uvET0gisweTCFmAPYjGg+eQlRvmZbxGDcmubiEyNv4JdFro1560v5tQ5SxPZnogr5vV95RFI56jrGXsTtE19OvAopXc8otHIsoNgNRS9nZYRZQvsxruwlH0XNdTxnhPoonKre7cNRSFrjoNdhM4Si6zUbSVWVxFQ6FQ7qbnYDjgNOJ5UxbltjWIPBDourTNRTL4Rhu7Pca4A3pgZq7/O1jRK+N84mZl4dLPiimE40SX5b2dz+inO1mCofCkfpsLGL8b6Fr6cg9zHJaM8PRT7EcC6it9GwfxToqd5pwNFLQir6PnSActRx/0Wu/2cJR9Px9hPpmNSd85lYqlUGFQxQO6QR2HiEcR5UUjruJ3htfTzfXiYRjGrAL8ArgjUTew4zMH4b1wPXAN4DLgdvr3NZwI7ytiWpTpxGVtOZ0/R1F4Sh6XH0p2CwaEK5MwXmRQKRoEAvVvzkuG1iurkEMLknHNZ5MLUjBfy0VuDpFOBolaAsoPhuUWzhq6RnSS95eIUXfi1YIx0KKLfWqd1azY794UTYUDoVDRvP8JBpnEN/Yb1ViW38kZjYuIGY6JlpStS2xjOtMovxt7uB9I3AvMbOxmFjy9VS998MkGsenh9p+6SHc/XcUhaPocQ1QPLF7JCvS9bk8BXWDKWjrS68Bin27O8wHkqDkFI7FFFvONTqYXjYqUO1Pr3pytDpFOHILWi+1VyorGswXFdmr0/tWNGAu+mGdKBDvI88sWKOEYx5RfKTo53w+xUvuLk2vBSN/R+GQNo8XUDhkLOYSfSLOJJY1lU0aX56Ck4vGEY4eokzsEcRMwUnU3+hsvAfenenh82Xgx3VuZ7O0bwekh1k/cOAku4EoHMWOqzcF17NbvCvVvo0uKxy1BFaNopOEo1ZBGxoRYK4eIRrzk4zMzni+RrKQYt/QjwzISff5vnSci6v83PIaJHko7cfSEdftvHTcC8gzC9Yo4ajlszUsWAtHvc+jBWvBqGtnKInhQoVDFA7pZOakAPotwOtLBktPAXcA/00kZ28YJ4g/lkgSP47osp27dGyF6LPxOcolie+YhOhENjXu22qS3UAUjuLHtoDalr3kZqx18WWFo57gdDILRzsL2kgGqG9WbqJzuojaZ2QafcyNEo6i10q1z+rqUbIxewJZGahUKsvoMpSNySMcnqHJzVZESde3Jeko2/hvVZKNjxHJ2SOZlgL4A4mZgtcC2zfgmB5NN/PziHySesrfTk/7diKRX3IM+ZPZFY4uE450fMupbQlUTsaqfJRDOKC2b64ns3C0MuiuRTj6KF71qpZzWm8Q3onCAcV7o+Tg6iQegwqHKBzSSWxGzDC8G3hPSeEYTtL+JvB/U3Aykm1TAH8ykTcyl8Z03v45cC7wPeAB6qtItX2SotcRfTbmMkln/hSOmo+vj9rWnecMRMYKlnIJx7z0uW7FsrFOE47edK52bdGlWLTfy2CJfRzvnA624NhbJRy9NH855W7dIB3GoAqHTB56gJnEN6N/T+RWlOW3wHfSA/teYmZjFjGzcXwKfBpxY36GqJT1ReJb3vvq2MZ04AVEAv3pwJHAFpP8BqJw1H6MRQPWXAwR31YPNlg4oPZE3skqHMPn6sYWXYZFhWMh9S+VG++c9lO8WlenC0ezPxcfqFQqi7rh+WIMqnDI5GIq0QPj38jzjdQaYlnTjUROx1ZEIuvzk9BsTd7GfsP8gegifkEat56KVM9LD8pTiZyN7ZKUKRwKRz3SsbQJAchQCpKWj/MzOYUDYqZjKeWXVw0nDBfJe+lE4YDyeRKNFo5e6p+JmeicLqV5S41aLRzNko4llUplQNkQhUM6lZelB8ehRK5CjgtjLTHLMJNYktSwazzJxuXEzMZP69hGT5KL44Cz0p+dOrOxAXgiCVe9stRDzPY8U6lUdlA46j7WvnRNNirvYUUKaJdP8HO5hWOYhdT/7fjKJPe9JYP7dhcO0nEuzhSIrqB8E7xcgfJE57Q3bTeHmM4ueczNEI7hc9moz/zZlUplcbcEHcafCodMTg4H3gW8nHxVozYSOR09aXuNuthWE/kaFwC/AB6i9ryNrYE/JfqRHEfMxnTqzMaTwC3E8rJpdR7HVGIZ3KOVSuU1CkfpY15I7SU+iwR7iyhW179RwgEx27GA4uVbh8t8Du972eC+E4RjOBBdRPESqtXO24J0vv8p877VGygXOae9abv1znQsIZYKlj3mZgnH8DEvIF9Vt//5YqFbyuIaeyocMnnZnUjofhPRH2Nqh+z3o8B1RK+N71N/+dsXEZW6XktzEx0rRMPENcRyrlkZtnkP8CWiHPDUOoVjOLfniUql8g2FI8tx96agYYD6v/1cyabeB4M1/F4jhWN0oD4/BcXzRn0psDztx+iAcIBiS47G6nbdKcIx8ngX1nifWZJ+Z5Dis0r17BvEbMxAOgezM57TWo97ZQral2Y65mYKR70yXm1/hj/vXXEfNO5UOER6iZyFtxHJ0p1QAvZp4AbgG8ClRN37jTVuY1p6EJwMvI/4lq+H5lSk2kjMQvycmJU4Etgzw3ZvAP42PazKHMeUuH9Uns550JNVOEYd/7wqwfmuYwQcw8H6UiZeOtWJLKJY+dhue1j1pUC0j+f2YFg5QtCW1iiX7U5/evVVEe+rRx13NzF/xKt3jC8drk7v9fKx3neFQ9rJL6pcn1MUDikSeG8DvB34EFHCtp1ZD/wGuBC4BLiNsRsNjseWwCuTaB2V/ruR/JFIaL+bmIm4H7gL2CkFH4dn+PBfAfx1ruA09wNusgtHlz6sB4hvcudTbInXSAaZ+FvvoRSkiUzuCK/zZ3p9ExUOESC6jX8IOIz2XVa1NgXr3yaWUpUpO3kA8GGi63mjj3eQSGi/ipjVuI0o5bs50c38g8DRJba/IZ2bS4H/IPJZFA6Fo5HMJ2Yohr+tXZLkoygLKFahKvdSFxGFQ9mQJgtHtavXq2Lysh9REvYMYJ823cc/ENPNFwA3EcuRar73pWN9DXAmsH8D5egm4NdJjG5l0wzH8IzMDKLB4PspN8Oxjuj0/i3gs0SiocKhcDSCeUk0qiUCF5WOorIB8IE0nojC4b1LFA7pArZMovEe4C3EUqt2uR6GA+orgc9TrrHa7CRVZ6fjnZX5Q7iBSGj/HdEE8QdJANaP+tnpwN7EmuY3EjMu9fJMGu+bwNeS3CgcCkdOeilWfWdlEoRlPHtp3zxipmKA2qo1jZUwLqJweN8ShUM68b5AlIh9E5FEvSftk0D+ILFc6IIUvK8qsa3dgb8iZje2In8J3NtSsPVTIon7Lqo3Ityc6H1yKvBq4IUlxnwqBXdfT5Jzl8KhcGSkP0nErk0et9ZlWiIKh/csUTikQziEyOd4JfGt+7QW7st64AHgx8TMxpUlhWor4Hjim9qjM+7nRqK87e+AHxFLm67nubMaI9mC6H3yZqJK1fNLjP94kpwL0rm6V+FQODILx8UtGNfZDZEOvQ8qGwqHwiETMZuYBXgbMQvQ28J9eTgFOhcQlakeLrm9g4nlS68jTxnakcJxFZHM/gui+d7qCX5nBvAGojrYgUSlsHoZImaAzidmVR7qJuGYrA/sNjt/S6m/gVs9mLsh0qH3L2VD4VA4pBZOJPIcDgNeQPOWV1WIJUL3EI39zqfczMYwWwBnAe8gcidmZ9rXx4jk8K8SMxsPFPzdWcB7gXcDO5Y8v48QVbsWA3cSMx4Kh8KRk15iFu1FTRjLpVQiHXr/UjYUDoVDamUu0aCpn2iOt1MTL+QVRI+Ny4llSqsybHd7ouzvO4mlVTmWim0gZjYuAn5C5G+sL/i72wD/CLwryVCZXJJHgHOA84D7iCTySR+gdxtt8CBvhnQoGyIdej9WNhQOhUPKcAyxBOkwIrF5GxqT17EmicVvgGuIJRy/zbTtGWn/P0SUw821v7cRswpfo/jMBun87Ql8hFhWVZYHgX8BvkCUCt6Y5Y6icPgwry4dCynWIbwWhtJ2F/lOi3TW/VjRUDgUDskVYOySAvZXE8nWcxowzu1ECdkfJtG4j/r6bFRjdyJB+yzgpZk+bHcClyXZ+CXRd6PQvZlYTnVECtpOyrA/9wJ/Ryw/25DtjqJw+FAfm/lJEI7JsK0laVuDvssinXU/VjYUDoVDcjMXODYF7IcmEdmOKKU7s47tPU7kPzyYXtcSy5Ouo/iypKIcSyTAv4w8pT0fJRLEv0QkideaM7EvcAoxu9FX8kP/DNFY8J+JJWhd/4BTONqKPmIJVH+Nn60VxOzgUkVDpPPux4qGwqFwSKOYTiRab5UC5oOSfOxJNNCr5dpZC9xMzGRck/7++yQg2ZYEjeBUIkH7xZRr9FdJx3kLsfTj68AT1D6rcDzRXPEYYvaoXtYD9xMzQ59LsqZwKBytYh6bGvxVYzXRL2Y5E1dxE5E2vR8rG16OCoc0k72Ibzd3AfYAtiVmO7ageo7HOiLvYTWRq3EHsSzpBmL5VKOYBvwFkb+xQ4Zr/B5iduM8nt1JuZb9+TOiueIu1Dc7NFLcfpXE57vpnCocIiKiaIjCIZ1/3wE2S69pSTJmEpWgtgW2HPFzw9fZE0Ri9UPA0ylYXkcsCVrXwH2dDfwt0V18WoYP2aXEUpCfEbMLtbIN8A/A+9P+lKlO9TTwPSJ3o979UThERETREIVDOoqZSUBGC8ea9Gom04klHn9DNNgry1PAfwL/TTQhrDXXZDaxrOuDwKsy7c+ngHOJWaKs51fhEBFRNEQUDmm7+9OIV7ULtFLtQm0gWxM9A94DvCnD9u4BPgp8nsgzqfVY+ojk2n7y9DJYRVT3OafO/VE4REREyRCFQ6QE2xHlZ98OvLbktoaIfIn/JJYx1cpUoizve4lE+96S+7MOuJWoTnVRQ+4oCoeIiLIhonCIjMtORCWos4ATS27r98CVwJeBH9f4uz1EYv0CImG8J8OxPUSUET4X+JHCISIiCocoHCLNZx/gFURZ3LIN/35LVKe6iJjpqIU9iJ4bZxDlhHOwAriQvB3ZFQ4REYVDpFS8oHDIZONA4GQiZ+LQktu6A7gCuIDoHVKEqUTi+lnEzMZBlK+UBZGvcRGRS3IDkcCucIiIiMIhCodIk9mXTTMcR5Tc1uokHf8GfLPg7+xAdDc/AziaSGLPwdPAfwGfJBLH1yocIiKicEg7CodnSLqdXYmux2cS3b3Lsj4Jx38QJWirBfo9RFngGUTp27cQy7lmZDqmZ4BfA/9OLKlq2g1EREQUDhGFQ+TZ7AAcCQyQp+8FwOXAEqLR3soq/396GvPIJDn7AnMzHtNviLyNC5N4KBwiIqJwiMIh0iJmEb0v3gOcnuMzBTwI/ILI57iWWNK0gcjNmEXMqrwCOCn9PScbiK7inyYSxZ9UOEREROEQhUOkdUwDdgf+mjydxiGWUa0G7gfuBe4iOn7PAbYHtgFeAOwIbJ75eB4DFgEfAx4nkscVDhERUThE4RBpIbOScPwVkVuRmyeImYbtiKpUjWIIuA74b6I8b9NvICIionCIKBwiz2UasaTqQ0QjwJ7M299ILHWa3uDjuAn4AvAd4E6FQ0REFA5ROETah1cTfTCOIJY+dRLrgEeIJPFzgNuT4CgcIiKicIjCIdImHAa8MYnH3h227w8DPyUaDl5G5G40xQQUDhERhUNkdHhQJV6YonCIRDL3IcTSqpM7aL/XAj8mKlP9CLinqXcUhUNEROEQUThECjENmE0kj/85+ZrwNZJ1wH1Ez48vAH9M/6ZwiIiIwiEdIxzVogmvNulmXkXkchyVBKSd+R1wKZG7cX1L7igKh4iIwiGicIgUpofojXES8C7gT9p4X9cD3wA+DtyQ/rvp0b/CISKicIgoHCI13k+BPYEzgdOAPYjlVu3EnUQH868TeRtPt+yOonCIiCgcIgqHSM1sARyahOOVSTrageEO5pcQeRvXtvyOonCIiCgcIgqHSF30Jul4fZKOXdpANn4BXANcDvyS6F6ucIiIiMIhCodIhzIDOBo4Pf25E9EtfEoTP7AbiL4atwIXA9+iSV3EFQ4REVE4ROEQaTzbAwcDLwFOJDqRN/MzcDsxq/Ez4DrgNiJBXOEQERGFQxQOkS5iHnAK0A/sD2xO5HrkTihfBzyTXrcTHcQvpU2WUCkcIiIKh4jCIdIYpgO7AXsR5XL7gJcC22Ye5wHg50S+xq+Ixn4rgUfa8o6icIiIKBwiCodIdnYB/hQ4ATgAmEvMdmwObEbMekwj+nqM/rxsTK91xNKoZ0a8HgZWAFcBy5JstPcdReEQEVE4RBQOkexsDmwH7EDkeOxO9O7YA9g5/b/ZwMwkHSNZBzwBPJQE407gbuAO4N707w+m1zqFQ0REFA5ROEQm8b2XqGS1OzHTsV+Sjh2AOcBWwNbpRRKNR4DHiNmL+4HfJtm4Of3b2o66oygcIiIKh4jCISLKhYiIKByicIiI8uEDW0REROFQOERE8VAyREREFA4RUT4UDBEREYVDRBSQWoL3nGJTixiMHlepEBERUThEpENkJGfwrhiIiIi0+XNf4RAREREREYVDREREREQ6Xjg8QyIiIiIionCIiIiIiIjCISIiIiIiCofCISIiIiIiCoeIiIiIiCgcIiIiIiKicCgcIiIiIiKicIiIiIiISDv6RRXhmKJwiIiIiIiIwiEiIiIiIt0lHJUqG9FCRERERERE4RAREREREYVDREREREQUDoVDREREREQUDhERERERUThEREREREThmJgp9Q5eEsd1XMd1XMd1XMd1XMd1XMdt83EVDsd1XMd1XMd1XMd1XMd1XMdVOBzXcR3XcR3XcR3XcR3XcR1X4fCNclzHdVzHdVzHdVzHdVzHdVyFw3Ed13Ed13Ed13Ed13Ed13FbLBwiIiIiIiJZrUfhEBERERERhUNERERERBQOERERERGRYf7/AAHqQY5TWrjtAAAAAElFTkSuQmCC'
      try {
        global.pdf.enableImage(dataUrl, recepientemail, recepientcolor)
        $('#templatedragabbleImageSign').show()
        $('#templatedragabbleImageSign').css("z-index", "9999999999999999999999999999999999999999999");
      } catch (error) {
        alert('Add a Document')
        $('#templatedragabbleImageSign').hide()
      }
    })

    var tinitialbtn = document.getElementById('tinitialbtn')
    tinitialbtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('trecepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      //pdf.enablePencil();
      // // // // // // // ////console.log('signpress');
      var dataUrl =
        'data:image/png;base64,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'
      try {
        $('#templatedragabbleImageInitial').show()
        $('#templatedragabbleImageInitial').css("z-index", "9999999999999999999999999999999999999999999");
        global.pdf.enableImage(dataUrl, recepientemail, recepientcolor)
      } catch (error) {
        alert('Add a Document')
        $('#templatedragabbleImageInitial').hide()
      }
    })

    var topenfilebtn = document.getElementById('topenfilebtn')
    topenfilebtn.addEventListener('click', function (event) {
      $('.icon-color').removeClass('icon-color')
      $('.tool.active').removeClass('active')
      document.getElementById('tfileinput').click()
    })

    var timagebtn = document.getElementById('timagebtn')
    timagebtn.addEventListener('click', function (event) {
      $('.icon-color').removeClass('icon-color')
      $('.tool.active').removeClass('active')
      document.getElementById('imageinput').click()
    })

    function clearPDF() {
      const myNode = document.getElementById('tpdf-container')
      myNode.innerHTML = ''
    }

    function clickFile() {
      $('.icon-color').removeClass('icon-color')
      var inputtag = document.createElement('span')
      inputtag.innerHTML =
        '<input id="fileinput" type="file" accept="application/pdf" value="Click me" onchange="openPDF(this)" style="display:none;">'
      document.getElementById('toolbar').appendChild(inputtag)
      document.getElementById('fileinput').click()
    }

    function clickImageFile() {
      $('.icon-color').removeClass('icon-color')
      var imagetag = document.createElement('span')
      imagetag.innerHTML =
        '<input id="imageinput" type="file" accept="image/*" value="Click me" onchange="openImage(this)" style="display:none;">'
      document.getElementById('toolbar').appendChild(imagetag)
      document.getElementById('imageinput').click()
    }

    function clearPage() {
      try {
        global.pdf.clearActivePage()
      } catch (error) {
        alert('Please add a document first!')
      }
    }

    var colorArray = [
      '#E6EE9C',
      '#B6EDD8',
      '#FFCDD3',
      '#90CAF9',
      '#E1BEE7',
      '#A5D6A7',
      '#B3E2E3',
      '#BCAAA4',
      '#E0E0E0',
      '#FFAB00',
      '#64DD17',
      '#00B8D4',
      '#00BFA5',
    ]

    function getCookie(name) {
      var nameEQ = name + '='
      var ca = document.cookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
      }
      return null
    }

    try {
      userid = getCookie('uid')

      if (userid) {
        //console.log('user logged in');
        //console.log(userid);
        email = getCookie('useremail')

        var optiondefault = document.createElement('option')
        optiondefault.value = email
        optiondefault.style.backgroundColor = '#BDBDBD'
        optiondefault.innerHTML = 'Default(Me)'
        $('#trecepientselect').append(optiondefault)

        try {
          axios
            .post('/getuserdata', {
              UserID: userid,
            })
            .then(function (response) {
              console.log(response)
              if (response.data.Status === 'user found') {
                if (response.data.user.SignID != '') {
                  if (response.data.user.SignImage) {
                    signimage = response.data.user.SignImageBox;
                    initialimage = response.data.user.InitialsBox;
                    username = response.data.user.UserFirstName + ' ' + response.data.user.UserLastName;
                    usertitle = response.data.user.UserTitle;
                  }
                }
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        } catch (error) {}

        try {
          if (TemplateDataVar.TemplateDataPath != '') {
            //console.log(TemplateDataVar.TemplateDataPath);
            global.pdf = new TemplateAnnotate(
              'tpdf-container',
              'toolbar',
              TemplateDataVar.TemplateDataPath,
              TemplateDataVar.TemplateDocName,
              {
                onPageUpdated: (page, oldData, newData) => {
                  //modal[0].style.display = "block";
                  //console.log(page, oldData, newData);
                },
              }
            )
          } else {
            //console.log('No Data File Found');
          }
          var tpeople = []
          tpeople = TemplateDataVar.TemplateRecepientArray
          //console.log(tpeople);
          tpeople.forEach(function (item, index) {
            if (tpeople[index].option == 'Needs to Sign') {
              var toption = document.createElement('option')
              toption.value = tpeople[index].email
              toption.style.backgroundColor = colorArray[index]
              toption.innerHTML = '' + tpeople[index].name + ''
              $('#trecepientselect').append(toption)
            }
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        // no user
        //window.location.hash = "#/auth/login";
        modal[0].style.display = 'none'
        modal[4].style.display = 'block'
      }
    } catch (err) {
      //console.log('no data');
      modal[0].style.display = 'none'
    }

    window.onclick = function (e) {
      if (e.target == modal[0]) {
        modal[2].style.display = 'none'
        modal[3].style.display = 'none'
      }
    }

    var tgetlinkbtn = document.getElementById('tgetlinkbtn')
    tgetlinkbtn.addEventListener('click', function (event) {
      try {
        modal[1].style.display = 'block'
        global.pdf.savetoCloudPdf()
      } catch (error) {
        alert('There are no changes to save')
      }
    })

    
  }

  render() {
    const {showSignModal, showInitialModal} = this.state;
    return (
      <div className="templatepdfAnNotateContainer">
        <img
          id="templatedragabbleImageSign"
          style={{zIndex: '99999999999999999999999999999999999999999'}}
          src={require('../../assets/img/icons/common/signatureimg.png')}
        />

        <img
          id="templatedragabbleImageText"
          style={{zIndex: '99999999999999999999999999999999999999999'}}
          src={require('../../assets/img/icons/common/textimg.png')}
        />

      <img
          id="templatedragabbleImageInitial"
          style={{zIndex: '99999999999999999999999999999999999999999'}}
          src={require('../../assets/img/icons/common/initialimg.png')}
        />
        <Row>
          <div id="teditortoolbar" className="editortoolbar">
            <button id="tzoominbtn" color="neutral" className="toolzoom">
              <i className="material-icons">zoom_in</i>
            </button>
            <button id="tzoomoutbtn" color="neutral" className="toolzoom">
              <i className="material-icons">zoom_out</i>
            </button>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <p>Please wait while we set things up for you.</p>
                <div className="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <p>Please wait while we save the changes you have made.</p>
                <div className="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <div className="mb-4 mb-xl-0">
                  <h5>Please enter your Initials: </h5>
                </div>
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
                    <Button
                      id="taddinitialmodalbtn"
                      className="close-btn float-right px-4"
                    >
                      {' '}
                      Add
                    </Button>
                  </Col>
                  <Col lg="6">
                    <Button
                      id="tcloseinitialmodalbtn"
                      className="cancel-btn float-left px-4"
                    >
                      {' '}
                      Close
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <Col lg="2">
            <div id="ttoolbar" className="toolbar">
              <div className="divider" id="recepientscolumn">
                <div className="col my-3 p-2">
                  <h6 className="text-uppercase text-black ls-1 mb-1 float-left">
                    Recepients
                  </h6>
                </div>
                <hr className="my-1" />
              </div>
              <select
                id="trecepientselect"
                className="form-control selectpicker form-control-sm"
              ></select>
              <div className="divider">
                <div className="col my-3 p-2">
                  <h6 className="text-uppercase text-black ls-1 mb-1 float-left">
                    File
                  </h6>
                </div>
                <hr className="my-1" />
              </div>
              <button id="topenfilebtn" className="tool">
                <i className="material-icons">insert_drive_file</i>Open
              </button>
              <button id="tsavebtn" color="neutral" className="tool">
                <i className="material-icons">get_app</i>Save
              </button>
              <div className="divider" id="fieldscolumn">
                <div className="col my-3 p-2">
                  <h6 className="text-uppercase text-black ls-1 mb-1 float-left">
                    Fields
                  </h6>
                </div>
                <hr className="my-1" />
              </div>
              <button id="tsignaturebtn" color="neutral" className="tool">
                <i className="material-icons">gesture</i>Signature
              </button>
              <button id="timagebtn" color="neutral" className="tool">
                <i className="material-icons">image</i>Image
              </button>
              <button id="tdatebtn" color="neutral" className="tool">
                <i className="material-icons">today</i>Date
              </button>
              <button id="tpenbtn" color="neutral" className="tool">
                <i className="material-icons">edit</i>Pen
              </button>
              <button id="ttextbtn" color="neutral" className="tool">
                <i className=" material-icons">text_fields</i>Text
              </button>
              <button id="tcirclebtn" color="neutral" className="tool">
                <i className="material-icons">panorama_fish_eye</i>Circle
              </button>
              <button id="trectanglebtn" color="neutral" className="tool">
                <i className="material-icons">crop_din</i>Rectangle
              </button>
              <div className="divider">
                <div className="col my-3 p-2">
                  <h6 className="text-uppercase text-black ls-1 mb-1 float-left">
                    Tools
                  </h6>
                </div>
                <hr className="my-1" />
              </div>
              <button id="tselectbtn" color="neutral" className="tool">
                <i className="material-icons">pan_tool</i>Select
              </button>
              <button id="tdeletebtn" color="neutral" className="tool">
                <i className="material-icons">delete_forever</i>Delete
              </button>
              <button id="tclearbtn" color="neutral" className="tool">
                <i className="material-icons">clear</i>Clear
              </button>
              <input
                id="tfileinput"
                type="file"
                accept="application/pdf"
              ></input>
              <input id="timageinput" type="file" accept="image/*"></input>

              <Button id="taddobjbtn" className="tool"></Button>

              <Button
                className="color-tool tool"
                id="selectcolor"
                style={{ backgroundColor: '#000' }}
              ></Button>
              <input
                type="color"
                className="color-tool"
                id="colortool"
                name="favcolor"
              ></input>
            </div>
          </Col>

          <Col lg="8">
            <Row>
              <div id="tcontainer">
                <div
                  id="tpdf-container"
                  style={{
                    height: '550px',
                  }}
                ></div>
              </div>
            </Row>

            <div>
              <Row>
                <Col lg="12">
                  <Button
                    id="tgetlinkbtn"
                    className="m-2 float-right px-4"
                    color="primary"
                    type="button"
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
          <div>
          <SignManager visible={showSignModal}
                    onSave={this.saveSign}
                    onClose={this.toggleSignModal} />
              <InitialManager visible={showInitialModal}
                    onSave={this.saveInitial}
                    onClose={this.toggleInitialModal} />
          </div>
          <Col lg="2">
            <div id="trecepientsbar" className="recepientsbar">
              <div className="divider" id="tcustomfieldscolumn">
                <div className="col my-3 p-2">
                  <h6 className="text-uppercase text-black ls-1 mb-1 float-left">
                    Custom Fields
                  </h6>
                </div>
                <hr className="my-1" />
              </div>
              <button id="tinitialbtn" color="neutral" className="tool">
                <i className="material-icons">text_format</i>Initial
              </button>
              <button id="tnamebtn" color="neutral" className="tool">
                <i className=" material-icons">person</i>Name
              </button>
              <button id="tcompanybtn" color="neutral" className="tool">
                <i className=" material-icons">apartment</i>Company
              </button>
              <button id="ttitlebtn" color="neutral" className="tool">
                <i className=" material-icons">work</i>Title
              </button>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default TemplateAnnotate
