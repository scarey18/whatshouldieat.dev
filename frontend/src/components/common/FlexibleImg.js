import React from 'react';
import styles from 'styles/FlexibleImg.module.scss';
import elementResizeDetectorMaker from 'element-resize-detector';


class FlexibleImg extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			className: styles.hidden,
		}
		if (!window.erd) {
			window.erd = elementResizeDetectorMaker({strategy: 'scroll'});
		}
	}

	componentWillUnmount() {
		clearTimeout(this.initialTimeout);
		window.removeEventListener('resize', this.styleImg);
		window.erd.removeListener(this.parent, this.styleImg);
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
		window.erd.listenTo(this.parent, this.styleImg);
	};

	styleImg = () => {
		const parentRect = this.parent.getBoundingClientRect();
		const imgRect = this.img.getBoundingClientRect();
		const widthRatio = parentRect.width / imgRect.width;
		const heightRatio = parentRect.height / imgRect.height;
		const className = widthRatio < heightRatio ? styles.landscape : styles.portrait;
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