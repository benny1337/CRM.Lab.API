using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            var client = new AnalyzeImageClient.ContactAnalyzer();
            client.AnalyzeContact(new Guid("{BBD7A77E-DE7B-E611-80DD-C4346BAD00F0}"));
        }
    }
}
