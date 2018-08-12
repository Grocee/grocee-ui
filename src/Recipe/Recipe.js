import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { stylesheet } from '../../config/styles';

import { SafeAreaView, Alert, Platform } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

export default class Recipe extends Component {

	constructor(props) {
		super(props);

		const recipeId = props.navigation.state.params.id;
		const urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g;

		let name = '';
		let url = 'https://';
		let isNew = true;
		let submitted = false;

		if (recipeId) {
			isNew = false;

			const recipe = this.props.screenProps.recipes.find(recipe => recipe._id === recipeId);
			if (recipe) {
				name = recipe.name;
				url = recipe.url;
			}
		}

		this.state = { recipeId, name, url, urlRegex, isNew, submitted }
	}

	static navigationOptions({ navigation }) {
		return {
			// for some odd reason "Recipe" without leading/trailing space results in
			// it getting truncated to "Reci..."
			headerTitle: ' Recipe '
		}
	}

	addRecipe() {

		this.setState({ submitted: true });

		if (this.state.name.length === 0
			|| this.state.url.length === 0
			|| !this.state.url.match(this.state.urlRegex) ) {
			return
		}

		Meteor.call('recipes.insert', this.state.name, this.state.url, (err) => {
			if (err) {
				return Alert.alert(
					'Error Adding Recipe',
					err.error,
					[{ text: "OK", style: 'normal' }],
					{ cancelable: true }
				);
			}

			this.props.navigation.goBack();
		})
	}

	updateRecipe() {

		this.setState({ submitted: true });

		if (this.state.name.length === 0
			|| this.state.url.length === 0
			|| !this.state.url.match(this.state.urlRegex)) {
			return
		}

		Meteor.call('recipes.update', this.state.recipeId, this.state.name, this.state.url, (err) => {
			if (err) {
				return Alert.alert(
					'Error Updating Recipe',
					err.error,
					[
						{ text: "OK", style: 'normal' }
					],
					{ cancelable: true }
				);
			}

			this.props.navigation.goBack();
		})
	}

	render() {
		const invalidName = !this.state.name || this.state.name === '';
		const invalidURL = !this.state.url || this.state.url === '' || !this.state.url.match(this.state.urlRegex);

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<FormLabel>Name</FormLabel>
				<FormInput
					style={stylesheet.input}
					onChangeText={(name) => this.setState({ name, submitted: false })}
					value={this.state.name}
					placeholder='Add new recipe'
					autoFocus
					autoCapitalize='words'
					returnKeyType='next'
					onSubmitEditing={() => {
						this.urlInput.focus()
					}}
					blurOnSubmit={false}
				/>
				{invalidName && this.state.submitted
					? <FormValidationMessage>Name cannot be empty</FormValidationMessage>
					: null}
				<FormLabel>URL</FormLabel>
				<FormInput
					style={stylesheet.input}
					ref={(input) => {
						this.urlInput = input;
					}}
					onChangeText={(url) => this.setState({ url, submitted: false })}
					value={this.state.url}
					placeholder='Add recipe URL'
					returnKeyType='done'
					autoCorrect={false}
					keyboardType={Platform.OS === 'ios' ? 'url' : 'default'} // url keyboard type only available in iOS
					autoCapitalize='none'
					onSubmitEditing={() => this.state.isNew
						? this.addRecipe()
						: this.updateRecipe()
					}
				/>
				{invalidURL && this.state.submitted
					? <FormValidationMessage>URL is invalid</FormValidationMessage>
					: null}
			</SafeAreaView>
		)
	}
}