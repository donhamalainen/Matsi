# MATSI

Matsi is an application designed to provide users with detailed statistics about their games. Games can range from board games to PlayStation matches, or any competition where two users engage against each other.

This repository consists of two parts, both of which must be running when the application is tested. If you also want to try out the Deep Link/Universal Link feature please visit the web page repository at this link

> [MatsiWeb Github](https://github.com/donhamalainen/MatsiWeb.git)

### Features

- **Game Tracking:** Record, organize, and analyze game statistics.
- **Secure Authentication:** JWT-based email login for secure user sessions.
- **Cross-Platform Support:** Optimized for both iOS and Android.
- **Deep Linking/Universal Links:** Seamless navigation from web to app.
- **API/WebSocket Integration**: REST API communication and real-time data synchronization with the PostgreSQL database ensures accurate and updated statistics.

### Technologies

- **Frontend**: Expo SDK 52 (React Native)
- **Backend**: NodeJS with Express
- **Database**: PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v22+)
- PostgreSQL (v17+)
- Expo SDK (v52+)

### Installation

#### Clone the Repository

```
git clone https://github.com/donhamalainen/Matsi.git
cd Matsi
```

#### Install Dependencies

Run the following command to install the dependencies

```
npm install | yarn install
```

#### Start the Application

```
npm start | yarn start
```
