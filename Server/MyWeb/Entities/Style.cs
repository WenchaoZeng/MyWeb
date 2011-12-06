using System;
using System.Collections.Generic;
using System.Text;

namespace MyWeb.Entities
{
    public class Style
    {
        public int Id { get; set; }
        public String Email { get; set; }
        public String Domain { get; set; }
        public String Title { get; set; }
        public String Content { get; set; }
        public int UpdateTime { get; set; }
    }
}
