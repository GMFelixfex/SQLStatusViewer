import * as mssql from 'mssql';
import sql from 'mssql/msnodesqlv8';

export class ServerConnection {
    SqlConfig: any;
    WindowsLogin: boolean;
    constructor(_SQLServerIP: string, _SQLServerName: string, _Port: number, _Username: string, _Password: string){

        if(_Username == "" || _Password == ""){
            this.SqlConfig = {
                server: _SQLServerIP,
                port: _Port,
                driver: "msnodesqlv8",
                options:{
                    trustedConnection: true,
                    trustServerCertificate: true
                }
            } 
            this.WindowsLogin = true;
        } else {
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
            this.WindowsLogin = false;  
        }        
    }


    public async ExecuteSQL(_query: string): Promise<any>{
        var result = null;
        if(this.WindowsLogin){
            try{
                await sql.connect(this.SqlConfig);
                result = sql.query(_query);
            }
            catch (err){
                console.log("SQL Error: "+err)
            }
        } else {
            try{
                await mssql.connect(this.SqlConfig);
                result = mssql.query(_query);
            }
            catch (err){
                console.log("SQL Error: "+err)
            }
        }
        
        
        
        return result
    }

}




