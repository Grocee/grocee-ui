import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { Alert, SafeAreaView, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';

export default class AddGroceryList extends Component {
	
	constructor(props) {
		super(props);
		
		const groceryListId = props.navigation.state.params.id;
		let name = '';
		let newGroceryList = true;
		if (groceryListId) {
			newGroceryList = false;

			const groceryList = this.props.screenProps.groceryLists.find(groceryList => groceryList._id === groceryListId);
			if (groceryList) {
				name = groceryList.name;
			}
		}

		this.state = {
			name,
			newGroceryList,
			showError: !newGroceryList
		};
	}

	static navigationOptions({ navigation, screenProps }) {
		let name = 'New Grocery List';
		let groceryItems = [];
		const groceryList = screenProps.groceryLists.find(groceryList => groceryList._id === navigation.state.params.id);
		if (groceryList) {
			name = groceryList.name;
			groceryItems = groceryList.items;
		}
		return {
			headerTitle: name,
			headerBackTitle: "Back",
			headerRight: (
				<Button 
					title="Delete"
					onPress={() => {
						Meteor.call('grocerylists.archive', navigation.state.params.id, (err) => {
							if (err) {
								Alert.alert(
									'Error deleting Grocery List',
									err.error,
									[
										{ text: "OK", style: 'normal' }
									],
									{ cancelable: true }
								);
							}

							groceryItems.forEach(item => {
								Meteor.call('groceries.archive', item);
							});

							navigation.popToTop();
						});
					}}
					backgroundColor={colors.background}/>
			)
		}
	}

	onChangeName(name) {
		this.setState({
			name,
			showError: true
		});
	}
    
	createList() {
		if (this.state.name.length === 0) {
			return
		}

		Meteor.call('grocerylists.create', this.state.name, (err, groceryListId) => {
			if (err) {
				Alert.alert(
					'Error creating Grocery List',
					err.error,
					[
						{ text: "OK", style: 'normal' }
					],
					{ cancelable: true }
				);
			} else {
				this.props.navigation.replace('GroceryList', {id: groceryListId, name: this.state.name});
			}
		});
	}

	updateList() {
		if (this.state.name.length === 0) {
			return Alert.alert(
				'Error updating Grocery list',
				'Grocery List name must not be empty',
				[
					{ text: "OK", style: "normal" }
				],
				{ cancelable: true }
			)
		}

		Meteor.call('grocerylists.updateName', this.props.navigation.state.params.id, this.state.name, (err) => {
			if (err) {
				return Alert.alert(
					'Error updating Grocery List',
					'Error updating name',
					[
						{ text: "OK", style: "normal" }
					],
					{ cancelable: true }
				);
			}

			this.props.navigation.replace('GroceryList', {id: this.props.navigation.state.params.id, name: this.state.name});
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
						returnKeyType='done'
						onSubmitEditing={() => this.state.newGroceryList
							? this.createList()
							: this.updateList()}
						tintColor={colors.textFieldTint}
						error={this.state.showError && invalidName 
							? 'Name cannot be empty'
							: null}
						shake={invalidName}
						autoFocus />
				</View>
			</SafeAreaView>
		)
	}
}