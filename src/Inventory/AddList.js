import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { SafeAreaView, Alert, View } from 'react-native';
import { Button } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';

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
			headerBackTitle: "Back",
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
				<View style={stylesheet.container}>
					<TextField
						label='Name'
						value={this.state.name}
						onChangeText={(name) => this.setState({ name, submitted: false })}
						returnKeyType='done'
						onSubmitEditing={() => this.createList()}
						tintColor={colors.textFieldTint}
						error={this.state.submitted && invalidName 
							? 'Name cannot be empty'
							: null}
						shake={invalidName} />
				</View>
			</SafeAreaView>
		)
	}
}