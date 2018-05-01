import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors } from '../../config/styles';

import { TextInput, StyleSheet, SafeAreaView } from 'react-native';
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
				// TODO do something
			}

			Meteor.call('grocerylists.addItem', this.props.navigation.state.params.listId, groceryId);
			this.props.navigation.goBack();
		});
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'New Grocery Item',
			headerRight: (
				<Button 
					title='Done'
					onPress={() => this.addGrocery()}
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
					style={styles.groceryInput}					
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

export const styles = StyleSheet.create({
	groceryInput: {
		height: 50,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC',
	},
	groceryContainer: {
		flex: 1,
	},
	separator: {
		height: 1,
		backgroundColor: '#dddddd'
	},
	title: {
		fontSize: 20,
		color: '#656565'
	},
	rowContainer: {
		flexDirection: 'row',
		padding: 10
	},
});