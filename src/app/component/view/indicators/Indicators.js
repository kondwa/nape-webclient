import { injectIntl, intlShape } from "react-intl";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import { Component } from "react";
import FilterDialog from "../../widget/filter/FilterDialog";
import FilterIcon from "@material-ui/icons/FilterList";
import Indicator from "./Indicator";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import find from "lodash/find";
import head from "lodash/head";
import keys from "lodash/keys";
import uuid from "uuid";
import { withStyles } from "@material-ui/core/styles";

const styles = () => ({
    headerInfo: {
        margin: "30px 30px 0 30px",
        display: "flex",
        justifyContent: "space-between"
    },
    headerBack: {
        display: "flex",
        justifyContent: "space-between",
        marginLeft: "-30px"
    },
    badge: {},
    dropDown: {
        width: "200px"
    },
    wrapper: {
        padding: "30px"
    }
});

class Indicators extends Component {

    static propTypes = {
        indicatorGroups: PropTypes.array,
        indicators: PropTypes.array,
        loadIndicatorGroups: PropTypes.func,
        loadIndicators: PropTypes.func,
        location: PropTypes.object,
        classes: PropTypes.object,
        intl: intlShape.isRequired
    };

    constructor(props) {
        super(props);

        this.handleOpenFilterDialog = :: this.handleOpenFilterDialog;
        this.handleCloseFilterDialog = :: this.handleCloseFilterDialog;
        this.handleApplyFilterDialog = :: this.handleApplyFilterDialog;
        this.handleSelection = :: this.handleSelection;
        this.state = {
            groupId: "",
            filterDialogOpen: false,
            filterParams: [],
            projectId: props.location.pathname.split("/")[2]
        };
    }

    componentDidMount() {
        this.props.loadIndicatorGroups();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.indicatorGroups !== this.props.indicatorGroups) {
            let firstGroup = head(nextProps.indicatorGroups);

            if (firstGroup) {
                this.setState({ groupId: firstGroup.id });
            }
        }
    }

    handleOpenFilterDialog() {
        this.setState({ filterDialogOpen: true });
    }

    handleCloseFilterDialog() {
        this.setState({ filterDialogOpen: false });
    }

    handleApplyFilterDialog(filterParams) {
        this.props.loadIndicators(this.state.groupId, filterParams);
        this.setState({ filterParams });
    }

    handleSelection(event) {
        const groupId = event.target.value;
        this.props.loadIndicators(groupId, []);
        this.setState({ groupId, filterParams: [] });
    }

    render() {

        const { indicatorGroups, indicators, classes } = this.props;

        const currentGroup = find(indicatorGroups, { id: this.state.groupId });
        const filterParams = keys(this.state.filterParams);

        return (
            <MLWrapper>

                <FilterDialog
                    open={this.state.filterDialogOpen}
                    onApply={this.handleApplyFilterDialog}
                    onClose={this.handleCloseFilterDialog}
                    filters={currentGroup ? currentGroup.filters : []}
                />
                <div className={classes.headerInfo}>
                    <div className={classes.headerBack}>
                        <Typography
                            className={classes.sectionTitle}
                            variant="h5"
                            style={{ marginLeft: "30px" }}
                        >
                            {this.props.intl.formatMessage({"id": "drawer.reports"})}
                        </Typography>
                    </div>
                    <Button
                        color="primary"
                        disabled={!currentGroup || currentGroup.filters.length === 0}
                        onClick={this.handleOpenFilterDialog}
                    >
                        {this.props.intl.formatMessage({"id": "common.filter"})}
                        {filterParams.length > 0 ?
                            (
                                <Badge
                                    className={classes.badge}
                                    badgeContent={filterParams.length}
                                    color="secondary"
                                >
                                    <FilterIcon />
                                </Badge>
                            ) :
                            (
                                <FilterIcon />
                            )
                        }

                    </Button>

                    <div>
                        <Select
                            className={classes.dropDown}
                            onChange={this.handleSelection}
                            value={this.state.groupId}
                        >
                            {indicatorGroups && indicatorGroups.map(group => {
                                return (
                                    <MenuItem
                                        key={uuid.v4()}
                                        value={group.id}
                                    >
                                        {group.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </div>
                </div>

                <div className={classes.wrapper}>
                    {indicators && indicators.map((indicator, idx) => {
                        return (
                            <Indicator
                                open={idx === 0}
                                key={uuid.v4()}
                                indicator={indicator}
                            />
                        );
                    })}
                </div>
            </MLWrapper>
        );
    }
}

export default injectIntl(withStyles(styles, { withTheme: true })(Indicators));
