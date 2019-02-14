import React, { Component } from "react";
import { StyleSheet, Dimensions, LayoutAnimation, View, Text, Platform } from "react-native";
import { SafeAreaView } from "react-navigation";
import { colors } from "../../config/styles";
import { InputWrapper } from "../components/GenericTextInput";
import Button from "../components/Button";
import Meteor, { Accounts } from "react-native-meteor";
import { TextField } from "react-native-material-textfield";
import KeyboardSpacer from "react-native-keyboard-spacer";

export default class SignIn extends Component {
	constructor(props) {
		super(props);

		this.mounted = false;
		this.state = {
			email: "",
			password: "",
			confirmPassword: "",
			confirmPasswordVisible: false,
			error: null,
		};
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	_handleError(error) {
		if (this.mounted) {
			this.setState({
				error 
			});
		}
	}

	_validateInput() {
		const { email, password, confirmPassword, confirmPasswordVisible } = this.state;
		let valid = true;
		
		if (email.length === 0) {
			this._handleError("Email cannot be empty.");
		}

		if (password.length === 0) {
			this._handleError("Password cannot be empty.");
		}

		if (confirmPasswordVisible && password !== confirmPassword) {
			this._handleError("Passwords do not match.");
			valid = false;
		}

		if (valid) {
			this._handleError(null);
		}

		return valid;
	}

	_handleSignIn() {
		if (this._validateInput()) {
			const { email, password } = this.state;
			Meteor.loginWithPassword(email, password, (error) => {
				if (error) {
					this._handleError(error.reason);
				}
			});
		}
	}

	_handleCreateAccount() {
		const { email, password, confirmPasswordVisible } = this.state;

		if (confirmPasswordVisible && this._validateInput()) {
			Accounts.createUser({
				email, password 
			}, (error) => {
				if (error) {
					this._handleError(error.reason);
				} else {
					// react-native-meteor doesn't log in right away after sign up
					this._handleSignIn();
				}
			});
		} else {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
			this.setState({
				confirmPasswordVisible: true 
			});
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerText}>grocee</Text>
				</View>

				<InputWrapper>
					<TextField
						onChangeText={(email) => this.setState({
							email 
						})}
						keyboardType='email-address'
						onSubmitEditing={() => {
							this.passwordInput.focus();
						}}
						label='Email Address'
						autoCapitalize='none'
						tintColor={colors.textFieldTint}
						returnKeyType='next'
					/>
					<TextField
						label='Password'
						ref={(input) => {
							this.passwordInput = input;
						}}
						onChangeText={(password) => this.setState({
							password 
						})}
						autoCapitalize='none'
						secureTextEntry
						tintColor={colors.textFieldTint}
						onSubmitEditing={() => !this.state.confirmPasswordVisible
							? this._handleSignIn()
							: this.confirmPasswordInput.focus()
						}
						returnKeyType={this.state.confirmPasswordVisible
							? "next"
							: "done"}
					/>
					{this.state.confirmPasswordVisible
						? <TextField
							label='Confirm Password'
							ref={(input) => {
								this.confirmPasswordInput = input;
							}}
							onChangeText={(confirmPassword) => this.setState({
								confirmPassword 
							})}
							onSubmitEditing={() => this._handleCreateAccount()}
							secureTextEntry
							borderTop
							tintColor={colors.textFieldTint}
						/>
						: null}
				</InputWrapper>

				<View style={styles.error}>
					<Text style={styles.errorText}>{this.state.error}</Text>
				</View>

				<View style={styles.buttons}>
					<Button text='Sign In' onPress={() => this._handleSignIn()} />
					<Button text='Create Account' onPress={() => this._handleCreateAccount()} />
				</View>

				{Platform.OS === "ios"
					? <KeyboardSpacer/>
					: null}
			</SafeAreaView>
		);
	}
}

const window = Dimensions.get("window");
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.signInBackground,
	},
	buttons: {
		flexDirection: "row", 
	},
	error: {
		height: 28,
		justifyContent: "center",
		width: window.width,
		alignItems: "center",
	},
	errorText: {
		color: colors.errorText,
		fontSize: 14,
	},
	header: {
		marginBottom: 25,
		alignItems: "center",
	},
	logo: {
		width: 125,
		height: 125,
	},
	headerText: {
		fontSize: 30,
		color: colors.background,
		fontWeight: "600",
		fontStyle: "italic",
	},
	subHeaderText: {
		fontSize: 20,
		color: colors.headerText,
		fontWeight: "400",
		fontStyle: "italic",
	},
});