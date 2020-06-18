import React, { useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Row, Col } from 'reactstrap';
import Button from 'react-bootstrap/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import setting from './Utils.json';

const useStyles = makeStyles((theme) => ({
	col: {
		textAlign: 'right'
	},
	button: {
		marginTop: '10px',
		marginRight: '20px'
	}
}))

export default function EventCode(props) {

	const classes = useStyles()
	const input = useRef()
	
	const [state, setState] = useState({
		codeErrorMes: '',
		ifError: false
	}) 

	const handleClick = () => {

		props.parent.handleClick('Loading')
		var config = {
			headers: {
				'content-type': 'multipart/form-data',
				'Access-Control-Allow-Origin': '*'
			}
		}

		const data = new FormData()
		data.append('eventCode', input.current.value)
		axios.post(setting['url'] + ':' + setting['port'] + setting['flask']['eventcode'], data, config)
			.then(function (response) {
				if (response.data['valid'] === 'True') {
					props.parent.handleEventCode(input.current.value)
					props.parent.handleEventTitle(response.data['event_title'])
					props.parent.handleClick('Student')
				}
				else {
					setState({
						codeErrorMes: setting['mes']['eventCode'][0],
						ifError: true
					})
					props.parent.handleClick('Welcome')
				}
			})
			.catch(function (error) {
				setState({
					codeErrorMes: setting['mes']['eventCode'][1],
					ifError: true
				})
				props.parent.handleClick('Welcome')
			})
	}

	const handleChange = () => {
		setState({
			codeErrorMes: '',
			ifError: false
		})
	}

	return (
		<div>
			<Row>
				<Col className={classes.col} >
					<TextField
						fullWidth
						margin='dense'
						variant='outlined'
						label={setting['mes']['eventCode'][2]}
						inputRef={input}
						error={state.ifError}
						helperText={state.codeErrorMes}
						onChange={() => handleChange()}
						onKeyDown={e => { if (e.keyCode === 13)  e.preventDefault() }}
					/>
				</Col>
				<Col xs={5} className={classes.col} >
					<Button
						className={classes.button}
						variant='outline-primary'
						onClick={() => handleClick()}
					>
					{setting['mes']['eventCode'][3]}
					</Button>
				</Col>
			</Row>
		</div>
	)
}

