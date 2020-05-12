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
import DataVar from '../../variables/data'
import './recipients.css'

require('jquery-ui')
require('jquery-ui/ui/widgets/sortable')
require('jquery-ui/ui/disable-selection')

class Recipients extends React.Component {
  componentDidMount() {
    var wurl = ''
    var fileid = ''
    var wuserid = ''
    var wdocname = ''
    var waction = ''

    try {
      var mainurl = document.location.hash,
        params = mainurl.split('?')[1].split('&'),
        data = {},
        tmp
      for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=')
        data[tmp[0]] = tmp[1]
      }
      fileid = data.id
      wuserid = data.u
      waction = data.action
      //console.log(wuserid);
      //console.log(fileid);
      wurl =
        '#/admin/sign?id=' +
        fileid +
        '&type=db&u=' +
        wuserid +
        '&action=' +
        waction +
        ''

      var people = []
      people = DataVar.RecipientArray
      people.forEach(function (item, index) {
        var li = document.createElement('li')
        li.innerHTML =
          '<div class="p-2 rcard" id="rcard"><input class="form-control-alternative p-3 inputr" id="recipient-name" placeholder="' +
          people[index].name +
          '" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="recipient-email" placeholder="' +
          people[index].email +
          '" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="recipient-option" placeholder="' +
          people[index].option +
          '" type="text" disabled/><button class="buttonr delete">x</button></div>'
        $('#sortable').append(li)
      })
    } catch (error) {}

    $(function () {
      $('#sortable').sortable()
      $('#sortable').disableSelection()
    })

    $('#append-btn').click(function () {
      var recipientName = document.getElementById('recipient-input-name').value
      var recipientEmail = document.getElementById('recipient-input-email')
        .value
      var recipientoptionselect = document.getElementById(
        'recipientoptionselect'
      )
      var recipientoption =
        recipientoptionselect.options[recipientoptionselect.selectedIndex].value
      if (recipientName == '' || recipientEmail == '') {
        alert('Please enter all details.')
      } else {
        var li = document.createElement('li')
        li.innerHTML =
          '<div class="p-2 rcard" id="rcard"><input class="form-control-alternative p-3 inputr" id="recipient-name" placeholder="' +
          recipientName +
          '" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="recipient-email" placeholder="' +
          recipientEmail +
          '" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="recipient-option" placeholder="' +
          recipientoption +
          '" type="text" disabled/><button class="buttonr delete">x</button></div>'
        $('#sortable').append(li)
        document.getElementById('recipient-input-name').value = ''
        document.getElementById('recipient-input-email').value = ''
      }
    })

    $(document).on('click', '.delete', function () {
      $(this).parent().parent().remove()
      //console.log($(this).parent().children('#recipient-name').attr("placeholder"));
    })

    Array.prototype.pushWithReplace = function (o, k) {
      var fi = this.findIndex((f) => f[k] === o[k])
      fi != -1 ? this.splice(fi, 1, o) : this.push(o)
      return this
    }

    $('#s-btn').click(function () {
      var people = []
      var listItems = $('#sortable li')
      if (listItems.length == 0) {
        alert('There are no recepeints, Please add recipients')
        DataVar.RecipientArray = people
      } else {
        listItems.each(function (li) {
          var recipientN = $(this)
            .children('#rcard')
            .children('#recipient-name')
            .attr('placeholder')
          var recipientE = $(this)
            .children('#rcard')
            .children('#recipient-email')
            .attr('placeholder')
          var recipientO = $(this)
            .children('#rcard')
            .children('#recipient-option')
            .attr('placeholder')
          people.pushWithReplace(
            { name: recipientN, email: recipientE, option: recipientO },
            'email'
          )
        })
        if (wurl === '') {
          if (document.getElementById('signordercheck').checked) {
            DataVar.SignOrder = true
            //console.log(people);
            DataVar.RecipientArray = people
            //console.log(DataVar);
            var url = '#/admin/sign'
            window.location.hash = url
          } else {
            DataVar.SignOrder = false
            //console.log(people);
            DataVar.RecipientArray = people
            //console.log(DataVar);
            var url = '#/admin/sign'
            window.location.hash = url
          }
        } else {
          if (document.getElementById('signordercheck').checked) {
            DataVar.SignOrder = true
            //console.log(people);
            DataVar.RecipientArray = people
            //console.log(DataVar);
            window.location.hash = wurl
          } else {
            DataVar.SignOrder = false
            //console.log(people);
            DataVar.RecipientArray = people
            //console.log(DataVar);
            window.location.hash = wurl
          }
        }
      }
    })
  }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <Container className="mt--9 pb-8">
          <Card className="shadow border-0 pb-2 mb-3 bg-dark">
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
                          className="btn btn-primary-outline btn-circle-process"
                        >
                          3
                        </button>
                        <p className="steplabel">Process</p>
                      </div>
                      <div className="stepwizard-step">
                        <button
                          type="button"
                          className="btn btn-primary-outline btn-circle-process"
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
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Add Recipients</h3>
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
                            id="recipient-input-name"
                            placeholder="Name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <Input
                            className="form-control-alternative"
                            id="recipient-input-email"
                            placeholder="Email Address"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <select
                            id="recipientoptionselect"
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
                        <div
                          id="signordercheckdiv"
                          className="custom-control custom-checkbox float-left mx-2 my-1"
                        >
                          <input
                            className="custom-control-input"
                            id="signordercheck"
                            type="checkbox"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="signordercheck"
                          >
                            Set signing order
                          </label>
                        </div>
                        <Button
                          id="s-btn"
                          className="close-btn float-right m-2 px-5"
                        >
                          {' '}
                          Next
                        </Button>
                        <Button
                          id="append-btn"
                          className="close-btn float-right m-2 px-5"
                        >
                          {' '}
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <div id="recipientdiv">
                    <ul id="sortable"></ul>
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

export default Recipients
