import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./Componenet/firestoreconfig";
import Signup from "./Componenet/Signup";
import Login from "./Componenet/Login";
import Todo from "./Componenet/Todo";
import { Spinner, Flex } from "@chakra-ui/react";
import Sidebar from "./Componenet/Sidebar";
import ProtectedContent from "./Componenet/ProtectedContent";
import { useStrictDroppable } from "./Componenet/useStrictDroppable";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Flex align="center" minHeight="100vh" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Routes>
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/login" element={<Login />} />
      <Route
        exact
        path="/protected"
        element={
          <Sidebar>
            <ProtectedContent user={user} />
          </Sidebar>
        }
      />
      <Route
        exact
        path="/dnd"
        element={<Sidebar>{/* <dragndrop /> */}</Sidebar>}
      />
      <Route
        exact
        path="/todo"
        element={
          <Sidebar>
            <Todo user={user} loading={loading} />
          </Sidebar>
        }
      />
      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
