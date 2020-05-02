import { APIService } from "./api";

const getUserList = (
  role = "student",
  query = {
    page: 0,
    pageSize: 20
  }
) => {
  return APIService.get(`/users/${role}`, query);
};

const createUser = (data, role = "student") => {
  return APIService.post(`/users/${role}`, data);
};

const getUserDetails = (id, role = "student") => {
  return APIService.get(`/users/${role}/${id}`);
};

const updateUser = (id, role, data) => {
  return APIService.patch(`/users/${role}/${id}`, data);
};

const deleteUser = (id, role) => {
  return APIService.delete(`/users/${role}/${id}`);
};

const assignTutor = (studentIds, tutorId) => {
  return APIService.post(`/users/assign-tutor`, {
    tutorId,
    studentIds
  });
};

const revokeTutor = studentId => {
  return APIService.post(`/users/${studentId}/revoke-tutor`);
};

export const UserService = {
  getUserList,
  createUser,
  getUserDetails,
  updateUser,
  deleteUser,
  assignTutor,
  revokeTutor
};
