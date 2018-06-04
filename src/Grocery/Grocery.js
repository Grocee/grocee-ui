import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { TextInput, SafeAreaView, Alert, Text } from 'react-native';
import { Button } from 'react-native-elements';

export default class Grocery extends Component {
	
	constructor(props) {
		super(props);
		
		const groceryId = props.navigation.state.params.id;
		let name = '';
		let amount = null;
		let newGrocery = true;
		if (groceryId) {
			newGrocery = false;

			const grocery = this.props.screenProps.groceries.find(grocery => grocery._id === groceryId);
			if (grocery) {
				name = grocery.name;
				amount = grocery.amount;
			}
		}
		this.state = {
			listId: props.navigation.state.params.listId,
			name,
			amount,
			newGrocery
		}
	}
    
	addGrocery() {
		if (this.state.name.length === 0) {
			Alert.alert(
				'Error updating Grocery item',
				'Grocery name must not be empty',
				[
					{ text: "OK", style: 'normal'}
				],
				{ cancelable: true }
			);
		}

		Meteor.call('groceries.insert', this.state.name, this.state.amount, (err, groceryId) => {
			if (err) {
				Alert.alert(
					'Error creating Grocery item',
					err.error,
					[
						{ text: "OK", style: 'normal' }
					],
					{ cancelable: true }
				);
				return;
			}

			Meteor.call('grocerylists.addItem', this.state.listId, groceryId);
			this.props.navigation.goBack();
		});
	}

	updateGrocery() {
		if (this.state.name.length === 0) {
			Alert.alert(
				'Error updating Grocery item',
				'Grocery name must not be empty',
				[
					{ text: "OK", style: 'normal'}
				],
				{ cancelable: true }
			);
		}

		Meteor.call('groceries.updateName', this.props.navigation.state.params.id, this.state.name, (nameErr) => {
			if (nameErr) {
				// TODO
				return;
			}

			if (this.state.amount) {
				Meteor.call('groceries.updateAmount', this.props.navigation.state.params.id, this.state.amount, (amountErr) => {
					if (amountErr) {
						// TODO
						return;
					}
				});
			}

			this.props.navigation.goBack();
		});
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'Grocery',
			headerLeft: (
				<Button 
					title="Cancel"
					onPress={() => navigation.goBack()}
					backgroundColor={colors.background}/>
			)
		}
	}

	render() {
		// TODO make the text input look nicer
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<TextInput
					style={stylesheet.input}					
					onChangeText={(name) => this.setState({ name })}
					value={this.state.name}
					placeholder='Add new grocery item'
					autoCapitalize='words'
					returnKeyType='next' />
				<TextInput
					style={stylesheet.input}
					onChangeText={(amount) => this.setState({ amount })}
					value={this.state.amount}
					placeholder='Add new grocery amount'
					returnKeyType='done'
					onSubmitEditing={() => this.state.newGrocery 
						? this.addGrocery() 
						: this.updateGrocery()}/>
			</SafeAreaView>
		)
	}
}