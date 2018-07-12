import React from 'react';
import "./index.css";
class RichTextComponent extends React.Component{
    constructor(props){
        super(props);
        this.ref = null;
        this.createEditor = this.createEditor.bind(this);
        this.state = {
            length: 0
        };
    }
    render(){
        const maxLength = this.props.maxLength;
        const strLength = this.state.length;
        return (<div className="q-rich-text">
            <div ref={(r) => this.ref = r}/>
            <div className="q-number-tips" contentEditable={false}>
                <span className={strLength > maxLength?'q-error': ''}>{this.state.length}</span>/{this.props.maxLength}
            </div>
        </div>)
    }
    componentDidMount(){
        if(this.ref){
            this.createEditor();
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.text !== this.props.text){
            this.editorInstance.txt.html(nextProps.text);
        }
    }
    createEditor(){
        const Editor = wangEditor;
        const that = this;
        that.editorInstance = new Editor(this.ref);
        that.editorInstance.customConfig.menus = [
            "bold",
            "underline",
            "italic",
            "strikeThrough",
            "foreColor",
            "backColor",
            "head",
            "list",
            "justify",
            "link",
            "table",
            "undo",
            "redo"
        ];
        that.editorInstance.customConfig.onchange = function(html){
            that.setState({
                length: that.editorInstance.txt.text().length
            });
            that.props.getText(html);
        };
        that.editorInstance.create();
        that.editorInstance.txt.html(that.props.text);
    }
}
export default RichTextComponent;
