/**
 * This class is copied from https://code.google.com/p/mygreatidea/ project r16. 
 */
using System;
using System.Collections.Generic;
using System.Text;
using System.Data.OleDb;

namespace MyGreatIdea
{
    public class DBHelper
    {
        static OleDbConnection _connection = null;
        /// <summary>
        /// Persist a connection to a MS Access 2003 Database when a DBHelper object is created.
        /// </summary>
        /// <param name="dbFilePath">The path of a MS Access 2003 Database, which will be locked when an DBHelper object is created.</param>
        public DBHelper(string dbFilePath)
        {
            string connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + dbFilePath;
            _connection = new OleDbConnection(connectionString);
            _connection.Open();
        }
        ~DBHelper()
        {
            if (_connection != null)
            {
                try
                {
                    _connection.Close();
                }
                    // Ignore all exceptions when releasing a database connection.
                catch (Exception){}
            }
        }

        /// <summary>
        /// Execute a SQL command.
        /// </summary>
        /// <param name="sqlCommand">The SQL statement.</param>
        /// <param name="parameters">Parameter values which will be used in the SQL statement.</param>
        /// <returns></returns>
        public OleDbDataReader Execute(string sqlCommand, params object[] parameters)
        {
            OleDbCommand command = new OleDbCommand(sqlCommand, _connection);
            foreach (object value in parameters)
            {
                command.Parameters.AddWithValue("?", value);
            }

            if (sqlCommand[0] == 's') // for select command
            {
                return command.ExecuteReader();
            }
            else // for update, delete, insert commands
            {
                command.ExecuteNonQuery();
                return null;
            }
        }
    }
}
