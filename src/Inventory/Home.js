import React, { Component } from 'react';
import {StyleSheet, View, Text, TextInput, ScrollView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {colors, stylesheet} from '../../config/styles';
import {List, ListItem, Icon, Card} from 'react-native-elements';

export default class Home extends Component {

	constructor(props) {
		super(props);

		this.state = {
			newListInputVisible: false,
			newListName: ''
		};
	}

	static navigationOptions({ navigation }) {
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
						onPress={() => navigation.navigate('AddList')}
						containerStyle={styles.rightButton}
					/>
				</View>
			)
		}
	}

	renderList(list) {

		const inventories = this.props.screenProps.inventories;

		let badgeValue = 0;
		if (list.items) {
			badgeValue = list.items.filter(item => {
				const inventory = inventories.find(inventory => inventory._id === item);
				return inventory ? !inventory.archived : false
			}).length;
		}
		return (
			<ListItem
				key={list._id}
				title={list.name}
				badge={{ value: badgeValue, containerStyle: stylesheet.badge }}
				onPress={() => this.props.navigation.navigate('InventoryList', { id: list._id, name: list.name })}
			/>
		);
	}

	renderLists() {

		let lists = this.props.screenProps.inventoryLists.filter(list => !list.archived);

		if (lists.length > 0) {
			return (
				<List containerStyle={styles.list} >
					{lists.map(list => this.renderList(list))}
				</List>
			);
		} else {
			return (
				<Card>
					<Text style={{textAlign: 'center'}}>
						You do not have any inventory lists. Tap the + button to create one!
					</Text>
				</Card>
			);
		}
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
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