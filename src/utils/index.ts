import { Header } from "../contracts/Header";

export function getKey<TData>(header: Header<TData>): string {
  return header.key || header.attribute || "";
}
