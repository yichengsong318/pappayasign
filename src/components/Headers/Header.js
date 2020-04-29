
import React from "react";
import { Link, NavLink } from "react-router-dom";
// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col, Button, NavItem} from "reactstrap";

var firebase = require('firebase');
const axios = require('axios').default;

class Header extends React.Component {
  componentDidMount(){


    function getCookie(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
			  var c = ca[i];
			  while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			  if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
			}		

		var userid = getCookie('uid');

		if (userid) {
	
		console.log('user logged in');
		console.log(userid);
    var email = getCookie('useremail');

          try {

            axios.post('/getuserdata', {
             UserID: userid
            
              })
              .then(function (response) {
              console.log(response);
              if(response.data.Status === 'user found'){
                var signid = document.getElementById('homesignid');
              signid.innerHTML = 'Sign ID: '+response.data.user.SignID;
                
              }
              })
              .catch(function (error) {
              console.log(error);
              
              });

          var storageRef = firebase.storage().ref();
          storageRef.child(userid + '/Signature/signature.png').getDownloadURL().then(function(url){
          // `url` is the download URL for 'images/stars.jpg'
        
          // This can be downloaded directly:
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = function(event) {
          var blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();
        
            // Or inserted into an <img> element:
            console.log(url)
            var img = document.getElementById('homeimgsign');
            img.setAttribute('crossOrigin', 'anonymous');
            img.style.visibility = "visible";
          img.src = url;
          
          
            }).catch(function(error) {
            // Handle any errors
        });
          } catch (error) {
            
          }
          
    
      } else {
          // no user
          //window.location.hash = "#/auth/login";
    
      }


      var imgbtn = document.getElementById('homesignimgbtn')
      imgbtn.addEventListener("click", function (event) {
        window.location.hash = '#/admin/signature';
        });

    
  }
  render() {
    return (
      <>
        <div className="header bg-gradient-warning pb-7 pt-7"
        style={{
          minHeight: "310px",
          backgroundSize: "cover",
          backgroundPosition: "center top"
        }}
        >
        <Container>
              <div className="header-body text-center my-5 ">
                <Row className="justify-content-center">
                  <Col lg="8" className="justify-content-left float-left">
                    <div className="float-left">
                  <h1 className="display-3 text-white float-left">Welcome!</h1>
                <p className="text-white mt-0 mb-4 ">
                  Sign any document,
                  Anywhere
                </p>
                
                  <NavLink className="float-left"   to="/admin/manage" tag={Link}>
                    <Button
                    color="dark"
                    >
                    <span className="d-none d-md-block">Manage</span>
                    <span className="d-md-none">></span>
                    </Button>
                    
                  </NavLink>
                </div>
                  </Col>
                  <Col lg="4" >
                  <Card>
                  <a id="homesignimgbtn">
                    <div className="float-left homesigncontainer">
                      
                    <img crossOrigin="anonymous"  id="homeimgsign" className="homesignimg" ></img>
                    
                    <p id="homesignid" className="float-left signid" >Sign ID: WF2D2522ADBFD</p>
                    </div>
                    </a>
                  </Card>
                  </Col>
                </Row>
              </div>
            </Container>
        </div>
      </>
    );
  }
}

export default Header;
