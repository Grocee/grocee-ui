import React, { Component } from 'react';
import Meteor from 'react-native-meteor';
import { colors, stylesheet } from '../../config/styles';
import { TextInput, SafeAreaView, Alert, Text, View } from 'react-native';
import {Button, FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';

export default class Inventory extends Component {
	
	constructor(props) {
		super(props);
		
		const id = props.navigation.state.params.id;
		let name = '';
		let amount = null;
		let isNew = true;

		if (id) {

			isNew = false;

			const item = this.props.screenProps.inventories.find(item => item._id === id);

			if (item) {
				name = item.name;
				amount = item.amount;
			}
		}

		this.state = { name, amount, isNew }
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'Inventory',
			headerStyle: {
				backgroundColor: colors.background,
			},
			headerTitleStyle: {
				color: colors.tint,
			},
			headerLeft: (
				<Button 
					title='Cancel'
					onPress={() => navigation.goBack()}
					backgroundColor={colors.background}
				/>
			)
		}
	}

	addInventory() {
		this.setState({ submitted: true });

		if (this.state.name.length === 0) {
			return
		}

		Meteor.call('inventories.insert', this.state.name, this.state.amount, this.props.navigation.state.params.listId,
			(err) => {
				if (err) {
					Alert.alert(
						"Error Creating Item",
						err.error,
						[
							{ text: "OK", style: 'normal'}
						],
						{ cancelable: true }
					);
				}

				this.props.navigation.goBack();
			})
	}

	updateInventory() {
		this.setState({ submitted: true });

		if (this.state.name.length === 0) {
			return;
		}

		Meteor.call('inventories.update', this.props.navigation.state.params.id, this.state.name, this.state.amount, (err) => {
			if (err) {
				Alert.alert(
					"Error Updating Item",
					err.reason,
					[
						{ text: "OK", style: 'normal' }
					],
					{ cancelable: true }
				);
				return;
			}

			this.props.navigation.goBack();
		});
	}

	render() {

		const invalidName = !this.state.name || this.state.name === '';

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<FormLabel>Name</FormLabel>
				<FormInput
					style={stylesheet.input}
					onChangeText={(name) => this.setState({ name, submitted: false })}
					value={this.state.name}
					autoFocus
					autoCapitalize='words'
					returnKeyType='next'
					onSubmitEditing={() => {
						this.amountInput.focus()
					}}
					blurOnSubmit={false}
				/>
				{invalidName && this.state.submitted
					? <FormValidationMessage>Name cannot be empty</FormValidationMessage>
					: null}
				<FormLabel>Amount</FormLabel>
				<FormInput
					style={stylesheet.input}
					ref={(input) => {
						this.amountInput = input;
					}}
					onChangeText={(amount) => this.setState({ amount })}
					value={this.state.amount}
					placeholder='Amount'
					returnKeyType='done'
					onSubmitEditing={() => this.state.isNew
						? this.addInventory()
						: this.updateInventory()
					}
				/>
			</SafeAreaView>
		)
	}
}