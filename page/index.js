import React, {Component} from 'react';
import {connect} from 'react-redux';
import Edit from './Edit.js';
import PropTypes from 'prop-types';
import axios from 'axios';
import {message} from 'antd';

@connect(state => {
    return {projectMsg: state.project.currProject};
}, {})

class DdPushPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dingding_url: "",
            push_type: {
                create_api: false,
                update_api: false,
                delete_api: false
            }
        };
    }
    async componentDidMount() {
        const currProjectId = this.props.match.params.id;
        await this.handleData({project_id: currProjectId});
    }

    handleData = async params => {
        let result = await axios.get('/api/plugin/ddpush/get', {params});
        if (result.data.errcode === 0) {
            const data = result.data.data;
            if (data) {
                this.setState({dingding_url: data.dingding_url, push_type: data.push_type});
            }
        } else {
            message.error(`请求数据失败： ${result.data.errmsg}`);
        }
    };
    handleSave = async(dingding_url, push_type) => {
        const project_id = this.props.match.params.id
        let option = {
            project_id,
            dingding_url,
            push_type
        }
        let result = await axios.post('/api/plugin/ddpush/up', option);
        if (result.data.errcode === 0) {
            message.success("更新成功")
            await this.handleData({project_id: project_id});
        } else {
            message.error(`更新失败： ${result.data.errmsg}`);
        }
    };
    handleTest = async(dingding_url) => {
        console.log(dingding_url)
        let result = await axios.post('/api/plugin/ddpush/test', {dingding_url: dingding_url});
        if (result.data.errcode === 0) {
            message.success(`测试成功`);
        } else {
            message.error(`测试失败： ${result.data.errmsg}`);
        }
    }
    static propTypes = {
        match: PropTypes.object,
        curProjectRole: PropTypes.string
    };
    render() {
        const {dingding_url, push_type} = this.state;
        return (
          <div className="g-row">
            <div className="m-panel">
              <Edit
                        onTest={this.handleTest}
                        onSave={this.handleSave}
                        dingdingUrl
                        ={dingding_url}
                        pushType={push_type}></Edit>
            </div>
          </div>

        );
    }
}
export default DdPushPage;