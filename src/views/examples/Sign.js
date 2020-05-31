// core components
import HeaderDefault from 'components/Headers/HeaderDefault.js'
import React from 'react'
import $ from 'jquery'
// reactstrap components
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import PDFAnnotate from '../../components/PDFAnnotate/pdfannotate'

class Icons extends React.Component {
  componentDidMount() {
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
    var signfilename = ''
    var signfileid = ''
    var signtype = ''
    var signuseridother = ''
    var signkey = ''

    if (userid) {
      //console.log('user logged in');
      //console.log(userid);
      try {
        var mainurl = document.location.hash,
          params = mainurl.split('?')[1].split('&'),
          data = {},
          tmp
        for (var i = 0, l = params.length; i < l; i++) {
          tmp = params[i].split('=')
          data[tmp[0]] = tmp[1]
        }
        signfilename = data.id
        signfileid = data.id
        signtype = data.type
        signuseridother = data.u
        ////console.log(type);
        ////console.log(userid);
        ////console.log(useridother);
        signfileid = data.id
        signkey = data.key
        // // // // // // // ////console.log('key:'+key);
      } catch (error) {}

      if (signfilename == '' || signuseridother == '') {

      }else {
        if (userid != signuseridother) {
          document.getElementById('signtitle').innerHTML = 'Sign Document'
          document.getElementById('headerstepwizard').style.display = 'none'
        }else{
          document.getElementById('signtitle').innerHTML = 'Prepare Document'
          document.getElementById('headerstepwizard').style.display = 'block'
        }
      }

    } else {
      document.getElementById('headerstepwizard').style.display = 'none'
      // no user
      //window.location.hash = "#/auth/login";
    }

    $('#stepaddbtn').click(function () {
      window.location.hash = '#/admin/uploadsuccess'
    });

    $('#stepselectbtn').click(function () {
      window.location.hash = '#/admin/recipients'
    });

  }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <div className="mt--9 pb-3">
          <Card
            className="shadow border-0 pb-2 mx-5 mb-3 bg-dark"
            id="headerstepwizard"
          >
            <CardBody>
              <Row>
                <Col lg="12" className="form-check form-check-inline">
                  <div className="stepwizard">
                    <div className="stepwizard-row">
                      <div className="stepwizard-step">
                        <button
                          type="button"
                          id="stepaddbtn"
                          className="btn btn-primary btn-circle-process"
                        >
                          1
                        </button>
                        <p className="steplabel">Add</p>
                      </div>
                      <div className="stepwizard-step">
                        <button
                          type="button"
                          id="stepselectbtn"
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

          <Card className=" shadow mx-3">
            <CardHeader className=" bg-transparent">
              <h3 id="signtitle">Prepare Document</h3>
            </CardHeader>
            <CardBody>
              <PDFAnnotate />
            </CardBody>
          </Card>
        </div>
      </>
    )
  }
}

export default Icons
