import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { SafeAreaView, Alert, View } from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage, Icon } from 'react-native-elements';

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
			// TODO make the headerRight three dots dropdown/menu
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

			if (this.state.amount) {
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

	render() {
		const invalidName = !this.state.name || this.state.name == "";
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<FormLabel>Name</FormLabel>
				<FormInput
					style={stylesheet.input}					
					onChangeText={(name) => this.setState({ name })}
					shake={invalidName}
					value={this.state.name}
					placeholder='Add new grocery item'
					autoCapitalize='words'
					returnKeyType='next' />
				{invalidName 
					? <FormValidationMessage>Name cannot be empty</FormValidationMessage> 
					: null}
				<FormLabel>Amount</FormLabel>
				<FormInput
					style={stylesheet.input}
					onChangeText={(amount) => this.setState({ amount })}
					value={this.state.amount}
					placeholder='Add new grocery amount'
					returnKeyType='done'
					onSubmitEditing={() => this.state.newGrocery 
						? this.addGrocery() 
						: this.updateGrocery()}/>
			</SafeAreaView>
		);
	}
}