import { React, AllWidgetProps, IMState, IMUrlParameters, jsx } from 'jimu-core'
import { IMConfig } from '../config';
import { useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from 'jimu-ui'
import defaultI18nMessages from './translations/default'
import Portal from 'esri/portal/Portal';





export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {

  private fmeHelthCheck: string = `${this.props.config.fmeServerUrl}/fmerest/v3/healthcheck?ready=false&textResponse=false`
  private fmeRepositoryWorkspace: string = `${this.props.config.fmeServerUrl}/fmerest/v3/repositories/${this.props.config.fmeRepository}/items?type=WORKSPACE&detail=high`
  private fmeAuthorization = "fmetoken token=" + this.props.config.fmeToken


  constructor(props) {
    super(props);
    this.state = {
      fmeStatus: null,
      fmeStatusError: null,
      fmeStatusLoading: true,
      fmeWorkSpace: null,
      fmeWorkSpaceError: null,
      fmeWorkSpaceLoading: true,
      mail: ""
    };
  }


  componentDidMount() {
    this.getMailFromPortal();
    this.getFmeHelthCheck();
    this.getFmeWorkspace();
  }

  getMailFromPortal() {
    const portal = new Portal({ authMode: 'immediate' });
    portal.load().then(() => {
      const user = portal.user;
      if (user) {
        console.log(user.email)
        this.setState({ mail: user.email });
      } else {
        console.log('User not authenticated');
      }
    });
  }

  async getFmeHelthCheck() {
    try {
      const response = await fetch(this.fmeHelthCheck);
      const data = await response.json();
      this.setState({ fmeStatus: data.status, fmeStatusLoading: false });
    } catch (fmeStatusError) {
      this.setState({ fmeStatusError, fmeStatusLoading: false });
    }
  }

  async getFmeWorkspace() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.fmeAuthorization,
      }
    };
    try {
      const response = await fetch(this.fmeRepositoryWorkspace, requestOptions);
      const data = await response.json();
      this.setState({ fmeWorkSpace: data, fmeWorkSpaceLoading: false });
    } catch (fmeWorkSpaceError) {
      this.setState({ fmeWorkSpaceError, fmeWorkSpaceLoading: false });
    }
  }


  render() {
    const { fmeWorkSpace, fmeWorkSpaceError, fmeWorkSpaceLoading } = this.state;
    return <Card>
      <CardHeader><h5>FME</h5></CardHeader>
      <CardBody>
        <div className="widget-fme-workspace-runner jimu-widget">
          <div>
            <h2>{defaultI18nMessages.email}: {this.state.mail}</h2>
          </div>

          <div>
            {fmeWorkSpaceLoading &&
              <h2>fmeWorkSpaceLoading</h2>
            }
            {fmeWorkSpaceError &&
              <h2>fmeWorkSpaceError</h2>
            }
            {(!fmeWorkSpaceLoading && !fmeWorkSpaceError) &&
              <div>{fmeWorkSpace.items.map(item => (
                <Card>

                  <CardHeader>{item.title}</CardHeader>
                  <CardBody>
                    <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
                  </CardBody>
                </Card>
              )
              )
              }</div>
            }
          </div>
        </div>
      </CardBody>
      <CardFooter className="d-flex justify-content-between">
        <h6>FMEStatus: {this.state.fmeStatus}</h6>
      </CardFooter>
    </Card>
  }
}