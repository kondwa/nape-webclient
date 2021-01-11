import { injectIntl, intlShape } from "react-intl";

import { Component } from "react";
import ContentAdd from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import React from "react";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import Tree from "../../widget/tree/Tree";
import UnitAttributes from "./UnitAttributes";
import UnitUserList from "./UnitUserList";
import find from "lodash/find";
import pull from "lodash/pull";
import { withStyles } from "@material-ui/core/styles";

const inlineStyle = {
    root: {
        flexGrow: 1,
        margin: "30px",
    },
    paper: {
        padding: "16px"
    },
    subPaper: {
        marginTop: "30px",
        padding: "16px"
    }
};

const styles = () => ({
    addButton: {
        float: "right",
        margin: "-60px 5px 0 0",
        width: "40px",
        height: "40px"
    }
});

class UnitTree extends Component {

    static propTypes = {
        root: PropTypes.object,
        userList: PropTypes.array,
        unitUserList: PropTypes.array,
        saveUnit: PropTypes.func,
        deleteUnit: PropTypes.func,
        loadRootUnit: PropTypes.func,
        loadUserListFilter: PropTypes.func,
        loadUserForUnit: PropTypes.func,
        saveUsersForUnit: PropTypes.func,
        removeUserFromUnit: PropTypes.func,
        classes: PropTypes.object,
        intl: intlShape.isRequired
    };

    constructor( props ) {
        super(props);
        this.handleTreeSelect = :: this.handleTreeSelect;
        this.handleUnitKeyInput = :: this.handleUnitKeyInput;
        this.handleUnitNameInput = :: this.handleUnitNameInput;
        this.handleUnitTypeSelection = :: this.handleUnitTypeSelection;
        this.handleNewUnit = :: this.handleNewUnit;
        this.handleRemoveUnit = :: this.handleRemoveUnit;
        this.findParent = :: this.findParent;

        this.state = { unit: null };
    }

    componentDidMount() {
        const { loadRootUnit } = this.props;
        loadRootUnit();
    }

    handleTreeSelect( unit, toggled ) {

        let cursor = this.state.unit;

        if ( cursor ) {
            cursor.active = false;
        }

        unit.active = true;

        if ( unit.children ) {
            unit.toggled = toggled;
        }

        this.setState({ unit: unit });

        this.props.loadUserForUnit(unit ? unit.foreignId : null);
    }

    handleNewUnit() {

        const unit = this.state.unit;
        const newUnit = {
            name: "New Unit",
            foreignId: "",
            type: null,
            active: true,
            dirty: true,
            parentId: unit.id
        };

        if ( unit ) {
            if ( !unit.children ) {
                unit.children = [];
            }

            unit.toggled = true;
            unit.children.push(newUnit);
        }

        this.handleTreeSelect(newUnit, true);
    }

    handleRemoveUnit() {
        const { root, deleteUnit } = this.props;

        const unit = this.state.unit;

        if ( unit.id ) {
            deleteUnit(unit);
        }

        let parent = this.findParent(root, unit);
        pull(parent.children, unit);

        this.handleTreeSelect(parent, true);
    }

    handleUnitNameInput( newValue ) {

        let unit = this.state.unit ? this.state.unit : {};
        unit.name = newValue;
        unit.dirty = true;

        this.setState({ unit: unit });
    }

    handleUnitKeyInput( newValue ) {

        let unit = this.state.unit ? this.state.unit : {};
        unit.foreignId = newValue;
        unit.dirty = true;

        this.setState({ unit: unit });
    }

    handleUnitTypeSelection( value ) {

        let unit = this.state.unit ? this.state.unit : {};
        unit.type = value;
        unit.dirty = true;

        this.setState({ unit: unit });
    }

    render() {

        const { root, userList, unitUserList, saveUnit, loadUserListFilter,
            saveUsersForUnit, removeUserFromUnit, classes } = this.props;

        const unit = this.state.unit;

        return (
            <div>

                <div style={{ marginTop: "30px" }}>

                    <SectionTitle
                        name={this.props.intl.formatMessage({ "id": "metadata.title" })}
                    />

                </div>

                {root ?
                    (
                        <div style={inlineStyle.root}>

                            <Grid
                                container
                                spacing={24}
                            >

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <Paper style={inlineStyle.paper}>

                                        <h5>{"Units"}</h5>

                                        <Fab
                                            
                                            color={"primary"}
                                            aria-label={"add"}
                                            disabled={!unit}
                                            onClick={this.handleNewUnit}
                                            className={classes.addButton}
                                        >
                                            <ContentAdd nativeColor={"white"} />
                                        </Fab>

                                        <Tree
                                            data={root}
                                            onSelect={this.handleTreeSelect}
                                        />
                                    </Paper>

                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <Paper style={inlineStyle.paper}>

                                        <UnitAttributes
                                            unit={unit}
                                            onSaveUnit={saveUnit}
                                            onDeleteUnit={this.handleRemoveUnit}
                                            onKeyInput={this.handleUnitKeyInput}
                                            onNameInput={this.handleUnitNameInput}
                                            onTypeSelect={this.handleUnitTypeSelection}
                                        />

                                    </Paper>

                                    <Paper style={inlineStyle.subPaper}>

                                        <UnitUserList
                                            unit={unit}
                                            userList={userList}
                                            unitUserList={unitUserList}
                                            loadUserList={loadUserListFilter}
                                            saveUserList={saveUsersForUnit}
                                            removeUserParticipation={removeUserFromUnit}
                                        />

                                    </Paper>

                                </Grid>

                            </Grid>
                        </div>
                    ) : null
                }
            </div>
        );
    }

    findParent( parent, unit ) {
        let found = find(parent.children, unit);

        if ( found ) {
            return parent;
        } else {
            if ( parent.children ) {
                for ( let i = 0; i < parent.children.length; i++ ) {
                    let newParent = this.findParent(parent.children[ i ], unit);
                    if ( newParent ) {
                        return newParent;
                    }
                }
            }
            return null;
        }
    }
}

export default injectIntl(withStyles(styles, { withTheme: true })(UnitTree));
