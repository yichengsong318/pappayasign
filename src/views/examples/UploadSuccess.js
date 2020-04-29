import React from "react";
// react plugin used to create google maps


// reactstrap components
import { Card, Container, Row, CardHeader, CardBody, CardFooter, Col, Button } from "reactstrap";

import UncontrolledLottie from '../../components/UncontrolledLottie/UncontrolledLottie'
import './uploadsuccess.css';
import DataVar from '../../variables/data';

import routes from "routes.js";
// core components
import HeaderDefault from "components/Headers/HeaderDefault.js";
// mapTypeId={google.maps.MapTypeId.ROADMAP}


class UploadSuccess extends React.Component {
  componentDidMount(){
    var wurl = '';
    var fileid = '';
    var wuserid = '';
    var wdocname = '';
    var waction = '';

    try {
      var mainurl = document.location.hash,
    params = mainurl.split('?')[1].split('&'),
    data = {}, tmp;
        for (var i = 0, l = params.length; i < l; i++) {
       tmp = params[i].split('=');
       data[tmp[0]] = tmp[1];
        }
     fileid = data.id;
     wuserid = data.u;
     wdocname = data.docname;
     waction = data.action;
     console.log(wuserid);
     console.log(fileid);
     wurl = '#/admin/recepients?id='+fileid+'&u='+wuserid+'&action='+waction+'';
     document.getElementById('checkdiv').style.display = 'none';
    } catch (error) {
      
    }

    var uploadsuccessnextbtn = document.getElementById('uploadsuccessnextbtn')
    uploadsuccessnextbtn.addEventListener('click', function(event) {
      //window.location.hash = '#/admin/recepients';
      if (document.getElementById('onlysignercheck').checked) {
        DataVar.OnlySigner = true;
        window.location.hash = '#/admin/sign';
    } else {

      if(wurl === ''){
        DataVar.OnlySigner = false;
      window.location.hash = '#/admin/recepients';
      }
      else{
        DataVar.OnlySigner = false;
        window.location.hash = wurl;
      }
      
    }
 });

 var documentname = document.getElementById('documentname');
 if(wurl === ''){
  documentname.innerHTML = 'Document Name: ' + DataVar.DocName ;
 }
 else{
  documentname.innerHTML = 'Document Name: ' + wdocname ;
 }
 

  }
  render() {
    return (
      <>
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
                      <button type="button" className="btn btn-primary btn-circle-process">1</button>
                      <p className="steplabel">Add</p>
                  </div>
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary-outline btn-circle-process">2</button>
                      <p className="steplabel">Select</p>
                  </div>
                  <div className="stepwizard-step">
                      <button type="button" className="btn btn-primary-outline btn-circle-process">3</button>
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
              <Card className="shadow border-0">
              <CardHeader className=" bg-transparent">
                  <h4>Upload Successful!</h4>
                </CardHeader>
                <CardBody>
                  
                  <Row>
                    <Col lg="12">
                      <div id="docnamecontainer">
                      <h5 id="documentname"></h5>
                      </div>
                    </Col>
                    
                  </Row>
                
                </CardBody>
                <CardFooter>
                  <Row>
                  <Col lg="12">
                  <Button className="float-right px-4" color="primary" id="uploadsuccessnextbtn">Next</Button>
                  <div id="checkdiv" className="custom-control custom-checkbox float-right mx-4 my-1">
                  <input
                    className="custom-control-input"
                    id="onlysignercheck"
                    type="checkbox"
                  />
                  <label className="custom-control-label" htmlFor="onlysignercheck">
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
    );
  }
}

export default UploadSuccess;
