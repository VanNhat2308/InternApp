import Login from "../pages/login";
import ProtectedRoute from "./protectedRoute";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/home";
import Dashboard from "../components/dashboard";
import DashboardStudent from "../components/student/dashboard";
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
import TaskDetails from "../components/taskDetails";
import FeedbackPanel from "../components/feedbackPanel";
import ChatDetails from "../components/chatDetails";
import ReportPanel from "../components/reportPanel";
import ReportDetails from "../components/reportDetails";
import ScheduleDetails from "../components/scheduleDetails";
import Register from "../components/student/register";
import Student from "../pages/student";
import ChooseLogin from "../pages/ChooseLogin";
import LoginStudent from "../pages/LoginStudent";
import SenderTest from "../components/senderTest";
import ReceiverTest from "../components/receiverTest";
import RegisterSuccess from "../components/student/registerSuccess";
import Diary from "../components/student/diary/diary";
import DiaryPanel from "../components/student/diary/diaryPanel";
import DiaryDetails from "../components/student/diary/diaryDetails";
import TaskStudent from "../components/student/task/taskStudent";
import TaskPanelStudent from "../components/student/task/taskPanelStudent";
import SwapSchedule from "../components/SwapSchedule";
import SchoolAndPosition from "../components/schoolAndPosition";
const maSv = localStorage.getItem('maSV')
const publicRoutes = [
  {
    path: "/",
    element: <ChooseLogin /> 
  },
  {
    path: "/login-admin",
    element: <Login /> 
  },
  {
    path: "/login-sinhvien",
    element: <LoginStudent /> 
  }
]

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
              },
              {
                path: "SwapSchedule/:idSlug",
                element: <SwapSchedule />,
              },
               {
                path: "schedule-details/:idSlug",
                element: <ScheduleDetails />,
              }
            
            ]
          },
          {
            path: "report",
            element: <Report />,
            children:[
             {
                index: true,
                element: <Navigate to="report-list" replace />,
              },
              {
                path:'report-list',
                element:<ReportPanel/>
              }
              ,
              {
                path:'report-details/:idSlug',
                element:<ReportDetails/>
              }]
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
              },
              {
                path:'task-details/:idSlug',
                element:<TaskDetails/>
              }
            ]
          },
          {
            path: "feedback",
            element: <Feedback />,
             children:[
             {
                index: true,
                element: <Navigate to="feedback-list" replace />,
              },
              {
                path:'feedback-list',
                element:<FeedbackPanel/>
              },
              {
                path:'conversation/:idSlug',
                element:<ChatDetails/>
              }
            ]
          },
          {
            path: "addInfo",
            element: <SchoolAndPosition />,
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
  path:"/student",
  element:<ProtectedRoute />,
 children: [
      {
        path: "",
        element: <Student />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path:'dashboard'
            ,element:<DashboardStudent/>
          },
           {
            path: "diary",
            element: <Diary />,
            children: [
              {
                index: true,
                element: <Navigate to="diary-list" replace />,
              },
              {
                path: "diary-list",
                element: <DiaryPanel />,
              },
              {
                path:"diary-details/:idSlug",
                element:<DiaryDetails/>
              }

            ]
          },
           {
            path: "attendance",
            element: <Attendance />,
            children:[
             {
                index: true,
                element: <Navigate to={`attendance-details/${maSv}`}  replace />,
              },
              {
                path:`attendance-details/${maSv}`,
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
                element:<TaskPanelStudent/>
              },
              {
                path:'task-details/:idSlug',
                element:<TaskStudent/>
              }
            ]
          },
            {
            path: "feedback",
            element: <Feedback />,
             children:[
             {
                index: true,
                element: <Navigate to="feedback-list" replace />,
              },
              {
                path:'feedback-list',
                element:<FeedbackPanel/>
              },
              {
                path:'conversation/:idSlug',
                element:<ChatDetails/>
              }
            ]
          },
          {
            path: "settings",
            element: <Settings />,
          },
            {
            path: "schedule",
            element: <Schedule />,
            children: [
              {
                index: true,
                element: <Navigate to={`schedule-list/${maSv}`} replace />,
              },
               {
                path: `schedule-list/${maSv}`,
                element: <ScheduleDetails />,
              }
            
            ]
          }
          
          
        ]
      }
]
  },
  {
            path:'register',
            element:<Register/>
          },
  {
    path: "/test",
    element: (

        <Test />
    ),
  },
  {
    path: "/testSender",
    element: (

        <SenderTest />
    ),
  },
  {
    path: "/testReceiver",
    element: (

        <ReceiverTest />
    ),
  },
  {
    path: "/register-success",
    element: (
        <RegisterSuccess />
    ),
  },
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
