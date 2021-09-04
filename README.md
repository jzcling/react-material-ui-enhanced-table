# React Material UI Enhanced Table

An extended React Material UI Table that aims to make creating complex tables more straightforward.

## Installation

```
npm install --save @jeremyling/react-material-ui-enhanced-table
```

The following packages are peer dependencies that must be installed for this package to work.

```
  @date-io/moment
  @material-ui/core
  @material-ui/icons
  @material-ui/pickers
  lodash
  moment
```

## Usage Examples

Example of a collapsible table with a nested table as the collapse content.

```jsx
import React, { useEffect, useState } from "react";
import EnhancedTable from "@jeremyling/react-material-ui-enhanced-table";
import {
  amber,
  green,
  indigo,
  lightGreen,
  red,
} from "@material-ui/core/colors";
import { Block, MoveToInbox } from "@material-ui/icons";

export default function Orders(props) {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [tableLoading, setTableLoading] = useState(false);
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedRow, setSelectedRow] = useState();
  const [selectedItems, setSelectedItems] = useState({});

  const [openRows, setOpenRows] = useState({});

  const [filters, setFilters] = useState();

  const [notificationsCount, setNotificationsCount] = useState();

  const headers = [
    {
      key: "collapse",
      collapse: true,
    },
    { attribute: "order_number", label: "Order No" },
    {
      key: "status",
      attribute: "status",
      label: "Status",
      chip: true,
      color: {
        "In Progress": [amber[50], amber[200]],
        Completed: [green[50], green[200]],
      },
    },
    {
      attribute: "updated_at",
      datetime: true,
      label: "Updated",
    },
    {
      multiField: true,
      key: "customer",
      data: [
        {
          attribute: "user.name",
        },
        {
          attribute: "user.email",
        },
        {
          attribute: "user.phone",
        },
      ],
      html: `
        <div><strong>{{0}}</strong></div>
        <div style="color: #777">{{1}}</div>
        <div style="color: #777">{{2}}</div>
      `,
      label: "Customer",
    },
    {
      attribute: "total",
      label: "Total",
      numeric: true,
      price: true,
    },
    {
      key: "actions",
      actions: [
        {
          id: "process",
          icon: <MoveToInbox />,
          tooltip: "Process",
          onClick: (event, row) => handleAction(event, "process", row),
          color: amber[400],
          hideCondition: (row) => {},
        },
        {
          id: "cancel",
          icon: <Block />,
          tooltip: "Cancel",
          onClick: (event, row) => handleAction(event, "cancel", row),
          color: indigo[400],
        },
      ],
      label: "Actions",
    },
  ];

  const collapseContent = () => {
    const collapseHeaders = [
      {
        key: "checkbox",
        checkbox: true,
      },
      {
        key: "image",
        label: "Image",
        component: (data) => (
          <img src={data.image.url} alt={data.name} loading="lazy" />
        ),
        stopPropagation: true,
      },
      {
        multiField: true,
        key: "product",
        data: [
          {
            attribute: "product.name",
          },
          {
            attribute: "product.sku",
          },
        ],
        html: `
        <div><strong>{{0}}</strong></div>
        <div><strong style="color: #777">SKU: {{1}}</strong></div>
      `,
        label: "Product",
        minWidth: "200px",
      },
      {
        key: "status",
        attribute: "status",
        label: "Status",
        chip: true,
        color: {
          Pending: [amber[50], amber[200]],
          Paid: [lightGreen[50], lightGreen[200]],
          Processed: [indigo[50], indigo[200]],
          Completed: [green[50], green[200]],
        },
      },
      {
        attribute: "updated_at",
        datetime: true,
        label: "Updated",
      },
      { attribute: "quantity", label: "Qty", numeric: true },
      {
        key: "actions",
        actions: [
          {
            id: "process",
            icon: <MoveToInbox />,
            tooltip: "Process",
            onClick: (event, row) => handleAction(event, "process", row),
            color: amber[400],
            hideCondition: (data) => {},
          },
          {
            id: "cancel-order",
            icon: <Block />,
            tooltip: "Cancel",
            onClick: (event, row) => handleAction(event, "cancel", row),
            color: indigo[400],
          },
        ],
        label: "Actions",
      },
    ];

    if (data) {
      return data.map((order) => (
        <EnhancedTable
          key={order.order_number}
          rows={order.order_items}
          headers={collapseHeaders}
          handleActionClick={(event, key) => handleAction(event, key)}
          handleRowClick={(event, row) =>
            handleCollapsibleTableRowClick(event, row)
          }
          selected={selectedItems[order.id]}
          showToolbar={false}
          selectibleRows={getSelectibleItems(selectedRow)}
        />
      ));
    }
  };

  const handleRowClick = (event, item) => {
    setSelectedRow(item);
  };

  function handleCollapsibleTableRowClick(event, row) {}

  function getSelectibleItems(row) {}

  function updateOpenRows(event, key, value) {
    event.stopPropagation();

    var updated = JSON.parse(JSON.stringify(openRows));
    updated[key] = value;
    setOpenRows(updated);
  }

  const handleRequestSort = (event, property) => {
    if (orderBy !== property) {
      setOrder("asc");
      setOrderBy(property);
      return;
    }

    switch (order) {
      case "asc":
        setOrder("desc");
        break;
      case "desc":
        setOrder("");
        setOrderBy("");
        break;
      default:
        break;
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (type, value) => {
    // Update filters
  };

  function handleAction(event, key, row = null) {}

  useEffect(() => {
    getData();

    function getData() {
      // Fetch data with filters
    }
  }, [order, orderBy, rowsPerPage, page, filters]);

  return (
    <EnhancedTable
      rows={data || []}
      totalCount={totalCount}
      headers={headers}
      order={order}
      orderBy={orderBy}
      loading={tableLoading}
      page={page}
      rowsPerPage={rowsPerPage}
      handleRowClick={handleRowClick}
      handleRequestSort={handleRequestSort}
      handlePageChange={handlePageChange}
      handleRowsPerPageChange={handleRowsPerPageChange}
      handleActionClick={(event, key) => handleAction(event, key)}
      handleDateChange={handleDateChange}
      dates={{ from: filters.dateFrom, to: filters.dateTo }}
      actionButtons={["dateFilters", "refresh"]}
      collapsible={true}
      collapseContent={collapseContent}
      refreshBadgeCount={notificationsCount}
      disableSelection={true}
      openRows={openRows}
      handleCollapseIconClick={updateOpenRows}
    />
  );
}
```

