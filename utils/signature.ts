import crypto from 'crypto';

export class SignatureVerifier {
    private publicKey: string | Buffer;

    constructor(publicKey: string | Buffer) {
        this.publicKey = publicKey;
    }

    createSignaturePayload(messageId: string, timestamp: string, body: string): string {
        return `${messageId}.${timestamp}.${body}`;
    }

    verify(messageId: string, timestamp: string, body: string, signature: string): boolean {
        const payload = this.createSignaturePayload(messageId, timestamp, body);
        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(payload);

        try {
            const signatureBuffer = Buffer.from(signature, 'base64');
            return verifier.verify(this.publicKey, signatureBuffer);
        } catch (error) {
            return false;
        }
    }
}