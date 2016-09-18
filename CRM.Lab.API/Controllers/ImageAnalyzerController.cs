using CRM.Lab.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace CRM.Lab.API.Controllers
{
    [EnableCors("*", "*", "*")]
    public class ImageAnalyzerController : ApiController
    {
        // GET: api/ImageAnalyzer
        public Analysis Get(Guid id)
        {
            return new Analysis()
            {
                IsHappy = true
            };
        }

        [Route("api/ImageAnalyzer/base64")]
        public Analysis Get(string base64)
        {
            return new Analysis()
            {
                IsHappy = false
            };
        }
    }
}
