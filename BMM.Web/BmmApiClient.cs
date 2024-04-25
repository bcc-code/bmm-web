using System.Text.Json.Serialization;

namespace BMM.Website;

public class BmmApiClient
{
    private readonly HttpClient _client;

    public BmmApiClient(HttpClient client)
    {
        _client = client;
    }

    public async Task<Metadata?> LoadMetadata(string path)
    {
        return await _client.GetFromJsonAsync<Metadata>("/linkmetadata" + path);
    }

    public class Metadata
    {
        public string Title { get; set; }
        public string Description { get; set; }
        [JsonPropertyName("cover_url")]
        public string CoverUrl { get; set; }
    }
}