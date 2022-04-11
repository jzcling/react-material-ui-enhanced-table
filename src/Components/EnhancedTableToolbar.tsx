import { format, parse } from "date-fns";
import get from "lodash/get";
import React, { Fragment, useMemo } from "react";

import {
  AddCircle, Cached, CloudUpload, Delete, Edit, FilterList, GetApp
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import {
  Badge, Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField,
  Toolbar, ToolbarProps, Tooltip, Typography
} from "@mui/material";
import { amber, indigo } from "@mui/material/colors";
import { lighten } from "@mui/material/styles";
import { debounce } from "@mui/material/utils";

function getRootSx<TData>(disableSelection: boolean, selected: TData) {
  let sx: ToolbarProps["sx"] = {
    pl: 2,
    pr: 1,
  };
  if (!disableSelection && Object.keys(selected).length > 0) {
    sx = {
      ...sx,
      color: (theme) =>
        theme.palette.mode === "light" ? "secondary.main" : "text.primary",
      backgroundColor: (theme) =>
        theme.palette.mode === "light"
          ? lighten(theme.palette.secondary.light, 0.85)
          : "secondary.dark",
    };
  }
  return sx;
}

interface Props<TData> {
  selected: TData;
  descriptorAttribute: string;
  handleActionClick: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    action: string
  ) => void;
  actionButtons: Array<
    | "create"
    | "edit"
    | "delete"
    | "filter"
    | "download"
    | "refresh"
    | "import"
    | "bulkEdit"
    | "dateFilters"
  >;
  handleUniversalFilterChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  handleDateChange: (
    dateField: "from" | "to" | "date",
    value: string | null
  ) => void;
  date?: string;
  dates?: { from: string; to: string };
  loading: boolean;
  refreshBadgeCount: number;
  disableSelection: boolean;
}

export default function EnhancedTableToolbar<TData>(props: Props<TData>) {
  const {
    selected,
    descriptorAttribute,
    handleActionClick,
    actionButtons,
    handleUniversalFilterChange,
    handleDateChange,
    date,
    dates,
    loading,
    refreshBadgeCount,
    disableSelection,
  } = props;

  const handleDebouncedFilterChange = useMemo(
    () =>
      debounce(
        (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
          handleUniversalFilterChange(event),
        700
      ),
    []
  );

  return (
    <Toolbar sx={getRootSx(disableSelection, selected)}>
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
        dates ? (
          <>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                label="From"
                value={
                  dates.from
                    ? parse(dates.from, "yyyy-MM-dd", new Date())
                    : null
                }
                onChange={(value) =>
                  handleDateChange(
                    "from",
                    value ? format(value, "yyyy-MM-dd") : null
                  )
                }
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>
            <Box sx={{ ml: 1 }}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DatePicker
                  inputFormat="dd/MM/yyyy"
                  label="To"
                  value={
                    dates.to ? parse(dates.to, "yyyy-MM-dd", new Date()) : null
                  }
                  onChange={(value) =>
                    handleDateChange(
                      "to",
                      value ? format(value, "yyyy-MM-dd") : null
                    )
                  }
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
          </>
        ) : date !== undefined ? (
          <>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                label="Date"
                value={date ? parse(date, "yyyy-MM-dd", new Date()) : null}
                onChange={(value) =>
                  handleDateChange(
                    "date",
                    value ? format(value, "yyyy-MM-dd") : null
                  )
                }
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>
            <Box sx={{ flexGrow: 1 }} />
          </>
        ) : null
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
                size="small"
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
