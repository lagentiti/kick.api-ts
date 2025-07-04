export declare class SignatureVerifier {
    private publicKey;
    constructor(publicKey: string | Buffer);
    createSignaturePayload(messageId: string, timestamp: string, body: string): string;
    verify(messageId: string, timestamp: string, body: string, signature: string): boolean;
}
