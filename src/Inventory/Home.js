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
import { SafeAreaView } from 'react-navigation';
import Meteor, { createContainer } from 'react-native-meteor';
import { colors } from '../../config/styles';
import { List, ListItem, Card, Button, Icon } from 'react-native-elements';
import settings from '../../config/settings';

Meteor.connect(settings.METEOR_URL);

export default class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
			inventories: this.props.screenProps.inventories
		}
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
						onPress={() => navigation.navigate('CreateList')}
						containerStyle={styles.rightButton}
					/>
				</View>
			)
		}
	}

	getItemsForList(list) {
		let items = this.state.inventories;

		return items;
	}

	renderList(list) {
		return (
			<ListItem
				key={list._id}
				title={list.name}
				badge={{ value: '?' }}
				hideChevron
				onPress={() => this.props.navigation.navigate('InventoryList', { listId: list._id, items: list.items })}
			/>
		);
	}

	renderLists() {
		let lists = this.props.screenProps.inventoryLists || [];

		return (
			<List containerStyle={styles.list} >
				{lists.map(list => this.renderList(list))}
			</List>
		);
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView style={{ flex: 1}}>
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