
import React from "react";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";


var firebase = require('firebase');

class UserHeader extends React.Component {
  componentDidMount(){
    var userid = "";
    firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {

        userid = user.uid;

        

        var leadsRef = firebase.database().ref('Users/'+userid)
		leadsRef.on('value', function(snapshot) {
			var Child = snapshot.val();
        var name = Child.UserFirstName;
        document.getElementById('headername').innerHTML  = 'Hello ' + name + '!';

        
        
  });
  
  

      }
      else{
        
        //window.location.hash = "#/auth/login";
        
      }
    });
    
  }
  render() {
    return (
      <>
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "530px"
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-warning " />
          {/* Header container */}
          <Container className="d-flex align-items-center" fluid>
            <Row>
              <Col lg="7" md="10">
                <h1 className="display-2 text-white" id="headername">Hello!</h1>
                <p className="text-white mt-0 mb-4">
                  This is your profile page. You can see the progress you've
                  made with your work and manage your projects or assigned tasks
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default UserHeader;
