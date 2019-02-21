import React from 'react';
import styles from 'styles/FlexibleImg.module.scss';


class FlexibleImg extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			renderImg: false,
		}
	}

	styleImg = () => {
		this.className = this.img.naturalHeight > this.img.naturalWidth ? 
			styles.portrait : styles.landscape;
		this.setState({renderImg: true});
	};

	render() {
		const className = this.state.renderImg ? this.className : styles.hidden;

		return (
			<img 
				src={this.props.src}
				alt={this.props.alt}
				className={className}
				onLoad={this.styleImg}
				ref={img => this.img = img}
			></img>
		);
	}
}


export default FlexibleImg;