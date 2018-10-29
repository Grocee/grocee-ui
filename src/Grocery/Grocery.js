import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { SafeAreaView, Alert, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';

export default class Grocery extends Component {
	
	constructor(props) {
		super(props);
		
		const groceryId = props.navigation.state.params.id;
		let name = '';
		let amount = '';
		let newGrocery = true;
		if (groceryId) {
			newGrocery = false;

			const grocery = this.props.screenProps.groceries.find(grocery => grocery._id === groceryId);
			if (grocery) {
				name = grocery.name;
				amount = grocery.amount;
			}
		}

		const groceryListsDropdown = this.props.screenProps.groceryLists.map((list) => ({
			value: list._id,
			label: list.name
		}));

		this.state = {
			listId: props.navigation.state.params.listId,
			name,
			showError: !newGrocery,
			amount,
			newGrocery,
			groceryListsDropdown,
			selectedGroceryList: props.navigation.state.params.listId
		};
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'Grocery',
			headerLeft: (
				<View style={stylesheet.leftButton}>
					<Icon 
						name='chevron-left'
						color={colors.tint}
						size={24}
						underlayColor='transparent'
						onPress={() => navigation.goBack()}
						containerStyle={stylesheet.leftButton} />
				</View>
			),
			headerRight: (
				<Button 
					title="Delete"
					onPress={() => {
						Meteor.call('groceries.archive', navigation.state.params.id, true, (err) => {
							if (err) {
								return Alert.alert(
									'Error removing Grocery item from grocery list',
									err,
									[
										{ text: "OK", style: 'normal'}
									],
									{ cancelable: true }
								);
							}

							// Remove the archived grocery item from the grocery list
							Meteor.call('grocerylists.removeItem', navigation.state.params.listId, navigation.state.params.id, (err) => {
								if (err) {
									return Alert.alert(
										'Error removing grocery item from grocery list',
										err,
										[
											{ text: "OK", style: 'normal' }
										],
										{ cancelable: true }
									);
								}

								navigation.goBack();
							});
						});
					}}
					backgroundColor={colors.background}/>
			)
		};
	}
    
	addGrocery() {
		if (this.state.name.length === 0) {
			return Alert.alert(
				'Error updating Grocery item',
				'Grocery name must not be empty',
				[
					{ text: "OK", style: 'normal'}
				],
				{ cancelable: true }
			);
		}

		const amount = this.state.amount.trim().length > 0 
			? this.state.amount 
			: null;
		Meteor.call('groceries.insert', this.state.name, amount, (err, groceryId) => {
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
			return Alert.alert(
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
				return Alert.alert(
					'Error updating Grocery item',
					'Error updating name',
					[
						{ text: "OK", style: 'normal'}
					],
					{ cancelable: true }
				);
			}

			if (this.state.amount != null) {
				Meteor.call('groceries.updateAmount', this.props.navigation.state.params.id, this.state.amount, (amountErr) => {
					if (amountErr) {
						return Alert.alert(
							'Error updating Grocery item',
							'Error updating amount',
							[
								{ text: "OK", style: 'normal'}
							],
							{ cancelable: true }
						);
					}

					this.props.navigation.goBack();
				});
			}
		});
	}

	onChangeName(name) {
		this.setState({
			name,
			showError: true
		});
	}

	onChangeGroceryList(value) {
		this.setState({
			selectedGroceryList: value
		});

		Meteor.call('grocerylists.moveItem', this.props.navigation.state.params.id, this.props.navigation.state.params.listId, value, (moveGroceryErr) => {
			if (moveGroceryErr) {
				return Alert.alert(
					'Error moving Grocery item',
					'Error moving Grocery item to new list',
					[
						{ text: "OK", style: 'normal' }
					],
					{ cancelable: true }
				);
			}
		});
	}

	render() {
		const invalidName = !this.state.name || this.state.name == "";
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={stylesheet.container}>
					<TextField
						label='Name'
						value={this.state.name}
						onChangeText={(name) => this.onChangeName(name)}
						autoCapitalize='words'
						returnKeyType='next'
						tintColor={colors.textFieldTint}
						onSubmitEditing={() => {
							this.amountInput.focus()
						}}
						error={this.state.showError && invalidName 
							? 'Name cannot be empty'
							: null}
						shake={invalidName} />

					<TextField 
						label='Amount'
						ref={(input) => {
							this.amountInput = input;
						}}
						value={this.state.amount}
						onChangeText={(amount) => this.setState({ amount })}
						returnKeyType='done'
						tintColor={colors.textFieldTint}
						onSubmitEditing={() => this.state.newGrocery
							? this.addGrocery()
							: this.updateGrocery()} />

					{this.state.newGrocery 
						? null 
						: <Dropdown
							value={this.state.selectedGroceryList}
							label='Grocery List'
							data={this.state.groceryListsDropdown}
							onChangeText={(value) => this.onChangeGroceryList(value)}
							disabled={this.state.newGrocery} />}
				</View>
			</SafeAreaView>
		);
	}
}
