import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// TODO: This should all be organized somehow...

const isProduction = process.env.NODE_ENV === "production";

export const createUrl = url =>
  isProduction ? `//dotateamfinder.com:8000${url}` : `//localhost:8000${url}`;

export const metaGenerator = meta => ({ receivedAt: Date.now() });

const arrayToObjectByIdentifier = identifier => list =>
  list.reduce((acc, val) => ({ ...acc, [val[identifier]]: val }), {});

export const arrayToObject = arrayToObjectByIdentifier("id");

export const Loading = () => (
  <div className="text-center">
    <i className="fa fa-cog fa-spin fa-2x" />
    &nbsp;Loading...
  </div>
);

export const FixtureDisplay = ({ value, fixture }) =>
  !fixture.isLoading && fixture.lastUpdated ? (
    <span>
      {Array.isArray(value)
        ? value.map(fixtureId => fixture.items[fixtureId].name).join(", ")
        : value
          ? fixture.items[value].name
          : null}
    </span>
  ) : null;

const estimatedMMRTooltip = (
  <Tooltip id="estimated-mmr-tooltip">
    This is the player's estimated MMR.
  </Tooltip>
);

const noMMRTooltip = (
  <Tooltip id="no-mmr-tooltip">
    This player has chosen to keep their MMR hidden from their Steam profile.
  </Tooltip>
);

const noTeamMMRTooltip = (
  <Tooltip id="no-team-mmr-tooltip">
    Unable to calculate average MMR for this team.
  </Tooltip>
);

const estimatedMMRFilterTooltip = (
  <Tooltip id="estimated-mmr-filter-tooltip">
    Check this box to include matches for estimated MMR for players who don't
    make their MMR public. Estimated MMR ratings are collected from OpenDota.
  </Tooltip>
);

export const EstimatedMMRHelpIcon = props => (
  <OverlayTrigger placement="top" overlay={estimatedMMRFilterTooltip}>
    <i className="fa fa-info-circle" />
  </OverlayTrigger>
);

export const TeamMMRDisplay = ({ mmr }) =>
  mmr && mmr > -1 ? (
    <span>{mmr}</span>
  ) : (
    <OverlayTrigger placement="top" overlay={noTeamMMRTooltip}>
      <i className="fa fa-question" />
    </OverlayTrigger>
  );

export const MMRDisplay = ({ mmr, mmrEstimate }) => {
  if (mmr) {
    return <span>{mmr}</span>;
  } else if (mmrEstimate) {
    return (
      <span>
        ~{mmrEstimate}
        &nbsp;
        <OverlayTrigger placement="top" overlay={estimatedMMRTooltip}>
          <i className="fa fa-info-circle" />
        </OverlayTrigger>
      </span>
    );
  }
  return (
    <span>
      <OverlayTrigger placement="top" overlay={noMMRTooltip}>
        <i className="fa fa-eye-slash" />
      </OverlayTrigger>
    </span>
  );
};

export const playerIsCaptain = (player, team) => player.id === team.captain.id;

export const playerIsOnTeam = (player, team) =>
  team.team_members.map(teamMember => teamMember.player.id).includes(player.id);

export const encodeLogoUrl = url => {
  const [base, filename] = url.split("team-logos/");
  return `${base}team-logos/${encodeURIComponent(filename)}`;
};
