export class UpdateAddressDto {
    user_id: string;
    street: string;
    city: string
    province: string
    postal_code: string

    constructor(user_id?: string, street?: string, city?: string, province?: string, postal_code?: string) {
        this.user_id = user_id || '';
        this.street = street || '';
        this.city =  city || '';
        this.province = province || '';
        this.postal_code = postal_code || '';
    }
}