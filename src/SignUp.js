import React, {useRef, useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
		marginTop: theme.spacing(3)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}))

export default function SignUp(props) {
	
	const classes = useStyles()
	const input = useRef()

	const [state, setState] = useState({
		isCheck: false,
		ifError: false,
		isLoading: false,
		errorMes: ''
	})

	const handleSubmit = () => {

		let title = input.current.value

		props.parent.handleEventTitle(undefined)
		props.parent.handleEventCode(undefined)
		props.parent.handleEventToken(undefined)

		setState({ isLoading: true })
		
		if (title === '') {
			setState({
				ifError: true,
				isLoading: false,
				errorMes: setting['mes']['signUp'][0]
			})
			return false
		} 

		if (state.isCheck === false) {
			setState({
				ifError: true,
				isLoading: false,
				errorMes: setting['mes']['signUp'][1]
			})
			return false
		}

		var config = {
			headers: {
				'content-type': 'multipart/form-data',
				'Access-Control-Allow-Origin': '*'
			}
		}
		
		const data = new FormData();
		data.append('eventTitle', title); 
		axios.post(setting['url'] + ':' + setting['port'] + setting['flask']['signUp'], data, config, { timeout: 3 })
			.then(function (response) {
				props.parent.handleEventTitle(title)
				props.parent.handleEventCode(response.data['event_code'])
				props.parent.handleEventToken(response.data['event_token'])
				props.parent.handleClick('Teacher')
			})
			.catch(function (error) {
				setState({
					ifError: true,
					isLoading: false,
					errorMes: setting['mes']['signUp'][2]
				})
			})
	}

	const handleCheck = () => {
		setState({ isCheck: !state.isCheck })
	}

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign up
				</Typography>
				<div className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								variant='outlined'
								label={setting['mes']['signUp'][3]}
								error={state.ifError}
								helperText={state.errorMes}
								inputRef={input}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								control={<Checkbox color='primary' />}
								label={setting['mes']['signUp'][4]}
								onChange={() => handleCheck()}
							/>
						</Grid>
					</Grid>
					{ state.isLoading ?
					<Loading /> :  
					<Button
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}
						onClick={() => handleSubmit()}
					>
						Sign Up
					</Button>
					}
					<Grid container justify='flex-end'>
						<Grid item>
							<a href='/#' onClick={() => props.parent.handleClick('Sign In')}>
									{setting['mes']['signUp'][5]}
							</a>
						</Grid>
					</Grid>
				</div>
			</div>
		</Container>
	)
}
