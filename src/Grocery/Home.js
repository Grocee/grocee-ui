import React, { Component } from 'react';

import { colors, stylesheet } from '../../config/styles';

import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { List, ListItem, Icon, Card } from 'react-native-elements';

export default class Home extends Component {
	
	constructor(props) {
		super(props);
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
						onPress={() => navigation.navigate('AddList', {})}
						containerStyle={stylesheet.rightButton}
					/>
				</View>
			)
		};
	}
    
	renderListItem(list) {
		const groceries = this.props.screenProps.groceries;

		// Only include grocery items that are not checked in the badge count
		let badgeValue = 0;
		if ( list.items ) {
			badgeValue = list.items.filter(item => {
				const grocery = groceries.find(grocery => grocery._id == item);
				return grocery 
					? !grocery.checked
					: false;
			}).length;
		}
		const badge = badgeValue > 0 
			? { value: badgeValue, containerStyle: stylesheet.badge } 
			: null;
            
		return (
			<ListItem 
				key={list._id}
				title={list.name}
				badge={badge}
				onPress={() => this.props.navigation.navigate('GroceryList', {id: list._id, name: list.name})}/>
		)
	}
    
	renderLists() {
		let lists = this.props.screenProps.groceryLists;

		if ( lists.length > 0 ) {
			return (
				<List>
					{lists.map(list => this.renderListItem(list))}
				</List>
			);
		} else {
			// TODO make this look nicer
			return (
				<Card>
					<Text style={{textAlign: 'center'}}>
						You do not have any grocery lists. Tap the + button to create one!
					</Text>
				</Card>
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