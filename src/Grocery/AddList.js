import React, { Component } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import Meteor from 'react-native-meteor';

import { Card } from 'react-native-elements';

export default class AddGroceryList extends Component {
	
	constructor(props) {
		super(props);
        
		this.state = {
			name: ''
		}
	}
    
	createList() {
		if (this.state.name.length === 0) {
			return
		}

		Meteor.call('grocerylists.create', this.state.name);
		this.props.navigation.replace('GroceryList', {listName: this.state.name});
	}

	render() {
		return (
			<Card title="Add new Grocery List">
				<TextInput
					style={styles.groceryInput}					
					onChangeText={(name) => this.setState({ name })}
					value={this.state.name}
					placeholder='Add new grocery list'
					autoCapitalize='words'
					returnKeyType='done'
					onSubmitEditing={() => this.createList()} />
			</Card>
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