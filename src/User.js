import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { Avatar, Grid, Stack, Paper, Divider } from "@mui/material";
import { Button, Input, Header, Icon, Item, Dropdown } from "semantic-ui-react";
import {
  DateInput,
  TimeInput,
  DateTimeInput,
  DatesRangeInput,
} from "semantic-ui-calendar-react-yz";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
import { countryOptions } from "./countryOptions";

function User() {
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [watchlists, setWatchlists] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUserDelete = async () => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };
    try {
      setDeleteLoading(true);
      const response = await axios.delete(`/api/user/${id}`, {
        headers,
      });
      navigate("/");
      setDeleteLoading(false);
    } catch (err) {
      setDeleteLoading(false);
    }
  };
  const handleFollow = async () => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
    };
    try {
      const response = await axios.post(
        `/api/user/${id}/follow`,
        {},
        {
          headers,
        }
      );
      fetchIfFollowed();
      fetchProfileData();
    } catch (err) {}
  };

  const handleUnfollow = async () => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
    };
    try {
      const response = await axios.delete(`/api/user/${id}/follow`, {
        headers,
      });
      fetchIfFollowed();
      fetchProfileData();
    } catch (err) {}
  };
  const fetchIfFollowed = async () => {
    try {
      const response = await axios.get(`/api/user/followed`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth?.accessToken,
        },
      });
      if (response?.data?.filter((o) => o.user_id == id).length !== 0)
        setFollowed(true);
      else setFollowed(false);
    } catch (err) {}
  };

  const fetchWatchlist = async () => {
    try {
      const watchlists = await axios.get(`/api/watchlist/?id=${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setWatchlists([...watchlists.data]);
    } catch (err) {}
  };

  const fetchProfileData = async () => {
    try {
      const profileData = await axios.get(`/api/user/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setProfileData({ ...profileData.data });
    } catch (err) {}
  };
  useEffect(() => {
    fetchWatchlist();
    fetchProfileData();
    fetchIfFollowed();
  }, [auth]);
  let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const [country, setCountry] = useState("");
  return (
    <div style={{ color: "white", padding: "5em 40em" }}>
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
      {auth?.username && auth?.id != id && (
        <Box m={3} style={{ margin: "unset", marginTop: "1.5em" }}>
          <Stack direction="row" justifyContent="space-between">
            {!followed ? (
              <Button
                onClick={handleFollow}
                color="teal"
                icon
                labelPosition="left"
                fluid
              >
                <Icon name="podcast" />
                Follow User
              </Button>
            ) : (
              <Button
                onClick={handleUnfollow}
                color="red"
                icon
                labelPosition="left"
                fluid
              >
                <Icon name="bookmark outline" />
                Unfollow User
              </Button>
            )}

            {auth?.roles?.includes("Admin") && (
              <Button
                color="red"
                icon
                labelPosition="left"
                onClick={handleUserDelete}
                loading={deleteLoading}
              >
                <Icon name="delete" />
                Delete User
              </Button>
            )}
          </Stack>
        </Box>
      )}

      <Header
        inverted
        as="h3"
        dividing
        style={{ fontSize: "2em", marginTop: "3em" }}
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
            Date of Birth :{" "}
          </span>
          {edit ? (
            <DateInput
              name="date"
              placeholder="Date of birth"
              iconPosition="left"
              style={{ marginTop: "1em", fontSize: "0.8em" }}
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
                onChange={(event, { value }) => {
                  console.log(regionNames.of(value.toUpperCase()));
                  setCountry(value);
                }}
                options={countryOptions}
                style={{ marginTop: "1em", fontSize: "0.8em" }}
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
              {profileData?.country}{" "}
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
              {profileData?.email}{" "}
            </span>
          )}
        </div>
      </div>
      <Header
        inverted
        as="h3"
        dividing
        style={{ fontSize: "2em", margin: " 2em 0" }}
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
    </div>
  );
}
export default User;
