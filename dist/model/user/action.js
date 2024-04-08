"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserByEmail = exports.updateUserById = exports.deleteUserById = exports.createUser = exports.getUserById = exports.getUserByEmail = exports.getUsers = void 0;
const _1 = require(".");
const getUsers = () => _1.UserModel.find();
exports.getUsers = getUsers;
const getUserByEmail = (email) => _1.UserModel.findOne({ email });
exports.getUserByEmail = getUserByEmail;
const getUserById = (id) => _1.UserModel.findById(id);
exports.getUserById = getUserById;
const createUser = (newUser) => _1.UserModel.create(newUser);
exports.createUser = createUser;
const deleteUserById = (id) => _1.UserModel.findByIdAndDelete(id);
exports.deleteUserById = deleteUserById;
const updateUserById = (id, newUser) => _1.UserModel.findByIdAndUpdate(id, newUser);
exports.updateUserById = updateUserById;
const updateUserByEmail = (email, newUser) => _1.UserModel.findOneAndUpdate({ email }, newUser);
exports.updateUserByEmail = updateUserByEmail;
//# sourceMappingURL=action.js.map