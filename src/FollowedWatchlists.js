import React, { useEffect, useState } from "react";
import { Divider, Avatar, Paper, Grid, Stack, Box } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";

import { Header, Icon, Button } from "semantic-ui-react";

function FollowedWatchlists() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [followedWatchlists, setFollowedWatchlists] = useState([]);
  const [suggestedWatchlists, setSuggestedWatchlists] = useState([]);
  const fetchData = async (type) => {
    try {
      const response = await axios.get(`/api/watchlist/${type}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth?.accessToken,
        },
      });
      if (type === "followed") setFollowedWatchlists([...response.data]);
      else setSuggestedWatchlists([...response.data]);

      // navigate("/");
    } catch (err) {}
  };
  useEffect(() => {
    fetchData("followed");
    fetchData("suggested");
  }, [auth]);

  const handleFollow = async (watchlistId) => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.post(
        `/api/watchlist/${watchlistId}/follow`,
        {},
        {
          headers,
        }
      );
      fetchData("followed");
      fetchData("suggested");
    } catch (err) {}
  };
  const handleUnfollow = async (watchlistId) => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.delete(
        `/api/watchlist/${watchlistId}/follow`,
        {
          headers,
        }
      );
      fetchData("followed");
      fetchData("suggested");
    } catch (err) {}
  };
  return (
    <div style={{ padding: "2em" }}>
      <Grid container style={{ color: "white" }}>
        <Grid xs item style={{ textAlign: "center" }}>
          <Header inverted as="h3" dividing style={{ fontSize: "2.5em" }}>
            Watchlists You Follow
          </Header>
          {followedWatchlists.map((x) => {
            return (
              <Paper
                style={{
                  padding: "1em",
                  textAlign: "left",
                  marginTop: "2em",
                }}
              >
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item>
                    <Avatar
                      alt="Remy Sharp"
                      src={`https://ui-avatars.com/api/?name=${x?.name}&background=5a5f61&color=fff`}
                    />
                  </Grid>
                  <Grid justifyContent="left" item xs zeroMinWidth>
                    <div style={{ fontSize: "1.14em" }}>
                      <Box
                        m={3}
                        style={{ margin: "unset", marginTop: "0.5em" }}
                      >
                        <Stack direction="row" justifyContent="space-between">
                          <div>
                            <span style={{ color: "gray" }}>Entitled </span>
                            <span
                              style={{
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: "1.03em",
                              }}
                            >
                              {x?.name}
                            </span>
                            <p style={{ marginTop: "1em" }}>
                              <span style={{ color: "gray" }}>
                                Watchlist of{" "}
                              </span>
                              <span
                                style={{
                                  margin: 0,
                                  textAlign: "left",
                                  fontWeight: 600,
                                  fontSize: "1.03em",
                                }}
                              >
                                <Link
                                  to={`/user/${x?.owner_id}`}
                                  style={{ color: "black" }}
                                >
                                  {" "}
                                  {x?.owner}
                                </Link>
                              </span>
                            </p>
                          </div>
                          <div>
                            {" "}
                            <Button
                              color="grey"
                              icon
                              labelPosition="left"
                              size="medium"
                              onClick={() => {
                                navigate(`/watchlist/${x?.id}`);
                              }}
                            >
                              <Icon name="angle double right" />
                              Details
                            </Button>
                            <Button
                              onClick={() => {
                                handleUnfollow(x?.id);
                              }}
                              color="red"
                              icon
                              labelPosition="left"
                            >
                              <Icon name="bookmark outline" />
                              Unfollow
                            </Button>
                          </div>
                        </Stack>
                      </Box>
                    </div>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          style={{ backgroundColor: "white", height: "90vh", margin: "0 4em" }}
        />

        <Grid item xs style={{ textAlign: "center" }}>
          <Header inverted as="h3" dividing style={{ fontSize: "2.5em" }}>
            Suggested Watchlists
          </Header>
          {suggestedWatchlists.map((x) => {
            return (
              <Paper
                style={{
                  padding: "1em",
                  textAlign: "left",
                  marginTop: "2em",
                }}
              >
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item>
                    <Avatar
                      alt="Remy Sharp"
                      src={`https://ui-avatars.com/api/?name=${x?.name}&background=5a5f61&color=fff`}
                    />
                  </Grid>
                  <Grid justifyContent="left" item xs zeroMinWidth>
                    <div style={{ fontSize: "1.14em" }}>
                      <Box
                        m={3}
                        style={{ margin: "unset", marginTop: "0.5em" }}
                      >
                        <Stack direction="row" justifyContent="space-between">
                          <div>
                            <span style={{ color: "gray" }}>Entitled </span>
                            <span
                              style={{
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: "1.03em",
                              }}
                            >
                              {x?.name}
                            </span>
                            <p style={{ marginTop: "1em" }}>
                              <span style={{ color: "gray" }}>
                                Watchlist of{" "}
                              </span>
                              <span
                                style={{
                                  margin: 0,
                                  textAlign: "left",
                                  fontWeight: 600,
                                  fontSize: "1.03em",
                                }}
                              >
                                <Link
                                  to={`/user/${x?.owner_id}`}
                                  style={{ color: "black" }}
                                >
                                  {" "}
                                  {x?.owner}
                                </Link>
                              </span>
                            </p>
                          </div>
                          <div>
                            {" "}
                            <Button
                              color="grey"
                              icon
                              labelPosition="left"
                              size="medium"
                              onClick={() => {
                                navigate(`/watchlist/${x?.id}`);
                              }}
                            >
                              <Icon name="angle double right" />
                              Details
                            </Button>
                            <Button
                              onClick={() => {
                                handleFollow(x?.id);
                              }}
                              secondary
                              icon
                              labelPosition="left"
                            >
                              <Icon name="podcast" />
                              Follow
                            </Button>
                          </div>
                        </Stack>
                      </Box>
                    </div>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
}
export default FollowedWatchlists;
