const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  userType: {
    type: String,
    required: true,
    enum: ['provider'],
    default: 'provider'
  },
  
  // Business Information
  businessName: {
    type: String,
    trim: true,
    maxlength: [200, 'Business name cannot exceed 200 characters']
  },
  businessType: {
    type: String,
    enum: [
      'Equipment Rental',
      'Farm Services', 
      'Agricultural Contractor',
      'Equipment Dealer',
      'Other'
    ]
  },
  licenseNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'License number cannot exceed 50 characters']
  },
  serviceArea: {
    type: String,
    trim: true,
    maxlength: [300, 'Service area cannot exceed 300 characters']
  },
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    max: [100, 'Experience cannot exceed 100 years']
  },
  certifications: {
    type: String,
    maxlength: [1000, 'Certifications cannot exceed 1000 characters']
  },
  
  // Provider Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Verification and Security
  emailVerificationToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  
  // Business Documents
  businessDocuments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Profile and Business Info
  profileImage: {
    type: String // URL to profile image
  },
  businessLogo: {
    type: String // URL to business logo
  },
  
  // Statistics
  totalEquipment: {
    type: Number,
    default: 0
  },
  totalRentals: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Activity
  lastLogin: {
    type: Date
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
providerSchema.index({ email: 1 });
providerSchema.index({ businessName: 1 });
providerSchema.index({ businessType: 1 });
providerSchema.index({ serviceArea: 1 });
providerSchema.index({ isActive: 1, isVerified: 1 });
providerSchema.index({ rating: -1 });

// Virtual for provider's public profile
providerSchema.virtual('publicProfile').get(function() {
  return {
    id: this._id,
    name: this.name,
    businessName: this.businessName,
    businessType: this.businessType,
    serviceArea: this.serviceArea,
    experience: this.experience,
    rating: this.rating,
    reviewCount: this.reviewCount,
    totalEquipment: this.totalEquipment,
    joinedAt: this.joinedAt
  };
});

// Virtual for provider's full profile
providerSchema.virtual('fullProfile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    address: this.address,
    businessName: this.businessName,
    businessType: this.businessType,
    licenseNumber: this.licenseNumber,
    serviceArea: this.serviceArea,
    experience: this.experience,
    certifications: this.certifications,
    isVerified: this.isVerified,
    rating: this.rating,
    reviewCount: this.reviewCount,
    totalEquipment: this.totalEquipment,
    createdAt: this.createdAt
  };
});

// Pre-save middleware to hash password
providerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  // const bcrypt = require('bcryptjs');
  // this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
providerSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  // const bcrypt = require('bcryptjs');
  // return await bcrypt.compare(candidatePassword, userPassword);
  return candidatePassword === userPassword; // For now, simple comparison
};

// Instance method to create password reset token
providerSchema.methods.createPasswordResetToken = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  
  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

module.exports = mongoose.model('Provider', providerSchema);
