import { Header } from "../contracts/Header";

export function getKey<TData>(header: Header<TData>) {
  return header.key || header.attribute;
}
