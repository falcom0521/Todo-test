# Offline First To-Do App

## Features
- Offline task creation
- Auto sync on internet reconnect
- Redux + Saga architecture
- AsyncStorage persistence
- Unit tests included

## Sync Logic
1. Tasks saved locally with syncStatus = pending
2. Network detected using NetInfo
3. Redux Saga syncs pending tasks
4. Backend returns Mongo ID
5. Task marked as synced

## Run App
npm install
npx react-native run-android

## Run Tests
npm test
# Todo-test
