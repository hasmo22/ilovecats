import { Cat } from "./cat.entity";

export class User {
    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    cats!: Cat[];
}
