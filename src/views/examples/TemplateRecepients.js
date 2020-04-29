
import React from "react";
import classnames from "classnames";
import "./templaterecepients.css";
import $ from 'jquery';

import TemplateDataVar from '../../variables/templatedata';


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

class TemplateRecepients extends React.Component {
  
    
    componentDidMount(){
		$( function() {
			$( "#tsortable" ).sortable();
			$( "#tsortable" ).disableSelection();
		  } );

		$( "#tappend-btn" ).click(function() {
			var recepientName = document.getElementById('trecepient-input-name').value;
			var recepientEmail = document.getElementById('trecepient-input-email').value;
			var recepientoptionselect = document.getElementById('trecepientoptionselect');
			var recepientoption = recepientoptionselect.options[recepientoptionselect.selectedIndex].value;
			if(recepientName == '' || recepientEmail ==''){
				alert('Please enter all details.');
			}
			else{
				var li = document.createElement('li');
				li.innerHTML='<div class="p-2 rcard" id="trcard"><input class="form-control-alternative p-3 inputr" id="trecepient-name" placeholder="'+recepientName+'" type="text" disabled/><input class="form-control-alternative p-3 inputr" id="trecepient-email" placeholder="'+recepientEmail+'" type="email" disabled/><input class="form-control-alternative p-3 inputr" id="trecepient-option" placeholder="'+recepientoption+'" type="text" disabled/><button class="buttonr delete">x</button></div>';
				$( "#tsortable" ).append(li);
				document.getElementById('trecepient-input-name').value = '';
				document.getElementById('trecepient-input-email').value = '';
			}
			
		});

		$(document).on('click','.delete', function() {
			$(this).parent().parent().remove();  
			console.log($(this).parent().children('#trecepient-name').attr("placeholder"));  
		});

		
		Array.prototype.pushWithReplace = function(o,k){
		var fi = this.findIndex(f => f[k] === o[k]);
		fi != -1 ? this.splice(fi,1,o) : this.push(o);
		return this;
		};
		
		

		$( "#ts-btn" ).click(function() {
			var people = [];
			var listItems = $("#tsortable li");
			if(listItems.length == 0){
				alert('There are no recepeints, Please add some recepients');
				TemplateDataVar.TemplateRecepientArray = people;
			}
			else{
				listItems.each(function(li) {
					var recepientN = $(this).children('#trcard').children('#trecepient-name').attr("placeholder");
					var recepientE = $(this).children('#trcard').children('#trecepient-email').attr("placeholder");
					var recepientO = $(this).children('#trcard').children('#trecepient-option').attr("placeholder");
					people.pushWithReplace({name: recepientN, email: recepientE, option:recepientO}, "email");
					
				});
				console.log(people);
				TemplateDataVar.TemplateRecepientArray = people;
				console.log(TemplateDataVar);
				var url = "#/admin/templatecreate";
    			window.location.hash = url;
			}
			
		});





    }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <Container className="mt--7 pb-8">
          {/* Table */}
          <Row>
          
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Add PlaceHolder Recepients</h3>
                </CardHeader>
               <CardBody>
			   <div >
  <div className="mb-4 mb-xl-0"><h5>Enter Recepients: </h5></div>
	<Row><Col lg="4"><FormGroup><Input className="form-control-alternative" id="trecepient-input-name" placeholder="Name" type="text"/></FormGroup></Col>
		<Col lg="4">
		<FormGroup>
		<Input
			className="form-control-alternative"
			id="trecepient-input-email"
			placeholder="Email Address"
			type="email"
		/>
		</FormGroup>
		</Col>
		<Col lg="4">
		<FormGroup>
		<select id="trecepientoptionselect" className="form-control  form-control-md" >
			<option value="Needs to Sign">Needs to Sign</option>
			<option value="Needs to View">Needs to View</option>
			<option value="Recieves a Copy">Recieves a Copy</option>
		</select>
		</FormGroup>
		</Col>
		
		<Col lg="12">
		<Button id="ts-btn" className="close-btn float-right m-2 px-5" > Next</Button>
		<Button id="tappend-btn" className="close-btn float-right m-2 px-5" > Add</Button>
		
		</Col>
		</Row>
		
	
	</div>
	<hr className="my-4" />
			   <div id="trecepientdiv">
			   <ul id="tsortable">
				

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

export default TemplateRecepients;
