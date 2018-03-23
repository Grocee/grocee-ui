import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

export default class AddGroceryList extends Component {
	
	constructor(props) {
		super(props);
	}

	render() {
		return (<Text>Add grocery list</Text>);
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