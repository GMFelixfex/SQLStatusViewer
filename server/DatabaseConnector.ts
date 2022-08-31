import * as mssql from 'mssql'

export class ServerConnection {
    SQLServerIP: string;
    SQLServerName: string;
    Port: number;
    Username: string;
    Password: string;
    SqlConfig: any;
    constructor(_SQLServerIP: string, _SQLServerName: string, _Port: number, _Username: string, _Password: string){
        this.SQLServerIP = _SQLServerIP;
        this.SQLServerName = _SQLServerName;
        this.Port = _Port;
        this.Username = _Username;
        this.Password = _Password;
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
            options:{
                trustServerCertificate: true
            }
        }         
    }


    public async ExecuteSQL(_query: string): Promise<any>{
        var result = null;
        try{
            await mssql.connect(this.SqlConfig);
            result = mssql.query(_query);
        }
        catch (err){
            console.log("SQL Error: "+err)
        }
        return result
    }

}




