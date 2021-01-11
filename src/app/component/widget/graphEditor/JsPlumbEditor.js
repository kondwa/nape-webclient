import "react-perfect-scrollbar/dist/css/styles.css";

import React, {Children, Component, cloneElement} from "react";

import JSPlumbOverlay from "./JsPlumbOverlay";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import ResultLevelContainer from "../../view/resultModel/ResultLevelContainer";
import cloneDeep from "lodash/cloneDeep";
import {defaultSettings} from "./jsPlumbSettings";
import filter from "lodash/filter";
import find from "lodash/find";
import html2canvas from "html2canvas";
import isEqual from "lodash/isEqual";
import {jsPlumb} from "jsplumb";
import pullAll from "lodash/pullAll";
import uuid from "uuid";

const CONTAINER_ID = `JSPL-${uuid.v4()}`;

const style = {
    root: {
        overflowX: "auto",
        position: "relative",
        height: "calc(100% - 67px)",
        width: "100%",
        border: "solid 1px"
    },
    container: {
        height: "inherit",
        position: "absolute",
        left: "0",
        right: "0"
    }
};

const registerTypes = {
    connections: {
        basic: {
            anchor: [

                // [x, y, dx, dy]

                "Top",
                [0.125, 0, 0, 0],
                [0.25, 0, 0, 0],
                [0.375, 0, 0, 0],
                [0.625, 0, 0, 0],
                [0.75, 0, 0, 0],
                [0.875, 0, 0, 0],
                "Bottom",
                [0.125, 1, 0, 0],
                [0.25, 1, 0, 0],
                [0.375, 1, 0, 0],
                [0.625, 1, 0, 0],
                [0.75, 1, 0, 0],
                [0.875, 1, 0, 0],
                "Right",
                [1, 0, 0, 0],
                [1, 0.25, 0, 0],
                [1, 0.75, 0, 0],
                [1, 1, 0, 0],
                "Left",
                [0, 0, 0, 0],
                [0, 0.25, 0, 0],
                [0, 0.75, 0, 0],
                [0, 1, 0, 0],
            ],
            connector: [
                "StateMachine",
                {
                    curviness: 1
                },
            ]
        }
    },
    endpoints: {}
};

class JsPlumbEditor extends Component {

    static propTypes = {
        model: PropTypes.object,
        children: PropTypes.array,
        readOnly: PropTypes.bool,
        onChange: PropTypes.func,
        selectedConnection: PropTypes.object,
        onSelectConnection: PropTypes.func,
        visibleConnectionLabel: PropTypes.bool,
        zoom: PropTypes.number
    };

    static defaultProps = {
        readOnly: false
    };

    constructor(props) {
        super(props);

        this.onConnectionClick = :: this.onConnectionClick;
        this.onGroupChange = :: this.onGroupChange;
        this.initNode = :: this.initNode;
        this.updateNode = :: this.updateNode;
        this.removeNode = :: this.removeNode;
        this.initGroup = :: this.initGroup;
        this.addConnection = :: this.addConnection;
        this.removeConnection = :: this.removeConnection;
        this.setZoom = :: this.setZoom;
        this.exportAsImage = :: this.exportAsImage;

        this.handleNodeDrop = ::this.handleNodeDrop;

        this.state = {
            model: cloneDeep(props.model),
            isJsPlumbInstanceCreated: false,
            jsPlumbInstance: jsPlumb.getInstance(defaultSettings),
            zoom: props.zoom ? props.zoom : 1,
            loading: false
        };

        this.initializedNodes = [];
        this.connectionsInitialized = false;
        this.groupWidth = 0;
    }

    componentDidMount() {
        const {readOnly} = this.props;

        jsPlumb.ready(() => {

            const jsPlumbInstance = jsPlumb.getInstance({
                Container: CONTAINER_ID,
            });

            jsPlumbInstance.setContainer(document.getElementById(CONTAINER_ID));

            if (!readOnly) {
                jsPlumbInstance.bind("connection", this.onConnection);
                jsPlumbInstance.bind("connectionDetached", this.onConnectionDetached);
                jsPlumbInstance.bind("click", this.onConnectionClick);
                jsPlumbInstance.bind("dblclick", this.onConnectionDoubleClick);
                jsPlumbInstance.bind("group:addMember", this.onGroupChange);
            }

            this.registerTypes(jsPlumbInstance);
            this.setState({
                isJsPlumbInstanceCreated: true,
                jsPlumbInstance
            });
        });

        this.initializedNodes = [];
        this.connectionsInitialized = false;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!isEqual(this.state.model, nextProps.model)) {
            this.setState({
                model: cloneDeep(nextProps.model)
            });
        }

