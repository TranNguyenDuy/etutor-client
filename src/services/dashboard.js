import { APIService } from "./api";

const getDashboardMatrix = () => {
  return APIService.get("/dashboard");
};

export const DashboardService = {
  getDashboardMatrix,
};
