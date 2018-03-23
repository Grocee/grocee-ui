import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
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

export const styles = StyleSheet.create({
	groceryInput: {
		height: 50,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC',
	},
	groceryContainer: {
		flex: 1,
	},
	separator: {
		height: 1,
		backgroundColor: '#dddddd'
	},
	title: {
		fontSize: 20,
		color: '#656565'
	},
	rowContainer: {
		flexDirection: 'row',
		padding: 10
	},
});