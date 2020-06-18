import React, {useRef, useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from 'axios';

import Loading from './Loading';
import setting from './Utils.json';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}))

export default function SignIn(props) {

	const classes = useStyles()
	const input = useRef() 

	const [state, setState] = useState({
		ifError: false,
		isLoading: false,
		errorMes: ''
	})
	   
	const handleSubmit = () => {

		const token = input.current.value

		props.parent.handleEventTitle(undefined)
		props.parent.handleEventCode(undefined)
		props.parent.handleEventToken(undefined)

		if (token === '' || token.length !== 8) {
			setState({
				ifError: true,
				isLoading: false,
				errorMes: setting['mes']['signIn'][4]
			})
			return false
		}
		
		var config = {
			headers: {
				'content-type': 'multipart/form-data',
				'Access-Control-Allow-Origin': '*'
			}
		}

		setState({
			ifError: state.ifError,
			isLoading: true,
			errorMes: state.errorMes
		})

		const data = new FormData();
		data.append('eventToken', token); 
		axios.post(setting['url'] + ':' + setting['port'] + setting['flask']['signIn'], data, config)
			.then(function (response) {
				if (response.data['valid'] === 'True') {
					props.parent.handleEventCode(response.data['event_code'])
					props.parent.handleEventTitle(response.data['event_title'])
					props.parent.handleEventToken(token)
					props.parent.handleClick('Teacher')
				}
				else {
					setState({
						ifError: true,
						isLoading: false,
						errorMes: setting['mes']['signIn'][0]
					})
				}
			})
			.catch(function (error) {
				setState({
					ifError: true,
					isLoading: false,
					errorMes: setting['mes']['signIn'][1]
				})
			})
	}

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign in
				</Typography>
				<div className={classes.form} noValidate>
					<TextField
						variant='outlined'
						required
						fullWidth
						type='password'
						label={setting['mes']['signIn'][2]}
						error={state.ifError}
						helperText={state.errorMes}
						inputRef={input}
					/>
					{state.isLoading ?
					<Loading /> :
					<Button
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}
						onClick={() => handleSubmit()}
					>
						Sign In
					</Button>
					}
					<Grid container>
						<Grid item>
							<a href='/#' onClick={() => props.parent.handleClick('Sign Up')}>
									{setting['mes']['signIn'][3]}
							</a>
						</Grid>
					</Grid>
				</div>
			</div>
		</Container>
	)
}
