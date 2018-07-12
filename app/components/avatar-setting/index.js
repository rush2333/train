import React from 'react';
import ReactCrop from 'react-image-crop/dist/ReactCrop';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Button, message } from 'antd';
import StepsComponent from '../steps/';
import TabsComponent from '../tabs/';
import { imageValidator } from '../../utils';
import './index.css';
class AvatarSetting extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            activeKey: 0,
            imgSrc: '',
            cropperActive: '',
            crop: {
                aspect: 1,
                keepSelection: true
            },
            base64: '',
            okValue: '下一步',
            cancelValue: '取消'
        };
        this.fileRef = null;
        this.canvasRef = null;
        this.cropToCanvas = this.cropToCanvas.bind(this);
    }
    render(){
        const { visible } = this.props;
        const { cancelValue, okValue, activeKey, cropperActive, crop, base64 } = this.state;
        let that = this;
        function onOk(){
            if(okValue === '下一步'){
                if(!base64) return;
                that.setState({
                    okValue: '确定',
                    cancelValue: '上一步',
                    activeKey: 1
                });
            }else{
                that.props.closeModal();
                that.props.getBase64(base64);
            }
        }
        function onCancel() {
            if(cancelValue === '上一步'){
                that.setState({
                    okValue: '下一步',
                    cancelValue: '取消',
                    activeKey: 0
                });
            }else{
                that.props.closeModal();
            }
        }
        let modalOption = {
            visible: visible,
            title: '设置头像',
            width: 700,
            className: 'q-modal',
            okText: okValue,
            cancelText: cancelValue,
            onCancel: () => this.props.closeModal(),
            footer: (
                <span>
                    <Button onClick={onCancel}>{cancelValue}</Button>
                    <Button type="primary" disabled={!base64} onClick={onOk}>{okValue}</Button>
                </span>)
        };
        return (
            <Modal {...modalOption}>
                <StepsComponent current={activeKey}>
                    <StepsComponent.Item>1.修改头像</StepsComponent.Item>
                    <StepsComponent.Item>2.确定修改</StepsComponent.Item>
                </StepsComponent>
                <TabsComponent activeKey={'' + activeKey}>
                    <TabsComponent.TabPane key="0" tab="111">
                        <div className="q-modal-avatar">
                            <div className="q-modal-avatar-msg">
                                <p>图片不允许涉及政治敏感与色情</p>
                                <p>图片格式必须为：<strong>png，bmp，jpg，gif</strong>;不可以大于2M</p>
                                <div>
                                    <input type="file" onChange={(e) => this.handleFile(e)}  ref={(r) => this.fileRef = r} style={{display:'none'}} hidden/>
                                    <Button onClick={() => this.selectImage()}>选择图片</Button>
                                </div>
                            </div>
                            <div className="q-modal-avatar-preview">
                                <div className={'q-avatar-square-large ' + cropperActive}>
                                    <ReactCrop src={this.state.imgSrc} onComplete={(crop, pixelCrop) => this.cropComplete(crop, pixelCrop)} crop={crop}/>
                                    <canvas ref={(r) => this.canvasRef = r} hidden style={{display:'none'}} width="120px" height="120px"/>
                                </div>
                                <div className="q-avatar-square-normal">
                                    {base64 ? <img src={base64}/>:<p className="q-avatar-title-top">头像预览</p>}
                                    {base64 ? null : <div>方形头像</div>}
                                </div>
                                <div className="q-avatar-circle-normal">
                                    {base64 ? <img src={base64}/> : <div>圆形头像</div>}
                                </div>
                            </div>
                        </div>
                    </TabsComponent.TabPane>
                    <TabsComponent.TabPane key="1" tab="222">
                        <div className="q-modal-avatar">
                            <div className="q-modal-avatar-msg">
                                <p>确定将头像改为如下：</p>
                            </div>
                            <div className="q-modal-avatar-preview">
                                <div className="q-avatar-square-normal">
                                    <img src={base64} alt=""/>
                                    <p className="q-avatar-title-bottom q-center">方形头像</p>
                                </div>
                                <div className="q-avatar-circle-normal">
                                    <img src={base64} alt=""/>
                                    <p className="q-avatar-title-bottom q-center">圆形头像</p>
                                </div>
                            </div>
                        </div>
                    </TabsComponent.TabPane>
                </TabsComponent>
            </Modal>
        )
    }
    componentDidMount(){

    }
    //点击选择图片
    selectImage(){
        this.fileRef.click();
    }
    //处理图片
    handleFile(){
        const that = this;
        const file = this.fileRef.files && this.fileRef.files[0];
        if(file){
            if(!imageValidator(file)){
                message.error('请选择推荐格式的图片文件');
                return;
            }
            if(!imageValidator(file, 2048)){
                message.error('图片体积过大，请重新选择');
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(){
                that.img = new Image();
                that.img.src = reader.result;
                that.img.onload = function(){
                    if(that.img.naturalHeight > that.img.naturalWidth){
                        that.setState({
                            cropperActive: 'q-cropper-height'
                        });
                    }else{
                        that.setState({
                            cropperActive: 'q-cropper-width'
                        });
                    }
                };
                that.setState({
                    imgSrc: reader.result
                });
            }
        }
    }
    cropComplete(crop, pixelCrop){
        this.cropToCanvas(pixelCrop);
    }
    cropToCanvas(pixelCrop){
        const that = this;
        let canvas = this.canvasRef;
        let context = canvas.getContext('2d');
        context.drawImage(that.img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, 120, 120);
        that.setState({
            base64: canvas.toDataURL()
        });
    }
}
export default AvatarSetting;