Example with a nested table within each row

```jsx
import React, { useEffect, useState } from "react";
import EnhancedTable from "@jeremyling/react-material-ui-enhanced-table";
import { green, red } from "@material-ui/core/colors";

export default function Products(props) {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [tableLoading, setTableLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState({});
  const [universalFilter, setUniversalFilter] = useState("");

  const [nestedRowAction, setNestedRowAction] = useState({});

  const [filters, setFilters] = useState();

  const headers = [
    {
      key: "images",
      label: "Images",
      component: (data) => (
        <img src={data.image.url} alt={data.name} loading="lazy" />
      ),
      stopPropagation: true,
    },
    {
      multiField: true,
      key: "product",
      data: [
        {
          attribute: "name",
        },
        {
          attribute: "sku",
        },
      ],
      html: `
        <div><strong>{{0}}</strong></div>
        <div><strong style="color: #777">SKU: {{2}}</strong></div>
      `,
      label: "Product",
      minWidth: "200px",
    },
    {
      key: "status",
      attribute: "status",
      label: "Status",
      chip: true,
      color: {
        Inactive: [red[50], red[200]],
        Active: [green[50], green[200]],
      },
    },
    { attribute: "category", label: "Category" },
    { attribute: "stock", label: "Stock", sortable: true, numeric: true },
    {
      key: "price",
      label: "Price",
      arrayAttribute: "prices",
      childAttribute: "amount",
      childAttribute2: "currency",
      childLabelAttribute: "tag",
      childActions: { delete: true, edit: true, add: true },
      numeric: true,
      price: true,
    },
  ];

  const handleRowClick = (event, item) => {
    if (item.id === selected.id) {
      setSelected({});
      return;
    }
    setSelected(item);
  };

  const handleAction = (event, key) => {};

  const handleRequestSort = (event, property) => {
    if (orderBy !== property) {
      setOrder("asc");
      setOrderBy(property);
      return;
    }

    switch (order) {
      case "asc":
        setOrder("desc");
        break;
      case "desc":
        setOrder("asc");
        setOrderBy("");
        break;
      default:
        break;
    }
  };

  const handleUniversalFilterChange = (event) => {
    setUniversalFilter(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNestedAction = (event, type, item, id) => {};

  const handleNestedFieldChange = (parentId, id, attribute, value) => {};

  useEffect(() => {
    const getData = () => {
      // Fetch data with filters
    };

    getData();
  }, [universalFilter, order, orderBy, rowsPerPage, page, filters]);

  return (
    <EnhancedTable
      rows={data || []}
      totalCount={totalCount}
      descriptorAttribute="name"
      headers={headers}
      order={order}
      orderBy={orderBy}
      loading={tableLoading}
      page={page}
      rowsPerPage={rowsPerPage}
      selected={[selected]}
      handleRowClick={handleRowClick}
      handleRequestSort={handleRequestSort}
      handlePageChange={handlePageChange}
      handleRowsPerPageChange={handleRowsPerPageChange}
      handleNestedAction={handleNestedAction}
      handleNestedFieldChange={handleNestedFieldChange}
      handleActionClick={(event, key) => handleAction(event, key)}
      actionButtons={["create", "edit", "delete", "filter", "refresh"]}
      handleUniversalFilterChange={handleUniversalFilterChange}
      nestedRowAction={nestedRowAction}
    ></EnhancedTable>
  );
}
```

