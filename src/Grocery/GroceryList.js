import React, { Component } from 'react';

import { colors, stylesheet } from '../../config/styles';

import { StyleSheet, View, ScrollView, FlatList, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon, ListItem, List, Button } from 'react-native-elements';
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
				<Button 
					title="Delete"
					onPress={() => {
						Meteor.call('grocerylists.remove', navigation.state.params.id, (err) => {
							if (err) {
								return Alert.alert(
									'Error removing Grocery List',
									err,
									[
										{ text: "OK", style: 'normal'}
									],
									{ cancelable: true }
								);
							}

							// Also need to delete all the grocery items in this grocery list
							this.state.groceries.forEach(grocery => {
								Meteor.call('groceries.remove', grocery._id);
							});
							
							navigation.goBack();
						});
					}}
					backgroundColor={colors.background}/>
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
					onPress={() => navigation.navigate('Grocery', { listId: navigation.state.params.id })}
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

			// TODO Put this in a better place
			this.setState({
				groceries
			});
		}

		if (groceries.length == 0) {
			return (
				<Text>You do not have any grocery items in this grocery list. Click the + button to add one!</Text>
			)
		}

		return (
			<List>
				<FlatList
					keyExtractor={(_item, index) => index}
					data={groceries}
					renderItem={(item) => this.renderItem(item)}/>
			</List>
		);
	}
    
	renderItem(item) {
		const navigation = this.props.navigation;
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
				type: 'secondary',
				onPress: () => navigation.navigate('Grocery', { listId: navigation.state.params.id, id: item.item._id })
			},
			{
				text: (<Icon 
					name='delete'
					color={colors.tint}
					size={24}
					underlayColor='transparent'
				/>),
				backgroundColor: 'red',
				underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
				type: 'secondary',
				onPress: () => Meteor.call('groceries.remove', item.item._id)
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
		];
		
		const onPress = () => navigation.navigate('Grocery', { listId: navigation.state.params.id, id: item.item._id });
		
		const title = item.item.amount ? `${item.item.amount} ${item.item.name}` : `${item.item.name}`;
		return (
			<Swipeout right={rightButtons} left={leftButtons} autoClose='true' backgroundColor='white'>
				<ListItem title={title} onPress={onPress} hideChevron/>
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