import store from "./redux";

const getClass = (...roles) => {
  const state = store.getState();
  if (!state.auth.user) return "d-none";
  let className;
  if (!roles || roles.length === 0) return className;
  const matchedRole = roles.includes(state.auth.user.role);
  if (!matchedRole) className = "d-none";
  return className;
};

export default () => ({
  items: [
    {
      title: true,
      name: "Navigations",
    },
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: "icon-speedometer",
    },
    {
      name: "Users",
      url: "/users",
      icon: "icon-people",
      class: getClass("admin", "staff"),
      children: [
        {
          name: "Staffs",
          url: "/staffs",
          class: getClass("admin", "staff"),
        },
        {
          name: "Tutors",
          url: "/tutors",
          class: getClass("admin", "staff"),
        },
        {
          name: "Students",
          url: "/students",
          class: getClass("admin", "staff", "tutor"),
        },
      ],
    },
    {
      name: "Documents",
      url: "/documents",
      icon: "icon-docs",
    },
    {
      name: "Blog",
      url: "/blog",
      icon: "icon-globe",
    },
  ],
});
