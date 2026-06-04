import { Navigate } from "react-router-dom";
import { userUtils } from "@/utils/helpers";
import Landing from "./Landing";

export default function Index() {
  if (userUtils.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Landing />;
}
