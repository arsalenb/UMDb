import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Dropdown,
} from "semantic-ui-react";
import {
  DateInput,
  TimeInput,
  DateTimeInput,
  DatesRangeInput,
} from "semantic-ui-calendar-react-yz";
import { countryOptions } from "./countryOptions";

const REGISTER_URL = "/signup";

const Signup = () => {
  const [date, setDate] = useState();
  const [gender, setGender] = useState();
  const [country, setCountry] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    gender: "",
    country: "",
    email: "",
    dob: "",
    password: "",
  });
  const { username, name, surname, email, password } = formData;
console.log(formData)
  // const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const options = [
    { key: "m", text: "Male", value: "m" },
    { key: "f", text: "Female", value: "f" },
  ];

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify(formData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setErrorMessage("Please add all fields.");
      } else if (err.response?.status === 409) {
        setErrorMessage("Username or Email Already Exists");
      } else {
        setErrorMessage("Registration Failed");
      }
      setLoading(false);
    }
  };

  const writeData = async () => {

    try {
      await axios.post(`/api/user/crtmongo`, {
        username, email, password, gender, name, surname, country, date
      });
    }catch (e) {
      console.log(e)
    }
  };
  useEffect(() => {
    writeData()
  }, []);

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" inverted textAlign="center">
          Create an account
        </Header>

        {errorMessage && !success && (
          <Message
            error
            header="There was some errors with your submission"
            content={errorMessage}
          />
        )}
        {success && (
          <Message
            success
            header="Account Created"
            content="You're all signed up for the plateform"
          />
        )}
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user circle"
              iconPosition="left"
              placeholder="Username"
              required
              name="username"
              value={username}
              disabled={success}
              onChange={onChange}
            />
            <Form.Input
              fluid
              placeholder="Name"
              icon="user"
              iconPosition="left"
              required
              name="name"
              value={name}
              disabled={success}
              onChange={onChange}
            />
            <Form.Input
              fluid
              placeholder="Surname"
              icon="user"
              iconPosition="left"
              required
              name="surname"
              value={surname}
              disabled={success}
              onChange={onChange}
            />

            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="E-mail address"
              type="email"
              required
              name="email"
              value={email}
              disabled={success}
              onChange={onChange}
            />

            <DateInput
              name="dob"
              placeholder="Date of birth"
              iconPosition="left"
              value={date}
              disabled={success}
              dateFormat={"YYYY-MM-DD"}
              onChange={(event, { name, value }) => {
                setDate(value);
                setFormData((prevState) => ({
                  ...prevState,
                  dob: value,
                }));
              }}
            />
            <Form.Select
              name="gender"
              value={gender}
              disabled={success}
              options={options}
              placeholder="Gender"
              onChange={(event, { name, value }) => {
                setGender(value);
                setFormData((prevState) => ({
                  ...prevState,
                  gender: value,
                }));
                console.log(formData);
              }}
            />

            <Dropdown
              placeholder="Country of birth"
              fluid
              search
              selection
              name="country"
              value={country}
              disabled={success}
              onChange={(event, { value }) => {
                setCountry(value);
                setFormData((prevState) => ({
                  ...prevState,
                  country: regionNames.of(value.toUpperCase()),
                }));
              }}
              options={countryOptions}
              style={{ marginBottom: "1em" }}
            />

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              disabled={success}
              required
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Confirm Password"
              type="password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              disabled={success}
              required
            />
            {!success && (
              <Button
                color="black"
                fluid
                size="large"
                type="submit"
                loading={loading}
                disabled={password !== confirmPassword || password === ""}
              >
                Sign up
              </Button>
            )}
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Signup;
