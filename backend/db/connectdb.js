import { MongoClient } from "mongodb";

async function connectToDatabase(connectionString) {
const client = new MongoClient(connectionString);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("testDB"); // Replace 'testDB' with your database name
    const collection = database.collection("testCollection"); // Example collection
    // Perform database operations here
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

export default connectToDatabase;