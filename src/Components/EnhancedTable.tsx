import { format, parseISO } from "date-fns";
import get from "lodash/get";
import React, { Fragment } from "react";

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Backdrop, Box, Checkbox, Chip, CircularProgress, Collapse, IconButton, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip
} from "@mui/material";
import { grey, indigo } from "@mui/material/colors";
import { lighten } from "@mui/material/styles";

import { Header } from "../contracts/Header";
import { getKey } from "../utils";
import EnhancedSubTable from "./EnhancedSubTable";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";

export interface EnhancedTableProps<TData extends Record<string, any>> {
  /**
   * Table title
   */
  title?: string;
  /**
   * Table row data
   */
  rows: Array<TData>;
  /**
   * Table headers
   */
  headers: Array<Header<TData>>;
  /**
   * Whether to use dense prop for Material UI's Table
   */
  dense?: boolean;
  /**
   * Column sort order. One of: `asc`, `desc`, `undefined`
   */
  order?: "asc" | "desc" | undefined;
  /**
   * Attribute to sort column by
   */
  orderBy?: string;
  /**
   * Whether to display loading Backdrop component
   */
  loading?: boolean;
  /**
   * Current page
   */
  page?: number;
  /**
   * Total result count
   */
  totalCount?: number;
  /**
   * Number of rows per page
   */
  rowsPerPage?: number;
  /**
   * Selected row(s)
   */
  selected?: Array<TData | undefined>;
  /**
   * Attributed used to display descriptor for selected row in toolbar
   */
  descriptorAttribute?: string;
  /**
   * Method to handle row click event
   */
  handleRowClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    row: TData
  ) => void;
  /**
   * Method to handle column sort click
   */
  handleRequestSort?: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    property: string
  ) => void;
  /**
   * Method to handle page change
   */
  handlePageChange?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => void;
  /**
   * Method to handle rows per page change
   */
  handleRowsPerPageChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  /**
   * Method to handle universal filter onChange event
   */
  handleUniversalFilterChange?: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  /**
   * Method to handle date changes in date filters
   */
  handleDateChange?: (
    dateField: "from" | "to" | "date",
    value: string | null
  ) => void;
  /**
   * Method to handle table action click
   */
  handleActionClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    action: string
  ) => void;
  /**
   * Method to handle action click within a nested table in a row
   */
  handleNestedAction?: () => void;
  /**
   * Method to handle nested field onChange event
   */
  handleNestedFieldChange?: () => void;
  /**
   * Object indicating the actions available for each nested row.
   * Possible actions include add or edit. Object needs to be of the form
   * `{ [nestedRowId]: { add: true, edit: true } }`
   */
  nestedRowAction?: {
    [nestedRowIdentifier: string]: { [action: string]: boolean };
  };
  /**
   * Filter date in yyyy-MM-dd
   */
  date?: string;
  /**
   * Filter dates. Must be of the form
   * ```
   * {
   *   from: format(new Date(), "yyyy-MM-dd"),
   *   to: format(new Date(), "yyyy-MM-dd")
   * }
   * ```
   */
  dates?: { from: string; to: string };
  /**
   * Actions to include in table. E.g. `["create", "edit", "delete", "filter"]`
   */
  actionButtons?: Array<
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
  /**
   * Whether to show the toolbar
   */
  showToolbar?: boolean;
  /**
   * Whether each row should be collapsible
   */
  collapsible?: boolean;
  /**
   * Array of content for each collapsible row. Index of this array should
   * correspond to index of rows. The collapse content for rows[0] should be
   * collapseContent[0]. Default collapse content is a table.
   */
  collapseContent?: Array<JSX.Element>;
  /**
   * Headers for default table within collapse content.
   * Required if collapsible = true and collapseContent prop is not passed
   */
  collapseHeaders?: Array<Header<TData>>;
  /**
   * Object to indicate which collapsible rows should be open.
   * Object should be of the form `{ [row[identifier]]: true }`
   */
  openRows?: { [rowIdentifier: string]: boolean };
  /**
   * Attribute used as row identifier
   */
  identifier?: keyof TData;
  /**
   * Method to handle collapse icon click event
   */
  handleCollapseIconClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    rowIdentifier: string,
    isCollapsed: boolean
  ) => void;
  /**
   * Whether to ignore click event on row
   */
  disableRowClick?: boolean;
  /**
   * Makes rows unselectable
   */
  disableSelection?: boolean;
  /**
   * Manually define the selectible rows. Array should contain the row identifiers
   */
  selectibleRows?: Array<string | number>;
  /**
   * Badge count for refresh button. This can be used to indicate whether
   * the table has pending unfetched data
   */
  refreshBadgeCount?: number;
}

