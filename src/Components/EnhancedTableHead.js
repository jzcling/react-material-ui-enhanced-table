import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  IconButton,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTableHead(props) {
  const { headers, order, orderBy, onRequestSort } = props;
  const classes = useStyles();
  const theme = useTheme();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  function getKey(header) {
    return header.key || header.attribute;
  }

  function getLabel(header) {
    return (
      <Grid container alignItems="center">
        {header.label}
        {header.headerActions &&
          header.headerActions.map((action) =>
            action.hideCondition ? null : (
              <Tooltip key={action.id} title={action.tooltip}>
                <IconButton
                  aria-label={action.tooltip}
                  style={{
                    color: action.color || theme.palette.primary.main,
                    marginLeft: theme.spacing(1),
                  }}
                  onClick={(event) => action.onClick(event)}
                  size="small"
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
            )
          )}
      </Grid>
    );
  }

  return (
    <TableHead>
      <TableRow>
        {headers.map((header) => (
          <TableCell
            key={getKey(header)}
            padding={header.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === header.attribute ? order : false}
          >
            {header.sortable ? (
              <TableSortLabel
                active={orderBy === header.attribute}
                direction={orderBy === header.attribute ? order : "asc"}
                onClick={createSortHandler(header.attribute)}
              >
                {getLabel(header)}
                {orderBy === header.attribute ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              getLabel(header)
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  headers: PropTypes.array.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["", "asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};
