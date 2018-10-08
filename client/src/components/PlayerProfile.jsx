import React, { Component } from "react";
import { Helmet } from "react-helmet";
import moment from "moment";

import { LinkContainer } from "react-router-bootstrap";
import { Button, Col, Image, Modal, Row } from "react-bootstrap";
import { withAllFixtures } from "components/connectors/WithFixtures";
import Bio from "components/utils";
import { FixtureDisplay, MMRDisplay } from "utils";
import {
  InterestIcon,
  LanguageIcon,
  RegionIcon,
  PositionIcon,
  MMRIcon
} from "utils/components/icons";
import TeamSnippet from "components/TeamSnippet";
import { withPlayer } from "components/connectors/WithPlayer";
import { withOwnPlayer } from "components/connectors/WithOwnPlayer";

const FixtureRow = ({ label, children }) => (
  <Row style={{ marginBottom: "1rem" }}>
    <Col sm={2} md={2} lg={2} className="hidden-xs">
      {label}
    </Col>
    <Col xs={12} sm={10} md={10} lg={10}>
      {children}
    </Col>
  </Row>
);

class PlayerProfile extends Component {
  render() {
    const {
      selectedPlayer: player,
      player: ownPlayer,
      fixtures: { interests, languages, regions, positions }
    } = this.props;

    return (
      <div>
        <Helmet>
          <title>{`${
            player.username
          } - Player Profile | Dota 2 Team Finder`}</title>
          <meta
            name="description"
            content={`View ${player.username}'s profile on Dota 2 team finder.`}
          />
        </Helmet>
        <h1>
          Player Profile
          {ownPlayer.id === player.id && (
            <LinkContainer to={`/profile`} style={{ float: "right" }}>
              <Button bsSize="sm">
                <i className="fa fa-pencil" />
                &nbsp;Edit Profile
              </Button>
            </LinkContainer>
          )}
        </h1>
        <div>
          <Row>
            <Col xs={4} sm={3}>
              <Image thumbnail src={player.avatarfull} />
              <div style={{ marginTop: "1rem" }}>
                <a
                  href={`http://steamcommunity.com/profiles/${player.steamid}`}
                  target="_blank"
                >
                  View Steam Profile
                </a>
              </div>
            </Col>
            <Col xs={8} sm={9}>
              <h2 style={{ marginTop: 0 }}>{player.username}</h2>
              <FixtureRow label="Regions:">
                <RegionIcon fixedWidth={true} />
                &nbsp;
                <FixtureDisplay value={player.regions} fixture={regions} />
              </FixtureRow>
              <FixtureRow label="MMR:">
                <MMRIcon fixedWidth={true} />
                &nbsp;
                <MMRDisplay
                  mmr={player.mmr}
                  mmrEstimate={player.mmr_estimate}
                />
              </FixtureRow>
              <FixtureRow label="Positions:">
                <PositionIcon fixedWidth={true} />
                &nbsp;
                <FixtureDisplay value={player.positions} fixture={positions} />
              </FixtureRow>
              {player.interests &&
                player.interests.length > 0 && (
                  <FixtureRow label="Interests:">
                    <InterestIcon fixedWidth={true} />
                    &nbsp;
                    <FixtureDisplay
                      value={player.interests}
                      fixture={interests}
                    />
                  </FixtureRow>
                )}
              <FixtureRow label="Languages:">
                <LanguageIcon fixedWidth={true} />
                &nbsp;
                <FixtureDisplay value={player.languages} fixture={languages} />
              </FixtureRow>
              <div style={{ marginTop: "1rem" }} />
              <FixtureRow label="Last login:">
                <i className="fa fa-fw fa-clock-o" />
                &nbsp;
                <span>{moment(player.last_login).format("L")}</span>
              </FixtureRow>
              <div>
                <Bio bio={player.bio} id={player.id} />
              </div>
            </Col>
          </Row>

          <h3>Teams</h3>
          {player.teams &&
            player.teams.map(team => (
              <Row key={`row-player-${player.id}-team-${team.id}`}>
                <Col md={8}>
                  <TeamSnippet teamId={team.id} />
                </Col>
              </Row>
            ))}
        </div>
      </div>
    );
  }
}

PlayerProfile = withPlayer(props => props.params.id)(PlayerProfile);
PlayerProfile = withOwnPlayer(PlayerProfile);

PlayerProfile = withAllFixtures(PlayerProfile);

export default PlayerProfile;
