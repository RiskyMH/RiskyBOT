/** A class for sending an attachment to discord (eg for interaction reply) */
export class AttachmentBuilder {
    file: Buffer;
    name: string;
    description?: string;

    constructor(file: Buffer, name: string, description?: string) {
        this.file = file;
        this.name = name;
        this.description = description;
    }
}

export default AttachmentBuilder;
