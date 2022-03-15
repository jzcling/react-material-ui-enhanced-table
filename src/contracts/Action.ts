export interface Action<TData> {
  id: string;
  icon: JSX.Element;
  tooltip: string;
  onClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row?: TData
  ) => void;
  color?: string;
  hideCondition?: (data: TData) => void;
  disableCondition?: (data: TData) => void;
}
