import React, {Component} from "react";

import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import ResultLevelDialog from "../../../dialog/resultModel/ResultLevelDialog";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import find from "lodash/find";
import {injectIntl} from "react-intl";
import red from "@material-ui/core/colors/red";
import uuid from "uuid";
import {withStyles} from "@material-ui/core/styles";

const styles = (theme) => ({
    avatar: {
        color: "#fff",
        backgroundColor: red[800],
    },
    details: {
        height: "400px",
        padding: "20px",
        marginBottom: "30px",
        transition: "all 0.5s ease-in"
    },
    detailHeader: {
        display: "flex"
    },
    detailHeaderText: {
        marginTop: "5px",
        marginLeft: "15px"
    },
    levels: {
        height: "240px",
        padding: "20px"
    },
    levelList: {
        marginTop: "20px",
        overflow: "auto",
        height: "130px"
    },
    levelNo: {
        width: "25px",
        height: "25px",
        fontSize: "1rem",
        background: theme.palette.secondary.main
    },
    addButton: {
        marginLeft: "auto",
        width: 40,
        height: 40
    },
});

class ResultAttributes extends Component {

    static propTypes = {
        model: PropTypes.object,
        levels: PropTypes.array,
        onChange: PropTypes.func,
        onDeleteLevel: PropTypes.func,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleNameChange = :: this.handleNameChange;
        this.handleDescriptionChange = :: this.handleDescriptionChange;
        this.handleSectorChange = :: this.handleSectorChange;
        this.handleLevelChange = :: this.handleLevelChange;
        this.handleSelectLevel = :: this.handleSelectLevel;
        this.handleAddLevel = :: this.handleAddLevel;
        this.handleUpdateLevel = :: this.handleUpdateLevel;
        this.handleDeleteLevel = :: this.handleDeleteLevel;

        this.state = {
            model: props.model,
            levels: props.levels,
            selectedLevel: null,
            resultLevelDialogOpen: false
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            model: newProps.model,
            levels: newProps.levels,
            selectedLevel: null,
            resultLevelDialogOpen: false
        });
    }

    handleNameChange(newValue) {
        const {model} = this.state;
        model.name = newValue.target.value;
        this.setState({model}, this.props.onChange);
    }

    handleDescriptionChange(newValue) {
        const {model} = this.state;
        model.description = newValue.target.value;
        this.setState({model});
    }

    handleSectorChange(newValue) {
        const {model} = this.state;
        model.sector = newValue.target.value;
        this.setState({model});
    }

    handleLevelChange(event) {

        const levels = this.state.levels.slice();

        let level = find(levels, {key: event.target.id});
        level.label = event.target.value;

        this.setState({levels: levels}, this.props.onChange);
    }

    handleSelectLevel(level) {
        this.setState({
            selectedLevel: level,
            resultLevelDialogOpen: true
        });
    }

    handleAddLevel() {
        const levels = this.state.levels;

        levels.push({
            key: uuid.v4(),
            label: "New Level",
            style: {
            },
            nodeStyle: {
                color: "#fbfbfb",
                background: "#6f90ae"
            }
        });

        this.setState({levels: levels}, this.props.onChange);
    }

    handleUpdateLevel() {
        const levels = this.state.levels;

        this.setState({levels: levels}, this.props.onChange);
    }

    handleDeleteLevel(index) {
        const levels = this.state.levels;
        const level = levels.splice(index, 1)[0];

        if (levels.length > 0) {
            const lastLevel = levels[levels.length - 1];
            lastLevel.style.borderBottom = "1px solid";
        }

        this.setState({levels: levels}, () => this.props.onDeleteLevel(level));
    }

    render() {

        const {classes} = this.props;

        const {model, levels} = this.state;

        return (

            <div>

                <ResultLevelDialog
                    level={this.state.selectedLevel}
                    open={this.state.resultLevelDialogOpen}
                    onApply={this.handleUpdateLevel}
                    onClose={() => this.setState({resultLevelDialogOpen: false})}
                />

                <Paper
                    className={classes.details + " fade-in"}
                    elevation={4}
                >

                    <div className={classes.detailHeader}>

                        <Avatar className={classes.avatar}>{"M"}</Avatar>

                        <Typography
                            className={classes.detailHeaderText}
                            variant="h5"
                        >
                            {"Model Details"}
                        </Typography>

                    </div>

                    <div>

                        <TextField
                            key="modelName"
                            label="Model Name"
                            value={model.name}
                            onChange={this.handleNameChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="Description"
                            multiline
                            rows={2}
                            rowsMax={2}
                            value={model.description}
                            onChange={this.handleDescriptionChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            select
                            label="Sector"
                            value={model.sector ? model.sector : ""}
                            fullWidth
                            onChange={this.handleSectorChange}
                            margin="normal"
                        >
                            <MenuItem value={"NONE"}>{"None"}</MenuItem>
                            <MenuItem value={"ECONOMY"}>{"Economy"}</MenuItem>
                            <MenuItem value={"EDUCATION"}>{"Education"}</MenuItem>
                            <MenuItem value={"ENVIRONMENT"}>{"Environment and Climate"}</MenuItem>
                            <MenuItem value={"GOOD_GOVERNANCE"}>{"Good Governance"}</MenuItem>
                            <MenuItem value={"FINANCE"}>{"Finance"}</MenuItem>
                            <MenuItem value={"HEALTH"}>{"Health"}</MenuItem>
                            <MenuItem value={"HUMANITARIAN_AID"}>{"Humanitarian Aid"}</MenuItem>
                            <MenuItem value={"INFRASTRUCTURE"}>{"Infrastructure"}</MenuItem>
                            <MenuItem value={"INFORMATION_TECHNOLOGY"}>{"Information Technology"}</MenuItem>
                            <MenuItem value={"PEACE_SECURITY"}>{"Peace and Security"}</MenuItem>
                            <MenuItem value={"RURAL_DEVELOPMENT"}>{"Rural Development"}</MenuItem>
                            <MenuItem value={"STRATEGY_MANAGEMENT"}>{"Strategy and Management"}</MenuItem>
                            <MenuItem value={"WATER_ENERGY"}>{"Water and Energy"}</MenuItem>
                        </TextField>

                        <TextField
                            disabled
                            className={classes.textField}
                            label="Author"
                            value={model.author}
                            fullWidth
                            margin="normal"
                        />

                    </div>

                </Paper>

                <Paper
                    className={classes.levels + " fade-in"}
                    elevation={4}
                >
                    <div className={classes.detailHeader}>

                        <Avatar className={classes.avatar}>{"L"}</Avatar>

                        <Typography
                            variant="h5"
                            className={classes.detailHeaderText}
                        >
                            {"Levels"}
                        </Typography>

                        <Button
                            color="primary"
                            variant="fab"
                            className={classes.addButton}
                            onClick={this.handleAddLevel}
                        >
                            <AddIcon/>
                        </Button>

                    </div>

                    <div className={classes.levelList}>

                        <List>

                            {levels.map((level, index) => (

                                <ListItem
                                    button
                                    onClick={() => this.handleSelectLevel(level)}
                                    key={uuid.v4()}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            className={classes.levelNo}
                                            style={{...level.nodeStyle}}
                                        >{index + 1}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={level.label}/>

                                    <ListItemSecondaryAction>
                                        <IconButton
                                            aria-label="Delete"
                                            onClick={() => this.handleDeleteLevel(index)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItemSecondaryAction>

                                </ListItem>
                            ))}

                        </List>

                    </div>

                </Paper>
            </div>
        );
    }
}

export default injectIntl(withStyles(styles, {withTheme: true})(ResultAttributes));
