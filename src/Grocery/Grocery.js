import React, { Component } from 'react';
import { CheckBox } from 'react-native-elements';

import Meteor from 'react-native-meteor';

export default class Grocery extends Component {
	constructor(props) {
		super(props);
	}

	handlePress() {
		let checked = !this.props.item.checked;
		Meteor.call('groceries.setChecked', this.props.item._id, checked);
	}

	render() {
		const item = this.props.item;
		return (
			<CheckBox 
				title={`${item.amount} ${item.name}`}
				checkedColor='green'
				checked={item.checked}
				onPress={() => this.handlePress()}
				onIconPress={() => this.handlePress()}/>
		);
	}
}