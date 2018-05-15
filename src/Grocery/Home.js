import React, { Component } from 'react';

import { colors, stylesheet } from '../../config/styles';

import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { List, ListItem, Icon } from 'react-native-elements';

export default class Home extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			name: ''
		};
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'Groceries',
			headerBackTitle: "Back",
			headerRight: (
				<View style={stylesheet.rightButton}>
					<Icon 
						name='add'
						color={colors.tint}
						size={24}
						underlayColor='transparent'
						onPress={() => navigation.navigate('AddList')}
						containerStyle={stylesheet.rightButton}
					/>
				</View>
			)
		}
	}
    
	renderList(list) {
		return (
			<ListItem key={list._id} title={list.name} onPress={() => this.props.navigation.navigate('GroceryList', {listName: list.name})}/>
		)
	}
    
	renderLists() {
		let lists = this.props.screenProps.groceryLists;

		if ( lists.length > 0 ) {
			return (
				<List>
					{lists.map(list => this.renderList(list))}
				</List>
			);
		} else {
			// TODO make this look nicer
			return (
				<Text>You do not have any grocery lists. Click the top right icon to create one!</Text>
			);
		}
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView>
					{this.renderLists()}
				</ScrollView>
			</SafeAreaView>
		);
	}
}