using CRM.Lab.Model;
using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Lab.Repository
{
    public class ContactRepository
    {
        private IOrganizationService _service;

        public ContactRepository()
        {
            _service = new OrganizationServiceProvider.Provider().Service;
        }

        public Contact GetContactById(Guid id)
        {
            var qe = new QueryExpression()
            {
                EntityName = "contact",
                ColumnSet = new ColumnSet("contactid", "entityimage"),
                Criteria =
                {
                    Conditions =
                    {
                         new ConditionExpression("contactid", ConditionOperator.Equal, id)
                    }
                }
            };

            var entity = _service.RetrieveMultiple(qe);
            var base64 = "";
            try {
                base64 = Convert.ToBase64String(entity.Entities?.FirstOrDefault()?.GetAttributeValue<byte[]>("entityimage"));
            } catch (Exception) { }
            

            return new Contact()
            {
                ContactId = id,
                EntityImageBase64 = base64
            };
        }
    }
}
