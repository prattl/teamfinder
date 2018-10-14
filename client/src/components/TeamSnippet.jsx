import React, { Component } from "react";
import { compose } from "redux";
import { Button, Col, Image, Label, Row } from "react-bootstrap";

import { Link } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import {
  encodeLogoUrl,
  FixtureDisplay,
  Loading,
  TeamMMRDisplay,
  playerIsOnTeam
} from "utils";
import {
  CaptainIcon,
  InterestIcon,
  LanguageIcon,
  RegionIcon,
  PlayersIcon,
  PositionIcon,
  MMRIcon
} from "utils/components/icons";
import Bio from "components/utils";

import { withAllFixtures } from "components/connectors/WithFixtures";
import { withOwnPlayer } from "components/connectors/WithOwnPlayer";
import { withTeam } from "components/connectors/WithTeam";

class TeamSnippet extends Component {
  render() {
    const {
      fixtures: { interests, languages, regions, positions }
    } = this.props;
    const {
      team: { team, isLoading, lastUpdated },
      player,
      newItems: { new_team_applications }
    } = this.props;
    return (
      <div
        style={{ padding: "1rem", margin: "2rem 0", border: "1px solid #DDD" }}
      >
        {isLoading ? (
          <Loading />
        ) : lastUpdated ? (
          <Row>
            <Col xs={4} sm={2}>
              <Image
                src={
                  team.logo_url
                    ? encodeLogoUrl(team.logo_url)
                    : "https://via.placeholder.com/300x300"
                }
                thumbnail
              />
            </Col>
            <Col xs={8} sm={10}>
              <div>
                <h4 className="pull-left">
                  <Link to={`/teams/${team.id}`}>{team.name}</Link>
                  {playerIsOnTeam(player, team) && (
                    <span>
                      &nbsp;
                      <LinkContainer to={`/teams/manage/${team.id}/`}>
                        <Button bsSize="sm">
                          <i className="fa fa-cog" />
                          &nbsp;Manage
                        </Button>
                      </LinkContainer>
                      {new_team_applications > 0 && (
                        <span>
                          &nbsp;
                          <Label bsStyle="info" bsSize="md">
                            <i className="fa fa-exclamation-circle" />
                            &nbsp;
                            {new_team_applications} new application
                            {new_team_applications > 1 && "s"}
                          </Label>
                        </span>
                      )}
                    </span>
                  )}
                </h4>
                <span className="pull-right">
                  <div className="text-right">
                    <i
                      className={`fa fa-${
                        team.available_positions.length > 0
                          ? "check-square-o"
                          : "square-o"
                      }`}
                    />
                    &nbsp;Recruiting
                  </div>
                  <div />
                </span>
                <div style={{ clear: "both" }} />
              </div>

              <div style={{ marginBottom: "0.5rem" }}>
                <RegionIcon fixedWidth={true} />
                &nbsp;
                <FixtureDisplay value={team.regions} fixture={regions} />
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <MMRIcon fixedWidth={true} />
                &nbsp;
                <TeamMMRDisplay mmr={team.mmr_average} />
              </div>
              {team.available_positions.length > 0 && (
                <div style={{ marginBottom: "0.5rem" }}>
                  <PositionIcon fixedWidth={true} />
                  &nbsp;Recruiting:&nbsp;
                  <FixtureDisplay
                    value={team.available_positions}
                    fixture={positions}
                  />
                </div>
              )}
              {team.interests.length > 0 && (
                <div style={{ marginBottom: "0.5rem" }}>
                  <InterestIcon fixedWidth={true} />
                  &nbsp;
                  <FixtureDisplay value={team.interests} fixture={interests} />
                </div>
              )}
              <div style={{ marginBottom: "0.5rem" }}>
                <LanguageIcon fixedWidth={true} />
                &nbsp;
                <FixtureDisplay value={team.languages} fixture={languages} />
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <Bio bio={team.bio} id={team.id} />
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <PlayersIcon fixedWidth={true} />
                &nbsp;
                {team.team_members.map(teamMember => (
                  <div
                    style={{ display: "inline-block", marginRight: "0.5rem" }}
                    key={`team-member-${teamMember.id}`}
                  >
                    <Link
                      to={`/players/${teamMember.player.id}/`}
                      style={{ color: "#FFF" }}
                    >
                      <Label>
                        {team.captain === teamMember.player.id && (
                          <span>
                            <CaptainIcon />
                            &nbsp;
                          </span>
                        )}
                        {teamMember.player.username}
                        {teamMember.position &&
                          ` - ${positions.items[teamMember.position] &&
                            positions.items[teamMember.position].name}`}
                      </Label>
                    </Link>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        ) : null}
      </div>
    );
  }
}

TeamSnippet = compose(
  withOwnPlayer,
  withTeam(props => props.teamId),
  withAllFixtures
)(TeamSnippet);

export default TeamSnippet;
