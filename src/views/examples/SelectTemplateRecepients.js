// core components
import HeaderDefault from 'components/Headers/HeaderDefault.js'
import $ from 'jquery'
import React from 'react'
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Input,
  Row,
} from 'reactstrap'
import TemplateDataVar from '../../variables/templatedata'
import './selecttemplaterecepients.css'

require('jquery-ui')
require('jquery-ui/ui/widgets/sortable')
require('jquery-ui/ui/disable-selection')

const axios = require('axios').default

class SelectTemplateRecepients extends React.Component {
  componentDidMount() {
    var ip ='';
    axios
    .post('/getip', {
    })
    .then(function (response) {
      console.log(response)
      var remoteAddress = response.data;
      const array = remoteAddress.split(':')
      const ip = array[array.length - 1]
      //console.log(ip);
    })
    .catch(function (error) {
      console.log(error)
    })

    var modal = document.querySelectorAll('.modal')

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
      email = getCookie('useremail')
      var count = 0
      var url = ''
      var docid = TemplateDataVar.TemplateID
      var email = ''
      var docname = ''
      var people = []
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

      $(function () {
        $('#stsortable').sortable()
        $('#stsortable').disableSelection()
      })

      $('#stappend-btn').click(function () {
        var recepientName = document.getElementById('strecepient-input-name')
          .value
        var recepientEmail = document.getElementById('strecepient-input-email')
          .value
        var recepientoptionselect = document.getElementById(
          'strecepientoptionselect'
        )
        var recepientoption =
          recepientoptionselect.options[recepientoptionselect.selectedIndex]
            .value
        if (
          recepientoption == 'Needs to View' ||
          recepientoption == 'Recieves a Copy'
        ) {
          if (recepientName == '' || recepientEmail == '') {
            alert('Please enter all details.')
          } else {
            var li = document.createElement('li')
            li.innerHTML =
              '<div class="p-2 rcard" id="strcard"><input class="form-control-alternative p-3 inputr" id="strecepient-name" placeholder="' +
              recepientName +
              '" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="strecepient-email" placeholder="' +
              recepientEmail +
              '" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="strecepient-option" placeholder="' +
              recepientoption +
              '" type="text" disabled/><button class="buttonr delete">x</button></div>'
            $('#stsortable').append(li)
            document.getElementById('strecepient-input-name').value = ''
            document.getElementById('strecepient-input-email').value = ''
          }
        } else if (count < TemplateDataVar.TemplateRecepientCount) {
          if (recepientName == '' || recepientEmail == '') {
            alert('Please enter all details.')
          } else {
            var li = document.createElement('li')
            li.innerHTML =
              '<div class="p-2 rcard" id="strcard"><input class="form-control-alternative p-3 inputr" id="strecepient-name" placeholder="' +
              recepientName +
              '" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="strecepient-email" placeholder="' +
              recepientEmail +
              '" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="strecepient-option" placeholder="' +
              recepientoption +
              '" type="text" disabled/><button class="buttonr delete">x</button></div>'
            $('#stsortable').append(li)
            document.getElementById('strecepient-input-name').value = ''
            document.getElementById('strecepient-input-email').value = ''
            count = count + 1
          }
        } else {
          alert('Sorry all recepient positions have been filled')
        }
      })

      $(document).on('click', '.delete', function () {
        $(this).parent().parent().remove()
        //console.log($(this).parent().children('#strecepient-name').attr("placeholder"));
      })

      var randomString = function (len, bits) {
        bits = bits || 36
        var outStr = '',
          newStr
        while (outStr.length < len) {
          newStr = Math.random().toString(bits).slice(2)
          outStr += newStr.slice(
            0,
            Math.min(newStr.length, len - outStr.length)
          )
        }
        return outStr.toUpperCase()
      }

      Array.prototype.pushWithReplace = function (o, k) {
        var fi = this.findIndex((f) => f[k] === o[k])
        fi != -1 ? this.splice(fi, 1, o) : this.push(o)
        return this
      }

      $('#sts-btn').click(function () {
        modal[0].style.display = 'block'
        var today = new Date().toLocaleString().replace(',', '')
        people = []
        var listItems = $('#stsortable li')
        if (listItems.length == 0) {
          alert('There are no recepeints, Please add recepients')
          TemplateDataVar.TemplateRecepientArray = people
        } else {
          listItems.each(function (li) {
            var recepientN = $(this)
              .children('#strcard')
              .children('#strecepient-name')
              .attr('placeholder')
            var recepientE = $(this)
              .children('#strcard')
              .children('#strecepient-email')
              .attr('placeholder')
            var recepientO = $(this)
              .children('#strcard')
              .children('#strecepient-option')
              .attr('placeholder')
            people.pushWithReplace(
              { name: recepientN, email: recepientE, option: recepientO },
              'email'
            )
          })
          //console.log(people);
          TemplateDataVar.TemplateRecepientArray = people
          //console.log(TemplateDataVar);
        }

        var newdocid = randomString(13)

        axios
          .post('/templatedownload', {
            UserID: userid,
            filename: docid,
          })
          .then(function (response) {
            console.log(response)
            if (response.data.Status === 'doc found') {
              var doc = response.data.data

              //console.log(doc);

              

              axios
                .post('/docupload', {
                  UserID: userid,
                  filename: newdocid,
                  filedata: doc,
                })
                .then(function (response) {
                  console.log(response)
                  if (response.data === 'document upload success') {
                    //console.log('completed');

                    axios
                      .post('/gettemplatedata', {
                        TemplateID: docid,
                      })
                      .then(function (response) {
                        console.log(response)
                        if (response.data.Status === 'template found') {
                          var Template = response.data.Template

                          axios
                            .post('/adddocumentdata', {
                              DocumentName: Template.TemplateName,
                              DocumentID: newdocid,
                              OwnerEmail: Template.OwnerEmail,
                              DateCreated: today,
                              DateStatus: today,
                              DateSent: '',
                              Owner: userid,
                              Status: 'Draft',
                              SignOrder: false,
                              Data: Template.Data,
                              Reciever: Template.Reciever,
                            })
                            .then(function (response) {
                              console.log(response)
                              if (
                                response.data === 'insert done' ||
                                response.data === 'update done'
                              ) {

                                axios
                                .post('/posthistory', {
                                  DocumentID: newdocid,
                                  HistoryTime: today,
                                  HistoryUser: email + '\n['+ip+']',
                                  HistoryAction: 'Registered',
                                  HistoryActivity: 'The envelope was created by '+email+'',
                                  HistoryStatus: 'Created'
                                })
                                .then(function (response) {
                                  console.log(response)
                                  
                                })
                                .catch(function (error) {
                                  console.log(error)
                                })

                                var Reciever = []

                                people.forEach(function (item, index) {
                                  var url =
                                    process.env.REACT_APP_BASE_URL +
                                    '/#/admin/sign?id=' +
                                    encodeURIComponent(newdocid) +
                                    '&type=db&u=' +
                                    userid +
                                    '&key=' +
                                    index +
                                    ''
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
                                      DocumentName: docname,
                                      RecepientEmail: recepientEmail,
                                      RecepientColor: recepientColor,
                                      RecepientOption: recepientOption,
                                      RecepientStatus: 'Sent',
                                      RecepientDateStatus: today,
                                    }
                                    Reciever.push(user)

                                    axios
                                    .post('/posthistory', {
                                      DocumentID: newdocid,
                                      HistoryTime: today,
                                      HistoryUser: recepientEmail + '\n['+ip+']',
                                      HistoryAction: 'Sent Invitations',
                                      HistoryActivity: 'Envelope host sent an invitation to '+recepientName+' ['+recepientEmail+']',
                                      HistoryStatus: 'Sent'
                                    })
                                    .then(function (response) {
                                      console.log(response)
                                      
                                    })
                                    .catch(function (error) {
                                      console.log(error)
                                    })
                                    //console.log(Reciever);

                                    axios
                                      .post('/getrequestuser', {
                                        UserEmail: recepientEmail,
                                      })
                                      .then(function (response) {
                                        console.log(response)
                                        if (
                                          response.data.Status === 'user found'
                                        ) {
                                          axios
                                            .post('/postrequest', {
                                              UserID: response.data.UserID,
                                              DocumentName:
                                              Template.TemplateName,
                                              DocumentID: newdocid,
                                              From: userid,
                                              FromEmail: Template.OwnerEmail,
                                              RecepientStatus: 'Need to Sign',
                                              RecepientDateStatus: today,
                                            })
                                            .then(function (response) {
                                              console.log(response)
                                              if (
                                                response.data === 'user found'
                                              ) {
                                              }
                                            })
                                            .catch(function (error) {
                                              console.log(error)
                                              modal[0].style.display = 'none'
                                              alert(error)
                                            })
                                        }
                                      })
                                      .catch(function (error) {
                                        console.log(error)
                                      })

                                    axios
                                      .post('/sendmail', {
                                        to: recepientEmail,
                                        body:
                                          `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign.</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, ` +
                                          recepientName +
                                          `</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. </p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="` +
                                          url +
                                          `" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`,
                                        subject: 'PappayaSign: Sign Request',
                                      })
                                      .then(function (response) {
                                        console.log(response)
                                      })
                                      .catch(function (error) {
                                        //console.log('message could not be sent');
                                      })
                                  }
                                })

                                axios
                                  .post('/addreciever', {
                                    Status: 'Waiting for Others',
                                    DocumentID: newdocid,
                                    SignOrder: false,
                                    DateSent: today,
                                    Reciever: Reciever,
                                  })
                                  .then(function (response) {
                                    console.log(response)
                                    if (response.data === 'reciever done') {
                                      modal[0].style.display = 'none'
                                      window.location.hash =
                                        '#/admin/sendsuccess'
                                    }
                                  })
                                  .catch(function (error) {
                                    console.log(error)
                                    modal[0].style.display = 'none'
                                    alert(error)
                                  })
                              }
                            })
                            .catch(function (error) {
                              console.log(error)
                              modal[0].style.display = 'none'
                            })
                        }
                      })
                      .catch(function (error) {
                        console.log(error)
                        modal[0].style.display = 'none'
                      })
                  }
                })
                .catch(function (error) {
                  console.log(error)
                  modal[0].style.display = 'none'
                })
            }
          })
          .catch(function (error) {
            console.log(error)
            modal[0].style.display = 'none'
          })
      })
    } else {
      //window.location.hash = "#/auth/login";
    }
  }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <div className="modal">
          <div className="modal-content">
            <div>
              <p>Please wait while we send your document.</p>
              <div className="lds-dual-ring"></div>
            </div>
          </div>
        </div>
        <Container className="mt--7 pb-8">
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Add Recepients</h3>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="mb-4 mb-xl-0">
                      <h5>Enter Recepients: </h5>
                    </div>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <Input
                            className="form-control-alternative"
                            id="strecepient-input-name"
                            placeholder="Name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <Input
                            className="form-control-alternative"
                            id="strecepient-input-email"
                            placeholder="Email Address"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <select
                            id="strecepientoptionselect"
                            className="form-control  form-control-md"
                          >
                            <option value="Needs to Sign">Needs to Sign</option>
                            <option value="Needs to View">Needs to View</option>
                            <option value="Recieves a Copy">
                              Recieves a Copy
                            </option>
                          </select>
                        </FormGroup>
                      </Col>

                      <Col lg="12">
                        <Button
                          id="sts-btn"
                          className="close-btn float-right m-2 px-5"
                        >
                          {' '}
                          Finish
                        </Button>
                        <Button
                          id="stappend-btn"
                          className="close-btn float-right m-2 px-5"
                        >
                          {' '}
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <div id="strecepientdiv">
                    <ul id="stsortable"></ul>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    )
  }
}

export default SelectTemplateRecepients
