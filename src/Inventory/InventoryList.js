import React, { Component } from 'react';
import { StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Meteor from 'react-native-meteor';
import { colors } from '../../config/styles';
import { List, ListItem, Icon } from 'react-native-elements';

// what if we subscribe here?
class InventoryList extends Component {

	constructor(props) {
		super(props);

		Meteor.subscribe('inventories');

		this.state = {
			isLoading: false,
			id: this.props.navigation.state.params.listId,
			newItemInputVisible: false
		};

	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: navigation.state.params.name,
			headerStyle: {
				backgroundColor: colors.background,
			},
			headerTitleStyle: {
				color: colors.tint,
			}
		}
	}

	addNewInventory() {
		
		if (this.state.name.length === 0) {
			console.log('name cannot be empty') // eslint-disable-line
			this.setState({ newItemInputVisible: false });
			return
		}

		Meteor.call('inventories.insert', this.state.name, this.state.id, (err, newItemId) => {
			if (err) {
				console.log("Error caught: " + err.reason); // eslint-disable-line
			} else {

				/* kind of redundant. We can probably update the schema to remove `items` array 
				in the list document altogether in favor of an inventory item having a list id 
				that it belongs to. This will cause one minor issue in the main list view that 
				we won't be able to see the number of items in the list. One way is to just 
				update this to just keep track of number of inventories in the list by using a 
				Meteor method just to update the count. But I'm just going to leave this in 
				for now.
				*/
				Meteor.call('inventorylists.addItem', this.state.id, newItemId);
			}
		});

		this.setState({ newItemInputVisible: false });
		this.setState({ name: '' });
	}

	renderItem(item) {
		return (
			<ListItem
				key={item._id}
				title={item.name}
				hideChevron
			/>
		);
	}

	renderItems() {
		
		// find inventory items that belong to this list
		let inventories = Meteor.collection('inventories').find({ list: this.state.id });

		return (
			<ScrollView style={{ flex: 1 }}>
				<List>
					{inventories.map(item => this.renderItem(item))}
				</List>
			</ScrollView>
		);
	}

	renderAddButton() {
		return (
			<View style={styles.fab}>
				<Icon
					name='add'
					raised
					reverse
					color={colors.background}
					onPress={() => this.setState({ newItemInputVisible: true })}
				/>
			</View>
		);
	}

	renderNewItemTextInput() {
		return (
			<View style={styles.newItem}>
				<TextInput
					placeholder="Item name"
					returnKeyType='done'
					autoCapitalize='words'
					autoFocus
					onChangeText={(name) => this.setState({ name })}
					onSubmitEditing={() => this.addNewInventory()}
				/>
			</View>
		);
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				{this.state.newItemInputVisible ? this.renderNewItemTextInput() : null}
				{this.renderItems()}
				{this.renderAddButton()}
			</SafeAreaView>
		);
	}
}

export default InventoryList;

export const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		bottom: 24,
		right: 24,
	},
	newItem: {
		height: 40,
		padding: 4
	}
});