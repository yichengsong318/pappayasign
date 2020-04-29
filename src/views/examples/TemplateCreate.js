import React from "react";
// react component that copies the given text inside your clipboard
import TemplateAnnotate from '../../components/TemplateAnnotate/templateannotate'
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

class Icons extends React.Component {
  state = {};
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <Card className=" shadow mt--8 mx-6">
                <CardBody>
                 <TemplateAnnotate/>
                </CardBody>
              </Card>
      </>
    );
  }
}

export default Icons;
