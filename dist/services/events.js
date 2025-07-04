"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
var signature_1 = require("../utils/signature");
var errors_1 = require("../errors");
var webhooks_1 = require("../types/webhooks");
var EventsService = /** @class */ (function () {
    function EventsService(apiClient) {
        this.verifier = null;
        this.baseUrl = 'https://api.kick.com/public/v1/events';
        this.apiClient = apiClient;
    }
    EventsService.prototype.initializeVerifier = function () {
        return __awaiter(this, void 0, void 0, function () {
            var publicKeyResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.verifier) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.apiClient.getPublicKey()];
                    case 1:
                        publicKeyResponse = _a.sent();
                        this.verifier = new signature_1.SignatureVerifier(publicKeyResponse.data.public_key);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    EventsService.prototype.validateWebhook = function (headers, body) {
        if (!this.verifier) {
            throw new Error('Signature verifier not initialized');
        }
        var messageId = headers['kick-event-message-id'];
        var timestamp = headers['kick-event-message-timestamp'];
        var signature = headers['kick-event-signature'];
        var eventType = headers['kick-event-type'];
        var version = headers['kick-event-version'];
        if (!messageId || !timestamp || !signature) {
            throw new Error('Missing required webhook headers');
        }
        var isValid = this.verifier.verify(messageId, timestamp, body, signature);
        var parsedPayload = (0, webhooks_1.parseWebhookPayload)(eventType, JSON.parse(body));
        return {
            isValid: isValid,
            eventType: eventType,
            version: version,
            messageId: messageId,
            timestamp: timestamp,
            payload: parsedPayload
        };
    };
    EventsService.prototype.getSubscriptions = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/subscriptions"), {
                            method: 'GET',
                            headers: {
                                Authorization: "Bearer ".concat(token)
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        if (response.status === 401)
                            throw new errors_1.UnauthorizedError();
                        if (response.status === 403)
                            throw new errors_1.ForbiddenError();
                        if (!response.ok)
                            throw new Error("HTTP error! status: ".concat(response.status));
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EventsService.prototype.subscribe = function (events_1) {
        return __awaiter(this, arguments, void 0, function (events, method, token) {
            var webhookUrl, payload, response, error;
            if (method === void 0) { method = 'webhook'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        webhookUrl = "".concat(this.apiClient.options.webhookBaseUrl, ":").concat(this.apiClient.options.webhookPort).concat(this.apiClient.options.webhookPath);
                        payload = {
                            method: method,
                            url: webhookUrl,
                            types: events.map(function (eventName) { return ({
                                name: eventName,
                                version: 1
                            }); })
                        };
                        return [4 /*yield*/, fetch("".concat(this.baseUrl, "/subscriptions"), {
                                method: 'POST',
                                headers: {
                                    Authorization: "Bearer ".concat(token),
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(payload)
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.status === 401)
                            throw new errors_1.UnauthorizedError();
                        if (response.status === 403)
                            throw new errors_1.ForbiddenError();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json().catch(function () { return ({}); })];
                    case 2:
                        error = _a.sent();
                        throw new Error("HTTP error! status: ".concat(response.status, ", message: ").concat(JSON.stringify(error)));
                    case 3: return [4 /*yield*/, response.json()];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EventsService.prototype.unsubscribe = function (subscriptionIds, token) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = new URL("".concat(this.baseUrl, "/subscriptions"));
                        subscriptionIds.forEach(function (id) { return url.searchParams.append('id[]', id); });
                        return [4 /*yield*/, fetch(url.toString(), {
                                method: 'DELETE',
                                headers: {
                                    Authorization: "Bearer ".concat(token)
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.status === 401)
                            throw new errors_1.UnauthorizedError();
                        if (response.status === 403)
                            throw new errors_1.ForbiddenError();
                        if (!response.ok && response.status !== 204) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [2 /*return*/, response.status === 204];
                }
            });
        });
    };
    return EventsService;
}());
exports.EventsService = EventsService;
