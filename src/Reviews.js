import React, { useState } from "react";
import {
  Button,
  Container,
  Form,
  Header,
  Input,
  Icon,
  TextArea,
} from "semantic-ui-react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { Divider, Avatar, Grid, Paper, Stack } from "@mui/material";
import "./reviews.css";
const Reviews = () => {
  const [edit, setEdit] = useState(false);
  const imgLink =
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

  return (
    <div style={{ marginTop: 40 }}>
      <Header inverted as="h3" dividing style={{ fontSize: "2.5em" }}>
        Reviews
      </Header>

      <div style={{ padding: 14 }} className="App">
        <div style={{ width: "40em" }}>
          <Form reply style={{ marginBottom: 20 }}>
            <Form.Field
              control={Input}
              placeholder="Title"
              inverted
              style={{ width: "40em" }}
            />
            <Form.TextArea
              style={{ minHeight: 300, width: "40em" }}
              placeholder={"Review description ..."}
            />
            <Box m={3} style={{ margin: "unset" }}>
              <Stack direction="row" justifyContent="space-between">
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                />
                <Rating
                  style={{ marginTop: 5 }}
                  size="large"
                  name="half-rating"
                  defaultValue={3}
                  precision={0.5}
                />
              </Stack>
            </Box>
          </Form>
        </div>
        <Paper className="commentCard" style={{ padding: "40px 20px" }}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar alt="Remy Sharp" src={imgLink} />
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
              {edit ? (
                <Input
                  style={{ fontSize: "0.7em" }}
                  icon="edit"
                  iconPosition="left"
                  size="small"
                  placeholder="Review Title"
                />
              ) : (
                <div style={{ marginBottom: "1em" }}>
                  <span
                    style={{
                      margin: 0,
                      marginBottom: "1em",
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: "1.05em",
                    }}
                  >
                    One of the best movies ever made!
                  </span>
                </div>
              )}
              <div>
                {" "}
                {edit ? (
                  <>
                    <TextArea
                      style={{ minHeight: 200, width: 740, marginTop: "1em" }}
                    />
                    <Box m={3} style={{ margin: "unset" }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Rating
                          style={{ marginBottom: -3 }}
                          size="small"
                          name="half-rating"
                          defaultValue={3}
                          precision={0.5}
                        />
                        <div>
                          {" "}
                          <Button
                            size="small"
                            onClick={() => {
                              setEdit(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              setEdit(false);
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </Stack>
                    </Box>
                  </>
                ) : (
                  <>
                    {" "}
                    <p style={{ textAlign: "left" }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aenean luctus ut est sed faucibus. Duis bibendum ac ex
                      vehicula laoreet. Suspendisse congue vulputate lobortis.
                      Pellentesque at interdum tortor. Quisque arcu quam,
                      malesuada vel mauris et, posuere sagittis ipsum. Aliquam
                      ultricies a ligula nec faucibus. In elit metus, efficitur
                      lobortis nisi quis, molestie porttitor metus. Pellentesque
                      et neque risus. Aliquam vulputate, mauris vitae tincidunt
                      interdum, mauris mi vehicula urna, nec feugiat quam lectus
                      vitae ex.{" "}
                    </p>
                    <div style={{ marginBottom: "1em" }}>
                      <span style={{ color: "gray" }}>Review by </span>
                      <span
                        style={{
                          margin: 0,
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: "1.03em",
                        }}
                      >
                        Arsalen Bidani
                      </span>
                    </div>
                    <Box m={3} style={{ margin: "unset" }}>
                      <Stack direction="row" justifyContent="space-between">
                        <p style={{ textAlign: "left", color: "gray" }}>
                          posted on 29 November 2013
                        </p>
                        <Rating
                          style={{ marginBottom: -3 }}
                          size="small"
                          name="half-rating"
                          defaultValue={3}
                          precision={0.5}
                          readOnly
                        />
                      </Stack>
                    </Box>
                  </>
                )}
              </div>
              {edit ? (
                <></>
              ) : (
                <Box m={3} style={{ margin: "unset" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Button
                      style={{
                        display: "contents",
                        color: "white",
                      }}
                      size="small"
                      icon
                      onClick={() => {
                        setEdit(true);
                      }}
                    >
                      {" "}
                      <Icon name="edit" />
                    </Button>
                    <Button
                      style={{
                        display: "contents",
                        color: "white",
                        marginLeft: 50,
                      }}
                      size="small"
                      icon
                    >
                      {" "}
                      <Icon name="delete" />
                    </Button>
                  </Stack>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
        <Divider className="ReviewDivider" variant="fullWidth" />
        <Paper className="commentCard" style={{ padding: "40px 20px" }}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar alt="Remy Sharp" src={imgLink} />
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
              <div style={{ marginBottom: "1em" }}>
                <span
                  style={{
                    margin: 0,
                    marginBottom: "1em",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "1.05em",
                  }}
                >
                  One of the best movies ever made!
                </span>
              </div>

              <p style={{ textAlign: "left" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                luctus ut est sed faucibus. Duis bibendum ac ex vehicula
                laoreet. Suspendisse congue vulputate lobortis. Pellentesque at
                interdum tortor. Quisque arcu quam, malesuada vel mauris et,
                posuere sagittis ipsum. Aliquam ultricies a ligula nec faucibus.
                In elit metus, efficitur lobortis nisi quis, molestie porttitor
                metus. Pellentesque et neque risus. Aliquam vulputate, mauris
                vitae tincidunt interdum, mauris mi vehicula urna, nec feugiat
                quam lectus vitae ex.{" "}
              </p>
              <div style={{ marginBottom: "1em" }}>
                <span style={{ color: "gray" }}>Review by </span>
                <span
                  style={{
                    margin: 0,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "1.03em",
                  }}
                >
                  Arsalen Bidani
                </span>
              </div>
              <Box m={3} style={{ margin: "unset" }}>
                <Stack direction="row" justifyContent="space-between">
                  <p style={{ textAlign: "left", color: "gray" }}>
                    posted on 29 November 2013
                  </p>
                  <Rating
                    style={{ marginBottom: -3 }}
                    size="small"
                    name="half-rating"
                    defaultValue={3}
                    precision={0.5}
                    readOnly
                  />
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Divider className="ReviewDivider" variant="fullWidth" />
        <Paper className="commentCard" style={{ padding: "40px 20px" }}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar alt="Remy Sharp" src={imgLink} />
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
              <div style={{ marginBottom: "1em" }}>
                <span
                  style={{
                    margin: 0,
                    marginBottom: "1em",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "1.05em",
                  }}
                >
                  One of the best movies ever made!
                </span>
              </div>

              <p style={{ textAlign: "left" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                luctus ut est sed faucibus. Duis bibendum ac ex vehicula
                laoreet. Suspendisse congue vulputate lobortis. Pellentesque at
                interdum tortor. Quisque arcu quam, malesuada vel mauris et,
                posuere sagittis ipsum. Aliquam ultricies a ligula nec faucibus.
                In elit metus, efficitur lobortis nisi quis, molestie porttitor
                metus. Pellentesque et neque risus. Aliquam vulputate, mauris
                vitae tincidunt interdum, mauris mi vehicula urna, nec feugiat
                quam lectus vitae ex.{" "}
              </p>
              <div style={{ marginBottom: "1em" }}>
                <span style={{ color: "gray" }}>Review by </span>
                <span
                  style={{
                    margin: 0,
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "1.03em",
                  }}
                >
                  Arsalen Bidani
                </span>
              </div>
              <Box m={3} style={{ margin: "unset" }}>
                <Stack direction="row" justifyContent="space-between">
                  <p style={{ textAlign: "left", color: "gray" }}>
                    posted on 29 November 2013
                  </p>
                  <Rating
                    style={{ marginBottom: -3 }}
                    size="small"
                    name="half-rating"
                    defaultValue={3}
                    precision={0.5}
                    readOnly
                  />
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Divider className="ReviewDivider" variant="fullWidth" />
      </div>
    </div>
  );
};

export default Reviews;
