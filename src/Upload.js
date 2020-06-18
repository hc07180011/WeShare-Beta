import React, {useState, useRef} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Alert } from 'react-bootstrap';
import { Row, Col } from 'reactstrap';
import Button from 'react-bootstrap/Button';
import TextField from '@material-ui/core/TextField';
import copy from 'copy-to-clipboard';
import axios from 'axios';

import Refresh from './Refresh';
import Loading from './Loading';
import setting from './Utils.json';

function formatBytes(bytes, decimals=4) {
	if (bytes === 0) return '0 Byte'
	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function transType(type) {
	if (type === 'image/png') return 'image'
	else return 'file'
}

const useStyles = makeStyles((theme) => ({
	upload: {
		marginLeft: '5%',
		marginRight: '5%',
		marginTop: '30px'
	},
	block: {
		fontSize: '28px',
		color: 'black',
		textAlign: 'center',
	},
	button: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end' 
	},
	alert: {
		marginTop: '30px'
	}
}))

export default function Upload(props) {

	const classes = useStyles()
	const input = useRef()

	const [state, setState] = useState({
		isLoading: false,
		showUpload: true,
		files: [],
		uploadedFiles: [],
		errorMes: '',
		successMes: '',
		buttonMes: setting['mes']['upload'][0]
	})

	let eventCode = props.parent.state.activateEventCode
	let eventTitle = props.parent.state.activateEventTitle
	let eventToken = props.parent.state.activateEventToken

	const copyToken = (text) => {
		copy(text)
		setState({
			isLoading: state.isLoading,
			showUpload: state.showUpload,
			files: state.files,
			uploadedFiles: state.uploadedFiles,
			errorMes: state.errorMes,
			successMes: state.successMes,
			buttonMes: setting['mes']['upload'][1]
		})
	}

	const handleChange = (event) => {
		setState({
			isLoading: state.isLoading,
			showUpload: state.showUpload,
			files: event.target.files,
			uploadedFiles: state.uploadedFiles,
			errorMes: '',
			successMes: '',
			buttonMes: state.buttonMes
		})
	}
	
	const handleRefresh = () => {
	
		var config = {
			headers: {
				'content-type': 'multipart/form-data',
				'Access-Control-Allow-Origin': '*'
			}
		}

		const data = new FormData()
		data.append('eventCode', eventCode)
		axios.post(setting['url'] + ':' + setting['port'] + setting['flask']['download'], data, config)
			.then(function (response) {
				const checkLength = (state.uploadedFiles.length === 63)
				setState({
					isLoading: state.isLoading,
					showUpload: checkLength ? false : state.showUpload,
					files: state.files,
					uploadedFiles: response.data['posts'],
					errorMes: checkLength ? setting['mes']['upload'][2] : state.errorMes,
					successMes: checkLength ? '' : state.successMes,
					buttonMes: state.buttonMes
				})

			})
			.catch(function (error) { })
	}


	const handleSubmit = (action) => {

		const checkInput = (state.files[0] === undefined && (input.current === undefined || input.current.value === '')) 

		setState({
			isLoading: checkInput ? state.isLoading : true,
			showUpload: state.showUpload,
			files: state.files,
			uploadedFiles: state.uploadedFiles,
			errorMes: (checkInput && action !== 2) ? setting['mes']['upload'][3] : state.errorMes,
			successMes: '',
			buttonMes: state.buttonMes
		})

		if (checkInput) {
			if (action === 2) {
				handleRefresh()
				return true
			}
			return false
		}

		var config = {
			headers: {
				'content-type': 'multipart/form-data',
				'Access-Control-Allow-Origin': '*'
			}
		}

		const data = new FormData()
		if (input.current === undefined || input.current.value === '') {
			data.append('eventToken', eventToken)
			data.append('postType', transType(state.files[0]))
			data.append('postFile', state.files[0]);

		}
		else {
			data.append('eventToken', eventToken)
			data.append('postType', 'text')
			data.append('postContent', input.current.value);
		}
		axios.post(setting['url'] + ':' + setting['port'] + setting['flask']['upload'], data, config)
			.then(function (response) {
				handleRefresh()
				const checkValid = (response.data['valid'] === 'True')
				setState({
					isLoading: false,
					showUpload: state.showUpload,
					files: checkValid ? [] : state.files,
					uploadedFiles: state.uploadedFiles,
					errorMes: checkValid ? state.successMes : setting['mes']['upload'][4],
					successMes: checkValid ? setting['mes']['upload'][5] : state.errorMes,
					buttonMes: state.buttonMes
				})
			})
			.catch(function (error) {
				setState({
					isLoading: false,
					showUpload: state.showUpload,
					files: state.files,
					uploadedFiles: state.uploadedFiles,
					errorMes: setting['mes']['upload'][6],
					successMes: state.successMes,
					buttonMes: state.buttonMes
				})
			})
	}

	return (
		<div className={classes.upload} >
			<Row className='show-grid' float='center'>
				<Col className={classes.block} xs={12}>
					{eventTitle} - {eventCode}
				</Col>
			</Row>
			<Row className={classes.button} >
				<Button className='float-right' variant='secondary' size='sm' onClick={() => copyToken(eventToken)}>
					{state.buttonMes}
				</Button>
			</Row>
			<Alert className={classes.alert} variant='dark'>
				{state.isLoading ?
				<Loading /> : 
				state.showUpload ? 
				<div className='input-group mb-3'>
					<TextField
						fullWidth
						margin='normal'
						placeholder={setting['mes']['upload'][7]}
						label={setting['mes']['upload'][7]}
						inputRef={input}
					/>
					<div className='custom-file'>
						<input type='file' className='custom-file-input'
							accept='*' id='inputGroupFile01' onChange={(e) => handleChange(e)} />
						<label className='custom-file-label' htmlFor='inputGroupFile01' data-browse='' >Or choose a File</label>
					</div>
					&nbsp;
					<div>
						<Button variant='info' onClick={() => handleSubmit(0)}>Upload</Button>
					</div> 
				</div> :
				<div></div>
				}
				<p style={{ color: 'red' }}>{state.errorMes}</p>
				<p style={{ color: 'green' }}>{state.successMes}</p>
				{state.files && [...state.files].map( (f) => (
					<div>
						<hr />
						<Row>
							<Col>
								<img width='100px' alt='file' src={URL.createObjectURL(f)} />
							</Col>
							<Col>
								<p><br/>Size: {formatBytes(f.size)}</p>
							</Col>
							<Col>
								<p><br/>Type: {f.type}</p>
							</Col>
						</Row>
					</div>
				))
				}
			</Alert>
			<Refresh uploadedFiles={state.uploadedFiles} isLoading={state.isLoading} handleSubmit={handleSubmit} />
		</div>
	)

}
