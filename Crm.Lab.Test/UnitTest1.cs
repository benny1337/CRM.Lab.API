using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;
using CRM.Lab.Repository;

namespace Crm.Lab.Test
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            //var client = new ContactAnalyzer();

            //client.AnalyzeContact(new Guid("{BBD7A77E-DE7B-E611-80DD-C4346BAD00F0}"));
            //Assert.AreEqual(true, true);

            var client = new CRM.Lab.ImageAnalyzer.Client();
            var repo = new ContactRepository();
            var contact = repo.GetContactById(new Guid("{63A0E5B9-88DF-E311-B8E5-6C3BE5A8B200}"));
            var analysis = client.AnalyzeAsync(contact.EntityImageBase64).Result;

            Assert.AreEqual(analysis.IsHappy, true);


        }
    }
}
