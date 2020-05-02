import { MeetingService } from "../../services/meeting";

export const LOAD_MEETINGS = "MEETING/LOAD";

export const loadMeetings = () => {
  return (dispatch) => {
    MeetingService.getPersonalMeetings().then(({ data }) => {
      dispatch({
        type: LOAD_MEETINGS,
        meetings: data,
      });
    });
  };
};
