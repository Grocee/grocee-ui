/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import Meteor from 'react-native-meteor';

import { stylesheet, colors } from '../../config/styles';

import { SafeAreaView, Alert, Platform, View } from 'react-native';
import { TextField } from 'react-native-material-textfield';

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
				<View style={stylesheet.container}>
					<TextField
						label='Name'
						value={this.state.name}
						onChangeText={(name) => this.setState({ name, submitted: false })}
						returnKeyType='next'
						onSubmitEditing={() => {
							this.urlInput.focus()
						}}
						tintColor={colors.textFieldTint}
						error={this.state.submitted && invalidName 
							? 'Name cannot be empty'
							: null}
						shake={invalidName}
						autoFocus
						autoCapitalize='words'
						blurOnSubmit={false} />

					<TextField
						label='URL'
						ref={(input) => {
							this.urlInput = input;
						}}
						value={this.state.url}
						onChangeText={(url) => this.setState({ url, submitted: false })}
						returnKeyType='done'
						onSubmitEditing={() => this.state.isNew
							? this.addRecipe()
							: this.updateRecipe()}
						tintColor={colors.textFieldTint}
						error={invalidURL && this.state.submitted
							? 'URL is invalid'
							: null}
						shake={invalidURL}
						autoCapitalize='none'
						autoCorrect={false} />
				</View>
			</SafeAreaView>
		)
	}
}