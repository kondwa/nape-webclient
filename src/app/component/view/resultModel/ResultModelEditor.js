import React, {Component} from "react";

import AddIcon from "@material-ui/icons/AddCircle";
import BadgesIcon from "mdi-material-ui/CheckboxBlankCircle";
import Button from "@material-ui/core/Button";
import ConfirmationDialog from "../../widget/confirmationDialog/ConfirmationDialog";
import ConnectionAttributes from "./attributes/ConnectionAttributes";
import DeleteIcon from "@material-ui/icons/Delete";
import DownloadIcon from "@material-ui/icons/GetApp";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import JsPlumbEditor from "../../widget/graphEditor/JsPlumbEditor";
import LabelIcon from "@material-ui/icons/Label";
import LevelsIcon from "@material-ui/icons/Layers";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import ModelAttributes from "./attributes/ModelAttributes";
import NavigationPrompt from "react-router-navigation-prompt";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import RefreshIcon from "@material-ui/icons/Refresh";
import ResultAttributes from "./attributes/ResultAttributes";
import ResultLevel from "./ResultLevel";
import ResultLevelContainer from "./ResultLevelContainer";
import ResultNode from "./ResultNode";
import SaveIcon from "@material-ui/icons/Save";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import Switch from "@material-ui/core/Switch";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
import find from "lodash/find";
import {injectIntl} from "react-intl";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: "30px"
    },
    editor: {
        padding: "0 20px 20px",
        height: "670px"
    },
    editorButton: {
        margin: theme.spacing.unit / 2,
        float: "right"
    },
    clearDiv: {
        "clear": "right"
    },
    button: {
        marginLeft: "30px"
    },
    linkButton: {
        height: "42px",
        marginLeft: "30px"
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        textAlign: "right"
    },
    resetContainer: {
        marginTop: 0,
        padding: theme.spacing.unit * 3,
    },
    wrapper: {
        height: "100%"
    }
});

class ResultModelEditor extends Component {

    static propTypes = {
        loadResultModel: PropTypes.func,
        saveResultModel: PropTypes.func,
        addResultNode: PropTypes.func,
        removeResultNode: PropTypes.func,
        match: PropTypes.object,
        classes: PropTypes.object,
        location: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleSave = :: this.handleSave;
        this.handleRefresh = :: this.handleRefresh;
        this.handleExportAsImage = :: this.handleExportAsImage;
        this.handleSelect = :: this.handleSelect;
        this.handleConnectionSelect = :: this.handleConnectionSelect;
        this.handleAddNode = :: this.handleAddNode;
        this.handleRemoveNode = :: this.handleRemoveNode;
        this.handleRemoveLevel = :: this.handleRemoveLevel;
        this.handleModelChange = :: this.handleModelChange;
        this.handleZoomIn = :: this.handleZoomIn;
        this.handleZoomOut = :: this.handleZoomOut;
        this.handleFullScreen = :: this.handleFullScreen;
        this.handleOpenEditorMenu = :: this.handleOpenEditorMenu;
        this.handleCloseEditorMenu = :: this.handleCloseEditorMenu;
        this.handleToggleLevels = :: this.handleToggleLevels;
        this.handleToggleConLabels = :: this.handleToggleConLabels;
        this.handleToggleBadges = :: this.handleToggleBadges;
        this.handleSaveAndConfirm = :: this.handleSaveAndConfirm;

        this.state = {
            selectedResult: null,
            selectedConnection: null,
            resultModel: null,
            showBadges: true,
            showLevels: true,
            showConLabels: true,
            fullScreen: false,
            dirty: false,
            zoom: 1,
            projectId: props.location.pathname.split("/")[2]
        };
    }

    componentDidMount() {
        this.handleRefresh();
    }

