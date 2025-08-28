# STC Mobile App

This is a React Native mobile application for a digital payment and recharge service.

## Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

## Project Structure

After refactoring, the project follows a structured organization:

```
src/
├── component/             # Reusable UI components
├── constants/             # App-wide constants (colors, typography, layout, API)
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── navigation/            # Navigation configuration
│   ├── stacks/            # Feature-specific navigation stacks
│   └── NAVIGATION_DOCS.md # Navigation documentation
├── redux/                 # Redux state management
│   ├── hooks.js           # Redux hooks
│   ├── store.js           # Redux store configuration
│   └── slices/            # Redux slices (actions, reducers)
├── router/                # Tab navigation
├── screens/               # App screens
├── services/              # API and other services
└── utils/                 # Utility functions
```

## Code Standards

### Naming Conventions

- **Files**: Component files use PascalCase (e.g., `Button.jsx`)
- **Variables**: Use camelCase (e.g., `userId`)
- **Constants**: Use UPPER_CASE for non-component constants (e.g., `API_URL`)
- **Components**: Use PascalCase (e.g., `CustomButton`)
- **Functions**: Use camelCase (e.g., `handleSubmit`)

### Component Structure

Components follow a consistent structure:

1. Imports
2. Component definition with JSDoc comments
3. Internal state and hooks
4. Helper functions
5. Effect hooks
6. Return statement with JSX
7. Styles (using StyleSheet.create)
8. Export statement

### Navigation Structure

The app uses a hierarchical navigation structure:

- **RootNavigator**: Entry point for all navigation
- **AuthNavigator**: Stack navigator for unauthenticated users
- **AppNavigator**: Stack navigator for authenticated users
- **TabRouter**: Bottom tab navigation for main app sections
- **Feature Stacks**: Specific navigators for related screens

For more details, see the [Navigation Documentation](./src/navigation/NAVIGATION_DOCS.md).

## Available Scripts

- `npm start` - Start the Metro bundler
- `npm run android` - Build and run on Android
- `npm run ios` - Build and run on iOS
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run Jest tests

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
