export class CreateTodoDto {
    title: string;
    user_id: string;
    description: string;
    
    constructor(title?: string, description?: string, user_id?: string) {
        this.title = title || '';
        this.description = description || '';
        this.user_id = user_id || '';
    }
}