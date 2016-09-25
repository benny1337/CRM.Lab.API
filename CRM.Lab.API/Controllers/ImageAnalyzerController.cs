using CRM.Lab.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using CRM.Lab.ImageAnalyzer;
using System.Threading.Tasks;
using CRM.Lab.Repository;

namespace CRM.Lab.API.Controllers
{
    [EnableCors("*", "*", "*")]
    public class ImageAnalyzerController : ApiController
    {
        private Client _client;
        private ContactRepository _crmrepo;

        public ImageAnalyzerController()
        {
            _client = new ImageAnalyzer.Client();
            _crmrepo = new Repository.ContactRepository();
        }

        // GET: api/ImageAnalyzer
        public async Task<Analysis> Get(Guid id)
        {
            var contact = _crmrepo.GetContactById(id);
            return await _client.AnalyzeAsync(contact.EntityImageBase64);
        }

        [Route("api/ImageAnalyzer/base64")]
        public async Task<Analysis> Get(string base64)
        {
            return await _client.AnalyzeAsync(base64);
        }
    }
}
