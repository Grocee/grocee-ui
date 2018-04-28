import React, { Component } from 'react';
import {
	StyleSheet,
	Image,
	View,
	TouchableHighlight,
	FlatList,
	Text,
	TextInput,
	Linking,
	ScrollView
} from 'react-native';
import { SafeAreaView, withNavigation } from 'react-navigation';
import Meteor, { createContainer } from 'react-native-meteor';
import { colors } from '../../config/styles';
import { List, ListItem, Card, Button, Icon } from 'react-native-elements';

// what if we subscribe here?
class InventoryList extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			name: '',
			amount: '',
			isLoading: false,
			id: this.props.navigation.state.params.listId,
			//inventories: this.props.screenProps.inventories,
			inventories: this.props.inventories,
			items: this.props.navigation.state.params.items,
			newItemInputVisible: false
		};

		//console.log(this.state);
	}

	_keyExtractor(item, index) {
		return index;
	}

	_addNewInventory() {
		
		if (this.state.name.length === 0) {
			console.log('name cannot be empty')
			this.state.newItemInputVisible = false;
			return
		}

		Meteor.call('inventories.insert', this.state.name, this.state.id, (err, itemId) => {
			if (err) {
				console.log("Error caught" + err);
			} else {
				Meteor.call('inventorylists.addItem', this.state.id, itemId);
			}
		});

		this.state.newItemInputVisible = false;
		this.state.name = '';
	}

	_filterItems() {
		console.log('test');
		let filtered = this.state.inventories.filter(function(inventory) {
			console.log(inventory._id);
			console.log(inventory.list);
			inventory.list === this.state.id
		});

		console.log(filtered);

		return filtered;
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
		let items = this.state.inventories || [];

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

const container = createContainer(() => {
	Meteor.subscribe('inventories');
	return { inventories: Meteor.collection('inventories').find() };
}, InventoryList);

container.navigationOptions = {
	headerTitle: "Inventory",
	headerStyle: {
		backgroundColor: colors.background,
	},
	headerTitleStyle: {
		color: colors.tint,
	}
}

export default container;

export const styles = StyleSheet.create({
	inventoryInput: {
		height: 50,
		//flexGrow: 1,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC',
	},
	inventoryContainer: {
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