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
		textAlign: "center"
	}
}))

export default function Contribution() {

	const classes = useStyles()

	return (
		<div className={classes.container} >
			<Row className={classes.col} >
				<Col>
					<h3>A chrome extension<br/>that makes sharing easier.</h3>
				</Col>
			</Row>
			<Row className={classes.col} >
				<Col><h4>Developers</h4></Col>
			</Row>
			<Row className={classes.col} >
				<Col>
					<p>
						b06902001 陳義榮<br/>
						b06902017 趙允祥<br/>
						b06902024 黃秉迦<br/>
						b06902029 裴梧鈞<br/>
						b06902057 薛佳哲<br/>
						b06902106 宋岩叡
					</p>
				</Col>
			</Row>
		</div>
	)
}
