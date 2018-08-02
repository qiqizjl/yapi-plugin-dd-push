import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    Form, Button,
    // message,
    Input,
    Tooltip,
    Icon,
    Checkbox
} from 'antd';

const FormItem = Form.Item;
import PropTypes from 'prop-types';

@connect(state => {
    return {projectMsg: state.project.currProject};
}, {
    //   updateProjectScript,   getProject
})
@Form.create()
class EditUrl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pushType :props.pushType,
            dingdingUrl:props.dingdingUrl
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({pushType: nextProps.pushType});
    }

    static propTypes = {
        form: PropTypes.object,
        dingdingUrl: PropTypes.string,
        pushType: PropTypes.object,
        onSave:PropTypes.func,
        onTest:PropTypes.func
    };
    handleSubmit = () =>{
        const form = this.props.form;
        form.validateFields((err, values) => {
          if (!err) {
                this.props.onSave(values.dingdingUrl,this.state.pushType)
            // console.log(err)
          }
        });
    };
    handleChange = (e) => {
        let pushType = this.state.pushType
        pushType[e.target.name] = e.target.checked
        this.setState({
            pushType 
        })
        // this.props.pushType[e.target.name] = e.target.checked
        // console.log(e)
        console.log(this.state)
        
    };
    handleTest = () =>{
        const form = this.props.form;
        form.validateFields((err, values) => {
            if (!err) {
                  this.props.onTest(values.dingdingUrl)
              // console.log(err)
            }
          });
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 6
                }
            },
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 16
                }
            }
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };
        const {getFieldDecorator} = this.props.form;
        // const buttonlist = {
        //     create_api:"创建接口",
        //     update_api:"更新接口",
        //     delete_api:"删除接口"
        // }
        // const { pre_script, after_script } = this.state;
        
        return (
          <div className="dd-push">
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                        {...formItemLayout}
                        label={< span > 钉钉群机器人Hook地址&nbsp;
                          <Tooltip title = "钉钉群添加自定义机器人，将Hook地址填到输入框内即可" > <Icon type="question-circle-o"/> </Tooltip> </span >}>
                {/* <Input type="text" value={this.props.dingding_url} ></Input> */}
                {getFieldDecorator('dingdingUrl', {
                            initialValue:this.props.dingdingUrl
                        })(<Input type="text"/>)}
              </FormItem>
              <FormItem {...formItemLayout} label="请选择推送场景">
                        
                <Checkbox name="create_api" onChange={this.handleChange} checked={this.state.pushType["create_api"]}>添加接口</Checkbox>
                <div>
                  <Checkbox   onChange={this.handleChange} name="update_api" checked={this.state.pushType["update_api"]}>修改接口</Checkbox>
                </div>
                <Checkbox  onChange={this.handleChange} name="delete_api" checked={this.state.pushType["delete_api"]}>删除接口</Checkbox>
                {/* <Checkbox>Checkbox</Checkbox> */}
                {/* {
                    Object.keys(buttonlist).map((item)=>(
                      <Checkbox>{buttonlist[item]}</Checkbox>
                    ))
                } */}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button onClick={this.handleSubmit} type="primary">
                            保存
                </Button>
                        &nbsp;&nbsp;
                <Button onClick={this.handleTest}>
                            测试推送
                </Button>
              </FormItem>
            </Form>
          </div>
        );
    }
}

export default EditUrl