## Props

| Prop                        | Type     | Default                                                                      | Description                                                                                                                                                                                                |
| --------------------------- | -------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rows                        | `array`  | required                                                                     | Table row content                                                                                                                                                                                          |
| headers                     | `array`  | required                                                                     | Table headers. Customise with props (see below)                                                                                                                                                            |
| dense                       | `bool`   | `true`                                                                       | Whether to use dense prop for Material UI's Table                                                                                                                                                          |
| order                       | `string` | `asc`                                                                        | Column sort order. One of :<br/>`asc`,<br/>`desc`                                                                                                                                                          |
| orderBy                     | `string` | `id`                                                                         | Attribute to sort column by                                                                                                                                                                                |
| loading                     | `bool`   | `false`                                                                      | Whether to display loading Backdrop component                                                                                                                                                              |
| page                        | `number` | `1`                                                                          | Current page                                                                                                                                                                                               |
| totalCount                  | `number` | `undefined`                                                                  | Total result count                                                                                                                                                                                         |
| rowsPerPage                 | `number` | `10`                                                                         | Number of rows per page                                                                                                                                                                                    |
| selected                    | `array`  | `[]`                                                                         | Selected row                                                                                                                                                                                               |
| descriptorAttribute         | `string` | undefined                                                                    | Attributed used to display descriptor for selected row in toolbar                                                                                                                                          |
| handleRowClick              | `func`   | `() => {}`                                                                   | Method to handle row click event                                                                                                                                                                           |
| handleRequestSort           | `func`   | `() => {}`                                                                   | Method to handle column sort click                                                                                                                                                                         |
| handlePageChange            | `func`   | `undefined`                                                                  | Method to handle page change                                                                                                                                                                               |
| handleRowsPerPageChange     | `func`   | `undefined`                                                                  | Method to handle rows per page change                                                                                                                                                                      |
| handleUniversalFilterChange | `func`   | `() => {}`                                                                   | Method to handle universal filter onChange event                                                                                                                                                           |
| handleDateChange            | `func`   | `() => {}`                                                                   | Method to handle date changes in date filters                                                                                                                                                              |
| handleActionClick           | `func`   | `() => {}`                                                                   | Method to handle table action click                                                                                                                                                                        |
| handleNestedAction          | `func`   | `() => {}`                                                                   | Method to handle action click within a nested table in a row                                                                                                                                               |
| handleNestedFieldChange     | `func`   | `() => {}`                                                                   | Method to handle nested field onChange event                                                                                                                                                               |
| nestedRowAction             | `object` | `{}`                                                                         | Object indicating the actions available for each nested row. Possible actions include `add` or `edit`. Object needs to be of the form `{ [nestedRowId]: { add: true, edit: true } }`                       |
| dates                       | `object` | `{ from: moment().format("YYYY-MM-DD"), to: moment().format("YYYY-MM-DD") }` | Filter dates                                                                                                                                                                                               |
| actionButtons               | `array`  | `["create", "edit", "delete", "filter"]`                                     | Actions to include in table                                                                                                                                                                                |
| showToolbar                 | `bool`   | `true`                                                                       | Where to show the toolbar                                                                                                                                                                                  |
| collapsible                 | `bool`   | `false`                                                                      | Whether each row should be collapsible                                                                                                                                                                     |
| collapseContent             | `array`  | `null`                                                                       | Array of content for each collapsible row. Index of this array should correspond to index of rows. The collapse content for `rows[0]` should be `collapseContent[0]`. Default collapse content is a table. |
| collapseHeaders             | `array`  | `[]`                                                                         | Headers for default table within collapse content. Required if `collapsible = true` and `collapseContent` prop is not passed                                                                               |
| openRows                    | `object` | `{}`                                                                         | Object to indicate which collapsible rows should be open. Object should be of the form `{ [row[identifier]]: true }`                                                                                       |
| handleCollapseIconClick     | `func`   | `() => {}`                                                                   | Method to handle collapse icon click event                                                                                                                                                                 |
| disableRowClick             | `bool`   | `false`                                                                      | Whether to ignore click event on row                                                                                                                                                                       |
| disableSelection            | `bool`   | `false`                                                                      | Makes rows unselectable                                                                                                                                                                                    |
| refreshBadgeCount           | `number` | `0`                                                                          | Badge count for refresh button. This can be used to indicate whether the table has pending unfetched data                                                                                                  |
| selectibleRows              | `array`  | `null`                                                                       | Manually define the selectible rows. Array should contain the row identifiers                                                                                                                              |
| identifier                  | `string` | `id`                                                                         | Attribute used as row identifier                                                                                                                                                                           |

