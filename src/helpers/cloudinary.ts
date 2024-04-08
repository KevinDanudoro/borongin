import cloudinary from "cloudinary";

export const uploadToCloudinary = (
  files: Array<{ buffer: Buffer }>,
  options: { folder: string }
) => {
  const uploadPromise = files.map(
    (file) =>
      new Promise<string | undefined>((resolve) =>
        cloudinary.v2.uploader
          .upload_stream(options, (_, uploadResult) => {
            return resolve(uploadResult?.secure_url);
          })
          .end(file.buffer)
      )
  );

  return uploadPromise;
};
