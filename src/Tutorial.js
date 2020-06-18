import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Row, Col } from 'reactstrap';

const useStyles = makeStyles((theme) => ({
	container: {
		width: "90%",
		float: "none",
		margin: "0 auto"
	},
	col: {
		marginTop: "30px",
	}
}))

export default function Tutorial() {

	const classes = useStyles()

	return (
		<div className={classes.container} >
			<Col>
				<Row className={classes.col} >
					<h4>Instructors</h4>
				</Row>
				<Row className={classes.col} >
					<h6>1. Sign up</h6>
				</Row>
				<Row>
					<h6>2. Pass the event code to listeners</h6>
				</Row>
				<Row>
					<h6>3. Copy the event token to sign in again</h6>
				</Row>
				<Row>
					<h6>4. Start uploading files!</h6>
				</Row>
				<Row className={classes.col} >
					<h4>Audiences</h4>
				</Row>
				<Row className={classes.col} >
					<h6>1. Fill in the event code, click "Join Now"</h6>
				</Row>
				<Row>
					<h6>2. "Clik to Update"</h6>
				</Row>
				<Row>
					<h6>3. Start downloading files!</h6>
				</Row>
			</Col>
		</div>
	)
}
