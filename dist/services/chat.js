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
exports.ChatService = void 0;
var errors_1 = require("../errors");
var ChatService = /** @class */ (function () {
    function ChatService(apiClient) {
        this.apiClient = apiClient;
        this.baseUrl = 'https://api.kick.com/public/v1/chat';
    }
    ChatService.prototype.sendMessage = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, error, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            content: options.content,
                            type: options.type || 'bot'
                        };
                        if (payload.type === 'user') {
                            if (!options.broadcasterUserId) {
                                throw new Error('broadcaster_user_id is required for user type messages');
                            }
                            payload.broadcaster_user_id = options.broadcasterUserId;
                        }
                        if (payload.content.length > 500) {
                            throw new Error('Message content cannot exceed 500 characters');
                        }
                        if (!['user', 'bot'].includes(payload.type)) {
                            throw new Error('Message type must be either "user" or "bot"');
                        }
                        return [4 /*yield*/, fetch(this.baseUrl, {
                                method: 'POST',
                                headers: {
                                    Authorization: "Bearer ".concat(options.token),
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
                        throw new Error("HTTP error! status: ".concat(response.status, ", message: ").concat(error.message || 'Unknown error'));
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        result = _a.sent();
                        return [2 /*return*/, result.data || result];
                }
            });
        });
    };
    return ChatService;
}());
exports.ChatService = ChatService;
