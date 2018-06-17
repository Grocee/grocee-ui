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
	Alert
} from 'react-native';
import { colors } from '../../config/styles';
import { List, ListItem, Card, Button, Icon, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import Header from 'react-navigation/src/views/Header/Header';
import Meteor, { createContainer } from 'react-native-meteor';
import settings from '../../config/settings';

class CreateList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			name: ""
		};
	}

	_createNewList() {

		// if no name just go back without creating the list
		if (this.state.name.length === 0) {
			this.props.navigation.goBack();
			return;
		}

		Meteor.call('inventorylists.create', this.state.name.trim(), (err, newListId) => {
			if (err) {
				Alert.alert(
					"Error Creating New List",
					err.error,
					[
						{ text: "OK", style: 'normal'}
					],
					{ cancelable: true }
				);
			}
			
			this.props.navigation.goBack();

			// TODO: fix this to allow for navigating to the list after creation
			// Might have to investigate a different way to present a new list text input
			// this.props.navigation.state.params.loadList({ _id: newListId, name: this.state.name });
		});
	}

	render() {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<Header scene={{index: 0}}
					scenes={[{index: 0, isActive: true}]}
					navigation={{state: {index: 0}}}
					getScreenDetails={() => ({options: {
						headerTitle: 'New List',
						headerStyle: {
							backgroundColor: colors.background
						},
						headerTitleStyle: {
							color: colors.tint
						},
						headerRight: (
							<Button 
								title='Done' 
								onPress={() => this._createNewList()}
								backgroundColor={colors.background}
							/>
						),
						headerLeft: (
							<Button 
								title='Cancel' 
								onPress={() => this.props.navigation.goBack()}
								backgroundColor={colors.background}
							/>
						)
					}})}
				/>
				<TextInput
					style={styles.textInput}
					placeholder="New list name"
					onChangeText={(name) => this.setState({name})}
					returnKeyType='done'
					autoCapitalize='words'
					autoFocus={true}
					onSubmitEditing={() => this._createNewList()}
				/>
			</SafeAreaView>
		);
	}
}

export default CreateList;

export const styles = StyleSheet.create({
	rightButton: {
		padding: 5,
		backgroundColor: colors.background
	},
	textInput: {
		height: 40,
		padding: 8
	}
});