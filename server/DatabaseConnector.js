"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConnection = void 0;
const mssql = __importStar(require("mssql"));
const msnodesqlv8_1 = __importDefault(require("mssql/msnodesqlv8"));
class ServerConnection {
    constructor(_SQLServerIP, _SQLServerName, _Port, _Username, _Password) {
        if (_Username == "" || _Password == "") {
            this.SqlConfig = {
                server: _SQLServerIP,
                port: _Port,
                driver: "msnodesqlv8",
                options: {
                    trustedConnection: true,
                    trustServerCertificate: true
                }
            };
            this.WindowsLogin = true;
        }
        else {
            this.SqlConfig = {
                user: _Username,
                password: _Password,
                server: _SQLServerIP,
                port: _Port,
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 30000
                },
                options: {
                    trustServerCertificate: true
                }
            };
            this.WindowsLogin = false;
        }
    }
    ExecuteSQL(_query) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            if (this.WindowsLogin) {
                try {
                    yield msnodesqlv8_1.default.connect(this.SqlConfig);
                    result = msnodesqlv8_1.default.query(_query);
                }
                catch (err) {
                    console.log("SQL Error: " + err);
                }
            }
            else {
                try {
                    yield mssql.connect(this.SqlConfig);
                    result = mssql.query(_query);
                }
                catch (err) {
                    console.log("SQL Error: " + err);
                }
            }
            return result;
        });
    }
}
exports.ServerConnection = ServerConnection;
