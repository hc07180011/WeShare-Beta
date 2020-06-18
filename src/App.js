import React from 'react';
import './App.css';

import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Welcome from './Welcome';
import Loading from './Loading';
import EventCode from './EventCode';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Tutorial from './Tutorial';
import Contribution from './Contribution';
import Upload from './Upload';
import Download from './Download';
import logo from './logo.png';

function Copyright() {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Copyright © '}
				2020 WeShare. All rights reserved.
		</Typography>
    )
}

class App extends React.Component {
	constructor() {
		super()
		try { this.state = JSON.parse(localStorage.getItem('localState')) } catch {}
		if (this.state === null) { this.state = ({ tabIndex: 'Welcome', codeErrorMes: '', navExpanded: false }) } 
	}
	componentDidUpdate = (_, __) => {
		localStorage.setItem('localState', JSON.stringify(this.state)) 
	}
	setNavExpanded = (status) => {
		if (status === false) this.setState({ navExpanded: false})
		else this.setState({ navExpanded: this.state.navExpanded ? false : true })
	}
	handleClick = (key) => {
		this.setState({ tabIndex: key })
		if (key !== 'Welcome' || this.state.navExpanded)
			this.setNavExpanded(false)
	}
	handleEventCode = (code) => {
		this.setState({ activateEventCode: code })
	}
	handleEventTitle = (title) => {
		this.setState({ activateEventTitle: title })
	}
	handleEventToken = (token) => {
		this.setState({ activateEventToken: token })
	}
	render() {
		
		let currentPage

		switch (this.state.tabIndex) {
			case 'Welcome':
				currentPage = <Welcome parent={this} />
				break
			case 'Sign Up':
				currentPage = <SignUp parent={this} />
				break
			case 'Sign In':
				currentPage = <SignIn parent={this} />
				break
			case 'Tutorial':
				currentPage = <Tutorial parent={this} />
				break
			case 'About Us':
				currentPage = <Contribution parent={this} />
				break
			case 'Teacher':
				currentPage = <Upload parent={this} />
				break
			case 'Student':
				currentPage = <Download parent={this} />
				break
			default:
				currentPage = <Loading />
		}

		return (
		<div>
			<Navbar bg='light' expand='lg' onToggle={() => this.setNavExpanded(true)} expanded={this.state.navExpanded} >
				<Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => this.handleClick('Welcome')}>
					<img src={logo} alt='logo' height='50px'></img>WeShare β
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav' >
					<Nav className='mr-auto'>
						<NavDropdown title='Instructor' id='basic-nav-dropdown'>
							<NavDropdown.Item onClick={() => this.handleClick('Sign Up')}>Sign Up</NavDropdown.Item>
							<NavDropdown.Item onClick={() => this.handleClick('Sign In')}>Sign In</NavDropdown.Item>
						</NavDropdown>
						<Nav.Link onClick={() => this.handleClick('Tutorial')}>Tutorial</Nav.Link>
						<Nav.Link onClick={() => this.handleClick('About Us')}>About Us</Nav.Link>
					</Nav>
					<EventCode parent={this} />
				</Navbar.Collapse>
			</Navbar>
			{currentPage}
			<Box mt={5}><Copyright /></Box>
		</div>
		)
	}
}

export default App;
