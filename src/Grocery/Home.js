import React, { Component } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';

export default class Home extends Component {
	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<SafeAreaView>
				<Text>Home</Text>
			</SafeAreaView>
		);
	}
}