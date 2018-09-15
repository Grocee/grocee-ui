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

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'Grocery List',
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
					title="Delete" // use icon instead?
					onPress={() => {
						// todo

						navigation.goBack();
					}}
					backgroundColor={colors.background} />
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

			this.props.navigation.goBack();
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