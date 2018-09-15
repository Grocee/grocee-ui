import React, { Component } from 'react';

import { colors, stylesheet, editButton, deleteButton } from '../../config/styles';

import { StyleSheet, View, ScrollView, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon, ListItem, List, Button, Card } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import EditButton from '../components/EditButton';
import DeleteButton from '../components/DeleteButton';

import Meteor from 'react-native-meteor';

export default class GroceryList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			amount: '',
			isLoading: false,
			searchNeedle: '',
			displayChecked: false
		};
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: navigation.state.params.name,
			headerLeft: (
				<View style={stylesheet.leftButton}>
					<Icon 
						name='chevron-left'
						color={colors.tint}
						size={24}
						underlayColor='transparent'
						onPress={() => navigation.goBack()}
						containerStyle={stylesheet.leftButton} />
				</View>
			),
			headerRight: (
				<Button 
					title="Edit"
					onPress={() => {
						navigation.navigate('AddList', {id: navigation.state.params.id, name: navigation.state.params.name})
					}}
					backgroundColor={colors.background}/>
			)
		}
	}

	getGroceries() {
		let groceryList = this.props.screenProps.groceryLists.find(list => list._id === this.props.navigation.state.params.id);
		let groceries = [];
		if (groceryList && groceryList.items) {
			groceries = this.props.screenProps.groceries.filter(grocery => groceryList.items.includes(grocery._id));
		}
		if (!groceryList) {
			groceryList = {};
		}

		return { groceryList , groceries };
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
		const { groceries } = this.getGroceries();

		// Filter based on search results
		let filteredGroceries = groceries.filter(grocery => {
			if (this.state.searchNeedle !== '') {
				return grocery.name.indexOf(this.state.searchNeedle) >= 0;
			} else {
				return true;
			}
		});

		if (!this.state.displayChecked) {
			filteredGroceries = filteredGroceries.filter(grocery => !grocery.checked);
		}

		if (filteredGroceries.length == 0) {
			return (
				<Card>
					<Text style={{ textAlign: 'center' }}>
						You do not have any grocery items in this grocery list. Click the + button to add one!
					</Text>
				</Card>
			);
		}

		return (
			<List>
				<FlatList
					keyExtractor={(_item, index) => index}
					data={filteredGroceries}
					renderItem={(item) => this.renderItem(item)}/>
			</List>
		);
	}
    
	renderItem(item) {
		const navigation = this.props.navigation;
		const rightButtons = [
			{
				text: (<EditButton/>),
				backgroundColor: editButton.backgroundColor,
				underlayColor: editButton.underlayColor,
				type: editButton.type,
				onPress: () => navigation.navigate('Grocery', { listId: navigation.state.params.id, id: item.item._id })
			},
			{
				text: (<DeleteButton/>),
				backgroundColor: deleteButton.backgroundColor,
				underlayColor: deleteButton.underlayColor,
				type: deleteButton.type,
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
		
		const title = item.item.amount 
			? `${item.item.amount} ${item.item.name}`
			: `${item.item.name}`;
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