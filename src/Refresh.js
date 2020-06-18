import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Row, Col } from 'reactstrap';
import Button from 'react-bootstrap/Button';

import Loading from './Loading';
import setting from './Utils.json';

const useStyles = makeStyles((theme) => ({
	container: {
		width: '95%',
		float: 'none',
		margin: '0 auto'
	},
	button: {
		marginTop: '30px'
	},
	headerL: {
		textAlign: 'left',
		color: 'gray'
	},
	headerR: {
		textAlign: 'right',
		color: 'gray'
	},
	content: {
		overflow: 'auto',
		marginLeft: '20px',
		marginRight: '20px',
		marginTop: '10px'
	}
}))

export default function Refresh(props) {

	const classes = useStyles()

	const toUrl = (content) => {
		var urlRegex = /(https:\/\/|http:\/\/)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi
		return content.replace(urlRegex, function(url) {
			return '<a target="_blank" rel="noopener noreferrer" href="' + 
				(!url.match(/^[a-zA-Z]+:\/\//) ? 'http://' + url : url) + '">' + url + '</a>'
		})
	}

	let uploadedFiles = props.uploadedFiles
	let isLoading = props.isLoading
	let handleSubmit = props.handleSubmit

	return (
		<div className={classes.container} >
			{uploadedFiles && [...uploadedFiles].reverse().map( (f, num) => (
				<div key={'files' + num}>
					<hr />
					<Row>
						<Col className={classes.headerL} >
							{num + 1}
						</Col>
						<Col className={classes.headerR} >
							{f.timestamp.substring(11, 100)}
						</Col>
					</Row>
					<Row>
						<Col className={classes.content} >
							{f.type !== 'text' ?
							<a href={setting['url'] + ':' + setting['port'] + '/' + f.filepath} download={f.filename} >{f.filename}</a> :
							<p dangerouslySetInnerHTML={{__html: toUrl(f.content)}} />
							}
						</Col>
					</Row>
				</div>
				))
			}
			{isLoading ?
			<Loading /> :
			<Button className={classes.button} onClick={() => handleSubmit(2)}>{setting['mes']['refresh'][0]}</Button>
			}
		</div>
	)
}
