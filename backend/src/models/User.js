import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationTokenExpiry: {
      type: Date,
      default: null,
    },
    tempPassword: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

const User = mongoose.model("User", userSchema)

export default User



// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     fullName: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     profilePic: {
//       type: String,
//       default: "",
//     },
//   },
//   { timestamps: true } // createdAt & updatedAt
// );

// const User = mongoose.model("User", userSchema);

// export default User;
