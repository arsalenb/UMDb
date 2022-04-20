import React, { useEffect, useState } from "react";
import { Divider, Avatar, Paper, Grid, Stack, Box } from "@mui/material";
import { Header, Icon, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";

function FollowedUsers() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [followedUsers, setFollowedUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const fetchData = async (type) => {
    try {
      const response = await axios.get(`/api/user/${type}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (type === "followed") setFollowedUsers([...response.data]);
      else setSuggestedUsers([...response.data]);

      // navigate("/");
    } catch (err) {}
  };
  useEffect(() => {
    fetchData("followed");
    fetchData("suggested");
  }, []);

  const handleFollow = async (userId) => {
    try {
      const response = await axios.post(
        `/api/user/${userId}/follow`,

        {
          headers: { "Content-Type": "application/json" },
        }
      );
      fetchData("followed");
      fetchData("suggested");
    } catch (err) {}
  };
  const handleUnfollow = async (userId) => {
    try {
      const response = await axios.delete(
        `/api/user/${userId}/follow`,

        {
          headers: { "Content-Type": "application/json" },
        }
      );
      fetchData("followed");
      fetchData("suggested");
    } catch (err) {}
  };
  return (
    <div style={{ padding: "2em" }}>
      {" "}
      <Grid container style={{ color: "white" }}>
        <Grid xs item style={{ textAlign: "center" }}>
          <Header inverted as="h3" dividing style={{ fontSize: "2.5em" }}>
            Users You Follow
          </Header>
          {followedUsers.map((x) => {
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
                            {" "}
                            <span
                              style={{
                                margin: 0,
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: "1.03em",
                              }}
                            >
                              {x?.user_name}
                            </span>
                          </div>
                          <div>
                            {" "}
                            <Button
                              color="grey"
                              icon
                              labelPosition="left"
                              size="medium"
                              onClick={() => {
                                navigate(`/user/${x?.user_id}`);
                              }}
                            >
                              <Icon name="angle double right" />
                              Details
                            </Button>
                            <Button
                              onClick={() => {
                                handleUnfollow(x?.user_id);
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
            Suggested Users
          </Header>
          {suggestedUsers.map((x) => {
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
                            {" "}
                            <span
                              style={{
                                margin: 0,
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: "1.03em",
                              }}
                            >
                              {x?.user_name}
                            </span>
                          </div>
                          <div>
                            {" "}
                            <Button
                              color="grey"
                              icon
                              labelPosition="left"
                              size="medium"
                              onClick={() => {
                                navigate(`/user/${x?.user_id}`);
                              }}
                            >
                              <Icon name="angle double right" />
                              Details
                            </Button>
                            <Button
                              onClick={() => {
                                handleFollow(x?.user_id);
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
export default FollowedUsers;
