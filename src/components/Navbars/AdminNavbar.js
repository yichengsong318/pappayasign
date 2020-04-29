import React from "react";
import { Link, NavLink } from "react-router-dom";
import $ from 'jquery';
// reactstrap components
import {
  Button,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

var firebase = require('firebase');
const axios = require('axios').default;

class AdminNavbar extends React.Component {
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
          var storageRef = firebase.storage().ref();
          storageRef.child(userid + '/ProfilePic/profilepic.png').getDownloadURL().then(function(url){
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
            var img = document.getElementById('navbarprofilpic');
            img.setAttribute('crossOrigin', 'anonymous');
          img.src = url;
          
          
            }).catch(function(error) {
            // Handle any errors
        });
        } catch (error) {
          
        }

        
        axios.post('/getuserdata', {
          UserID: userid
         
           })
           .then(function (response) {
           console.log(response);
           if(response.data.Status === 'user found'){
           document.getElementById('navbarname').innerHTML  = response.data.user.UserFirstName ;
             
           }
           })
           .catch(function (error) {
           console.log(error);
           
           });

  
  

      }
      else{
        document.getElementById('navbaradminmain').style.display = 'none';
        document.getElementById('navbaradminmainprofile').style.display = 'none';
        document.getElementById('navbaradminmainprofilespan').style.display = 'none';
        //window.location.hash = "#/auth/login";

        
      }

      function setCookie(name, value, days) {
        var expires = "";
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
      }
  

    

    $(document).on('click','.logoutbtn', function() {
      setCookie('uid',null, 10);
      window.location.hash='#/auth/login';
    });


    
    
  }
  render() {
    return (
      <>
      <Navbar
        className="navbar-top navbar-horizontal navbar-dark"
        expand="md"
        
      >
        <Container className="px-4" fluid>
            <img alt="..." style={{ maxWidth: "170px" }} src="./pappayasign_white.png" />
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link to="/">
                    <img
                      alt="..."
                      src="./pappayasign.png"
                    />
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    id="navbar-collapse-main"
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto mr-auto" fluid="true" navbar id="navbaradminmain">
              <NavItem>
                <NavLink id="homebtn" className="nav-link-icon navtop " activeClassName="active"  to="/admin/index" tag={Link}>
                <span className="btn-inner--icon">
                  <i className="material-icons" >home</i>
                  </span>
                  <span className="btn-inner--text">Home</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink id="managebtn" className="nav-link-icon navtop" activeClassName="active" to="/admin/manage" tag={Link}>
                <span className="btn-inner--icon">
                  <i className="material-icons" >chrome_reader_mode</i>
                  </span>
                  <span className="btn-inner--text">Manage</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink id="settingsbtn" className="nav-link-icon navtop" activeClassName="active" to="/admin/user-profile" tag={Link}>
                <span className="btn-inner--icon">
                  <i className="material-icons" >settings</i>
                  </span>
                  <span className="btn-inner--text">Settings</span>
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="align-items-center d-none d-md-flex" navbar  id="navbaradminmainprofile"> 
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle" id="navbaradminmainprofilespan">
                    <img
                      alt="..."
                      id="navbarprofilpic"
                      src={"/team-4-800x800.jpg"}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span id="navbarname" className="mb-0 text-sm font-weight-bold">
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow dropdown-menu2" right>
                <DropdownItem className="dropdown-item2" to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem className="dropdown-item2" to="/admin/manage" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Manage</span>
                </DropdownItem>
                <DropdownItem className="dropdown-item2" to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem className="dropdown-item2 logoutbtn" id="adminnavbarlogoutbtn">
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
    );
  }
}

export default AdminNavbar;
