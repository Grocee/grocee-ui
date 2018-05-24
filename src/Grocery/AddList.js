import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { TextInput, SafeAreaView } from 'react-native';
import { Button } from 'react-native-elements';

export default class AddGroceryList extends Component {
	
	constructor(props) {
		super(props);
        
		this.state = {
			name: ''
		}
	}
    
	createList() {
		if (this.state.name.length === 0) {
			return
		}

		Meteor.call('grocerylists.create', this.state.name, (err, groceryListId) => {
			if (err) {
				// TODO do something
			}

			this.props.navigation.replace('GroceryList', {id: groceryListId, name: this.state.name});
		});
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'New Grocery List',
			headerRight: (
				<Button 
					title='Done'
					onPress={() => this.createList()}
					backgroundColor={colors.background}/>
			),
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
					placeholder='Add new grocery list'
					autoCapitalize='words'
					returnKeyType='done'
					onSubmitEditing={() => this.createList()} />
			</SafeAreaView>
		)
	}
}