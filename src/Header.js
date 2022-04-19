import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Image, Menu, Dropdown, Icon } from "semantic-ui-react";
import useAuth from "./hooks/useAuth";
import "./Navbar.css";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [active, setActive] = useState("/");
  const trigger = (
    <span>
      <strong>{auth?.username}</strong>
    </span>
  );

  return (
    <Menu>
      <Menu.Item className="special" header position="left">
        <Image size="small" src="/logo.png" />
      </Menu.Item>
      <Menu.Item
        className="itemCentering"
        name="Home"
        active={location.pathname === "/"}
        onClick={(e) => {
          navigate("/");
        }}
      />
      {auth?.accessToken && (
        <Dropdown
          className={
            location.pathname.includes("Followed") ||
            location.pathname.includes("Suggested")
              ? "active"
              : ""
          }
          item
          text="Activity"
        >
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={(e) => {
                navigate("/Followed/Watchlists");
              }}
            >
              Followed Watchlists
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                navigate("/Followed/Users");
              }}
            >
              Followed Users
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                navigate("/Movie/Suggested");
              }}
            >
              Suggested Movies
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}

      <Menu.Item
        name="Analytics"
        className="special"
        active={location.pathname === "/Analytics"}
        onClick={(e) => {
          navigate("/Analytics");
        }}
      />

      <Menu.Item
        name="Search"
        className="special"
        active={location.pathname.includes("Search")}
        onClick={(e) => {
          navigate("/Search");
        }}
      />
      <Menu.Item
        name="About"
        className="special"
        active={location.pathname.includes("About")}
        onClick={(e) => {
          navigate("/About");
        }}
      />
      {auth?.accessToken ? (
        <Menu.Menu position="right">
          <Menu.Item style={{ width: "unset" }}>
            <Image
              src={`https://ui-avatars.com/api/?name=${auth?.username}&background=fff&color=000`}
              size="mini"
              circular
            />
            &nbsp; &nbsp; &nbsp; &nbsp;
            <Dropdown trigger={trigger}>
              <Dropdown.Menu>
                <Dropdown.Item disabled>
                  <span>
                    Signed in as <strong>{auth?.username}</strong>
                  </span>{" "}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(e) => {
                    navigate("/profile");
                  }}
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(e) => {
                    setAuth({});
                    navigate("/login");
                  }}
                >
                  Sign out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu.Menu>
      ) : (
        <Menu.Menu position="right">
          <Menu.Item
            onClick={(e) => {
              navigate("/Signup");
            }}
          >
            Sign Up
          </Menu.Item>
          <Menu.Item
            onClick={(e) => {
              navigate("/Login");
            }}
          >
            Log In
          </Menu.Item>
        </Menu.Menu>
      )}
    </Menu>
  );
}
export default Nav;
