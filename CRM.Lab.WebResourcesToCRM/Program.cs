using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Lab.WebResourcesToCRM
{
    public class WebResource
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
    

    class Program
    {
        private const string NAMEOFWEBRESOURCEDIR = "CRM.Lab.SPA";
        private const string NAMEOFTHISPROJ = "CRM.Lab.WebResourcesToCRM";

        static void Main(string[] args)
        {
            var conn = new CrmConnection("crm");
            var service = new OrganizationService(conn);
            var existringresources = ReadResources(service);

            var basedir = Directory.GetCurrentDirectory().Split(new string[] { NAMEOFTHISPROJ }, StringSplitOptions.None);
            var dir = $"{basedir[0]}{NAMEOFWEBRESOURCEDIR}\\stq_\\";
            foreach (var file in  Directory.GetFiles(dir, "*.*", SearchOption.AllDirectories))
            {
                var filename = "stq_/" + file.Split(new string[] { dir }, StringSplitOptions.None)[1].Replace("\\", "/");
                var wr = new Entity()
                {
                    LogicalName = "webresource",
                    ["content"] = getEncodedFileContents(file),
                    ["name"] = filename,
                    ["displayname"] = filename
                };
                var existingwr = existringresources.FirstOrDefault(x => x.Name.Equals(filename));
                if (existingwr != null) 
                {
                    wr.Id = existingwr.Id;                    
                    service.Update(wr);
                }
                else
                {
                    var type = GetType(filename);
                    if (type.Value == -1)
                        continue;

                    wr["webresourcetype"] = type;
                    service.Create(wr);
                }
            }

            var req = new PublishAllXmlRequest();
            service.Execute(req);
        }

        private static OptionSetValue GetType(string filename)
        {
            var val = -1;
            if (filename.Contains(".htm"))
                val = 1;
            else if (filename.Contains(".css"))
                val = 2;
            else if (filename.Contains(".js"))
                val = 3;
            else if (filename.Contains(".xml"))
                val = 4;
            else if (filename.Contains(".png"))
                val = 5;
            else if (filename.Contains(".jpg"))
                val = 6;
            else if (filename.Contains(".gif"))
                val = 7;

            return new OptionSetValue(val);
        }

        private static IEnumerable<WebResource> ReadResources(IOrganizationService service)
        {            
            var qe = new QueryExpression()
            {
                EntityName = "webresource",
                ColumnSet = new ColumnSet("name"),
                Criteria =
                {
                    Conditions =
                    {
                        new ConditionExpression("name", ConditionOperator.BeginsWith, "stq_")
                    }
                }
                
            };            
            return service.RetrieveMultiple(qe).Entities.Select<Entity, WebResource>(e => 
            {
                return new WebResource()
                {
                    Id = e.Id,
                    Name = e.GetAttributeValue<string>("name")
                };
            });
        }

        static public string getEncodedFileContents(String pathToFile)
        {
            FileStream fs = new FileStream(pathToFile, FileMode.Open, FileAccess.Read);
            byte[] binaryData = new byte[fs.Length];
            long bytesRead = fs.Read(binaryData, 0, (int)fs.Length);
            fs.Close();
            return System.Convert.ToBase64String(binaryData, 0, binaryData.Length);
        }
    }
}
