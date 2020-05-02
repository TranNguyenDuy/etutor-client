import React from "react";
import { withAuthorizedUser } from "./hocs/withAuth";

// Main components
const Dashboard = React.lazy(() => import("./views/Pages/Dashboard/Dashboard"));
const Users = React.lazy(() => import("./views/Pages/Users/Users"));
const UserForm = React.lazy(() => import("./views/Pages/Users/UserForm"));
const Messages = React.lazy(() => import("./views/Pages/Messages/Messages"));
const MeetingForm = React.lazy(() =>
  import("./views/Pages/Meeting/MeetingForm")
);
const Documents = React.lazy(() => import("./views/Pages/Document/Documents"));
const Blog = React.lazy(() => import("./views/Pages/Blog/Blog"));
const PostForm = React.lazy(() => import("./views/Pages/Blog/PostForm"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: withAuthorizedUser(Dashboard),
  },
  {
    path: "/staffs/add",
    exact: true,
    name: "Add New Staff",
    component: withAuthorizedUser(UserForm, ["admin"]),
    data: { role: "staff", mode: "create" },
  },
  {
    path: "/tutors/add",
    exact: true,
    name: "Add New Tutor",
    component: withAuthorizedUser(UserForm, ["admin", "staff"]),
    data: { role: "tutor", mode: "create" },
  },
  {
    path: "/students/add",
    exact: true,
    name: "Add New Student",
    component: withAuthorizedUser(UserForm, ["admin", "staff", "tutor"]),
    data: { role: "student", mode: "create" },
  },
  {
    path: "/staffs/:id",
    exact: true,
    name: "Staff Details",
    component: withAuthorizedUser(UserForm, ["admin", "staff"]),
    data: { role: "staff", mode: "edit" },
  },
  {
    path: "/tutors/:id",
    exact: true,
    name: "Tutor Details",
    component: withAuthorizedUser(UserForm, ["admin", "staff"]),
    data: { role: "tutor", mode: "edit" },
  },
  {
    path: "/students/:id",
    exact: true,
    name: "Student Details",
    component: withAuthorizedUser(UserForm, ["admin", "staff", "tutor"]),
    data: { role: "student", mode: "edit" },
  },
  {
    path: "/staffs",
    exact: true,
    name: "Staffs",
    component: withAuthorizedUser(Users, ["admin", "staff"]),
    data: { role: "staff" },
  },
  {
    path: "/tutors",
    exact: true,
    name: "Tutors",
    component: withAuthorizedUser(Users, ["admin", "staff"]),
    data: { role: "tutor" },
  },
  {
    path: "/students",
    exact: true,
    name: "Students",
    component: withAuthorizedUser(Users, ["admin", "staff", "tutor"]),
    data: { role: "student" },
  },
  {
    path: "/messages/:conversationId",
    exact: true,
    name: "Messages",
    component: withAuthorizedUser(Messages, ["tutor", "student"]),
  },
  {
    path: "/meetings/new",
    exact: true,
    name: "New Meeting",
    component: withAuthorizedUser(MeetingForm),
    data: { mode: "create", name: "Create Meeting" },
  },
  {
    path: "/meetings/:id",
    exact: true,
    name: "Meeting Details",
    component: withAuthorizedUser(MeetingForm),
    data: { mode: "edit", name: "Meeting Details" },
  },
  {
    path: "/documents",
    exact: true,
    name: "Documents",
    component: withAuthorizedUser(Documents),
  },
  {
    path: "/blog",
    exact: true,
    name: "Blog",
    component: withAuthorizedUser(Blog),
  },
  {
    path: "/blog/:id/edit",
    exact: true,
    name: "Edit Post",
    component: withAuthorizedUser(PostForm),
  },
  {
    path: "/blog/new",
    exact: true,
    name: "Create new Post",
    component: withAuthorizedUser(PostForm),
  },
];

export default routes;
