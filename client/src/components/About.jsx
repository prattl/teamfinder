import React, { Component } from "react";
import { Helmet } from "react-helmet";

import { Alert, Col, Row } from "react-bootstrap";
import { Link } from "react-router";

import FeedbackButton from "components/feedback/FeedbackButton";

const todo = <i className="fa fa-square" />;
const todoComplete = <i className="fa fa-check-square" />;

const FeatureListItem = ({ children, complete = false, extra = null }) => (
  <li>
    {complete ? todoComplete : todo}
    &nbsp;
    {complete ? <span>{children}</span> : <span>{children}</span>}
    {extra && (
      <span>
        &nbsp;
        {extra}
      </span>
    )}
  </li>
);
const openDotaLink = (
  <a href="https://www.opendota.com/" target="_blank" rel="external">
    OpenDota
  </a>
);

const RecentUpdates = () => (
  <ul className="list-unstyled" style={{ marginLeft: "2rem" }}>
    <FeatureListItem complete={true}>Sign in with Steam</FeatureListItem>
    <FeatureListItem complete={true}>Email notifications</FeatureListItem>
    <FeatureListItem complete={true}>
      View Steam Profile Link added
    </FeatureListItem>
    <FeatureListItem
      complete={true}
      extra={
        <span>
          (thanks {openDotaLink}
          !)
        </span>
      }
    >
      Confirm MMR
    </FeatureListItem>
    <FeatureListItem complete={true}>
      Player and team interests (competitive, casual, battle cup, etc.)
    </FeatureListItem>
    <FeatureListItem complete={true}>Language preferences</FeatureListItem>
    <FeatureListItem complete={true}>Player bios</FeatureListItem>
    <FeatureListItem complete={true}>Team bios and logo upload</FeatureListItem>
  </ul>
);

const ComingSoon = () => (
  <ul className="list-unstyled" style={{ marginLeft: "2rem" }}>
    <FeatureListItem complete={false}>Complete redesign</FeatureListItem>
    <FeatureListItem complete={false}>
      Send messages to your team and recruits
    </FeatureListItem>

    <FeatureListItem complete={false}>Timezone preferences</FeatureListItem>
    <FeatureListItem complete={false}>
      Automated matching / recommendations
    </FeatureListItem>
    <FeatureListItem complete={false}>Verify players</FeatureListItem>
    <FeatureListItem>Schedule team events</FeatureListItem>
    <FeatureListItem>Scrim against other teams</FeatureListItem>
  </ul>
);

const description =
  "Find out more about the Dota 2 Team Finder, including how it works and recent updates.";

class Index extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>About | Dota 2 Team Finder</title>
          <meta name="description" content={description} />
        </Helmet>
        <h1>About</h1>

        <p className="lead">
          This website was created to bring the Dota 2 community together and
          open opportunities for players who are interested in finding a team to
          play with, whether it be for casual games or something more
          competitive.
        </p>

        <Row>
          <Col md={6}>
            <h3>How it Works</h3>
            <p>
              Getting started is easy. Within minutes you can apply to join a
              team, or create your own team and invite players. Here's how it
              works:
            </p>
            <ol>
              <li>Sign in with Steam</li>
              <li>Complete your player profile</li>
              <li>
                If you're looking for a team, click{" "}
                <Link to="/teams">Find Teams</Link> and apply.
              </li>
              <li>
                If you want to create your own team, click{" "}
                <Link to="/players">Find Players</Link>
                and invite them to apply.
              </li>
            </ol>
            <Alert>
              <i className="fa fa-info-circle" />
              &nbsp;If you just want to browse, no sign in is required!
            </Alert>
          </Col>
          <Col md={6}>
            <h3>Alpha Release</h3>
            <p>
              This is the alpha release of the Dota 2 Team Finder. Feedback is
              greatly appreciated - you can use the{" "}
              <FeedbackButton inline={true} /> button to submit feedback on any
              page.
            </p>
            <h4>Recent Updates:</h4>
            <RecentUpdates />
            <h4>Coming Soon:</h4>
            <ComingSoon />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Index;
