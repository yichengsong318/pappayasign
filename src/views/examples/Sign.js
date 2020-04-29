import React from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
import PDFAnnotate from '../../components/PDFAnnotate/pdfannotate'
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
// core components
import HeaderDefault from "components/Headers/HeaderDefault.js";
var firebase = require('firebase');

class Icons extends React.Component {
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // user exists, do stuff
        var userid = user.uid;
      console.log('user logged in');
      console.log(userid);

      
      
      } else {
        document.getElementById('headerstepwizard').style.display = 'none';
        // no user
        //window.location.hash = "#/auth/login";
      
      }
      });
  }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <Container className="mt--9 pb-3">
        <Card className="shadow border-0 pb-2 mb-3 bg-dark" id="headerstepwizard">
              <CardBody>
                <Row>
              <Col lg="12" className="form-check form-check-inline">
              <div className="stepwizard">
              <div className="stepwizard-row">
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary btn-circle-process">1</button>
                      <p className="steplabel">Add</p>
                  </div>
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary btn-circle-process">2</button>
                      <p className="steplabel">Select</p>
                  </div>
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary btn-circle-process">3</button>
                      <p className="steplabel">Process</p>
                  </div> 
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary-outline btn-circle-process">4</button>
                      <p className="steplabel">Review</p>
                  </div> 
              </div>
          </div>
              </Col>
              </Row>
              </CardBody>
              </Card>
        
        <Card className=" shadow ">
        

                <CardBody>
                 <PDFAnnotate/>
                </CardBody>
              </Card>
              </Container>
      </>
    );
  }
}

export default Icons;
