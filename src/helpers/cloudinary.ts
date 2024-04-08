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

  return Promise.all(uploadPromise);
};

export const deleteFromCloudinary = async (urls: Array<string>) => {
  const deletePromise = urls.map(
    (url) =>
      new Promise<{ result: string }>((resolve) => {
        const publicId = url.split("/").slice(-2).join("/").split(".")[0];
        cloudinary.v2.uploader.destroy(publicId).then((res) => resolve(res));
      })
  );

  const response = await Promise.all(deletePromise);
  const isSuccess =
    response.filter((res) => res.result === "ok").length === urls.length;

  return { success: isSuccess };
};