export default function EnhancedTable<TData extends Record<string, any>>(
  props: EnhancedTableProps<TData>
) {
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
    date,
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

  function isSelected(row: TData) {
    if (disableSelection) {
      return false;
    }
    return selected
      ?.map((item) => item?.[identifier!])
      .includes(row[identifier!]);
  }

  function isDisabled(row: TData) {
    return (
      selectibleRows !== null && !selectibleRows?.includes(row[identifier!])
    );
  }

  function isSelectible(row: TData) {
    return (
      selectibleRows === null ||
      (selectibleRows !== null && selectibleRows?.includes(row[identifier!]))
    );
  }

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  function formatContent(
    header: Header<TData>,
    content: string,
    additionalPriceContent?: string
  ) {
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
      const [bgColor, borderColor] = header.chipColor
        ? header.chipColor[content]
        : [indigo[50], indigo[200]];
      return (
        <Chip
          sx={{
            backgroundColor: bgColor,
            border: `2px solid ${borderColor}`,
          }}
          label={content}
          size="small"
        />
      );
    }
    if (header.price) {
      if (additionalPriceContent) {
        return `${additionalPriceContent} ${content}`;
      }
      return `${header.priceCurrency || "$"} ${content}`;
    }
    return content;
  }

  function getCellComponent(header: Header<TData>, data: TData) {
    let key = getKey(header);
    let content;

    const cellDimensions = {
      width: header.width || "auto",
      minWidth: header.minWidth || "auto",
      maxWidth: header.maxWidth || "none",
    };

    if (header.collapse) {
      return (
        <TableCell
          key={key}
          sx={{
            ...cellDimensions,
            ...header.sx,
          }}
          rowSpan={getRowSpan(data)}
        >
          <Tooltip title={openRows?.[data[identifier!]] ? "Shrink" : "Expand"}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={(event) => {
                if (handleCollapseIconClick) {
                  handleCollapseIconClick(
                    event,
                    data[identifier!],
                    !openRows?.[data[identifier!]]
                  );
                }
              }}
            >
              {openRows?.[data[identifier!]] ? (
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
        <TableCell key={key} padding="checkbox" rowSpan={getRowSpan(data)}>
          <Checkbox checked={isItemSelected} disabled={!isSelectible(data)} />
        </TableCell>
      );
    } else if (header.actions) {
      return (
        <TableCell
          key={key}
          sx={{
            ...cellDimensions,
            ...header.sx,
          }}
          rowSpan={getRowSpan(data)}
        >
          {header.actions.map((action) =>
            action.hideCondition && action.hideCondition(data) ? null : (
              <Tooltip key={action.id} title={action.tooltip}>
                <span>
                  <IconButton
                    aria-label={action.id}
                    onClick={(event) => action.onClick(event, data)}
                    sx={{
                      color: (theme) =>
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
          sx={{
            ...cellDimensions,
            ...header.sx,
          }}
          onClick={(event) =>
            header.stopPropagation ? event.stopPropagation() : {}
          }
          rowSpan={getRowSpan(data)}
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
          dangerouslySetInnerHTML={{
            __html: formatContent(header, content) as string,
          }}
          sx={{
            ...cellDimensions,
            ...header.sx,
          }}
          rowSpan={getRowSpan(data)}
        />
      );
    }

    return (
      <TableCell
        key={key}
        align={header.numeric ? "right" : "left"}
        sx={{
          ...cellDimensions,
          ...header.sx,
        }}
        rowSpan={getRowSpan(data)}
      >
        {formatContent(header, content)}
      </TableCell>
    );
  }

  function getFieldContent(
    header: Header<TData>,
    data: TData
  ): Array<string | TData[string]> {
    let key = getKey(header);
    let content: string;

    if (header.multiField) {
      if (header.html) {
        content = header.html;
        header.multiFieldData?.forEach((item, index) => {
          const value = get(data, item.attribute) || "";
          content = content.replace(`{{${index}}}`, value);
        });
      } else {
        content = "";
        header.multiFieldData?.forEach((item, index) => {
          const value = get(data, item.attribute) || "";
          content += value;
          if (index !== (header.multiFieldData?.length ?? 0) - 1) {
            content += ", ";
          }
        });
      }

      return [key, content];
    }

    if (header.html) {
      content = header.html;
      if (header.attribute) {
        content = content.replace(`{{0}}`, get(data, header.attribute));
      }
      return [key, content];
    }

    if (header.attribute) {
      return [key, get(data, header.attribute)];
    }
    return [key, ""];
  }

  const getRowSpan = (row: TData) => {
    return headers
      .map((header) => {
        if (header.arrayAttribute && header.childAttribute) {
          return (get(row, header.childAttribute) as Array<any>).length || 1;
        }
        return 1;
      })
      .reduce((max, curr) => Math.max(max, curr), 0);
  };

  const handleTableRowClick =
    (row: TData) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (disableRowClick) return;
      if (collapsible && handleCollapseIconClick) {
        handleCollapseIconClick(
          event,
          row[identifier!],
          !openRows?.[row[identifier!]]
        );
      }
      if (handleRowClick) {
        handleRowClick(event, row);
      }
    };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ position: "relative", width: "100%", mb: 2 }}>
        {showToolbar ? (
          <EnhancedTableToolbar
            selected={selected && selected.length > 0 ? selected?.[0] : {}}
            descriptorAttribute={descriptorAttribute || ""}
            handleActionClick={(event, action) => {
              if (handleActionClick) {
                handleActionClick(event, action);
              }
            }}
            actionButtons={actionButtons}
            handleUniversalFilterChange={handleUniversalFilterChange!}
            handleDateChange={handleDateChange!}
            date={date}
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
              orderBy={orderBy || "id"}
              onRequestSort={handleRequestSort!}
            />
            <TableBody>
              {rows.map((row, index) => {
                let isItemSelected = isSelected(row);
                return (
                  <Fragment key={row[identifier!] || index}>
                    <TableRow
                      hover={isSelectible(row)}
                      onClick={handleTableRowClick(row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
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
                              identifier={identifier!}
                              handleNestedAction={handleNestedAction}
                              handleNestedFieldChange={handleNestedFieldChange}
                              nestedRowAction={nestedRowAction}
                              formatContent={formatContent}
                              rowSpan={getRowSpan(row)}
                            />
                          );
                        }
                        return getCellComponent(header, row);
                      })}
                    </TableRow>
                    {collapsible && (
                      <TableRow
                        sx={{
                          backgroundColor: (theme) =>
                            lighten(theme.palette.primary.light, 0.9),
                        }}
                      >
                        <TableCell sx={{ py: 0 }} colSpan={headers.length}>
                          <Collapse
                            in={openRows?.[row[identifier!]]}
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
                                      {collapseHeaders?.map((head) => (
                                        <TableCell key={getKey(head)}>
                                          {head.label}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      {collapseHeaders?.map((head) =>
                                        getCellComponent(head, row)
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
                <TableRow sx={{ height: (dense ? 33 : 53) * emptyRows }}>
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
            rowsPerPage={rowsPerPage!}
            page={(page ?? 1) - 1}
            onPageChange={handlePageChange ?? (() => {})}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        ) : null}

        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.modal + 1,
            color: "#fff",
            position: "absolute",
          }}
          open={loading ?? false}
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
