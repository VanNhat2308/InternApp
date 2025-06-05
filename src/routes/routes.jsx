import Login from "../pages/login";
import ProtectedRoute from "./protectedRoute";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/home";
import Dashboard from "../components/dashboard";
import List from "../components/list";
import Schedule from "../components/schedule";
import Report from "../components/report";
import Approval from "../components/approval";
import Attendance from "../components/attendance";
import Task from "../components/task";
import Feedback from "../components/feedback";
import Settings from "../components/settings";
import ListStudentPanel from "../components/listStudentPanel";
import AddStudentPanel from "../components/addStudentPanel";
import Test from "../components/test"
const publicRoutes = [
  {
    path: "/",
    element: <Login />
  }
];

const protectedRoutes = [
  {
    path: "/admin",
    element: <ProtectedRoute />, // 🔐 Chặn không cho vào nếu chưa có token
    children: [
      {
        path: "",
        element: <Home />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "list",
            element: <List />,
            children: [
              {
                index: true,
                element: <Navigate to="student-list" replace />,
              },
              {
                path: "student-list",
                element: <ListStudentPanel />,
              },
              {
                path: "add-student",
                element: <AddStudentPanel />,
              },
            ],
          },
          {
            path: "schedule",
            element: <Schedule />,
          },
          {
            path: "report",
            element: <Report />,
          },
          {
            path: "approval",
            element: <Approval />,
          },
          {
            path: "attendance",
            element: <Attendance />,
          },
          {
            path: "task",
            element: <Task />,
          },
          {
            path: "feedback",
            element: <Feedback />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: "/test",
    element: (
      <ProtectedRoute>
        <Test />
      </ProtectedRoute>
    ),
  },
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
