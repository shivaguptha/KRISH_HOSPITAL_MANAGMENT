import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone,  dob, gender, password, confirmpassword } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !password ||
    !confirmpassword
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }
  if (password !== confirmpassword) {
    return next(new ErrorHandler("Password didn't match", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    confirmpassword,
    role: "Patient",
  });
  generateToken(user, "User Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
 
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  if (!(user.role==="Admin" || user.role === "Doctor")) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  generateToken(user, "Logged In Successfully!", 201, res);
  // Example backend response
res.status(201).json({
  success: true,
  message: "Logged In Successfully!",
  user: { email: user.email, role: user.role},
});

});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, gender, password, confirmpassword } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !password ||
    !confirmpassword
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }
  if (password !== confirmpassword) {
    return next(new ErrorHandler("Password didn't match", 400));
  }


  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    confirmpassword,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    confirmpassword,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !confirmpassword ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  if (password !== confirmpassword) {
    return next(new ErrorHandler("Password didn't match", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

// Delete Doctor
export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await User.findById(id);
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }
  // Delete avatar from Cloudinary
  if (doctor.docAvatar?.public_id) {
    await cloudinary.uploader.destroy(doctor.docAvatar.public_id);
  }
  await User.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Doctor Deleted!",
  });
});

// Update Doctor
export const updateDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await User.findById(id);
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    doctorDepartment,
  } = req.body;

  // Update fields if provided
  if (firstName) doctor.firstName = firstName;
  if (lastName) doctor.lastName = lastName;
  if (email) doctor.email = email;
  if (phone) doctor.phone = phone;
  if (dob) doctor.dob = dob;
  if (gender) doctor.gender = gender;
  if (doctorDepartment) doctor.doctorDepartment = doctorDepartment;

  // Handle avatar update
  if (req.files?.docAvatar) {
    const docAvatar = req.files.docAvatar;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported!", 400));
    }
    // Delete old avatar
    if (doctor.docAvatar?.public_id) {
      await cloudinary.uploader.destroy(doctor.docAvatar.public_id);
    }
    // Upload new avatar
    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath
    );
    doctor.docAvatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  await doctor.save();
  res.status(200).json({
    success: true,
    message: "Doctor Details Updated!",
    doctor,
  });
});


export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
      secure: true,
      sameSite: "None"
    });
});

// Logout function for frontend patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite: "None",
      secure: true
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});