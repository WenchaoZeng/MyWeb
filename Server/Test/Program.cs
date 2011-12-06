using System;
using System.Collections.Generic;
using System.Text;
using fastJSON;
using MyWeb.Entities;

namespace Test
{
    class Program
    {
        static void Main(string[] args2)
        {
            JSON.Instance.UseSerializerExtension = false;

            Style style = new Style()
            {
                Email = "zwc1986@126.com",
                Domain = "zwc.name",
                Title = "My Style",
                Content = "body{background:black;}"
            };

            String input = JSON.Instance.ToJSON(style);
            Dictionary<String, String> args = new Dictionary<string, string>();
            args.Add("domain", "zwc.name");
            args.Add("title", "我的样式3");
            String result = name.zwc.Caller.Handlers.MyWeb.GetStyle(input, args);
            Console.WriteLine(result);

            Console.WriteLine("Done");
            Console.ReadKey();
        }
    }
}
