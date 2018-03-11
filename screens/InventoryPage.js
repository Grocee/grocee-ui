import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  Text,
  TextInput,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import settings from '../config/settings';
import Meteor, { createContainer } from 'react-native-meteor';

Meteor.connect(settings.METEOR_URL);

class Inventory extends React.PureComponent {

	render() {
		const item = this.props.item;
		return (
			<TouchableHighlight underlayColor='#dddddd'>
				<View>
					<View style={styles.rowContainer}>
						<View style={styles.inventoryContainer}>
							<Text style={ {color: 'dark grey', fontWeight: 'bold', fontSize: 18} }>{item.name}</Text>
							<Text style={ {color: 'grey', fontWeight: '100', fontSize: 14} }>{item.amount}</Text>
						</View>
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
		);
	}
}

export default class InventoryPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			amount: '',
			isLoading: false,
		};
	}

	_keyExtractor = (item, index) => index;

	_renderItem = ({item, index}) => (
		<Inventory
			item={item}
			index={index}
			onPressItem={this._onPressItem}
		/>
	);

	_submmitInventory = () => {
		if (this.state.name.length === 0) {
			console.log('name cannot be empty')
			return
		}

		if (this.state.amount.length === 0) {
			console.log('amount cannot be empty')
			return
		}

		Meteor.call('inventories.insert', this.state.name, this.state.amount);

		this.state.name = '';
		this.state.amount = '';
	};

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<TextInput
					style={styles.inventoryInput}					
					onChangeText={(name) => this.setState({ name })}
					value={this.state.name}
					placeholder='Add new inventory'
					autoCapitalize='words'
					returnKeyType='next'
					//onSubmitEditing={} //make the url one active
				/>
				<TextInput
					style={styles.inventoryInput}
					onChangeText={(amount) => this.setState({ amount })}
					value={this.state.amount}
					placeholder='The amount of this item'
					autoCapitalize='none'
					autoCorrect='true'
					returnKeyType='done'
					onSubmitEditing={this._submmitInventory}
				/>
				<FlatList
					data={this.props.screenProps.inventories}
					keyExtractor={this._keyExtractor}
					renderItem={this._renderItem}
				/>
			</SafeAreaView>
		);
	}
}

export const styles = StyleSheet.create({
	inventoryInput: {
		height: 50,
		//flexGrow: 1,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC',
	},
	inventoryContainer: {
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