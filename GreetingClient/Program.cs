using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace GreetingClient
{
    public class LanguagesResponse
    {
        [JsonPropertyName("message")] public string Message { get; set; }
        [JsonPropertyName("data")] public List<LanguageData> Data { get; set; }
    }

    public class LanguageData
    {
        [JsonPropertyName("language")] public string Language { get; set; }
    }

    public class TimesOfDayResponse
    {
        [JsonPropertyName("message")] public string Message { get; set; }
        [JsonPropertyName("data")] public List<TimeOfDayData> Data { get; set; }
    }

    public class TimeOfDayData
    {
        [JsonPropertyName("timeOfDay")] public string TimeOfDay { get; set; }
    }

    public class GreetRequest
    {
        [JsonPropertyName("timeOfDay")] public string TimeOfDay { get; set; }
        [JsonPropertyName("language")] public string Language { get; set; }
        [JsonPropertyName("tone")] public string Tone { get; set; }
    }

    public class GreetResponse
    {
        [JsonPropertyName("greetingMessage")] public string GreetingMessage { get; set; }
    }

    class Program
    {
        private static readonly string BaseUrl = "http://localhost:3000";
        private static readonly HttpClient client = new HttpClient();

        static async Task Main(string[] args)
        {
            Console.WriteLine("Fetching Languages...\n");
            HttpResponseMessage languagesResponse = await client.GetAsync($"{BaseUrl}/api/languages");
            string languagesJson = await languagesResponse.Content.ReadAsStringAsync(); //Make it case insensitive I wonder why I just cannot pass flags like this |
            LanguagesResponse languages = JsonSerializer.Deserialize<LanguagesResponse>(languagesJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            foreach (var lang in languages.Data)
            {
                Console.WriteLine($"Language: {lang.Language}");
            }

            Console.WriteLine("\nFetching Times of Day...\n");
            HttpResponseMessage timesResponse = await client.GetAsync($"{BaseUrl}/api/timesOfDay");
            string timesJson = await timesResponse.Content.ReadAsStringAsync(); //Make it case insensitive
            TimesOfDayResponse times = JsonSerializer.Deserialize<TimesOfDayResponse>(timesJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            foreach (var time in times.Data)
            {
                Console.WriteLine($"Time of Day: {time.TimeOfDay}");
            }

            Console.WriteLine("\nEnter Time of Day:");
            string timeOfDay = Console.ReadLine();
            Console.WriteLine("Enter Language:");
            string language = Console.ReadLine();
            Console.WriteLine("Enter Tone (Formal/Casual it's ase insensitive):");
            string tone = Console.ReadLine();

            var greetRequest = new GreetRequest
            {
                TimeOfDay = timeOfDay,
                Language = language,
                Tone = tone
            };

            string greetJson = JsonSerializer.Serialize(greetRequest);
            StringContent content = new StringContent(greetJson, Encoding.UTF8, "application/json");
            HttpResponseMessage greetResponse = await client.PostAsync($"{BaseUrl}/api/greet", content);
            string greetResponseJson = await greetResponse.Content.ReadAsStringAsync(); //Make it case insensitive
            GreetResponse greet = JsonSerializer.Deserialize<GreetResponse>(greetResponseJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Console.WriteLine($"\nGreeting Message: {greet.GreetingMessage}");
        }
    }
}