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
import './templaterecipients.css'

require('jquery-ui')
require('jquery-ui/ui/widgets/sortable')
require('jquery-ui/ui/disable-selection')

class TemplateRecipients extends React.Component {
  componentDidMount() {
    $(function () {
      $('#tsortable').sortable()
      $('#tsortable').disableSelection()
    })

    $('#tappend-btn').click(function () {
      var recipientName = document.getElementById('trecipient-input-name').value
      var recipientEmail = document.getElementById('trecipient-input-email')
        .value
      var recipientoptionselect = document.getElementById(
        'trecipientoptionselect'
      )
      var recipientoption =
        recipientoptionselect.options[recipientoptionselect.selectedIndex].value
      if (recipientName == '' || recipientEmail == '') {
        alert('Please enter all details.')
      } else {
        var li = document.createElement('li')
        li.innerHTML =
          '<div class="p-2 rcard" id="trcard"><input class="form-control-alternative p-3 inputr" id="trecipient-name" placeholder="' +
          recipientName +
          '" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="trecipient-email" placeholder="' +
          recipientEmail +
          '" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="trecipient-option" placeholder="' +
          recipientoption +
          '" type="text" disabled/><button class="buttonr delete">x</button></div>'
        $('#tsortable').append(li)
        document.getElementById('trecipient-input-name').value = ''
        document.getElementById('trecipient-input-email').value = ''
      }
    })

    $(document).on('click', '.delete', function () {
      $(this).parent().parent().remove()
      //console.log($(this).parent().children('#trecipient-name').attr("placeholder"));
    })

    Array.prototype.pushWithReplace = function (o, k) {
      var fi = this.findIndex((f) => f[k] === o[k])
      fi != -1 ? this.splice(fi, 1, o) : this.push(o)
      return this
    }

    $('#ts-btn').click(function () {
      var people = []
      var listItems = $('#tsortable li')
      if (listItems.length == 0) {
        alert('There are no recepeints, Please add some recipients')
        TemplateDataVar.TemplateRecipientArray = people
      } else {
        listItems.each(function (li) {
          var recipientN = $(this)
            .children('#trcard')
            .children('#trecipient-name')
            .attr('placeholder')
          var recipientE = $(this)
            .children('#trcard')
            .children('#trecipient-email')
            .attr('placeholder')
          var recipientO = $(this)
            .children('#trcard')
            .children('#trecipient-option')
            .attr('placeholder')
          people.pushWithReplace(
            { name: recipientN, email: recipientE, option: recipientO },
            'email'
          )
        })
        //console.log(people);
        TemplateDataVar.TemplateRecipientArray = people
        //console.log(TemplateDataVar);
        var url = '#/admin/templatecreate'
        window.location.hash = url
      }
    })
  }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <Container className="mt--7 pb-8">
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Add PlaceHolder Recipients</h3>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="mb-4 mb-xl-0">
                      <h5>Enter Recipients: </h5>
                    </div>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <Input
                            className="form-control-alternative"
                            id="trecipient-input-name"
                            placeholder="Name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <Input
                            className="form-control-alternative"
                            id="trecipient-input-email"
                            placeholder="Email Address"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <select
                            id="trecipientoptionselect"
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
                          id="ts-btn"
                          className="close-btn float-right m-2 px-5"
                        >
                          {' '}
                          Next
                        </Button>
                        <Button
                          id="tappend-btn"
                          className="close-btn float-right m-2 px-5"
                        >
                          {' '}
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <div id="trecipientdiv">
                    <ul id="tsortable"></ul>
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

export default TemplateRecipients