## Header Props

| Prop                     | Type     | Default     | Description                                                                                                                                                                                                                |
| ------------------------ | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key                      | `string` | `attribute` | Attribute used to determine row key                                                                                                                                                                                        |
| attribute                | `string` | `undefined` | Attribute used to determine cell content                                                                                                                                                                                   |
| label                    | `string` | `undefined` | Header label                                                                                                                                                                                                               |
| multiField               | `bool`   | `undefined` | Whether the cell should display content from multiple attributes. Best used with `data` and `html` props.                                                                                                                  |
| data                     | `array`  | `undefined` | Array of attributes used for multiField content. Required if `multiField = true`. Array should be of the form `[{ attribute: "name" }]`                                                                                    |
| html                     | `string` | `undefined` | HTML code for displaying content. Attribute will be substituted in for `{{0}}`. If used with `multiField`, `data` attributes will be substituted in for `{{index}}`, where index is the position index of the `data` array |
| chip                     | `bool`   | `undefined` | If true, column will contain a Material UI Chip populated with `attribute`. The `color` prop can be used to determine the Chip's color                                                                                     |
| color                    | `object` | `undefined` | Used with `chip`. Object of the form `{ [option]: [bgColor, borderColor] }`                                                                                                                                                |
| collapse                 | `bool`   | `undefined` | If true, column will contain a collapse icon                                                                                                                                                                               |
| checkbox                 | `bool`   | `undefined` | If true, column will contain a Material UI Checkbox component that is controlled by whether the row is selected                                                                                                            |
| actions                  | `array`  | `undefined` | Array containing possible actions for each row. Should be of the form `{ id: "cancel", icon: <Block />, tooltip: "Cancel", onClick: (event, row) => {}, color: indigo[400], hideCondition: (data) => {} }`                 |
| headerActions            | `array`  | `undefined` | Array containing possible actions for the header. Should be of the form `{ id: 'edit', icon: <Edit />, tooltip: 'Edit', onClick: (event) => {}, hideCondition: false, color: indigo[400]}`                                 |
| component                | `func`   | `undefined` | Custom component for cell content. Row data is passed as sole parameter.                                                                                                                                                   |
| stopPropagation          | `bool`   | `undefined` | Used with `component`. If true, cell component click will stop further propagation to parent row.                                                                                                                          |
| arrayAttribute           | `string` | `undefined` | Attribute used to populate nested table within row                                                                                                                                                                         |
| childAttribute           | `string` | `undefined` | Attribute within `arrayAttribute` object to display as nested row                                                                                                                                                          |
| childAttribute2          | `string` | `undefined` | Attribute within `arrayAttribute` object to display on left of `childAttribute` within nested row                                                                                                                          |
| childLabelAttribute      | `string` | `undefined` | Attribute within `arrayAttribute` object to display on left of childAttribute and childAttribute2 within nested row                                                                                                        |
| childAttributeLabel      | `string` | `undefined` | Label for `childAttribute` and `childAttribute2`                                                                                                                                                                           |
| childLabelAttributeLabel | `string` | `undefined` | Label for `childLabelAttribute`                                                                                                                                                                                            |
| childActions             | `object` | `undefined` | Object indicating which actions to show for each nested row. Actions available are `add`, `edit` and `delete`. Should be of the form `{ delete: true, edit: true, add: true }`.                                            |
| orderBy^                 | `array`  | `undefined` | Attribute to order nested table content. Should be of the form `[attribute, asc\|desc]`                                                                                                                                    |
| numeric                  | `bool`   | `undefined` | If true, content will be right-aligned                                                                                                                                                                                     |
| price                    | `bool`   | `undefined` | If true, content will be prefixed with `$`                                                                                                                                                                                 |
| date                     | `bool`   | `undefined` | If true, content will be parsed with moment in the format `D MMM YYYY`                                                                                                                                                     |
| datetime                 | `bool`   | `undefined` | If true, content will be parsed with moment in the format `D MMM YYYY` and `h:mm:ss a`                                                                                                                                     |
| time                     | `bool`   | `undefined` | If true, content will be parsed with moment in the format `h:mm:ss a`                                                                                                                                                      |
| truncate                 | `number` | `undefined` | Max length of string content                                                                                                                                                                                               |
| width                    | `number` | `undefined` | Fixed width for column                                                                                                                                                                                                     |
| minWidth                 | `number` | `undefined` | Minimum width for column                                                                                                                                                                                                   |
| maxWidth                 | `number` | `undefined` | Maximum width for column                                                                                                                                                                                                   |
| disablePadding           | `bool`   | `undefined` | If true, cell padding will be set to 0                                                                                                                                                                                     |
| sortable                 | `bool`   | `undefined` | If true, column will be sortable based on `attribute`. `attribute` is required for column to be sortable                                                                                                                   |

^Only for nested table