    UNSAFE_componentWillReceiveProps(newProps) {

        const isNewModel = !newProps.resultModel || !this.state.resultModel || newProps.resultModel.id !== this.state.resultModel.id;

        if (isNewModel || !this.state.dirty) {
            this.setState({
                resultModel: newProps.resultModel,
                selectedResult: null,
                selectedConnection: null,
                fullScreen: isNewModel ? false : this.state.fullScreen,
                zoom: isNewModel ? 1 : this.state.zoom
            });
        }
    }

    componentDidCatch() {
        this.setState({resultModel: null});
    }

    handleConnectionSelect(connection) {
        const {resultModel} = this.state;

        const selectedConnection = find(resultModel.connections, {key: connection.key});

        this.handleSelect(null);

        this.setState({
            selectedConnection
        });
    }

    handleAddNode() {
        const {addResultNode} = this.props;
        const {resultModel} = this.state;

        addResultNode(resultModel);
    }

    handleRemoveNode() {
        const {removeResultNode} = this.props;

        removeResultNode(this.state.resultModel, this.state.selectedResult);

        this.setState({selectedResult: null});
    }

    handleRemoveLevel(level) {
        const {resultModel} = this.state;

        const orphanedResults = filter(resultModel.results, {level: level.key});
        if (orphanedResults) {
            orphanedResults.forEach((result) => {
                this.props.removeResultNode(resultModel, result);
                return result;
            });
        }

        this.setState({resultModel});
    }

    handleModelChange(model) {

        let {selectedResult, selectedConnection} = this.state;

        let newModel = cloneDeep(model ? model : this.state.resultModel);

        if (selectedResult) {
            selectedResult = find(newModel.results, {key: selectedResult.key});
        }

        if (selectedConnection) {
            selectedConnection = find(newModel.connections, {key: selectedConnection.key});
        }

        this.setState({
            dirty: true,
            resultModel: newModel,
            selectedResult,
            selectedConnection
        });
    }

    handleZoomIn() {
        this.setState({zoom: this.state.zoom + 0.1});
    }

    handleZoomOut() {
        this.setState({zoom: this.state.zoom - 0.1});
    }

    handleFullScreen() {
        this.setState({fullScreen: !this.state.fullScreen});
    }

    handleOpenEditorMenu(event) {
        this.setState({menuAnchor: event.currentTarget});
    }

    handleCloseEditorMenu() {
        this.setState({menuAnchor: null});
    }

    handleToggleLevels() {
        this.handleCloseEditorMenu();
        this.setState({showLevels: !this.state.showLevels});
    }

    handleToggleConLabels() {
        this.handleCloseEditorMenu();
        this.setState({showConLabels: !this.state.showConLabels});
    }

    handleToggleBadges() {
        this.handleCloseEditorMenu();
        this.setState({showBadges: !this.state.showBadges});
    }

    handleExportAsImage() {
        if (this.editorRef) {
            this.editorRef.exportAsImage(this.state.resultModel.name);
        }
    }
    handleSave() {
        let modelId = this.props.match.params.resultModelId;

        const {saveResultModel} = this.props;
        saveResultModel(modelId, this.state.resultModel);
    }

    handleSelect(resultKey) {
        const {resultModel} = this.state;

        let selectedResult = null;

        resultModel.results.map((result) => {
            if (result.key === resultKey) {
                result.selected = true;
                selectedResult = result;
            } else {
                result.selected = false;
            }
            return result;
        });

        this.setState({
            resultModel,
            selectedResult,
            selectedConnection: null
        });
    }

    handleRefresh() {

        let modelId = this.props.match.params.resultModelId;
        const {loadResultModel} = this.props;

        this.setState({
            dirty: false,
            selectedResult: null,
            selectedConnection: null,
            resultModel: null,
            fullScreen: false,
            zoom: 1
        }, () => loadResultModel(modelId));
    }

    handleSaveAndConfirm(onConfirm) {
        this.handleSave();
        onConfirm();
    }

