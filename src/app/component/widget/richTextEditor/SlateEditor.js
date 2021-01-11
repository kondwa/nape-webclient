/* eslint-disable no-param-reassign,react/display-name,default-case,react/prop-types */
import { Editor, getEventTransfer } from "slate-react";
import React, { Component } from "react";

import Html from "slate-html-serializer";
import PropTypes from "prop-types";
import { isKeyHotkey } from "is-hotkey";

const BLOCK_TAGS = {
    p: "paragraph",
    ul: "bulleted-list",
    ol: "numbered-list",
    li: "list-item"
};

const MARK_TAGS = {
    em: "italic",
    strong: "bold"
};

const DEFAULT_NODE = "paragraph";

const rules = [

    // Rule for Blocks
    {
        deserialize: ( el, next ) => {
            const type = BLOCK_TAGS[ el.tagName.toLowerCase() ];
            if ( !type ) {
                return;
            }
            return {
                object: "block",
                type: type,
                nodes: next(el.childNodes)
            };
        },
        serialize: ( object, children ) => {
            if ( object.object !== "block" ) {
                return;
            }
            switch ( object.type ) {
                case "numbered-list":
                    return <ol>{children}</ol>;
                case "bulleted-list":
                    return <ul>{children}</ul>;
                case "list-item":
                    return <li>{children}</li>;
                case "paragraph":
                    return <p>{children}</p>;
            }
        }
    },

    // Rule for Marks
    {
        deserialize: ( el, next ) => {
            const type = MARK_TAGS[ el.tagName.toLowerCase() ];
            if ( !type ) {
                return;
            }
            return {
                object: "mark",
                type: type,
                nodes: next(el.childNodes)
            };
        },
        serialize: ( object, children ) => {
            if ( object.object !== "mark" ) {
                return;
            }
            switch ( object.type ) {
                case "bold":
                    return <strong>{children}</strong>;
                case "italic":
                    return <em>{children}</em>;
            }
        }
    }
];

const html = new Html({ rules });

const style = {
    padding: "7px 8px 8px",
    width: "100%",
    maxWidth: "100%",
    border: "none",
    backgroundColor: "#f9f9f9",
    height: "auto",
    boxShadow: "none",
};

const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");

class SlateEditor extends Component {

    static propTypes = {
        "htmlContent": PropTypes.string,
        "onTextChange": PropTypes.func
    };

    constructor( props ) {
        super(props);

        const { htmlContent } = this.props;

        this.state = {
            value: html.deserialize(htmlContent),
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            value: html.deserialize(newProps.htmlContent)
        });
    }

    onClickMark = ( e, type ) => {
        e.preventDefault();
        const { value } = this.state;
        const change = value.change().toggleMark(type);
        this.handleOnChange(change);
    };

    onClickBlock = ( e, type ) => {
        e.preventDefault();
        const { value } = this.state;
        const change = value.change();
        const { document } = value;

        // Handle the extra wrapping required for list buttons.
        const isList = this.hasBlock("list-item");
        const isType = value.blocks.some(( block ) => {
            return !!document.getClosest(block.key, parent => parent.type === type);
        });

        if ( isList && isType ) {
            change
                .setBlock(DEFAULT_NODE)
                .unwrapBlock("bulleted-list")
                .unwrapBlock("numbered-list");
        } else if ( isList ) {
            change
                .unwrapBlock(type === "bulleted-list" ? "numbered-list" : "bulleted-list")
                .wrapBlock(type);
        } else {
            change
                .setBlock("list-item")
                .wrapBlock(type);
        }

        this.handleOnChange(change);
    };

    handleOnChange = ( { value } ) => {
        let content;
        if ( value.document !== this.state.value.document ) {
            content = html.serialize(value);
            this.props.onTextChange(content);
        }

        this.setState({ value });
    };

    handleOnKeyDown = ( event, change ) => {
        let mark;

        if ( isBoldHotkey(event) ) {
            mark = "bold";
        } else if ( isItalicHotkey(event) ) {
            mark = "italic";
        } else if ( isUnderlinedHotkey(event) ) {
            mark = "underlined";
        } else {
            return;
        }

        event.preventDefault();
        change.toggleMark(mark);
        return true;
    };

    /**
     * On paste, deserialize the HTML and then insert the fragment.
     *
     * @param {Event} event
     * @param {Change} change
     */

    handleOnPaste = ( event, change ) => {
        if ( event.nativeEvent ) {
            event = event.nativeEvent;
        }
        event.preventDefault();
        if ( event.clipboardData ) {
            const transfer = getEventTransfer(event);
            if ( transfer.type !== "html" ) {
                return;
            }
            const { document } = html.deserialize(transfer.html);
            change.insertFragment(document);
            this.handleOnChange(change);
            return true;
        } else if ( window.clipboardData ) {
            let text = window.clipboardData.getData("text");
            if ( text ) {
                change.insertText(text);
                this.handleOnChange(change);
                return true;
            }
        }
    };

    render() {
        return (
            <div className="Slate-root">
                <div className="menu toolbar-menu">
                    {this.renderMarkButton("bold", "fa fa-bold")}
                    {this.renderMarkButton("italic", "fa fa-italic")}
                    {this.renderBlockButton("numbered-list", "fa fa-list-ol")}
                    {this.renderBlockButton("bulleted-list", "fa fa-list-ul")}
                </div>
                <div
                    style={style}
                    className="Slate-editor"
                >
                    <Editor
                        value={this.state.value}
                        renderNode={this.renderNode}
                        renderMark={this.renderMark}
                        onChange={this.handleOnChange}
                        onPaste={this.handleOnPaste}
                        onKeyDown={this.handleOnKeyDown}
                        placeholder="Text"
                    />
                </div>
            </div>
        );
    }

    hasBlock = ( type ) => {
        const { value } = this.state;
        return value.blocks.some(node => node.type === type);
    };

    hasMark = ( type ) => {
        const { value } = this.state;
        return value.activeMarks.some(mark => mark.type === type);
    };

    renderMarkButton = ( type, icon ) => {
        const isActive = this.hasMark(type);
        const onMouseDown = e => this.onClickMark(e, type);

        return (
            <span
                className={icon + (isActive ? " active" : "")}
                onMouseDown={onMouseDown}
                data-active={isActive}
            />
        );
    };

    renderBlockButton = ( type, icon ) => {
        const isActive = this.hasBlock(type);
        const onMouseDown = e => this.onClickBlock(e, type);

        return (
            <span
                className={icon + (isActive ? " active" : "")}
                onMouseDown={onMouseDown}
                data-active={isActive}
            />
        );
    };

    renderNode = ( props ) => {
        const { attributes, children, node } = props;
        switch ( node.type ) {
            case "bulleted-list":
                return <ul {...attributes}>{children}</ul>;
            case "heading-one":
                return <h1 {...attributes}>{children}</h1>;
            case "heading-two":
                return <h2 {...attributes}>{children}</h2>;
            case "list-item":
                return <li {...attributes}>{children}</li>;
            case "numbered-list":
                return <ol {...attributes}>{children}</ol>;
        }
    };

    renderMark = ( props ) => {
        const { children, mark } = props;
        switch ( mark.type ) {
            case "bold":
                return <strong>{children}</strong>;
            case "italic":
                return <em>{children}</em>;
            case "underlined":
                return <u>{children}</u>;
        }
    };
}

export default SlateEditor;
