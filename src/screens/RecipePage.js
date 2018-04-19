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
import settings from '../../config/settings';

// probably should abstract this out into its own method and make this strictly FE
import Meteor, { createContainer } from 'react-native-meteor';

Meteor.connect(settings.METEOR_URL);

class Recipe extends React.PureComponent {
	
	_onPress() {
		return Linking.openURL(this.props.item.url);
	};

	render() {
		const item = this.props.item;
		return (
			<TouchableHighlight onPress={this._onPress} underlayColor='#dddddd'>
				<View>
					<View style={styles.rowContainer}>
						<View style={styles.recipeContainer}>
							<Text style={ {color: 'dark grey', fontWeight: 'bold', fontSize: 18} }>{item.name}</Text>
							<Text style={ {color: 'grey', fontWeight: '100', fontSize: 14} }>{item.url}</Text>
						</View>
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
		);
	}
}

export default class RecipePage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			url: '',
			isLoading: false,
		};
	}

	_keyExtractor(item, index) {
		return index;
	}

	_renderItem({item, index}) {
		<Recipe
			item={item}
			index={index}
			onPressItem={this._onPressItem}
		/>
	}

	_submitRecipe() {
		//Insert to Meteor

		if (this.state.name.length === 0) {
			// show alert
			console.log('name cannot be empty')
			return
		}

		if (this.state.url.length === 0) {
			// show alert
			console.log('url cannot be empty')
			return
		}

		Meteor.call('recipes.insert', this.state.name, this.state.url);

		this.state.name = '';
		this.state.url = '';
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<TextInput
					style={styles.recipeInput}					
					onChangeText={(name) => this.setState({ name })}
					value={this.state.name}
					placeholder='Add new recipe'
					autoCapitalize='words'
					returnKeyType='next'
					//onSubmitEditing={} //make the url one active
				/>
				<TextInput
					style={styles.recipeInput}
					onChangeText={(url) => this.setState({ url })}
					value={this.state.url}
					placeholder='URL of recipe'
					keyboardType='url'
					autoCapitalize='none'
					autoCorrect='false'
					returnKeyType='done'
					onSubmitEditing={() => this._submitRecipe()}
				/>
				<FlatList
					data={this.props.screenProps.recipes}
					keyExtractor={() => this._keyExtractor()}
					renderItem={() => this._renderItem()}
				/>
			</SafeAreaView>
		)
	}

};

const styles = StyleSheet.create({
	thumb: {
		width: 80,
		height: 80,
		marginRight: 10
	},
	recipeInput: {
		height: 50,
		//flexGrow: 1,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC',
	},
	recipeContainer: {
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