        if (this.state.zoom !== nextProps.zoom) {
            this.setState({zoom: nextProps.zoom});
        }
    }

    componentDidUpdate() {
        const {selectedConnection, visibleConnectionLabel} = this.props;
        const {jsPlumbInstance, isJsPlumbInstanceCreated, model} = this.state;

        if (isJsPlumbInstanceCreated) {
            this.setZoom();

            jsPlumbInstance.getAllConnections().map((conn) => {

                const connection = find(model.connections, {source: conn.sourceId, target: conn.targetId});
                if (connection) {
                    if (visibleConnectionLabel && connection.label && connection.label !== conn.label) {
                        conn.setLabel(connection.label);
                    } else {
                        conn.removeOverlay("__label");
                    }
                }

                if (selectedConnection && conn.sourceId === selectedConnection.source && conn.targetId === selectedConnection.target) {
                    jsPlumbInstance.addClass(conn.canvas, "jtk-selected");
                } else {
                    jsPlumbInstance.removeClass(conn.canvas, "jtk-selected");
                }

                return conn;
            });

        }
    }

    componentWillUnmount() {
        const {jsPlumbInstance} = this.state;

        jsPlumbInstance.deleteEveryConnection();
        jsPlumbInstance.reset();
    }

    onConnectionClick(connObj) {
        const {onSelectConnection} = this.props;
        const {model} = this.state;

        const connection = find(model.connections, {key: connObj.id});

        if (onSelectConnection) {
            onSelectConnection(connection);
        }
    }

    onConnectionDoubleClick = (connObj, originalEvent) => {
        if (!originalEvent) {
            return;
        }

        this.state.jsPlumbInstance.deleteConnection(connObj);

        this.removeConnection(connObj);
    };

    onConnection = (connObj, originalEvent) => {
        if (!originalEvent) {
            return;
        }

        const connection = connObj.connection;
        const existingConnections = this.state.jsPlumbInstance.select({
            source: connection.sourceId,
            target: connection.targetId
        });

        if (existingConnections.length > 1) {
            this.state.jsPlumbInstance.deleteConnection(connection);
        } else {
            this.addConnection(connObj);
            this.state.jsPlumbInstance.repaintEverything();
        }
    };

    onConnectionDetached = (detachedConnObj, originalEvent) => {
        if (!originalEvent) {
            return;
        }

        this.removeConnection(detachedConnObj);
        this.state.jsPlumbInstance.repaintEverything();
    };

    onGroupChange(event) {

        const {model} = this.state;
        const nodes = model.results;
        const groupId = event.group.id;

        let node = find(nodes, {"key": event.el.id});

        if (node && node.level !== groupId) {

            node.level = groupId;

            this.setState(model);
            this.updateParent();
        }
    }

    handleNodeDrop(params) {
        const {model} = this.state;

        const pos = params.finalPos ? params.finalPos : params.pos;

        const id = params.el.id;
        const result = find(model.results, {key: id});

        if (result) {
            result.style = {
                ...result.style,
                left: pos[0] + "px",
                top: pos[1] + "px"
            };

            this.initGroupSize();
        }

        this.setState(model);
        this.updateParent();
    }

    render() {
        return (

            <div
                key={CONTAINER_ID}
                style={style.root}
                ref={ref => this.containerRef = ref}
            >

                <JSPlumbOverlay open={this.state.loading}/>
                <PerfectScrollbar>

                    <div
                        id={CONTAINER_ID}
                        style={style.container}
                    >
                        {this.renderChildren()}
                    </div>
                </PerfectScrollbar>

            </div>
        );
    }

    renderChildren() {
        if (!this.state.isJsPlumbInstanceCreated) {
            return "...loading";
        }

        return Children.map(this.props.children, child => {
            if (typeof child === "string" || typeof child === "number" || child === null || typeof child === "undefined") {
                return child;
            }

            if (child.type === ResultLevelContainer) {
                return cloneElement(child, {
                    ...child.props,
                    initGroup: this.initGroup
                });
            }

            return cloneElement(child, {
                ...child.props,
                initNode: this.initNode,
                updateNode: this.updateNode,
                removeNode: this.removeNode
            });
        });
    }

    initGroup(config) {
        this.state.jsPlumbInstance.addGroup(
            {
                id: config.groupId,
                el: config.element,
                draggable: false
            }
        );

        if (config.element) {
            config.element.style.width = this.groupWidth + "px";
            config.element.style.minWidth = this.state.zoom < 1 ? (100 / this.state.zoom) + "%" : "100%";
        }
    }


    initNode(config) {

        const {jsPlumbInstance, model} = this.state;

        if (!this.props.readOnly) {

            jsPlumbInstance.draggable(config.nodeId, {
                stop: this.handleNodeDrop
            });

        }

        const groups = jsPlumbInstance.getGroups();
        const group = find(groups, {id: config.group});

        if (group && config.element.parentElement !== group.getEl()) {

            // Setting parent in order to be react compatible
            jsPlumbInstance.setParent(config.element, group.getEl());
            jsPlumbInstance.addToGroup(config.group, config.element);
        }

        jsPlumbInstance.makeSource(config.nodeId, {
            isSource: true,
            filter: ".ep",
            connectionType: "basic",
            maxConnections: -1,
        });

        jsPlumbInstance.makeTarget(config.nodeId, {
            isTarget: true,
            allowLoopback: false,
            dropOptions: {hoverClass: "result--dragHover"}
        });

        if (!this.initializedNodes.includes(config.nodeId)) {
            this.initializedNodes.push(config.nodeId);
        }

        // Initialize connections after all nodes are initialized
        if (!this.connectionsInitialized && model.results.length === this.initializedNodes.length) {

            jsPlumbInstance.deleteEveryConnection();

            let orphanedConnections = [];

            model.connections.forEach((connection) => {
                let connObj = jsPlumbInstance.connect(connection);
                if (connObj) {
                    connObj.id = connection.key;
                } else {
                    orphanedConnections.push(connection);
                }
            });

            pullAll(model.connections, orphanedConnections);

            this.initGroupSize();

            this.connectionsInitialized = true;
        }
    }

    initGroupSize() {
        const {model, jsPlumbInstance} = this.state;

        let groupWidth = 0;

        model.results.map((rs => {
            let rsLeft = parseInt(rs.style.left.substring(0, rs.style.left.length - 2)) + 250;
            groupWidth = rsLeft > groupWidth ? rsLeft : groupWidth;
            return rs;
        }));

        if (groupWidth !== this.groupWidth) {
            this.groupWidth = groupWidth;

            const groups = jsPlumbInstance.getGroups();

            groups.map((group) => {
                group.getEl().style.width = (this.groupWidth) + "px";
                return group;
            });
        }
    }

    updateNode() {
        const {jsPlumbInstance} = this.state;
        jsPlumbInstance.repaintEverything();
    }

    removeNode(config) {
        const {jsPlumbInstance} = this.state;

        jsPlumbInstance.deleteConnectionsForElement(config.element);

        if (config.element) {
            const groups = jsPlumbInstance.getGroups();
            const group = find(groups, {id: config.group});

            if (group) {

                // Setting parent in order to be react compatible
                jsPlumbInstance.setParent(config.element, jsPlumbInstance.getContainer());
            }
        }
    }

    removeConnection(connection) {

        let {model} = this.state;

        const connections = filter(this.state.model.connections, (conn) =>
            !(conn.source === connection.sourceId && conn.target === connection.targetId)
        );

        model.connections = connections;

        this.setState({model});

        this.updateParent();
    }

    addConnection(connection) {
        const {model} = this.state;

        let existingConnection = model.connections.find(
            conn => conn.source === connection.sourceId && conn.target === connection.targetId
        );

        if (existingConnection) {
            return;
        }

        const mlConnection = {
            key: connection.connection ? connection.connection.id : "",
            source: connection.sourceId,
            target: connection.targetId,
            type: connection.type
        };

        model.connections.push(mlConnection);

        this.setState(model);

        this.updateParent();
    }

    updateParent() {
        if (this.props.onChange) {
            this.props.onChange(this.state.model);
        }
    }

    registerTypes(jsPlumbInstance) {

        const {connections, endpoints} = registerTypes;

        if (Object.keys(connections).length) {
            jsPlumbInstance.registerConnectionTypes(connections);
        }

        if (Object.keys(endpoints).length) {
            jsPlumbInstance.registerEndpointTypes(endpoints);
        }
    }

    setZoom() {
        const {jsPlumbInstance, zoom} = this.state;

        const browserPrefix = ["Webkit", "Moz", "ms", "O"];
        const tScale = `scale(${zoom})`;

        const tStyle = "0 0";

        for (const prefix of browserPrefix) {
            style[`${prefix}Transform`] = tScale;
            style[`${prefix}TransformOrigin`] = tStyle;
        }

        jsPlumbInstance.getGroups().forEach((group) => {
            const groupEl = group.getEl();
            groupEl.style.minWidth = zoom < 1 ? (100 / zoom) + "%" : "100%";
        });

        const container = jsPlumbInstance.getContainer();

        container.style.width = zoom > 1 ? (100 / zoom) + "%" : "inherit";
        container.style.transform = tScale;
        container.style.transformOrigin = tStyle;

        jsPlumbInstance.setZoom(zoom, true);
    }

    exportAsImage(fileName) {
        const {model, zoom, jsPlumbInstance} = this.state;

        this.setState({loading: true, zoom: 1});

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        window.scrollTo(0, 0);

        const oldWidth = this.containerRef.style.width;
        const oldHeight = this.containerRef.style.height;

        this.containerRef.style.width = this.groupWidth + "px";
        this.containerRef.style.height = model.levels.length > 0 ? (model.levels.length * 200) + "px" : oldHeight;

        html2canvas(this.containerRef).then(canvas => {

            require("canvg-fixed");

            let context = canvas.getContext("2d");

            jsPlumbInstance.getAllConnections().map(conn => {

                const svgHtml = conn.canvas.outerHTML;
                const offset = conn.canvas.getBoundingClientRect();

                const left = offset.left * 1.2;
                const top = offset.top * 1.2;

                context.drawSvg(svgHtml, left, top, offset.width, offset.height);

                return conn;
            });

            this.containerRef.style.width = oldWidth;
            this.containerRef.style.height = oldHeight;

            window.scrollTo(scrollLeft, scrollTop);

            canvas.toBlob(function (blob) {
                const FileSaver = require("file-saver");
                FileSaver.saveAs(blob, fileName + ".png");
            });

            this.setState({loading: false, zoom});
        });
    }

}

export default (JsPlumbEditor);
