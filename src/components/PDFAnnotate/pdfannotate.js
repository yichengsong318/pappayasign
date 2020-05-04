import classnames from 'classnames'
import { fabric } from 'fabric'
import $ from 'jquery'
import * as jsPDF from 'jspdf'
import React from 'react'
import {
  Button,
  Col,
  FormGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap'
import DataVar from '../../variables/data'
import './pdfannotate.css'
//import fabric from 'fabric-webpack'
import './styles.css'

const axios = require('axios').default
var PDFJS = require('pdfjs-dist')
//var fabric = require("fabric-webpack");
//var jsPDF = require("jspdf-react");
var pdfPath = './sample.pdf'
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry')

class PDFAnnotate extends React.Component {
  state = {
    tabs: 1,
  }
  toggleNavs = (e, state, index) => {
    e.preventDefault()
    this.setState({
      [state]: index,
    })
  }

  componentDidMount() {
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
    var owner = ''
    var grabbedcolor = ''
    var recepientrgbval = ''
    var docname = ''
    var action = ''
    var signorderval = false
    var dbpeople = []
    var key = ''
    modal[0].style.display = 'block'

    var PDFAnnotate = function (
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
              try {
                document.getElementById(inst.container_id).appendChild(canvas)
              } catch (error) {}
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
            e.target.lockScalingFlip = false
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
              // // // // // // // ////console.log("Mouse up", e);
              $('#dragabbleImageText').hide()
              $('#dragabbleImageSign').hide()
              //fabricMouseHandler(e, fabricObj);
              try {
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

                    ////console.log(e.target);

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
                    // // // // // // // ////console.log('Object selected');
                    e.target.lockMovementX = false
                    e.target.lockMovementY = false
                    var id = fabricObj.getObjects().indexOf(e.target)
                    e.target.selectable = true
                    fabricObj.setActiveObject(fabricObj.item(id))
                    fabricObj.requestRenderAll()
                    e.target.hasControls = true
                    e.target.set('id', email)
                  } else {
                    // // // // // // // ////console.log('Object not selected');
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
              } catch (error) {}
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
                ////console.log(objType);
                ////console.log(obj);
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
                    doubleclickobj = fabricObj.findTarget(e)
                    ////console.log(doubleclickobj);
                    modal[6].style.display = 'block'
                    SignaturePad()
                    document.getElementById(
                      'signature-container'
                    ).style.visibility = 'visible'
                    document.getElementById(
                      'signature-container'
                    ).style.height = '100%'
                    document.getElementById('tabcontent').style.display =
                      'block'
                    document.getElementById('image-container').style.display =
                      'block'
                    obj.set('backgroundColor', 'transparent')
                    obj.set('id', email)
                  } else if (objType === 'i-text') {
                    obj.set('backgroundColor', 'transparent')
                    fabricObj.renderAll()
                    obj.set('id', email)
                  }
                } else {
                  obj.lockMovementX = true
                  obj.lockMovementY = true
                  // // // // // // // ////console.log('Email Id is different:' + objid);
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

        try {
          var addobjbtn = document.getElementById('addobjbtn')
          addobjbtn.addEventListener('click', function (event) {
            pdf.AddObj()
          })
          addobjbtn.click()
        } catch (error) {}
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
      $('#pdf-container').css("z-index", "-1");
      $('#container').css("z-index", "-1");
      $('.canvas').css("z-index", "-1");
    }

    PDFAnnotate.prototype.AddObj = function () {
      try {
        if (type == 'home') {
          modal[0].style.display = 'none'
        } else {
          try {
            if (fileid == '') {
              // // // // // // // ////console.log('no file id found');
              modal[0].style.display = 'none'
            } else {
              var inst = this
              // // // // // // // ////console.log('file id found');
              axios
                .post('/getdocdata', {
                  DocumentID: fileid,
                })
                .then(function (response) {
                  console.log(response)
                  if (response.data.Status === 'doc data done') {
                    var DocumentData = response.data.Data
                    $.each(inst.fabricObjects, function (index, fabricObj) {
                      ////console.log(index);

                      fabricObj.loadFromJSON(DocumentData[index], function () {
                        fabricObj.renderAll()
                        fabricObj.trigger('mouse:up', {
                          pageX: 700,
                          pageY: 400,
                        })
                        fabricObj.getObjects().forEach(function (targ) {
                          ////console.log(targ);
                          targ.selectable = false
                          targ.hasControls = false
                        })
                        modal[0].style.display = 'none'
                      })
                    })
                  }
                })
                .catch(function (error) {
                  console.log(error)
                  modal[0].style.display = 'none'
                })
            }
          } catch (error) {}
        }
      } catch (error) {
        modal[0].style.display = 'none'
      }
    }

    PDFAnnotate.prototype.enableSelector = function () {
      var inst = this
      inst.active_tool = 0
      if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.isDrawingMode = false
        })
      }
    }

    PDFAnnotate.prototype.enablePencil = function () {
      var inst = this
      inst.active_tool = 1
      if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.isDrawingMode = true
        })
      }
    }

    PDFAnnotate.prototype.enableAddText = function (
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

    PDFAnnotate.prototype.enableImage = function (
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

    PDFAnnotate.prototype.enableRectangle = function () {
      var inst = this
      var fabricObj = inst.fabricObjects[inst.active_canvas]
      inst.active_tool = 5
      if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.isDrawingMode = false
        })
      }
    }

    PDFAnnotate.prototype.enableCircle = function () {
      var inst = this
      var fabricObj = inst.fabricObjects[inst.active_canvas]
      inst.active_tool = 6
      if (inst.fabricObjects.length > 0) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.isDrawingMode = false
        })
      }
    }

    PDFAnnotate.prototype.deleteSelectedObject = function () {
      var inst = this
      var activeObject = inst.fabricObjects[
        inst.active_canvas
      ].getActiveObject()
      if (activeObject) {
        inst.fabricObjects[inst.active_canvas].remove(activeObject)
      }
    }

    PDFAnnotate.prototype.ZoomIn = function () {
      var inst = this

      //jsonData =  inst.fabricObjects.toJSON();

      var container = document.getElementById(inst.container_id)
      var scaleX =
        container.getBoundingClientRect().width / container.offsetWidth
      ////console.log(scaleX)
      scaleX = scaleX + 0.1
      container.style.transform = 'scale(' + scaleX + ')'
    }

    PDFAnnotate.prototype.ZoomOut = function () {
      var inst = this
      var container = document.getElementById(inst.container_id)
      var scaleX =
        container.getBoundingClientRect().width / container.offsetWidth
      ////console.log(scaleX)
      scaleX = scaleX - 0.1
      container.style.transform = 'scale(' + scaleX + ')'
    }

    PDFAnnotate.prototype.savePdf = function () {
      var inst = this
      var doc = new jsPDF()
      $.each(inst.fabricObjects, function (index, fabricObj) {
        if (index != 0) {
          doc.addPage()
          doc.setPage(index + 1)
        }
        doc.addImage(fabricObj.toDataURL(), 'png', 0, 0)
      })
      doc.save('pappayasign_' + inst.filename + '')
      modal[1].style.display = 'none'
    }

    PDFAnnotate.prototype.checkallupdated = function () {
      var inst = this
      var count = 0
      if (useridother == '') {
        pdf.savetoCloudPdf()
      } else if (userid == useridother) {
        pdf.savetoCloudPdf()
      } else if (userid != useridother) {
        $.each(inst.fabricObjects, function (index, fabricObj) {
          fabricObj.getObjects().forEach(function (targ) {
            ////console.log(targ);
            targ.selectable = false
            targ.hasControls = false
            if (targ.backgroundColor === recepientrgbval) {
              count = count + 1
              ////console.log(count);
            }
          })
        })
        if (count === 0) {
          pdf.savetoCloudPdf()
        } else {
          alert('Please add all details to continue')
          modal[1].style.display = 'none'
        }
      }
    }

    PDFAnnotate.prototype.savetoCloudPdf = function () {
      var inst = this

      var today = new Date().toLocaleString().replace(',', '')
      // // // // // // // ////console.log('action:'+action);

      if (
        action === '' ||
        action === 'correct' ||
        typeof action === 'undefined'
      ) {
        if (useridother == '') {
          // // // // // // // ////console.log('fileid:'+fileid);
          if (fileid === '') {
            filename = randomString(13)
            // // // // // // // ////console.log('filename:'+filename);
          } else {
            filename = fileid
          }

          axios
            .post('/docupload', {
              UserID: userid,
              filename: filename,
              filedata: DataVar.DataPath,
            })
            .then(function (response) {
              console.log(response)
              if (response.data === 'document upload success') {
                // // // // // // // ////console.log('completed');
                var dataarray = []
                var jsonData = []
                $.each(inst.fabricObjects, function (index, fabricObj) {
                  //////console.log(fabricObj.toJSON());
                  jsonData[index] = fabricObj.toJSON()
                  ////console.log(jsonData[index]);
                  ////console.log(JSON.stringify(jsonData[index]));
                  dataarray.push(JSON.stringify(jsonData[index]))
                })

                axios
                  .post('/adddocumentdata', {
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
                    Reciever: [],
                  })
                  .then(function (response) {
                    console.log(response)
                    if (
                      response.data === 'insert done' ||
                      response.data === 'update done'
                    ) {
                      document.getElementById(
                        'emailbtncontainer'
                      ).style.display = 'block'
                      url =
                        process.env.REACT_APP_BASE_URL +
                        '/#/admin/sign?id=' +
                        encodeURIComponent(filename) +
                        '&type=db&u=' +
                        userid
                      modal[1].style.display = 'none'
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
        } else if (userid == useridother) {
          var jsonData = []
          var dataarray = []
          var doc = new jsPDF()

          $.each(inst.fabricObjects, function (index, fabricObj) {
            //////console.log(fabricObj.toJSON());
            jsonData[index] = fabricObj.toJSON()
            ////console.log(jsonData[index]);
            ////console.log(JSON.stringify(jsonData[index]));
            dataarray.push(JSON.stringify(jsonData[index]))

            if (index != 0) {
              doc.addPage()
              doc.setPage(index + 1)
            }
            doc.addImage(fabricObj.toDataURL(), 'png', 0, 0)
          })
          var dataURI = doc.output('datauristring')
          var arraybuffer = new Uint8Array(doc.output('arraybuffer'))

          axios
            .post('/updatedocumentdata', {
              DocumentID: filename,
              DateStatus: today,
              Data: dataarray,
            })
            .then(function (response) {
              console.log(response)
              if (
                response.data === 'insert done' ||
                response.data === 'update done'
              ) {
                document.getElementById('emailbtncontainer').style.display =
                  'block'
                url =
                  process.env.REACT_APP_BASE_URL +
                  '/#/admin/sign?id=' +
                  encodeURIComponent(filename) +
                  '&type=db&u=' +
                  userid
                modal[1].style.display = 'none'
              }
            })
            .catch(function (error) {
              console.log(error)
              modal[1].style.display = 'none'
            })
        } else if (userid != useridother) {
          var completedcount = 0
          var recievercount = 0
          var totalcount = 0
          var jsonData = []
          var dataarray = []
          var doc = new jsPDF()

          $.each(inst.fabricObjects, function (index, fabricObj) {
            //////console.log(fabricObj.toJSON());
            jsonData[index] = fabricObj.toJSON()
            ////console.log(jsonData[index]);
            ////console.log(JSON.stringify(jsonData[index]));
            dataarray.push(JSON.stringify(jsonData[index]))
          })

          axios
            .post('/updatedocumentdata', {
              DocumentID: filename,
              DateStatus: today,
              Data: dataarray,
            })
            .then(function (response) {
              console.log(response)
              if (
                response.data === 'insert done' ||
                response.data === 'update done'
              ) {
                var recepientkey = ''
                completedcount = 0
                recievercount = 0

                axios
                  .post('/getReciever', {
                    DocumentID: filename,
                  })
                  .then(function (response) {
                    console.log(response)
                    if (response.data.Status === 'got recievers') {
                      var recievers = response.data.Reciever
                      var OwnerEmail = response.data.OwnerEmail
                      var status = response.data.DocStatus

                      recievers.forEach(function (item, index) {
                        recievercount = recievers.length
                        if (recievers[index].RecepientStatus === 'Completed') {
                          completedcount = completedcount + 1
                        }
                        if (recievers[index].RecepientEmail === email) {
                          var recepient_index = index
                          recepientkey = index
                          ////console.log(recepient_index);

                          recievers[index].RecepientStatus = 'Completed'
                          recievers[index].RecepientDateStatus = today
                          completedcount = completedcount + 1

                          axios
                            .post('/updaterecieverdata', {
                              Reciever: recievers,
                              DocumentID: filename,
                            })
                            .then(function (response) {
                              console.log(response)
                              if (response.data === 'update reciever done') {
                                axios
                                  .post('/getRequests', {
                                    UserID: userid,
                                  })
                                  .then(function (response) {
                                    console.log(response)
                                    if (
                                      response.data.Status === 'got request'
                                    ) {
                                      var request = response.data.Request
                                      var status = response.data.DocStatus

                                      request.forEach(function (item, index) {
                                        if (
                                          request[index].DocumentID === filename
                                        ) {
                                          var recepient_index = index
                                          ////console.log(recepient_index);
                                          request[index].RecepientStatus =
                                            'Completed'
                                          request[
                                            index
                                          ].RecepientDateStatus = today

                                          axios
                                            .post('/updaterequestdata', {
                                              UserID: userid,
                                              Request: request,
                                            })
                                            .then(function (response) {
                                              console.log(response)
                                            })
                                            .catch(function (error) {
                                              console.log(error)
                                              alert(
                                                'Error, Please try again later'
                                              )
                                              modal[1].style.display = 'none'
                                            })
                                        }
                                      })
                                    }
                                  })
                                  .catch(function (error) {
                                    console.log(error)
                                    alert('Error, Please try again later')
                                    modal[1].style.display = 'none'
                                  })
                              }
                            })
                            .catch(function (error) {
                              console.log(error)
                              alert('Error, Please try again later')
                              modal[1].style.display = 'none'
                            })

                          // // // // // // // ////console.log('Completed Log: '+completedcount);
                          // // // // // // // ////console.log('Reciever Length: '+ recievercount);

                          if (completedcount == recievercount) {
                            $.each(inst.fabricObjects, function (
                              index,
                              fabricObj
                            ) {
                              //////console.log(fabricObj.toJSON());
                              if (index != 0) {
                                doc.addPage()
                                doc.setPage(index + 1)
                              }
                              doc.addImage(fabricObj.toDataURL(), 'png', 0, 0)
                            })
                            var dataURI = doc.output('datauristring')

                            axios
                              .post('/sendmailattachments', {
                                to: OwnerEmail,
                                body:
                                  '<div><p>Hello , Please find the signed document in the attachment.</p></div>',
                                subject:
                                  'PappayaSign: ' +
                                  inst.filename +
                                  ' :Completed Document',
                                attachments: {
                                  // utf-8 string as an attachment
                                  filename:
                                    'PappayaSign_Completed' +
                                    inst.filename +
                                    '.pdf',
                                  path: dataURI,
                                },
                              })
                              .then(function (response) {
                                console.log(response)
                              })
                              .catch(function (error) {
                                alert('Error, Please try again later')
                                modal[1].style.display = 'none'
                              })

                            dbpeople.forEach(function (item, index) {
                              var recepientName = dbpeople[index].name
                              var recepientEmail = dbpeople[index].email

                              axios
                                .post('/sendmailattachments', {
                                  to: recepientEmail,
                                  body:
                                    '<div><p>Hello ' +
                                    recepientName +
                                    ', Please find the signed document in the attachment.</p></div>',
                                  subject:
                                    'PappayaSign: ' +
                                    inst.filename +
                                    ' :Completed Document',
                                  attachments: {
                                    // utf-8 string as an attachment
                                    filename:
                                      'PappayaSign_Completed' +
                                      inst.filename +
                                      '.pdf',
                                    path: dataURI,
                                  },
                                })
                                .then(function (response) {
                                  console.log(response)
                                  // // // // // // // ////console.log('doc sent to next user');
                                })
                                .catch(function (error) {
                                  //alert('Error, Please try again later');
                                  modal[1].style.display = 'none'
                                })
                            })
                            axios
                              .post('/updatedocumentstatus', {
                                DocumentID: filename,
                                Status: 'Completed',
                              })
                              .then(function (response) {
                                console.log(response)
                                if (
                                  response.data === 'insert done' ||
                                  response.data === 'update done'
                                ) {
                                  window.location.hash = '#/admin/sendsuccess'
                                }
                              })
                              .catch(function (error) {
                                console.log(error)
                                alert('Error, Please try again later')
                                modal[1].style.display = 'none'
                              })
                          }

                          if (signorderval === true) {
                            var nextuser = parseInt(recepientkey) + 1
                            var currentuser = parseInt(recepientkey)
                            var nextuseremail =
                              recievers[nextuser].RecepientEmail
                            var nextusername = recievers[nextuser].RecepientName
                            ////console.log(nextuser);
                            if (currentuser === totalcount) {
                              // // // // // // // ////console.log('no additional users left');
                            } else if (currentuser < totalcount) {
                              try {
                                var nextuserurl =
                                  process.env.REACT_APP_BASE_URL +
                                  '/#/admin/sign?id=' +
                                  filename +
                                  '&type=db&u=' +
                                  useridother +
                                  '&key=' +
                                  nextuser +
                                  ''

                                axios
                                  .post('/getrequestuser', {
                                    UserEmail: nextuseremail,
                                  })
                                  .then(function (response) {
                                    console.log(response)
                                    if (response.data.Status === 'user found') {
                                      axios
                                        .post('/postrequest', {
                                          UserID: response.data.UserID,
                                          DocumentName: docname,
                                          DocumentID: filename,
                                          From: useridother,
                                          FromEmail: email,
                                          RecepientStatus: 'Need to Sign',
                                          RecepientDateStatus: today,
                                        })
                                        .then(function (response) {
                                          console.log(response)
                                          if (response.data === 'user found') {
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
                                  })

                                axios
                                  .post('/sendmail', {
                                    to: nextuseremail,
                                    body:
                                      `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign.</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, ` +
                                      nextusername +
                                      `</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. </p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="` +
                                      nextuserurl +
                                      `" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`,
                                    subject: 'PappayaSign: Sign Request',
                                  })
                                  .then(function (response) {
                                    console.log(response)
                                    window.location.hash = '#/admin/sendsuccess'
                                    // // // // // // // ////console.log('doc sent to next user');
                                  })
                                  .catch(function (error) {})
                              } catch (error) {}
                            }
                          }
                        }
                      })
                    }
                    modal[1].style.display = 'none'
                    window.location.hash = '#/admin/sendsuccess'
                  })
                  .catch(function (error) {
                    console.log(error)
                  })
              }
            })
            .catch(function (error) {
              console.log(error)
              modal[1].style.display = 'none'
            })
        }
      } else if (action === 'create') {
        filename = randomString(13)
        // // // // // // // ////console.log('filename:'+filename);

        axios
          .post('/docupload', {
            UserID: userid,
            filename: filename,
            filedata: DataVar.DataPath,
          })
          .then(function (response) {
            console.log(response)
            if (response.data === 'document upload success') {
              // // // // // // // ////console.log('completed');
              var dataarray = []
              var jsonData = []
              $.each(inst.fabricObjects, function (index, fabricObj) {
                //////console.log(fabricObj.toJSON());
                jsonData[index] = fabricObj.toJSON()
                ////console.log(jsonData[index]);
                ////console.log(JSON.stringify(jsonData[index]));
                dataarray.push(JSON.stringify(jsonData[index]))
              })

              axios
                .post('/adddocumentdata', {
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
                  Reciever: [],
                })
                .then(function (response) {
                  console.log(response)
                  if (
                    response.data === 'insert done' ||
                    response.data === 'update done'
                  ) {
                    document.getElementById('emailbtncontainer').style.display =
                      'block'
                    url =
                      process.env.REACT_APP_BASE_URL +
                      '/#/admin/sign?id=' +
                      encodeURIComponent(filename) +
                      '&type=db&u=' +
                      userid
                    modal[1].style.display = 'none'
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

    PDFAnnotate.prototype.setBrushSize = function (size) {
      var inst = this
      $.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.freeDrawingBrush.width = size
      })
    }

    PDFAnnotate.prototype.setColor = function (color) {
      var inst = this
      inst.color = color
      $.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.freeDrawingBrush.color = color
      })
    }

    PDFAnnotate.prototype.setBorderColor = function (color) {
      var inst = this
      inst.borderColor = color
    }

    PDFAnnotate.prototype.setFontSize = function (size) {
      this.font_size = size
    }

    PDFAnnotate.prototype.setBorderSize = function (size) {
      this.borderSize = size
    }

    PDFAnnotate.prototype.clearActivePage = function () {
      var inst = this
      $.each(inst.fabricObjects, function (index, fabricObj) {
        var bg = fabricObj.backgroundImage
        fabricObj.clear()
        fabricObj.setBackgroundImage(bg, fabricObj.renderAll.bind(fabricObj))
      })
    }

    PDFAnnotate.prototype.Reload = function () {
      var inst = this
      $.each(inst.fabricObjects, function (index, fabricObj) {
        fabricObj.renderAll()
      })
      // // // // // // // ////console.log('reloaded');
    }

    PDFAnnotate.prototype.serializePdf = function () {
      var inst = this
      return JSON.stringify(inst.fabricObjects, null, 4)
    }

    PDFAnnotate.prototype.loadFromJSON = function (jsonData) {
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
      .getElementById('recepientselect')
      .addEventListener('change', function () {
        var select = document.getElementById('recepientselect')
        recepientcolor =
          select.options[select.selectedIndex].style.backgroundColor
        ////console.log(recepientcolor);
        if (recepientcolor != 'rgb(189, 189, 189)') {
          document.getElementById(
            'dragabbleImageSign'
          ).style.backgroundColor = recepientcolor
          document.getElementById(
            'dragabbleImageText'
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
            'dragabbleImageSign'
          ).style.backgroundColor = recepientcolor
          document.getElementById(
            'dragabbleImageText'
          ).style.backgroundColor = recepientcolor
        }
      })

    document.addEventListener('mousemove', function (e) {
      $('#dragabbleImageSign').css({
        left: e.clientX - 200,
        top: e.clientY - 70,
      })
      $('#dragabbleImageText').css({
        left: e.clientX - 40,
        top: e.clientY - 40,
      })
    })

    document.addEventListener('dragover', function (e) {
      $('#dragabbleImageSign').css({
        left: e.clientX - 200,
        top: e.clientY - 70,
      })
      $('#dragabbleImageText').css({
        left: e.clientX - 40,
        top: e.clientY - 40,
      })
    })

    $('#dragabbleImageSign').hide()
    $('#dragabbleImageText').hide()
    recepientcolor = '#bdbdbd'

    document.getElementById(
      'dragabbleImageSign'
    ).style.backgroundColor = recepientcolor
    document.getElementById(
      'dragabbleImageText'
    ).style.backgroundColor = recepientcolor

    document
      .getElementById('fileinput')
      .addEventListener('input', function (input) {
        try {
          ////console.log(input.target.value);
          ////console.log(input.srcElement.files[0].name);

          var file = input.srcElement.files[0]
          ////console.log(input.srcElement.files[0].name);

          var reader = new FileReader()
          reader.readAsDataURL(file)

          reader.onload = function () {
            var url = reader.result
            clearPDF()
            modal[0].style.display = 'block'
            try {
              pdf = new PDFAnnotate(
                'pdf-container',
                'toolbar',
                url,
                input.srcElement.files[0].name
              )
            } catch (error) {
              alert('Please Select a Valid Document')
            }
          }

          reader.onerror = function () {
            ////console.log(reader.error);
            alert('Error Opening File')
          }
        } catch (error) {
          console.log(error)
        }
      })

    document
      .getElementById('imageinput')
      .addEventListener('input', function (input) {
        try {
          var select = document.getElementById('recepientselect')
          recepientemail = select.options[select.selectedIndex].value
          ////console.log(input.target.value);
          ////console.log(input.srcElement.files[0].name);
          var file = input.srcElement.files[0]
          ////console.log(input.srcElement.files[0].name);

          var reader = new FileReader()
          reader.readAsDataURL(file)

          reader.onload = function () {
            var url = reader.result
            //////console.log(url);
            try {
              pdf.enableImage(url, recepientemail, recepientcolor)
            } catch (error) {
              alert('Invalid Image')
            }
          }

          reader.onerror = function () {
            ////console.log(reader.error);
            alert('Error Opening File')
          }
        } catch (error) {
          console.log(error)
        }
      })

    document.getElementById('zoominbtn').addEventListener(
      'click',
      function () {
        pdf.ZoomIn()
      },
      false
    )

    document.getElementById('zoomoutbtn').addEventListener(
      'click',
      function () {
        pdf.ZoomOut()
      },
      false
    )

    var clearbtn = document.getElementById('clearbtn')
    clearbtn.addEventListener('click', function (event) {
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      try {
        pdf.clearActivePage()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var deletebtn = document.getElementById('deletebtn')
    deletebtn.addEventListener('click', function (event) {
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      try {
        pdf.deleteSelectedObject()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var savebtn = document.getElementById('savebtn')
    savebtn.addEventListener('click', function (event) {
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      modal[1].style.display = 'block'
      try {
        pdf.savePdf()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var selectbtn = document.getElementById('selectbtn')
    selectbtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      try {
        pdf.enableSelector()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var rectanglebtn = document.getElementById('rectanglebtn')
    rectanglebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      try {
        pdf.enableRectangle()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var circlebtn = document.getElementById('circlebtn')
    circlebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      try {
        pdf.enableCircle()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var textbtn = document.getElementById('textbtn')
    textbtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('recepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      ////console.log(recepientemail);
      try {
        pdf.enableAddText('Text', recepientemail, recepientcolor)
        $('#dragabbleImageText').show()
        $('#dragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
        
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var namebtn = document.getElementById('namebtn')
    namebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('recepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      try {
        pdf.enableAddText('Name', recepientemail, recepientcolor)
        $('#dragabbleImageText').show()
        $('#dragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var companybtn = document.getElementById('companybtn')
    companybtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('recepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      try {
        pdf.enableAddText('Company', recepientemail, recepientcolor)
        $('#dragabbleImageText').show()
        $('#dragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var titlebtn = document.getElementById('titlebtn')
    titlebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('recepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      try {
        pdf.enableAddText('Title', recepientemail, recepientcolor)
        $('#dragabbleImageText').show()
        $('#dragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var initialbtn = document.getElementById('initialbtn')
    initialbtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      modal[5].style.display = 'block'
      var select = document.getElementById('recepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
    })

    var datebtn = document.getElementById('datebtn')
    datebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('recepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = today.getFullYear()

      today = mm + '/' + dd + '/' + yyyy
      try {
        pdf.enableAddText(today, recepientemail, recepientcolor)
        $('#dragabbleImageText').show()
        $('#dragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var penbtn = document.getElementById('penbtn')
    penbtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      try {
        pdf.enablePencil()
      } catch (error) {
        alert('Please add a document first!')
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      }
    })

    var signaturebtn = document.getElementById('signaturebtn')
    signaturebtn.addEventListener('click', function (event) {
      var element = $(event.target).hasClass('tool')
        ? $(event.target)
        : $(event.target).parents('.tool').first()
      $('.tool.active').removeClass('active')
      $('.icon-color').removeClass('icon-color')
      $(element).addClass('active')
      const icon = this.querySelector('i')
      icon.classList.add('icon-color')
      var select = document.getElementById('recepientselect')
      recepientemail = select.options[select.selectedIndex].value
      recepientcolor =
        select.options[select.selectedIndex].style.backgroundColor
      //pdf.enablePencil();
      // // // // // // // ////console.log('signpress');
      var dataUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAxwAAADICAYAAABiQOesAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAC3iSURBVHja7J1pmF1VmajfVBIgAZIiEARlCCDzYIHQgs0QEAQnLBQRFLRwbIfujrZ2Pz3c7tjX2933drcdp0YUNVFERZQgKqggQUTBARIUGQSsgDIHUkyBTOf++FZ1iuJU1T5nrzPW+z7PeRJC1V5777PP3t971vq+b0qlUkFERERERKQRTFE4RERERERE4RARERERkc4WjilTpkz087ntZErBn3Ncx3Vcx3Vcx3Vcx3Vcx3Xc9hv3OeNUKpUpCofjOq7jOq7jOq7jOq7jOq7jtkQ4KhNs3DfKcR3XcR3XcR3XcR3XcR3XcRUOx3Vcx3Vcx3Vcx3Vcx3Vcx1U4fKMc13Ed13Ed13Ed13Ed13EVDhEREREREYVDREREREQUDhERERERUTgUDhERERERUThEREREREThEBERERERhUPhEBERERERhUNERERERBQOERERERFROBQOERERERFROEREREREROEQERERERGFQ+EQERERERGFQ0REREREFA4REREREZm0BlJ5tlIoHCIiIiIionCIiIiIiEjnC4dnSEREREREFA4REREREVE4RERERERE4VA4RERERERE4RAREREREYVDREREREQUDoVD8jMdmAXsDewD7A/snF69wBbp5zYDngIeBu4A7gF+BawA7iK6VlY8ndLMG6KIiGBcKAqHtC1zgO2AHYG5wB7AbsALgR3Sa1YSkmE2Ao8CdwP3A78Fbk2vR4A/AkOeWlE4REQUDmnfx2mV5+sUhUNyMwN4CfBS4EhiNmMWsDkxozE9vaayqZHklHSBrgfWAuuANcDTSThuAL4N/NzTKwqHiIjCIQqHTD6mArsCewG7A4cCfcDBmbZ/C3AlcC2x1OoOXGIlCoeIiMIhHS8c1Z6+Xm1SjZ2AVwP9wJ7AtsSMxmZAT8ltbyRmPB4jlludn14Pe9pF4RARUThE4ZDuZhdgP+AY4HDgiCQajeQnwCXAZcDNvgWicIiIKByicEh3sgNwHPAG4AQiL2Ma5Wc0JrqInyFmOs4DvgCs8q0QhUNEROEQhUO6h5lsmtU4HvgToipVs1kG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'
      try {
        $('#dragabbleImageSign').show()
        $('#dragabbleImageSign').css("z-index", "9999999999999999999999999999999999999999999");
        pdf.enableImage(dataUrl, recepientemail, recepientcolor)
      } catch (error) {
        alert('Add a Document')
      }
    })

    var openfilebtn = document.getElementById('openfilebtn')
    openfilebtn.addEventListener('click', function (event) {
      $('.icon-color').removeClass('icon-color')
      $('.tool.active').removeClass('active')
      document.getElementById('fileinput').click()
    })

    var imagebtn = document.getElementById('imagebtn')
    imagebtn.addEventListener('click', function (event) {
      $('.icon-color').removeClass('icon-color')
      $('.tool.active').removeClass('active')
      document.getElementById('imageinput').click()
    })

    function clearPDF() {
      const myNode = document.getElementById('pdf-container')
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
        pdf.clearActivePage()
      } catch (error) {
        alert('Please add a document first!')
      }
    }

    $('.color-tool').click(function () {
      $('.color-tool.active').removeClass('active')
      $(this).addClass('active')
      $('.icon-color').removeClass('icon-color')
      var color = $(this).get(0).style.backgroundColor
      try {
        pdf.setColor(color)
      } catch (error) {
        alert('Please add a document first!')
      }
    })

    var colortool = document.getElementById('colortool')
    colortool.addEventListener('input', function (event) {
      // // // // // // // ////console.log('color');

      var colord = colortool.value
      var selectcolor = document.getElementById('selectcolor')
      selectcolor.style.backgroundColor = colord
      ////console.log(colord);
      pdf.setColor(colord)
    })

    var selectcolor = document.getElementById('selectcolor')
    selectcolor.addEventListener('click', function (event) {
      $('.icon-color').removeClass('icon-color')
      document.getElementById('colortool').click()
    })

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
        // // // // // // // ////console.log('user logged in');
        email = getCookie('useremail')
        ////console.log(userid);
        ////console.log(email);

        var optiondefault = document.createElement('option')
        optiondefault.value = email
        optiondefault.style.backgroundColor = '#bdbdbd'
        optiondefault.innerHTML = 'Default(Me)'
        $('#recepientselect').append(optiondefault)

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
                    var img = document.getElementById('imgc')
                    img.setAttribute('crossOrigin', 'anonymous')
                    img.style.visibility = 'visible'
                    img.src = response.data.user.SignImage
                  }
                }
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        } catch (error) {}

        try {
          var mainurl = document.location.hash,
            params = mainurl.split('?')[1].split('&'),
            data = {},
            tmp
          for (var i = 0, l = params.length; i < l; i++) {
            tmp = params[i].split('=')
            data[tmp[0]] = tmp[1]
          }
          filename = data.id
          type = data.type
          useridother = data.u
          try {
            action = data.action
          } catch (error) {
            // // // // // // // ////console.log('no action');
          }
          ////console.log(type);
          ////console.log(userid);
          ////console.log(useridother);
          fileid = data.id
        } catch (error) {}

        if (filename == '' || useridother == '') {
          // // // // // // // ////console.log('No file in url');
          modal[0].style.display = 'none'
          owner = 'admin'
          try {
            if (DataVar.OnlySigner == true) {
              document.getElementById('getlinkbtn').style.display = 'none'
            }
            var people = []
            people = DataVar.RecepientArray
            people.forEach(function (item, index) {
              if (people[index].option == 'Needs to Sign') {
                var option = document.createElement('option')
                option.value = people[index].email
                option.style.backgroundColor = colorArray[index]
                option.innerHTML = '' + people[index].name + ''
                $('#recepientselect').append(option)
              }
            })
          } catch (error) {}

          document.getElementById('recieverfinishbtn').style.display = 'none'
          document.getElementById('moreoptions').style.display = 'none'
          try {
            if (DataVar.DataPath != '') {
              ////console.log(DataVar.DataPath);
              pdf = new PDFAnnotate(
                'pdf-container',
                'toolbar',
                DataVar.DataPath,
                DataVar.DocName,
                {
                  onPageUpdated: (page, oldData, newData) => {
                    //modal[0].style.display = "block";
                    ////console.log(page, oldData, newData);
                  },
                }
              )
            } else {
              // // // // // // // ////console.log('No Data File Found');
              //window.location.hash = "#/admin/index";
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          if (userid != useridother) {
            try {
              document.getElementById('openfilebtn').style.display = 'none'
              document.getElementById('penbtn').style.display = 'none'
              document.getElementById('textbtn').style.display = 'none'
              document.getElementById('signaturebtn').style.display = 'none'
              document.getElementById('imagebtn').style.display = 'none'
              document.getElementById('circlebtn').style.display = 'none'
              document.getElementById('rectanglebtn').style.display = 'none'
              document.getElementById('deletebtn').style.display = 'none'
              document.getElementById('selectcolor').style.display = 'none'
              document.getElementById('getlinkbtn').style.display = 'none'
              document.getElementById('clearbtn').style.display = 'none'
              document.getElementById('datebtn').style.display = 'none'
              document.getElementById('namebtn').style.display = 'none'
              document.getElementById('titlebtn').style.display = 'none'
              document.getElementById('companybtn').style.display = 'none'
              document.getElementById('initialbtn').style.display = 'none'
              document.getElementById('recepientselect').style.display = 'none'
              document.getElementById('fieldscolumn').style.display = 'none'
              document.getElementById('recepientscolumn').style.display = 'none'
            } catch (error) {}

            var remail = ''

            axios
              .post('/getReciever', {
                DocumentID: fileid,
              })
              .then(function (response) {
                console.log(response)
                ////console.log(email);
                if (response.data.Status === 'got recievers') {
                  var recievers = response.data.Reciever
                  var status = response.data.DocStatus
                  if (
                    status === 'Void' ||
                    status === 'Deleted' ||
                    status === 'Correcting'
                  ) {
                    modal[0].style.display = 'none'
                    window.location.hash = '#/admin/index'
                  }
                  recievers.forEach(function (item, index) {
                    ////console.log(item);
                    dbpeople.push({
                      name: recievers[index].RecepientName,
                      email: recievers[index].RecepientEmail,
                      option: recievers[index].RecepientOption,
                    })
                    if (item.RecepientEmail === email) {
                      grabbedcolor = item.RecepientColor
                      remail = item.RecepientEmail
                      ////console.log(grabbedcolor);
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
                      recepientrgbval = 'rgb(' + rgbval + ')'
                    }
                  })
                }
              })
              .catch(function (error) {
                console.log(error)
              })

            if (action === 'correct') {
              try {
                action = 'create'
                var people = []
                people = DataVar.RecepientArray
                people.forEach(function (item, index) {
                  if (people[index].option == 'Needs to Sign') {
                    var option = document.createElement('option')
                    option.value = people[index].email
                    option.style.backgroundColor = colorArray[index]
                    option.innerHTML = '' + people[index].name + ''
                    $('#recepientselect').append(option)
                  }
                })
              } catch (error) {}
            } else if (action === 'create') {
              try {
                action = 'create'
                document.getElementById('recieverfinishbtn').style.display =
                  'none'
                document.getElementById(
                  'recieverfinishlaterbtn'
                ).style.display = 'none'
                document.getElementById('recieverdeclinebtn').style.display =
                  'none'
                document.getElementById('openfilebtn').style.display = 'none'
                document.getElementById('textbtn').style.display = 'block'
                document.getElementById('signaturebtn').style.display = 'block'
                document.getElementById('imagebtn').style.display = 'block'
                document.getElementById('deletebtn').style.display = 'block'
                document.getElementById('getlinkbtn').style.display = 'block'
                document.getElementById('clearbtn').style.display = 'block'
                document.getElementById('datebtn').style.display = 'block'
                document.getElementById('namebtn').style.display = 'block'
                document.getElementById('titlebtn').style.display = 'block'
                document.getElementById('companybtn').style.display = 'block'
                document.getElementById('initialbtn').style.display = 'block'
                document.getElementById('recepientselect').style.display =
                  'block'
                document.getElementById('fieldscolumn').style.display = 'block'
                document.getElementById('recepientscolumn').style.display =
                  'block'
                var people = []
                people = DataVar.RecepientArray
                people.forEach(function (item, index) {
                  if (people[index].option == 'Needs to Sign') {
                    var option = document.createElement('option')
                    option.value = people[index].email
                    option.style.backgroundColor = colorArray[index]
                    option.innerHTML = '' + people[index].name + ''
                    $('#recepientselect').append(option)
                  }
                })
              } catch (error) {}
            }
          } else {
            document.getElementById('recieverfinishbtn').style.display = 'none'
            document.getElementById('moreoptions').style.display = 'none'
            owner = 'admin'

            axios
              .post('/getReciever', {
                DocumentID: fileid,
              })
              .then(function (response) {
                console.log(response)
                if (response.data.Status === 'got recievers') {
                  var recievers = response.data.Reciever
                  var status = response.data.DocStatus
                  if (status === 'Void') {
                    modal[0].style.display = 'none'
                    window.location.hash = '#/admin/index'
                  }
                }
              })
              .catch(function (error) {
                console.log(error)
              })

            if (action === 'correct') {
              try {
                action = 'correct'
                var people = []
                people = DataVar.RecepientArray
                userid = useridother
                people.forEach(function (item, index) {
                  if (people[index].option == 'Needs to Sign') {
                    var option = document.createElement('option')
                    option.value = people[index].email
                    option.style.backgroundColor = colorArray[index]
                    option.innerHTML = '' + people[index].name + ''
                    $('#recepientselect').append(option)
                  }
                })
              } catch (error) {}
            } else if (action === 'create') {
              try {
                action = 'create'
                var people = []
                people = DataVar.RecepientArray
                userid = useridother
                people.forEach(function (item, index) {
                  if (people[index].option == 'Needs to Sign') {
                    var option = document.createElement('option')
                    option.value = people[index].email
                    option.style.backgroundColor = colorArray[index]
                    option.innerHTML = '' + people[index].name + ''
                    $('#recepientselect').append(option)
                  }
                })
              } catch (error) {}
            }
          }

          axios
            .post('/docdownload', {
              UserID: useridother,
              filename: filename,
            })
            .then(function (response) {
              console.log(response)
              if (response.data.Status === 'doc found') {
                var doc = response.data.data

                modal[0].style.display = 'block'
                pdf = new PDFAnnotate(
                  'pdf-container',
                  'toolbar',
                  doc,
                  filename,
                  {
                    onPageUpdated: (page, oldData, newData) => {
                      //modal[0].style.display = "block";
                      ////console.log(page, oldData, newData);
                    },
                  }
                )
              }
            })
            .catch(function (error) {
              console.log(error)
              modal[0].style.display = 'none'
            })
        }
      } else {
        // no user
        //window.location.hash = "#/auth/login";
        modal[0].style.display = 'none'
        modal[4].style.display = 'block'
        document.getElementById('getlinkbtn').style.display = 'none'
      }
    } catch (err) {
      // // // // // // // ////console.log('no data');
      modal[0].style.display = 'none'
    }

    var startnouserbtn = document.getElementById('startnouserbtn')
    startnouserbtn.addEventListener('click', function (event) {
      if (document.getElementById('signtermscheck').checked) {
        modal[4].style.display = 'none'
        modal[0].style.display = 'block'

        userid = 'none'

        var optiondefault = document.createElement('option')
        optiondefault.value = email
        optiondefault.style.backgroundColor = '#bdbdbd'
        optiondefault.innerHTML = 'Default(Me)'
        $('#recepientselect').append(optiondefault)

        try {
          var mainurl = document.location.hash,
            params = mainurl.split('?')[1].split('&'),
            data = {},
            tmp
          for (var i = 0, l = params.length; i < l; i++) {
            tmp = params[i].split('=')
            data[tmp[0]] = tmp[1]
          }
          filename = data.id
          fileid = data.id
          type = data.type
          useridother = data.u
          ////console.log(type);
          ////console.log(userid);
          ////console.log(useridother);
          fileid = data.id
          key = data.key
          // // // // // // // ////console.log('key:'+key);
        } catch (error) {}

        if (filename == '' || useridother == '') {
          // // // // // // // ////console.log('No file in url');
          modal[0].style.display = 'none'
          owner = 'admin'
          try {
            var people = []
            people = DataVar.RecepientArray
            people.forEach(function (item, index) {
              if (people[index].option == 'Needs to Sign') {
                var option = document.createElement('option')
                option.value = people[index].email
                option.style.backgroundColor = colorArray[index]
                option.innerHTML = '' + people[index].name + ''
                $('#recepientselect').append(option)
              }
            })
          } catch (error) {}

          document.getElementById('recieverfinishbtn').style.display = 'none'
          document.getElementById('moreoptions').style.display = 'none'
          try {
            if (DataVar.DataPath != '') {
              ////console.log(DataVar.DataPath);
              pdf = new PDFAnnotate(
                'pdf-container',
                'toolbar',
                DataVar.DataPath,
                DataVar.DocName,
                {
                  onPageUpdated: (page, oldData, newData) => {
                    //modal[0].style.display = "block";
                    ////console.log(page, oldData, newData);
                  },
                }
              )
            } else {
              // // // // // // // ////console.log('No Data File Found');
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          if (userid != useridother) {
            try {
              document.getElementById('openfilebtn').style.display = 'none'
              document.getElementById('penbtn').style.display = 'none'
              document.getElementById('textbtn').style.display = 'none'
              document.getElementById('signaturebtn').style.display = 'none'
              document.getElementById('imagebtn').style.display = 'none'
              document.getElementById('circlebtn').style.display = 'none'
              document.getElementById('rectanglebtn').style.display = 'none'
              document.getElementById('deletebtn').style.display = 'none'
              document.getElementById('selectcolor').style.display = 'none'
              document.getElementById('getlinkbtn').style.display = 'none'
              document.getElementById('clearbtn').style.display = 'none'
              document.getElementById('datebtn').style.display = 'none'
              document.getElementById('namebtn').style.display = 'none'
              document.getElementById('titlebtn').style.display = 'none'
              document.getElementById('companybtn').style.display = 'none'
              document.getElementById('initialbtn').style.display = 'none'
              document.getElementById('recepientselect').style.display = 'none'
              document.getElementById('fieldscolumn').style.display = 'none'
              document.getElementById('recepientscolumn').style.display = 'none'

              if (key != '') {
                axios
                  .post('/getReciever', {
                    DocumentID: fileid,
                  })
                  .then(function (response) {
                    console.log(response)
                    if (response.data.Status === 'got recievers') {
                      var recievers = response.data.Reciever
                      var status = response.data.DocStatus
                      if (
                        status === 'Void' ||
                        status === 'Deleted' ||
                        status === 'Correcting'
                      ) {
                        modal[0].style.display = 'none'
                        window.location.hash = '#/admin/index'
                      }
                      recievers.forEach(function (item, index) {
                        dbpeople.push({
                          name: recievers[index].RecepientName,
                          email: recievers[index].RecepientEmail,
                          option: recievers[index].RecepientOption,
                        })
                      })
                      grabbedcolor = recievers[key].RecepientColor
                      remail = recievers[key].RecepientEmail
                      email = recievers[key].RecepientEmail
                      ////console.log(grabbedcolor);
                      ////console.log(remail);
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
                      recepientrgbval = 'rgb(' + rgbval + ')'
                    }
                  })
                  .catch(function (error) {
                    console.log(error)
                  })
              }
            } catch (error) {}
          } else {
            try {
              document.getElementById('recieverfinishbtn').style.display =
                'none'
              document.getElementById('moreoptions').style.display = 'none'
            } catch (error) {}

            owner = 'admin'

            axios
              .post('/getReciever', {
                DocumentID: fileid,
              })
              .then(function (response) {
                console.log(response)
                if (response.data.Status === 'got recievers') {
                  var recievers = response.data.Reciever
                  var status = response.data.DocStatus
                  if (status === 'Void') {
                    modal[0].style.display = 'none'
                    window.location.hash = '#/admin/index'
                  }
                }
              })
              .catch(function (error) {
                console.log(error)
              })
          }

          axios
            .post('/docdownload', {
              UserID: useridother,
              filename: filename,
            })
            .then(function (response) {
              console.log(response)
              if (response.data.Status === 'doc found') {
                var doc = response.data.data

                modal[0].style.display = 'block'
                pdf = new PDFAnnotate(
                  'pdf-container',
                  'toolbar',
                  doc,
                  filename,
                  {
                    onPageUpdated: (page, oldData, newData) => {
                      //modal[0].style.display = "block";
                      ////console.log(page, oldData, newData);
                    },
                  }
                )
              }
            })
            .catch(function (error) {
              console.log(error)
              modal[0].style.display = 'none'
            })
        }
      } else {
        alert('Please agree to our terms and conditions to continue')
      }
    })

    window.onclick = function (e) {
      if (e.target == modal[0]) {
        modal[2].style.display = 'none'
        modal[3].style.display = 'none'
      }
    }

    var getlinkbtn = document.getElementById('getlinkbtn')
    getlinkbtn.addEventListener('click', function (event) {
      try {
        modal[1].style.display = 'block'
        pdf.savetoCloudPdf()
      } catch (error) {
        alert('There are no changes to save')
      }
    })

    var recieverfinishbtn = document.getElementById('recieverfinishbtn')
    recieverfinishbtn.addEventListener('click', function (event) {
      modal[1].style.display = 'block'
      pdf.checkallupdated()
    })

    var recieverfinishlaterbtn = document.getElementById(
      'recieverfinishlaterbtn'
    )
    recieverfinishlaterbtn.addEventListener('click', function (event) {
      window.location.hash = '#/admin/manage'
    })

    var recieverdeclinebtn = document.getElementById('recieverdeclinebtn')
    recieverdeclinebtn.addEventListener('click', function (event) {
      axios
        .post('/updatedocumentstatus', {
          DocumentID: filename,
          Status: 'Declined',
        })
        .then(function (response) {
          console.log(response)
          if (
            response.data === 'insert done' ||
            response.data === 'update done'
          ) {
            alert('Document Declined')
            window.location.hash = '#/admin/index'
          }
        })
        .catch(function (error) {
          console.log(error)
          //modal[2].style.display = "none"
        })
    })

    var sendemail = document.getElementById('sendemailbtn')
    sendemail.addEventListener('click', function (event) {
      if (action === 'correct') {
        window.location.hash =
          '#/admin/review?id=' + filename + '&action=correct'
      } else {
        window.location.hash = '#/admin/review?id=' + filename + ''
      }
    })

    var addinitialmodalbtn = document.getElementById('addinitialmodalbtn')
    addinitialmodalbtn.addEventListener('click', function (event) {
      //modal[3].style.display = "block";
      var initialval = document.getElementById('addinitialval').value
      if (initialval == '') {
        alert('Please enter your initials')
      } else {
        try {
          pdf.enableAddText(initialval, recepientemail, recepientcolor)
          $('#dragabbleImageText').show()
          $('#dragabbleImageText').css("z-index", "9999999999999999999999999999999999999999999");
          modal[5].style.display = 'none'
        } catch (error) {
          modal[5].style.display = 'none'
          alert('Please add a document first!')
          $('.tool-button.active').removeClass('active')
          $('.icon-color').removeClass('icon-color')
        }
      }
    })

    var closeinitialmodalbtn = document.getElementById('closeinitialmodalbtn')
    closeinitialmodalbtn.addEventListener('click', function (event) {
      modal[5].style.display = 'block'
    })

    function SignaturePad() {
      var Point = (function () {
        function Point(x, y, time) {
          this.x = x
          this.y = y
          this.time = time || Date.now()
        }
        Point.prototype.distanceTo = function (start) {
          return Math.sqrt(
            Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2)
          )
        }
        Point.prototype.equals = function (other) {
          return (
            this.x === other.x && this.y === other.y && this.time === other.time
          )
        }
        Point.prototype.velocityFrom = function (start) {
          return this.time !== start.time
            ? this.distanceTo(start) / (this.time - start.time)
            : 0
        }
        return Point
      })()

      var Bezier = (function () {
        function Bezier(
          startPoint,
          control2,
          control1,
          endPoint,
          startWidth,
          endWidth
        ) {
          this.startPoint = startPoint
          this.control2 = control2
          this.control1 = control1
          this.endPoint = endPoint
          this.startWidth = startWidth
          this.endWidth = endWidth
        }
        Bezier.fromPoints = function (points, widths) {
          var c2 = this.calculateControlPoints(points[0], points[1], points[2])
            .c2
          var c3 = this.calculateControlPoints(points[1], points[2], points[3])
            .c1
          return new Bezier(
            points[1],
            c2,
            c3,
            points[2],
            widths.start,
            widths.end
          )
        }
        Bezier.calculateControlPoints = function (s1, s2, s3) {
          var dx1 = s1.x - s2.x
          var dy1 = s1.y - s2.y
          var dx2 = s2.x - s3.x
          var dy2 = s2.y - s3.y
          var m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 }
          var m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 }
          var l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
          var l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
          var dxm = m1.x - m2.x
          var dym = m1.y - m2.y
          var k = l2 / (l1 + l2)
          var cm = { x: m2.x + dxm * k, y: m2.y + dym * k }
          var tx = s2.x - cm.x
          var ty = s2.y - cm.y
          return {
            c1: new Point(m1.x + tx, m1.y + ty),
            c2: new Point(m2.x + tx, m2.y + ty),
          }
        }
        Bezier.prototype.length = function () {
          var steps = 10
          var length = 0
          var px
          var py
          for (var i = 0; i <= steps; i += 1) {
            var t = i / steps
            var cx = this.point(
              t,
              this.startPoint.x,
              this.control1.x,
              this.control2.x,
              this.endPoint.x
            )
            var cy = this.point(
              t,
              this.startPoint.y,
              this.control1.y,
              this.control2.y,
              this.endPoint.y
            )
            if (i > 0) {
              var xdiff = cx - px
              var ydiff = cy - py
              length += Math.sqrt(xdiff * xdiff + ydiff * ydiff)
            }
            px = cx
            py = cy
          }
          return length
        }
        Bezier.prototype.point = function (t, start, c1, c2, end) {
          return (
            start * (1.0 - t) * (1.0 - t) * (1.0 - t) +
            3.0 * c1 * (1.0 - t) * (1.0 - t) * t +
            3.0 * c2 * (1.0 - t) * t * t +
            end * t * t * t
          )
        }
        return Bezier
      })()

      function throttle(fn, wait) {
        if (wait === void 0) {
          wait = 250
        }
        var previous = 0
        var timeout = null
        var result
        var storedContext
        var storedArgs
        var later = function () {
          previous = Date.now()
          timeout = null
          result = fn.apply(storedContext, storedArgs)
          if (!timeout) {
            storedContext = null
            storedArgs = []
          }
        }
        return function wrapper() {
          var args = []
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i]
          }
          var now = Date.now()
          var remaining = wait - (now - previous)
          storedContext = this
          storedArgs = args
          if (remaining <= 0 || remaining > wait) {
            if (timeout) {
              clearTimeout(timeout)
              timeout = null
            }
            previous = now
            result = fn.apply(storedContext, storedArgs)
            if (!timeout) {
              storedContext = null
              storedArgs = []
            }
          } else if (!timeout) {
            timeout = window.setTimeout(later, remaining)
          }
          return result
        }
      }

      var SignaturePad = (function () {
        function SignaturePad(canvas, options) {
          if (options === void 0) {
            options = {}
          }
          var _this = this
          this.canvas = canvas
          this.options = options
          this._handleMouseDown = function (event) {
            if (event.which === 1) {
              _this._mouseButtonDown = true
              _this._strokeBegin(event)
            }
          }
          this._handleMouseMove = function (event) {
            if (_this._mouseButtonDown) {
              _this._strokeMoveUpdate(event)
            }
          }
          this._handleMouseUp = function (event) {
            if (event.which === 1 && _this._mouseButtonDown) {
              _this._mouseButtonDown = false
              _this._strokeEnd(event)
            }
          }
          this._handleTouchStart = function (event) {
            event.preventDefault()
            if (event.targetTouches.length === 1) {
              var touch = event.changedTouches[0]
              _this._strokeBegin(touch)
            }
          }
          this._handleTouchMove = function (event) {
            event.preventDefault()
            var touch = event.targetTouches[0]
            _this._strokeMoveUpdate(touch)
          }
          this._handleTouchEnd = function (event) {
            var wasCanvasTouched = event.target === _this.canvas
            if (wasCanvasTouched) {
              event.preventDefault()
              var touch = event.changedTouches[0]
              _this._strokeEnd(touch)
            }
          }
          this.velocityFilterWeight = options.velocityFilterWeight || 0.7
          this.minWidth = options.minWidth || 0.5
          this.maxWidth = options.maxWidth || 2.5
          this.throttle = 'throttle' in options ? options.throttle : 16
          this.minDistance = 'minDistance' in options ? options.minDistance : 5
          if (this.throttle) {
            this._strokeMoveUpdate = throttle(
              SignaturePad.prototype._strokeUpdate,
              this.throttle
            )
          } else {
            this._strokeMoveUpdate = SignaturePad.prototype._strokeUpdate
          }
          this.dotSize =
            options.dotSize ||
            function dotSize() {
              return (this.minWidth + this.maxWidth) / 2
            }
          this.penColor = options.penColor || 'black'
          this.backgroundColor = options.backgroundColor || 'rgba(0,0,0,0)'
          this.onBegin = options.onBegin
          this.onEnd = options.onEnd
          this._ctx = canvas.getContext('2d')
          this.clear()
          this.on()
        }
        SignaturePad.prototype.clear = function () {
          var ctx = this._ctx
          var canvas = this.canvas
          ctx.fillStyle = this.backgroundColor
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          this._data = []
          this._reset()
          this._isEmpty = true
        }
        SignaturePad.prototype.fromDataURL = function (
          dataUrl,
          options,
          callback
        ) {
          var _this = this
          if (options === void 0) {
            options = {}
          }
          var image = new Image()
          var ratio = options.ratio || window.devicePixelRatio || 1
          var width = options.width || this.canvas.width / ratio
          var height = options.height || this.canvas.height / ratio
          this._reset()
          image.onload = function () {
            _this._ctx.drawImage(image, 0, 0, width, height)
            if (callback) {
              callback()
            }
          }
          image.onerror = function (error) {
            if (callback) {
              callback(error)
            }
          }
          image.src = dataUrl
          this._isEmpty = false
        }
        SignaturePad.prototype.toDataURL = function (type, encoderOptions) {
          if (type === void 0) {
            type = 'image/png'
          }
          switch (type) {
            case 'image/svg+xml':
              return this._toSVG()
            default:
              return this.canvas.toDataURL(type, encoderOptions)
          }
        }
        SignaturePad.prototype.on = function () {
          this.canvas.style.touchAction = 'none'
          this.canvas.style.msTouchAction = 'none'
          if (window.PointerEvent) {
            this._handlePointerEvents()
          } else {
            this._handleMouseEvents()
            if ('ontouchstart' in window) {
              this._handleTouchEvents()
            }
          }
        }
        SignaturePad.prototype.off = function () {
          this.canvas.style.touchAction = 'auto'
          this.canvas.style.msTouchAction = 'auto'
          this.canvas.removeEventListener('pointerdown', this._handleMouseDown)
          this.canvas.removeEventListener('pointermove', this._handleMouseMove)
          document.removeEventListener('pointerup', this._handleMouseUp)
          this.canvas.removeEventListener('mousedown', this._handleMouseDown)
          this.canvas.removeEventListener('mousemove', this._handleMouseMove)
          document.removeEventListener('mouseup', this._handleMouseUp)
          this.canvas.removeEventListener('touchstart', this._handleTouchStart)
          this.canvas.removeEventListener('touchmove', this._handleTouchMove)
          this.canvas.removeEventListener('touchend', this._handleTouchEnd)
        }
        SignaturePad.prototype.isEmpty = function () {
          return this._isEmpty
        }
        SignaturePad.prototype.fromData = function (pointGroups) {
          var _this = this
          this.clear()
          this._fromData(
            pointGroups,
            function (_a) {
              var color = _a.color,
                curve = _a.curve
              return _this._drawCurve({ color: color, curve: curve })
            },
            function (_a) {
              var color = _a.color,
                point = _a.point
              return _this._drawDot({ color: color, point: point })
            }
          )
          this._data = pointGroups
        }
        SignaturePad.prototype.toData = function () {
          return this._data
        }
        SignaturePad.prototype._strokeBegin = function (event) {
          var newPointGroup = {
            color: this.penColor,
            points: [],
          }
          if (typeof this.onBegin === 'function') {
            this.onBegin(event)
          }
          this._data.push(newPointGroup)
          this._reset()
          this._strokeUpdate(event)
        }
        SignaturePad.prototype._strokeUpdate = function (event) {
          var x = event.clientX
          var y = event.clientY
          var point = this._createPoint(x, y)
          var lastPointGroup = this._data[this._data.length - 1]
          var lastPoints = lastPointGroup.points
          var lastPoint =
            lastPoints.length > 0 && lastPoints[lastPoints.length - 1]
          var isLastPointTooClose = lastPoint
            ? point.distanceTo(lastPoint) <= this.minDistance
            : false
          var color = lastPointGroup.color
          if (!lastPoint || !(lastPoint && isLastPointTooClose)) {
            var curve = this._addPoint(point)
            if (!lastPoint) {
              this._drawDot({ color: color, point: point })
            } else if (curve) {
              this._drawCurve({ color: color, curve: curve })
            }
            lastPoints.push({
              time: point.time,
              x: point.x,
              y: point.y,
            })
          }
        }
        SignaturePad.prototype._strokeEnd = function (event) {
          this._strokeUpdate(event)
          if (typeof this.onEnd === 'function') {
            this.onEnd(event)
          }
        }
        SignaturePad.prototype._handlePointerEvents = function () {
          this._mouseButtonDown = false
          this.canvas.addEventListener('pointerdown', this._handleMouseDown)
          this.canvas.addEventListener('pointermove', this._handleMouseMove)
          document.addEventListener('pointerup', this._handleMouseUp)
        }
        SignaturePad.prototype._handleMouseEvents = function () {
          this._mouseButtonDown = false
          this.canvas.addEventListener('mousedown', this._handleMouseDown)
          this.canvas.addEventListener('mousemove', this._handleMouseMove)
          document.addEventListener('mouseup', this._handleMouseUp)
        }
        SignaturePad.prototype._handleTouchEvents = function () {
          this.canvas.addEventListener('touchstart', this._handleTouchStart)
          this.canvas.addEventListener('touchmove', this._handleTouchMove)
          this.canvas.addEventListener('touchend', this._handleTouchEnd)
        }
        SignaturePad.prototype._reset = function () {
          this._lastPoints = []
          this._lastVelocity = 0
          this._lastWidth = (this.minWidth + this.maxWidth) / 2
          this._ctx.fillStyle = this.penColor
        }
        SignaturePad.prototype._createPoint = function (x, y) {
          var rect = this.canvas.getBoundingClientRect()
          return new Point(x - rect.left, y - rect.top, new Date().getTime())
        }
        SignaturePad.prototype._addPoint = function (point) {
          var _lastPoints = this._lastPoints
          _lastPoints.push(point)
          if (_lastPoints.length > 2) {
            if (_lastPoints.length === 3) {
              _lastPoints.unshift(_lastPoints[0])
            }
            var widths = this._calculateCurveWidths(
              _lastPoints[1],
              _lastPoints[2]
            )
            var curve = Bezier.fromPoints(_lastPoints, widths)
            _lastPoints.shift()
            return curve
          }
          return null
        }
        SignaturePad.prototype._calculateCurveWidths = function (
          startPoint,
          endPoint
        ) {
          var velocity =
            this.velocityFilterWeight * endPoint.velocityFrom(startPoint) +
            (1 - this.velocityFilterWeight) * this._lastVelocity
          var newWidth = this._strokeWidth(velocity)
          var widths = {
            end: newWidth,
            start: this._lastWidth,
          }
          this._lastVelocity = velocity
          this._lastWidth = newWidth
          return widths
        }
        SignaturePad.prototype._strokeWidth = function (velocity) {
          return Math.max(this.maxWidth / (velocity + 1), this.minWidth)
        }
        SignaturePad.prototype._drawCurveSegment = function (x, y, width) {
          var ctx = this._ctx
          ctx.moveTo(x, y)
          ctx.arc(x, y, width, 0, 2 * Math.PI, false)
          this._isEmpty = false
        }
        SignaturePad.prototype._drawCurve = function (_a) {
          var color = _a.color,
            curve = _a.curve
          var ctx = this._ctx
          var widthDelta = curve.endWidth - curve.startWidth
          var drawSteps = Math.floor(curve.length()) * 2
          ctx.beginPath()
          ctx.fillStyle = color
          for (var i = 0; i < drawSteps; i += 1) {
            var t = i / drawSteps
            var tt = t * t
            var ttt = tt * t
            var u = 1 - t
            var uu = u * u
            var uuu = uu * u
            var x = uuu * curve.startPoint.x
            x += 3 * uu * t * curve.control1.x
            x += 3 * u * tt * curve.control2.x
            x += ttt * curve.endPoint.x
            var y = uuu * curve.startPoint.y
            y += 3 * uu * t * curve.control1.y
            y += 3 * u * tt * curve.control2.y
            y += ttt * curve.endPoint.y
            var width = curve.startWidth + ttt * widthDelta
            this._drawCurveSegment(x, y, width)
          }
          ctx.closePath()
          ctx.fill()
        }
        SignaturePad.prototype._drawDot = function (_a) {
          var color = _a.color,
            point = _a.point
          var ctx = this._ctx
          var width =
            typeof this.dotSize === 'function' ? this.dotSize() : this.dotSize
          ctx.beginPath()
          this._drawCurveSegment(point.x, point.y, width)
          ctx.closePath()
          ctx.fillStyle = color
          ctx.fill()
        }
        SignaturePad.prototype._fromData = function (
          pointGroups,
          drawCurve,
          drawDot
        ) {
          for (
            var _i = 0, pointGroups_1 = pointGroups;
            _i < pointGroups_1.length;
            _i++
          ) {
            var group = pointGroups_1[_i]
            var color = group.color,
              points = group.points
            if (points.length > 1) {
              for (var j = 0; j < points.length; j += 1) {
                var basicPoint = points[j]
                var point = new Point(
                  basicPoint.x,
                  basicPoint.y,
                  basicPoint.time
                )
                this.penColor = color
                if (j === 0) {
                  this._reset()
                }
                var curve = this._addPoint(point)
                if (curve) {
                  drawCurve({ color: color, curve: curve })
                }
              }
            } else {
              this._reset()
              drawDot({
                color: color,
                point: points[0],
              })
            }
          }
        }

        SignaturePad.prototype._toSVG = function () {
          var _this = this
          var pointGroups = this._data
          var ratio = Math.max(window.devicePixelRatio || 1, 1)
          var minX = 0
          var minY = 0
          var maxX = this.canvas.width / ratio
          var maxY = this.canvas.height / ratio
          var svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
          )
          svg.setAttribute('width', this.canvas.width.toString())
          svg.setAttribute('height', this.canvas.height.toString())
          this._fromData(
            pointGroups,
            function (_a) {
              var color = _a.color,
                curve = _a.curve
              var path = document.createElement('path')
              if (
                !isNaN(curve.control1.x) &&
                !isNaN(curve.control1.y) &&
                !isNaN(curve.control2.x) &&
                !isNaN(curve.control2.y)
              ) {
                var attr =
                  'M ' +
                  curve.startPoint.x.toFixed(3) +
                  ',' +
                  curve.startPoint.y.toFixed(3) +
                  ' ' +
                  ('C ' +
                    curve.control1.x.toFixed(3) +
                    ',' +
                    curve.control1.y.toFixed(3) +
                    ' ') +
                  (curve.control2.x.toFixed(3) +
                    ',' +
                    curve.control2.y.toFixed(3) +
                    ' ') +
                  (curve.endPoint.x.toFixed(3) +
                    ',' +
                    curve.endPoint.y.toFixed(3))
                path.setAttribute('d', attr)
                path.setAttribute(
                  'stroke-width',
                  (curve.endWidth * 2.25).toFixed(3)
                )
                path.setAttribute('stroke', color)
                path.setAttribute('fill', 'none')
                path.setAttribute('stroke-linecap', 'round')
                svg.appendChild(path)
              }
            },
            function (_a) {
              var color = _a.color,
                point = _a.point
              var circle = document.createElement('circle')
              var dotSize =
                typeof _this.dotSize === 'function'
                  ? _this.dotSize()
                  : _this.dotSize
              circle.setAttribute('r', dotSize.toString())
              circle.setAttribute('cx', point.x.toString())
              circle.setAttribute('cy', point.y.toString())
              circle.setAttribute('fill', color)
              svg.appendChild(circle)
            }
          )
          var prefix = 'data:image/svg+xml;base64,'
          var header =
            '<svg' +
            ' xmlns="http://www.w3.org/2000/svg"' +
            ' xmlns:xlink="http://www.w3.org/1999/xlink"' +
            (' viewBox="' + minX + ' ' + minY + ' ' + maxX + ' ' + maxY + '"') +
            (' width="' + maxX + '"') +
            (' height="' + maxY + '"') +
            '>'
          var body = svg.innerHTML
          if (body === undefined) {
            var dummy = document.createElement('dummy')
            var nodes = svg.childNodes
            dummy.innerHTML = ''
            for (var i = 0; i < nodes.length; i += 1) {
              dummy.appendChild(nodes[i].cloneNode(true))
            }
            body = dummy.innerHTML
          }
          var footer = '</svg>'
          var data = header + body + footer
          return prefix + btoa(data)
        }

        return SignaturePad
      })()

      var wrapper = document.getElementById('signature-pad')
      var clearButton = wrapper.querySelector('[data-action=clear]')
      var AddtoDocBtn = wrapper.querySelector('[data-action=add-to-doc]')
      var CancelBtn = wrapper.querySelector('[data-action=cancel]')
      var canvas = wrapper.querySelector('canvas')
      var signaturePad = new SignaturePad(canvas, {
        // It's Necessary to use an opaque color when saving image as JPEG;
        // this option can be omitted if only saving as PNG or SVG
        backgroundColor: 'rgb(255, 255, 255)',
      })

      // Adjust canvas coordinate space taking into account pixel ratio,
      // to make it look crisp on mobile devices.
      // This also causes canvas to be cleared.
      function resizeCanvas() {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio = Math.max(window.devicePixelRatio || 1, 1)

        // This part causes the canvas to be cleared
        canvas.width = canvas.offsetWidth * ratio
        canvas.height = canvas.offsetHeight * ratio
        canvas.getContext('2d').scale(ratio, ratio)

        // This library does not listen for canvas changes, so after the canvas is automatically
        // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
        // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
        // that the state of this library is consistent with visual state of the canvas, you
        // have to clear it manually.
        signaturePad.clear()
      }

      // On mobile devices it might make more sense to listen to orientation change,
      // rather than window resize events.
      window.onresize = resizeCanvas
      resizeCanvas()

      function download(dataURL, filename) {
        var link = document.createElement('a')
        link.href = dataURL
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      // One could simply use Canvas#toBlob method instead, but it's just to show
      // that it can be done using result of SignaturePad#toDataURL.
      function dataURLToBlob(dataURL) {
        // Code taken from https://github.com/ebidel/filer.js
        var parts = dataURL.split(';base64,')
        var contentType = parts[0].split(':')[1]
        var raw = window.atob(parts[1])
        var rawLength = raw.length
        var uInt8Array = new Uint8Array(rawLength)

        for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i)
        }

        return new Blob([uInt8Array], { type: contentType })
      }

      clearButton.addEventListener('click', function (event) {
        signaturePad.clear()
      })

      AddtoDocBtn.addEventListener('click', function (event) {
        if (signaturePad.isEmpty()) {
          alert('Please provide a signature first.')
        } else {
          modal[6].style.display = 'none'
          var dataURL = signaturePad.toDataURL('image/svg+xml')
          //download(dataURL, "signature.svg");
          //pdf.enableImage(dataURL);
          doubleclickobj.setSrc(dataURL)
          pdf.Reload()
          document.getElementById('signature-container').style.visibility =
            'hidden'
          document.getElementById('signature-container').style.height = 0

          document.getElementById('image-container').style.display = 'none'
          document.getElementById('tabcontent').style.display = 'none'
        }
      })

      CancelBtn.addEventListener('click', function (event) {
        document.getElementById('signature-container').style.visibility =
          'hidden'
        document.getElementById('signature-container').style.height = '0px'

        document.getElementById('image-container').style.display = 'none'
        document.getElementById('tabcontent').style.display = 'none'
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      })

      var cancelselectbtn = document.getElementById('cancelselectbtn')
      cancelselectbtn.addEventListener('click', function (event) {
        modal[6].style.display = 'none'
        document.getElementById('signature-container').style.visibility =
          'hidden'
        document.getElementById('signature-container').style.height = '0px'

        document.getElementById('image-container').style.display = 'none'
        document.getElementById('tabcontent').style.display = 'none'
        $('.tool-button.active').removeClass('active')
        $('.icon-color').removeClass('icon-color')
      })

      var addtodocselectbtn = document.getElementById('addtodocselectbtn')
      addtodocselectbtn.addEventListener('click', function (event) {
        var imgsrc = document.getElementById('imgc').src
        var request = new XMLHttpRequest()
        request.open('GET', imgsrc, true)
        request.responseType = 'blob'
        request.onload = function () {
          var reader = new FileReader()
          reader.readAsDataURL(request.response)
          reader.onload = function (e) {
            // // // // // // // //console.log('DataURL:', e.target.result);
            var URL = e.target.result
            doubleclickobj.setSrc(URL)
          }
        }
        request.send()
        modal[6].style.display = 'none'

        document.getElementById('signature-container').style.visibility =
          'hidden'
        document.getElementById('signature-container').style.height = '0px'
        document.getElementById('image-container').style.display = 'none'
        document.getElementById('tabcontent').style.display = 'none'
      })
    }
  }

  render() {
    return (
      <div className="pdfAnNotateContainer">
        <img
          id="dragabbleImageSign"
          src={require('../../assets/img/icons/common/signatureimg.png')}
        />

        <img
          id="dragabbleImageText"
          src={require('../../assets/img/icons/common/textimg.png')}
        />

        <Row>
          <Col lg="12" className="py-3">
            <div id="moreoptions" className="btn-group float-right m-2 px-4">
              <button type="button" className="btn btn-neutral actionsign ">
                Other Actions
              </button>
              <button
                type="button"
                className="btn btn-neutral actionsign dropdown-toggle dropdown-toggle-split"
              ></button>
              <div className="dropdown-menu2" id="dropdown">
                <button
                  className="dropdown-item "
                  id="recieverfinishlaterbtn"
                  type="button"
                >
                  Finish Later
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item "
                  id="recieverdeclinebtn"
                  type="button"
                >
                  Decline
                </button>
                <button className="dropdown-item " type="button">
                  Print & Sign
                </button>
                <button className="dropdown-item " type="button">
                  Void
                </button>
                <button className="dropdown-item " type="button">
                  Correct
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item " type="button">
                  Help & Support
                </button>
                <button className="dropdown-item " type="button">
                  About Pappayasign
                </button>
                <button className="dropdown-item " type="button">
                  View History
                </button>
                <button className="dropdown-item " type="button">
                  View Certificate(PDF)
                </button>
                <button className="dropdown-item " type="button">
                  Session Information
                </button>
              </div>
            </div>
            <button
              type="button"
              id="recieverfinishbtn"
              className="btn m-2 float-right px-4 btn-primary "
            >
              Finish
            </button>
          </Col>
        </Row>
        <Row>
          <div id="editortoolbar" className="editortoolbar">
            <button id="zoominbtn" color="neutral" className="toolzoom">
              <i className="material-icons">zoom_in</i>
            </button>
            <button id="zoomoutbtn" color="neutral" className="toolzoom">
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
                <p>
                  Sending Email, This dialog will automatically close after
                  sending.
                </p>
                <div className="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <p>Please Wait.</p>
                <div className="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <div className="mb-4 mb-xl-0">
                  <h5>Please Review and Act on These Documents: </h5>
                </div>
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
                          I agree to use electronic records, signature and{' '}
                          <a href="#" onClick={(e) => e.preventDefault()}>
                            Electronic Record and Signature Discolsure
                          </a>
                        </span>
                      </label>
                    </div>
                  </Col>
                  <Col lg="12" className="justify-content-center p-2 py-3">
                    <Button id="startnouserbtn" className="close-btn px-4 ">
                      {' '}
                      Continue
                    </Button>
                  </Col>
                </Row>
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
                        id="addinitialval"
                        placeholder="Initials"
                        type="text"
                      />
                    </FormGroup>
                  </Col>

                  <Col lg="6">
                    <Button
                      id="addinitialmodalbtn"
                      className="close-btn float-right px-4"
                    >
                      {' '}
                      Add
                    </Button>
                  </Col>
                  <Col lg="6">
                    <Button
                      id="closeinitialmodalbtn"
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

          <div className="modal">
            <div className="modal-content-sign">
              <div id="signature-container">
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
                        className={classnames('mb-sm-1 mb-md-0', {
                          active: this.state.tabs === 1,
                        })}
                        onClick={(e) => this.toggleNavs(e, 'tabs', 1)}
                        href="#pablo"
                        role="tab"
                      >
                        Draw
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        aria-selected={this.state.tabs === 2}
                        className={classnames('mb-sm-1 mb-md-0', {
                          active: this.state.tabs === 2,
                        })}
                        onClick={(e) => this.toggleNavs(e, 'tabs', 2)}
                        href="#pablo"
                        role="tab"
                      >
                        Select
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
                <TabContent
                  activeTab={'tabs' + this.state.tabs}
                  id="tabcontent"
                >
                  <TabPane tabId="tabs1">
                    <div
                      id="signatureview"
                      className="mdl-dialog mb-3 col-lg-12 col-md-12"
                    >
                      <div className="card-body p-0">
                        <div id="signature-pad" className="signature-pad">
                          <div className="signature-pad--body">
                            <canvas></canvas>
                          </div>
                          <div className="signature-pad--footer">
                            <div className="description">Sign above</div>

                            <div className="signature-pad--actions">
                              <div>
                                <Button
                                  className="m-2 float-right"
                                  color="neutral"
                                  type="button"
                                  data-action="clear"
                                >
                                  Clear
                                </Button>
                              </div>
                              <div>
                                <Button
                                  className="m-2"
                                  id="addtodoc"
                                  color="primary"
                                  type="button"
                                  data-action="add-to-doc"
                                >
                                  Add To Document
                                </Button>
                                <Button
                                  className="m-2"
                                  id="cancel"
                                  color="neutral"
                                  type="button"
                                  data-action="cancel"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tabId="tabs2">
                    <div className="mdl-dialog mb-3 col-lg-12 col-md-12">
                      <div className="card-body p-0 signature-pad--body">
                        <div id="image-container">
                          <img
                            crossOrigin="anonymous"
                            id="imgc"
                            className="imgclass"
                          ></img>
                        </div>
                      </div>
                      <div className="select-pad--actions">
                        <Button
                          className="m-2 float-right"
                          id="cancelselectbtn"
                          color="neutral"
                          type="button"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="m-2 float-right"
                          id="addtodocselectbtn"
                          color="primary"
                          type="button"
                        >
                          Add To Document
                        </Button>
                      </div>
                    </div>
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </div>

          <Col lg="2">
            <div id="toolbar" className="toolbar">
              <div className="divider" id="recepientscolumn">
                <div className="col my-3 p-2">
                  <h6 className="text-uppercase text-black ls-1 mb-1 float-left">
                    Recepients
                  </h6>
                </div>
                <hr className="my-1" />
              </div>
              <select
                id="recepientselect"
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
              <button id="openfilebtn" className="tool">
                <i className="material-icons">insert_drive_file</i>Open
              </button>
              <button id="savebtn" color="neutral" className="tool">
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
              <button id="signaturebtn" color="neutral" className="tool">
                <i className="material-icons">gesture</i>Signature
              </button>
              <button id="imagebtn" color="neutral" className="tool">
                <i className="material-icons">image</i>Image
              </button>
              <button id="datebtn" color="neutral" className="tool">
                <i className="material-icons">today</i>Date
              </button>
              <button id="penbtn" color="neutral" className="tool">
                <i className="material-icons">edit</i>Pen
              </button>
              <button id="textbtn" color="neutral" className="tool">
                <i className=" material-icons">text_fields</i>Text
              </button>
              <button id="circlebtn" color="neutral" className="tool">
                <i className="material-icons">panorama_fish_eye</i>Circle
              </button>
              <button id="rectanglebtn" color="neutral" className="tool">
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
              <button id="selectbtn" color="neutral" className="tool">
                <i className="material-icons">pan_tool</i>Select
              </button>
              <button id="deletebtn" color="neutral" className="tool">
                <i className="material-icons">delete_forever</i>Delete
              </button>
              <button id="clearbtn" color="neutral" className="tool">
                <i className="material-icons">clear</i>Clear
              </button>
              <input
                id="fileinput"
                type="file"
                accept="application/pdf"
              ></input>
              <input id="imageinput" type="file" accept="image/*"></input>

              <Button id="addobjbtn" className="tool"></Button>

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
              <Col lg="12"></Col>
            </Row>
            <Row>
              <div id="container">
                <div
                  id="pdf-container"
                  style={{
                    height: '550px',
                  }}
                ></div>
              </div>
            </Row>

            <Col lg="12" className="py-3">
              <Button
                id="getlinkbtn"
                className="m-2 float-left px-4"
                color="primary"
                type="button"
              >
                Save
              </Button>
              <div lg="6" id="emailbtncontainer">
                <Button
                  id="sendemailbtn"
                  className="m-2 float-right px-4"
                  color="primary"
                  type="button"
                >
                  Next
                </Button>
              </div>
            </Col>

            <div></div>
          </Col>
          <Col lg="2">
            <div id="recepientsbar" className="recepientsbar">
              <div className="divider" id="customfieldscolumn">
                <div className="col my-3 p-2">
                  <h6 className="text-uppercase text-black ls-1 mb-1 float-left">
                    Custom Fields
                  </h6>
                </div>
                <hr className="my-1" />
              </div>
              <button id="initialbtn" color="neutral" className="tool">
                <i className="material-icons">text_format</i>Initial
              </button>
              <button id="namebtn" color="neutral" className="tool">
                <i className=" material-icons">person</i>Name
              </button>
              <button id="companybtn" color="neutral" className="tool">
                <i className=" material-icons">apartment</i>Company
              </button>
              <button id="titlebtn" color="neutral" className="tool">
                <i className=" material-icons">work</i>Title
              </button>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default PDFAnnotate
