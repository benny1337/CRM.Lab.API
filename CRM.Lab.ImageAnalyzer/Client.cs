using CRM.Lab.Model;
using Microsoft.ProjectOxford.Emotion;
using Microsoft.ProjectOxford.Face;
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
        private FaceServiceClient _faceclient;
        
        public Client()
        {
            _client = new EmotionServiceClient("df54bd1e26f44f529a9650ae6cddfedc");            
            _faceclient = new FaceServiceClient("6d66ae70f4494c95a5e0a8fb2e855906");
        }

        public async Task<Analysis> AnalyzeAsync(string base64)
        {
            try {
                if (string.IsNullOrEmpty(base64))
                    return new Analysis() { IsHappy = false };
                                
                var emotion = await _client.RecognizeAsync(new MemoryStream(Convert.FromBase64String(base64)));

                var jeppe = new Guid("{301af4e6-489c-4ce5-ad09-0a9d6c1c4730}");
                var newimage = await _faceclient.DetectAsync(new MemoryStream(Convert.FromBase64String(base64)));
                var isjeppe = false;
                if (newimage.Count() > 0)
                {
                    var face = await _faceclient.VerifyAsync(jeppe, newimage.FirstOrDefault().FaceId);
                    if (face.Confidence > 0.7)
                        isjeppe = true;
                }

                return new Analysis()
                {
                    IsHappy = emotion.Any(x => x.Scores.Happiness > 0.5),
                    IsJeppe = isjeppe
                };
            } catch (Exception e)
            {
                throw;
            }
        }
    }
}
