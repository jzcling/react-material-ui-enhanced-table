import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { capitalize } from "@mui/material/utils";
import {
  AddCircleOutlined,
  Cancel,
  Edit,
  RotateLeft,
  Save,
} from "@mui/icons-material";
import get from "lodash/get";
import { indigo } from "@mui/material/colors";

const PREFIX = "EnhancedSubTable";

const classes = {
  cell: `${PREFIX}-cell`,
  nestedTextField: `${PREFIX}-nestedTextField`,
  mt0: `${PREFIX}-mt0`,
  createButton: `${PREFIX}-createButton`,
  editButton: `${PREFIX}-editButton`,
  deleteButton: `${PREFIX}-deleteButton`,
  saveButton: `${PREFIX}-saveButton`,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${classes.cell}`]: {
    minWidth: "180px",
  },

  [`& .${classes.nestedTextField}`]: {
    minWidth: "80px",
  },

  [`& .${classes.mt0}`]: {
    marginTop: 0,
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

  [`& .${classes.saveButton}`]: {
    color: indigo[400],
  },
}));

function getKey(header) {
  return header.key || header.attribute;
}

export default function EnhancedSubTable(props) {
  const {
    header,
    row,
    handleNestedAction,
    handleNestedFieldChange,
    nestedRowAction,
    formatContent,
  } = props;

  const editing = useMemo(
    () =>
      nestedRowAction[row.id] &&
      (nestedRowAction[row.id].edit || nestedRowAction[row.id].add),
    [nestedRowAction, row.id]
  );

  const data = useMemo(() => {
    const data = get(row, header.arrayAttribute);
    if (header.orderBy && header.orderBy[0]) {
      return data.sort((a, b) => a.min_quantity - b.min_quantity);
    }
    return data;
  }, [row, header]);

  return (
    <StyledTableCell
      key={`${getKey(header)}-${row.id}`}
      onClick={(event) => event.stopPropagation()}
      className={classes.cell}
    >
      <Table>
        <TableBody>
          {header.childActions &&
            (header.childActions.edit || header.childActions.add) && (
              <TableRow>
                <td
                  align="right"
                  colSpan={
                    1 +
                    !!(header.childActions && header.childActions.delete) +
                    !!header.childLabelAttribute
                  }
                >
                  {editing ? (
                    <Tooltip title="Reset">
                      <IconButton
                        edge="end"
                        className={classes.reset}
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
                        className={classes.saveButton}
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
                  !(nestedRowAction[row.id] && nestedRowAction[row.id].edit) ? (
                    <Tooltip title="Edit">
                      <IconButton
                        edge="end"
                        className={classes.editButton}
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
                        className={classes.createButton}
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
                </td>
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
                    <FormControl
                      variant="outlined"
                      className={classes.nestedTextField}
                    >
                      <TextField
                        className={classes.mt0}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        id={`${getKey(header)}-${item.id || index}-label`}
                        value={item[header.childLabelAttribute]}
                        onChange={(event) =>
                          handleNestedFieldChange(
                            row.id,
                            item.id || index,
                            header.childLabelAttribute,
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
                  <div style={{ display: "flex" }}>
                    {header.childAttribute2 ? (
                      <FormControl
                        variant="outlined"
                        style={{
                          marginRight: "2px",
                        }}
                        className={classes.nestedTextField}
                      >
                        <TextField
                          className={classes.mt0}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          id={`${getKey(header)}-${item.id || index}-2`}
                          value={get(item, header.childAttribute2)}
                          onChange={(event) =>
                            handleNestedFieldChange(
                              row.id,
                              item.id || index,
                              header.childAttribute2,
                              event.target.value
                            )
                          }
                          inputProps={{
                            style: {
                              textAlign: header.numeric ? "right" : "left",
                            },
                          }}
                          label={
                            header.childAttribute2Label ||
                            capitalize(header.childAttribute2.split(".").pop())
                          }
                        />
                      </FormControl>
                    ) : null}
                    <FormControl
                      variant="outlined"
                      className={classes.nestedTextField}
                    >
                      <TextField
                        className={classes.mt0}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        id={`${getKey(header)}-${item.id || index}`}
                        value={get(item, header.childAttribute)}
                        onChange={(event) =>
                          handleNestedFieldChange(
                            row.id,
                            item.id || index,
                            header.childAttribute,
                            event.target.value
                          )
                        }
                        inputProps={{
                          style: {
                            textAlign: header.numeric ? "right" : "left",
                          },
                        }}
                        label={
                          header.childAttributeLabel ||
                          capitalize(header.childAttribute.split(".").pop())
                        }
                      />
                    </FormControl>
                  </div>
                ) : (
                  formatContent(
                    header,
                    get(item, header.childAttribute),
                    get(item, header.childAttribute2) || null
                  )
                )}
              </td>
              {header.childActions && header.childActions.delete ? (
                <td key={`child-${item.id || index}-delete`} align="right">
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      className={classes.deleteButton}
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
    </StyledTableCell>
  );
}

EnhancedSubTable.defaultProps = {
  handleNestedAction: () => {},
  handleNestedFieldChange: () => {},
  nestedRowAction: {},
};

EnhancedSubTable.propTypes = {
  header: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  handleNestedAction: PropTypes.func,
  handleNestedFieldChange: PropTypes.func,
  nestedRowAction: PropTypes.object,
  formatContent: PropTypes.func.isRequired,
};
