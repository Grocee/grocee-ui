import React, { Component } from 'react';
import Meteor from 'react-native-meteor';
import { colors, stylesheet } from '../../config/styles';
import { TextInput, SafeAreaView, Alert, Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';

export default class Inventory extends Component {
	
	constructor(props) {
		super(props);
		
		const id = props.navigation.state.params.id;
		let name = '';
		let amount = null;

		if (id) {

			const item = this.props.screenProps.inventories.find(item => item._id === id);

			if (item) {
				name = item.name;
				amount = item.amount;
			}
		}

		this.state = { name, amount }
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'Edit Item',
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

	updateInventory() {
		if (this.state.name.length === 0) {
			Alert.alert(
				'Error updating inventory item',
				'Name must not be empty',
				[
					{ text: "OK", style: 'normal'}
				],
				{ cancelable: true }
			);
			return;
		}

		Meteor.call('inventories.updateName', this.props.navigation.state.params.id, this.state.name, (err) => {
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

			Meteor.call('inventories.updateAmount', this.props.navigation.state.params.id, this.state.amount, (amountErr) => {
				if (amountErr) {
					Alert.alert(
						"Error Updating Item",
						amountErr.reason,
						[
							{ text: "OK", style: 'normal' }
						],
						{ cancelable: true }
					);
					return;
				}
			});
	

			this.props.navigation.goBack();
		});
	}

	render() {

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<TextInput
					style={stylesheet.input}
					onChangeText={(name) => this.setState({ name })}
					value={this.state.name}
					autoCapitalize='words'
					returnKeyType='next' />
				<TextInput
					style={stylesheet.input}
					onChangeText={(amount) => this.setState({ amount })}
					value={this.state.amount}
					placeholder='Amount'
					returnKeyType='done'
					onSubmitEditing={() => this.updateInventory()}/>
			</SafeAreaView>
		)
	}
}