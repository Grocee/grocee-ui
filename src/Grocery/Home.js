import React, { Component } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { List, ListItem, Card, Button } from 'react-native-elements';

export default class Home extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			name: ''
		};
	}

	renderAddNewList() {
		return (<Button title={"Add grocery list"} onPress={() => this.props.navigation.navigate('AddList')}/>);
	}
    
	renderList(list) {
		return (
			<ListItem title={list.name} onPress={() => this.props.navigation.navigate('GroceryList', {listName: list.name})}/>
		)
	}
    
	renderLists() {
		let lists = this.props.screenProps.groceryLists || [];

		return (
			<List>
				{lists.map(list => this.renderList(list))}
			</List>
		);
	}

	render() {
		return (
			<SafeAreaView>
				{this.renderAddNewList()}
				{this.renderLists()}
			</SafeAreaView>
		);
	}
}

export const styles = StyleSheet.create({
	input: {
		height: 50,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC',
	}
});