import { APIService } from "./api";

const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("document", file);
  return APIService.post(`/files/document`, formData, {
    headers: {
      "Content-Type":
        "multipart/form-data; boundary=<calculated when request is sent>",
    },
  });
};

export const FileService = {
  uploadFile,
};
