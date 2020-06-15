import classnames from 'classnames';
import React, { Fragment } from 'react';
// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	Col,
	Container,
	Nav,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
} from 'reactstrap';
import './signaturestles.css';

import SignManager from '../SignManager';
import { dataURLToBlob } from '../../utils/parser';
import { randomString } from '../../utils/random';

const axios = require('axios').default;

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showSignSettingModal: false,
			user: '',
		};
	}

	componentDidMount() {
		var modal = document.querySelectorAll('.modal');
		var signimg = document.getElementById('homeimgsign');
		var profileimg = document.getElementById('headerprofilepic');
		var signid = document.getElementById('homesignid');

		function getCookie(name) {
			var nameEQ = name + '=';
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0)
					return c.substring(nameEQ.length, c.length);
			}
			return null;
		}

		var userid = getCookie('uid');

		if (userid) {
			//console.log('user logged in');
			console.log(userid);
			var email = getCookie('useremail');

			try {
				axios
					.post('/api/getuserdata', {
						UserID: userid,
					})
					.then((response) => {
						console.log(response);
						this.setState({
							user: response.data.user,
						});
						if (response.data.Status === 'user found') {
							if (response.data.user.SignID != '') {
								signid.innerHTML = response.data.user.SignID;
								if (response.data.user.ProfileImage) {
									profileimg.setAttribute(
										'crossOrigin',
										'anonymous',
									);

									profileimg.src =
										response.data.user.ProfileImage;
								}
								if (response.data.user.SignImage) {
									signimg.setAttribute(
										'crossOrigin',
										'anonymous',
									);
									signimg.style.visibility = 'visible';
									signimg.src = response.data.user.SignImage;
								}
							} else {
								//modal[0].style.display = 'block'
								//SignaturePad()
								this.toggleSignSettingModal();
							}
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			} catch (error) {}
		} else {
			// no user
			//window.location.hash = "#/auth/login";
		}
	}

	toggleSignSettingModal = () => {
		const { showSignSettingModal } = this.state;
		this.setState({
			showSignSettingModal: !showSignSettingModal,
		});
	};

	onSave = async (result) => {
		const { user } = this.state;
		var signimg = document.getElementById('homeimgsign');
		var signid = document.getElementById('homesignid');

		if (result.signature) {
			// console.log("[signature]",result.signature)
			console.log(result.signature);

			var signidtext = randomString(20);
			signimg.setAttribute('crossOrigin', 'anonymous');
			signimg.style.visibility = 'visible';
			signimg.src = result.signature;
			signid.innerHTML = signidtext;

			axios
				.post('/api/signature', {
					SignID: signidtext,
					UserID: user.UserID,
					SignImage: result.signature,
					SignImageBox: result.signatureBox,
					Initials: result.initials,
					InitialsBox: result.initialsBox,
				})
				.then(function(response) {
					if (response.data === 'signed') {
						//modal[0].style.display = 'none'
						signimg.src = result.signature;
					}
				})
				.catch(function(error) {});
		}

		this.toggleSignSettingModal();
	};
	render() {
		const { showSignSettingModal } = this.state;
		return (
			<>
				<div
					className="header bg-gradient-warning pb-7 pt-7"
					style={{
						minHeight: '330px',
						backgroundSize: 'cover',
						backgroundPosition: 'center top',
					}}>
					<Container>
						<div className="header-body text-center my-md-5 my-2 mx-3">
							<Row className="justify-content-center">
								<Col
									lg="6"
									className="justify-content-left float-left"
									id="header-welcome-sign-container">
									<div
										className="card-profile-image-header justify-content-left float-left"
										id="card-profile-image-header">
										<a
											href="#pablo"
											id="profilepicbtn-header"
											onClick={(e) => e.preventDefault()}>
											<img
												alt="..."
												className="rounded-circle"
												id="headerprofilepic"
												src="./team-4-800x800.jpg"
											/>
										</a>
									</div>
									<a
										id="homesignimgbtn"
										onClick={() =>
											this.setState({
												showSignSettingModal: true,
											})
										}>
										<div className="float-center homesigncontainer">
											<span>Signed by:</span>
											<img
												crossOrigin="anonymous"
												id="homeimgsign"
												className="homesignimg"
											/>

											<p
												id="homesignid"
												className="float-left signid">
												WF2D2522ADBFD
											</p>
										</div>
									</a>
									<SignManager
										visible={showSignSettingModal}
										id="signmanager"
										onSave={this.onSave}
										onClose={this.toggleSignSettingModal}
									/>
								</Col>
								<Col
									lg="6"
									className="justify-content-right float-right"
									id="header-welcome-text">
									<div className="float-right">
										<h1 className="display-3 text-white float-right">
											Welcome!
										</h1>
										<p className="text-white mt-0 mb-4 ">
											Sign any document, Anywhere
										</p>
									</div>
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
