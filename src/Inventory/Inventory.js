import React, {Component} from 'react';
import Meteor from 'react-native-meteor';
import {colors, stylesheet} from '../../config/styles';
import {Alert, SafeAreaView, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {Dropdown} from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';

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

		const dropdown = this.props.screenProps.inventoryLists.map((list) => ({
			value: list._id,
			label: list.name
		}));

		this.state = {
			name,
			amount,
			isNew,
			dropdown,
			listId: props.navigation.state.params.listId,
			selectedList: props.navigation.state.params.listId,
		};

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
			// save button for editing?
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

		Meteor.call('inventories.update', this.props.navigation.state.params.id, this.state.name, this.state.selectedList,
			this.state.amount, (err) => {
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

	onChangeInventoryList(value) {
		this.setState({ selectedList: value });

		Meteor.call('inventorylists.moveItem', this.props.navigation.state.params.id, this.props.navigation.state.params.listId, value, (error) => {
			if (error) {
				return Alert.alert(
					'Error moving Inventory item',
					'Error moving Inventory item to new list',
					[
						{ text: "OK", style: 'normal' }
					],
					{ cancelable: true }
				);
			}
		});
	}

	render() {

		const invalidName = !this.state.name || this.state.name === '';

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={stylesheet.container}>
					<TextField
						label='Name'
						value={this.state.name}
						onChangeText={(name) => this.setState({ name, submitted: false })}
						returnKeyType='next'
						onSubmitEditing={() => {
							this.amountInput.focus()
						}}
						tintColor={colors.textFieldTint}
						error={this.state.submitted && invalidName
							? 'Name cannot be empty'
							: null}
						shake={invalidName}
						autoFocus
						autoCapitalize='words'
						blurOnSubmit={false} />
					
					<TextField
						label='Amount'
						ref={(input) => {
							this.amountInput = input;
						}}
						value={this.state.amount}
						onChangeText={(amount) => this.setState({ amount })}
						returnKeyType='done'
						onSubmitEditing={() => this.state.isNew
							? this.addInventory()
							: this.updateInventory()}
						tintColor={colors.textFieldTint} />

					{!this.state.isNew
						? <Dropdown
							label='Inventory List'
							data={this.state.dropdown}
							value={this.state.selectedList}
							onChangeText={(value) => this.onChangeInventoryList(value)} />
						: null}
				</View>
			</SafeAreaView>
		)
	}
}