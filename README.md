# grocee-ui
---

### To run the project

To run the metro bundler, first install all the dependencies:
```
npm i
```

Next, run the metro bundler:
```
react-native start
```

Open a new terminal window, then run the following to start iOS Simulator:
```
react-native run-ios
```

### Running the project on an Android device
You can run the project on an Android device by connecting your device (via USB) to your computer and launching Android studio. A few things you need to remember to do:
* Make the port where the Metro bundler is running available to your device (`adb reverse tcp:8081 tcp:8081`)
* If you are running the Meteor server locally, make that port available too. (`adb reverse tcp:3000 tcp:3000`)
* Enable Developer options on your device and then enable USB debugging

### How do I connect my Grocee UI to a local Grocee server?
Go to the `config/settings.js` file and change the URL to `'ws://localhost:3000/websocket'`.