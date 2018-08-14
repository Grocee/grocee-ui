import React, { Component } from 'react';
import {StyleSheet, View, Text, ScrollView, Alert, FlatList, Linking} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {colors, deleteButton, editButton, stylesheet} from '../../config/styles';
import { List, ListItem, Icon, Card } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { styles } from "../Inventory/Home";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Meteor from "react-native-meteor";

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newItemInputVisible: false,
			newListName: ''
		}
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: "Recipes",
			headerStyle: {
				backgroundColor: colors.background
			},
			headerBackTitle: "Back",
			headerTitleStyle: {
				color: colors.tint
			}
		}
	}

	renderRecipe(recipes) {

		const rightButtons = [
			{
				text: (<EditButton/>),
				backgroundColor: editButton.backgroundColor,
				underlayColor: editButton.underlayColor,
				type: editButton.type,
				onPress: () => this.props.navigation.navigate('Recipe', { id: recipes.item._id })
			},
			{
				text: (<DeleteButton/>),
				backgroundColor: deleteButton.backgroundColor,
				underlayColor: deleteButton.underlayColor,
				type: deleteButton.type,
				onPress: () => 	Meteor.call('recipes.archive', recipes.item._id, (err) => {
					if (err) {
						Alert.alert(
							"Error Archiving Recipe",
							err.reason,
							[
								{ text: "OK", style: 'normal' }
							],
							{ cancelable: true }
						);
					}
				})
			}
		];

		return (
			<Swipeout right={rightButtons} autoClose backgroundColor='white' >
				<ListItem
					key={recipes.item._id}
					title={recipes.item.name}
					subtitle={recipes.item.url}
					rightIcon={{ name: 'link' }}
					onPress={() => Linking.openURL(recipes.item.url)}
				/>
			</Swipeout>
		);
	}

	renderRecipes() {

		let recipes = this.props.screenProps.recipes.filter(recipe => !recipe.archived);

		if (recipes.length === 0) {
			return (
				<Card>
					<Text style={{textAlign: 'center'}}>
						You do not have any recipes saved. Click the + button to add one!
					</Text>
				</Card>
			);
		}

		return (
			<List containerStyle={styles.list}>
				<FlatList
					keyExtractor={(_item, index) => index}
					data={recipes}
					renderItem={(recipes) => this.renderRecipe(recipes)}
				/>
			</List>
		);
	}

	renderAddButton() {
		const navigation = this.props.navigation;
		return (
			<View style={stylesheet.fab}>
				<Icon
					name="add"
					raised
					reverse
					color={colors.background}
					onPress={() => navigation.navigate('Recipe', { id: null })}
				/>
			</View>
		)
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView style={{ flex: 1 }}>
					{this.renderRecipes()}
				</ScrollView>
				{this.renderAddButton()}
			</SafeAreaView>
		);
	}
}