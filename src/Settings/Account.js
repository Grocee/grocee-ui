import React, { Component } from 'react';
import {StyleSheet, ScrollView, View, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Meteor from 'react-native-meteor';
import { List, ListItem } from 'react-native-elements';
import { colors, stylesheet} from "../../config/styles";
import { TextField } from 'react-native-material-textfield';
import { Accounts } from 'react-native-meteor';

export default class Account extends Component {

	constructor(props) {
		super(props);

		let email = '';
		let verifiedEmail = false;

		// TODO: what would happen to this array if we change email?
		let emails = this.props.screenProps.user.emails;
		if (emails.length > 0) {
			email = emails[0].address;
			verifiedEmail = emails[0].verified;
		}

		this.state = {
			email,
			verifiedEmail,
			profileEdited: false,
			firstName: this.props.screenProps.user.firstName,
			lastName: this.props.screenProps.user.lastName
		}
	}

	static navigationOptions() {
		return {
			headerTitle: 'Account'
		};
	}

	handleSignOut() {
		Meteor.logout();
	}

	handleSendEmailVerification() {
		Meteor.call('accounts.resendVerificationEmail');
	}

	handlePasswordReset() {
		Meteor.call('accounts.sendPasswordResetEmail');
	}

	handleUpdateProfile() {
		Meteor.call('accounts.updateNames', this.state.firstName, this.state.lastName, (err) => {
			if (err) {
				return Alert.alert(
					'Error updating names',
					err,
					[
						{ text: "OK", style: 'normal'}
					],
					{ cancelable: true }
				);
			}

			this.props.navigation.goBack();
		});
	}

	render() {

		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView>
					<View style={stylesheet.container}>
						<TextField
							label='First Name'
              value={this.state.firstName}
              tintColor={colors.textFieldTint}
							onChangeText={(name) => this.setState({ firstName: name, profileEdited: true })}
						/>
						<TextField
							label='Last Name'
							value={this.state.lastName}
              tintColor={colors.textFieldTint}
							onChangeText={(name) => this.setState({ lastName: name, profileEdited: true })}
						/>
						<TextField
							label='Email Address'
							value={this.state.email}
              tintColor={colors.textFieldTint}
						/>
					</View>
					{this.state.profileEdited
						? <List>
							<ListItem
								title='Save Changes'
								onPress={() => this.handleUpdateProfile()}
								hideChevron
							/>
						</List>
						: null}
					<List>
						{!this.state.verifiedEmail
							? <ListItem
								title='Verify Email'
								onPress={() => this.handleSendEmailVerification()}
								hideChevron
							/>
							: null}
						<ListItem
							title='Forgot Password'
							onPress={() => this.handlePasswordReset()}
							hideChevron
						/>
					</List>
					<List>
						<ListItem
							title='Sign Out'
							onPress={() => this.handleSignOut()}
							hideChevron />
					</List>
				</ScrollView>
			</SafeAreaView>
		);
	}
}