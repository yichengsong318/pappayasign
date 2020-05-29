// core components
import HeaderDefault from 'components/Headers/HeaderDefault.js'
import React from 'react'
import $ from 'jquery'
// react plugin used to create google maps
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
  FormGroup,
  Input
} from 'reactstrap'
import DataVar from '../../variables/data'
import './uploadsuccess.css'

// mapTypeId={google.maps.MapTypeId.ROADMAP}

class UploadSuccess extends React.Component {
  componentDidMount() {
    var wurl = ''
    var fileid = ''
    var wuserid = ''
    var wdocname = ''
    var waction = ''
    var modal = document.querySelectorAll('.modal')
    

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
      wdocname = data.docname
      waction = data.action
      //console.log(wuserid);
      //console.log(fileid);
      wurl =
        '#/admin/recipients?id=' +
        fileid +
        '&u=' +
        wuserid +
        '&action=' +
        waction +
        ''
      document.getElementById('checkdiv').style.display = 'none'
    } catch (error) {}

    var uploadsuccessnextbtn = document.getElementById('uploadsuccessnextbtn')
    uploadsuccessnextbtn.addEventListener('click', function (event) {
      //window.location.hash = '#/admin/recipients';
      if (document.getElementById('onlysignercheck').checked) {
        DataVar.OnlySigner = true
        window.location.hash = '#/admin/sign'
      } else {
        if (wurl === '') {
          DataVar.OnlySigner = false
          window.location.hash = '#/admin/recipients'
        } else {
          DataVar.OnlySigner = false
          window.location.hash = wurl
        }
      }
    })

    var documentname = document.getElementById('documentname')
    if (wurl === '') {
      documentname.innerHTML = 'Document Name: ' + DataVar.DocName
      document.getElementById('input-docnameedit-message').value = DataVar.DocName
    } else {
      documentname.innerHTML = 'Document Name: ' + wdocname
      document.getElementById('input-docnameedit-message').value = DataVar.DocName
    }


    $("#docnameeditbtn").on('click', function () {
      modal[0].style.display = 'block';
    });

    $(document).on('click', '.docnameedit-close', function () {
      modal[0].style.display = 'none';
    });

    $("#docnameeditcancelbtn").on('click', function () {
      modal[0].style.display = 'none';
    });

    $("#docnameeditsavebtn").on('click', function () {
      DataVar.DocName= document.getElementById('input-docnameedit-message').value
      document.getElementById('input-docnameedit-message').value = '';
        document.getElementById('documentname').innerHTML = '';
      document.getElementById('input-docnameedit-message').value = DataVar.DocName;
      document.getElementById('documentname').innerHTML = 'Document Name: ' + DataVar.DocName;
      modal[0].style.display = 'none';
    });

    $('#onlysignercheck').change(function () {
      if (this.checked) {
        document.getElementById('uploadsuccesssignbtn').style.display = 'block'
        document.getElementById('uploadsuccessnextbtn').style.display = 'none'
      } else {
        document.getElementById('uploadsuccesssignbtn').style.display = 'none'
        document.getElementById('uploadsuccessnextbtn').style.display = 'block'
      }
    })

    var uploadsuccesssignbtn = document.getElementById('uploadsuccesssignbtn')
    uploadsuccesssignbtn.addEventListener('click', function (event) {
      DataVar.OnlySigner = true
        window.location.hash = '#/admin/sign'
    })


  }
  render() {
    return (
      <>

<div className="modal">
            <div className="private-modal-content">
              <div>
              <Card className="shadow border-0 mx-3 p-3">
              <CardHeader className=" bg-transparent">
                <div className="review-manager-title">
                    <span>Change Document Name:</span>
                        <i className="ni ni-fat-remove docnameedit-close" />
                    </div>
                </CardHeader>
                <Row>
                  <Col lg='12'>
                  <FormGroup className=" p-3">
                    <Input
                      id="input-docnameedit-message"
                      placeholder="Enter Document Name"
                      type="text"
                    />
                  </FormGroup>
                  <Button
                    className="mx-2 float-right px-4"
                    color="neutral"
                    id="docnameeditcancelbtn"
                  >
                    Cancel
                  </Button>
                  <Button
                        className="float-right px-4 mx-2"
                        color="primary"
                        id="docnameeditsavebtn"
                      >
                        Save
                      </Button>
                  </Col>
                </Row>
                </Card>
              </div>
            </div>
          </div>

        <HeaderDefault />
        {/* Page content */}
        <Container className="mt--9 pb-8">
          <Row>
            <div className="col  pb-2">
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
                              className="btn btn-primary-outline btn-circle-process"
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
              <Card className="shadow border-0">
                <CardHeader className=" bg-transparent">
                  <h4>Upload Successful!</h4>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg="12">
                      <div id="docnamecontainer">
                      <Button
                        className="mx-3 px-4 float-right"
                        color="neutral"
                        id="docnameeditbtn"
                      >
                        Rename
                      </Button>
                        <span><h5 id="documentname"></h5></span>
                        
                      </div>
                      
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Row>
                    <Col lg="12">
                      <Button
                        className="float-right px-4"
                        color="primary"
                        id="uploadsuccessnextbtn"
                      >
                        Next
                      </Button>
                      <Button
                        className="float-right px-4"
                        color="primary"
                        id="uploadsuccesssignbtn"
                      >
                        Sign
                      </Button>
                      <div
                        id="checkdiv"
                        className="custom-control custom-checkbox float-right mx-4 my-1"
                      >
                        <input
                          className="custom-control-input"
                          id="onlysignercheck"
                          type="checkbox"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="onlysignercheck"
                        >
                          I'm the only signer
                        </label>
                      </div>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    )
  }
}

export default UploadSuccess
