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
import Meteor, { createContainer } from 'react-native-meteor';
import { colors } from '../../config/styles';
import { List, ListItem, Card, Button, Icon } from 'react-native-elements';

export default class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
			count: 0
		};
	}

	static navigationOptions({ navigation }) {
		const params = navigation.state.params || {};
	
		return {
			headerTitle: "Inventory",
			headerStyle: {
				backgroundColor: colors.background
			},
			headerTitleStyle: {
				color: colors.tint
			},
			headerRight: (
				<View style={styles.rightButton} >
					<Icon 
						name='add'
						color={colors.tint}
						size={24}
						underlayColor='transparent'
						onPress={params.increaseCount}
						containerStyle={styles.rightButton}
					/>
				</View>
			)
		}
	}

	componentWillMount() {
		this.props.navigation.setParams({ increaseCount: () => this._increaseCount() });
	}

	_increaseCount() {
		this.setState({ count: this.state.count + 1 });
	}

	render() {
		return (
			<SafeAreaView style={StyleSheet.absoluteFill}>
				<Text>{this.state.count}</Text>
			</SafeAreaView>
		);
	}
}

export const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		bottom: 24,
		right: 24,
	},
	rightButton: {
		padding: 5
	}
});