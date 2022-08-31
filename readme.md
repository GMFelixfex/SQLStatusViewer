Projekt ist auf Node.js aufgebaut

Server datei ist server/server.ts
Die website von der am ende zugegriffen wird ist client/index.ts

Die ServerConfig.json hat die vorerst existierenden einstellungen für das Allgemeine der Applikation
    - MaxTimeSinceUpdateInMin   :   Nach der auslesung eines Datum der Database, wird errechnet ob es noch in dieser Zeitspanne liegt falls diese 
                                    überschritten wird, wird die Zelle der Tabelle rot gefärbt (Gradueller übergang zu rot von grün, jenäher am ender
                                    der zeitspanne desto roter)
    - DataFetchTimeInMin        :   Zeit nachdem die Database neu ausgelesen wird
    - Port                      :   Port mit dem der Server gestartet wird


Die DatabaseServer.json hat alle SQL-Server einträge mit nötigen Verbindungs informationen.
    SQLServerIP                 :   Die Ip des SQL-Servers, bzw Rechner mit einem SQL Server
    SQLServerName               :   der Servername wie er im management Studio Steht
    Port                        :   Der TCP/IP Port über den man auf den Server Zugreifen kann
    Username                    :   Ein Name eines Nutzers mit nötigen Rechten
    Password                    :   Das zugehöriger Passwort zum Nutzer


Die Tables.json enthält alle Tabelleinformationen + Extra auswahl möglichkeiten
    ServerName                  :   Name des SQL-Servers, in der Die Database+Tabelle enthalten sind
    DatabaseName                :   Name der Database in der die Tabelle enthalten ist
    Tablename                   :   Name der Tabelle wie er im Management Studio steht
    TableShema                  :   Die Abkürzung des TabellenSchemas (Standert: dbo)
    ColumnPresetID                :   Nummer des Presets das für die auslesung der Tabelle genutzt wird
    SelectionCondition          :   eine extra SQL conditon falls man nicht alle zeilen haben will (Beispiele siehe die .json datei)


Die ColumnPresets.json enthält alle Collums die ausgelesen werden sollen zu ihren zugehörigen SQL-Types
    PresetID                    :   Die PresetID, die von den Tabellen in Tables.json genutzt wird
    Columns                     :   Die Columns die aus der Tabelle ausgelesen werden sollen  mit ihren zugehörigen SQL-types
    [
        ["Name1", "sqltype1"],  :   Format eines Arrays mit 2 einträgen
        ["Name2", "sqltype2"]
    ]