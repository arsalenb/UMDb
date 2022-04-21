import React, {useEffect, useState} from "react";
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
import axios from "./api/axios";
import {useParams} from "react-router-dom";


const Reviews = ({title, userId, username}) => {
  console.log(title, userId, username)
  const { id } = useParams();
  const Id = {id}
  const movieId = Id.id
  const [edit, setEdit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState();
  const [formDataCreate, setFormDataCreate] = useState({
    review_summary : '',
    review_detail : '',
    rating : ''
  });

  const [new_rating, setNewRating] = useState();
  const [formDataEdit, setFormDataEdit] = useState({
    new_review_summary : '',
    new_review_detail : '',
    new_rating : ''
  });
  const {review_summary, review_detail} = formDataCreate;
  const {new_review_summary, new_review_detail} = formDataEdit;

  const imgLink =
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

  const onChangeCreate = (e) => {
    setFormDataCreate((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit  = async () => {
    console.log(userId, username, movieId, title, rating, review_summary, review_detail)
    try {
      await axios.post(`/api/review/crtrev`, {
        userId, username, movieId, title, rating, review_summary, review_detail
      });
    } catch (e) {
      console.log(e)
    }
  };
  useEffect(() => {
    handleSubmit()
  }, []);

  const handleEdit  = async () => {
    console.log(userId, username, movieId, title, new_rating, new_review_summary, new_review_detail)
    try {
      await axios.put(`/api/review/upd`, {
        userId, username, movieId, title, rating, review_summary, review_detail
      });
    } catch (e) {
      console.log(e)
    }
  };
  useEffect(() => {
    handleEdit()
  }, []);


  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/review/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data.reviews)
      setReviews([...response.data.reviews]);
    }catch (e) {
      console.log(e)
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div style={{ marginTop: 40 }}>
      <Header inverted as="h3" dividing style={{ fontSize: "2.5em" , marginLeft:20}}>
        Reviews
      </Header>
      <div style={{ width: "70em" }}>
        <Form reply style={{ marginBottom: 20 , marginLeft: 20, width:"60em"}} onSubmit={handleSubmit}>
          <Form.Input
              fluid
              placeholder="Summary"
              required
              name="review_summary"
              value={review_summary}
              disabled={success}
              onChange={onChangeCreate}
          />
          <Form.TextArea
              control={Input}
              style={{ minHeight: 300, width: "60em"}}
              placeholder={"Review description ..."}
              name="review_detail"
              value={review_detail}
              disabled={success}
              onChange={onChangeCreate}
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
                  control={Input}
                  style={{ marginTop: 5 }}
                  size="large"
                  name="rating"
                  defaultValue={0}
                  precision={0.5}
                  value={rating}
                  disabled={success}
                  onChange={(event, newValue) => {
                    setRating(newValue*2)
                    setFormDataCreate((prevState) => ({
                      ...prevState,
                      rating: newValue*2,
                    }));
                  }}
              />
            </Stack>
          </Box>
        </Form>
      </div>
      {reviews.map((review) => (
        <div style={{ padding: 14 }} className="App">
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
                      {review.review_summary}
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
                              control={Input}
                              style={{ marginTop: 5 }}
                              size="large"
                              name="new_rating"
                              defaultValue={0}
                              precision={0.5}
                              value={new_rating}
                              disabled={success}
                              onChange={(event, newValue) => {
                                setNewRating(newValue*2)
                                setFormDataEdit((prevState) => ({
                                  ...prevState,
                                  rating: newValue*2,
                                }));
                              }}
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
                                setEdit(true);
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
                        {review.review_detail}
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
                          {review.reviewer}
                        </span>
                      </div>
                      <Box m={3} style={{ margin: "unset" }}>
                        <Stack direction="row" justifyContent="space-between">
                          <p style={{ textAlign: "left", color: "gray" }}>
                            posted on {review.review_date}
                          </p>
                          <Rating
                            style={{ marginBottom: -3 }}
                            size="small"
                            name="half-rating"
                            value={(review.rating)/2}
                            precision={0.5}
                            readOnly
                          />
                        </Stack>
                      </Box>
                    </>
                  )}
                </div>
                  <Box m={2} style={{ margin: "unset" }}>
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
                        size="medium"
                        icon
                        onClick={() => {
                          setEdit(false);
                        }}
                      >
                        {" "}
                        <Icon name="delete" />
                      </Button>
                    </Stack>
                  </Box>
              </Grid>
            </Grid>
          </Paper>
          <Divider className="ReviewDivider" variant="fullWidth" />
        </div>
      ))}
    </div>
  );
};

export default Reviews;
