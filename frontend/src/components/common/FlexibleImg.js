import React from 'react';
import styles from 'styles/FlexibleImg.module.scss';


class FlexibleImg extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			className: styles.hidden,
		}
	}

	componentDidUpdate(prevProps) {
		const triggersLength = this.props.restyleTriggers ? 
			this.props.restyleTriggers.length : 0;
			
		for (let i = 0; i < triggersLength; i++) {
			const triggerBool = this.props.restyleTriggers[i][0];
			if (triggerBool !== prevProps.restyleTriggers[i][0]) {
				const timer = this.props.restyleTriggers[i][1];
				this.setState({className: styles.hidden});
				this.restyleTimeout = setTimeout(this.styleImg, timer);
				break;
			}
		}
	}

	componentWillUnmount() {
		clearTimeout(this.initialTimeout);
		clearTimeout(this.restyleTimeout);
		window.removeEventListener('resize', this.styleImg);
	}

	onLoad = () => {
		this.parent = this.img.parentElement;
		for (let i = 0; i < this.props.parentDepth - 1; i++) {
			this.parent = this.parent.parentElement;
		}

		if (this.props.delay) {
			this.initialTimeout = setTimeout(this.styleImg, this.props.delay);
		} else {
			this.styleImg();
		}

		window.addEventListener('resize', this.styleImg);
	};

	styleImg = () => {
		const parentRect = this.parent.getBoundingClientRect();
		const imgRect = this.img.getBoundingClientRect();
		const widthRatio = parentRect.width / imgRect.width;
		const heightRatio = parentRect.height / imgRect.height;
		const className = widthRatio < heightRatio ? styles.landscape : styles.portrait;

		if (this.props.fitParentToImg && className === styles.landscape) {
			this.img.parentElement.style.height = 'auto';
			this.img.parentElement.style.width = null;
		} else if (this.props.fitParentToImg) {
			this.img.parentElement.style.width = 'auto';
			this.img.parentElement.style.height = null;
		}

		if (className !== this.state.className) {
			this.setState({className});
		}
	};

	render() {
		return (
			<img 
				src={this.props.src}
				alt={this.props.alt}
				className={this.state.className}
				onLoad={this.onLoad}
				ref={ref => this.img = ref}
			></img>
		)
	}
}


export default FlexibleImg;