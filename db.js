const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true}
})

const adminSchema = new mongoose.Schema({
    name: { type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true}
})

const courseSchema = new mongoose.Schema({
    title: {type: String},
    description: {type: String},
    price: {type: Number},
    imageUri: {type: String},
    createdID: {type: mongoose.Types.ObjectId}
})

const purchaseSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User'},
    courseId: {type: mongoose.Types.ObjectId, ref: 'Course'}
})

const UserModel = mongoose.model('User', userSchema);
const AdminModel = mongoose.model('Admin', adminSchema);
const CourseModel = mongoose.model('Course', courseSchema);
const PurchaseModel = mongoose.model('Purchase', purchaseSchema);

module.exports = {
    UserModel: UserModel,
    AdminModel: AdminModel,
    CourseModel: CourseModel,
    PurchaseModel: PurchaseModel
}