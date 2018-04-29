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
		
		this.state = {
			isLoading: false,
			id: this.props.navigation.state.params.listId,
			inventories: this.props.screenProps.inventories,
			items: this.props.navigation.state.params.items || [],
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

	_updateList(newItem) {
		//this.setState((prevState) => ({ inventories: prevState.inventories.push(newItem) }));
		//this.setState({ items: this.state.items.push(newItem._id) })
		this.state.inventories.push(newItem);
		console.log(this.state);
	}

	_addNewInventory() {
		
		if (this.state.name.length === 0) {
			console.log('name cannot be empty') // eslint-disable-line
			this.setState({ newItemInputVisible: false });
			return
		}

		Meteor.call('inventories.insert', this.state.name, (err, item) => {
			if (err) {
				console.log("Error caught: " + err.reason); // eslint-disable-line
			} else {
				console.log(item);
				Meteor.call('inventorylists.addItem', this.state.id, item._id);
				this._updateList(item);
				// this.state.items.push(itemId);
				// console.log(this.state)
				// change this to return the newly created item and then we can use this to add to the list of items, but how do we refresh inside the completion handler?
			}
		});

		this.setState({ newItemInputVisible: false });
		this.setState({ name: '' });
	}

	_renderItem(item) {
		return (
			<ListItem
				key={item._id}
				title={item.name}
				hideChevron
			/>
		);
	}

	_renderItems() {
		let items = this.state.inventories.filter(inventory => this.state.items.includes(inventory._id));

		return (
			<ScrollView style={{ flex: 1 }}>
				<List>
					{items.map(item => this._renderItem(item))}
				</List>
			</ScrollView>
		);
	}

	_renderAddButton() {
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

	_renderNewItemTextInput() {
		return (
			<View style={styles.newItem}>
				<TextInput
					placeholder="Item name"
					returnKeyType='done'
					autoCapitalize='words'
					autoFocus
					onChangeText={(name) => this.setState({ name })}
					onSubmitEditing={() => this._addNewInventory()}
				/>
			</View>
		);
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				{this.state.newItemInputVisible ? this._renderNewItemTextInput() : null}
				{this._renderItems()}
				{this._renderAddButton()}
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