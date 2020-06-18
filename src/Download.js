import React, {useState}  from 'react';

import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import Refresh from './Refresh';
import setting from './Utils.json';

const useStyles = makeStyles((theme) => ({
	div: {
		textAlign: 'center'
	},
	text: {
		fontSize: '28px',
		color: 'balck',
		textAlign: 'center',
		paddingTop: '10px'
	},
	err: {
		color: 'red'
	}
}))

export default function Download(props) {

	const classes = useStyles()

	const [state, setState] = useState({
		isLoading: false,
		files: [],
		errorMes: ''
	})

	let eventCode = props.parent.state.activateEventCode
	let eventTitle = props.parent.state.activateEventTitle
	
	const handleRefresh = () => {

		setState({
			isLoading: true,
			files: [],
			errorMes: ''
		})
		
		var config = {
			headers: {
				'content-type': 'multipart/form-data',
				'Access-Control-Allow-Origin': '*'
			}
		}

		const data = new FormData()
		data.append('eventCode', eventCode)
		axios.post(setting["url"] + ":" + setting["port"] + setting['flask']['download'], data, config)
			.then(function (response) {
				setState({
					isLoading: false,
					files: response.data['posts'],
					errorMes: response.data['posts'].length === 0 ? setting['mes']['download'][0] : ''
				})
			})
			.catch(function (error) {
				setState({
					isLoading: false,
					files: [],
					errorMes: setting['mes']['download'][1]
				})
			})
	}

	return (
		<div className={classes.div} >
			<p className={classes.text} > Welcome to: {eventTitle}</p>
			<p className={classes.err} >{state.errorMes}</p>
			<Refresh uploadedFiles={state.files} isLoading={state.isLoading} handleSubmit={handleRefresh} />
		</div>
	)
}

