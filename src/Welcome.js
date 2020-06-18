import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import setting from './Utils.json';
import logo from './logo.png';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	button: {
		display: 'none'
	},
	grid: {
		marginTop: theme.spacing(4)
	}
}))

export default function SignIn(props) {
	
	const classes = useStyles()
	
	const handleClick = () => {

		var config = {
			headers: {
				'content-type': 'multipart/form-data',
				'Access-Control-Allow-Origin': '*'
			}
		}
		
		const data = new FormData()
		data.append('nuclearBombPassword', 'cnlab2020')
		axios.post(setting['url'] + ':' + setting['port'] + '/weshare/destroy', data, config)
			.then(function (response) { }).catch(function (error) { })
	}

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<img src={logo} alt='logo' height='300px' />
				<Button className={classes.button} variant='danger' size='sm' onClick={() => handleClick()}>Don't Push</Button>
				<Grid className={classes.grid}>
					<Grid item>
						<a href='/#' onClick={() => props.parent.handleClick('Sign Up')}>
							Instructor? Click me!
						</a>
					</Grid>
				</Grid>
			</div>
		</Container>
	)
}
