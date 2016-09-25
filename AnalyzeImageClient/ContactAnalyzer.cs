using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnalyzeImageClient
{
    public class ContactAnalyzer
    {
        private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
        {
            return ConnectionMultiplexer.Connect("crmlabcache.redis.cache.windows.net:6380,password=c90ysDrH7hSaWi5j4SDTGAGmD/CRALK02qSB7bm+1ko=,ssl=True,abortConnect=False");            
        });

        public static ConnectionMultiplexer Connection
        {
            get
            {
                return lazyConnection.Value;
            }
        }

        private const string CACHEKEY = "token";        
        IOrganizationService service;
        public ContactAnalyzer()
        {            
            var connection = new CrmConnection("crm");
            service = new OrganizationService(connection);            
        }
        public void AnalyzeContact(Guid id)
        {
            var changes = new List<Entity>();            

            var req = new RetrieveEntityChangesRequest()
            {
                EntityName = "contact",
                Columns = new ColumnSet(true),                
                PageInfo = new PagingInfo()
                {
                    Count = 500,
                    PageNumber = 1
                }
            };
                        
            var token = ReadToken();
            if (!string.IsNullOrEmpty(token))
                req.DataVersion = token;

            while (true)
            {
                var resp = service.Execute(req) as RetrieveEntityChangesResponse;
                
                if(!resp.EntityChanges.MoreRecords)
                {
                    SaveToken(resp.EntityChanges.DataToken);
                    break;
                }

                req.PageInfo.PageNumber++;
                req.PageInfo.PagingCookie = resp.EntityChanges.PagingCookie;
            }
        }

        public string ReadToken()
        {
            try {
                IDatabase cache = Connection.GetDatabase();
                string token = cache.StringGet("asdf");
                return token;
            } catch (Exception e)
            {
                return null;
            }
        }

        public void SaveToken(string token)
        {
            IDatabase cache = Connection.GetDatabase();
            cache.StringSet("asdf", token);
        }
      
    }
}
