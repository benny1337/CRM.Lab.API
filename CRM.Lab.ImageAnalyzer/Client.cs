using CRM.Lab.Model;
using Microsoft.ProjectOxford.Emotion;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Lab.ImageAnalyzer
{
    public class Client
    {
        private EmotionServiceClient _client;

        public Client()
        {
            _client = new EmotionServiceClient("df54bd1e26f44f529a9650ae6cddfedc");            
        }

        public async Task<Analysis> AnalyzeAsync(string base64)
        {
            try {
                if (string.IsNullOrEmpty(base64))
                    return new Analysis() { IsHappy = false };

                var ms = new MemoryStream(Convert.FromBase64String(base64));
                var emotion = await _client.RecognizeAsync(ms);

                return new Analysis()
                {
                    IsHappy = emotion.Any(x => x.Scores.Happiness > 0.5)
                };
            } catch (Exception e)
            {
                throw;
            }
        }
    }
}
