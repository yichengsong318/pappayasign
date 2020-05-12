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
import './selecttemplaterecipients.css'

require('jquery-ui')
require('jquery-ui/ui/widgets/sortable')
require('jquery-ui/ui/disable-selection')

const axios = require('axios').default

class SaveAsTemplate extends React.Component {
  componentDidMount() {
    var modal = document.querySelectorAll('.modal')
    modal[1].style.display = 'block'

    try {
      var people = []
      people = TemplateDataVar.TemplateRecipientArray
      people.forEach(function (item, index) {
        var li = document.createElement('li')
        li.innerHTML =
          '<div class="p-2 rcard" id="satrcard"><input class="form-control-alternative p-3 inputr" id="satrecipient-name" placeholder="' +
          people[index].name +
          '" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="satrecipient-email" placeholder="' +
          people[index].email +
          '" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="satrecipient-option" placeholder="' +
          people[index].option +
          '" type="text" disabled/><button class="buttonr delete">x</button></div>'
        $('#satsortable').append(li)
      })
      modal[1].style.display = 'none'
    } catch (error) {
      modal[1].style.display = 'none'
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
      email = getCookie('useremail')

      var count = 0
      var url = ''
      var docid = TemplateDataVar.TemplateID
      var useridother = TemplateDataVar.TemplateUserID
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
        $('#satsortable').sortable()
        $('#satsortable').disableSelection()
      })

      $('#satappend-btn').click(function () {
        var recipientName = document.getElementById('satrecipient-input-name')
          .value
        var recipientEmail = document.getElementById('satrecipient-input-email')
          .value
        var recipientoptionselect = document.getElementById(
          'satrecipientoptionselect'
        )
        var recipientoption =
          recipientoptionselect.options[recipientoptionselect.selectedIndex]
            .value
        if (
          recipientoption == 'Needs to View' ||
          recipientoption == 'Recieves a Copy'
        ) {
          if (recipientName == '' || recipientEmail == '') {
            alert('Please enter all details.')
          } else {
            var li = document.createElement('li')
            li.innerHTML =
              '<div class="p-2 rcard" id="satrcard"><input class="form-control-alternative p-3 inputr" id="satrecipient-name" placeholder="' +
              recipientName +
              '" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="satrecipient-email" placeholder="' +
              recipientEmail +
              '" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="satrecipient-option" placeholder="' +
              recipientoption +
              '" type="text" disabled/><button class="buttonr delete">x</button></div>'
            $('#satsortable').append(li)
            document.getElementById('satrecipient-input-name').value = ''
            document.getElementById('satrecipient-input-email').value = ''
          }
        } else if (count < TemplateDataVar.TemplateRecipientCount) {
          if (recipientName == '' || recipientEmail == '') {
            alert('Please enter all details.')
          } else {
            var li = document.createElement('li')
            li.innerHTML =
              '<div class="p-2 rcard" id="satrcard"><input class="form-control-alternative p-3 inputr" id="satrecipient-name" placeholder="' +
              recipientName +
              '" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="satrecipient-email" placeholder="' +
              recipientEmail +
              '" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="satrecipient-option" placeholder="' +
              recipientoption +
              '" type="text" disabled/><button class="buttonr delete">x</button></div>'
            $('#satsortable').append(li)
            document.getElementById('satrecipient-input-name').value = ''
            document.getElementById('satrecipient-input-email').value = ''
            count = count + 1
          }
        } else {
          alert('Sorry all recipient positions have been filled')
        }
      })

      $(document).on('click', '.delete', function () {
        $(this).parent().parent().remove()
        //console.log($(this).parent().children('#satrecipient-name').attr("placeholder"));
      })

      Array.prototype.pushWithReplace = function (o, k) {
        var fi = this.findIndex((f) => f[k] === o[k])
        fi != -1 ? this.splice(fi, 1, o) : this.push(o)
        return this
      }

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

