import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Link,
} from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";

const LoginPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangePassWord, setIsChangePassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          username,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.existingUser.username);
      router.push("/staffManagement");
    } catch (error) {
     alert(error);
      // Handle error, e.g. display error message to user
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
        {
          username,
          password,
        }
      );
      // Store token in local storage or state, and navigate to dashboard
      // Example: localStorage.setItem("token", response.data.token);
      //   router.push("/dashboard");
    } catch (error) {
      alert(error);
      // Handle error, e.g. display error message to user
    }
  };

  const handleChangePassword = async () => {
    setNewPassword("");
    setConfirmPassword("");
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`,
        {
          username: username, // Replace with actual username
          oldPassword: confirmPassword, // Replace with actual old password
          newPassword: newPassword, // Replace with actual new password
        }
      );
    } catch (error) {
      alert(error);
      // Handle error, e.g. display error message to user
    }
    setIsChangePassword(!isChangePassWord);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${"/bg.jpg"})`,
        margin: "0px",
        height: "100vh",
        width: "100%",
      }}
    >
      <h1
        style={{
          paddingTop: "50px",
          marginBottom: "50px",
          fontSize: "40px",
          textAlign: "center",
          color: "rgb(25 118 210 / 86%)",
        }}
      >
        Teachers Salary ManageMent System
      </h1>
      <Grid style={{ justifyContent: "center" }} container>
        <Grid item xs={12} md={4}>
          <Typography
            style={{ marginBottom: "40px", textTransform: "uppercase" }}
            variant="h4"
            align="center"
            gutterBottom
          >
            {!isChangePassWord ? (
              <>{isSignUp ? "Sign Up" : "Log In"}</>
            ) : (
              <>{`Change Password`}</>
            )}
          </Typography>
          <form>
            <Grid container spacing={2}>
              {!isChangePassWord ? (
                <>
                  {" "}
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      type="username"
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      type="password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {isSignUp ? (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSignUp}
                      >
                        Sign Up
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleLogin}
                      >
                        Log In
                      </Button>
                    )}
                  </Grid>
                  {/*...Other code...*/}
                  <Grid item xs={12}>
                    {isSignUp ? (
                      <Typography align="center">
                        Already have an account?{" "}
                        <Link href="#" onClick={() => setIsSignUp(false)}>
                          Log In
                        </Link>
                      </Typography>
                    ) : (
                      <Typography align="center">
                        Don't have an account?{" "}
                        <Link href="#" onClick={() => setIsSignUp(true)}>
                          Sign Up
                        </Link>
                      </Typography>
                    )}
                    <Typography align="center">
                      <Link href="#" onClick={() => setIsChangePassword(true)}>
                        Change Password
                      </Link>
                    </Typography>
                  </Grid>
                </>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      type="username"
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Old Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleChangePassword()}
                    >
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </form>
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <Image width={500} height={600} src={`/login.jpg`}></Image>
        </Grid> */}
      </Grid>
    </div>
  );
};

export default LoginPage;
