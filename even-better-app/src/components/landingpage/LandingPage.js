import React, { Component } from 'react'
import './css/LandingPage.css';
import InviteColumn from './InviteColumn'
import BetsColumn from './BetsColumn'
import MediationRequestsColumn from '../MediationRequests/MediationRequestsColumn'
import PopupBets from './PopupBets'
import PointsColumn from './PointsColumn'
import ChangingProgressbar from './ChangingProgressbar'
import Resource from '../../models/resource'
import axios from 'axios'

import Container from 'muicss/lib/react/container'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'


var pointsFunction = require('../landingpage/ranklogic')

const UserStore = Resource('users')

var config = {
  headers: {
    "Authorization": "Bearer " + window.localStorage.auth_token,
  }
}



class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      invites: [],
      bets: [],
      betsUsers: [],
      mediationRequests: []
    }
  }

  // Getter function passed to children
  getMainState = () => {
    return this.state
  }

  // Helper function that allows Invites to be loaded/reloaded
  loadInvites = () => {
    axios.get(`/api/v1/bets/invites.json`, config)
    .then(response => {
      console.log("Reloading Invites" + response.data)
      this.setState({
        ...this.state,
        invites: response.data.reverse()
      })
      return null
    })
    .catch(error => {
      console.log("Error in invites", error)
    })
  }

  loadMediationRequests = () => {
    axios.get(`/api/v1/bets/mediation-requests.json`, config)
    .then(response => {
      console.log("Reloading Mediation Requests" + response.data)
      this.setState({
        ...this.state,
        mediationRequests: response.data.reverse()
      })
      return null
    })
    .catch(error => {
      console.log("Error in Mediation Requests", error)
    })
  }

  // Helper function that allows Active Bets to be loaded/reloaded
  loadBets = () => {
    axios.get(`/api/v1/bets/acceptances`, config)
    .then(response => {
      console.log("Reloading Acceptances" + response.data)
      this.setState({
        ...this.state,
        bets: response.data.reverse()
      })
      this.loadBetsUsers()
      return null
    })
    .catch(error => {
      console.log("Error in Acceptances", error)
    })
  }

  loadBetsUsers = () => {
    axios.get(`/api/v1/bets_users.json`, config)
    .then(response => {
      console.log("Reloading BetsUsers" + response.data)
      this.setState({
        ...this.state,
        betsUsers: response.data
      })
      return null
    })
    .catch(error => {
      console.log("Error in BetsUsers", error)
    })
  }

  componentWillMount() {
    UserStore.find(this.props.currentUser)
      .then((response) => {
        this.setState({
          user: response
        })
      })
  }
  componentDidMount() {
    window.scrollTo(0, 0)
  }
  render() {
    return (
      <Container
      class="landing-container"
      fluid={true}
      style={{padding: 0, backgroundColor: '#E0E0E0'}}
      >
              <Col
                md="4"
                style={{backgroundColor: '#455A64'}}
                id="stats-column">
              <div style={{ minHeight: 'calc(100vh - 64px)'}}>
                {/* <div> */}
                  <h1 style={{color: '#80DEEA', paddingLeft: 15}}>Hello, <strong>{this.state.user.username}!</strong></h1>
                  <h3 style={{color: '#80DEEA', paddingLeft: 15}}><strong>Rank</strong>: {pointsFunction.rankDetermine(this.state.user.points).rank}</h3>
                  <PointsColumn user={this.state.user}/>
                {/* </div> */}
                <ChangingProgressbar
                      style={{textAlign: 'center'}}
                      user={this.state.user}
                      percentages ={[0,pointsFunction.rankDetermine(this.state.user.points).percentageComplete]}
                    />
              </div>
              </Col>
            <Col md="8">
              <Row>
                <PopupBets
                style={{paddingLeft: '10px'}}
                loadBets={this.loadBets}
                />
              </Row>
              <Row>
                <Col md="6">
                  <div className="invite-column">
                    <InviteColumn
                      getMainState={this.getMainState}
                      loadInvites={this.loadInvites}
                      loadBets={this.loadBets}/>
                  </div>
                  <div className="med-req-column">
                    <MediationRequestsColumn
                      getMainState={this.getMainState}
                      loadMediationRequests={this.loadMediationRequests}
                      loadBets={this.loadBets}/>
                  </div>
                </Col>
                <Col md="6">
                  <BetsColumn
                  user={this.state.user}
                  getMainState={this.getMainState}
                  loadBets={this.loadBets}/>
                </Col>
              </Row>
            </Col>

      </Container>
    )
  }
}

export default LandingPage
