import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email has already taken"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

// compare function
userSchema.methods.comparePassword = async function (plainPass) {
  return await bcrypt.compare(plainPass, this.password);
};

//JWT
userSchema.methods.generateToken = () => {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const userModel = mongoose.model("Users", userSchema);

export default userModel;
