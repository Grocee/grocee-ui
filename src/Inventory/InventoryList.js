import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Meteor from 'react-native-meteor';
import { colors } from '../../config/styles';
import { List, ListItem, Icon } from 'react-native-elements';

// what if we subscribe here?
class InventoryList extends Component {

	//TODO: dismisses the text field if tap anywhere outside the view

	constructor(props) {
		super(props);

		this.state = {
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

		Meteor.call('inventories.insert', this.state.name, (err, newItemId) => {
			
			if (err) {
				console.log("Error caught: " + err.reason); // eslint-disable-line
			}

			Meteor.call('inventorylists.addItem', this.props.navigation.state.params.id, newItemId);
		});

		this.setState({ newItemInputVisible: false, name: '' });
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
		
		let list = this.props.screenProps.inventoryLists.find(list => list._id === this.props.navigation.state.params.id);
		let inventories = this.props.screenProps.inventories.filter(inventory => list.items.includes(inventory._id));

		if (inventories.length > 0) {
			return (
				<ScrollView style={{ flex: 1 }}>
					<List>
						{inventories.map(item => this.renderItem(item))}
					</List>
				</ScrollView>
			);
		} else {
			return (
				<Text>You don't have any inventory items in this list yet.</Text>
			);
		}

	}

	renderAddButton() {
		return (
			<View style={styles.fab}>
				<Icon
					name='add'
					raised
					reverse
					color={colors.background}
					onPress={() => this.setState(prevState => ({ newItemInputVisible: !prevState.newItemInputVisible }))}
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
		backgroundColor: 'white',
		height: 40,
		padding: 4
	}
});