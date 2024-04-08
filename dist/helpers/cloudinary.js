"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const uploadToCloudinary = (files, options) => {
    const uploadPromise = files.map((file) => new Promise((resolve) => cloudinary_1.default.v2.uploader
        .upload_stream(options, (_, uploadResult) => {
        return resolve(uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url);
    })
        .end(file.buffer)));
    return Promise.all(uploadPromise);
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = (urls) => __awaiter(void 0, void 0, void 0, function* () {
    const deletePromise = urls.map((url) => new Promise((resolve) => {
        const publicId = url.split("/").slice(-2).join("/").split(".")[0];
        cloudinary_1.default.v2.uploader.destroy(publicId).then((res) => resolve(res));
    }));
    const response = yield Promise.all(deletePromise);
    const isSuccess = response.filter((res) => res.result === "ok").length === urls.length;
    return { success: isSuccess };
});
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=cloudinary.js.map