    render() {
        const {classes} = this.props;

        const {resultModel, zoom} = this.state;

        return (
            <MLWrapper>

                <NavigationPrompt when={this.state.dirty}>

                    {({onConfirm, onCancel}) => (

                        <ConfirmationDialog
                            open
                            onCancel={onCancel}
                            onDeny={onConfirm}
                            onConfirm={() => this.handleSaveAndConfirm(onConfirm)}
                            confirmButtonText={"Yes"}
                            title={"Save Changes?"}
                            message={"You are about to leave the results model editor. Do you want to save your changes before?"}
                        />
                    )}

                </NavigationPrompt>

                <div style={{marginTop: "30px"}}>

                    <SectionTitle
                        enableBack={this.state.projectId !== ("LE" ||"undefined") ? true : false}
                        name={resultModel ? resultModel.name : null}
                    >

                        {/*

                        <Button
                            color="secondary"
                            variant="contained"
                            className={classes.button}
                            component={Link}
                            to={ROUTES.evaluation(resultModel ? resultModel.id : undefined)}
                        >
                            <EvaluationIcon className={classes.leftIcon}/>

                            {"Evaluation"}
                        </Button>

                        */}

                        <Button
                            color="primary"
                            variant="contained"
                            className={classes.button}
                            onClick={this.handleSave}
                        >
                            <SaveIcon className={classes.leftIcon}/>

                            {"Save"}

                        </Button>

                        <Button
                            color="primary"
                            variant="contained"
                            className={classes.button}
                            onClick={this.handleRefresh}
                        >
                            <RefreshIcon className={classes.leftIcon}/>

                            {"Reset"}

                        </Button>

                        <Button
                            color="primary"
                            variant="contained"
                            className={classes.button}
                            onClick={this.handleExportAsImage}
                        >
                            <DownloadIcon className={classes.leftIcon}/>

                            {"Export"}
                        </Button>

                    </SectionTitle>

                    <div className={classes.root}>

                        <Grid
                            container
                            spacing={24}
                        >

                            <Grid
                                item
                                xs={12}
                                sm={this.state.fullScreen ? 12 : 9}
                            >
                                <Paper
                                    className={classes.editor}
                                    elevation={4}
                                    onClick={(ev) => ev.target.nodeName !== "path" ? this.handleSelect(null) : undefined}
                                >
                                    <div>
                                        <IconButton
                                            color="primary"
                                            onClick={this.handleOpenEditorMenu}
                                            aria-label="Menu"
                                            aria-owns={this.state.menuAnchor ? "editor-menu" : null}
                                            aria-haspopup="true"
                                            className={classes.editorButton}
                                        >
                                            <MenuIcon/>
                                        </IconButton>

                                        <Menu
                                            id="editor-menu"
                                            anchorEl={this.state.menuAnchor}
                                            open={Boolean(this.state.menuAnchor)}
                                            PaperProps={{style: {width: "350px"}}}
                                            onClose={this.handleCloseEditorMenu}
                                        >
                                            <MenuItem onClick={this.handleToggleLevels}>
                                                <ListItemIcon className={classes.icon}>
                                                    <LevelsIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Show Levels"/>
                                                <ListItemSecondaryAction>
                                                    <Switch
                                                        onChange={this.handleToggleLevels}
                                                        checked={this.state.showLevels}
                                                    />
                                                </ListItemSecondaryAction>
                                            </MenuItem>
                                            <MenuItem onClick={this.handleToggleConLabels}>
                                                <ListItemIcon className={classes.icon}>
                                                    <LabelIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Show Connector Labels"/>
                                                <ListItemSecondaryAction>
                                                    <Switch
                                                        onChange={this.handleToggleConLabels}
                                                        checked={this.state.showConLabels}
                                                    />
                                                </ListItemSecondaryAction>
                                            </MenuItem>
                                            <MenuItem onClick={this.handleToggleBadges}>
                                                <ListItemIcon className={classes.icon}>
                                                    <BadgesIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Show Badges"/>
                                                <ListItemSecondaryAction>
                                                    <Switch
                                                        onChange={this.handleToggleBadges}
                                                        checked={this.state.showBadges}
                                                    />
                                                </ListItemSecondaryAction>
                                            </MenuItem>
                                        </Menu>

                                    </div>

                                    <IconButton
                                        color="primary"
                                        onClick={this.handleFullScreen}
                                        className={classes.editorButton}
                                    >
                                        {this.state.fullScreen ? (<FullscreenExitIcon/>) : (<FullscreenIcon/>)}
                                    </IconButton>

                                    <IconButton
                                        color="primary"
                                        disabled={zoom <= 0.4}
                                        onClick={this.handleZoomOut}
                                        className={classes.editorButton}
                                    >
                                        <ZoomOutIcon/>
                                    </IconButton>

                                    <IconButton
                                        color="primary"
                                        disabled={zoom >= 1.4}
                                        onClick={this.handleZoomIn}
                                        className={classes.editorButton}
                                    >
                                        <ZoomInIcon/>
                                    </IconButton>

                                    <IconButton
                                        disabled={!this.state.selectedResult}
                                        onClick={this.handleRemoveNode}
                                        color="primary"
                                        className={classes.editorButton}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>

                                    <IconButton
                                        color="primary"
                                        className={classes.editorButton}
                                        onClick={this.handleAddNode}
                                    >
                                        <AddIcon/>
                                    </IconButton>

                                    {resultModel ?

                                        (

                                            <JsPlumbEditor
                                                model={resultModel}
                                                onChange={this.handleModelChange}
                                                selectedConnection={this.state.selectedConnection}
                                                onSelectConnection={this.handleConnectionSelect}
                                                visibleConnectionLabel={this.state.showConLabels}
                                                zoom={zoom}
                                                ref={ref => this.editorRef = ref}
                                            >
                                                <ResultLevelContainer>
                                                    {resultModel.levels && resultModel.levels.map((level) =>

                                                    // TODO ResultLevelContainer

                                                        (
                                                            <ResultLevel
                                                                key={level.key}
                                                                level={level}
                                                                visible={this.state.showLevels}
                                                            />
                                                        ))
                                                    }
                                                </ResultLevelContainer>

                                                {resultModel.results && resultModel.results.map((result) =>
                                                    (
                                                        <ResultNode
                                                            draggable
                                                            key={result.key}
                                                            result={result}
                                                            level={find(resultModel.levels, {"key": result.level})}
                                                            showBadges={this.state.showBadges}
                                                            indicatorSize={result.indicators ? result.indicators.length : 0}
                                                            selected={result.selected}
                                                            onSelect={this.handleSelect}
                                                        />
                                                    )
                                                )}


                                            </JsPlumbEditor>

                                        ) : null
                                    }


                                </Paper>

                            </Grid>

                            {resultModel && !this.state.fullScreen ?

                                (

                                    <Grid
                                        item
                                        xs={12}
                                        sm={3}
                                    >

                                        {this.state.selectedResult ?
                                            (
                                                <ResultAttributes
                                                    modelId={resultModel.id}
                                                    result={this.state.selectedResult}
                                                    levels={resultModel.levels}
                                                    onChange={() => this.setState({resultModel})}
                                                />
                                            ) : this.state.selectedConnection ?
                                                (
                                                    <ConnectionAttributes
                                                        connection={this.state.selectedConnection}
                                                        onChange={() => this.setState({resultModel})}
                                                    />
                                                ) :
                                                (
                                                    <ModelAttributes
                                                        model={resultModel}
                                                        levels={resultModel.levels}
                                                        onChange={() => this.setState({resultModel})}
                                                        onDeleteLevel={this.handleRemoveLevel}
                                                    />
                                                )
                                        }


                                    </Grid>

                                ) : null
                            }

                        </Grid>

                    </div>


                </div>

            </MLWrapper>
        );
    }

}

export default injectIntl(withStyles(styles, {withTheme: true})(ResultModelEditor));
