"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.KickClient = void 0;
var events_1 = require("events");
var categories_1 = require("./services/categories");
var users_1 = require("./services/users");
var channels_1 = require("./services/channels");
var chat_1 = require("./services/chat");
var publicKey_1 = require("./services/publicKey");
var events_2 = require("./services/events"); // ✅ Ajout
var handler_1 = require("./webhooks/handler");
var server_1 = require("./webhooks/server");
var KickClient = /** @class */ (function (_super) {
    __extends(KickClient, _super);
    function KickClient(options) {
        if (options === void 0) { options = {}; }
        var _a;
        var _this = _super.call(this) || this;
        _this.options = __assign({ webhookPort: options.webhookPort || 3000, webhookPath: options.webhookPath || '/webhook', webhookBaseUrl: options.webhookBaseUrl || 'http://localhost', token: (_a = options.token) !== null && _a !== void 0 ? _a : '' }, options);
        _this.categories = new categories_1.CategoriesService(_this);
        _this.users = new users_1.UsersService(_this);
        _this.channels = new channels_1.ChannelsService(_this);
        _this.chat = new chat_1.ChatService(_this);
        _this.publicKey = new publicKey_1.PublicKeyService(_this);
        _this.events = new events_2.EventsService(_this);
        _this.webhookHandler = new handler_1.WebhookHandler(_this);
        _this.webhookServer = new server_1.WebhookServer(_this, {
            port: _this.options.webhookPort,
            path: _this.options.webhookPath
        });
        _this.token = options.token || '';
        return _this;
    }
    KickClient.prototype.searchCategories = function () {
        return __awaiter(this, arguments, void 0, function (query) {
            if (query === void 0) { query = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categories.getCategories(query, this.token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.getCategory = function (categoryId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categories.getCategory(categoryId, this.token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.introspectToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.token)
                            throw new Error('No token provided');
                        return [4 /*yield*/, this.users.introspectToken(this.token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.getUsers = function () {
        return __awaiter(this, arguments, void 0, function (userIds) {
            if (userIds === void 0) { userIds = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.users.getUsers(userIds.map(String), this.token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.getChannels = function () {
        return __awaiter(this, arguments, void 0, function (broadcasterIds) {
            if (broadcasterIds === void 0) { broadcasterIds = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channels.getChannels(broadcasterIds.map(String), this.token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.updateChannel = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var typedOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.token)
                            throw new Error('No token provided');
                        typedOptions = options;
                        return [4 /*yield*/, this.channels.updateChannel(typedOptions, this.token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.sendChatMessage = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chat.sendMessage(__assign(__assign({}, options), { token: this.token, content: options.content // Assure-toi que content existe
                         }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.getPublicKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.publicKey.getPublicKey()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.validateWebhook = function (headers, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.events.initializeVerifier()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.events.validateWebhook(headers, body)];
                }
            });
        });
    };
    KickClient.prototype.getEventSubscriptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.token)
                            throw new Error('No token provided');
                        return [4 /*yield*/, this.events.getSubscriptions(this.token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.subscribeToEvents = function (events_3) {
        return __awaiter(this, arguments, void 0, function (events, method) {
            if (method === void 0) { method = 'webhook'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.token)
                            throw new Error('No token provided');
                        return [4 /*yield*/, this.events.subscribe(events, method, this.token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.unsubscribeFromEvents = function (subscriptionIds) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.token)
                            throw new Error('No token provided');
                        return [4 /*yield*/, this.events.unsubscribe(subscriptionIds, this.token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.startWebhookServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.webhookServer.start()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.stopWebhookServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.webhookServer.stop()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KickClient.prototype.handleWebhookRequest = function (headers, rawBody) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.webhookHandler.handleWebhook(headers, rawBody)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return KickClient;
}(events_1.EventEmitter));
exports.KickClient = KickClient;
