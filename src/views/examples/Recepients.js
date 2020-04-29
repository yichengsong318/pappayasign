
import React from "react";
import classnames from "classnames";
import "./recepients.css";
import $ from 'jquery';

import DataVar from '../../variables/data';


// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  FormGroup,
  Input,
  Col,
  Row,
	TabContent,
	TabPane,
	NavItem,
  NavLink,
  Button,
	Nav,
  UncontrolledTooltip,
  CardBody
} from "reactstrap";
// core components
import HeaderDefault from "components/Headers/HeaderDefault.js";

require('jquery-ui');
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui/ui/disable-selection');

var firebase = require('firebase');

class Recepients extends React.Component {
  
    
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
		waction = data.action
		console.log(wuserid);
		console.log(fileid);
		wurl = '#/admin/sign?id='+fileid+'&type=db&u='+wuserid+'&action='+waction+'';

		var people=[];
			people = DataVar.RecepientArray;
			people.forEach(function(item, index) {
				var li = document.createElement('li');
				li.innerHTML='<div class="p-2 rcard" id="rcard"><input class="form-control-alternative p-3 inputr" id="recepient-name" placeholder="'+people[index].name+'" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="recepient-email" placeholder="'+people[index].email+'" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="recepient-option" placeholder="'+people[index].option+'" type="text" disabled/><button class="buttonr delete">x</button></div>';
				$( "#sortable" ).append(li);
			
		});
		} catch (error) {
		
		}
	
		$( function() {
			$( "#sortable" ).sortable();
			$( "#sortable" ).disableSelection();
		  } );

		$( "#append-btn" ).click(function() {
			var recepientName = document.getElementById('recepient-input-name').value;
			var recepientEmail = document.getElementById('recepient-input-email').value;
			var recepientoptionselect = document.getElementById('recepientoptionselect');
			var recepientoption = recepientoptionselect.options[recepientoptionselect.selectedIndex].value;
			if(recepientName == '' || recepientEmail ==''){
				alert('Please enter all details.');
			}
			else{
				var li = document.createElement('li');
				li.innerHTML='<div class="p-2 rcard" id="rcard"><input class="form-control-alternative p-3 inputr" id="recepient-name" placeholder="'+recepientName+'" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="recepient-email" placeholder="'+recepientEmail+'" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="recepient-option" placeholder="'+recepientoption+'" type="text" disabled/><button class="buttonr delete">x</button></div>';
				$( "#sortable" ).append(li);
				document.getElementById('recepient-input-name').value = '';
				document.getElementById('recepient-input-email').value = '';
			}
			
		});

		$(document).on('click','.delete', function() {
			$(this).parent().parent().remove();  
			console.log($(this).parent().children('#recepient-name').attr("placeholder"));  
		});

		
		Array.prototype.pushWithReplace = function(o,k){
		var fi = this.findIndex(f => f[k] === o[k]);
		fi != -1 ? this.splice(fi,1,o) : this.push(o);
		return this;
		};
		
		

		$( "#s-btn" ).click(function() {
			var people = [];
			var listItems = $("#sortable li");
			if(listItems.length == 0){
				alert('There are no recepeints, Please add recepients');
				DataVar.RecepientArray = people;
			}
			else{
				listItems.each(function(li) {
					var recepientN = $(this).children('#rcard').children('#recepient-name').attr("placeholder");
					var recepientE = $(this).children('#rcard').children('#recepient-email').attr("placeholder");
					var recepientO = $(this).children('#rcard').children('#recepient-option').attr("placeholder");
					people.pushWithReplace({name: recepientN, email: recepientE, option:recepientO}, "email");
					
				});
			if(wurl === ''){
				if (document.getElementById('signordercheck').checked) {
					DataVar.SignOrder = true;
					console.log(people);
					DataVar.RecepientArray = people;
					console.log(DataVar);
					var url = "#/admin/sign";
					window.location.hash = url;
				} else {
					DataVar.SignOrder = false;
					console.log(people);
					DataVar.RecepientArray = people;
					console.log(DataVar);
					var url = "#/admin/sign";
					window.location.hash = url;	
				}
				
			}
			else{
				if (document.getElementById('signordercheck').checked) {
					DataVar.SignOrder = true;
					console.log(people);
					DataVar.RecepientArray = people;
					console.log(DataVar);
					window.location.hash = wurl;
				} else {
					DataVar.SignOrder = false;
					console.log(people);
					DataVar.RecepientArray = people;
					console.log(DataVar);
					window.location.hash = wurl;
				}
					
			}
				
			}
			
		});





    }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <Container className="mt--9 pb-8">
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
                      <button type="button" className="btn btn-primary btn-circle-process">2</button>
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
          {/* Table */}
          <Row>
          
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Add Recepients</h3>
                </CardHeader>
               <CardBody>
			   <div >
  <div className="mb-4 mb-xl-0"><h5>Enter Recepients: </h5></div>
	<Row><Col lg="4"><FormGroup><Input className="form-control-alternative" id="recepient-input-name" placeholder="Name" type="text"/></FormGroup></Col>
		<Col lg="4">
		<FormGroup>
		<Input
			className="form-control-alternative"
			id="recepient-input-email"
			placeholder="Email Address"
			type="email"
		/>
		</FormGroup>
		</Col>
		<Col lg="4">
		<FormGroup>
		<select id="recepientoptionselect" className="form-control  form-control-md" >
			<option value="Needs to Sign">Needs to Sign</option>
			<option value="Needs to View">Needs to View</option>
			<option value="Recieves a Copy">Recieves a Copy</option>
		</select>
		</FormGroup>
		</Col>
		
		<Col lg="12">
		<div id="signordercheckdiv" className="custom-control custom-checkbox float-left mx-2 my-1">
		<input
		className="custom-control-input"
		id="signordercheck"
		type="checkbox"
		/>
		<label className="custom-control-label" htmlFor="signordercheck">
		Set signing order
		</label>
		</div>
		<Button id="s-btn" className="close-btn float-right m-2 px-5" > Next</Button>
		<Button id="append-btn" className="close-btn float-right m-2 px-5" > Add</Button>
		
		</Col>
		</Row>
		
	
	</div>
	<hr className="my-4" />
			   <div id="recepientdiv">
			   <ul id="sortable">
				

				</ul>
				</div>

			   </CardBody>
                
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Recepients;
