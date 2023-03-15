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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConnection = void 0;
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
            try {
                yield msnodesqlv8_1.default.connect(this.SqlConfig);
                result = msnodesqlv8_1.default.query(_query);
            }
            catch (err) {
                console.log("SQL Error: " + err);
            }
            return result;
        });
    }
    GetCollumnNamesFromTable(_dbname, _tablename, _tableschema) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                var query = "use [" + _dbname + "] SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('[" + _tableschema + "].[" + _tablename + "]') ";
                yield msnodesqlv8_1.default.connect(this.SqlConfig);
                result = msnodesqlv8_1.default.query(query);
            }
            catch (err) {
                console.log("SQL Error: " + err);
                return null;
            }
            return result;
        });
    }
    GetSchemas(_dbname) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                var query = "use [" + _dbname + "] select name from sys.schemas";
                yield msnodesqlv8_1.default.connect(this.SqlConfig);
                result = msnodesqlv8_1.default.query(query);
            }
            catch (err) {
                console.log("SQL Error: " + err);
                return null;
            }
            return result;
        });
    }
    GetTableNamesFromDB(_dbname) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                var query = "use [" + _dbname + "] select name from sys.tables";
                yield msnodesqlv8_1.default.connect(this.SqlConfig);
                result = msnodesqlv8_1.default.query(query);
            }
            catch (err) {
                console.log("SQL Error: " + err);
                return null;
            }
            return result;
        });
    }
    GetDBNamesFromServer() {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                var query = "select name from sys.databases";
                yield msnodesqlv8_1.default.connect(this.SqlConfig);
                result = msnodesqlv8_1.default.query(query);
            }
            catch (err) {
                console.log("SQL Error: " + err);
                return null;
            }
            return result;
        });
    }
    VerifyDBState(_dbname) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                var query = "select name, state from sys.databases where name = '" + _dbname + "'";
                yield msnodesqlv8_1.default.connect(this.SqlConfig);
                result = msnodesqlv8_1.default.query(query);
            }
            catch (err) {
                console.log("SQL Error: " + err);
                return null;
            }
            return result;
        });
    }
}
exports.ServerConnection = ServerConnection;
