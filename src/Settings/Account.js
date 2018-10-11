import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Meteor from 'react-native-meteor';
import { List, ListItem, Button } from 'react-native-elements';
import {stylesheet} from "../../config/styles";
import { TextField } from 'react-native-material-textfield';

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

		this.state = { email, verifiedEmail }
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
		// do something
	}

	render() {

		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<ScrollView>
					<View style={stylesheet.container}>
						<TextField
							label='First Name'
						/>
						<TextField
							label='Last Name'
						/>
						<TextField
							label='Email Address'
							value={this.state.email}
						/>
					</View>
					{/*<View style={{ alignItems: 'center' }}>*/}
						{/*<Button*/}
							{/*title="Change Password"*/}
							{/*titleStyle={{ fontWeight: "400" }}*/}
							{/*buttonStyle={{*/}
								{/*backgroundColor: "rgba(92, 99,216, 1)",*/}
								{/*width: 300,*/}
								{/*height: 45,*/}
								{/*borderColor: "transparent",*/}
								{/*borderWidth: 0,*/}
								{/*borderRadius: 5,*/}
								{/*justifyContent: 'center',*/}

							{/*}}*/}
							{/*containerStyle={{ marginTop: 20 }}*/}
							{/*//onPress={}*/}
						{/*/>*/}
					{/*</View>*/}
					{/*<View style={{ alignItems: 'center' }}>*/}
						{/*<Button*/}
							{/*title="Sign Out"*/}
							{/*titleStyle={{ fontWeight: "400" }}*/}
							{/*buttonStyle={{*/}
								{/*backgroundColor: "rgba(92, 99,216, 1)",*/}
								{/*width: 300,*/}
								{/*height: 45,*/}
								{/*borderColor: "transparent",*/}
								{/*borderWidth: 0,*/}
								{/*borderRadius: 5,*/}
								{/*justifyContent: 'center',*/}

							{/*}}*/}
							{/*containerStyle={{ marginTop: 20 }}*/}
							{/*onPress={() => this.handleSignOut()}*/}
						{/*/>*/}
					{/*</View>*/}
					<List>
						{!this.state.verifiedEmail
						? <ListItem
								title='Verify Email'
								onPress={() => this.handleSendEmailVerification()}
								hideChevron
							/>
						: null}
						<ListItem
							title='Change Password'
							hideChevron
						/>
						<ListItem
							title="Sign Out"
							onPress={() => this.handleSignOut()}
							hideChevron />
					</List>
				</ScrollView>
			</SafeAreaView>
		);
	}
}