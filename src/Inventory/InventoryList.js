import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Meteor from 'react-native-meteor';
import { colors, stylesheet, editButton, deleteButton } from '../../config/styles';
import {List, ListItem, Icon, Card, Button} from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import EditButton from '../components/EditButton';
import DeleteButton from '../components/DeleteButton';

class InventoryList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			newItemInputVisible: false
		};

	}

	static navigationOptions({ navigation }) {
		const params = navigation.state.params || {};

		return {
			headerTitle: params.name,
			headerBackTitle: "Back",
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

	renderItem(inventories) {
		const listId = this.props.navigation.state.params.id;
		const rightButtons = [
			{
				text: (<EditButton/>),
				backgroundColor: editButton.backgroundColor,
				underlayColor: editButton.underlayColor,
				type: editButton.type,
				onPress: () => this.props.navigation.navigate('InventoryEdit', { listId: listId, id: inventories.item._id })
			},
			{
				text: (<DeleteButton/>),
				backgroundColor: deleteButton.backgroundColor,
				underlayColor: deleteButton.underlayColor,
				type: deleteButton.type,
				onPress: () => 	Meteor.call('inventories.archive', inventories.item._id, (err) => {
					if (err) {
						Alert.alert(
							"Error Archiving Item",
							err.reason,
							[
								{ text: "OK", style: 'normal' }
							],
							{ cancelable: true }
						);
					}
				})
			}
		];

		const onPress = () => this.props.navigation.navigate('InventoryEdit', { listId: listId, id: inventories.item._id });

		return (
			<Swipeout right={rightButtons} autoClose='true' backgroundColor='white'>
				<ListItem
					title={inventories.item.name}
					subtitle={inventories.item.amount}
					onPress={onPress}
					hideChevron />
			</Swipeout>
		);
	}

	renderItems() {
		
		let list = this.props.screenProps.inventoryLists.find(list => list._id === this.props.navigation.state.params.id);
		let inventories = [];
		if (list && list.items) {
			inventories = this.props.screenProps.inventories.filter(inventory => list.items.includes(inventory._id) && !inventory.archived);
		}

		if (inventories.length > 0) {
			return (
				<List>
					<FlatList
						keyExtractor={(_item, index) => index}
						data={inventories}
						renderItem={(inventories) => this.renderItem(inventories)}
					/>
				</List>
			);
		} else {
			return (
				<Card>
					<Text style={{textAlign: 'center'}}>
						There are no inventory items in this list. Tap the + button to add one!
					</Text>
				</Card>
			);
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
					onPress={() => navigation.navigate('InventoryEdit', { listId: navigation.state.params.id })}
				/>
			</View>
		);
	}


	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView style={{ flex: 1 }}>
					{this.renderItems()}
				</ScrollView>
				{this.renderAddButton()}
			</SafeAreaView>
		);
	}
}

export default InventoryList;