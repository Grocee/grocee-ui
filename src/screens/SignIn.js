import React, { Component } from 'react';
import {
	StyleSheet,
	Dimensions,
	LayoutAnimation,
	Image,
	View,
	TouchableHighlight,
	FlatList,
	Text,
	TextInput,
	Linking
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { colors } from '../../config/styles';
import logoImage from '../../images/rn-logo.png';
import GenericTextInput, {InputWrapper } from '../components/GenericTextInput';
import Button from '../components/Button';
import Meteor, { Accounts } from 'react-native-meteor';
import KeyboardSpacer from 'react-native-keyboard-spacer';


export default class SignIn extends Component {
	constructor(props) {
		super(props);

		this.mounted = false;
		this.state = {
			email: '',
			password: '',
			confirmPassword: '',
			confirmPasswordVisible: false,
			error: null,
		};
	}

	componentWillMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	_handleError(error) {
		if (this.mounted) {
			this.setState({ error });
		}
	}

	_validateInput() {
		const { email, password, confirmPassword, confirmPasswordVisible } = this.state;
		let valid = true;
		
		if (email.length === 0) {
			this._handleError('Email cannot be empty.');
		}

		if (password.length === 0) {
			this._handleError('Password cannot be empty.');
		}

		if (confirmPasswordVisible && password != confirmPassword) {
			this._handleError('Passwords do not match.');
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
			Accounts.createUser({ email, password }, (error) => {
				if (error) {
					this._handleError(error.reason);
				} else {
					// react-native-meteor doesn't log in right away after sign up
					this._handleSignIn();
				}
			})
		} else {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
			this.setState({ confirmPasswordVisible: true });
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<Image
						style={styles.logo}
						source={logoImage}
					/>
					<Text style={styles.headerText}>grocee</Text>
				</View>

				<InputWrapper>
					<GenericTextInput
						placeholder='email address'
						onChangeText={(email) => this.setState({ email })}
						borderTop
						keyboardType='email-address'
					/>
					<GenericTextInput
						placeholder='password'
						onChangeText={(password) => this.setState({ password })}
						secureTextEntry
						borderTop
					/>
					{this.state.confirmPasswordVisible ?
						<GenericTextInput
							placeholder='confirm password'
							onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
							secureTextEntry
							borderTop
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

				<KeyboardSpacer />

			</SafeAreaView>
		);
	}
}

const window = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background,
	},
	buttons: {
		flexDirection: 'row',
	},
	error: {
		height: 28,
		justifyContent: 'center',
		width: window.width,
		alignItems: 'center',
	},
	errorText: {
		color: colors.errorText,
		fontSize: 14,
	},
	header: {
		marginBottom: 25,
		alignItems: 'center',
	},
	logo: {
		width: 125,
		height: 125,
	},
	headerText: {
		fontSize: 30,
		color: colors.headerText,
		fontWeight: '600',
		fontStyle: 'italic',
	},
	subHeaderText: {
		fontSize: 20,
		color: colors.headerText,
		fontWeight: '400',
		fontStyle: 'italic',
	},
});