import React, { Component } from 'react';

import { colors, stylesheet } from '../../config/styles';

import { StyleSheet, View, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon, ListItem, List } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

import Meteor from 'react-native-meteor';


export default class GroceryList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			name: '',
			amount: '',
			isLoading: false,
			searchNeedle: '',
			displayChecked: false
		};
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: navigation.state.params.name,
			headerBackTitle: "Back",
			headerRight: (
				<View style={stylesheet.rightButton}>
					<Icon 
						name='add'
						color={colors.tint}
						size={24}
						underlayColor='transparent'
						onPress={() => navigation.navigate('AddGrocery', { listId: navigation.state.params.id })}
						containerStyle={stylesheet.rightButton}
					/>
				</View>
			)
		}
	}
    
	renderAddButton() {
		const navigation = this.props.navigation;
		return (
			<View style={stylesheet.fab}>
				<Icon
					name='add'
					raised
					reverse
					color={colors.background}
					onPress={() => navigation.navigate('AddGrocery', { listId: navigation.state.params.id })}
				/>
			</View>
		);
	}

	renderGroceries() {
		// Filter based on search results
		const groceryList = this.props.screenProps.groceryLists.find(list => list._id === this.props.navigation.state.params.id);
		let groceries = [];
		if ( groceryList ) {
			groceries = this.props.screenProps.groceries.filter(grocery => {
				if (groceryList.items && groceryList.items.includes(grocery._id)) {
					if (this.state.searchNeedle !== '') {
						return grocery.name.indexOf(this.state.searchNeedle) >= 0;
					} else {
						return true;
					}
				} else {
					return false;
				}
			});
	
			// Filter based on setChecked
			if ( !this.state.displayChecked ) {
				groceries = groceries.filter(grocery => !grocery.checked);
			}
		}

		return (
			<List>
				<FlatList
					keyExtractor={(_item, index) => index}
					data={groceries}
					renderItem={this.renderItem}/>
			</List>
		);
	}
    
	renderItem(item) {
		const rightButtons = [
			{
				text: (<Icon 
					name='edit'
					color={colors.tint}
					size={24}
					underlayColor='transparent'
				/>),
				backgroundColor: 'orange',
				underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
				type: 'secondary'
				// onPress: () => add grocery stack
			}
		];

		const leftButtons = [
			{
				text: (<Icon 
					name='check'
					color={colors.tint}
					size={24}
					underlayColor='transparent'
				/>),
				backgroundColor: 'green',
				underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
				onPress: () => Meteor.call('groceries.setChecked', item.item._id, true)
			}
		]
		
		return (
			<Swipeout right={rightButtons} left={leftButtons} autoClose='true' backgroundColor='white'>
				<ListItem title={item.item.name} hideChevron/>
			</Swipeout>
		);
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView style={{ flex: 1 }}>
					{this.renderGroceries()}
				</ScrollView>
				{this.renderAddButton()}
			</SafeAreaView>
		);
	}
}