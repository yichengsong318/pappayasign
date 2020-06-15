import AuthFooter from 'components/Footers/AuthFooter.js';
// core components
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
// reactstrap components
import { Container } from 'reactstrap';
import routes from 'routes.js';

class Admin extends React.Component {
	componentDidUpdate(e) {
		document.documentElement.scrollTop = 0;
		document.scrollingElement.scrollTop = 0;
		this.refs.mainContent.scrollTop = 0;
	}
	getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (prop.layout === '/admin') {
				return (
					<Route
						path={prop.layout + prop.path}
						component={prop.component}
						key={key}
					/>
				);
			} else {
				return null;
			}
		});
	};
	getBrandText = (path) => {
		for (let i = 0; i < routes.length; i++) {
			if (
				this.props.location.pathname.indexOf(
					routes[i].layout + routes[i].path,
				) !== -1
			) {
				return routes[i].name;
			}
		}
		return 'Brand';
	};
	render() {
		return (
			<>
				<div className="main-content" ref="mainContent">
					<AdminNavbar
						{...this.props}
						brandText={this.getBrandText(
							this.props.location.pathname,
						)}
					/>
					<Switch>
						{this.getRoutes(routes)}
						<Redirect from="*" to="/admin/index" />
					</Switch>
					<Container fluid>
						<AuthFooter />
					</Container>
				</div>
			</>
		);
	}
}

export default Admin;
