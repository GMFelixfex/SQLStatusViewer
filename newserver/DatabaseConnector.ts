import sql, { query } from 'mssql/msnodesqlv8';

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
        try{
            await sql.connect(this.SqlConfig);
            result = sql.query(_query);
        }
        catch (err){
            console.log("SQL Error: "+err)
        }

        
        
        return result
    }

    public async GetCollumnNamesFromTable(_dbname:string,_tablename: string,_tableschema:string): Promise<any>{
        var result = null;
        try{
            var query = "use ["+_dbname+ "] SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('["+_tableschema+"].["+_tablename+"]') "
            await sql.connect(this.SqlConfig);
            result = sql.query(query);
        }
        catch (err){
            console.log("SQL Error: "+err)
            return null;
        }
        return result;
    }
    
    public async GetSchemas(_dbname: string): Promise<any>{
        var result = null;
        try{
            var query = "use ["+_dbname+ "] select name from sys.schemas"
            await sql.connect(this.SqlConfig);
            result = sql.query(query);
        }
        catch (err){
            console.log("SQL Error: "+err)
            return null;
        }
        return result;
    }


    public async GetTableNamesFromDB(_dbname: string): Promise<any>{
        var result = null;
        try{
            var query = "use ["+_dbname+ "] select name from sys.tables"
            await sql.connect(this.SqlConfig);
            result = sql.query(query);
        }
        catch (err){
            console.log("SQL Error: "+err)
            return null;
        }
        return result;
    }

    public async GetDBNamesFromServer(): Promise<any>{
        var result = null;
        try{
            var query = "select name from sys.databases"
            await sql.connect(this.SqlConfig);
            result = sql.query(query);
        }
        catch (err){
            console.log("SQL Error: "+err)
            return null;
        }
        return result;
    }
}




