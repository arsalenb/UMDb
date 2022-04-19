import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";

const LOGIN_URL = "/login";

const Login = () => {
  const { auth, setAuth } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fetchData = async () => {
      const data = await fetch("https://yourapi.com");
    };
    try {
      setLoading(true);

      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({
          username: login,
          email: login,
          password,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const accessToken = response.data.accessToken;
      const roles = response.data.roles;
      const id = response.data.id;
      const username = response.data.username;
      setAuth({ id, username, roles, accessToken });
      navigate("/");
      setLoading(false);
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response.");
      } else if (err.response?.status === 400) {
        setErrorMessage("Missing Username,Email or Password.");
      } else if (err.response?.status === 401) {
        setErrorMessage("Invalid Credentials.");
      } else {
        setErrorMessage("Login Failed.");
      }
      setLoading(false);
    }
  };
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" inverted textAlign="center">
          Log-in to your account
        </Header>
        {errorMessage && (
          <Message
            error
            header="There were some errors with your operation"
            content={errorMessage}
          />
        )}
        <Form onSubmit={handleSubmit} size="large">
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address / Username"
              required
              onChange={(e) => {
                setLogin(e.target.value);
              }}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              color="black"
              fluid
              size="large"
              type="submit"
              loading={loading}
              disabled={login === "" || password === ""}
            >
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us?{" "}
          <a
            href="#"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
