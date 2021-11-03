import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  Backdrop,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHead";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { grey, indigo } from "@mui/material/colors";
import get from "lodash/get";
import EnhancedSubTable from "./EnhancedSubTable";
import { format, parseISO } from "date-fns";

function getKey(header) {
  return header.key || header.attribute;
}

export default function EnhancedTable(props) {
  const {
    title,
    rows,
    totalCount,
    descriptorAttribute,
    headers,
    order,
    orderBy,
    dense,
    loading,
    page,
    rowsPerPage,
    selected,
    handleRowClick,
    handleRequestSort,
    handlePageChange,
    handleRowsPerPageChange,
    handleNestedAction,
    handleNestedFieldChange,
    handleActionClick,
    disableRowClick,
    handleUniversalFilterChange,
    handleDateChange,
    dates,
    actionButtons,
    showToolbar,
    collapsible,
    collapseHeaders,
    collapseContent,
    refreshBadgeCount,
    disableSelection,
    nestedRowAction,
    openRows,
    handleCollapseIconClick,
    selectibleRows,
    identifier,
  } = props;

  const theme = useTheme();

  function isSelected(row) {
    if (disableSelection) {
      return false;
    }
    return selected.map((item) => item[identifier]).includes(row[identifier]);
  }

  function isDisabled(row) {
    return selectibleRows !== null && !selectibleRows.includes(row[identifier]);
  }

  function isSelectible(row) {
    return (
      selectibleRows === null ||
      (selectibleRows !== null && selectibleRows.includes(row[identifier]))
    );
  }

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const formatContent = (header, content, additionalContent = null) => {
    if (!content) {
      return "";
    }

    if (header.date) {
      return format(parseISO(content), "d MMM yyyy");
    }
    if (header.datetime) {
      return (
        <Fragment>
          <div>{format(parseISO(content), "d MMM yyyy")}</div>
          <div>{format(parseISO(content), "h:mm:ss a")}</div>
        </Fragment>
      );
    }
    if (header.time) {
      return format(parseISO(content), "h:mm:ss a");
    }
    if (header.truncate) {
      return content.slice(0, header.truncate);
    }
    if (header.chip) {
      const [bgColor, borderColor] = header.color[content] || [
        indigo[50],
        indigo[200],
      ];
      return (
        <Chip
          style={{
            backgroundColor: bgColor,
            border: `2px solid ${borderColor}`,
          }}
          label={content}
          size="small"
        />
      );
    }
    if (header.price) {
      if (additionalContent) {
        return additionalContent + " " + content;
      }
      return "$ " + content;
    }
    return content;
  };

  const getCellDom = (header, data) => {
    var key = getKey(header);
    var content;

    if (header.collapse) {
      return (
        <TableCell
          key={key}
          style={{
            width: header.width || null,
            minWidth: header.minWidth || null,
            maxWidth: header.maxWidth || null,
          }}
        >
          <Tooltip
            title={
              openRows[data[identifier] || undefined] ? "Shrink" : "Expand"
            }
          >
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={(event) =>
                handleCollapseIconClick(
                  event,
                  data[identifier],
                  !openRows[data[identifier] || undefined]
                )
              }
            >
              {openRows[data[identifier] || undefined] ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown />
              )}
            </IconButton>
          </Tooltip>
        </TableCell>
      );
    } else if (header.checkbox) {
      const isItemSelected = isSelected(data);
      return (
        <TableCell key={key} padding="checkbox">
          <Checkbox checked={isItemSelected} disabled={!isSelectible(data)} />
        </TableCell>
      );
    } else if (header.actions) {
      return (
        <TableCell
          key={key}
          style={{
            width: header.width || null,
            minWidth: header.minWidth || null,
            maxWidth: header.maxWidth || null,
          }}
        >
          {header.actions.map((action) =>
            action.hideCondition && action.hideCondition(data) ? null : (
              <Tooltip key={action.id} title={action.tooltip}>
                <span>
                  <IconButton
                    aria-label={action.id}
                    onClick={(event) => action.onClick(event, data)}
                    style={{
                      color:
                        action.disableCondition && action.disableCondition(data)
                          ? grey[400]
                          : action.color || theme.palette.primary.main,
                    }}
                    disabled={
                      (action.disableCondition &&
                        action.disableCondition(data)) ||
                      isDisabled(data)
                    }
                    size="large"
                  >
                    {action.icon}
                  </IconButton>
                </span>
              </Tooltip>
            )
          )}
        </TableCell>
      );
    } else if (header.component) {
      return (
        <TableCell
          key={key}
          align={header.numeric ? "right" : "left"}
          style={{
            width: header.width || null,
            minWidth: header.minWidth || null,
            maxWidth: header.maxWidth || null,
          }}
          onClick={(event) =>
            header.stopPropagation ? event.stopPropagation() : {}
          }
        >
          {header.component(data)}
        </TableCell>
      );
    } else {
      [key, content] = getFieldContent(header, data);
    }

    if (header.html) {
      return (
        <TableCell
          key={key}
          align={header.numeric ? "right" : "left"}
          dangerouslySetInnerHTML={{ __html: formatContent(header, content) }}
          style={{
            width: header.width || null,
            minWidth: header.minWidth || null,
            maxWidth: header.maxWidth || null,
          }}
        />
      );
    }

    return (
      <TableCell
        key={key}
        align={header.numeric ? "right" : "left"}
        style={{
          width: header.width || null,
          minWidth: header.minWidth || null,
          maxWidth: header.maxWidth || null,
        }}
      >
        {formatContent(header, content)}
      </TableCell>
    );
  };

  function getFieldContent(header, data) {
    var key = getKey(header);
    var content;

    if (header.multiField) {
      if (header.html) {
        content = header.html;
        header.data.forEach((item, index) => {
          const value = get(data, item.attribute) || "";
          content = content.replace(`{{${index}}}`, formatContent(item, value));
        });
      } else {
        content = "";
        header.data.forEach((item, index) => {
          const value = get(data, item.attribute) || "";
          content += formatContent(item, value);
          if (index !== header.data.length - 1) {
            content += ", ";
          }
        });
      }

      return [key, content];
    }

    if (header.html) {
      content = header.html;
      content = content.replace(`{{0}}`, get(data, header.attribute));
      return [key, content];
    }

    return [key, get(data, header.attribute)];
  }

  const getRowSpan = (row) => {
    return headers
      .map((header) => {
        if (header.arrayAttribute) {
          return (get(row, header.childAttribute) || []).length;
        }
        return 1;
      })
      .reduce((max, curr) => Math.max(max, curr), 0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ position: "relative", width: "100%", mb: 2 }}>
        {showToolbar ? (
          <EnhancedTableToolbar
            selected={selected.length > 0 ? selected[0] : {}}
            descriptorAttribute={descriptorAttribute}
            handleActionClick={(event, action) =>
              handleActionClick(event, action)
            }
            actionButtons={actionButtons}
            handleUniversalFilterChange={handleUniversalFilterChange}
            handleDateChange={handleDateChange}
            dates={dates}
            loading={loading}
            refreshBadgeCount={refreshBadgeCount}
            disableSelection={disableSelection}
          />
        ) : null}
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label={title}
            stickyHeader
          >
            <EnhancedTableHead
              headers={headers}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {rows.map((row, index) => {
                var isItemSelected = isSelected(row);
                return (
                  <Fragment key={row[identifier] || index}>
                    <TableRow
                      hover={isSelectible(row)}
                      onClick={(event) => {
                        if (disableRowClick) return;
                        if (collapsible) {
                          handleCollapseIconClick(
                            event,
                            row[identifier],
                            !openRows[row[identifier] || undefined]
                          );
                        }
                        if (handleRowClick) {
                          handleRowClick(event, row);
                        }
                      }}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      rowSpan={getRowSpan(row)}
                      sx={{
                        opacity: isDisabled(row) ? 0.3 : 1,
                        cursor: isSelectible(row) ? "pointer" : "auto",
                      }}
                    >
                      {headers.map((header) => {
                        if (header.arrayAttribute) {
                          return (
                            <EnhancedSubTable
                              key={getKey(header)}
                              header={header}
                              row={row}
                              handleNestedAction={handleNestedAction}
                              handleNestedFieldChange={handleNestedFieldChange}
                              nestedRowAction={nestedRowAction}
                              formatContent={formatContent}
                            />
                          );
                        }
                        return getCellDom(header, row);
                      })}
                    </TableRow>
                    {collapsible && (
                      <TableRow
                        style={{
                          backgroundColor: lighten(
                            theme.palette.primary.light,
                            0.9
                          ),
                        }}
                      >
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={headers.length}
                        >
                          <Collapse
                            in={openRows[row[identifier] || undefined]}
                            timeout="auto"
                            mountOnEnter
                            unmountOnExit
                          >
                            <Box margin={1}>
                              {collapseContent ? (
                                collapseContent[index]
                              ) : (
                                <Table size="small" aria-label="details">
                                  <TableHead>
                                    <TableRow>
                                      {collapseHeaders.map((head) => (
                                        <TableCell key={getKey(head)}>
                                          {head.label}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      {collapseHeaders.map((head) =>
                                        getCellDom(head, row)
                                      )}
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={headers.length} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        {totalCount ? (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        ) : null}

        <Backdrop
          sx={{
            zIndex: theme.zIndex.modal + 1,
            color: "#fff",
            position: "absolute",
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Paper>
    </Box>
  );
}

EnhancedTable.defaultProps = {
  order: "asc",
  orderBy: "id",
  dense: true,
  loading: false,
  page: 1,
  rowsPerPage: 10,
  selected: [],
  handleRowClick: () => {},
  handleRequestSort: () => {},
  handleNestedAction: () => {},
  handleNestedFieldChange: () => {},
  handleActionClick: () => {},
  disableRowClick: false,
  handleUniversalFilterChange: () => {},
  handleDateChange: () => {},
  dates: {
    from: format(new Date(), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  },
  actionButtons: ["create", "edit", "delete", "filter"],
  showToolbar: true,
  collapsible: false,
  collapseHeaders: [],
  collapseContent: null,
  refreshBadgeCount: 0,
  disableSelection: false,
  nestedRowAction: {},
  openRows: {},
  handleCollapseIconClick: () => {},
  selectibleRows: null,
  identifier: "id",
};

EnhancedTable.propTypes = {
  title: PropTypes.string,
  rows: PropTypes.array.isRequired,
  totalCount: PropTypes.number,
  descriptorAttribute: PropTypes.string,
  headers: PropTypes.array.isRequired,
  dense: PropTypes.bool,
  order: PropTypes.oneOf(["", "asc", "desc"]),
  orderBy: PropTypes.string,
  loading: PropTypes.bool,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  handleRowClick: PropTypes.func,
  handleRequestSort: PropTypes.func,
  handlePageChange: PropTypes.func,
  handleRowsPerPageChange: PropTypes.func,
  handleNestedAction: PropTypes.func,
  handleNestedFieldChange: PropTypes.func,
  handleActionClick: PropTypes.func,
  disableRowClick: PropTypes.bool,
  handleUniversalFilterChange: PropTypes.func,
  handleDateChange: PropTypes.func,
  dates: PropTypes.object,
  actionButtons: PropTypes.array,
  showToolbar: PropTypes.bool,
  collapsible: PropTypes.bool,
  collapseHeaders: PropTypes.array,
  collapseContent: PropTypes.array,
  refreshBadgeCount: PropTypes.number,
  disableSelection: PropTypes.bool,
  nestedRowAction: PropTypes.object,
  openRows: PropTypes.object,
  handleCollapseIconClick: PropTypes.func,
  selectibleRows: PropTypes.array,
  identifier: PropTypes.string,
};
