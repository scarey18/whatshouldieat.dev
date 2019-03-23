import React from 'react';


class FlexibleImg extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			style: {width: '10px'},
			render: false,
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

		const style = widthRatio < heightRatio ?
			{width: '100%'} :
			{height: '100%'};

		this.setState({style, render: true});
	};

	render() {
		const visibility = this.state.render ? 'visible' : 'hidden';
		const style = {...this.state.style, visibility};

		return (
			<img 
				src={this.props.src}
				alt={this.props.alt}
				style={style}
				onLoad={this.startTimeout}
				ref={ref => this.img = ref}
			></img>
		)
	}
}


export default FlexibleImg;