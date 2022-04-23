import React, { useState } from "react";
import {
  Button,
  Form,
  Header,
  Input,
  Icon,
  TextArea,
  Message,
} from "semantic-ui-react";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { Divider, Avatar, Grid, Paper, Stack } from "@mui/material";
import "./reviews.css";
import axios from "./api/axios";
import useAuth from "./hooks/useAuth";
import { Link } from "react-router-dom";

const Reviews = (props) => {
  const { auth } = useAuth();
  const [edit, setEdit] = useState([]);

  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewSummary, setReviewSummary] = useState("");
  const [reviewRating, setReviewRating] = useState(3);

  const [reviewUpdated, setReviewUpdated] = useState("");
  const [reviewSummaryUpdated, setReviewSummaryUpdated] = useState("");
  const [reviewRatingUpdated, setReviewRatingUpdated] = useState(3);

  const [creationLoading, setCreationLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleReviewEdit = async (review_id, i) => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.put(
        `/api/review`,
        JSON.stringify({
          review_id,
          movieId: props.movie.id,
          new_rating: reviewRatingUpdated,
          new_review_summary: reviewUpdated,
          new_review_detail: reviewSummaryUpdated,
        }),
        {
          headers,
        }
      );
      props.refetch(props.movie.id);
      setEdit([edit.filter((o) => o.edit != i)]);
      setReviewUpdated("");
      setReviewSummaryUpdated("");
    } catch (err) {}
  };
  const handleRemoveReview = async (review_id) => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.delete(
        `/api/review?review_id=${review_id}&movieId=${props.movie.id}`,
        {
          headers,
        }
      );
      props.refetch(props.movie.id);
    } catch (err) {}
  };

  const handleSubmit = async () => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };
    try {
      console.log(reviewRating);
      setCreationLoading(true);
      const response = await axios.post(
        `/api/review`,
        JSON.stringify({
          title: props.movie.title,
          movieId: props.movie.id,
          rating: reviewRating,
          review_summary: reviewTitle,
          review_detail: reviewSummary,
        }),
        {
          headers,
        }
      );
      setCreationLoading(false);
      props.refetch(props.movie.id);
      setReviewSummary("");
      setReviewTitle("");
      setReviewRating(0);
      setErrorMessage("");
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setErrorMessage("Fields Are Missing.");
      } else {
        setErrorMessage("Review Creation Has Failed");
      }
      setCreationLoading(false);
    }
  };
  return (
    <div style={{ marginTop: 40 }}>
      <Header inverted as="h3" dividing style={{ fontSize: "2.5em" }}>
        Reviews
      </Header>
      {errorMessage && (
        <Message
          error
          header="There was some errors with your submission"
          content={errorMessage}
          style={{ width: "40em" }}
        />
      )}
      <div style={{ padding: 14 }} className="App">
        <div style={{ width: "40em" }}>
          <Form onSubmit={handleSubmit} reply style={{ marginBottom: 20 }}>
            <Form.Field
              control={Input}
              placeholder="Title"
              inverted
              onChange={(e) => {
                setReviewTitle(e.target.value);
              }}
              style={{ width: "40em" }}
            />
            <Form.TextArea
              style={{ minHeight: 300, width: "40em" }}
              placeholder={"Review description ..."}
              onChange={(e) => {
                setReviewSummary(e.target.value);
              }}
            />
            <Box m={3} style={{ margin: "unset" }}>
              <Stack direction="row" justifyContent="space-between">
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  type="submit"
                  loading={creationLoading}
                />
                <Rating
                  style={{ marginTop: 5 }}
                  size="large"
                  name="half-rating"
                  defaultValue={3}
                  precision={0.5}
                  onClick={(e) => {
                    setReviewRating(parseInt(e.target.value) * 2);
                  }}
                />
              </Stack>
            </Box>
          </Form>
        </div>
        {props.reviews
          ?.map((item, i) => {
            const owner = parseInt(item.userId) == auth?.id;
            return (
              <>
                <Paper className="commentCard" style={{ padding: "40px 20px" }}>
                  <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                      <Avatar
                        alt="Remy Sharp"
                        src={`https://ui-avatars.com/api/?name=${item.reviewer}&background=fff&color=000`}
                      />
                    </Grid>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                      {edit.filter((o) => o.edit == i).length != 0 ? (
                        <Input
                          style={{ fontSize: "0.7em" }}
                          icon="edit"
                          iconPosition="left"
                          size="small"
                          placeholder="Review Title"
                          onChange={(e) => {
                            setReviewUpdated(e.target.value);
                          }}
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
                            {item.review_summary}
                          </span>
                        </div>
                      )}
                      <div>
                        {" "}
                        {edit.filter((o) => o.edit == i).length != 0 ? (
                          <>
                            <TextArea
                              style={{
                                minHeight: 200,
                                width: 740,
                                marginTop: "1em",
                              }}
                              onChange={(e) => {
                                setReviewSummaryUpdated(e.target.value);
                              }}
                            />
                            <Box m={3} style={{ margin: "unset" }}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Rating
                                  style={{ marginBottom: -3 }}
                                  size="small"
                                  name="half-rating"
                                  precision={0.5}
                                  onClick={(e) => {
                                    setReviewRatingUpdated(
                                      parseInt(e.target.value) * 2
                                    );
                                  }}
                                />
                                <div>
                                  {" "}
                                  <Button
                                    size="small"
                                    onClick={() => {
                                      setEdit([
                                        edit.filter((o) => o.edit != i),
                                      ]);
                                      setReviewUpdated("");
                                      setReviewSummaryUpdated("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() => {
                                      setEdit([
                                        edit.filter((o) => o.edit != i),
                                      ]);
                                      handleReviewEdit(item._id, i);
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
                              {item.review_detail}{" "}
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
                                <Link
                                  to={`/user/${item?.userId}`}
                                  style={{ color: "white" }}
                                >
                                  {item.reviewer}
                                </Link>
                              </span>
                            </div>
                            <Box m={3} style={{ margin: "unset" }}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <p style={{ textAlign: "left", color: "gray" }}>
                                  posted on{" "}
                                  {new Date(
                                    item.review_date
                                  ).toLocaleDateString()}
                                </p>
                                <Rating
                                  style={{ marginBottom: -3 }}
                                  size="small"
                                  name="half-rating"
                                  value={parseInt(item.rating) / 2}
                                  precision={0.5}
                                  readOnly
                                />
                              </Stack>
                            </Box>
                          </>
                        )}
                      </div>
                      <Box m={3} style={{ margin: "unset" }}>
                        <Stack
                          direction="row"
                          justifyContent={owner ? "space-between" : "end"}
                        >
                          {owner &&
                            edit.filter((o) => o.edit == i).length == 0 && (
                              <Button
                                style={{
                                  display: "contents",
                                  color: "white",
                                }}
                                size="small"
                                icon
                                onClick={() => {
                                  setEdit([...edit, { edit: i }]);
                                  console.log(
                                    edit.filter((o) => o.edit == i),
                                    i,
                                    edit
                                  );
                                }}
                              >
                                <Icon name="edit" />
                              </Button>
                            )}

                          {(owner || auth?.roles.includes("Admin")) &&
                            edit.filter((o) => o.edit == i).length == 0 && (
                              <Button
                                style={{
                                  display: "contents",
                                  color: "white",
                                  marginLeft: 50,
                                }}
                                size="small"
                                icon
                                onClick={() => {
                                  handleRemoveReview(item._id);
                                }}
                              >
                                {" "}
                                <Icon name="delete" />
                              </Button>
                            )}
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
                <Divider className="ReviewDivider" variant="fullWidth" />
              </>
            );
          })
          .reverse()}
      </div>
    </div>
  );
};

export default Reviews;
