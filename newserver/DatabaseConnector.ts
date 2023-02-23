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



    public async ExecuteSimpleParameterized(): Promise<any> {
        await sql.connect(this.SqlConfig);
        var request = new sql.Request()
        request.input("param0",'Puff')
        request.query("select * from testing1.dbo.MOCK_DATA where first_name = @param0", function (err, res) {
            console.log(err)
            console.log(res!.recordset[0])
            
            return res?.recordset
        })
        
        
        
    }

    public async ExecutePrepared(_dbname:string,_dbtype:string,_tablename:string,_collumNames:string[],_selectCondition:string): Promise<any> {
        var result = null;
        try{
            var pool = await sql.connect(this.SqlConfig);
            const ps = new sql.PreparedStatement(pool)
            var params = ""
            var paramArray = []
            for (let index = 0; index < _collumNames.length; index++) {
                params += " @param"+index;
                ps.input("param"+index,  sql.VarChar(100))
                var par = 'param'+index;
                paramArray[index] = {par:_collumNames[index]}

                
            }
            ps.prepare("select "+params+" from ["+_dbname+"].["+_dbtype+"].["+_tablename+"]" + _selectCondition, err => {
                console.log(err);
                ps.execute({param0: "name"}, (err, sqlresult) =>{
                    console.log(ps.statement)
                    console.log(sqlresult);
                    console.log(err);
                    if(err!=null){
                        console.log("SQL Error: "+err)
                    }
                    result = sqlresult;
                })
                
            })
        }
        catch (err){
            console.log("SQL Error: "+err)
        }
        return result
    }

    public async GetCollumnNamesFromTable(_dbname:string,_tablename: string,_tableschema:string): Promise<any>{
        var result = null;
        try{
            var query = "use "+_dbname+ " SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('"+_tableschema+"."+_tablename+"') "
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
            var query = "use "+_dbname+ " select name from sys.schemas"
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
            var query = "use "+_dbname+ " select name from sys.tables"
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




