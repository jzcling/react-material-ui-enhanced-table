import get from "lodash/get";
import React, { useMemo } from "react";

import { AddCircleOutlined, Cancel, Edit, RotateLeft, Save } from "@mui/icons-material";
import {
  Box, FormControl, IconButton, Table, TableBody, TableCell, TableRow, TextField, Tooltip
} from "@mui/material";
import { indigo } from "@mui/material/colors";
import { capitalize } from "@mui/material/utils";

import { Header } from "../contracts/Header";
import { getKey } from "../utils";

interface Props<TData extends Record<string, any>> {
  header: Header<TData>;
  row: TData;
  identifier: keyof TData;
  handleNestedAction: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    action: string,
    item: Record<string, any>,
    key: string,
    row?: TData,
    index?: number
  ) => void;
  handleNestedFieldChange: (
    rowIdentifier: string,
    itemIdentifier: string,
    childLabelAttribute: string,
    value: string
  ) => void;
  nestedRowAction: {
    [nestedRowId: string]: {
      [action: string]: boolean;
    };
  };
  formatContent: (
    header: Header<TData>,
    content: string
  ) => string | JSX.Element;
  rowSpan?: number;
}

export default function EnhancedSubTable<TData extends Record<string, any>>(
  props: Props<TData>
) {
  const {
    header,
    row,
    identifier,
    handleNestedAction,
    handleNestedFieldChange,
    nestedRowAction,
    formatContent,
    rowSpan,
  } = props;

  const editing = useMemo(
    () =>
      nestedRowAction[String(row[identifier])] &&
      (nestedRowAction[String(row[identifier])].edit ||
        nestedRowAction[String(row[identifier])].add),
    [nestedRowAction, row, identifier]
  );

  const data: Array<Record<string, any>> = useMemo(() => {
    if (header.arrayAttribute) {
      const data = get(row, header.arrayAttribute);
      if (header.orderBy && header.orderBy[0] && header.orderBy[1]) {
        return data.sort((a: Record<string, any>, b: Record<string, any>) => {
          if (header.orderBy![1] === "desc") {
            return b[header.orderBy![0]] - a[header.orderBy![0]];
          } else {
            return a[header.orderBy![0]] - b[header.orderBy![0]];
          }
        });
      }
    }
    return data;
  }, [row, header]);

  return (
    <TableCell
      key={`${getKey(header)}-${row[identifier]}`}
      onClick={(event) => event.stopPropagation()}
      sx={{ minWidth: "180px" }}
      rowSpan={rowSpan || 1}
    >
      <Table>
        <TableBody>
          {header.childActions &&
            (header.childActions.edit || header.childActions.add) && (
              <TableRow>
                <TableCell
                  align="right"
                  colSpan={
                    1 +
                    (!!(header.childActions && header.childActions.delete)
                      ? 1
                      : 0) +
                    (!!header.childLabelAttribute ? 1 : 0)
                  }
                >
                  {editing ? (
                    <Tooltip title="Reset">
                      <IconButton
                        edge="end"
                        aria-label="reset"
                        onClick={(event) =>
                          handleNestedAction(event, "reset", row, header.key)
                        }
                        size="large"
                      >
                        <RotateLeft />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {editing ? (
                    <Tooltip title="Save">
                      <IconButton
                        edge="end"
                        sx={{ color: indigo[400] }}
                        aria-label="save"
                        onClick={(event) =>
                          handleNestedAction(event, "save", row, header.key)
                        }
                        size="large"
                      >
                        <Save />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {header.childActions.edit &&
                  !(
                    nestedRowAction[row[identifier]] &&
                    nestedRowAction[row[identifier]].edit
                  ) ? (
                    <Tooltip title="Edit">
                      <IconButton
                        edge="end"
                        sx={{ color: indigo[500] }}
                        aria-label="edit"
                        onClick={(event) =>
                          handleNestedAction(event, "edit", row, header.key)
                        }
                        size="large"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {header.childActions.add ? (
                    <Tooltip title="Add">
                      <IconButton
                        edge="end"
                        sx={{ color: "success.main" }}
                        aria-label="add"
                        onClick={(event) =>
                          handleNestedAction(event, "add", row, header.key)
                        }
                        size="large"
                      >
                        <AddCircleOutlined />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </TableCell>
              </TableRow>
            )}

          <TableRow>
            {header.childLabelAttributeLabel && !editing && (
              <TableCell style={{ padding: 0 }}>
                {header.childLabelAttributeLabel}
              </TableCell>
            )}
            {header.childAttributeLabel && !editing && (
              <TableCell style={{ padding: 0 }}>
                {header.childAttributeLabel}
              </TableCell>
            )}
          </TableRow>
          {data.map((item, index) => (
            <TableRow key={`${getKey(header)}-${item.id || index}-label`}>
              {header.childLabelAttribute ? (
                <td
                  key={`${getKey(header)}-${item.id || index}-label`}
                  align="left"
                >
                  {editing ? (
                    <FormControl variant="outlined" sx={{ minWidth: "80px" }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        id={`${getKey(header)}-${item.id || index}-label`}
                        value={item[header.childLabelAttribute]}
                        onChange={(event) =>
                          handleNestedFieldChange(
                            row[identifier],
                            String(item.id || index),
                            header.childLabelAttribute || "",
                            event.target.value
                          )
                        }
                        label={
                          header.childLabelAttributeLabel ||
                          capitalize(header.childLabelAttribute)
                        }
                      />
                    </FormControl>
                  ) : (
                    <div>{get(item, header.childLabelAttribute)}</div>
                  )}
                </td>
              ) : null}
              <td
                key={`${getKey(header)}-${item.id || index}`}
                align={header.numeric ? "right" : "left"}
              >
                {editing ? (
                  <Box display="flex">
                    {header.childAttribute2 ? (
                      <FormControl
                        variant="outlined"
                        style={{
                          marginRight: "2px",
                        }}
                        sx={{ minWidth: "80px" }}
                      >
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          id={`${getKey(header)}-${item.id || index}-2`}
                          value={get(item, header.childAttribute2)}
                          onChange={(event) =>
                            handleNestedFieldChange(
                              row[identifier],
                              item.id || index,
                              header.childAttribute2 || "",
                              event.target.value
                            )
                          }
                          inputProps={{
                            sx: {
                              textAlign: header.numeric ? "right" : "left",
                            },
                          }}
                          label={
                            header.childAttribute2Label ||
                            capitalize(
                              header.childAttribute2?.split(".")?.pop() || ""
                            )
                          }
                        />
                      </FormControl>
                    ) : null}
                    <FormControl variant="outlined" sx={{ minWidth: "80px" }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        id={`${getKey(header)}-${item.id || index}`}
                        value={get(item, header.childAttribute || "")}
                        onChange={(event) =>
                          handleNestedFieldChange(
                            row[identifier],
                            item.id || index,
                            header.childAttribute || "",
                            event.target.value
                          )
                        }
                        inputProps={{
                          sx: {
                            textAlign: header.numeric ? "right" : "left",
                          },
                        }}
                        label={
                          header.childAttributeLabel ||
                          capitalize(
                            header.childAttribute?.split(".")?.pop() || ""
                          )
                        }
                      />
                    </FormControl>
                  </Box>
                ) : (
                  formatContent(header, get(item, header.childAttribute || ""))
                )}
              </td>
              {header.childActions && header.childActions.delete ? (
                <td key={`child-${item.id || index}-delete`} align="right">
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      sx={{ color: "error.main" }}
                      aria-label="delete"
                      onClick={(event) =>
                        handleNestedAction(
                          event,
                          "delete",
                          item,
                          header.key,
                          row,
                          index
                        )
                      }
                      size="large"
                    >
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                </td>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCell>
  );
}

EnhancedSubTable.defaultProps = {
  handleNestedAction: () => {},
  handleNestedFieldChange: () => {},
  nestedRowAction: {},
};
