import { connectToDB } from "@/lib/db";
import UserModel from "@/models/User";
import NodeModel from "@/models/Node";
import EdgeModel from "@/models/Edge";
import bcrypt from "bcryptjs";

async function seed() {
  await connectToDB();
  console.log("Connected to DB");

  // create users
  const adminEmail = "admin@riwama.gov.ng";
  const operatorEmail = "operator@riwama.gov.ng";

  const adminExists = await UserModel.findOne({ email: adminEmail });
  if (!adminExists) {
    const hashed = await bcrypt.hash("Admin123", 10);
    await UserModel.create({ name: "Admin User", email: adminEmail, password: hashed, role: "admin" });
    console.log("Created admin user");
  }

  const opExists = await UserModel.findOne({ email: operatorEmail });
  if (!opExists) {
    const hashed = await bcrypt.hash("Operator123", 10);
    await UserModel.create({ name: "Operator User", email: operatorEmail, password: hashed, role: "operator" });
    console.log("Created operator user");
  }

  // create sample nodes
  const nodes = [
    { name: "Point A", coordinates: [4.7842, 7.0337] },
    { name: "Point B", coordinates: [4.7865, 7.0340] },
    { name: "Point C", coordinates: [4.7880, 7.0370] },
  ];

  // Clean and insert nodes
  await NodeModel.deleteMany({});
  const created = await NodeModel.insertMany(nodes);
  console.log("Inserted nodes", created.length);

  // create edges between consecutive nodes
  await EdgeModel.deleteMany({});
  const edges = [
    { fromNode: created[0]._id, toNode: created[1]._id, weight: 1.2 },
    { fromNode: created[1]._id, toNode: created[2]._id, weight: 1.0 },
    { fromNode: created[0]._id, toNode: created[2]._id, weight: 2.5 },
  ];
  await EdgeModel.insertMany(edges);
  console.log("Inserted edges");

  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
