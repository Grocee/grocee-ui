import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { colors, stylesheet } from '../../config/styles';

import { StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { SearchBar, Button, Card, Icon } from 'react-native-elements';

import Grocery from './Grocery';

export default class GroceryList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			name: '',
			amount: '',
			isLoading: false,
			searchNeedle: '',
			displayChecked: false
		};
	}

	static navigationOptions({ navigation }) {
		return {
			headerTitle: navigation.state.params.name,
			headerBackTitle: "Back",
			headerRight: (
				<View style={stylesheet.rightButton}>
					<Icon 
						name='add'
						color={colors.tint}
						size={24}
						underlayColor='transparent'
						onPress={() => navigation.navigate('AddGrocery', { listId: navigation.state.params.id })}
						containerStyle={stylesheet.rightButton}
					/>
				</View>
			)
		}
	}

	renderGroceries() {
		// Filter based on search results
		const groceryList = this.props.screenProps.groceryLists.find(list => list._id === this.props.navigation.state.params.id);
		let groceries = [];
		if ( groceryList ) {
			groceries = this.props.screenProps.groceries.filter(grocery => {
				if (groceryList.items.includes(grocery._id)) {
					if (this.state.searchNeedle !== '') {
						return grocery.name.indexOf(this.state.searchNeedle) >= 0;
					} else {
						return true;
					}
				} else {
					return false;
				}
			});
	
			// Filter based on setChecked
			if ( !this.state.displayChecked ) {
				groceries = groceries.filter(grocery => !grocery.checked);
			}
		}

		return (
			<View>
				<SearchBar 
					lightTheme
					platform="ios"
					onChangeText={text => this.setState({searchNeedle: text})}
					onClear={() => this.setState({searchNeedle: ''})}
					placeholder='Search for a grocery item...'/>
				{/* <Text h6>{JSON.stringify(this.props.navigation.state.params)}</Text>
				<Text h6>{JSON.stringify(groceryList)}</Text> */}
				{groceries.map(groceryItem => (<Grocery key={groceryItem._id} item={groceryItem}/>))}
			</View>
		);
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView style={{ flex: 1 }}>
					<Button title={"Display checked items"} clear={true} onPress={() => this.setState(prevState => ({displayChecked: !prevState.displayChecked}))}/>
					{this.renderGroceries()}
				</ScrollView>
			</SafeAreaView>
		);
	}
}

export const styles = StyleSheet.create({
	groceryContainer: {
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
});