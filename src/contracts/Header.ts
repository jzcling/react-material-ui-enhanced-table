import { Action } from "./Action";

export interface Header<TData extends Record<string, any>> {
  /**
   * Attribute used to determine row key
   */
  key: string;
  /**
   * Attribute used to determine cell content
   */
  attribute: string;
  /**
   * Header label
   */
  label?: string;
  /**
   * Whether the cell should display content from multiple attributes.
   * Best used with `data` and `html` props.
   */
  multiField?: boolean;
  /**
   * Array of attributes used for multiField content. Required if multiField = true.
   * Array should be of the form [{ attribute: "name" }]
   */
  multiFieldData?: Array<{ attribute: string }>;
  /**
   * HTML code for displaying content. Attribute will be substituted in for {{0}}.
   * If used with multiField, data attributes will be substituted in for {{index}},
   * where index is the position index of the data array
   */
  html?: string;
  /**
   * If true, column will contain a Material UI Chip populated with attribute.
   * The `chipColor` prop can be used to determine the Chip's color
   */
  chip?: boolean;
  /**
   * Used with chip. Object of the form { [option]: [bgColor, borderColor] }
   */
  chipColor?: { [attribute: string]: [string, string] };
  /**
   * If true, column will contain a collapse icon
   */
  collapse?: boolean;
  /**
   * If true, column will contain a Material UI Checkbox component that
   * is controlled by whether the row is selected
   */
  checkbox?: boolean;
  /**
   * Array containing possible actions for each row. Should be of the form
   * ```
   * {
   *   id: "cancel",
   *   icon: <Block />,
   *   tooltip: "Cancel",
   *   onClick: (event, row) => {},
   *   color: indigo[400],
   *   hideCondition: (data) => {},
   *   disableCondition: false
   * }
   * ```
   */
  actions?: Array<Action<TData>>;
  /**
   * Array containing possible actions for the header. Should be of the form
   * ```
   * {
   *   id: 'edit',
   *   icon: <Edit />,
   *   tooltip: 'Edit',
   *   onClick: (event) => {},
   *   color: indigo[400],
   *   hideCondition: false,
   *   disableCondition: false
   * }
   * ```
   */
  headerActions?: Array<Action<TData>>;
  /**
   * Custom component for cell content. Row data is passed as sole parameter.
   */
  component?: (data: TData) => JSX.Element;
  /**
   * Used with `component`. If true, cell component click will stop further propagation to parent row.
   */
  stopPropagation?: boolean;
  /**
   * Attribute used to populate nested table within row
   */
  arrayAttribute?: string;
  /**
   * Attribute within arrayAttribute object to display as nested row
   */
  childAttribute?: string;
  /**
   * Attribute within arrayAttribute object to display on left of childAttribute within nested row
   */
  childAttribute2?: string;
  /**
   * Attribute within arrayAttribute object to display on left of childAttribute and childAttribute2 within nested row
   */
  childLabelAttribute?: string;
  /**
   * Label for childAttribute
   */
  childAttributeLabel?: string;
  /**
   * Label for childAttribute2
   */
  childAttribute2Label?: string;
  /**
   * Label for childLabelAttribute
   */
  childLabelAttributeLabel?: string;
  /**
   * Object indicating which actions to show for each nested row.
   * Actions available are add, edit and delete. Should be of the form
   * `{ delete: true, edit: true, add: true }`.
   */
  childActions?: { [action: string]: boolean };
  /**
   * Attribute to order nested table content. Should be of the form `[attribute, asc|desc]`
   */
  orderBy?: [string, "asc" | "desc"];
  /**
   * If true, content will be right-aligned
   */
  numeric?: boolean;
  /**
   * If true, content will be prefixed with `priceCurrency` if defined, otherwise "$"
   */
  price?: boolean;
  /**
   * Currency prefix for price. E.g. $ or SGD
   */
  priceCurrency?: string;
  /**
   * If true, content will be parsed with date-fns in the format d MMM yyyy
   */
  date?: boolean;
  /**
   * If true, content will be parsed with date-fns in the format d MMM yyyy and h:mm:ss a
   */
  datetime?: boolean;
  /**
   * If true, content will be parsed with date-fns in the format h:mm:ss a
   */
  time?: boolean;
  /**
   * Max length of string content
   */
  truncate?: number;
  /**
   * Fixed width for column
   */
  width?: number;
  /**
   * Minimum width for column
   */
  minWidth?: number;
  /**
   * Maximum width for column
   */
  maxWidth?: number;
  /**
   * If true, cell padding will be set to 0
   */
  disablePadding?: boolean;
  /**
   * If true, column will be sortable based on `attribute`.
   * `attribute` is required for column to be sortable
   */
  sortable?: boolean;
}
