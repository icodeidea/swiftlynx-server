// First install required packages:
// npm install mysql2
// npm install @types/mysql2
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateWallets = exports.bulkCreateUsers = exports.connectToMongoDatabase = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const crypto_1 = require("crypto");
const argon2_1 = __importDefault(require("argon2"));
// db.ts
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const wallet_1 = __importDefault(require("../models/wallet"));
// MongoDB connection configuration
const MONGODB_CONFIG = {
    username: 'doadmin',
    password: 'sZxw6m270qv14y39',
    cluster: 'swift-db-mongodb-fra1-56586-aae9133a.mongo.ondigitalocean.com',
    database: 'admin',
    options: {
        retryWrites: true,
        w: 'majority'
    }
};
// Construct MongoDB connection URL with proper authentication
const MONGODB_URI = `mongodb+srv://${MONGODB_CONFIG.username}:${MONGODB_CONFIG.password}@${MONGODB_CONFIG.cluster}/${MONGODB_CONFIG.database}?retryWrites=true&w=majority`;
// MongoDB connection URL (preferably from environment variables)
// const MONGODB_URI = "mongodb+srv://swift-db-mongodb-fra1-56586-aae9133a.mongo.ondigitalocean.com/?retryWrites=true&w=majority";
// Connect to MongoDB
async function connectToMongoDatabase() {
    try {
        // Suppress strictQuery warning
        mongoose_1.default.set('strictQuery', false); // or true, depending on your preference
        await mongoose_1.default.connect(MONGODB_URI, {
            // Add any additional connection options here
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });
        console.log('Successfully connected to MongoDB.');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
exports.connectToMongoDatabase = connectToMongoDatabase;
// Bulk create users function
async function bulkCreateUsers(users) {
    try {
        // Create users in bulk
        const result = await user_1.default.insertMany(users, {
            ordered: false,
            rawResult: true // Returns detailed information about the operation
        });
        console.log(`Successfully inserted ${result.insertedCount} users`);
        return result.mongoose.results;
    }
    catch (error) {
        //   if (error instanceof mongoose.Error) {
        //     console.log(`Partially inserted ${error.insertedDocs.length} users`);
        //     console.error('Bulk write error:', error.writeErrors);
        //   } else {
        //     console.error('Error creating users:', error);
        //   }
        console.error('Error creating users:', error);
        throw error;
    }
}
exports.bulkCreateUsers = bulkCreateUsers;
// Bulk create users function
async function bulkCreateWallets(wallets) {
    try {
        // Create Wallet in bulk
        const result = await wallet_1.default.insertMany(wallets, {
            ordered: false,
            rawResult: true // Returns detailed information about the operation
        });
        console.log(`Successfully inserted ${result.insertedCount} users`);
        return result.mongoose.results;
    }
    catch (error) {
        //   if (error instanceof mongoose.Error) {
        //     console.log(`Partially inserted ${error.insertedDocs.length} users`);
        //     console.error('Bulk write error:', error.writeErrors);
        //   } else {
        //     console.error('Error creating users:', error);
        //   }
        console.error('Error creating users:', error);
        throw error;
    }
}
exports.bulkCreateWallets = bulkCreateWallets;
const getFirstAndLastName = (name) => {
    const parts = name.split(" ");
    const firstName = parts[0] || ""; // First part is the first name
    const lastName = parts.length > 1 ? parts[parts.length - 1] : firstName; // Copy firstName if lastName is empty
    return { firstName, lastName };
};
// Database configuration
const dbConfig = {
    host: 'swiftlynxtechnologies.com',
    user: 'swiftlyn_swiftlyn_1',
    password: 'swiftlyn_swiftlyn_',
    database: 'swiftlyn_swiftlyn_',
};
// MySQL connection string format:
// mysql://username:password@host:port/database
const connectionString = `mysql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:3306/${dbConfig.database}`;
async function connectToDatabase() {
    try {
        // Create connection
        const connection = await promise_1.default.createConnection(connectionString);
        console.log('Successfully connected to database');
        return connection;
    }
    catch (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
}
async function executeQuery() {
    let connection;
    try {
        connection = await connectToDatabase();
        // Example query with type safety
        const [rows] = await connection.execute('SELECT * FROM your_table WHERE id = ?', [1]);
        console.log('Query results:', rows);
        return rows;
    }
    catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
    finally {
        if (connection) {
            try {
                await connection.end();
                console.log('Connection closed successfully');
            }
            catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}
// get all users
async function getAllUsers() {
    let connection;
    try {
        connection = await connectToDatabase();
        // Example query with type safety
        const [rows] = await connection.execute('SELECT * FROM users');
        console.log('Query results:', rows.length);
        return rows;
    }
    catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
    finally {
        if (connection) {
            try {
                await connection.end();
                console.log('Connection closed successfully');
            }
            catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}
// get all users
async function getAllInvestments(userId) {
    let connection;
    try {
        connection = await connectToDatabase();
        // Example query with type safety
        const [rows] = await connection.execute('SELECT * FROM investments WHERE user = ?', [userId]);
        console.log('Query results:', rows.length);
        return rows;
    }
    catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
    finally {
        if (connection) {
            try {
                await connection.end();
                console.log('Connection closed successfully');
            }
            catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}
// function to update users with wallet IDs
async function updateUsersWithWallets(users, wallets) {
    try {
        const updateOperations = users.map((user, index) => ({
            updateOne: {
                filter: { _id: user._id },
                update: { $set: { wallet: wallets[index]._id } }
            }
        }));
        const result = await user_1.default.bulkWrite(updateOperations);
        console.log(`Successfully updated ${result.modifiedCount} users with wallet IDs`);
    }
    catch (error) {
        console.error('Error updating users with wallet IDs:', error);
        throw error;
    }
}
// Example usage with async/await
async function main() {
    try {
        await connectToMongoDatabase();
        // Find all users
        // get allusers
        const old_users = await getAllUsers();
        const new_users = [];
        for (let i = 0; i < old_users.length; i++) {
            let o_user = old_users[i];
            const { firstName, lastName } = getFirstAndLastName(o_user.fullname);
            const salt = (0, crypto_1.randomBytes)(32);
            const hashedPassword = await argon2_1.default.hash(o_user.password, { salt });
            const profilePic = `https://www.swiftlynxtechnologies.com/public/authed_assets/images/profile_picture/${o_user === null || o_user === void 0 ? void 0 : o_user.picture}`;
            new_users.push({
                firstname: firstName,
                lastname: lastName,
                accountType: 'individual',
                email: o_user.email,
                username: `${firstName}-${lastName}-${i}`,
                picture: profilePic,
                refId: `${firstName}-${lastName}-${Math.floor(100000 + Math.random() * 900000)}`,
                salt: salt.toString('hex'),
                password: hashedPassword,
                oneTimeSetup: true,
                verified: {
                    isVerified: true,
                    token: null,
                    expires: Date.now() + 30 * 60 * 1000 // 30 minutes in milliseconds
                },
                metadata: o_user
            });
        }
        // bulk create users
        const n_users = await bulkCreateUsers(new_users);
        // create wallet
        const wallets = n_users.map((user) => ({
            user: user.id || user._id,
        }));
        const n_wallets = await bulkCreateWallets(wallets);
        console.log("created wallets", n_wallets);
        // update each n_users created with wallet id eg: user.wallet = wallet.id 
        // Update users with their corresponding wallet IDs
        await updateUsersWithWallets(n_users, n_wallets);
        console.log('Migration completed successfully');
    }
    catch (err) {
        console.error('Error in main:', err);
    }
}
console.log("running main function");
// Run the main function
main();
//# sourceMappingURL=migrate_users.js.map