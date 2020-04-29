import React from "react";
import { Link, NavLink } from "react-router-dom";

// reactstrap components
import TemplateDropzone from "../../components/TemplateDropzone/TemplateDropzone";
import {
  Button,
  Card,
  CardTitle,
  CardHeader,
  CardBody,
  NavItem,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";


import HeaderDefault from "components/Headers/HeaderDefault.js";

var firebase = require('firebase');

class Index extends React.Component {
  componentDidMount(){
    
      
  }
 
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <div className="modal">
        <div className="modal-content">
          <div><p>Please wait while we fetch your details.</p><div className="lds-dual-ring"></div></div>
          
          </div>
        </div>

        
           
          
          <Row className="mt--7 mx-6">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-white shadow">
              <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-black ls-1 mb-1">
                      Template Dropzone
                      </h6>
                    </div>
                    
                  </Row>
                </CardHeader>
              
                
                <CardBody>
                <TemplateDropzone/>
                </CardBody>
              </Card>
            </Col>
            
          </Row>
          
      </>
    );
  }
}

export default Index;
