import { APIService } from "./api";

const getAvailableParticipants = () => {
  return APIService.get("/meetings/available-participants");
};

const createMeeting = (meetingData, participants) => {
  return APIService.post("/meetings", {
    meetingData,
    participants,
  });
};

const getMeetingDetails = (id) => {
  return APIService.get(`/meetings/${id}`);
};

const updateMeeting = (meetingData, participants) => {
  return APIService.patch(`/meetings/${meetingData.id}`, {
    meetingData,
    participants,
  });
};

const getPersonalMeetings = () => {
  return APIService.get("/meetings/me");
};

const cancelMeeting = (id) => {
  return APIService.delete(`/meetings/${id}`);
};

const uploadMeetingRecord = (id, file) => {
  return APIService.post(`/meetings/${id}/record`, {
    file,
  });
};

export const MeetingService = {
  getAvailableParticipants,
  createMeeting,
  getMeetingDetails,
  updateMeeting,
  getPersonalMeetings,
  cancelMeeting,
  uploadMeetingRecord,
};
