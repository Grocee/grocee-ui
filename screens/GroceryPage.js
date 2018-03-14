import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableHighlight,
	TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import settings from '../config/settings';
import Meteor, { createContainer } from 'react-native-meteor';
import { List, ListItem, SearchBar, Text, Button, CheckBox, Card, Header } from 'react-native-elements';

Meteor.connect(settings.METEOR_URL);

class Grocery extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			checked: false
		};
	}

	handlePress() {
		this.setState(prevState => ({checked: !prevState.checked}));
	}

	render() {
		const item = this.props.item;
		return (
			<CheckBox title={`${item.amount} ${item.name}`} checkedColor='green' checked={this.state.checked} onPress={() => this.handlePress()} onIconPress={() => this.handlePress()}/>
		)
	}
}

export default class GroceryPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			amount: '',
			isLoading: false,
			searchNeedle: ''
		};
	}

	submitGrocery() {
		if (this.state.name.length === 0) {
			console.log('name cannot be empty')
			return
		}

		if (this.state.amount.length === 0) {
			console.log('amount cannot be empty')
			return
		}

		Meteor.call('groceries.insert', this.state.name, this.state.amount);

		this.state.name = '';
		this.state.amount = '';
	};

	renderAddNewGrocery() {
		return (
			<Card title="Add new Grocery Item">
				<TextInput
					style={styles.groceryInput}					
					onChangeText={(name) => this.setState({ name })}
					value={this.state.name}
					placeholder='Add new grocery item'
					autoCapitalize='words'
					returnKeyType='next'
				/>
				<TextInput
					style={styles.groceryInput}
					onChangeText={(amount) => this.setState({ amount })}
					value={this.state.amount}
					placeholder='The amount of this item'
					autoCapitalize='none'
					autoCorrect='true'
					returnKeyType='done'
					onSubmitEditing={() => this.submitGrocery()}
				/>
			</Card>
		);
	}

	renderGroceries() {
		const groceries = this.props.screenProps.groceries.filter(grocery => {
			if (this.state.searchNeedle !== '') {
				return grocery.name.indexOf(this.state.searchNeedle) >= 0;
			} else {
				return true;
			}
		});

		return (
			<Card title="Groceries">
				<SearchBar 
					lightTheme
					platform="ios"
					onChangeText={text => this.setState({searchNeedle: text})}
					onClear={() => this.setState({searchNeedle: ''})}
					placeholder='Search for a grocery item...'/>
				{groceries.map(groceryItem => (<Grocery item={groceryItem}/>))}
			</Card>
		);
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<Header
					leftComponent={{ icon: 'menu', color: '#fff' }}
					centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
					rightComponent={{ icon: 'home', color: '#fff' }}
				/>
				<Text h1>Grocery</Text>
				{this.renderAddNewGrocery()}
				{this.renderGroceries()}
			</SafeAreaView>
		);
	}
}

export const styles = StyleSheet.create({
	groceryInput: {
		height: 50,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC',
	},
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