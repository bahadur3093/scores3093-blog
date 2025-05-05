import { generateToken } from "../utils/generateToken.util";

const payload = { id: "12345", email: "test@example.com" };
const token = generateToken(payload, 604800); // 7 days in seconds

console.log("Generated Token:", token);
