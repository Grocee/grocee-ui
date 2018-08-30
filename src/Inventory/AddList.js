import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { SafeAreaView, Alert } from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

export default class AddInventoryList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			name: '',
			submitted: false,
		}
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'New Inventory List',
			headerLeft: (
				<Button
					title="Cancel"
					onPress={() => navigation.goBack()}
					backgroundColor={colors.background}/>
			)
		}
	}

	createList() {

		this.setState({ submitted: true });

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

	render() {
		const invalidName = !this.state.name || this.state.name === '';

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<FormLabel>Name</FormLabel>
				<FormInput
					style={stylesheet.input}
					onChangeText={(name) => this.setState({ name, submitted: false })}
					autoFocus
					value={this.state.name}
					placeholder='Add new inventory list'
					autoCapitalize='words'
					returnKeyType='done'
					onSubmitEditing={() => this.createList()} />
				{invalidName && this.state.submitted
					? <FormValidationMessage>Name cannot be empty</FormValidationMessage>
					: null}
			</SafeAreaView>
		)
	}
}