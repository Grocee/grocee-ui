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
import { colors } from '../../config/styles';
import { List, ListItem, Card, Button, Icon } from 'react-native-elements';
import settings from '../../config/settings';

export default class Home extends Component {

	constructor(props) {
		super(props);
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