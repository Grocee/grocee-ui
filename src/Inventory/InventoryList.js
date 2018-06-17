import React, { Component } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ListView, View, Text, TextInput, ScrollView, ActionSheetIOS, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Meteor from 'react-native-meteor';
import { colors, stylesheet } from '../../config/styles';
import { List, ListItem, Icon } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

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

	addNewInventory() {
		
		if (this.state.name.length === 0) {
			console.log('name cannot be empty') // eslint-disable-line
			this.setState({ newItemInputVisible: false });
			return;
		}

		Meteor.call('inventories.insert', this.state.name.trim(), (err, newItemId) => {
			
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

	renderItem(inventories) {
		const listId = this.props.navigation.state.params.id;
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
				onPress: () => this.props.navigation.navigate('InventoryEdit', { listId: listId, id: inventories.item._id })
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
				onPress: () => 	Meteor.call('inventories.remove', inventories.item._id, (err) => {
					if (err) {
						Alert.alert(
							"Error Deleting Item",
							err.reason,
							[
								{ text: "OK", style: 'normal' }
							],
							{ cancelable: true }
						);
					} else {
						Meteor.call('inventorylists.removeItem', listId, inventories.item._id);
					}
				})
			}
		];

		const title = inventories.item.amount ? `${inventories.item.name} (${inventories.item.amount})` : `${inventories.item.name}`;

		return (
			<Swipeout right={rightButtons} autoClose='true' backgroundColor='white'>
				<ListItem title={title} hideChevron />
			</Swipeout>
		);
	}

	renderItems() {
		
		let list = this.props.screenProps.inventoryLists.find(list => list._id === this.props.navigation.state.params.id);
		let inventories = this.props.screenProps.inventories.filter(inventory => list.items.includes(inventory._id));

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
				<ScrollView style={{ flex: 1 }}>
					{this.renderItems()}
				</ScrollView>
				{this.renderAddButton()}
			</SafeAreaView>
		);
	}
}

export default InventoryList;