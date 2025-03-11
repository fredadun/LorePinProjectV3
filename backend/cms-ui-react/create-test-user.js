/**
 * create-test-user.js
 * 
 * This script creates a test user in the Firebase Auth emulator.
 * It's useful for development and testing purposes.
 * 
 * Usage: node create-test-user.js
 */

const axios = require('axios');
const dotenv = require('dotenv');
const chalk = require('chalk');

// Load environment variables
dotenv.config();

// Get Auth emulator host from environment variables
const authEmulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
const [host, port] = authEmulatorHost.split(':');

// Default test user credentials
const DEFAULT_TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  displayName: 'Test User',
  disabled: false
};

// Allow command line arguments to override defaults
const args = process.argv.slice(2);
const userEmail = args[0] || DEFAULT_TEST_USER.email;
const userPassword = args[1] || DEFAULT_TEST_USER.password;
const userDisplayName = args[2] || DEFAULT_TEST_USER.displayName;

// Create the user object
const user = {
  ...DEFAULT_TEST_USER,
  email: userEmail,
  password: userPassword,
  displayName: userDisplayName
};

console.log(chalk.blue('🔑 Creating test user in Firebase Auth emulator...'));
console.log(chalk.gray(`Auth Emulator: ${authEmulatorHost}`));
console.log(chalk.gray(`Email: ${user.email}`));
console.log(chalk.gray(`Password: ${user.password}`));
console.log(chalk.gray(`Display Name: ${user.displayName}`));

// Create the user in the Auth emulator
async function createUser() {
  try {
    // Check if Auth emulator is running
    try {
      await axios.get(`http://${authEmulatorHost}/`);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(chalk.red('❌ Firebase Auth emulator is not running.'));
        console.log(chalk.yellow('Please start the Firebase emulators first:'));
        console.log(chalk.gray('  firebase emulators:start'));
        process.exit(1);
      }
    }

    // Create the user
    const response = await axios.post(
      `http://${authEmulatorHost}/identitytoolkit.googleapis.com/v1/projects/demo-project/accounts`,
      {
        localId: user.email.replace(/[^a-zA-Z0-9]/g, ''),
        email: user.email,
        passwordHash: Buffer.from(`${user.password}`).toString('base64'),
        displayName: user.displayName,
        disabled: user.disabled
      }
    );

    if (response.status === 200) {
      console.log(chalk.green('✅ Test user created successfully!'));
      console.log(chalk.blue('\nYou can now sign in with:'));
      console.log(chalk.gray(`Email: ${user.email}`));
      console.log(chalk.gray(`Password: ${user.password}`));
      
      // Create admin user if this is the default test user
      if (user.email === DEFAULT_TEST_USER.email) {
        await createAdminUser();
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 400 && 
        error.response.data.error && 
        error.response.data.error.message === 'DUPLICATE_LOCAL_ID') {
      console.log(chalk.yellow('⚠️ User already exists.'));
      console.log(chalk.blue('You can sign in with:'));
      console.log(chalk.gray(`Email: ${user.email}`));
      console.log(chalk.gray(`Password: ${user.password}`));
    } else {
      console.error(chalk.red('❌ Error creating test user:'));
      console.error(error.response ? error.response.data : error.message);
    }
  }
}

// Create an admin user for testing admin functionality
async function createAdminUser() {
  try {
    const adminUser = {
      email: 'admin@example.com',
      password: 'admin123',
      displayName: 'Admin User',
      disabled: false
    };

    const response = await axios.post(
      `http://${authEmulatorHost}/identitytoolkit.googleapis.com/v1/projects/demo-project/accounts`,
      {
        localId: adminUser.email.replace(/[^a-zA-Z0-9]/g, ''),
        email: adminUser.email,
        passwordHash: Buffer.from(`${adminUser.password}`).toString('base64'),
        displayName: adminUser.displayName,
        disabled: adminUser.disabled,
        customAttributes: JSON.stringify({
          admin: true,
          role: 'admin'
        })
      }
    );

    if (response.status === 200) {
      console.log(chalk.green('\n✅ Admin user created successfully!'));
      console.log(chalk.blue('You can sign in as admin with:'));
      console.log(chalk.gray(`Email: ${adminUser.email}`));
      console.log(chalk.gray(`Password: ${adminUser.password}`));
    }
  } catch (error) {
    if (error.response && error.response.status === 400 && 
        error.response.data.error && 
        error.response.data.error.message === 'DUPLICATE_LOCAL_ID') {
      console.log(chalk.yellow('\n⚠️ Admin user already exists.'));
    } else {
      console.error(chalk.red('\n❌ Error creating admin user:'));
      console.error(error.response ? error.response.data : error.message);
    }
  }
}

// Run the script
createUser(); 