# CommunitySolidServer

This project proposes a modified version of CommunitySolidServer, developed with the aim of integrating interoperability features through the adoption of a Ricardian contract designed to manage consent relating to healthcare data.

The blockchain infrastructure used is based on the development network provided by Hardhat, while transactions are executed via the MetaMask extension.

### Key features

The implemented solution allows you to:

1) Create a new pod by associating it with an Ethereum address;

2) View requests for access to pod data, presented in the form of an informed consent contract that the user is required to sign;

3) Revoke previously granted authorisations through a dedicated modal window available on the server homepage.

## Getting Started

### Clone the repo

```shell
git clone https://github.com/gsepe-dev/CommunitySolidServer.git
```

### Move to the correct folder

```shell
cd CommunitySolidServer/
```

### Change branch

```shell
git checkout riccy
```

### Install dependencies

```shell
npm install
```

## Deploy

### Preliminary instructions

Before proceeding, ensure that you have deployed the ricardian contract [PodAuthorization](https://github.com/gsepe-dev/css-smartcontracts-thesis)

### Start the server

1) Version without data persistence

To run the server without data persistence, use the following command:

```shell
npm start -- -c @css:config/file.json
```

2) Version with data persistence

To start the server with data persistence, you must first create a folder on the server that will serve as the archive (the folder name can be customised).

With the following command, the name **data** is used:

```shell
npm start -- -c @css:config/file.json -f data/
```

## Built With

* [CommunitySolidServer](https://github.com/CommunitySolidServer/CommunitySolidServer) - Open and modular implementation of the Solid specifications;

* [npm](https://www.npmjs.com/) - Tool for installing and managing JavaScript modules and packages for Node.js applications.

## License

This project is licensed under the MIT License