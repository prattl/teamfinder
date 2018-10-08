import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { submit } from "redux-form";
import { createStructuredSelector } from "reselect";
import { Helmet } from "react-helmet";

import { requestTeamSearch, requestNextPageOfTeams } from "actions/teamSearch";
import { teamSearchSelector } from "utils/selectors";

import { Button } from "react-bootstrap";
import { Loading } from "utils";
import LastUpdated from "utils/components/LastUpdated";
import TeamSearchResult from "components/TeamSearchResult";

import { withOwnPlayer } from "components/connectors/WithOwnPlayer";

class TeamSearchResults extends PureComponent {
  constructor(props) {
    super(props);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  componentDidMount() {
    this.props.submit("teamSearch");
  }

  handleRefreshClick(e) {
    e.preventDefault();
    this.props.submit("teamSearch");
  }

  render() {
    const {
      requestNextPageOfTeams,
      teamSearch: {
        results,
        count,
        next,
        nextPageLoading,
        isLoading,
        lastUpdated
      }
    } = this.props;
    return (
      <div>
        <Helmet>
          <title>Find Teams | Dota 2 Team Finder</title>
          <meta
            name="description"
            content="Search for your next Dota 2 team."
          />
        </Helmet>
        <div
          style={{
            margin: "2rem 0",
            visibility: lastUpdated ? "visible" : "hidden"
          }}
        >
          <div className="pull-left">{count} teams found</div>
          <div className="pull-right">
            Last updated{" "}
            {lastUpdated && <LastUpdated lastUpdated={lastUpdated} />}
            &nbsp; (
            <a href="" onClick={this.handleRefreshClick}>
              refresh
            </a>
            )
          </div>
          <div style={{ clear: "both" }} />
        </div>
        {isLoading ? (
          <Loading />
        ) : lastUpdated ? (
          <div>
            {results.map(result => (
              <div key={result.id}>
                <TeamSearchResult {...result} />
              </div>
            ))}
            {next && (
              <div className="text-center">
                <Button
                  bsStyle="default"
                  disabled={nextPageLoading}
                  onClick={() => requestNextPageOfTeams()}
                >
                  &darr;&nbsp;Next
                </Button>
                {nextPageLoading && <Loading />}
              </div>
            )}
          </div>
        ) : (
          <p>Error, please try again.</p>
        )}
      </div>
    );
  }
}

TeamSearchResults = withOwnPlayer(TeamSearchResults);

TeamSearchResults = connect(
  createStructuredSelector({
    teamSearch: teamSearchSelector
  }),
  { requestTeamSearch, requestNextPageOfTeams, submit }
)(TeamSearchResults);

export default TeamSearchResults;
