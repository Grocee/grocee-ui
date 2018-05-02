import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, ScrollView, ActionSheetIOS, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Meteor from 'react-native-meteor';
import { colors } from '../../config/styles';
import { List, ListItem, Icon } from 'react-native-elements';
import { Swipeout } from 'react-native-swipeout';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

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
		const params = navigation.state.params || {};

		return {
			headerTitle: navigation.state.params.name,
			headerStyle: {
				backgroundColor: colors.background,
			},
			headerTitleStyle: {
				color: colors.tint,
			},
			headerRight: (
				<View style={styles.rightButton} >
					<Icon 
						name='more-horiz'
						color={colors.tint}
						size={24}
						underlayColor='transparent'
						onPress={params.showActionSheet}
						containerStyle={styles.rightButton}
					/>
				</View>
			)
		}
	}

	componentWillMount() {
		this.props.navigation.setParams({ showActionSheet: this.showActionSheet });
	}

	showActionSheet() {
		ActionSheetIOS.showActionSheetWithOptions({
			options: ['Cancel', 'Delete List'],
			destructiveButtonIndex: 1,
			cancelButtonIndex: 0,
		},
		(buttonIndex) => {
			if (buttonIndex === 1) {
				Alert.alert(
					'Confirm Delete',
					'Are you are sure you want to delete this list? All the items in this list will also be deleted.',
					[
						{ text: 'Cancel', onPress: () => console.log('cancel pressed'), style: 'cancel'},
						{ text: 'Confirm', onPress: () => console.log('Confirm pressed'), style: 'destructive' },
					],
					{ cancelable: false }
				)
			}
		});
	}

	deleteList() {
		console.log('Deleting this list!');

		// TODO: perform actual deletion

		this.props.navigation.goBack();
	}

	closeRow(rowMap, rowKey) {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	}

	deleteItem(item) {

		Meteor.call('inventories.remove', item._id, (err) => {
			if (err) {
				Alert.alert(
					"Error Deleting Item",
					err.error,
					[
						{ text: "OK", style: 'normal' }
					],
					{ cancelable: true }
				);
			} else {
				Meteor.call('inventorylists.removeItem', this.props.navigation.state.params.id, item._id);
			}
		});

	}

	addNewInventory() {
		
		if (this.state.name.length === 0) {
			console.log('name cannot be empty') // eslint-disable-line
			this.setState({ newItemInputVisible: false });
			return
		}

		Meteor.call('inventories.insert', this.state.name, (err, newItemId) => {
			
			if (err) {
				Alert.alert(
					"Error Creating Item",
					err.error,
					[
						{ text: "OK", style: 'normal'}
					],
					{ cancelable: true }
				);
			}

			Meteor.call('inventorylists.addItem', this.props.navigation.state.params.id, newItemId);
		});

		this.setState({ newItemInputVisible: false, name: '' });
	}

	renderItem(item) {
		return (
			<SwipeRow rightOpenValue={-75} disableRightSwipe >
				<View style={styles.standaloneRowBack} >
					<Text style={styles.backTextWhite}></Text>
					<TouchableOpacity onPress={() => this.deleteItem(item)} >
						<Text style={styles.backTextWhite}>Delete</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.standaloneRowFront}>
					<Text>{item.name}</Text>
				</View>
			</SwipeRow>
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
				<Text>There are no inventory items in this list.</Text>
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

		var buttons = [
			{
				text: 'Delete'
				//,backgroundColor: 'red'
			}
		];

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
	},
	rightButton: {
		padding: 5
	},
	standaloneRowFront: {
		backgroundColor: 'white',
		justifyContent: 'center',
		padding: 10,
		height: 45,
		borderWidth: 0.3,
		borderColor: '#3c3c3c'
	},
	standaloneRowBack: {
		alignItems: 'center',
		backgroundColor: 'red',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15
	},
	backTextWhite: {
		color: '#FFF'
	},
});