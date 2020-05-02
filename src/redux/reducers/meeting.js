import { LOAD_MEETINGS } from "../actions";

export const initialMeetingState = {
  meetings: [],
};

export function meetingReduce(state = initialMeetingState, action) {
  switch (action.type) {
    case LOAD_MEETINGS:
      return {
        ...state,
        meetings: action.meetings || [],
      };
    default:
      return state;
  }
}
