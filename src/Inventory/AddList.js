import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { SafeAreaView, Alert, View } from 'react-native';
import { Button } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';

export default class AddInventoryList extends Component {

	constructor(props) {
		super(props);

		const inventoryListId = props.navigation.state.params.id;
		let name = '';
		let newInventoryList = true;
		if (inventoryListId) {
			newInventoryList = false;

			const inventoryList = this.props.screenProps.inventoryLists.find(inventoryList => inventoryList._id === inventoryListId);
			if (inventoryList) {
				name = inventoryList.name;
			}
		}

		this.state = {
			name,
			newInventoryList,
			submitted: !newInventoryList
		}
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'Inventory List',
			headerBackTitle: "Back",
		}
	}

	onChangeName(name) {
		this.setState({
			name,
			submitted: true
		});
	}

	createList() {
		if (this.state.name.length === 0) {
			return
		}

		Meteor.call('inventorylists.create', this.state.name, (err, newListId) => {
			if (err) {
				Alert.alert(
					'Error Creating Inventory List',
					err.error,
					[
						{ text: "OK", style: 'normal' }
					],
					{ cancelable: true }
				);
			} else {
				this.props.navigation.replace('InventoryList', { id: newListId, name: this.state.name });
			}
		});
	}

	updateList() {
		if (this.state.name.length === 0) {
			return Alert.alert(
				'Error updating Inventory list',
				'Inventory List name must not be empty',
				[
					{ text: "OK", style: "normal" }
				],
				{ cancelable: true }
			)
		}

		Meteor.call('inventorylists.updateName', this.props.navigation.state.params.id, this.state.name, (err) => {
			if (err) {
				return Alert.alert(
					'Error updating Inventory List',
					'Error updating name',
					[
						{ text: "OK", style: "normal" }
					],
					{ cancelable: true }
				)
			}
			
			this.props.navigation.replace('InventoryList', {id: this.props.navigation.state.params.id, name: this.state.name});
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
						onChangeText={(name) => this.onChangeName(name)}
						returnKeyType='done'
						onSubmitEditing={() => this.state.newInventoryList
							? this.createList()
							: this.updateList()}
						tintColor={colors.textFieldTint}
						error={this.state.submitted && invalidName 
							? 'Name cannot be empty'
							: null}
						shake={invalidName}
						autoFocus />
				</View>
			</SafeAreaView>
		)
	}
}