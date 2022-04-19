import React, { useState } from "react";
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
import { countryOptions } from "./countryOptions";
function User() {
  const [edit, setEdit] = useState(false);
  let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const [country, setCountry] = useState("");
  return (
    <div style={{ color: "white", padding: "5em 40em" }}>
      <Grid container wrap="nowrap" spacing={8}>
        <Grid item>
          <Avatar
            alt="Remy Sharp"
            src={
              "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=Arsalen+Bidani"
            }
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
                  {"Arsalen Bidani"}
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
                  {"23 December 2015"}
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
                    {65}
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
                    {5}
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
                    {5}
                  </span>
                </div>
              </Stack>
            </Box>
          </div>
        </Grid>
      </Grid>
      <Box m={3} style={{ margin: "unset", marginTop: "1.5em" }}>
        <Stack direction="row" justifyContent="space-between">
          <Button color="teal" icon labelPosition="left" fluid>
            {" "}
            <Icon name="podcast" />
            Follow User
          </Button>
          {/* <Button color="red" icon labelPosition="left">
            <Icon name="delete" />
            Delete User
          </Button> */}
        </Stack>
      </Box>

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
              {"Arsalen"}
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
              {"Bidani"}
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
              {"13-07-1999"}
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
              {"Tunisia"}
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
              {"arselenebidani@yahoo.fr"}
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
      <Paper
        style={{
          textAlign: "left",
          marginTop: "2em",
          paddingBottom: "0.5em",
        }}
        className="commentCard"
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
                      Top 20 Comedy
                    </span>
                  </div>
                  <div>
                    {" "}
                    <Button
                      color="teal"
                      icon
                      labelPosition="left"
                      size="medium"
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
      <Divider className="ReviewDivider" variant="fullWidth" />
      <Paper
        style={{
          textAlign: "left",
          marginTop: "2em",
          paddingBottom: "0.5em",
        }}
        className="commentCard"
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
                      Best Sci_Fi of 2021
                    </span>
                  </div>
                  <div>
                    {" "}
                    <Button
                      color="teal"
                      icon
                      labelPosition="left"
                      size="medium"
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
      <Divider className="ReviewDivider" variant="fullWidth" />
      <Paper
        style={{
          textAlign: "left",
          marginTop: "2em",
          paddingBottom: "0.5em",
        }}
        className="commentCard"
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
                      Most favourite "Western" movies{" "}
                    </span>
                  </div>
                  <div>
                    {" "}
                    <Button
                      color="teal"
                      icon
                      labelPosition="left"
                      size="medium"
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
      <Divider className="ReviewDivider" variant="fullWidth" />
    </div>
  );
}
export default User;
