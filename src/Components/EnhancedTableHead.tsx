import React from "react";

import {
  Box, Grid, IconButton, TableCell, TableHead, TableRow, TableSortLabel, Tooltip
} from "@mui/material";

import { Header } from "../contracts/Header";
import { getKey } from "../utils";

interface Props<TData> {
  headers: Array<Header<TData>>;
  onRequestSort: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    property: string
  ) => void;
  order?: "asc" | "desc";
  orderBy: string;
}

export default function EnhancedTableHead<TData>(props: Props<TData>) {
  const { headers, order, orderBy, onRequestSort } = props;

  const createSortHandler =
    (property?: string) =>
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      if (property) {
        onRequestSort(event, property);
      }
    };

  function getLabel(header: Header<TData>) {
    return (
      <Grid container alignItems="center">
        {header.label}
        {header.headerActions &&
          header.headerActions.map((action) =>
            action.hideCondition && action.hideCondition(header) ? null : (
              <Tooltip key={action.id} title={action.tooltip}>
                <IconButton
                  aria-label={action.tooltip}
                  sx={{
                    color: (theme) =>
                      action.color || theme.palette.primary.main,
                    ml: 1,
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
                  <Box
                    component="div"
                    sx={{
                      border: 0,
                      clip: "rect(0 0 0 0)",
                      height: 1,
                      margin: -1,
                      overflow: "hidden",
                      padding: 0,
                      position: "absolute",
                      top: 20,
                      width: 1,
                    }}
                  >
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
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
