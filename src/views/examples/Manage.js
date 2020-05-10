import classnames from 'classnames'
// core components
import HeaderDefault from 'components/Headers/HeaderDefault.js'
import $ from 'jquery'
import { fabric } from 'fabric'
import * as jsPDF from 'jspdf'
import React from 'react'
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Row,
  TabContent,
  Table,
  TabPane,
} from 'reactstrap'
import DataVar from '../../variables/data'
import TemplateDataVar from '../../variables/templatedata'

var PDFJS = require('pdfjs-dist')

const axios = require('axios').default

class Tables extends React.Component {
  state = {
    tabs: 1,
  }
  toggleNavs = (e, state, index) => {
    e.preventDefault()
    this.setState({
      [state]: index,
    })
  }

  pdf = null;

  componentDidMount() {
    var pdf = '';
    var global = this;
    try {
      var mainurl = document.location.hash,
        params = mainurl.split('?')[1].split('&'),
        data = {},
        tmp
      for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=')
        data[tmp[0]] = tmp[1]
      }
      var action = data.action

      if (action === 'inbox') {
        var inboxbtn = document.getElementById('inboxbtn')
        inboxbtn.click()
      } else if (action === 'sent') {
        var sentbtn = document.getElementById('sentbtn')
        sentbtn.click()
      } else if (action === 'requests') {
        var actionrequiredbtn = document.getElementById('actionrequiredbtn')
        actionrequiredbtn.click()
      } else if (action === 'completed') {
        var completedbtn = document.getElementById('completedbtn')
        completedbtn.click()
      }
    } catch (error) {}

    var modal = document.querySelectorAll('.modal')
    modal[0].style.display = 'block'
    var userid = ''
    var email = ''
    var voiduserid = ''
    var voidfileid = ''
    var voidstatus = ''
    var deleteuserid = ''
    var deletefileid = ''
    var deletestatus = ''
    var unifileid = ''
    var historyfileid = ''
    var uniid = ''
    var downloadfileid = ''
    var droptoggle = 0
    var detailaction = 'download'
    var pdfset = 'pdf not exists'
    var RowSelectData = []

