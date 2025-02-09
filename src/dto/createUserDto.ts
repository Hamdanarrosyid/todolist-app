export class CreateUserDto {
    firstname: string;
    lastname: string;
    birthdate: string;
    
    constructor(firstname?: string, lastname?: string, birthdate?: string) {
        this.firstname = firstname || '';
        this.lastname = lastname || '';
        this.birthdate = birthdate || '';
    }
}