
import React from "react";
import { Link, NavLink } from "react-router-dom";
import $ from 'jquery';
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Nav,
  NavItem,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

const axios = require('axios').default;

var firebase = require('firebase');
var app = firebase.initializeApp({
apiKey: "AIzaSyCQCOnRw9BS26_fO-VumQHIVxUOZTfDI14",
authDomain: "connectmessenger-66b24.firebaseapp.com",
databaseURL: "https://connectmessenger-66b24.firebaseio.com",
projectId: "connectmessenger-66b24",
storageBucket: "connectmessenger-66b24.appspot.com",
messagingSenderId: "360288484526",
appId: "1:360288484526:web:c7d430cf2524023fea813f"
});

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.verifyCallback = this.verifyCallback.bind(this);
  }



verifyCallback(recaptchaToken) {
  // Here you will get the final recaptchaToken!!!  
  try {
  document.getElementById('loginerrorspan').innerHTML = "";
  } catch (error) {
    
  }
  
}

  componentDidMount() { 

    var userid = getCookie('uid');

    if(userid){
      console.log(userid);
    }
    else{
      //window.location.hash = '#/auth/login';
    }


    var useremail ='';

    var modal = document.querySelectorAll(".modal")

    try {
      var mainurl = document.location.hash,
    params = mainurl.split('?')[1].split('&'),
    data = {}, tmp;
        for (var i = 0, l = params.length; i < l; i++) {
       tmp = params[i].split('=');
       data[tmp[0]] = tmp[1];
        }
     var type = data.type;
     var useremail = data.u;
     console.log(type);
     console.log(useremail);

     if(useremail){
      modal[1].style.display = "block";
     }

       
    } catch (error) {
      
    }
    //modal[1].style.display = "block";

    window.onclick = function(e){
      if(e.target == modal[0] || e.target == modal[1] ){
      modal[0].style.display = "none";
      modal[1].style.display = "none";
      }
    }


    var loginemail = document.getElementById('loginemail')
		var loginpassword = document.getElementById('loginpassword')
    var loginbtn = document.getElementById('loginbtn')
    loginbtn.addEventListener('click', function(event) {
      signin();
 });

		
	if(loginemail){
	    loginemail.addEventListener("keyup", function(e) {
	      e.preventDefault();
	      if (e.keyCode == 13) {
		loginbtn.click();
	      }
	    });
	  }
	  
	if(loginpassword){
	    loginpassword.addEventListener("keyup", function(e) {
	      e.preventDefault();
	      if (e.keyCode == 13) {
		loginbtn.click();
	      }
	    });
    }

    

    var forgotenterbtnnext = document.getElementById('forgotenterbtnnext')
    

    forgotenterbtnnext.addEventListener('click', function(event) {
      document.getElementById('forgot1enterspan').innerHTML = "Please wait...";
      var forgotenterpassword = document.getElementById('forgotenterpassword').value;
      var forgotreenterpassword = document.getElementById('forgotreenterpassword').value;
      if(forgotenterpassword == ''||forgotreenterpassword==''){
        document.getElementById('forgot1enterspan').innerHTML = "Please enter your password.";
      }
      else if(forgotenterpassword != forgotreenterpassword){
        document.getElementById('forgot1enterspan').innerHTML = "Passwords don't match.";
      }
      else{
        
        axios.post('/resetpassword', {
          UserEmail: useremail,
          UserPassword: forgotenterpassword
          
        })
        .then(function (response) {
          if(response.data === 'reset'){
            document.getElementById('forgot1enterspan').innerHTML = "Password reset, Login to Continue.";
            
          }
        })
        .catch(function (error) {
    
        });
      }
 });



    var forgotpasswordbtn = document.getElementById('forgotpasswordbtn');
    forgotpasswordbtn.addEventListener('click', function(event) {
      modal[0].style.display = "block";
    });

    var forgotbtnnext = document.getElementById('forgotbtnnext')
    function alertFunc(){
      modal[0].style.display = "none";
    }

    forgotbtnnext.addEventListener('click', function(event) {
      document.getElementById('forgot1errorspan').innerHTML = "Please wait...";
      var forgotemail = document.getElementById('forgotemail').value;
      if(forgotemail == ''){
        document.getElementById('forgot1errorspan').innerHTML = "Please enter an email address.";
      }
      else{
        
        axios.post('/sendmail', {
          to: forgotemail,
          body: `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Activation</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign: Forgot Password.</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Welcome to PappayaSign,</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists of your password reset link to PappayaSign. Click the link below to reset your password.</p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="`+process.env.BASE_URL+`/#/auth/login?resetlink=86hjw4ius&type=mail&u=`+forgotemail+`" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border: solid 1px #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Reset Password</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`,
          subject: "PappayaSign: Password Reset"
          
        })
        .then(function (response) {
          console.log(response);
          document.getElementById('forgot1errorspan').innerHTML = "Passowrd reset link has been sent to your email address.";
          //window.location.hash = "#/auth/login";
        })
        .catch(function (error) {
          document.getElementById('forgot1errorspan').innerHTML = error;
        });
      }
 });

		
function signin() {

	var email = document.getElementById('loginemail').value;
        var password = document.getElementById('loginpassword').value;
        if (email.length < 4) {
          document.getElementById('loginerrorspan').innerHTML = "Please enter an email address.";
	  
          return;
        }
        if (password.length < 4) {
          document.getElementById('loginerrorspan').innerHTML = "Please enter a password.";
	  
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        document.getElementById('loginerrorspan').innerHTML = "Please wait";
        axios.post('/login', {
          UserEmail: email,
          UserPassword: password
          
        })
        .then(function (response) {
          console.log(response);
          if(response.data.Status === 'login successful'){
            document.getElementById('loginerrorspan').innerHTML = "Login Successful";
            setCookie('uid',response.data.UserID, 1);
            setCookie('useremail',response.data.UserEmail, 1);
            window.location.hash = "#/admin/index";
          }
          else if(response.data.Status === 'sign id required'){
            document.getElementById('loginerrorspan').innerHTML = "sign id required";
            setCookie('uid',response.data.UserID, 1);
            setCookie('useremail',response.data.UserEmail, 1);
            window.location.hash = "#/admin/signature";
          }
          else if(response.data.Status === 'activate account'){
            document.getElementById('loginerrorspan').innerHTML = "Activate Your Account";
          }
          else if(response.data.Status === 'wrong password'){
            document.getElementById('loginerrorspan').innerHTML = "Wrong Password";
          }
          else if(response.data.Status === 'user not found'){
            document.getElementById('loginerrorspan').innerHTML = "User ID Does not exist";
          }
         })
        .catch(function (error) {
          console.log(error);
        });
  
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

     

  }

  render() {
    return (
      <>
      <div className="modal">
        <div className="modal-content">
        <Col lg="12" md="8" className="p-2 pb-2">
        <CardBody className="px-lg-3 py-lg-3">
              <div className="text-center text-muted mb-3 mt-2">
                <span>Please enter your email</span>
              </div>
              <Form role="form">
                <Row className="px-2">
              <Col lg="12" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="forgotemail" placeholder="Email" type="email"/>
                  </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <div className="text-muted font-italic">
                  <small>
                    <span id="forgot1errorspan"  className="text-error font-weight-700"></span>
                  </small>
                </div>
                
                <div className="text-center">
                  <Button id="forgotbtnnext" className="mt-3 px-4" color="primary" type="button">
                    Next
                  </Button>
                </div>
                </Form>
                </CardBody>
                </Col>
        </div>
        
      </div>

      <div className="modal">
        <div className="modal-content">
        <Col lg="12" md="8" className="p-2 pb-2">
        <CardBody className="px-lg-3 py-lg-3">
              <div className="text-center text-muted mb-3 mt-2">
                <span>Enter your new password</span>
              </div>
              <Form role="form">
                <Row className="px-2">
              <Col lg="12" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="forgotenterpassword" placeholder="New Password" type="password"/>
                  </InputGroup>
                </FormGroup>
                </Col>
                <Col lg="12" md="8" className="p-2">
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="forgotreenterpassword" placeholder="Confirm Password" type="password"/>
                  </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <div className="text-muted font-italic">
                  <small>
                    <span id="forgot1enterspan"  className="text-error font-weight-700"></span>
                  </small>
                </div>
                
                <div className="text-center">
                  <Button id="forgotenterbtnnext" className="mt-3 px-4" color="primary" type="button">
                    Reset
                  </Button>
                </div>
                </Form>
                </CardBody>
                </Col>
        </div>
        
      </div>


        <Col lg="6" md="7" className="p-5 pb-8">
          <Card className="bg-secondary shadow border-0">
           
            <CardBody className="px-lg-3 py-lg-3 ">
              <div className="text-center text-muted mb-3 mt-2">
                <span>Sign in with credentials</span>
              </div>
              <Form role="form">
                <FormGroup className="mb-1">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="loginemail" placeholder="Email" type="email" autoComplete="new-email"/>
                  </InputGroup>
                </FormGroup>
                <FormGroup className="mb-2">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input id="loginpassword" placeholder="Password" type="password" autoComplete="new-password"/>
                  </InputGroup>
                </FormGroup>
                
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheck2"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheck2"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-muted font-italic">
                  <small>
                    <span id="loginerrorspan" className="text-warning font-weight-700"></span>
                  </small>
                </div>
                <GoogleReCaptchaProvider reCaptchaKey="6LcPcuwUAAAAAL2ebX2lgNSUH8uzqnMDXFTr06wT">
    <GoogleReCaptcha onVerify={this.verifyCallback} />
  </GoogleReCaptchaProvider>
                <div className="text-center">
                  <Button id="loginbtn" className="my-2 px-4" color="primary" type="button">
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-1">
          
            <Col xs="6 py-2">
                            <Button
                            color="neutral"
                            id="forgotpasswordbtn"
                            >
                            <span className="d-none d-md-block text-gray">Forgot password ?</span>
                            <span className="d-md-none text-gray">Forgot password ?</span>
                            </Button>
            </Col>
            <Col className="text-right py-2" xs="6">
            <Nav className="justify-content-end" pills>
                        
                        <NavItem>
                          <NavLink className="py-2 px-1"   to="/auth/register" tag={Link}>
                            <Button
                            color="neutral"
                            >
                            <span className="d-none d-md-block text-gray">No Account? Sign Up for Free</span>
                            <span className="d-md-none text-gray">Create new account</span>
                            </Button>
                            
                          </NavLink>
                        </NavItem>
                      </Nav>
            </Col>
            
          </Row>
        </Col>

        <Row>
        <Col>
        
        </Col>
        </Row>
      </>
    );
  }
}

export default Login;
