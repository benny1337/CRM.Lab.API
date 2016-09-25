using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Lab.OrganizationServiceProvider
{
    public class Provider
    {
        public IOrganizationService Service
        {
            get
            {    
                var conn = new CrmConnection("crm");             
                return new OrganizationService(conn);                
            }
        }
    }
}
