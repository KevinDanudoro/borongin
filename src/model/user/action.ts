import { UserModel } from ".";

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserById = (id: string) => UserModel.findById(id);
export const getUserByToken = (token: string) =>
  UserModel.findOne({ "authentication.sessionToken": token });

export const createUser = (newUser: Record<string, any>) =>
  UserModel.create(newUser);
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);
export const updateUserById = (id: string, newUser: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, newUser);
