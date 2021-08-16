import React from "react";
import PropTypes from "prop-types";
import {
  capitalize,
  FormControl,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  AddCircleOutlined,
  Cancel,
  Edit,
  RotateLeft,
  Save,
} from "@material-ui/icons";
import _ from "lodash";
import { indigo } from "@material-ui/core/colors";
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  cell: {
    minWidth: "180px",
  },
  nestedTextField: {
    minWidth: "80px",
  },
  mt0: {
    marginTop: 0,
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
  saveButton: {
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
  const classes = useStyles();

  return (
    <TableCell
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
                  {nestedRowAction[row.id] &&
                  (nestedRowAction[row.id].edit ||
                    nestedRowAction[row.id].add) ? (
                    <Tooltip title="Reset">
                      <IconButton
                        edge="end"
                        className={classes.reset}
                        aria-label="reset"
                        onClick={(event) =>
                          handleNestedAction(event, "reset", row, header.key)
                        }
                      >
                        <RotateLeft />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {nestedRowAction[row.id] &&
                  (nestedRowAction[row.id].edit ||
                    nestedRowAction[row.id].add) ? (
                    <Tooltip title="Save">
                      <IconButton
                        edge="end"
                        className={classes.saveButton}
                        aria-label="save"
                        onClick={(event) =>
                          handleNestedAction(event, "save", row, header.key)
                        }
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
                      >
                        <AddCircleOutlined />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </td>
              </TableRow>
            )}
          {_.get(row, header.arrayAttribute).map((item, index) => (
            <TableRow key={`${getKey(header)}-${item.id || index}-label`}>
              {header.childLabelAttribute ? (
                <td
                  key={`${getKey(header)}-${item.id || index}-label`}
                  align="left"
                >
                  {nestedRowAction[row.id] &&
                  (nestedRowAction[row.id].edit ||
                    nestedRowAction[row.id].add) ? (
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
                    <Fragment>
                      {header.childAttributeLabel && (
                        <div>{header.childLabelAttributeLabel}</div>
                      )}
                      <div>{_.get(item, header.childLabelAttribute)}</div>
                    </Fragment>
                  )}
                </td>
              ) : null}
              <td
                key={`${getKey(header)}-${item.id || index}`}
                align={header.numeric ? "right" : "left"}
              >
                {nestedRowAction[row.id] &&
                (nestedRowAction[row.id].edit ||
                  nestedRowAction[row.id].add) ? (
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
                          value={_.get(item, header.childAttribute2)}
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
                        value={_.get(item, header.childAttribute)}
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
                  <Fragment>
                    {header.childAttributeLabel && (
                      <div>{header.childAttributeLabel}</div>
                    )}
                    {formatContent(
                      header,
                      _.get(item, header.childAttribute),
                      _.get(item, header.childAttribute2) || null
                    )}
                  </Fragment>
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
                          index
                        )
                      }
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

EnhancedSubTable.propTypes = {
  header: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  handleNestedAction: PropTypes.func,
  handleNestedFieldChange: PropTypes.func,
  nestedRowAction: PropTypes.object,
  formatContent: PropTypes.func.isRequired,
};
