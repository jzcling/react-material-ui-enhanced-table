import React, { Fragment, useMemo } from "react";
import PropTypes from "prop-types";
import { lighten } from "@mui/material/styles";
import {
  Badge,
  Box,
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

const rootStyle = (disableSelection, selected) => {
  var style = {
    pl: 2,
    pr: 1,
  };
  if (!disableSelection && Object.keys(selected).length > 0) {
    style = {
      ...style,
      color: (theme) =>
        theme.palette.mode === "light" ? "secondary.main" : "text.primary",
      backgroundColor: (theme) =>
        theme.palette.mode === "light"
          ? lighten(theme.palette.secondary.light, 0.85)
          : "secondary.dark",
    };
  }
  return style;
};

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
    <Toolbar sx={rootStyle(disableSelection, selected)}>
      {!disableSelection && Object.keys(selected).length > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
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
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              sx={{ ml: 1 }}
              inputFormat="dd/MM/yyyy"
              id="date-to"
              label="To"
              value={dates.to || null}
              onChange={(value) => handleDateChange("to", value)}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>
          <Box sx={{ flexGrow: 1 }} />
        </Fragment>
      ) : (
        <Box sx={{ flexGrow: 1 }} />
      )}

      {!disableSelection && Object.keys(selected).length > 0 ? (
        <Fragment>
          {actionButtons.includes("download") ? (
            <Tooltip title="Download">
              <IconButton
                aria-label="download"
                sx={{ color: indigo[400] }}
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
                sx={{ color: indigo[500] }}
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
                sx={{ color: "error.main" }}
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
                sx={{ color: indigo[400] }}
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
                sx={{ color: amber[600] }}
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
                sx={{ color: indigo[500] }}
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
                sx={{ color: "success.main" }}
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
