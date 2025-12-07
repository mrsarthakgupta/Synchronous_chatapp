import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, useGetCurrentUserInfoQuery } from "./features/user.slice";
import { toast } from "sonner";

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userInfo);
  const isAuthenticated = !!user;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userInfo);
  const isAuthenticated = !!user;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};
const App = () => {
  const userData = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();

  const { data, refetch} = useGetCurrentUserInfoQuery();
  useEffect(() => {
    const getuserData = async () => {
      try {
        const result = await refetch().unwrap();
        if (result.user && result.user.userId) {
          dispatch(setUserInfo(result.user));
          setLoading(false);
        } else {
          dispatch(setUserInfo(null));
        }
      } catch (err) {
        dispatch(setUserInfo(null));
        // toast.error(err?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (!userData) {
      getuserData();
    } else {
      setLoading(false);
    }
  }, [userData]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};


export default App;
