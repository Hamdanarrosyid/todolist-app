import { Address } from "./address";

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    birthdate: string;
    address: Address | null;
}