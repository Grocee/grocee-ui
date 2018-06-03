import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ListView, View, Text, TextInput, ScrollView, ActionSheetIOS, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Meteor from 'react-native-meteor';
import { colors, stylesheet } from '../../config/styles';
import { List, ListItem, Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';

class InventoryList extends Component {

	//TODO: dismisses the text field if tap anywhere outside the view

	constructor(props) {
		super(props);
		this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
				<View style={stylesheet.rightButton} >
					<Icon 
						name='more-horiz'
						color={colors.tint}
						size={24}
						underlayColor='transparent'
						onPress={params.showActionSheet}
						containerStyle={stylesheet.rightButton}
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

	deleteItem(item, rowMap, rowKey) {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}

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

	renderItems() {
		
		let list = this.props.screenProps.inventoryLists.find(list => list._id === this.props.navigation.state.params.id);
		let inventories = this.props.screenProps.inventories.filter(inventory => list.items.includes(inventory._id));

		//TODO: convert SwipeListView to use the new FlatList version

		if (inventories.length > 0) {
			return (
				<ScrollView style={{ flex: 1 }}>
					<SwipeListView
						dataSource={this.dataSource.cloneWithRows(inventories)}
						renderRow={ data => (
							<View style={stylesheet.standaloneRowFront}>
								<Text>{data.name}</Text>
							</View>
						)}
						renderHiddenRow={ (data, secId, rowId, rowMap) => (
							<View style={stylesheet.standaloneRowBack} >
								<Text style={stylesheet.backTextWhite}></Text>
								<TouchableOpacity onPress={() => this.deleteItem(data, rowMap, `${secId}${rowId}`)} >
									<Text style={stylesheet.backTextWhite}>Delete</Text>
								</TouchableOpacity>
							</View>
						)}
						disableRightSwipe
						rightOpenValue={-75}
					/>
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
			<View style={stylesheet.fab}>
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
			<View style={stylesheet.newItem}>
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