# Lockbox - CLI Password Manager

Lockbox is a Command Line Interface (CLI) tool designed to manage passwords securely. It allows users to store, update, and retrieve passwords using a master password for authentication. Lockbox encrypts passwords before storing them, ensuring their security.

## Installation

To install Lockbox, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd lockbox
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up the master password:
   ```
   lockbox set-master -n <new-master-password>
   ```

## Usage

Lockbox provides several commands to manage passwords:

- `lockbox set-master`: Set or change the master password.
- `lockbox add`: Add or change a password in the password vault.
- `lockbox get`: Get the password for a name in the password vault.

### Setting the Master Password

To set or change the master password, use the following command:
```
lockbox set-master -n <new-master-password>
```

Replace `<new-master-password>` with your desired master password.

### Adding a Password

To add or change a password in the password vault, use the following command:
```
lockbox add -m <master-password> -n <name> -p <password>
```

Replace `<master-password>` with your master password, `<name>` with the name assigned to the password, and `<password>` with the password to assign to the name.

### Getting a Password

To get the password for a name in the password vault, use the following command:
```
lockbox get -m <master-password> -n <name>
```

Replace `<master-password>` with your master password and `<name>` with the name assigned to the password.

## Files

- `index.js`: Main file containing the CLI functionality.
- `parse.js`: File handling CSV parsing and data manipulation.
- `crypto.js`: File containing cryptographic functions for encryption, decryption, and hashing.

## Dependencies

Lockbox relies on the following npm packages:

- `commander`: For building command-line interfaces.
- `fs/promises`: For asynchronous file system operations.
- `dotenv`: For loading environment variables from a .env file.
- `csv-parse`: For parsing CSV data.
- `node:crypto`: For cryptographic functions.

## Contributing

If you'd like to contribute to Lockbox, please fork the repository and create a pull request. We welcome any improvements or bug fixes!

## License

This project is licensed under the MIT License - see the LICENSE file for details.