      $('#sat-btn').click(function () {
        var recipienttemplatename = document.getElementById(
          'sat-input-template-name'
        ).value
        if (recipienttemplatename !== '') {
          var today = new Date().toLocaleString().replace(',', '')
          modal[0].style.display = 'block'
          url =
            process.env.REACT_APP_BASE_URL +
            '/#/admin/sign?id=' +
            encodeURIComponent(docid) +
            '&type=db&u=' +
            userid
          people = []
          var listItems = $('#satsortable li')
          if (listItems.length == 0) {
            alert('There are no recepeints, Please add recipients')
            TemplateDataVar.TemplateRecipientArray = people
          } else {
            listItems.each(function (li) {
              var recipientN = $(this)
                .children('#satrcard')
                .children('#satrecipient-name')
                .attr('placeholder')
              var recipientE = $(this)
                .children('#satrcard')
                .children('#satrecipient-email')
                .attr('placeholder')
              var recipientO = $(this)
                .children('#satrcard')
                .children('#satrecipient-option')
                .attr('placeholder')
              people.pushWithReplace(
                { name: recipientN, email: recipientE, option: recipientO },
                'email'
              )
            })
            //console.log(people);
            TemplateDataVar.TemplateRecipientArray = people
            //console.log(TemplateDataVar);
          }

          var newtemplateid = randomString(13)

          axios
            .post('/docdownload', {
              UserID: useridother,
              filename: docid,
            })
            .then(function (response) {
              console.log(response)
              if (response.data.Status === 'doc found') {
                var doc = response.data.data

                //console.log(doc);

                axios
                  .post('/templateupload', {
                    UserID: userid,
                    filename: newtemplateid,
                    filedata: doc,
                  })
                  .then(function (response) {
                    console.log(response)
                    if (response.data === 'document upload success') {
                      //console.log('completed');

                      axios
                        .post('/getdocdata', {
                          DocumentID: docid,
                        })
                        .then(function (response) {
                          console.log(response)
                          if (response.data.Status === 'doc data done') {
                            var Document = response.data.Document

                            axios
                              .post('/addtemplatedata', {
                                TemplateName: recipienttemplatename,
                                TemplateID: docid,
                                OwnerEmail: Document.OwnerEmail,
                                DateCreated: today,
                                DateStatus: today,
                                DateSent: '',
                                Owner: userid,
                                Status: 'Draft',
                                SignOrder: false,
                                Data: Document.Data,
                                Reciever: Document.Reciever,
                              })
                              .then(function (response) {
                                console.log(response)
                                if (
                                  response.data === 'insert done' ||
                                  response.data === 'update done'
                                ) {
                                  var Reciever = []
                                  people.forEach(function (item, index) {
                                    var recipientName = people[index].name
                                    var recipientEmail = people[index].email
                                    var recipientOption = people[index].option
                                    var recipientColor = colorArray[index]
                                    if (
                                      recipientOption == 'Needs to Sign' ||
                                      recipientOption == 'Needs to View'
                                    ) {
                                      //console.log(recipientEmail + ',' + recipientName);
                                      var user = {
                                        RecipientName: recipientName,
                                        DocumentName: recipienttemplatename,
                                        RecipientEmail: recipientEmail,
                                        RecipientColor: recipientColor,
                                        RecipientOption: recipientOption,
                                        RecipientStatus: 'Sent',
                                        RecipientDateStatus: today,
                                      }
                                      Reciever.push(user)
                                      //console.log(Reciever);
                                    }
                                  })

                                  axios
                                    .post('/addtemplatereciever', {
                                      Status: 'Waiting for Others',
                                      TemplateID: docid,
                                      DateSent: today,
                                      Reciever: Reciever,
                                    })
                                    .then(function (response) {
                                      console.log(response)
                                      if (response.data === 'reciever done') {
                                        window.location.hash =
                                          '#/admin/templates'
                                        //url = 'https://pappayasign.surge.sh/#/admin/sign?id=' + encodeURIComponent(filename) + '&type=db&u=' + userid;
                                        modal[0].style.display = 'none'
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
        } else {
          alert('Please enter a template name.')
        }
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

        <div className="modal">
          <div className="modal-content">
            <div>
              <p>Please wait while we fetch your details.</p>
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
                  <h3 className="mb-0">Save as Template</h3>
                </CardHeader>
                <CardBody>
                  <div>
                    <Row>
                      <Col lg="12">
                        <div className="mb-4 mb-xl-0">
                          <h5>Template Name: </h5>
                        </div>
                        <FormGroup>
                          <Input
                            className="form-control-alternative"
                            id="sat-input-template-name"
                            placeholder="Template Name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="mb-4 mb-xl-0">
                      <h5>Enter Placeholder Recipients: </h5>
                    </div>

                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <Input
                            className="form-control-alternative"
                            id="satrecipient-input-name"
                            placeholder="Name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <Input
                            className="form-control-alternative"
                            id="satrecipient-input-email"
                            placeholder="Email Address"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <select
                            id="satrecipientoptionselect"
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
                          id="sat-btn"
                          className="close-btn float-right m-2 px-5"
                        >
                          {' '}
                          Finish
                        </Button>
                        <Button
                          id="satappend-btn"
                          className="close-btn float-right m-2 px-5"
                        >
                          {' '}
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <div id="strecipientdiv">
                    <ul id="satsortable"></ul>
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

export default SaveAsTemplate
