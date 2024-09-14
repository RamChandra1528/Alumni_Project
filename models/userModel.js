// models/userModel.mjs
import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  // schema definition
});

const User = mongoose.model('User', userSchema);

export default User; // Use ES6 export
