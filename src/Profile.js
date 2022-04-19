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
} from "semantic-ui-react";
import { DateInput } from "semantic-ui-calendar-react-yz";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { countryOptions } from "./countryOptions";
function Profile() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth?.username) {
      navigate("/login");
    }
  });
  const [edit, setEdit] = useState(false);
  const [casts, setCasts] = useState([{}]);
  const [open, setOpen] = React.useState(false);

  let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const [country, setCountry] = useState("");

  const handleAddClick = () => {
    setCasts([...casts, {}]);
  };
  const handleRemoveClick = () => {
    setCasts([...casts.slice(0, -1)]);
  };
  return (
    <div style={{ color: "white", padding: "5em 37.8em" }}>
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
      <div style={{ marginTop: "2.5em" }}>
        <Box m={3} style={{ margin: "unset" }}>
          <Stack direction="row" justifyContent="space-between">
            {edit ? (
              <Button
                onClick={() => {
                  setEdit(false);
                }}
                color="green"
                icon
                labelPosition="left"
                size="medium"
              >
                <Icon name="save outline" />
                Save Changes
              </Button>
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
              <Button color="red" icon labelPosition="left" size="medium">
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
        <div style={{ marginTop: "1em" }}>
          <Icon name="user circle outline"></Icon>{" "}
          <span
            style={{
              margin: 0,
              marginBottom: "1em",
              textAlign: "left",
              fontWeight: 700,
              color: "gray",
            }}
          >
            Username :{" "}
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
                placeholder="Edit Username"
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
              {"ArsalenBi"}
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
                  icon="lock"
                  iconPosition="left"
                  size="small"
                  placeholder="New Password"
                />
              </div>
              <div
                style={{
                  marginTop: "0.5em",
                }}
              >
                <Input
                  style={{ fontSize: "0.7em" }}
                  icon="lock"
                  iconPosition="left"
                  size="small"
                  placeholder="Confirm Password"
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
                      Top 20 Comedy
                    </span>
                  </div>
                  <div>
                    {" "}
                    <Button
                      color="teal"
                      icon
                      labelPosition="right"
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
      <Divider className="watchlistDivider" variant="fullWidth" />
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
                      Best Sci_Fi of 2021
                    </span>
                  </div>
                  <div>
                    {" "}
                    <Button
                      color="teal"
                      icon
                      labelPosition="right"
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
      <Divider className="watchlistDivider" variant="fullWidth" />
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
                      Most favourite "Western" movies{" "}
                    </span>
                  </div>
                  <div>
                    {" "}
                    <Button
                      color="teal"
                      icon
                      labelPosition="right"
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
      <Divider
        style={{ marginBottom: "1em" }}
        className="watchlistDivider"
        variant="fullWidth"
      />

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
          <Header>Watchlist's Name </Header>
          <Input label="Name" placeholder="Watchlist name" />
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            primary
            content="Create"
            onClick={() => setOpen(false)}
            positive
          />
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
          <Header inverted as="h3" dividing style={{ margin: " 1em 0" }}>
            <Icon name="add user"></Icon>
            Add an Administrator
          </Header>
          <Form inverted>
            <Form.Input
              label="Email or Username"
              placeholder="joe@schmoe.com"
            />
            <Message
              error
              header="Action Failed"
              content="Cannot find user with that email or password."
            />
            <Button>Submit</Button>
          </Form>

          <Header inverted as="h3" dividing style={{ margin: " 2em 0" }}>
            <Icon name="film"></Icon>
            Add movie to platform
          </Header>
          <Form inverted>
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
          </Form>
        </>
      )}
    </div>
  );
}
export default Profile;