    var PDFFabric = function (
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
      var inst = this
      inst.fabricObjects.length = 0;
      inst.fabricObjectsData.length = 0;


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
              canvas.className = 'manage-pdf-canvas'
              canvas.height = viewport.height
              canvas.width = viewport.width
              var context = canvas.getContext('2d')

              var renderContext = {
                canvasContext: context,
                viewport: viewport,
              }
              var renderTask = page.render(renderContext)
              renderTask.then(function () {
                $('.manage-pdf-canvas').each(function (index, el) {
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
            e.target.lockUniScaling = true
            e.target.lockScalingFlip = true
            e.target.hasRotatingPoint = false
            e.target.padding = 5
            e.target.selectionDashArray = [10, 5]
            e.target.borderDashArray = [10, 5]
            e.lockMovementX = true
            e.lockMovementY = true
            e.selectable = false
            e.hasControls = false
          })
          inst.fabricObjects.push(fabricObj)
          
          fabricObj.setBackgroundImage(
            background,
            fabricObj.renderAll.bind(fabricObj)
          )
          fabricObj.on('after:render', function () {
            inst.fabricObjectsData[index] = fabricObj.toJSON()
            fabricObj.off('after:render')
          })

          

          
        })

        try {
          var addobjbtn = document.getElementById('manageaddobjbtn')
          addobjbtn.addEventListener('click', function (event) {
            global.pdf.AddObj()
            //console.log(global.pdf)
            //console.log('adding objects')
          })
          addobjbtn.click()
        } catch (error) {}
      }

      

      
    }

    PDFFabric.prototype.AddObj = function () {
      var inst = this
      //console.log('started adding objects')
              // // // // // // // ////console.log('file id found');
              $.each(inst.fabricObjects, function (index, fabricObj) {
                ////console.log(index);

                fabricObj.loadFromJSON(RowSelectData[index], function () {
                  fabricObj.renderAll()
                  fabricObj.getObjects().forEach(function (targ) {
                    ////console.log(targ);
                    targ.selectable = false
                    targ.hasControls = false
                  })
                  
                  
                })
              })
              //console.log('pdf done')
    }

    PDFFabric.prototype.savePdf = function () {
      var inst = this
      var doc = new jsPDF()
      $.each(inst.fabricObjects, function (index, fabricObj) {
        if (index != 0) {
          doc.addPage()
          doc.setPage(index + 1)
        }
        doc.addImage(fabricObj.toDataURL("image/jpeg", 0.3), 'JPEG', 0, 0, undefined, undefined, undefined,'FAST')
      })
      console.log('pdf saved')
      doc.save('pappayasign_' + inst.filename + '')
      //window.location.reload(false)
      modal[0].style.display = 'none'
      
    }

    PDFFabric.prototype.printPdf = function () {
      var inst = this
      var doc = new jsPDF()
      $.each(inst.fabricObjects, function (index, fabricObj) {
        if (index != 0) {
          doc.addPage()
          doc.setPage(index + 1)
        }
        doc.addImage(fabricObj.toDataURL("image/jpeg", 0.3), 'JPEG', 0, 0, undefined, undefined, undefined,'FAST')
      })
      console.log('pdf printed')
      window.open(doc.output('bloburl'), '_blank');
      //window.location.reload(false)
      modal[0].style.display = 'none'
      
    }

    PDFFabric.prototype.Clear = function () {
      var inst = this
      $.each(inst.fabricObjects, function (index, fabricObj) {
        inst.fabricObjects.slice(index,1);
      })
      modal[0].style.display = 'none'
      
    }

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

    var userid = getCookie('uid')

    if (userid) {
      //console.log('user logged in');
      //console.log(userid);
      var email = getCookie('useremail')

      inboxfunc()
      datafunc()
      //modal[5].style.display = 'block'
    } else {
      window.location.hash = '#/auth/login'
    }

    async function inboxfunc() {
      modal[0].style.display = 'block'
      $('#actionrequiredtable tbody tr').remove()
      $('#alltable tbody tr').remove()
      $('#deletedtable tbody tr').remove()
      $('#completedtable tbody tr').remove()
      $('#expiringtable tbody tr').remove()

      await axios
        .post('/getuserdata', {
          UserID: userid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'user found') {
            var Request = response.data.user.Request
            var allcontent = ''
            var deletedcontent = ''
            var completedcontent = ''
            var expiringcontent = ''
            var actionrequiredcontent = ''

            Request.forEach(function (data, index) {
              if (
                Request[index].RecepientStatus == 'Void' ||
                Request[index].RecepientStatus == 'Need to Sign' ||
                Request[index].RecepientStatus == 'Expiring' ||
                Request[index].RecepientStatus == 'Correcting'
              ) {
                allcontent += '<tr >'
                allcontent += '<th><input  type="checkbox"></th>'
                allcontent +=
                  '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                  Request[index].DocumentName +
                  '\nFrom: ' +
                  Request[index].FromEmail +
                  '</span></td>'
                allcontent +=
                  '<td id="datastatus">' +
                  Request[index].RecepientStatus +
                  '</td>'
                allcontent +=
                  '<td id="datakey" hidden>' +
                  Request[index].DocumentID +
                  '</td>'
                allcontent +=
                  '<td id="datauid" hidden>' + Request[index].From + '</td>'
                allcontent +=
                  '<td id="datarecep" hidden>' +
                  Request[index].FromEmail +
                  '</td>'
                allcontent +=
                  '<td >' + Request[index].RecepientDateStatus + '</td>'
                allcontent +=
                  `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary"><a href="#/admin/sign?id=` +
                  Request[index].DocumentID +
                  `&type=db&u=` +
                  Request[index].From +
                  `">SIGN</a></button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                allcontent += '</tr>'
                if (Request[index].RecepientStatus == 'Need to Sign') {
                  actionrequiredcontent += '<tr >'
                  actionrequiredcontent += '<th><input  type="checkbox"></th>'
                  actionrequiredcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    Request[index].DocumentName +
                    '\nFrom: ' +
                    data.FromEmail +
                    '</span></td>'
                  actionrequiredcontent +=
                    '<td id="datastatus">' +
                    Request[index].RecepientStatus +
                    '</td>'
                  actionrequiredcontent +=
                    '<td id="datakey" hidden>' +
                    Request[index].DocumentID +
                    '</td>'
                  actionrequiredcontent +=
                    '<td id="datauid" hidden>' + Request[index].From + '</td>'
                  actionrequiredcontent +=
                    '<td id="datarecep" hidden>' +
                    Request[index].FromEmail +
                    '</td>'
                  actionrequiredcontent +=
                    '<td >' + Request[index].RecepientDateStatus + '</td>'
                  actionrequiredcontent +=
                    `<td ><div class="btn-group">
                <button type="button" class="btn btn-primary"><a href="#/admin/sign?id=` +
                    Request[index].DocumentID +
                    `&type=db&u=` +
                    Request[index].From +
                    `">SIGN</a></button>
                <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                <div class="dropdown-menu2" id="dropdown">
                <button class="dropdown-item move" type="button">Move</button>
                <button class="dropdown-item correct" type="button">Correct</button>
                <button class="dropdown-item create" type="button">Create a Copy</button>
                <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                <button class="dropdown-item void" type="button">Void</button>
                <button class="dropdown-item history" type="button">History</button>
                <button class="dropdown-item export" type="button">Export as CSV</button>
                <button class="dropdown-item deletemanage" type="button">Delete</button>
                </div>
              </div></td >`
                  actionrequiredcontent += '</tr>'
                }
              } else if (Request[index].RecepientStatus == 'Deleted') {
                deletedcontent += '<tr >'
                deletedcontent += '<th><input  type="checkbox"></th>'
                deletedcontent +=
                  '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                  Request[index].DocumentName +
                  '\nFrom: ' +
                  Request[index].FromEmail +
                  '</span></td>'
                deletedcontent +=
                  '<td id=datastatus>' +
                  Request[index].RecepientStatus +
                  '</td>'
                deletedcontent +=
                  '<td id="datakey" hidden>' +
                  Request[index].DocumentID +
                  '</td>'
                deletedcontent +=
                  '<td id="datauid" hidden>' + Request[index].From + '</td>'
                deletedcontent +=
                  '<td id="datarecep" hidden>' +
                  Request[index].FromEmail +
                  '</td>'
                deletedcontent +=
                  '<td >' + Request[index].RecepientDateStatus + '</td>'
                deletedcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary restore">CONTINUE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item correct" type="button">Continue</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              </div>
              </div></td >`
                deletedcontent += '</tr>'
              } else if (Request[index].RecepientStatus == 'Completed') {
                completedcontent += '<tr >'
                completedcontent += '<th><input  type="checkbox"></th>'
                completedcontent +=
                  '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                  Request[index].DocumentName +
                  '\nFrom: ' +
                  Request[index].FromEmail +
                  '</span></td>'
                completedcontent +=
                  '<td id="datastatus">' +
                  Request[index].RecepientStatus +
                  '</td>'
                completedcontent +=
                  '<td id="datakey" hidden>' +
                  Request[index].DocumentID +
                  '</td>'
                completedcontent +=
                  '<td id="datauid" hidden>' + Request[index].From + '</td>'
                completedcontent +=
                  '<td id="datarecep" hidden>' +
                  Request[index].FromEmail +
                  '</td>'
                completedcontent +=
                  '<td >' + Request[index].RecepientDateStatus + '</td>'
                completedcontent += `<td ><div class="btn-group">
            <button type="button" class="btn btn-primary move">MOVE</button>
            <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
            <div class="dropdown-menu2" id="dropdown">
            <button class="dropdown-item correct" type="button">Forward</button>
            <button class="dropdown-item create" type="button">Create a Copy</button>
            <button class="dropdown-item savetemplate" type="button">Save as Template</button>
            <button class="dropdown-item history" type="button">History</button>
            <button class="dropdown-item export" type="button">Export as CSV</button>
            <button class="dropdown-item deletemanage" type="button">Delete</button>
            </div>
          </div></td >`
                completedcontent += '</tr>'
              } else if (Request[index].RecepientStatus == 'Expiring') {
                expiringcontent += '<tr >'
                expiringcontent += '<th><input  type="checkbox"></th>'
                expiringcontent +=
                  '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                  Request[index].DocumentName +
                  '\nFrom: ' +
                  Request[index].FromEmail +
                  '</span></td>'
                  expiringcontent +=
                  '<td id="datastatus">' +
                  Request[index].RecepientStatus +
                  '</td>'
                  expiringcontent +=
                  '<td id="datakey" hidden>' +
                  Request[index].DocumentID +
                  '</td>'
                  expiringcontent +=
                  '<td id="datauid" hidden>' + Request[index].From + '</td>'
                  expiringcontent +=
                  '<td id="datarecep" hidden>' +
                  Request[index].FromEmail +
                  '</td>'
                  expiringcontent +=
                  '<td >' + Request[index].RecepientDateStatus + '</td>'
                  expiringcontent += `<td ><div class="btn-group">
            <button type="button" class="btn btn-primary resend">RESEND</button>
            <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
            <div class="dropdown-menu2" id="dropdown">
            <button class="dropdown-item move" type="button">Move</button>
            <button class="dropdown-item correct" type="button">Correct</button>
            <button class="dropdown-item create" type="button">Create a Copy</button>
            <button class="dropdown-item savetemplate" type="button">Save as Template</button>
            <button class="dropdown-item void" type="button">Void</button>
            <button class="dropdown-item history" type="button">History</button>
            <button class="dropdown-item export" type="button">Export as CSV</button>
            <button class="dropdown-item deletemanage" type="button">Delete</button>
            </div>
          </div></td >`
          expiringcontent += '</tr>'
              }
            })
            $('#alltable').append(allcontent)
            $('#deletedtable').append(deletedcontent)
            $('#actionrequiredtable').append(actionrequiredcontent)
            $('#completedtable').append(completedcontent)
            $('#expiringtable').append(expiringcontent)
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[0].style.display = 'none'
        })
    }

    async function datafunc() {
      modal[0].style.display = 'block'
      $('#senttable tbody tr').remove()
      $('#waitingtable tbody tr').remove()
      $('#authtable tbody tr').remove()

      await axios
        .post('/getmanagedocdata', {
          UserID: userid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc found') {
            var Documents = response.data.doc
            //console.log(Documents);
            var sentcontent = ''
            var draftcontent = ''
            var deletedcontent = ''
            var completedcontent = ''
            var waitingcontent = ''
            var authcontent = ''
            var expiringcontent = ''

            Documents.forEach(function (data, index) {
              var reciverlist = ''
              try {
                data.Reciever.forEach(function (reciever, index) {
                  var id = index + 1
                  reciverlist =
                    reciverlist + ' ' + reciever.RecepientEmail + '\n'
                })
              } catch (error) {}

              if (
                data.Status == 'Sent' ||
                data.Status == 'Waiting for Others' ||
                data.Status == 'Declined' ||
                data.Status == 'Void' ||
                data.Status == 'Authentication Failed' ||
                data.Status == 'Correcting' ||
                data.Status == 'Completed' ||
                data.Status == 'Expiring' ||
                data.Status == 'Draft'
              ) {
                if (data.Status == 'Waiting for Others') {
                  waitingcontent += '<tr >'
                  waitingcontent += '<th><input  type="checkbox"></th>'
                  waitingcontent +=
                    '<td scope="row" class="rowselect" ><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  waitingcontent += '<td id=datastatus>' + data.Status + '</td>'
                  waitingcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  waitingcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  waitingcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  waitingcontent += '<td >' + data.DateStatus + '</td>'
                  waitingcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  waitingcontent += '</tr>'

                  sentcontent += '<tr >'
                  sentcontent +=
                    '<th><input class="primary" type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                } else if (data.Status == 'Correcting') {
                  sentcontent += '<tr >'
                  sentcontent += '<th><input  type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary correct">CONTINUE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                } else if (data.Status == 'Void') {
                  sentcontent += '<tr >'
                  sentcontent += '<th><input  type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary move">MOVE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                } else if (data.Status == 'Draft') {
                  draftcontent += '<tr >'
                  draftcontent += '<th><input  type="checkbox"></th>'
                  draftcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  draftcontent += '<td id=datastatus>' + data.Status + '</td>'
                  draftcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  draftcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  draftcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  draftcontent += '<td >' + data.DateStatus + '</td>'
                  draftcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary correct">CONTINUE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  draftcontent += '</tr>'
                } else if (data.Status == 'Authentication Failed') {
                  authcontent += '<tr >'
                  authcontent += '<th><input  type="checkbox"></th>'
                  authcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  authcontent += '<td id=datastatus>' + data.Status + '</td>'
                  authcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  authcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  authcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  authcontent += '<td >' + data.DateStatus + '</td>'
                  authcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
              </div></td >`
                  authcontent += '</tr>'

                  sentcontent += '<tr >'
                  sentcontent +=
                    '<th><input class="primary" type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                } else if (data.Status == 'Expiring') {
                  expiringcontent += '<tr >'
                  expiringcontent += '<th><input  type="checkbox"></th>'
                  expiringcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  expiringcontent +=
                    '<td id=datastatus>' + data.Status + '</td>'
                  expiringcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  expiringcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  expiringcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  expiringcontent += '<td >' + data.DateStatus + '</td>'
                  expiringcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
              </div></td >`
                  expiringcontent += '</tr>'

                  sentcontent += '<tr >'
                  sentcontent +=
                    '<th><input class="primary" type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                } else if (data.Status == 'Completed') {
                  completedcontent += '<tr >'
                  completedcontent += '<th><input  type="checkbox"></th>'
                  completedcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  completedcontent +=
                    '<td id=datastatus>' + data.Status + '</td>'
                  completedcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  completedcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  completedcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  completedcontent += '<td >' + data.DateStatus + '</td>'
                  completedcontent += `<td ><div class="btn-group">
                <button type="button" class="btn btn-primary move">MOVE</button>
                <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                <div class="dropdown-menu2" id="dropdown">
                <button class="dropdown-item correct" type="button">Forward</button>
                <button class="dropdown-item create" type="button">Create a Copy</button>
                <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                <button class="dropdown-item history" type="button">History</button>
                <button class="dropdown-item export" type="button">Export as CSV</button>
                <button class="dropdown-item deletemanage" type="button">Delete</button>
                </div>
                </div></td >`
                  completedcontent += '</tr>'

                  sentcontent += '<tr >'
                  sentcontent +=
                    '<th><input class="primary" type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary move">Move</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                }
              } else if (data.Status == 'Deleted') {
                deletedcontent += '<tr >'
                deletedcontent += '<th><input  type="checkbox"></th>'
                deletedcontent +=
                  '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                  data.DocumentName +
                  '\nTo: ' +
                  reciverlist +
                  '</span></td>'
                deletedcontent += '<td id=datastatus>' + data.Status + '</td>'
                deletedcontent +=
                  '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                deletedcontent +=
                  '<td id="datarecep" hidden>' + reciverlist + '</td>'
                deletedcontent +=
                  '<td id="datauid" hidden>' + data.Owner + '</td>'
                deletedcontent += '<td >' + data.DateStatus + '</td>'
                deletedcontent += `<td ><div class="btn-group">
                <button type="button" class="btn btn-primary restore">CONTINUE</button>
                <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                <div class="dropdown-menu2" id="dropdown">
                <button class="dropdown-item correct" type="button">Continue</button>
                <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                </div>
                </div></td >`
                deletedcontent += '</tr>'
              }
            })
            $('#senttable').append(sentcontent)
            $('#draftstable').append(draftcontent)
            $('#deletedtable').append(deletedcontent)
            $('#completedtable').append(completedcontent)
            $('#waitingtable').append(waitingcontent)
            $('#expiringtable').append(expiringcontent)
            $('#authtable').append(authcontent)
            modal[0].style.display = 'none'
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[0].style.display = 'none'
        })
    }

    $(document).on('click', '.rowselect', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      $('#managerecepientstable li').remove()
      $('#managerecepientstable').innerHTML = ''
      global.pdf = null;
      document.getElementById('managebody').style.display = 'none'
      document.getElementById('detailbody').style.display = 'block'
      //console.log($(this).parent().children('#datakey')[0].innerHTML);
      //console.log($(this).parent().children('#datauid')[0].innerHTML);
      //console.log($(this).parent().children('#datastatus')[0].innerHTML);
      var rowselectuserid = $(this).parent().children('#datauid')[0].innerHTML
      var rowselectfileid = $(this).parent().children('#datakey')[0].innerHTML
      var rowselectstatus = $(this).parent().children('#datastatus')[0]
        .innerHTML
      unifileid = rowselectfileid
      uniid = rowselectuserid
      downloadfileid = rowselectfileid;

      axios
        .post('/getdocdata', {
          DocumentID: rowselectfileid,
        })
        .then(async function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document
            RowSelectData = response.data.Data
            
            //console.log(Document.Reciever);

            var reciverlistrow = ''
            try {
              Document.Reciever.forEach(function (reciever, index) {
                var id = index + 1
                reciverlistrow =
                  reciverlistrow + ' ' + reciever.RecepientEmail + ','

                var li = document.createElement('li')
                li.innerHTML =
                  `<div class="rcardmanage">
                <div class="managelabelspan">
                <strong><span  id="summary-recepient-name">Name: ` +
                  reciever.RecepientName +
                  `</span></strong>
                </div>
                <div class="managelabelspan">
                <span  id="summary-recepient-name">` +
                  reciever.RecepientEmail +
                  `</span>
                </div>
                <div class="managelabelspan">
                <span  id="summary-recepient-name">Action: ` +
                  reciever.RecepientOption +
                  `</span>
                </div>
                <div class="managelabelspan">
                <span  id="summary-recepient-name">Status: ` +
                  reciever.RecepientStatus +
                  `</span>
                </div>
                </div>`
                $('#managerecepientstable').append(li)
              })
              document.getElementById('detailsubject').innerHTML =
                Document.DocumentName
              document.getElementById('detailid').innerHTML = rowselectfileid
              document.getElementById('detailsent').innerHTML =
                Document.DateSent
              document.getElementById('detailcreate').innerHTML =
                Document.DateCreated
              document.getElementById('detailholder').innerHTML =
                Document.OwnerEmail
              document.getElementById(
                'detailrecepients'
              ).innerHTML = reciverlistrow
              document.getElementById('detailstatus').innerHTML =
                Document.Status
              document.getElementById('detailstatusdate').innerHTML =
                Document.DateStatus

                await axios
                .post('/docdownload', {
                  UserID: rowselectuserid,
                  filename: rowselectfileid,
                })
                .then(async function (response) {
                  console.log(response)
                  if (response.data.Status === 'doc found') {
                    var doc = response.data.data
                    console.log(doc);
                    //modal[0].style.display = 'block'
                    pdfset = 'pdf exists';
                    global.pdf = await new PDFFabric(
                      'manage-pdf-container',
                      'manage-toolbar',
                      doc,
                      rowselectfileid,
                      {
                        onPageUpdated: (page, oldData, newData) => {
                          
                          //modal[0].style.display = "block";
                          ////console.log(page, oldData, newData);
                        },
                      }
                    )
                    console.log(global.pdf)
                  }
                })
                .catch(function (error) {
                  console.log(error)
                  modal[0].style.display = 'none'
                })
              modal[2].style.display = 'none'
            } catch (error) {
              modal[2].style.display = 'none'
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })

    $('#detailbackbtn').click(function () {
      $('.manage-pdf-canvas').remove()
      const myNode = document.getElementById('manage-pdf-container')
      myNode.innerHTML = ''
      global.pdf.Clear();
      document.getElementById('managebody').style.display = 'block'
      document.getElementById('detailbody').style.display = 'none'
      $('#managerecepientstable li').remove()
      $('#managerecepientstable').innerHTML = ''
      document.getElementById('detailsubject').innerHTML = ''
      document.getElementById('detailid').innerHTML = ''
      document.getElementById('detailsent').innerHTML = ''
      document.getElementById('detailcreate').innerHTML = ''
      document.getElementById('detailholder').innerHTML = ''
      document.getElementById('detailrecepients').innerHTML = ''
      document.getElementById('detailstatus').innerHTML = ''
      document.getElementById('detailstatusdate').innerHTML = ''
    })

    $('#detaildownloadbtn').click(function () {
      modal[0].style.display = 'block'
      setTimeout(function(){ 
        global.pdf.savePdf();
      }, 1000);
      
      
      
    })

    $('#detailprintbtn').click(function () {
      modal[0].style.display = 'block'
      setTimeout(function(){ 
        global.pdf.printPdf();
      }, 1000);
      
    })

    $(document).on('click', '.void', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      try {
        //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
        voiduserid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        voidfileid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        voidstatus = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        voiduserid = $(this).parent().parent().parent().children('#datauid')[0]
          .innerHTML
        voidfileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        voidstatus = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      modal[3].style.display = 'block'
    })

    $('#managevoidapprovebtn').click(function () {
      modal[3].style.display = 'none'
      modal[2].style.display = 'block'
      var today = new Date().toLocaleString().replace(',', '')
      var managevoidmessage = document.getElementById('managevoidmessage').value
      if (managevoidmessage !== '') {
        axios
          .post('/getReciever', {
            DocumentID: voidfileid,
          })
          .then(function (response) {
            console.log(response)
            if (response.data.Status === 'got recievers') {
              var recievers = response.data.Reciever
              var status = response.data.DocStatus

              recievers.forEach(function (item, index) {
                var recepient_index = index
                //console.log(recepient_index);

                recievers[index].RecepientStatus = 'Void'
                recievers[index].RecepientDateStatus = today

                axios
                  .post('/updaterecieverdata', {
                    Reciever: recievers,
                  })
                  .then(function (response) {
                    console.log(response)
                  })
                  .catch(function (error) {
                    console.log(error)
                    modal[2].style.display = 'none'
                  })

                

                axios
                  .post('/sendmail', {
                    to: item.RecepientEmail,
                    body:
                      '<div><p>Hello ' +
                      item.RecepientName +
                      ', ' +
                      item.DocumentName +
                      ' Has been voided. \n\nReason:' +
                      managevoidmessage +
                      '</p></div>',
                    subject: 'PappayaSign: Document Voided',
                  })
                  .then(function (response) {
                    console.log(response)
                  })
                  .catch(function (error) {
                    //console.log('no data');
                    modal[2].style.display = 'none'
                  })
              })

              axios
                  .post('/getRequests', {
                    UserID: voiduserid,
                  })
                  .then(function (response) {
                    console.log(response)
                    if (response.data.Status === 'got request') {
                      var request = response.data.Request
                      var status = response.data.DocStatus

                      request.forEach(function (item, index) {
                        if (request[index].DocumentID === voidfileid) {
                          var recepient_index = index
                          //console.log(recepient_index);
                          request[index].RecepientStatus = 'Void'
                          request[index].RecepientDateStatus = today

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
                              modal[2].style.display = 'none'
                            })
                        }
                      })
                    }
                  })
                  .catch(function (error) {
                    console.log(error)
                    modal[2].style.display = 'none'
                  })

              axios
                .post('/updatedocumentstatus', {
                  DocumentID: voidfileid,
                  Status: 'Void',
                })
                .then(function (response) {
                  console.log(response)
                  if (
                    response.data === 'insert done' ||
                    response.data === 'update done'
                  ) {
                    alert('Document Voided')
                    inboxfunc()
                    datafunc()
                    modal[2].style.display = 'none'
                  }
                })
                .catch(function (error) {
                  console.log(error)
                  modal[2].style.display = 'none'
                })
            }
          })
          .catch(function (error) {
            console.log(error)
            modal[2].style.display = 'none'
          })
      } else {
        alert('Please provide a reason, So we could let your recepients know.')
      }
    })

    $('#managevoidcancelbtn').click(function () {
      modal[3].style.display = 'none'
    })

    $(document).on('click', '.deletemanage', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      try {
        //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
        deleteuserid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        deletefileid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        deletestatus = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        deleteuserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        deletefileid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        deletestatus = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      modal[4].style.display = 'block'
    })

    $('#managedeleteapprovebtn').click(function () {
      modal[4].style.display = 'none'
      modal[2].style.display = 'block'
      var today = new Date().toLocaleString().replace(',', '')

      axios
        .post('/getReciever', {
          DocumentID: deletefileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'got recievers') {
            var recievers = response.data.Reciever
            var status = response.data.DocStatus

            recievers.forEach(function (item, index) {
              var recepient_index = index
              //console.log(recepient_index);

              recievers[index].RecepientStatus = 'Deleted'
              recievers[index].RecepientDateStatus = today

              axios
                .post('/updaterecieverdata', {
                  Reciever: recievers,
                })
                .then(function (response) {
                  console.log(response)
                })
                .catch(function (error) {
                  console.log(error)
                  modal[2].style.display = 'none'
                })

              axios
                .post('/getRequests', {
                  UserID: deleteuserid,
                })
                .then(function (response) {
                  console.log(response)
                  if (response.data.Status === 'got request') {
                    var request = response.data.Request
                    var status = response.data.DocStatus

                    request.forEach(function (item, index) {
                      if (request[index].DocumentID === deletefileid) {
                        var recepient_index = index
                        //console.log(recepient_index);
                        request[index].RecepientStatus = 'Deleted'
                        request[index].RecepientDateStatus = today

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
                            modal[2].style.display = 'none'
                          })
                      }
                    })
                  }
                })
                .catch(function (error) {
                  console.log(error)
                  modal[2].style.display = 'none'
                })
            })

            axios
              .post('/updatedocumentstatus', {
                DocumentID: deletefileid,
                Status: 'Deleted',
              })
              .then(function (response) {
                console.log(response)
                if (
                  response.data === 'insert done' ||
                  response.data === 'update done'
                ) {
                  alert('Document Deleted')
                  inboxfunc()
                  datafunc()
                  modal[2].style.display = 'none'
                }
              })
              .catch(function (error) {
                console.log(error)
                modal[2].style.display = 'none'
              })
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[2].style.display = 'none'
        })
    })

    $('#managedeletecancelbtn').click(function () {
      modal[4].style.display = 'none'
      modal[2].style.display = 'none'
    })

    $(document).on('click', '.export', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
      //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
      //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
      var exportuserid = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datauid')[0].innerHTML
      var fileid = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datakey')[0].innerHTML
      var status = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datastatus')[0].innerHTML
      var recepients = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datarecep')[0].innerHTML

      axios
        .post('/getdocdata', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document

            var datarray = []
            datarray.push({
              DateCreated: Document.DateCreated,
              DateSent: Document.DateSent,
              DateCreated: Document.DateCreated,
              DateStatus: Document.DateStatus,
              DocumentName: Document.DocumentName,
              Owmer: Document.Owner,
              OwnerEmail: Document.OwnerEmail,
              Recepients: recepients,
              Status: Document.Status,
            })
            //console.log(datarray);

            //console.log(CSV(datarray, fileid));
            CSV(datarray, fileid);
            modal[2].style.display = 'none'
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })


    $(document).on('click', '.history', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
      //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
      //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
      var exportuserid = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datauid')[0].innerHTML
      var fileid = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datakey')[0].innerHTML
      var status = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datastatus')[0].innerHTML
      var recepients = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datarecep')[0].innerHTML

      historyfileid = fileid;
        axios
        .post('/getdocdata', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document
            //console.log(Document.Reciever);

            var reciverlistrow = ''
            try {
              
              document.getElementById('historysubject').innerHTML =
                Document.DocumentName
              document.getElementById('historyid').innerHTML = fileid
              document.getElementById('historysent').innerHTML =
                Document.DateSent
              document.getElementById('historycreate').innerHTML =
                Document.DateCreated
              document.getElementById('historyholder').innerHTML =
                Document.OwnerEmail
              document.getElementById(
                'historyrecepients'
              ).innerHTML = reciverlistrow
              document.getElementById('historystatus').innerHTML =
                Document.Status
              document.getElementById('historystatusdate').innerHTML =
                Document.DateStatus
            } catch (error) {
              modal[2].style.display = 'none'
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })

      axios
        .post('/gethistory', {
          DocumentID: fileid,
        })
        .then(function (response) {
          var historycontent = '';
          $('#historytable tbody tr').remove()
          modal[2].style.display = 'none'
          modal[5].style.display = 'block'

          console.log(response)
          if (response.data.Status === 'history found') {
            var History = response.data.history

            History.forEach(function (item, index) {
              historycontent += '<tr >'
              historycontent += '<th scope="row"><span className="mb-0 text-sm"></span>'+item.HistoryTime+'</th>'
              historycontent += '<th scope="row"><span className="mb-0 text-sm"></span>'+item.HistoryUser+'</th>'
              historycontent += '<th scope="row"><span className="mb-0 text-sm"></span>'+item.HistoryAction+'</th>'
              historycontent += '<th scope="row"><span className="mb-0 text-sm"></span>'+item.HistoryActivity+'</th>'
              historycontent += '<th scope="row"><span className="mb-0 text-sm"></span>'+item.HistoryStatus+'</th>'
            historycontent += '</tr>'
            });
            $('#historytable').append(historycontent);

            
            //console.log(datarray);

            //console.log(CSV(datarray, fileid));
            
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })

    function CSV(array, csvfileid) {
      // Use first element to choose the keys and the order
      var keys = Object.keys(array[0])

      // Build header
      var result = keys.join(',') + '\n'

      // Add the rows
      array.forEach(function (obj) {
        result += keys.map((k) => obj[k]).join(',') + '\n'
      })

      var hiddenElement = document.createElement('a')
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(result)
      hiddenElement.target = '_blank'
      hiddenElement.download = '' + csvfileid + '.csv'
      hiddenElement.click()

      return result
    }

    $(document).on('click', '.action', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      if (droptoggle === 0) {
        $(this).parent().children('#dropdown')[0].style.display = 'block'
        droptoggle = 1
      } else if (droptoggle === 1) {
        droptoggle = 0
        $(this).parent().children('#dropdown')[0].style.display = 'none'
      }
    })

    $(document).on('click', '.correct', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      try {
        //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
        var correctuserid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        var correctuserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      var docname = ''

      var today = new Date().toLocaleString().replace(',', '')
      var dbpeople = []

      axios
        .post('/getReciever', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'got recievers') {
            var recievers = response.data.Reciever
            var status = response.data.DocStatus

            recievers.forEach(function (item, index) {
              docname = item.DocumentName
              dbpeople.push({
                name: item.RecepientName,
                email: item.RecepientEmail,
                option: item.RecepientOption,
              })
              //console.log(dbpeople);
              var recepient_index = index
              //console.log(recepient_index);

              recievers[index].RecepientStatus = 'Correcting'
              recievers[index].RecepientDateStatus = today

              axios
                .post('/updaterecieverdata', {
                  Reciever: recievers,
                })
                .then(function (response) {
                  console.log(response)
                })
                .catch(function (error) {
                  console.log(error)
                  modal[2].style.display = 'none'
                })

              axios
                .post('/getRequests', {
                  UserID: correctuserid,
                })
                .then(function (response) {
                  console.log(response)
                  if (response.data.Status === 'got request') {
                    var request = response.data.Request
                    var status = response.data.DocStatus

                    request.forEach(function (item, index) {
                      if (request[index].DocumentID === fileid) {
                        var recepient_index = index
                        //console.log(recepient_index);
                        request[index].RecepientStatus = 'Correcting'
                        request[index].RecepientDateStatus = today

                        axios
                          .post('/updaterequestdata', {
                            UserID: correctuserid,
                            Request: request,
                          })
                          .then(function (response) {
                            console.log(response)
                          })
                          .catch(function (error) {
                            console.log(error)
                            modal[2].style.display = 'none'
                          })
                      }
                    })
                  }
                })
                .catch(function (error) {
                  console.log(error)
                  modal[2].style.display = 'none'
                })
            })

            axios
              .post('/updatedocumentstatus', {
                DocumentID: correctuserid,
                Status: 'Correcting',
              })
              .then(function (response) {
                console.log(response)
                if (
                  response.data === 'insert done' ||
                  response.data === 'update done'
                ) {
                  //alert('Document Correcting');
                  setTimeout(function () {
                    modal[2].style.display = 'none'
                    DataVar.RecepientArray = dbpeople
                    var wurl =
                      '#/admin/uploadsuccess?id=' +
                      fileid +
                      '&u=' +
                      correctuserid +
                      '&docname=' +
                      docname +
                      '&action=correct'
                    window.location.hash = wurl
                  }, 3000)
                }
              })
              .catch(function (error) {
                console.log(error)
                modal[2].style.display = 'none'
              })
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[2].style.display = 'none'
        })
    })

    $(document).on('click', '.create', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      try {
        //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
        var createuserid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        var createuserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      var docname = ''

      axios
        .post('/getdocdata', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document
            var dbpeople = []
            Document.Reciever.forEach(function (data, index) {
              dbpeople.push({
                name: data.RecepientName,
                email: data.RecepientEmail,
                option: data.RecepientOption,
              })
              //console.log(dbpeople);
            })
            DataVar.RecepientArray = dbpeople
            docname = Document.DocumentName

            var newdocid = randomString(13)

            axios
              .post('/docdownload', {
                UserID: createuserid,
                filename: fileid,
              })
              .then(function (response) {
                console.log(response)
                if (response.data.Status === 'doc found') {
                  var doc = response.data.data

                  //console.log(doc);

                  DataVar.DocName = docname
                  DataVar.DataURI = doc
                  DataVar.DataPath = doc
                  modal[2].style.display = 'none'
                  var wurl =
                    '#/admin/uploadsuccess?id=' +
                    fileid +
                    '&u=' +
                    createuserid +
                    '&docname=' +
                    docname +
                    '&action=create'
                  window.location.hash = wurl
                }
              })
              .catch(function (error) {
                console.log(error)
                modal[2].style.display = 'none'
              })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })

    $(document).on('click', '.savetemplate', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      try {
        //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
        var templateuserid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        var templateuserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      var docname = ''

      axios
        .post('/getdocdata', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document
            var dbpeople = []
            Document.Reciever.forEach(function (data, index) {
              dbpeople.push({
                name: data.RecepientName,
                email: data.RecepientEmail,
                option: data.RecepientOption,
              })
              //console.log(dbpeople);
            })

            TemplateDataVar.TemplateID = fileid
            TemplateDataVar.TemplateUserID = templateuserid
            TemplateDataVar.TemplateRecepientCount = dbpeople.length
            TemplateDataVar.TemplateRecepientArray = dbpeople

            modal[2].style.display = 'none'
            var wurl = '#/admin/saveastemplate'
            window.location.hash = wurl
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })

    $(document).on('click', '.resend', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[1].style.display = 'block'
      try {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        var resenduserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        var resenduserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      axios
        .post('/getdocdata', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document
            var dbpeople = []
            Document.Reciever.forEach(function (data, index) {
              var url =
                process.env.REACT_APP_BASE_URL +
                '/#/admin/sign?id=' +
                fileid +
                '&type=db&u=' +
                resenduserid +
                '&key=' +
                index +
                ''
              if (data.RecepientStatus === 'Sent') {
                var dbpeople = []
                dbpeople.push({
                  name: data.RecepientName,
                  email: data.RecepientEmail,
                  option: data.RecepientOption,
                })
                //console.log(dbpeople);

                axios
                  .post('/sendmail', {
                    to: data.RecepientEmail,
                    body:
                      `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, ` +
                      data.RecepientName +
                      `</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. </p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="` +
                      url +
                      `" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`,
                    subject: 'PappayaSign: Sign Request',
                  })
                  .then(function (response) {
                    console.log(response)
                    //firebase.database().ref(voiduserid + '/Documents/'+voidfileid+'/Reciever/'+childdata.key+'/').child('RecepientStatus').set('Void');
                  })
                  .catch(function (error) {
                    //console.log('message could not be sent');
                  })
              }
              inboxfunc()
              datafunc()
              modal[1].style.display = 'none'
              //console.log('Document Resent');
              alert('Document Resent')
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })

    $('#startnowbtn').click(function () {
      window.location.hash = '#/admin/startdrop'
    })

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


    window.onclick = function (e) {
      if (e.target == modal[5]) {
        modal[5].style.display = 'none'
      }
    }



    $('#historycertificatebtn').click(function () {
      modal[2].style.display = 'block'
      modal[5].style.display = 'none'

      axios
        .post('/getdocdata', {
          DocumentID: historyfileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document

            axios
        .post('/gethistory', {
          DocumentID: historyfileid,
        })
        .then(function (response) {

          console.log(response)
          if (response.data.Status === 'history found') {
            var signers = response.data.history
            var signerslist = '';

            signers.forEach(function (item, index) {
              var HistoryUser = item.HistoryUser.replace(/\n/g, " ");
              signerslist += `
              User: `+HistoryUser+`\tTime: `+item.HistoryTime+`\tStatus: `+item.HistoryStatus+`
              Action: `+item.HistoryAction+`\n
              `});

            var doc = new jsPDF();
            doc.setFontSize(9);

            var logo = 'data:image/jpeg;base64,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H92c5fwA6Y7upV78HWK5niODXaBlthk2tD9x9oiIko5HFgtpSslJ6gbpG2/f1qT6UpqilpntnaW5ORnjwUG1/W0dfXRyUkgeQ3BxvHHdv81pOLTQnK8/uVszLCLd9IS2I/sUyKlaUuKQFFSFp5iAduZQI7+6tbU9lnrntqKYZIGCPkVu6F1NS2uN9HWu2Wk7QPLPAg48ArK4cMSyrB9KLbjuYRUxZzDr60shwLLba1lSQojpv1PQGuxYKWejoWw1Aw4Z3dxKjerq+luV1fUUZy0gb+GSBhbnV7S2zat4e/jV0IZkJPbQZfLuqO+B0V6g9xHiD8K2LrbY7pTmF+48j0P+cVp2G9zWKrFTFvHBw6j/ADglV0d4ftWsM1rsky64w4iBaphcfnpcSY6muVQ5kq33O+/dtv5ioRarHX0lyY57Pdad55YVpX/VNpuFllZFL7zxubvznI4/5hNxqfcTatPMin9u6x2Vue3dbb7RTYKSCsJ3G+2++247qsSd2zE49yoG8S9hQTSZxhp34zjvx3JBbVpsvI7nFt+K5PaLsuW8hpLQdMeR1OxPZuhO5A67JKu6o22DbIDCCqMgtBq5Gx0sjX5OMZwfg7HpldFrRbI9mtMK0REhLEGO3HbA8EoSEj+QqTtaGgNHJfoCCFtPE2JnBoA+CzK+llRREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURQLN9ZMbwu+MYqm3XW932Q12ybdao3bOpb/aV1AArWlqWRO2MEnoFw7jf6e3zCm2XPkIzstGTjvWThGrWJZxAuMyM8/bHrMvkuUW5IEd2IevVYJ2A6Hrv4V9RVDJQSN2OOVkt18pbjG97SWln5g7cW+KzbrNx/PcLvUSyXiDco0uFIiqcjPpdSFKbI2JSTsetfTi2aMhpys80kFzo5GwvDgWkbiDxCqPhj0FThkFvO8siJN8mN7xGFjf2NlQ7/vqH4Dp4mtKgpOyHaP4/JRTR+mv2ewVtUP3juA/pH3PoEwddJTxFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURVtlukMu6Z0zqPiGXyMevXYJiyyIyZDUplJHuqSojY7ADceQrVkpi6TtWOwVHq6xPmrRcKSUxyYwdwII8Cofm/DZcsv1InZGjLEw8fvhjru8FtKg6+WgPcBHTYlIO5O43PQ1gloTJKXbXuniFybjpKSuuLqgS4ifjbaOJxy81I3OG3T0Xl64292622BL7P2q0QpZZhyCge7zoA3I8xv13PnWX2KLayMgdOS6B0lQCYyRlzWnGWNOGnHUfqrTaabYaQyy2lDbaQlCUjYJA6AAVucFJmgNGBwXui9RREURf//Z';

            doc.addImage(logo, 'JPEG', 160, 10, 40, 7);

            doc.setFillColor(211,211,211);
            doc.rect(10, 20, 190, 9, 'F');

            doc.setTextColor(0, 0, 0);
            doc.text(11,25, 'PappayaSign Certificate');

            doc.text(10, 30, 
            ` \n
            EnvelopeID:`+Document.DocumentID+`
            Subject: Please Sign: `+Document.DocumentName+`
            Status: `+Document.Status+`
            Envelope Orginator: `+Document.OwnerEmail+`
            Time Zone:  (UTC+05:30) (Asia/Kolkata)
            `);

            doc.setFillColor(211,211,211);
            doc.rect(10, 60, 190, 9, 'F');

            doc.setTextColor(0, 0, 0);
            doc.text(11,65, 'Record Tracking');

            doc.text(10, 70, 
              ` \n
              Status:Original
              Date Created: `+Document.DateCreated+`
              Holder: `+Document.OwnerEmail+`
              Holder Email: `+Document.OwnerEmail+`
              `);

            doc.setFillColor(211,211,211);
            doc.rect(10, 95, 190, 9, 'F');

            doc.setTextColor(0, 0, 0);
            doc.text(11,100, 'Envelope Events');

            doc.text(10, 105, 
              ` 
              `+signerslist+`
              `);
            

            doc.addPage()
            doc.setPage(2)
            doc.text(10, 10, `  \n
            ELECTRONIC RECORD AND SIGNATURE DISCLOSURE\n
            From time to time, envelope holder (we, us or Company) may be required by law to provide to you certain written notices
            or disclosures. Described below are the terms and conditions for providing to you such notices and disclosures
            electronically through the PappayaSign system. Please read the information below carefully and thoroughly, and if you
            can access this information electronically to your satisfaction and agree to this Electronic Record and Signature
            Disclosure (ERSD), please confirm your agreement by selecting the check-box next to ‘I agree to use electronic
            records and signatures’ before clicking ‘CONTINUE’ within the PappayaSign system.\n
            Getting paper copies\n
            At any time, you may request from us a paper copy of any record provided or made available electronically to you
            by us. You will have the ability to download and print documents we send to you through the PappayaSign system
            during and immediately after the signing session and, if you elect to create a PappayaSign account, you may access the
            documents for a limited period of time (usually 30 days) after such documents are first sent to you. After such time,
            if you wish for us to send you paper copies of any such documents from our office to you, you will be charged a
            $0.00 per-page fee. You may request delivery of such paper copies from us by following the procedure described
            below.\n
            Withdrawing your consent\n
            If you decide to receive notices and disclosures from us electronically, you may at any time change your mind and
            tell us that thereafter you want to receive required notices and disclosures only in paper format. How you must
            inform us of your decision to receive future notices and disclosure in paper format and withdraw your consent to
            receive notices and disclosures electronically is described below.\n
            Consequences of changing your mind\n
            If you elect to receive required notices and disclosures only in paper format, it will slow the speed at which we can
            complete certain steps in transactions with you and delivering services to you because we will need first to send
            the required notices or disclosures to you in paper format, and then wait until we receive back from you your
            acknowledgment of your receipt of such paper notices or disclosures. Further, you will no longer be able to use the
            PappayaSign system to receive required notices and consents electronically from us or to sign electronically
            documents from us.\n
            All notices and disclosures will be sent to you electronically\n
            Electronic Record and Signature Disclosure created on: `+Document.DateCreated+` Parties agreed to:\n
            `+Document.OwnerEmail+`\n 
            Unless you tell us otherwise in accordance with the procedures described herein, we will provide electronically to 
            you through the PappayaSign system all required notices, disclosures, authorizations, acknowledgements, and other 
            documents that are required to be provided or made available to you during the course of our relationship with you.
            To reduce the chance of you inadvertently not receiving any notice or disclosure, we prefer to provide all of the 
            required notices and disclosures to you by the same method and to the same address that you have given us. Thus, you 
            can receive all the disclosures and notices electronically or in paper format through the paper mail delivery system.
            If you do not agree with this process, please let us know as described below. Please also see the paragraph 
            immediately above that describes the consequences of your electing not to receive delivery of the notices and
            disclosures electronically from us.\n
            How to contact envelope holder:\n
            You may contact us to let us know of your changes as to how we may contact you electronically, to request paper
            copies of certain information from us, and to withdraw your prior consent to receive notices and disclosures
            electronically as follows: To contact us by email send messages to: `+Document.OwnerEmail+`
            To advise envelope holder of your new email address\n
            To let us know of a change in your email address where we should send notices and disclosures electronically to
            you, you must send an email message to us at `+Document.OwnerEmail+` and in the body of such request you
            must state: your previous email address, your new email address. We do not require any other information from
            you to change your email address. If you created a PappayaSign account, you may update it with your new email
            address through your account preferences.\n
            To request paper copies from envelope holder\n
            To request delivery from us of paper copies of the notices and disclosures previously provided by us to you
            electronically, you must send us an email to `+Document.OwnerEmail+` and in the body of such request you
            must state your email address, full name, mailing address, and telephone number. We will bill you for any fees at
            that time, if any.\n
            `)
            doc.addPage()
            doc.setPage(3)
            doc.text(10,10, `  \n
            To withdraw your consent with envelope holder\n
            To inform us that you no longer wish to receive future notices and disclosures in electronic format you may:\n
              i.  decline to sign a document from within your signing session, and on the subsequent page, select the check-box
                  indicating you wish to withdraw your consent, or you may;\n
              ii. send us an email to `+Document.OwnerEmail+` and in the body of such request you must state your email,
                  full name, mailing address, and telephone number. We do not need any other information from you to withdraw
                  consent. The consequences of your withdrawing consent for online documents will be that transactions may take a
                  longer time to process.\n
                  Required hardware and software The minimum system requirements for using the PappayaSign system may change
                  over time.\n
            Acknowledging your access and consent to receive and sign documents electronically\n
            To confirm to us that you can access this information electronically, which will be similar to other electronic notices
            and disclosures that we will provide to you, please confirm that you have read this ERSD, and (i) that you are able
            to print on paper or electronically save this ERSD for your future reference and access; or (ii) that you are able to
            email this ERSD to an email address where you will be able to print on paper or save it for your future reference
            and access. Further, if you consent to receiving notices and disclosures exclusively in electronic format as described
            herein, then select the check-box next to ‘I agree to use electronic records and signatures’ before clicking
            ‘CONTINUE’ within the PappayaSign system. \n
            By selecting the check-box next to ‘I agree to use electronic records and signatures’, you confirm that:\n
              • You can access and read this Electronic Record and Signature Disclosure; and\n
              • You can print on paper this Electronic Record and Signature Disclosure, or save or send this Electronic Record and
                Disclosure to a location where you can print it, for future reference and access; and\n
              • Until or unless you notify envelope holder as described above, you consent to receive exclusively through electronic
                means all notices, disclosures, authorizations, acknowledgements, and other documents that are required to be
                provided or made available to you by envelope holder during the course of your relationship with envelope holder.
            `)


            doc.save('certificate.pdf');
            modal[2].style.display = 'none'
            modal[5].style.display = 'block'

            
            //console.log(datarray);

            //console.log(CSV(datarray, fileid));
            
          }
        })
        .catch(function (error) {
          console.log(error)
        })

            
            
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[2].style.display = 'none'
          modal[5].style.display = 'block'
        })

      
    })


    $('#historyprintbtn').click(function () {
      modal[2].style.display = 'block'
      modal[5].style.display = 'none'

      axios
        .post('/getdocdata', {
          DocumentID: historyfileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document

            axios
        .post('/gethistory', {
          DocumentID: historyfileid,
        })
        .then(function (response) {

          console.log(response)
          if (response.data.Status === 'history found') {
            var signers = response.data.history
            var signerslist = '';

            signers.forEach(function (item, index) {
              var HistoryUser = item.HistoryUser.replace(/\n/g, " ");
              signerslist += `
              User: `+HistoryUser+`\tTime: `+item.HistoryTime+`\tStatus: `+item.HistoryStatus+`
              Action: `+item.HistoryAction+`\n
              `});

            var doc = new jsPDF();
            doc.setFontSize(9);

            var logo = 'data:image/jpeg;base64,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H92c5fwA6Y7upV78HWK5niODXaBlthk2tD9x9oiIko5HFgtpSslJ6gbpG2/f1qT6UpqilpntnaW5ORnjwUG1/W0dfXRyUkgeQ3BxvHHdv81pOLTQnK8/uVszLCLd9IS2I/sUyKlaUuKQFFSFp5iAduZQI7+6tbU9lnrntqKYZIGCPkVu6F1NS2uN9HWu2Wk7QPLPAg48ArK4cMSyrB9KLbjuYRUxZzDr60shwLLba1lSQojpv1PQGuxYKWejoWw1Aw4Z3dxKjerq+luV1fUUZy0gb+GSBhbnV7S2zat4e/jV0IZkJPbQZfLuqO+B0V6g9xHiD8K2LrbY7pTmF+48j0P+cVp2G9zWKrFTFvHBw6j/ADglV0d4ftWsM1rsky64w4iBaphcfnpcSY6muVQ5kq33O+/dtv5ioRarHX0lyY57Pdad55YVpX/VNpuFllZFL7zxubvznI4/5hNxqfcTatPMin9u6x2Vue3dbb7RTYKSCsJ3G+2++247qsSd2zE49yoG8S9hQTSZxhp34zjvx3JBbVpsvI7nFt+K5PaLsuW8hpLQdMeR1OxPZuhO5A67JKu6o22DbIDCCqMgtBq5Gx0sjX5OMZwfg7HpldFrRbI9mtMK0REhLEGO3HbA8EoSEj+QqTtaGgNHJfoCCFtPE2JnBoA+CzK+llRREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURQLN9ZMbwu+MYqm3XW932Q12ybdao3bOpb/aV1AArWlqWRO2MEnoFw7jf6e3zCm2XPkIzstGTjvWThGrWJZxAuMyM8/bHrMvkuUW5IEd2IevVYJ2A6Hrv4V9RVDJQSN2OOVkt18pbjG97SWln5g7cW+KzbrNx/PcLvUSyXiDco0uFIiqcjPpdSFKbI2JSTsetfTi2aMhpys80kFzo5GwvDgWkbiDxCqPhj0FThkFvO8siJN8mN7xGFjf2NlQ7/vqH4Dp4mtKgpOyHaP4/JRTR+mv2ewVtUP3juA/pH3PoEwddJTxFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURFERREURVtlukMu6Z0zqPiGXyMevXYJiyyIyZDUplJHuqSojY7ADceQrVkpi6TtWOwVHq6xPmrRcKSUxyYwdwII8Cofm/DZcsv1InZGjLEw8fvhjru8FtKg6+WgPcBHTYlIO5O43PQ1gloTJKXbXuniFybjpKSuuLqgS4ifjbaOJxy81I3OG3T0Xl64292622BL7P2q0QpZZhyCge7zoA3I8xv13PnWX2KLayMgdOS6B0lQCYyRlzWnGWNOGnHUfqrTaabYaQyy2lDbaQlCUjYJA6AAVucFJmgNGBwXui9RREURf//Z';

            doc.addImage(logo, 'JPEG', 160, 10, 40, 7);

            doc.setFillColor(211,211,211);
            doc.rect(10, 20, 190, 9, 'F');

            doc.setTextColor(0, 0, 0);
            doc.text(11,25, 'PappayaSign Certificate');

            doc.text(10, 30, 
            ` \n
            EnvelopeID:`+Document.DocumentID+`
            Subject: Please Sign: `+Document.DocumentName+`
            Status: `+Document.Status+`
            Envelope Orginator: `+Document.OwnerEmail+`
            Time Zone:  (UTC+05:30) (Asia/Kolkata)
            `);

            doc.setFillColor(211,211,211);
            doc.rect(10, 60, 190, 9, 'F');

            doc.setTextColor(0, 0, 0);
            doc.text(11,65, 'Record Tracking');

            doc.text(10, 70, 
              ` \n
              Status:Original
              Date Created: `+Document.DateCreated+`
              Holder: `+Document.OwnerEmail+`
              Holder Email: `+Document.OwnerEmail+`
              `);

            doc.setFillColor(211,211,211);
            doc.rect(10, 95, 190, 9, 'F');

            doc.setTextColor(0, 0, 0);
            doc.text(11,100, 'Envelope Events');

            doc.text(10, 105, 
              ` 
              `+signerslist+`
              `);
            

            doc.addPage()
            doc.setPage(2)
            doc.text(10, 10, `  \n
            ELECTRONIC RECORD AND SIGNATURE DISCLOSURE\n
            From time to time, envelope holder (we, us or Company) may be required by law to provide to you certain written notices
            or disclosures. Described below are the terms and conditions for providing to you such notices and disclosures
            electronically through the PappayaSign system. Please read the information below carefully and thoroughly, and if you
            can access this information electronically to your satisfaction and agree to this Electronic Record and Signature
            Disclosure (ERSD), please confirm your agreement by selecting the check-box next to ‘I agree to use electronic
            records and signatures’ before clicking ‘CONTINUE’ within the PappayaSign system.\n
            Getting paper copies\n
            At any time, you may request from us a paper copy of any record provided or made available electronically to you
            by us. You will have the ability to download and print documents we send to you through the PappayaSign system
            during and immediately after the signing session and, if you elect to create a PappayaSign account, you may access the
            documents for a limited period of time (usually 30 days) after such documents are first sent to you. After such time,
            if you wish for us to send you paper copies of any such documents from our office to you, you will be charged a
            $0.00 per-page fee. You may request delivery of such paper copies from us by following the procedure described
            below.\n
            Withdrawing your consent\n
            If you decide to receive notices and disclosures from us electronically, you may at any time change your mind and
            tell us that thereafter you want to receive required notices and disclosures only in paper format. How you must
            inform us of your decision to receive future notices and disclosure in paper format and withdraw your consent to
            receive notices and disclosures electronically is described below.\n
            Consequences of changing your mind\n
            If you elect to receive required notices and disclosures only in paper format, it will slow the speed at which we can
            complete certain steps in transactions with you and delivering services to you because we will need first to send
            the required notices or disclosures to you in paper format, and then wait until we receive back from you your
            acknowledgment of your receipt of such paper notices or disclosures. Further, you will no longer be able to use the
            PappayaSign system to receive required notices and consents electronically from us or to sign electronically
            documents from us.\n
            All notices and disclosures will be sent to you electronically\n
            Electronic Record and Signature Disclosure created on: `+Document.DateCreated+` Parties agreed to:\n
            `+Document.OwnerEmail+`\n 
            Unless you tell us otherwise in accordance with the procedures described herein, we will provide electronically to 
            you through the PappayaSign system all required notices, disclosures, authorizations, acknowledgements, and other 
            documents that are required to be provided or made available to you during the course of our relationship with you.
            To reduce the chance of you inadvertently not receiving any notice or disclosure, we prefer to provide all of the 
            required notices and disclosures to you by the same method and to the same address that you have given us. Thus, you 
            can receive all the disclosures and notices electronically or in paper format through the paper mail delivery system.
            If you do not agree with this process, please let us know as described below. Please also see the paragraph 
            immediately above that describes the consequences of your electing not to receive delivery of the notices and
            disclosures electronically from us.\n
            How to contact envelope holder:\n
            You may contact us to let us know of your changes as to how we may contact you electronically, to request paper
            copies of certain information from us, and to withdraw your prior consent to receive notices and disclosures
            electronically as follows: To contact us by email send messages to: `+Document.OwnerEmail+`
            To advise envelope holder of your new email address\n
            To let us know of a change in your email address where we should send notices and disclosures electronically to
            you, you must send an email message to us at `+Document.OwnerEmail+` and in the body of such request you
            must state: your previous email address, your new email address. We do not require any other information from
            you to change your email address. If you created a PappayaSign account, you may update it with your new email
            address through your account preferences.\n
            To request paper copies from envelope holder\n
            To request delivery from us of paper copies of the notices and disclosures previously provided by us to you
            electronically, you must send us an email to `+Document.OwnerEmail+` and in the body of such request you
            must state your email address, full name, mailing address, and telephone number. We will bill you for any fees at
            that time, if any.\n
            `)
            doc.addPage()
            doc.setPage(3)
            doc.text(10,10, `  \n
            To withdraw your consent with envelope holder\n
            To inform us that you no longer wish to receive future notices and disclosures in electronic format you may:\n
              i.  decline to sign a document from within your signing session, and on the subsequent page, select the check-box
                  indicating you wish to withdraw your consent, or you may;\n
              ii. send us an email to `+Document.OwnerEmail+` and in the body of such request you must state your email,
                  full name, mailing address, and telephone number. We do not need any other information from you to withdraw
                  consent. The consequences of your withdrawing consent for online documents will be that transactions may take a
                  longer time to process.\n
                  Required hardware and software The minimum system requirements for using the PappayaSign system may change
                  over time.\n
            Acknowledging your access and consent to receive and sign documents electronically\n
            To confirm to us that you can access this information electronically, which will be similar to other electronic notices
            and disclosures that we will provide to you, please confirm that you have read this ERSD, and (i) that you are able
            to print on paper or electronically save this ERSD for your future reference and access; or (ii) that you are able to
            email this ERSD to an email address where you will be able to print on paper or save it for your future reference
            and access. Further, if you consent to receiving notices and disclosures exclusively in electronic format as described
            herein, then select the check-box next to ‘I agree to use electronic records and signatures’ before clicking
            ‘CONTINUE’ within the PappayaSign system. \n
            By selecting the check-box next to ‘I agree to use electronic records and signatures’, you confirm that:\n
              • You can access and read this Electronic Record and Signature Disclosure; and\n
              • You can print on paper this Electronic Record and Signature Disclosure, or save or send this Electronic Record and
                Disclosure to a location where you can print it, for future reference and access; and\n
              • Until or unless you notify envelope holder as described above, you consent to receive exclusively through electronic
                means all notices, disclosures, authorizations, acknowledgements, and other documents that are required to be
                provided or made available to you by envelope holder during the course of your relationship with envelope holder.
            `)


            doc.autoPrint();
            doc.output('dataurlnewwindow');
            modal[2].style.display = 'none'
            modal[5].style.display = 'block'

            
            //console.log(datarray);

            //console.log(CSV(datarray, fileid));
            
          }
        })
        .catch(function (error) {
          console.log(error)
        })

            
            
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[2].style.display = 'none'
          modal[5].style.display = 'block'
        })

      
    })

  }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <div className="mt--8 mx-4">
          <div className="modal">
            <div className="modal-content">
              <div>
                <p>Please wait while we fetch your details.</p>
                <div className="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <p>Sending.</p>
                <div className="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <p>Please wait.</p>
                <div className="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <div className="mb-4 mb-xl-0">
                  <h5>
                    By voiding this envelope, recipients can no longer view it
                    or sign enclosed documents. Recipients will receive an email
                    notification, which includes your reason for voiding the
                    envelope.{' '}
                  </h5>
                </div>
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <span className="emaillabelspan">
                        <strong>*Reason for voiding document.</strong>
                      </span>
                      <Input
                        className="form-control-alternative"
                        id="managevoidmessage"
                        placeholder="Email message"
                        type="textarea"
                        rows="3"
                      />
                    </FormGroup>
                  </Col>

                  <Col lg="6">
                    <Button
                      id="managevoidapprovebtn"
                      className="close-btn float-right px-4"
                    >
                      {' '}
                      Void
                    </Button>
                  </Col>
                  <Col lg="6">
                    <Button
                      id="managevoidcancelbtn"
                      className="cancel-btn float-left px-4"
                    >
                      {' '}
                      Cancel
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
                  <h5>
                    Are you sure you want to delete this document? Deleting your
                    in progress envelopes will void them and notify current
                    recipients of the changes. You can find all your deleted
                    envelopes in your Deleted bin for a short time before
                    they're removed permanently.{' '}
                  </h5>
                </div>
                <Row>
                  <Col lg="6">
                    <Button
                      id="managedeleteapprovebtn"
                      className="close-btn float-right px-4"
                    >
                      {' '}
                      Delete
                    </Button>
                  </Col>
                  <Col lg="6">
                    <Button
                      id="managedeletecancelbtn"
                      className="cancel-btn float-left px-4"
                    >
                      {' '}
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content-history">
              <div>
              <Row>
              <Col lg="12">
                  <h4 className="py-4 px-3" color="dark">
                    Envelope History:
                  </h4>
                  <hr className="my-1" />
                </Col>
                <Col lg='12' className="history-fixed">
                    <Col lg="12">
                      <h5 className="py-3 px-3" color="dark">
                        Details:
                      </h5>
                    </Col>
                    <Col lg="6" className="float-left justify-content-left">
                      <Col lg="12" className="float-left justify-content-left">
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Subject:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="historysubject"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Envelope ID:</strong>
                          </span>
                          <span className="emaillabelspan" id="historyid"></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Date Sent:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="historysent"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Date Created:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="historycreate"
                          ></span>
                        </FormGroup>
                      </Col>
                    </Col>
                    <Col lg="6" className="float-left justify-content-left">
                      <Col lg="12" className="float-left justify-content-left">
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Holder:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="historyholder"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Envelope Recipients:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="historyrecepients"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Status:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="historystatus"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Status Date:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="historystatusdate"
                          ></span>
                        </FormGroup>
                      </Col>
                    </Col>
                    <Col lg="12">
                      <h5 className="py-3 px-3" color="dark">
                        Actions:
                      </h5>
                    </Col>
                    
                  <Col lg="12">
                  <Table
                    className="align-items-center table-flush"
                    id="historytable"
                  >
                    <thead className="thead-primary">
                      <tr>
                        <th scope="col">Time</th>
                        <th scope="col">User</th>
                        <th scope="col">Action</th>
                        <th scope="col">Activity</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </Table>
                  </Col>
                  </Col>
                  <Col lg="12" className="my-2">
                  <hr className="my-1" />
                      <Button
                        color="dark"
                        size="sm"
                        type="button"
                        className="float-left mx-4 my-2 px-4"
                        id="historycertificatebtn"
                      >
                        Download Certificate
                      </Button>
                      <Button
                        color="dark"
                        size="sm"
                        type="button"
                        className="float-left my-2 px-4"
                        id="historyprintbtn"
                      >
                        Print
                      </Button>
                    </Col>
                  
                </Row>
              </div>
            </div>
          </div>


          

          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Manage</h3>
                </CardHeader>

                <CardBody className="bg-secondary" id="managebody">
                  <Row>
                    <Col lg="3">
                      <div
                        id="managebtncontainer"
                        className="managebtncontainer"
                      >
                        <Button
                          className="my-3 fullwidth p-2"
                          color="primary"
                          size="mg"
                          type="button"
                          id="startnowbtn"
                        >
                          Start Now
                        </Button>

                        <div className="divider" id="customfieldscolumn">
                          <div className="col my-3 p-2">
                            <h6 className="text-uppercase text-gray ls-1 mb-3 pl-3 float-left">
                              Envelope
                            </h6>
                          </div>
                          <hr className="my-1" />
                        </div>

                        <Button
                          aria-selected={this.state.tabs === 1}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 1,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 1)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="inboxbtn"
                          outline
                        >
                          <i className="material-icons">inbox</i>
                          Inbox
                        </Button>

                        <Button
                          aria-selected={this.state.tabs === 2}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 2,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 2)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="sentbtn"
                          outline
                        >
                          <i className="material-icons">send</i>
                          Sent
                        </Button>

                        <Button
                          aria-selected={this.state.tabs === 3}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 3,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 3)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="draftsbtn"
                          outline
                        >
                          <i className="material-icons">drafts</i>
                          Drafts
                        </Button>

                        <Button
                          aria-selected={this.state.tabs === 4}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 4,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 4)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="deletedbtn"
                          outline
                        >
                          <i className="material-icons">delete</i>
                          Deleted
                        </Button>

                        <div className="divider" id="customfieldscolumn">
                          <div className="col my-3 p-2">
                            <h6 className="text-uppercase text-gray ls-1 mb-3 pl-3 float-left">
                              Quick Views
                            </h6>
                          </div>
                          <hr className="my-1" />
                        </div>

                        <Button
                          aria-selected={this.state.tabs === 5}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 5,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 5)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="waitingbtn"
                          outline
                        >
                          <i className="material-icons">query_builder</i>
                          Waiting for Others
                        </Button>

                        <Button
                          aria-selected={this.state.tabs === 6}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 6,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 6)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="actionrequiredbtn"
                          outline
                        >
                          <i className="material-icons">error</i>
                          Action Required
                        </Button>
                        <Button
                          aria-selected={this.state.tabs === 7}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 7,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 7)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="completedbtn"
                          outline
                        >
                          <i className="material-icons">done</i>
                          Completed
                        </Button>
                        <Button
                          aria-selected={this.state.tabs === 8}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 8,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 8)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="expiringbtn"
                          outline
                        >
                          <i className="material-icons">error</i>
                          Expiring Soon
                        </Button>
                        <Button
                          aria-selected={this.state.tabs === 9}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 9,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 9)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="authbtn"
                          outline
                        >
                          <i className="material-icons">warning</i>
                          Authentication Failed
                        </Button>
                      </div>
                    </Col>
                    <Col lg="9">
                      <TabContent
                        activeTab={'tabs' + this.state.tabs}
                        id="tabcontent"
                        className="managetabcontent"
                      >
                        <TabPane tabId="tabs1" className="managetabpane">
                          <Table
                            className=" align-items-center table-flush"
                            id="alltable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs2" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="senttable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>

                        <TabPane tabId="tabs3" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="draftstable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>

                        <TabPane tabId="tabs4" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="deletedtable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs5" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="waitingtable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs6" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="actionrequiredtable"
                            responsive
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs7" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="completedtable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs8" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="expiringtable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs9" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="authtable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                      </TabContent>
                    </Col>
                  </Row>
                </CardBody>
                <CardBody id="detailbody">
                  <Row>
                    <Col lg="12">
                      <Button
                        color="primary"
                        size="sm"
                        type="button"
                        className="px-4"
                        id="detailbackbtn"
                      >
                        Back
                      </Button>
                      <Button
                        color="dark"
                        size="sm"
                        type="button"
                        className="float-right px-4"
                        id="detaildownloadbtn"
                      >
                        Download
                      </Button>
                      <Button
                        color="dark"
                        size="sm"
                        type="button"
                        className="float-right px-4"
                        id="detailprintbtn"
                      >
                        Print
                      </Button>

                      <Button
                        color="primary"
                        size="sm"
                        type="button"
                        className="float-right"
                        id="manageaddobjbtn"
                      >
                        AddObj
                      </Button>
                    </Col>
                    
                    <Col lg="12">
                    <Row>
                      <Col lg="9">
                      <Col lg="12">
                      <h4 className="py-4 px-3" color="dark">
                        Details:
                      </h4>
                    </Col>
                    <Col lg="6">
                      <Col lg="12">
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Subject:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailsubject"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Envelope ID:</strong>
                          </span>
                          <span className="emaillabelspan" id="detailid"></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Date Sent:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailsent"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Date Created:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailcreate"
                          ></span>
                        </FormGroup>
                      </Col>
                    </Col>
                    <Col lg="6">
                      <Col lg="12">
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Holder:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailholder"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Envelope Recipients:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailrecepients"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Status:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailstatus"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Status Date:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailstatusdate"
                          ></span>
                        </FormGroup>
                      </Col>
                    </Col>
                    
                      </Col>
                      <Col lg="3">
                        <div id="manage-container">
                        <div id="manage-pdf-container"></div>
                        <div id="manage-toolbar"></div>
                        </div>
                      
                      </Col>
                      </Row>
                    </Col>
                    <Col lg="12">
                      <h4 className="py-4 px-3" color="dark">
                        Recepients:
                      </h4>
                      <div className="managerecepientstable">
                        <ul id="managerecepientstable"></ul>
                      </div>
                    </Col>
                   
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Row>
        </div>
      </>
    )
  }
}

export default Tables
