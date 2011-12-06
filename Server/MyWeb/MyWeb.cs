/**
 * This library will be hosted in https://code.google.com/p/caller/ project r5.
 */
using System;
using System.Collections.Generic;
using System.Text;
using MyGreatIdea;
using System.Web;
using System.Reflection;
using System.IO;
using fastJSON;
using MyWeb.Entities;
using System.Data.OleDb;

namespace name.zwc.Caller.Handlers
{
    public class MyWeb
    {
        static DBHelper db = null;
        static MyWeb()
        {
            // 
            // Initialize database connection.
            //
            String dbFilePath = String.Empty;
            if (HttpContext.Current != null) // The code is running in a web server.
            {
                dbFilePath = HttpContext.Current.Server.MapPath("~/App_Data/MyWeb.mdb");
            }
            else // The code is running locally for test purpose.
            {
                dbFilePath = Assembly.GetExecutingAssembly().Location;
                dbFilePath = Path.GetDirectoryName(dbFilePath);
                dbFilePath += "\\App_Data\\MyWeb.mdb";
            }
            db = new DBHelper(dbFilePath);

            //
            // Initialize JSON parser.
            //
            JSON.Instance.UseSerializerExtension = false;
        }

        static object _submitStyleLock = new object();
        public static String SubmitStyle(String input, Dictionary<String, String> args)
        {
            Style style = JSON.Instance.ToObject<Style>(input);
            style.UpdateTime = getCurrentSeconds();

            lock (_submitStyleLock)
            {
                if (db.Execute("select [id] from [styles] where [email] = ? and [domain] = ? and [title] = ?",
                    style.Email, style.Domain, style.Title).HasRows)
                {
                    db.Execute("update [styles] set [content] = ?, [updatetime] = ? where [email] = ? and [domain] = ? and [title] = ?",
                        style.Content, style.UpdateTime, style.Email, style.Domain, style.Title);
                }
                else
                {
                    db.Execute("insert into [styles]([email], [domain], [title], [content], [updatetime]) values(?, ?, ?, ?, ?)"
                        , style.Email, style.Domain, style.Title, style.Content, style.UpdateTime);
                }
            }

            return "true";
        }
        public static String ListStyles(String input, Dictionary<String, String> args)
        {
            String domain = args["domain"];

            OleDbDataReader reader = db.Execute("select [title] from [styles] where [domain] = ?", domain);
            List<Style> styles = parseStyles(reader);
            return JSON.Instance.ToJSON(styles); ;
        }
        public static String GetStyle(String input, Dictionary<String, String> args)
        {
            String domain = args["domain"];
            String title = args["title"];

            OleDbDataReader reader = db.Execute("select [content] from [styles] where [domain] = ? and [title] = ?", domain, title);
            if (reader.HasRows && reader.Read())
            {
                return (String)reader["content"];
            }
            return null;
        }

        #region Helpers

        //
        // All datetime values stored in database are represented in seconds starting from 1970/01/01.
        //
        static DateTime minDateTime = DateTime.Parse("1970/01/01");
        static int getCurrentSeconds()
        {
            TimeSpan timeSpan = DateTime.Now - minDateTime;
            return (int)timeSpan.TotalSeconds;
        }

        static List<Style> parseStyles(OleDbDataReader reader)
        {
            List<Style> styles = new List<Style>();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    styles.Add(new Style()
                    {
                        Title = (String)reader["title"],
                    });
                }
            }
            return styles;
        }

        #endregion
    }
}
