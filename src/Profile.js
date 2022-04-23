import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Avatar, Grid, Stack, Paper, Divider } from "@mui/material";
import {
  Button,
  Input,
  Header,
  Icon,
  Form,
  Dropdown,
  Message,
  Modal,
  ButtonOr,
} from "semantic-ui-react";
import { DateInput } from "semantic-ui-calendar-react-yz";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
import { countryOptions } from "./countryOptions";
function Profile() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [casts, setCasts] = useState([{}]);
  const [open, setOpen] = React.useState(false);
  const [admin, setAdmin] = useState("");
  let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const [country, setCountry] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState(false);
  const [errorMessageAdmin, setErrorMessageAdmin] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleAdmin = async (e) => {
    e.preventDefault();
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };

    try {
      setAdminLoading(true);

      const response = await axios.post(
        "/api/user/admin",
        JSON.stringify({
          username: admin,
          email: admin,
        }),
        {
          headers,
        }
      );
      setAdminSuccess(true);
      setAdminLoading(false);
    } catch (err) {
      if (!err?.response) {
        setErrorMessageAdmin("No Server Response.");
      } else if (err.response?.status === 400) {
        setErrorMessageAdmin("Missing Username or Email ");
      } else {
        setErrorMessageAdmin("Action Failed.");
      }
      setAdminLoading(false);
    }
  };
  const handleAddClick = () => {
    setCasts([...casts, {}]);
  };
  const handleRemoveClick = () => {
    setCasts([...casts.slice(0, -1)]);
  };
  const [watchlists, setWatchlists] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [watchlistName, setWatchlistName] = useState("");

  const [nameUpdated, setNameUpdated] = useState();
  const [surnameUpdated, setSurnameUpdated] = useState();
  const [dobUpdated, setDobUpdated] = useState("");
  const [countryUpdated, setCountryUpdated] = useState();
  const [emailUpdated, setEmailUpdated] = useState();
  const [passwordUpdated, setPasswordUpdated] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUserDelete = async () => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };
    try {
      setDeleteLoading(true);
      const response = await axios.delete(`/api/user/${auth?.id}`, {
        headers,
      });
      navigate("/");
      setAuth({});
      navigate("/login");
      setDeleteLoading(false);
    } catch (err) {
      setDeleteLoading(false);
    }
  };
  const handleUserUpdate = async () => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.put(
        `/api/user/${auth?.id}`,
        JSON.stringify({
          new_email: emailUpdated,
          new_password: passwordUpdated,
          new_name: nameUpdated,
          new_surname: surnameUpdated,
          new_country: countryUpdated,
          new_dob: dobUpdated,
        }),
        {
          headers,
        }
      );
      fetchProfileData();
      setEdit(false);
    } catch (err) {}
  };

  const fetchWatchlist = async () => {
    try {
      const watchlists = await axios.get(`/api/watchlist/?id=${auth?.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth?.accessToken,
        },
      });
      setWatchlists([...watchlists.data]);

      // navigate("/");
    } catch (err) {}
  };

  const fetchProfileData = async () => {
    try {
      const profileData = await axios.get(`/api/user/${auth?.id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setProfileData({ ...profileData.data });

      // navigate("/");
    } catch (err) {}
  };
  useEffect(() => {
    if (auth?.username) {
      fetchWatchlist();
      fetchProfileData();
    }
  }, [auth]);
  const handleWatchlist = async () => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };
    try {
      setLoading(true);

      const response = await axios.post(
        "/api/watchlist",
        JSON.stringify({ name: watchlistName }),
        {
          headers,
        }
      );
      fetchWatchlist();
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setErrorMessage("Watchlist Name Is Missing.");
      } else {
        setErrorMessage("Creation Failed");
      }
      setLoading(false);
    }
  };
  return (
    <div style={{ color: "white", padding: "5em 37.8em" }}>
      <Grid container wrap="nowrap" spacing={8}>
        <Grid item>
          <Avatar
            alt="Remy Sharp"
            src={`https://ui-avatars.com/api/?name=${profileData?.username}&background=fff&color=000`}
            sx={{ width: 125, height: 125 }}
          />
        </Grid>
        <Grid justifyContent="left" item xs>
          <Box m={3} style={{ margin: "unset" }}>
            <Stack direction="row" justifyContent="space-between">
              <div>
                <span style={{ color: "gray" }}> Username </span>

                <span
                  style={{
                    margin: 0,
                    marginBottom: "1em",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "1.05em",
                    textTransform: "capitalize",
                  }}
                >
                  {profileData?.username}
                </span>
              </div>
              <div>
                {" "}
                <span style={{ color: "gray" }}> Member Since </span>
                <span
                  style={{
                    margin: 0,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "1.03em",
                  }}
                >
                  {new Date(profileData?.joinDate).toLocaleDateString()}
                </span>
              </div>
            </Stack>
          </Box>

          <div style={{ marginTop: "4em" }}>
            <Box m={3} style={{ margin: "unset" }}>
              <Stack direction="row" justifyContent="space-between">
                <div>
                  <span
                    style={{
                      margin: 0,
                      marginBottom: "1em",
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: "1.05em",
                      color: "gray",
                    }}
                  >
                    Followers :{" "}
                  </span>
                  <span
                    style={{
                      margin: 0,
                      marginBottom: "1em",
                      textAlign: "left",
                      fontWeight: 500,
                      fontSize: "1em",
                    }}
                  >
                    {" "}
                    {profileData?.followers}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      margin: 0,
                      marginBottom: "1em",
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: "1.05em",
                      color: "gray",
                    }}
                  >
                    Followed :{" "}
                  </span>
                  <span
                    style={{
                      margin: 0,
                      marginBottom: "1em",
                      textAlign: "left",
                      fontWeight: 500,
                      fontSize: "1.em",
                    }}
                  >
                    {profileData?.following}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      margin: 0,
                      marginBottom: "1em",
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: "1.05em",
                      color: "gray",
                    }}
                  >
                    Watchlists :{" "}
                  </span>
                  <span
                    style={{
                      margin: 0,
                      marginBottom: "1em",
                      textAlign: "left",
                      fontWeight: 500,
                      fontSize: "1.em",
                    }}
                  >
                    {watchlists.length}
                  </span>
                </div>
              </Stack>
            </Box>
          </div>
        </Grid>
      </Grid>
      <div style={{ marginTop: "2.5em" }}>
        <Box m={3} style={{ margin: "unset" }}>
          <Stack direction="row" justifyContent="space-between">
            {edit ? (
              <div>
                <Button
                  onClick={() => {
                    setEdit(false);
                  }}
                  color="green"
                  icon
                  labelPosition="left"
                  size="medium"
                  onClick={handleUserUpdate}
                >
                  <Icon name="save outline" />
                  Save Changes
                </Button>
                <Button
                  color="grey"
                  onClick={() => {
                    setEdit(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setEdit(true);
                }}
                color="teal"
                icon
                labelPosition="left"
                size="medium"
              >
                <Icon name="edit" />
                Edit Infos
              </Button>
            )}
            {edit ? (
              <Button
                onClick={handleUserDelete}
                loading={deleteLoading}
                color="red"
                icon
                labelPosition="left"
                size="medium"
              >
                <Icon name="delete" />
                Delete Account
              </Button>
            ) : (
              <></>
            )}
          </Stack>
        </Box>
      </div>
      <Header
        inverted
        as="h3"
        dividing
        style={{ fontSize: "2em", marginTop: "1em" }}
      >
        Details
      </Header>
      <div style={{ marginTop: "2em", fontSize: "1.3em" }}>
        <div style={{ marginTop: "2.5em" }}>
          <Icon name="user outline"></Icon>{" "}
          <span
            style={{
              margin: 0,
              marginBottom: "1em",
              textAlign: "left",
              fontWeight: 700,
              color: "gray",
            }}
          >
            Name :{" "}
          </span>
          {edit ? (
            <div
              style={{
                marginTop: "1em",
              }}
            >
              {" "}
              <Input
                style={{ fontSize: "0.7em" }}
                icon="edit"
                iconPosition="left"
                size="small"
                placeholder="Edit Name"
                onChange={(e) => {
                  setNameUpdated(e.target.value);
                }}
              />
            </div>
          ) : (
            <span
              style={{
                margin: 0,
                marginBottom: "1em",
                textAlign: "left",
                fontWeight: 500,
              }}
            >
              {profileData?.name}{" "}
            </span>
          )}
        </div>
        <div style={{ marginTop: "2.5em" }}>
          <Icon name="user outline"></Icon>{" "}
          <span
            style={{
              margin: 0,
              marginBottom: "1em",
              textAlign: "left",
              fontWeight: 700,
              color: "gray",
            }}
          >
            Surame :{" "}
          </span>
          {edit ? (
            <div
              style={{
                marginTop: "1em",
              }}
            >
              {" "}
              <Input
                style={{ fontSize: "0.7em" }}
                icon="edit"
                iconPosition="left"
                size="small"
                placeholder="Edit Surname"
                onChange={(e) => {
                  setSurnameUpdated(e.target.value);
                }}
              />
            </div>
          ) : (
            <span
              style={{
                margin: 0,
                marginBottom: "1em",
                textAlign: "left",
                fontWeight: 500,
              }}
            >
              {profileData?.surname}{" "}
            </span>
          )}
        </div>
        <div style={{ marginTop: "2.5em" }}>
          <Icon name="calendar alternate outline"></Icon>{" "}
          <span
            style={{
              margin: 0,
              marginBottom: "1em",
              textAlign: "left",
              fontWeight: 700,
              color: "gray",
            }}
          >
            Date of birth{" "}
          </span>
          {edit ? (
            <DateInput
              name="date"
              placeholder="Date of birth"
              iconPosition="left"
              value={dobUpdated}
              dateFormat={"YYYY-MM-DD"}
              style={{ marginTop: "1em", fontSize: "0.8em" }}
              onChange={(e, { value }) => {
                setDobUpdated(value);
              }}
            />
          ) : (
            <span
              style={{
                margin: 0,
                marginBottom: "1em",
                textAlign: "left",
                fontWeight: 500,
              }}
            >
              {new Date(profileData?.dob).toLocaleDateString()}
            </span>
          )}
        </div>
        <div style={{ marginTop: "2.5em" }}>
          <Icon name="map"></Icon>{" "}
          <span
            style={{
              margin: 0,
              marginBottom: "1em",
              textAlign: "left",
              fontWeight: 700,
              color: "gray",
            }}
          >
            Country :{" "}
          </span>
          {edit ? (
            <div>
              <Dropdown
                placeholder="Country of birth"
                search
                selection
                value={country}
                options={countryOptions}
                style={{ marginTop: "1em", fontSize: "0.8em" }}
                onChange={(e, { value }) => {
                  setCountry(value);
                  setCountryUpdated(regionNames.of(value.toUpperCase()));
                }}
              />
            </div>
          ) : (
            <span
              style={{
                margin: 0,
                marginBottom: "1em",
                textAlign: "left",
                fontWeight: 500,
              }}
            >
              {profileData?.country}
            </span>
          )}
        </div>
        <div style={{ marginTop: "2.5em" }}>
          <Icon name="mail"></Icon>{" "}
          <span
            style={{
              margin: 0,
              marginBottom: "1em",
              textAlign: "left",
              fontWeight: 700,
              color: "gray",
            }}
          >
            Email :{" "}
          </span>
          {edit ? (
            <div
              style={{
                marginTop: "1em",
              }}
            >
              <Input
                style={{ fontSize: "0.7em" }}
                icon="mail"
                iconPosition="left"
                size="small"
                placeholder="Edit Email"
                onChange={(e) => {
                  setEmailUpdated(e.target.value);
                }}
              />
            </div>
          ) : (
            <span
              style={{
                margin: 0,
                marginBottom: "1em",
                textAlign: "left",
                fontWeight: 500,
              }}
            >
              {profileData?.email}
            </span>
          )}
        </div>
        <div style={{ marginTop: "2.5em" }}>
          <Icon name="lock"></Icon>{" "}
          <span
            style={{
              margin: 0,
              marginBottom: "1em",
              textAlign: "left",
              fontWeight: 700,
              color: "gray",
            }}
          >
            Password :{" "}
          </span>
          {edit ? (
            <div
              style={{
                marginTop: "1em",
              }}
            >
              {" "}
              <div>
                <Input
                  style={{ fontSize: "0.7em" }}
                  type="password"
                  icon="lock"
                  iconPosition="left"
                  size="small"
                  placeholder="New Password"
                  onChange={(e) => {
                    setPasswordUpdated(e.target.value);
                  }}
                />
              </div>
            </div>
          ) : (
            <span
              style={{
                margin: 0,
                marginBottom: "1em",
                textAlign: "left",
                fontWeight: 500,
              }}
            >
              {"●●●●●●●●●●●"}
            </span>
          )}
        </div>
      </div>
      <Header
        inverted
        as="h3"
        dividing
        style={{ fontSize: "2em", marginTop: "2em", marginBottom: "1.5em" }}
      >
        Watchlists
      </Header>
      {watchlists?.map((x) => {
        return (
          <div key={x?.id}>
            <Paper
              style={{
                textAlign: "left",
                marginTop: "2em",
                paddingBottom: "0.5em",
              }}
              className="watchlistList"
            >
              <Grid container wrap="nowrap" spacing={2}>
                <Grid justifyContent="left" item xs zeroMinWidth>
                  <div style={{ fontSize: "1.14em" }}>
                    <Box m={3} style={{ margin: "unset", marginTop: "0.5em" }}>
                      <Stack direction="row" justifyContent="space-between">
                        <div>
                          <span
                            style={{
                              textAlign: "left",
                              fontWeight: 600,
                              fontSize: "1.03em",
                            }}
                          >
                            {x?.name}
                          </span>
                        </div>
                        <div>
                          {" "}
                          <Button
                            color="teal"
                            icon
                            labelPosition="right"
                            size="medium"
                            onClick={() => {
                              navigate(`/watchlist/${x?.id}`);
                            }}
                          >
                            <Icon name="angle double right" />
                            Details
                          </Button>
                        </div>
                      </Stack>
                    </Box>
                  </div>
                </Grid>
              </Grid>
            </Paper>
            <Divider
              style={{ marginBottom: "2em" }}
              className="watchlistDivider"
              variant="fullWidth"
            />
          </div>
        );
      })}

      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button
            floated="right"
            color="teal"
            icon
            labelPosition="right"
            size="medium"
          >
            <Icon name="add square" />
            Create Watchlist
          </Button>
        }
      >
        <Modal.Header>Create New Watchlist</Modal.Header>
        <Modal.Content>
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
              header="Watchlist Created"
              content="Watchlist Is Ready To Get Populated"
            />
          )}
          <Header>Watchlist's Name </Header>
          <Input
            onChange={(e) => {
              setWatchlistName(e.target.value);
            }}
            label="Name"
            placeholder="Watchlist name"
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="black"
            onClick={() => {
              setOpen(false);
              setWatchlistName("");
              setSuccess(false);
              setErrorMessage("");
            }}
          >
            Close
          </Button>
          {!success && (
            <Button
              primary
              content="Create"
              onClick={handleWatchlist}
              loading={loading}
              positive
            />
          )}
        </Modal.Actions>
      </Modal>

      {auth?.roles?.includes("Admin") && (
        <>
          <Header
            inverted
            as="h3"
            dividing
            style={{ fontSize: "2em", margin: " 2em 0" }}
          >
            Administrator Panel
          </Header>
          {errorMessageAdmin && !adminSuccess && (
            <Message
              error
              header="There was some errors with your submission"
              content={errorMessageAdmin}
            />
          )}
          {adminSuccess && <Message success header="Account Promoted" />}
          <Header inverted as="h3" dividing style={{ margin: " 1em 0" }}>
            <Icon name="add user"></Icon>
            Add an Administrator
          </Header>
          <Form inverted>
            <Form.Input
              label="Email or Username"
              placeholder="joe@schmoe.com"
              onChange={(e) => {
                setAdmin(e.target.value);
              }}
            />
            <Message
              error
              header="Action Failed"
              content="Cannot find user with that email or password."
            />
            <Button
              loading={adminLoading}
              onClick={(e) => {
                handleAdmin(e);
              }}
            >
              Submit
            </Button>
          </Form>

          {/* <Header inverted as="h3" dividing style={{ margin: " 2em 0" }}>
            <Icon name="film"></Icon>
            Add movie to platform
          </Header> */}
          {/* <Form inverted>
            <Form.Group>
              <Form.Input
                label="Movie Title"
                placeholder="Movie Title"
                width={4}
              />
              <Form.Input
                label="IMDB Identification"
                placeholder="IMDB Identification"
                width={6}
              />
              <Form.Input
                label="Poster Path"
                placeholder="Poster Path"
                width={6}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                icon="dollar sign"
                iconPosition="right"
                label="Budget"
                placeholder="Budget"
                width={4}
              ></Form.Input>
              <Form.Input
                icon="dollar sign"
                iconPosition="right"
                label="Revenues"
                placeholder="Revenues"
                width={4}
              />
              <Form.Input
                icon="clock"
                iconPosition="right"
                label="Runtime"
                placeholder="Runtime"
                width={4}
              />

              <Form.Input
                icon="star"
                iconPosition="right"
                label="Popularity"
                placeholder="Popularity"
                width={4}
              />
            </Form.Group>
            <Form.Group>
              <DateInput
                name="Release Date"
                label="Release Date"
                placeholder="Release Date"
                iconPosition="left"
                width={6}
              />{" "}
              <Form.Dropdown
                label="Languages"
                placeholder="Languages"
                multiple
                selection
                options={[
                  { key: "en", text: "English", value: "en" },
                  { key: "ar", text: "Arabic", value: "ar" },
                  { key: "it", text: "Italian", value: "it" },
                ]}
                width={6}
              />
              <Form.Dropdown
                label="Genres"
                placeholder="Genres"
                multiple
                selection
                options={[
                  { key: "co", text: "Comedy", value: "co" },
                  { key: "ho", text: "Horror", value: "ho" },
                  { key: "sf", text: "Science-Fiction", value: "sf" },
                ]}
                width={6}
              />
            </Form.Group>
            <Form.TextArea
              label="Overview"
              placeholder="Overview"
              style={{ minHeight: 130 }}
              width={16}
            />

            {casts.map((x, i) => {
              return (
                <Form.Group>
                  <Form.Input
                    label="Cast Name"
                    placeholder="Cast Name"
                    width={4}
                  />
                  <Form.Select
                    label="Cast Gender"
                    options={[
                      { key: "m", text: "Male", value: "m" },
                      { key: "f", text: "Female", value: "f" },
                    ]}
                    placeholder="Gender"
                    width={3}
                    className="spaceEdit"
                    style={{ marginRight: 10 }}
                  />
                  <Form.Input
                    icon="star"
                    iconPosition="right"
                    label="Cast Popularity"
                    placeholder="Popularity"
                    width={4}
                  />
                  <Form.Input
                    label="Cast Character"
                    placeholder="Cast Character"
                    width={4}
                  />

                  {casts.length == i + 1 ? (
                    <>
                      {" "}
                      <Form.Button
                        style={{
                          marginTop: "10!important",
                          display: "contents",
                          color: "white",
                        }}
                        size="small"
                        className="addButton"
                        onClick={handleAddClick}
                        icon
                        fluid
                        width={1}
                      >
                        <Icon name="add" />
                      </Form.Button>
                      {i != 0 ? (
                        <Form.Button
                          style={{
                            marginTop: "10!important",
                            display: "contents",
                            color: "white",
                          }}
                          size="small"
                          className="addButton"
                          icon
                          fluid
                          width={1}
                          index={i}
                          onClick={handleRemoveClick}
                        >
                          <Icon name="delete" />
                        </Form.Button>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </Form.Group>
              );
            })}
            <Button type="submit">Submit</Button>
          </Form> */}
        </>
      )}
    </div>
  );
}
export default Profile;
