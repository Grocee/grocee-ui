import React, { Component } from 'react';
import {StyleSheet, View, Text, TextInput, ScrollView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {colors, stylesheet} from '../../config/styles';
import { List, ListItem, Icon } from 'react-native-elements';
import Meteor from 'react-native-meteor';

export default class Home extends Component {

	constructor(props) {
		super(props);

		this.showNewListInput = this.showNewListInput.bind(this);

		this.state = {
			newListInputVisible: false,
			newListName: ''
		};
	}

	static navigationOptions({ navigation }) {
		const params = navigation.state.params || {};

		return {
			headerTitle: "Inventory",
			headerStyle: {
				backgroundColor: colors.background
			},
			headerBackTitle: "Back",
			headerTitleStyle: {
				color: colors.tint
			},
			headerRight: (
				<View style={styles.rightButton} >
					<Icon 
						name='add'
						color={colors.tint}
						size={24}
						underlayColor='transparent'
						onPress={params.showNewListInput}
						containerStyle={styles.rightButton}
					/>
				</View>
			)
		}
	}

	componentWillMount() {
		this.props.navigation.setParams({ showNewListInput: this.showNewListInput });
	}

	showNewListInput() {
		this.setState(prevState => ({ newListInputVisible: !prevState.newListInputVisible }));
	}

	addNewList() {

		if (this.state.newListName.length === 0) {
			console.log('name cannot be empty') // eslint-disable-line
			this.setState({ newListInputVisible: false });
			return;
		}

		Meteor.call('inventorylists.create', this.state.newListName, (err, listId) => {

			if (err) {
				Alert.alert(
					"Error Creating New List",
					err.error,
					[
						{ text: "OK", style: 'normal'}
					],
					{ cancelable: true }
				);
			} else {
				this.props.navigation.navigate('InventoryList', { id: listId, name: this.state.newListName })
			}
		});

		this.setState({ newListInputVisible: false });
	}

	renderList(list) {
		return (
			<ListItem
				key={list._id}
				title={list.name}
				badge={{ value: list.items.length }}
				onPress={() => this.props.navigation.navigate('InventoryList', { id: list._id, name: list.name })}
			/>
		);
	}

	renderLists() {

		let lists = this.props.screenProps.inventoryLists;

		if (lists.length > 0) {
			return (
				<List containerStyle={styles.list} >
					{lists.map(list => this.renderList(list))}
				</List>
			);
		} else {
			return (
				<Text>You do not have any inventory lists. Click the top right icon to create one!</Text>
			);
		}
	}

	renderNewListInput() {
		return (
			<View style={stylesheet.newItem}>
				<TextInput
					placeholder="New List"
					returnKeyType='done'
					autoCapitalize='words'
					autoFocus
					onChangeText={(name) => this.setState({ newListName: name })}
					onSubmitEditing={() => this.addNewList()}
				/>
			</View>
		);
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				{this.state.newListInputVisible ? this.renderNewListInput() : null}
				<ScrollView style={{ flex: 1 }}>
					{this.renderLists()}
				</ScrollView>
			</SafeAreaView>
		);
	}
}

export const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		bottom: 24,
		right: 24,
	},
	rightButton: {
		padding: 5
	},
	list: {
		borderTopWidth: 0.5,
		//borderBottomWidth: 0.5
	}
});