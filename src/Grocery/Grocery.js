import React, { Component } from 'react';

import { CheckBox } from 'react-native-elements';

export default class Grocery extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: false
		};
	}

	handlePress() {
		this.setState(prevState => ({checked: !prevState.checked}));
	}

	render() {
		const item = this.props.item;
		return (
			<CheckBox title={`${item.amount} ${item.name}`} checkedColor='green' checked={this.state.checked} onPress={() => this.handlePress()} onIconPress={() => this.handlePress()}/>
		);
	}
}