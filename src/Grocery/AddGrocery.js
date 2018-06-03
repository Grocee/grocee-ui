import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { TextInput, SafeAreaView, Alert } from 'react-native';
import { Button } from 'react-native-elements';

export default class AddGrocery extends Component {
	
	constructor(props) {
		super(props);
		
		// TODO allow users to add an amount as well
		this.state = {
			name: ''
		}
	}
    
	addGrocery() {
		if (this.state.name.length === 0) {
			return
		}

		Meteor.call('groceries.insert', this.state.name, null, (err, groceryId) => {
			if (err) {
				Alert.alert(
					'Error creating Grocery item',
					err.error,
					[
						{ text: "OK", style: 'normal' }
					],
					{ cancelable: true }
				);
			} else {
				Meteor.call('grocerylists.addItem', this.props.navigation.state.params.listId, groceryId);
				this.props.navigation.goBack();
			}
		});
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'New Grocery Item',
			headerLeft: (
				<Button 
					title="Cancel"
					onPress={() => navigation.goBack()}
					backgroundColor={colors.background}/>
			)
		}
	}

	render() {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<TextInput
					style={stylesheet.input}					
					onChangeText={(name) => this.setState({ name })}
					value={this.state.name}
					placeholder='Add new grocery item'
					autoCapitalize='words'
					returnKeyType='done'
					onSubmitEditing={() => this.addGrocery()} />
			</SafeAreaView>
		)
	}
}