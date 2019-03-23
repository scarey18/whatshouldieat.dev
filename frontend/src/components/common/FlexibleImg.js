import React from 'react';
import styles from 'styles/FlexibleImg.module.scss';


class FlexibleImg extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			className: styles.hidden,
		}
	}

	componentDidMount() {
		window.addEventListener('resize', this.styleImg);
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
		window.removeEventListener('resize', this.styleImg);
	}

	startTimeout = () => {
		if (this.props.delay) {
			this.timeout = setTimeout(this.styleImg, this.props.delay);
		} else {
			this.styleImg();
		}
	};

	styleImg = () => {
		let parent = this.img.parentElement;
		for (let i = 0; i < this.props.parentDepth - 1; i++) {
			parent = parent.parentElement;
		}

		const parentRect = parent.getBoundingClientRect();
		const imgRect = this.img.getBoundingClientRect();
		const widthRatio = parentRect.width / imgRect.width;
		const heightRatio = parentRect.height / imgRect.height;
		const className = widthRatio < heightRatio ? styles.landscape : styles.portrait;

		this.setState({className});
	};

	render() {
		return (
			<img 
				src={this.props.src}
				alt={this.props.alt}
				className={this.state.className}
				onLoad={this.startTimeout}
				ref={ref => this.img = ref}
			></img>
		)
	}
}


export default FlexibleImg;