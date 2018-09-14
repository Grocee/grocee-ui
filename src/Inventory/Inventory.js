import React, {Component} from 'react';
import Meteor from 'react-native-meteor';
import {colors, stylesheet} from '../../config/styles';
import {Alert, SafeAreaView, View} from 'react-native';
import {Button, FormInput, FormLabel, FormValidationMessage} from 'react-native-elements';
import {Dropdown} from 'react-native-material-dropdown';

export default class Inventory extends Component {
	
	constructor(props) {
		super(props);
		
		const id = props.navigation.state.params.id;
		let name = '';
		let amount = null;
		let isNew = true;

		this.onChangeText = this.onChangeText.bind(this);

		this.nameRef = this.updateRef.bind(this, 'dropdown');

		if (id) {

			isNew = false;

			const item = this.props.screenProps.inventories.find(item => item._id === id);

			if (item) {
				name = item.name;
				amount = item.amount;
			}
		}


		// Drop down uses attribute `name` to display the options
		let lists = this.props.screenProps.inventoryLists;
		lists.forEach(list => {
			list.value = list.name;
		});

		lists = lists.sort(function (a, b) {
			return a.name - b.name;
		});

		let list = this.props.screenProps.inventoryLists.find(list => list._id === this.props.navigation.state.params.listId);

		this.state = {
			name,
			amount,
			isNew,
			lists,
			ownerList: list.name,
			listId: list._id
		};

	}

	updateRef(name, ref) {
		this[name] = ref;
	}


	static navigationOptions({ navigation }) {
		return {
			headerTitle: 'Inventory',
			headerStyle: {
				backgroundColor: colors.background,
			},
			headerTitleStyle: {
				color: colors.tint,
			},
			// save button for editing?
			headerLeft: (
				<Button 
					title='Cancel'
					onPress={() => navigation.goBack()}
					backgroundColor={colors.background}
				/>
			)
		}
	}

	addInventory() {
		this.setState({ submitted: true });

		if (this.state.name.length === 0) {
			return
		}

		Meteor.call('inventories.insert', this.state.name, this.state.amount, this.props.navigation.state.params.listId,
			(err) => {
				if (err) {
					Alert.alert(
						"Error Creating Item",
						err.error,
						[
							{ text: "OK", style: 'normal'}
						],
						{ cancelable: true }
					);
				}

				this.props.navigation.goBack();
			})
	}

	updateInventory() {
		this.setState({ submitted: true });

		if (this.state.name.length === 0) {
			return;
		}

		Meteor.call('inventories.update', this.props.navigation.state.params.id, this.state.name, this.state.listId,
			this.state.amount, (err) => {
				if (err) {
					Alert.alert(
						"Error Updating Item",
						err.reason,
						[
							{ text: "OK", style: 'normal' }
						],
						{ cancelable: true }
					);
					return;
				}

				this.props.navigation.goBack();
			});
	}

	onChangeText(text) {

		let ref = this['dropdown'];
		console.log(ref.selectedItem());
	}

	render() {

		const invalidName = !this.state.name || this.state.name === '';

		return (
			<SafeAreaView style={{ flex: 1 }}>
				<FormLabel>Name</FormLabel>
				<FormInput
					style={stylesheet.input}
					onChangeText={(name) => this.setState({ name, submitted: false })}
					value={this.state.name}
					autoFocus
					autoCapitalize='words'
					returnKeyType='next'
					onSubmitEditing={() => {
						this.amountInput.focus()
					}}
					blurOnSubmit={false}
				/>
				{invalidName && this.state.submitted
					? <FormValidationMessage>Name cannot be empty</FormValidationMessage>
					: null}
				<FormLabel>Amount</FormLabel>
				<FormInput
					style={stylesheet.input}
					ref={(input) => {
						this.amountInput = input;
					}}
					onChangeText={(amount) => this.setState({ amount })}
					value={this.state.amount}
					placeholder='Amount'
					returnKeyType='done'
					onSubmitEditing={() => this.state.isNew
						? this.addInventory()
						: this.updateInventory()
					}
				/>
				{!this.state.isNew
					? <View style={{ marginLeft: 20, marginRight: 20 }} >
						<Dropdown
							ref={this.nameRef}
							label='List'
							data={this.state.lists}
							//value={this.state.ownerList}
							onChangeText={this.onChangeText}
						/>
					</View> : null}
			</SafeAreaView>
		)
	}
}