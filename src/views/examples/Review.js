import React from 'react'
import classnames from 'classnames'
import $ from 'jquery'
import { fabric } from 'fabric'
import * as jsPDF from 'jspdf'

import DataVar from '../../variables/data'
import PreviewData from '../../variables/preview'

// reactstrap components
import {
  Card,
  Container,
  Row,
  CardHeader,
  CardBody,
  CardFooter,
  Col,
  Button,
  FormGroup,
  Input,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Nav,
} from 'reactstrap'

import UncontrolledLottie from '../../components/UncontrolledLottie/UncontrolledLottie'

import routes from 'routes.js'
// core components
import HeaderDefault from 'components/Headers/HeaderDefault.js'
// mapTypeId={google.maps.MapTypeId.ROADMAP}

var PDFJS = require('pdfjs-dist')
var moment = require('moment');
const axios = require('axios').default

class Review extends React.Component {
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
      this.recipientemail = ''
      this.recipientcolor = ''
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
              canvas.className = 'review-pdf-canvas'
              canvas.height = viewport.height
              canvas.width = viewport.width
              var context = canvas.getContext('2d')

              var renderContext = {
                canvasContext: context,
                viewport: viewport,
              }
              var renderTask = page.render(renderContext)
              renderTask.then(function () {
                $('.review-pdf-canvas').each(function (index, el) {
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

                fabricObj.loadFromJSON(PreviewData.Data[index], function () {
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

    var ip ='';
    axios
    .post('/getip', {
    })
    .then(function (response) {
      console.log(response)
      var remoteAddress = response.data;
      const array = remoteAddress.split(':')
      ip = array[array.length - 1]
      //console.log(ip);
    })
    .catch(function (error) {
      console.log(error)
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

    console.log(process.env.REACT_APP_BASE_URL);

    var filenamemain = ''
    var docname = ''
    var action = ''
    var pdfset = 'not set'

    var modal = document.querySelectorAll('.modal')
    modal[0].style.display = 'block'
    var userid = ''
    var email = ''
    var droptoggle = 0

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

    userid = getCookie('uid')

    if (userid) {
      //console.log('user logged in');
      //console.log(userid);
      email = getCookie('useremail')
      try {
        var mainurl = document.location.hash,
          params = mainurl.split('?')[1].split('&'),
          data = {},
          tmp
        for (var i = 0, l = params.length; i < l; i++) {
          tmp = params[i].split('=')
          data[tmp[0]] = tmp[1]
        }
        filenamemain = data.id
        try {
          action = data.action
        } catch (error) {}

        docname = DataVar.DocName

        //console.log(userid);
        //console.log(filename);

        

        var people = []
        people = DataVar.RecipientArray
        people.forEach(function (item, index) {
          var li = document.createElement('li')
          li.innerHTML =
            `<div>
        <div>
        <strong><span class="summarylabelspan" id="summary-recipient-name">` +
            people[index].name +
            `</span></strong>
        </div>
        <div>
        <span class="summarylabelspan" id="summary-recipient-name">` +
            people[index].email +
            `</span>
        </div>
        <div>
        <span class="summarylabelspan" id="summary-recipient-name">` +
            people[index].option +
            `</span>
        </div>
        </div>`
          $('#reviewrecipientstable').append(li)

          if (people[index].option == 'Needs to Sign') {
            var option = document.createElement('option')
            option.value = people[index].email
            option.innerHTML = '' + people[index].name + ''
            $('#privaterecipientselect').append(option)
          }
        })
        modal[0].style.display = 'none'
      } catch (error) {
        modal[0].style.display = 'none'
      }
    } else {
      window.location.hash = '#/auth/login'
      modal[0].style.display = 'none'
    }

    $('#reviewprivatebtn').click(async function () {
      modal[4].style.display = 'block';
    });


      $('#reviewpreviewbtn').click(async function () {
      modal[2].style.display = 'block'
      try {
        if(pdfset === 'not set'){
          pdfset = 'set';
                      global.pdf = await new PDFFabric(
                        'review-pdf-container',
                        'review-toolbar',
                        PreviewData.DataPath,
                        'Default',
                        {
                          onPageUpdated: (page, oldData, newData) => {
                            
                            //modal[0].style.display = "block";
                            ////console.log(page, oldData, newData);
                          },
                        }
                      )
                      modal[2].style.display = 'none'
                      modal[3].style.display = 'block'
        }
        else{
          modal[2].style.display = 'none'
          modal[3].style.display = 'block'
        }
      } catch (error) {
        
      }
                  
    })

    $('#reviewautoremindercheck').change(function () {
      if (this.checked) {
        document.getElementById('autoreminderselect').style.display = 'block'
      } else {
        document.getElementById('autoreminderselect').style.display = 'none'
      }
    })

    
    

    var dateCurrent = moment().format('YYYY-MM-DD');
    var dateFrom = moment().subtract(12,'d').format('YYYY-MM-DD');
    var dateTo = moment().add(120,'d').format('YYYY-MM-DD');

    var day, month, year, trigger = '';

    day = moment().add(120,'d').format('DD');
    month = moment().add(120,'d').format('MM');
    year = moment().add(120,'d').format('YYYY'); 
    trigger = 'not today';

    console.log(dateCurrent+''+dateFrom);

    $(document).ready(function () {
      $('#input-expiry-date').val(dateTo)
      $('#input-expiry-date').attr('min', dateCurrent);
    })

    var inputDate = document.querySelector('input#input-expiry-date');

    inputDate.addEventListener('input', function() {  
        var current = this.value; 
        var thirddayfromnow = moment().add(3,'d').format('YYYY-MM-DD');        
        var today = moment().format('YYYY-MM-DD');        
        if (current < thirddayfromnow){
            document.getElementById('input-expiry-date').value = today; 
            var nextdate = moment(today).format('YYYY-MM-DD');
            day = moment(today).format('DD');
            month = moment(today).format('MM');
            year = moment(today).format('YYYY');
            trigger='today';   
        }
        else if(current > thirddayfromnow){
          var nextdate = moment(current).subtract(3,'d').format('YYYY-MM-DD'); 
          day = moment(current).subtract(3,'d').format('DD');
          month = moment(current).subtract(3,'d').format('MM');
          year = moment(current).subtract(3,'d').format('YYYY');
          trigger = 'not today';
        } 
        else if(current == thirddayfromnow){
          var nextdate = moment().format('YYYY-MM-DD'); 
          day = moment(today).format('DD');
          month = moment(today).format('MM');
          year = moment(today).format('YYYY');
          trigger='today'; 
        }    
    });

    $(document).on('click', '.preview-close', function () {
      modal[3].style.display = 'none';
    });

    $(document).on('click', '.private-close', function () {
      modal[4].style.display = 'none';
    });

    $("#privatecancelbtn").on('click', function () {
      modal[4].style.display = 'none';
    });

    

    var selecteditem = '';
    $("#privaterecipientselect").on('focus', function () {
      selecteditem = this.value;
      var privatemessage =  document.getElementById('input-private-message').value;
      changePrivate ( selecteditem, privatemessage );
      console.log(people);
      
  })

    $('#privaterecipientselect').on('change', function() {
      console.log( this.value );
        getPrivate ( this.value );
        console.log(people);
    });

    function changePrivate( value, privatemessage ) {
      for (var i in people) {
        if (people[i].email == value) {
          people[i].privatemessage = privatemessage;
           break; //Stop this loop, we found it!
        }
      }
   }

   function getPrivate( value ) {
     try {
      for (var i in people) {
        if (people[i].email == value) {
          if(people[i].privatemessage){
           document.getElementById('input-private-message').value = people[i].privatemessage
          }
          else{
            document.getElementById('input-private-message').value = ''
          }
           break; //Stop this loop, we found it!
        }
      }
     } catch (error) {
       
     }
    
 }

 var privatemessagekey = false;
 $("#privatesavebtn").on('click', function () {
  privatemessagekey = true;
  var select = document.getElementById('privaterecipientselect')
  var recipientemail = select.options[select.selectedIndex].value
  var privatemessage =  document.getElementById('input-private-message').value;
  changePrivate ( recipientemail, privatemessage );
  $("#reviewrecipientstable").html("");
  people.forEach(function (item, index) {

    if (item.privatemessage){
      if(item.privatemessage != ''){
        var li = document.createElement('li')
        li.innerHTML =
          `<div>
      <div>
      <strong><span class="summarylabelspan" id="summary-recipient-name">` +
          people[index].name +
          `</span></strong>
      </div>
      <div>
      <span class="summarylabelspan" id="summary-recipient-name">` +
          people[index].email +
          `</span>
      </div>
      <div>
      <span class="summarylabelspan" id="summary-recipient-name">` +
          people[index].option +
          `</span>
      </div>
      <div>
      <span class="summarylabelspan" id="summary-recipient-name">Private Message</span>
      </div>
      </div>`
        $('#reviewrecipientstable').append(li)
      }
      else{
        var li = document.createElement('li')
        li.innerHTML =
          `<div>
      <div>
      <strong><span class="summarylabelspan" id="summary-recipient-name">` +
          people[index].name +
          `</span></strong>
      </div>
      <div>
      <span class="summarylabelspan" id="summary-recipient-name">` +
          people[index].email +
          `</span>
      </div>
      <div>
      <span class="summarylabelspan" id="summary-recipient-name">` +
          people[index].option +
          `</span>
      </div>
      
      </div>`
        $('#reviewrecipientstable').append(li)
      }
 
    }
    else{
      var li = document.createElement('li')
    li.innerHTML =
      `<div>
  <div>
  <strong><span class="summarylabelspan" id="summary-recipient-name">` +
      people[index].name +
      `</span></strong>
  </div>
  <div>
  <span class="summarylabelspan" id="summary-recipient-name">` +
      people[index].email +
      `</span>
  </div>
  <div>
  <span class="summarylabelspan" id="summary-recipient-name">` +
      people[index].option +
      `</span>
  </div>
  
  </div>`
    $('#reviewrecipientstable').append(li)
    }

  })
  modal[4].style.display = 'none';
});


    $('#reviewnextbtn').click(function () {
      modal[1].style.display = 'block'

      

      var today = new Date().toLocaleString().replace(',', '')

          

      var subject = document.getElementById('input-email-subject').value
      var emailmessage = document.getElementById('input-email-message').value

      var people = []
      var Reciever = []
      var Requests = []
      people = DataVar.RecipientArray
      if (DataVar.SignOrder === true) {

        var firstRecipientPrivateMessage = ''
        if(privatemessagekey){
          firstRecipientPrivateMessage = people[0].privatemessage
        }
        var firstRecipientEmail = people[0].email
        var url =
          process.env.REACT_APP_BASE_URL +
          '/#/admin/sign?id=' +
          filenamemain +
          '&type=db&u=' +
          userid +
          '&key=0'
        var firstRecipientName = people[0].name

        if (action === 'correct') {
          //console.log('correct');
        } else {

          axios
            .post('/posthistory', {
              DocumentID: filenamemain,
              HistoryTime: today,
              HistoryUser: people[0].email + '\n['+ip+']',
              HistoryAction: 'Sent Invitations',
              HistoryActivity: 'Envelope host sent an invitation to '+people[0].name+' ['+people[0].email+']',
              HistoryStatus: 'Sent'
            })
            .then(function (response) {
              console.log(response)
              
            })
            .catch(function (error) {
              console.log(error)
            })

          axios
            .post('/getrequestuser', {
              UserEmail: people[0].email,
            })
            .then(function (response) {
              console.log(response)
              if (response.data.Status === 'user found') {
                axios
                  .post('/postrequest', {
                    UserID: response.data.UserID,
                    DocumentName: docname,
                    DocumentID: filenamemain,
                    From: userid,
                    FromEmail: email,
                    RecipientStatus: 'Need to Sign',
                    RecipientDateStatus: today,
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
        }

        axios
          .post('/sendmail', {
            to: firstRecipientEmail,
            body:
              `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, ` +
              firstRecipientName +
              `</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. <p>Personal Message: ` +
              emailmessage + '\n' + firstRecipientPrivateMessage +
              `</p></p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="` +
              url +
              `" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`,
            subject: 'PappayaSign: ' + subject + '',
          })
          .then(function (response) {
            console.log(response)
          })
          .catch(function (error) {
            //console.log('message could not be sent');
          })

        people.forEach(function (item, index) {
          var recipientName = people[index].name
          var recipientEmail = people[index].email
          var firstRecipientEmail = people[0].email
          var recipientOption = people[index].option
          var recipientColor = colorArray[index]
          if (
            recipientOption == 'Needs to Sign' ||
            recipientOption == 'Needs to View'
          ) {
            //console.log(recipientEmail + ',' + recipientName);
            var user = {
              RecipientName: recipientName,
              DocumentName: docname,
              RecipientEmail: recipientEmail,
              RecipientColor: recipientColor,
              RecipientOption: recipientOption,
              RecipientStatus: 'Sent',
              RecipientDateStatus: today,
            }
            Reciever.push(user)

            axios
            .post('/posthistory', {
              DocumentID: filenamemain,
              HistoryTime: today,
              HistoryUser: email + '\n['+ip+']',
              HistoryAction: 'Sent Invitations',
              HistoryActivity: 'Envelope host sent an invitation to '+recipientName+' ['+recipientEmail+']',
              HistoryStatus: 'Sent'
            })
            .then(function (response) {
              console.log(response)
              
            })
            .catch(function (error) {
              console.log(error)
            })
            //console.log(Reciever);
          }
        })

        axios
          .post('/addreciever', {
            Status: 'Waiting for Others',
            DocumentID: filenamemain,
            SignOrder: true,
            DateSent: today,
            Reciever: Reciever,
          })
          .then(function (response) {
            console.log(response)
            if (response.data === 'reciever done') {
              modal[1].style.display = 'none'
              axios
              .post('/expiry', {
                UserID:userid,
                DocumentID:filenamemain,
                day:day,
                month:month,
                year:year,
                trigger:trigger
              })
              .then(function (response) {
                console.log(response)
              })
              .catch(function (error) {
                console.log(error)
              })

              if (document.getElementById('reviewautoremindercheck').checked) {
                var select = document.getElementById('autoreminderselect')
                    var date = select.options[select.selectedIndex].value
                console.log(date);
                  axios
                .post('/reminder', {
                  DocumentID:filenamemain,
                  date:date
                })
                .then(function (response) {
                  console.log(response)
                })
                .catch(function (error) {
                  console.log(error)
                })
              }
              window.location.hash = '#/admin/sendsuccess'
            }
          })
          .catch(function (error) {
            console.log(error)
            modal[1].style.display = 'none'
            alert(error)
          })
      } else {
        people.forEach(function (item, index) {

          var RecipientPrivateMessage = ''
        if(privatemessagekey){
          RecipientPrivateMessage = people[index].privatemessage
        }
          var recipientName = people[index].name
          var recipientEmail = people[index].email
          var recipientOption = people[index].option
          var key = ''
          var recipientColor = colorArray[index]
          if (
            recipientOption == 'Needs to Sign' ||
            recipientOption == 'Needs to View'
          ) {
            //console.log(recipientEmail + ',' + recipientName);
            var url =
              process.env.REACT_APP_BASE_URL +
              '/#/admin/sign?id=' +
              filenamemain +
              '&type=db&u=' +
              userid +
              '&key=' +
              index +
              ''

            if (action === 'correct') {
              //console.log('correct');
            } else {
              axios
                .post('/getrequestuser', {
                  UserEmail: recipientEmail,
                })
                .then(function (response) {
                  console.log(response)
                  if (response.data.Status === 'user found') {
                    axios
                      .post('/postrequest', {
                        UserID: response.data.UserID,
                        DocumentName: docname,
                        DocumentID: filenamemain,
                        From: userid,
                        FromEmail: email,
                        RecipientStatus: 'Need to Sign',
                        RecipientDateStatus: today,
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
            }

            axios
              .post('/sendmail', {
                to: recipientEmail,
                body:
                  `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, ` +
                  recipientName +
                  `</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. <p>Personal Message: ` +
                  emailmessage + '\n' + RecipientPrivateMessage +
                  `</p></p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="` +
                  url +
                  `" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`,
                subject: 'PappayaSign: ' + subject + '',
              })
              .then(function (response) {
                console.log(response)
              })
              .catch(function (error) {
                //console.log('message could not be sent');
              })

            var user = {
              RecipientName: recipientName,
              DocumentName: docname,
              RecipientEmail: recipientEmail,
              RecipientColor: recipientColor,
              RecipientOption: recipientOption,
              RecipientStatus: 'Sent',
              RecipientDateStatus: today,
            }
            Reciever.push(user)

            axios
            .post('/posthistory', {
              DocumentID: filenamemain,
              HistoryTime: today,
              HistoryUser: email + '\n['+ip+']',
              HistoryAction: 'Sent Invitations',
              HistoryActivity: 'Envelope host sent an invitation to '+recipientName+' ['+recipientEmail+']',
              HistoryStatus: 'Sent'
            })
            .then(function (response) {
              console.log(response)
              
            })
            .catch(function (error) {
              console.log(error)
            })
            //console.log(Reciever);
          }
        })

        axios
          .post('/addreciever', {
            Status: 'Waiting for Others',
            DocumentID: filenamemain,
            SignOrder: false,
            DateSent: today,
            Reciever: Reciever,
          })
          .then(function (response) {
            console.log(response)
            if (response.data === 'reciever done') {
              modal[1].style.display = 'none'
              axios
                .post('/expiry', {
                  UserID:userid,
                  DocumentID:filenamemain,
                  day:day,
                  month:month,
                  year:year,
                  trigger: trigger
                })
                .then(function (response) {
                  console.log(response)
                })
                .catch(function (error) {
                  console.log(error)
                })

                if (document.getElementById('reviewautoremindercheck').checked) {
                  var select = document.getElementById('autoreminderselect')
                      var date = select.options[select.selectedIndex].value
                  console.log(date);
                  var url =
                  process.env.REACT_APP_BASE_URL +
                  '/#/admin/sign?id=' +
                  filenamemain +
                  '&type=db&u=' +
                  userid +
                  '&key='
                    axios
                  .post('/reminder', {
                    DocumentID:filenamemain,
                    date:date,
                    url:url
                  })
                  .then(function (response) {
                    console.log(response)
                  })
                  .catch(function (error) {
                    console.log(error)
                  })
                }
              window.location.hash = '#/admin/sendsuccess'
            }
          })
          .catch(function (error) {
            console.log(error)
            modal[1].style.display = 'none'
            alert(error)
          })
      }
    })

    


   
  }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <div className="mt--9 pb-8">
          <Card className="shadow border-0 pb-2 mb-3 bg-dark mx-5">
            <CardBody>
              <Row>
                <Col lg="12" className="form-check form-check-inline">
                  <div className="stepwizard">
                    <div className="stepwizard-row">
                      <div className="stepwizard-step">
                        <button
                          type="button"
                          className="btn btn-primary btn-circle-process"
                        >
                          1
                        </button>
                        <p className="steplabel">Add</p>
                      </div>
                      <div className="stepwizard-step">
                        <button
                          type="button"
                          className="btn btn-primary btn-circle-process"
                        >
                          2
                        </button>
                        <p className="steplabel">Select</p>
                      </div>
                      <div className="stepwizard-step">
                        <button
                          type="button"
                          className="btn btn-primary btn-circle-process"
                        >
                          3
                        </button>
                        <p className="steplabel">Process</p>
                      </div>
                      <div className="stepwizard-step">
                        <button
                          type="button"
                          className="btn btn-primary btn-circle-process"
                        >
                          4
                        </button>
                        <p className="steplabel">Review</p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
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
            <div className="review-modal-content">
            <Card className="shadow border-0 mx-3">
                <CardHeader className=" bg-transparent">
                <div className="review-manager-title">
                        <span>Preview</span>
                        <i className="ni ni-fat-remove preview-close" />
                    </div>
                </CardHeader>
                <CardBody>

                
            <Row>
                    <Col lg="12">
                    <div id="review-container">
                    <div id="review-pdf-container"></div>
                    <div id="review-toolbar"></div>
                    </div>
                    </Col>
            </Row>  
            </CardBody>
            <CardFooter className=" bg-transparent">
            
            </CardFooter> 
            </Card>     
            </div>
          </div>

          <div className="modal">
            <div className="private-modal-content">
              <div>
              <Card className="shadow border-0 mx-3 p-3">
              <CardHeader className=" bg-transparent">
                <div className="review-manager-title">
                        <span>Private Message</span>
                        <i className="ni ni-fat-remove private-close" />
                    </div>
                </CardHeader>
                <Row>
                  <Col lg='12'>
                  <FormGroup className="my-4">
                    <span className="emaillabelspan py-2">
                      <strong>Select Recipient:</strong>
                    </span>
                    <select
                      id="privaterecipientselect"
                      className="form-control selectpicker form-control-sm"
                    ></select>
                  </FormGroup>
                  <FormGroup className="">
                    <span className="emaillabelspan  py-2">
                      <strong>Message:</strong>
                    </span>
                    <Input
                      id="input-private-message"
                      placeholder="Enter message here ..."
                      rows="3"
                      type="textarea"
                    />
                    <span className="emaillabelspan">
                      Max Characters: 10000
                    </span>
                  </FormGroup>
                  <Button
                    className="mx-2 float-right px-4"
                    color="neutral"
                    id="privatecancelbtn"
                  >
                    Cancel
                  </Button>
                  <Button
                        className="float-right px-4 mx-2"
                        color="primary"
                        id="privatesavebtn"
                      >
                        Save
                      </Button>
                  
                  </Col>
                </Row>
                </Card>
              </div>
            </div>
          </div>

          

          <Row>
            <div className="col  pb-2">
              <Card className="shadow border-0 mx-3">
                <CardHeader className=" bg-transparent">
                  <h3>Review and Send!</h3>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg="6" className="my-3">
                      <Col lg="12">
                      <Button
                        className="float-right px-3 mx-1"
                        color="dark"
                        id="reviewprivatebtn"
                      >
                        Private Message
                      </Button>
                        <h4 className="">Message to Recipients!</h4>
                        
                        <FormGroup className="my-4">
                          <span className="emaillabelspan py-2">
                            <strong>Email Subject*</strong>
                          </span>
                          <Input
                            id="input-email-subject"
                            placeholder="Email Subject"
                            type="text"
                          />
                          <span className="emaillabelspan">
                            Max Characters: 100
                          </span>
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup className="">
                          <span className="emaillabelspan  py-2">
                            <strong>Email Body*</strong>
                          </span>
                          <Input
                            id="input-email-message"
                            placeholder="Enter message here ..."
                            rows="3"
                            type="textarea"
                          />
                          <span className="emaillabelspan">
                            Max Characters: 10000
                          </span>
                        </FormGroup>
                        <FormGroup className="">
                          <div
                            id="reviewautoremindercheckdiv"
                            className="custom-control custom-checkbox float-left mx-2 my-1"
                          >
                            <input
                              className="custom-control-input reviewautoremindercheck"
                              id="reviewautoremindercheck"
                              type="checkbox"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="reviewautoremindercheck"
                            >
                              Set automatic reminders
                            </label>
                          </div>
                        </FormGroup>
                        <FormGroup className="mb-2 my-3">
                          <select
                            id="autoreminderselect"
                            className="form-control  form-control-md"
                          >
                            <option value="1">Every day</option>
                            <option value="2">Every 2 days</option>
                            <option value="3">Every 3 days</option>
                            <option value="4">Every 4 days</option>
                            <option value="5">Every 5 days</option>
                            <option value="6">Every 6 days</option>
                            <option value="7">Every 7 days</option>
                          </select>
                        </FormGroup>
                      </Col>
                    </Col>
                    <Col lg="6" className="reviewcontainer">
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
                              Summary
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
                              Options
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <hr className="my-3" />
                      </div>
                      <TabContent
                        activeTab={'tabs' + this.state.tabs}
                        id="tabcontent"
                      >
                        <TabPane tabId="tabs1">
                          <Row>
                            <Col lg="12" className="pb-3">
                              <strong>
                                <span className="summarylabelspan py-2">
                                  <strong>Documents:</strong>
                                </span>
                              </strong>
                              <span className="summarylabelspan">docname</span>
                              <hr className="my-3" />
                              <strong>
                                <span className="summarylabelspan py-2">
                                  <strong>Recipients:</strong>
                                </span>
                              </strong>
                            </Col>
                            <Col lg="12">
                              <div className="reviewrecipientstable">
                                <ul id="reviewrecipientstable"></ul>
                              </div>
                              <hr className="my-2" />
                              <span className="summarylabelspan">Once the envelope is completed, all recipients will receive a copy of the completed envelope.</span>
                              
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tabId="tabs2">
                          <Row>
                            <Col lg="12" className="pb-3">
                              <strong>
                                <span className="summarylabelspan py-2">
                                  <strong>Expiry:</strong>
                                </span>
                              </strong>
                              <FormGroup>
                                <Input
                                  id="input-expiry-date"
                                  type="date"
                                  placeholder="Expiry Date"
                                />
                              </FormGroup>
                              <hr className="my-3" />
                            </Col>
                          </Row>
                        </TabPane>
                      </TabContent>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Row>
                    <Col lg="12">
                    
                      <Button
                        className="float-right px-4 mx-2"
                        color="primary"
                        id="reviewnextbtn"
                      >
                        Send
                      </Button>
                      <Button
                        className="mx-2 float-right px-4"
                        color="dark"
                        id="reviewpreviewbtn"
                      >
                        Preview
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
                  </Row>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </div>
      </>
    )
  }
}

export default Review
