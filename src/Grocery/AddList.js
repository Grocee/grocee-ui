import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { TextInput, SafeAreaView, Alert } from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

export default class AddGroceryList extends Component {
	
	constructor(props) {
		super(props);
        
		this.state = {
			name: ''
		}
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'New Grocery List',
			headerLeft: (
				<Button 
					title="Cancel"
					onPress={() => navigation.goBack()}
					backgroundColor={colors.background}/>
			)
		}
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
					placeholder='Add new grocery list'
					autoCapitalize='words'
					returnKeyType='done'
					onSubmitEditing={() => this.createList()} />
				{invalidName 
					? <FormValidationMessage>Name cannot be empty</FormValidationMessage> 
					: null}
			</SafeAreaView>
		)
	}
}