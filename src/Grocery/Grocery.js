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
		
		if ( checked ) {
			Meteor.call('inventories.insert', this.props.item.name);
		}
	}

	render() {
		const item = this.props.item;
		const title = item.amount 
			? `${item.amount} ${item.name}`
			: `${item.name}`;
		return (
			<CheckBox 
				title={title}
				checkedColor='green'
				checked={item.checked}
				onPress={() => this.handlePress()}
				onIconPress={() => this.handlePress()}/>
		);
	}
}