import { React, FormattedMessage } from 'jimu-core';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { UrlInput, UrlInputResult, TextInput } from 'jimu-ui'
import { IMConfig } from '../config';
import defaultI18nMessages from './translations/default'

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>, any> {
  onFmeServerUrlChange = (result: UrlInputResult) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('fmeServerUrl', result.value)
    });
  }

  onFmeTokenChange = (text: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('fmeToken', text)
    });
  }

  onFmeRepositoryChange = (text: string) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('fmeRepository', text)
    });
  }

  render() {
    return <div className="widget-setting-fme-workspace-runner">
      <label>
        {defaultI18nMessages.fmeServerUrl}:
        <UrlInput
          defaultValue={this.props.config.fmeServerUrl}
          onChange={this.onFmeServerUrlChange}
          schemes={['https']} />
      </label>

      <label>
        {defaultI18nMessages.fmeToken}:
        <TextInput
          allowClear
          htmlSize={40}
          defaultValue={this.props.config.fmeToken}
          onAcceptValue={this.onFmeTokenChange}
          type="text" />
      </label>
      <label>
        {defaultI18nMessages.fmeRepository}:
        <TextInput
          allowClear
          htmlSize={40}
          defaultValue={this.props.config.fmeRepository}
          onAcceptValue={this.onFmeRepositoryChange}
          type="text" />
      </label>
    </div>
  }
}

