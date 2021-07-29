import React, { Fragment, useCallback, useMemo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Badge,
  debounce,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  lighten,
  OutlinedInput,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import GetAppIcon from "@material-ui/icons/GetApp";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Cached, CloudUpload } from "@material-ui/icons";
import { amber, indigo } from "@material-ui/core/colors";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
  grow: {
    flexGrow: 1,
  },
  pr0: {
    paddingRight: 0,
  },
  ml1: {
    marginRight: theme.spacing(1),
  },
  createButton: {
    color: theme.palette.success.main,
  },
  editButton: {
    color: indigo[500],
  },
  deleteButton: {
    color: theme.palette.error.main,
  },
  refreshButton: {
    color: indigo[400],
  },
  downloadButton: {
    color: indigo[400],
  },
  importButton: {
    color: amber[600],
  },
}));

export default function EnhancedTableToolbar(props) {
  const {
    selected,
    descriptorAttribute,
    handleActionClick,
    actionButtons,
    handleUniversalFilterChange,
    handleDateChange,
    dates,
    loading,
    refreshBadgeCount,
    disableSelection,
  } = props;
  const classes = useStyles();

  const debouncedHandler = useCallback(
    debounce((event) => handleUniversalFilterChange(event), 700),
    []
  );

  const handleDebouncedFilterChange = (event) => {
    debouncedHandler(event);
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]:
          !disableSelection && Object.keys(selected).length > 0,
      })}
    >
      {!disableSelection && Object.keys(selected).length > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {_.get(selected, descriptorAttribute)}
        </Typography>
      ) : actionButtons.includes("dateFilters") ? (
        <Fragment>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              inputVariant="outlined"
              margin="dense"
              format="DD/MM/YYYY"
              id="date-from"
              label="From"
              value={dates.from || null}
              onChange={(value) => handleDateChange("from", value)}
              KeyboardButtonProps={{
                "aria-label": "Date From",
              }}
              InputProps={{
                className: classes.pr0,
              }}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              className={classes.ml1}
              disableToolbar
              variant="inline"
              inputVariant="outlined"
              margin="dense"
              format="DD/MM/YYYY"
              id="date-to"
              label="To"
              value={dates.to || null}
              onChange={(value) => handleDateChange("to", value)}
              KeyboardButtonProps={{
                "aria-label": "Date To",
              }}
              InputProps={{
                className: classes.pr0,
              }}
            />
          </MuiPickersUtilsProvider>
          <div className={classes.grow} />
        </Fragment>
      ) : (
        <div className={classes.grow} />
      )}

      {!disableSelection && Object.keys(selected).length > 0 ? (
        <Fragment>
          {actionButtons.includes("download") ? (
            <Tooltip title="Download">
              <IconButton
                aria-label="download"
                className={classes.downloadButton}
                onClick={(event) => handleActionClick(event, "download")}
              >
                <GetAppIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {actionButtons.includes("edit") ? (
            <Tooltip title="Edit">
              <IconButton
                aria-label="edit"
                className={classes.editButton}
                onClick={(event) => handleActionClick(event, "edit")}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {actionButtons.includes("delete") ? (
            <Tooltip title="Delete">
              <IconButton
                aria-label="delete"
                className={classes.deleteButton}
                onClick={(event) => handleActionClick(event, "delete")}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </Fragment>
      ) : (
        <Fragment>
          {actionButtons.includes("refresh") && (
            <Tooltip title="Refresh">
              <IconButton
                aria-label="refresh"
                className={classes.refreshButton}
                onClick={(event) => handleActionClick(event, "refresh")}
              >
                <Badge badgeContent={refreshBadgeCount} color="error">
                  <Cached />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          {actionButtons.includes("import") && (
            <Tooltip title="Import">
              <IconButton
                aria-label="import"
                className={classes.importButton}
                onClick={(event) => handleActionClick(event, "import")}
              >
                <CloudUpload />
              </IconButton>
            </Tooltip>
          )}
          {actionButtons.includes("bulkEdit") && (
            <Tooltip title="Bulk Edit">
              <IconButton
                aria-label="bulk-edit"
                className={classes.editButton}
                onClick={(event) => handleActionClick(event, "bulkEdit")}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {actionButtons.includes("create") && (
            <Tooltip title="Create">
              <IconButton
                aria-label="create"
                className={classes.createButton}
                onClick={(event) => handleActionClick(event, "create")}
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          )}
          {actionButtons.includes("filter") && (
            <FormControl variant="outlined">
              <InputLabel htmlFor="universal-filter">Filter</InputLabel>
              <OutlinedInput
                id="universal-filter"
                margin="dense"
                onChange={handleDebouncedFilterChange}
                disabled={loading}
                startAdornment={
                  <InputAdornment position="start">
                    <Tooltip title="Filter">
                      <FilterListIcon />
                    </Tooltip>
                  </InputAdornment>
                }
                label="Filter"
              />
            </FormControl>
          )}
        </Fragment>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.defaultProps = {
  actionButtons: ["create", "edit", "delete", "filter"],
  refreshBadgeCount: 0,
  disableSelection: false,
  loading: false,
};

EnhancedTableToolbar.propTypes = {
  selected: PropTypes.object,
  descriptorAttribute: PropTypes.string,
  handleActionClick: PropTypes.func.isRequired,
  actionButtons: PropTypes.array,
  handleUniversalFilterChange: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  dates: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  refreshBadgeCount: PropTypes.number,
  disableSelection: PropTypes.bool,
};
