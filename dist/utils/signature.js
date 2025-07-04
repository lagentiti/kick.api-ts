"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureVerifier = void 0;
var crypto_1 = __importDefault(require("crypto"));
var SignatureVerifier = /** @class */ (function () {
    function SignatureVerifier(publicKey) {
        this.publicKey = publicKey;
    }
    SignatureVerifier.prototype.createSignaturePayload = function (messageId, timestamp, body) {
        return "".concat(messageId, ".").concat(timestamp, ".").concat(body);
    };
    SignatureVerifier.prototype.verify = function (messageId, timestamp, body, signature) {
        var payload = this.createSignaturePayload(messageId, timestamp, body);
        var verifier = crypto_1.default.createVerify('RSA-SHA256');
        verifier.update(payload);
        try {
            var signatureBuffer = Buffer.from(signature, 'base64');
            return verifier.verify(this.publicKey, signatureBuffer);
        }
        catch (error) {
            return false;
        }
    };
    return SignatureVerifier;
}());
exports.SignatureVerifier = SignatureVerifier;
