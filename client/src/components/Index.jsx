import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  ButtonToolbar,
  Col,
  Grid,
  Navbar,
  Nav,
  NavItem,
  Row
} from "react-bootstrap";
import { Link } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { createStructuredSelector } from "reselect";

import { requestTeamSearch } from "actions/teamSearch";
import { withAllFixtures } from "components/connectors/WithFixtures";
import { RegionIcon, MMRIcon, PositionIcon } from "utils/components/icons";
import { teamSearchSelector } from "utils/selectors";
import { encodeLogoUrl, FixtureDisplay, TeamMMRDisplay } from "utils";

const steamSignInRedirectDomain =
  process.env.NODE_ENV === "production"
    ? "https://dotateamfinder.com:8000"
    : "http://localhost:8000";

const Links = () => (
  <ButtonToolbar>
    <LinkContainer to="/teams">
      <Button bsStyle="link">
        <strong>Find Teams</strong>
      </Button>
    </LinkContainer>
    <LinkContainer to="/players">
      <Button bsStyle="link">
        <strong>Find Players</strong>
      </Button>
    </LinkContainer>
    <LinkContainer to="/about">
      <Button bsStyle="link">
        <strong>About</strong>
      </Button>
    </LinkContainer>
    <Button
      className="index-cta"
      bsStyle="success"
      href={`${steamSignInRedirectDomain}/login/steam/?next=/social-redirect`}
    >
      <i className="fa fa-steam" />
      &nbsp;Sign in with steam
    </Button>
  </ButtonToolbar>
);

const hideOverflowStyle = {
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden"
};

let FeaturedTeam = ({
  fixtures,
  id,
  logo_url,
  name,
  mmr_average,
  regions,
  available_positions,
  color
}) => {
  // if (regions && regions.length > 2) regions.splice(0, 2)
  // if (available_positions && available_positions.length > 2) available_positions.splice(0, 2)
  return (
    <div className="featured-team" style={{ borderLeft: `4px solid ${color}` }}>
      <Row>
        {logo_url && (
          <Col xs={4}>
            <img
              className="img-responsive"
              src={encodeLogoUrl(logo_url)}
              alt=""
            />
          </Col>
        )}
        <Col xs={logo_url ? 8 : 12}>
          <div>
            <h5 style={hideOverflowStyle}>
              <Link to={`/teams/${id}`}>{name}</Link>
            </h5>
            <div style={{ ...hideOverflowStyle, marginBottom: "0.5rem" }}>
              <MMRIcon fixedWidth />
              &nbsp;
              <TeamMMRDisplay mmr={mmr_average} />
            </div>
            <div style={{ ...hideOverflowStyle, marginBottom: "0.5rem" }}>
              <RegionIcon fixedWidth />
              &nbsp;
              <FixtureDisplay value={regions} fixture={fixtures.regions} />
            </div>
            <div style={hideOverflowStyle}>
              <PositionIcon fixedWidth />
              &nbsp;
              <FixtureDisplay
                value={available_positions}
                fixture={fixtures.positions}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
FeaturedTeam = withAllFixtures(FeaturedTeam);

const featuredTeamColors = ["#eaff00", "#147e40", "#FFF", "#009ee6"];

const DesktopIndex = ({ teams }) => (
  <div className="index index-splash hidden-xs">
    <div className="navigation clearfix">
      <Grid>
        <h3>
          Dota 2 Team Finder{" "}
          <sup>
            <small>Beta</small>
          </sup>
        </h3>
        <span className="links">
          <Links />
        </span>
      </Grid>
    </div>
    <div className="intro-container">
      <div className="intro">
        <Grid>
          <Row>
            <Col xs={12} md={10} mdOffset={1} lg={8} lgOffset={2}>
              <h1>Introducing the Dota 2 Team Finder</h1>
              <p className="lead">
                The Dota 2 Team Finder is the easiest way to find your next Dota
                team.
              </p>
              <p className="lead">
                Find players with similar insterests and create the perfect team
                for tournaments, battle cup, scrims, or casual games.
              </p>
              <ButtonToolbar>
                <LinkContainer to="/teams">
                  <Button
                    bsStyle="success"
                    bsSize="large"
                    className="index-cta"
                  >
                    Find Teams
                  </Button>
                </LinkContainer>
                <LinkContainer to="/players">
                  <Button
                    bsStyle="success"
                    bsSize="large"
                    className="index-cta"
                  >
                    Find Players
                  </Button>
                </LinkContainer>
              </ButtonToolbar>
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
    <div className="featured-teams">
      <Grid fluid style={{ maxWidth: "1440px" }}>
        <h4>Featured Teams</h4>
        <Row>
          {teams.map((team, i) => (
            <Col md={3} sm={6} key={`featured-team-${team.name}`}>
              <FeaturedTeam {...team} color={featuredTeamColors[i]} />
            </Col>
          ))}
        </Row>
      </Grid>
    </div>
  </div>
);

const MobileIndex = ({ teams }) => (
  <div className="index index-splash visible-xs">
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">
            <strong>
              Dota 2 Team Finder{" "}
              <sup>
                <small>Beta</small>
              </sup>
            </strong>
          </a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem eventKey={1} href="/teams">
            Find Teams
          </NavItem>
          <NavItem eventKey={2} href="/players">
            Find Players
          </NavItem>
          <NavItem eventKey={3} href="/about">
            About
          </NavItem>{" "}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <div className="intro">
      <Grid>
        <h1>Introducing the Dota 2 Team Finder</h1>
        <p className="lead">
          The Dota 2 Team Finder is the easiest way to find your next Dota team.
        </p>
        <p className="lead" style={{ marginBottom: "4rem" }}>
          Find players with similar insterests and create the perfect team for
          tournaments, battle cup, scrims, or casual games.
        </p>
        <div className="text-center" style={{ marginBottom: "2rem" }}>
          <LinkContainer to="/teams">
            <Button bsStyle="success" bsSize="large" className="index-cta">
              Find Teams
            </Button>
          </LinkContainer>
        </div>
        <div className="text-center" style={{ marginBottom: "4rem" }}>
          <LinkContainer to="/players">
            <Button bsStyle="success" bsSize="large" className="index-cta">
              Find Players
            </Button>
          </LinkContainer>
        </div>
      </Grid>
    </div>
    <div className="featured-teams">
      <Grid>
        <h4>Featured Teams</h4>
        <Row>
          {teams.map((team, i) => (
            <Col md={3} sm={6} key={`featured-team-${team.name}`}>
              <FeaturedTeam {...team} color={featuredTeamColors[i]} />
            </Col>
          ))}
        </Row>
      </Grid>
    </div>
  </div>
);

class IndexRedesign extends Component {
  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    const {
      teamSearch: { isLoading, lastUpdated, results }
    } = this.props;
    const teams = !isLoading && lastUpdated ? results.splice(0, 4) : [];
    return (
      <div className="index-container">
        <DesktopIndex teams={teams} />
        <MobileIndex teams={teams} />
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    teamSearch: teamSearchSelector
  }),
  { onLoad: () => requestTeamSearch({ keywords: "" }) }
)(IndexRedesign);
