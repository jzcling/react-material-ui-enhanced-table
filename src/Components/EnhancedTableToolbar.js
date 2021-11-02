import React, { Fragment, useMemo } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { lighten, styled } from "@mui/material/styles";
import {
  Badge,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { debounce } from "@mui/material/utils";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import {
  AddCircle,
  Cached,
  CloudUpload,
  Delete,
  Edit,
  FilterList,
  GetApp,
} from "@mui/icons-material";
import { amber, indigo } from "@mui/material/colors";
import get from "lodash/get";

const PREFIX = "EnhancedTableToolbar";

const classes = {
  root: `${PREFIX}-root`,
  highlight: `${PREFIX}-highlight`,
  title: `${PREFIX}-title`,
  grow: `${PREFIX}-grow`,
  pr0: `${PREFIX}-pr0`,
  ml1: `${PREFIX}-ml1`,
  createButton: `${PREFIX}-createButton`,
  editButton: `${PREFIX}-editButton`,
  deleteButton: `${PREFIX}-deleteButton`,
  refreshButton: `${PREFIX}-refreshButton`,
  downloadButton: `${PREFIX}-downloadButton`,
  importButton: `${PREFIX}-importButton`,
};

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  [`&.${classes.root}`]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },

  [`&.${classes.highlight}`]:
    theme.palette.mode === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },

  [`& .${classes.title}`]: {
    flex: "1 1 100%",
  },

  [`& .${classes.grow}`]: {
    flexGrow: 1,
  },

  [`& .${classes.pr0}`]: {
    paddingRight: 0,
  },

  [`& .${classes.ml1}`]: {
    marginLeft: theme.spacing(1),
  },

  [`& .${classes.createButton}`]: {
    color: theme.palette.success.main,
  },

  [`& .${classes.editButton}`]: {
    color: indigo[500],
  },

  [`& .${classes.deleteButton}`]: {
    color: theme.palette.error.main,
  },

  [`& .${classes.refreshButton}`]: {
    color: indigo[400],
  },

  [`& .${classes.downloadButton}`]: {
    color: indigo[400],
  },

  [`& .${classes.importButton}`]: {
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

  const debouncedHandler = useMemo(
    () => debounce((event) => handleUniversalFilterChange(event), 700),
    []
  );

  const handleDebouncedFilterChange = (event) => {
    debouncedHandler(event);
  };

  return (
    <StyledToolbar
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
          {get(selected, descriptorAttribute)}
        </Typography>
      ) : actionButtons.includes("dateFilters") ? (
        <Fragment>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              inputFormat="dd/MM/yyyy"
              id="date-from"
              label="From"
              value={dates.from || null}
              onChange={(value) => handleDateChange("from", value)}
              renderInput={(params) => (
                <TextField fullWidth size="small" {...params} />
              )}
              InputProps={{
                className: classes.pr0,
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              className={classes.ml1}
              inputFormat="dd/MM/yyyy"
              id="date-to"
              label="To"
              value={dates.to || null}
              onChange={(value) => handleDateChange("to", value)}
              renderInput={(params) => (
                <TextField fullWidth size="small" {...params} />
              )}
              InputProps={{
                className: classes.pr0,
              }}
            />
          </LocalizationProvider>
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
                size="large"
              >
                <GetApp />
              </IconButton>
            </Tooltip>
          ) : null}
          {actionButtons.includes("edit") ? (
            <Tooltip title="Edit">
              <IconButton
                aria-label="edit"
                className={classes.editButton}
                onClick={(event) => handleActionClick(event, "edit")}
                size="large"
              >
                <Edit />
              </IconButton>
            </Tooltip>
          ) : null}
          {actionButtons.includes("delete") ? (
            <Tooltip title="Delete">
              <IconButton
                aria-label="delete"
                className={classes.deleteButton}
                onClick={(event) => handleActionClick(event, "delete")}
                size="large"
              >
                <Delete />
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
                size="large"
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
                size="large"
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
                size="large"
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
          {actionButtons.includes("create") && (
            <Tooltip title="Create">
              <IconButton
                aria-label="create"
                className={classes.createButton}
                onClick={(event) => handleActionClick(event, "create")}
                size="large"
              >
                <AddCircle />
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
                      <FilterList />
                    </Tooltip>
                  </InputAdornment>
                }
                label="Filter"
              />
            </FormControl>
          )}
        </Fragment>
      )}
    </StyledToolbar>
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
