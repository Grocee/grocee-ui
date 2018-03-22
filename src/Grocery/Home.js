import React, { Component } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { List, ListItem, Card, Button } from 'react-native-elements';

export default class Home extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			name: ''
		};
	}

	renderAddNewList() {
		// return (
		// 	<Card title="Add new Grocery Item">
		// 		<TextInput
		// 			style={styles.input}					
		// 			onChangeText={(name) => this.setState({ name })}
		// 			value={this.state.name}
		// 			placeholder='Add new grocery list'
		// 			autoCapitalize='words'
		// 			returnKeyType='next'
		// 		/>
		// 	</Card>
		// );

		return (<Button title={"Add grocery list"} onPress={() => this.props.navigation.navigate('AddList')}/>);
	}

	render() {
		return (
			<SafeAreaView>
				{this.renderAddNewList()}
				<List>
					<ListItem title={"one"}/>
					<ListItem title={"two"}/>
					<ListItem title={"three"}/>
				</List>
			</SafeAreaView>
		);
	}
}

export const styles = StyleSheet.create({
	input: {
		height: 50,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC',
	}
});