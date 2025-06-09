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
import StudentDetails from "../components/studentDetails";
import EditStudent from "../components/editStudent";
import AttendanceDetails from "../components/attendanceDetail";
import AttendancePanel from "../components/attendancePanel";
import Notify from "../components/notify";
import ApprovalPanel from "../components/approvalPanel";
import ApprovalDetails from "../components/ApprovalDetails";
import SchedulePanel from "../components/schedulePanel";
import TaskPanel from "../components/taskPanel";
const publicRoutes = [
  {
    path: "/",
    element: <Login />
  }
];

const protectedRoutes = [
  {
    path: "/admin",
    element: <ProtectedRoute />, 
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
            path: "notify",
            element: <Notify />,
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
              {
                path: "edit-student/:idSlug",
                element: <EditStudent />,
              },
              {
                path: "student-details/:idSlug",
                element: <StudentDetails />,
              },
            ],
          },
          {
            path: "schedule",
            element: <Schedule />,
            children: [
              {
                index: true,
                element: <Navigate to="schedule-list" replace />,
              },
              {
                path: "schedule-list",
                element: <SchedulePanel />,
              }]
          },
          {
            path: "report",
            element: <Report />,
          },
          {
            path: "approval",
            element: <Approval />,
             children:[
             {
                index: true,
                element: <Navigate to="approval-list" replace />,
              },
              {
                path:'approval-list',
                element:<ApprovalPanel/>
              }
              ,
              {
                path:'approval-details/:idSlug',
                element:<ApprovalDetails/>
              }
            ]
          },
          {
            path: "attendance",
            element: <Attendance />,
            children:[
             {
                index: true,
                element: <Navigate to="attendance-list" replace />,
              },
              {
                path:'attendance-list',
                element:<AttendancePanel/>
              }
              ,
              {
                path:"attendance-details/:idSlug",
                element: <AttendanceDetails/>
              }
            ]
          },
          {
            path: "task",
            element: <Task />,
             children:[
             {
                index: true,
                element: <Navigate to="task-list" replace />,
              },
              {
                path:'task-list',
                element:<TaskPanel/>
              }
            ]
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

        <Test />
    ),
  },
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
