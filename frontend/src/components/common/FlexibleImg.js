import React from 'react';


class FlexibleImg extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			style: {width: 1, height: 1},
		}
	}

	componentDidUpdate(prevProps) {
		const triggersLength = this.props.restyleTriggers ? 
			this.props.restyleTriggers.length : 0;
			
		for (let i = 0; i < triggersLength; i++) {
			const triggerBool = this.props.restyleTriggers[i][0];
			if (triggerBool !== prevProps.restyleTriggers[i][0]) {
				const timer = this.props.restyleTriggers[i][1];
				this.setState({style: {width: 1, height: 1}});
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
		const imgWidth = this.img.naturalWidth;
		const imgHeight = this.img.naturalHeight;
		const aspectRatio = imgWidth / imgHeight;
		const widthRatio = parentRect.width / imgWidth;
		const heightRatio = parentRect.height / imgHeight;

		if (widthRatio <= heightRatio) {
			this.setState({style: {
				width: parentRect.width,
				height: parentRect.width / aspectRatio,
			}})
		} else {
			this.setState({style: {
				height: parentRect.height,
				width: parentRect.height * aspectRatio,
			}})
		}
	};

	render() {
		return (
			<img 
				src={this.props.src}
				alt={this.props.alt}
				style={this.state.style}
				onLoad={this.onLoad}
				ref={ref => this.img = ref}
			></img>
		)
	}
}


export default FlexibleImg;