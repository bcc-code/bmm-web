using System.Net.Mime;
using System.Text;

namespace BMM.Website;

public class HtmlResult : IResult
{
    private readonly string _indexHtml;
    private readonly string? _path;
    private string _title = "bmm";
    private string _description = "Listen to edifying music and messages";
    private string _coverUrl = "https://bmm.brunstad.org/bmm-logo.jpg";
    private const string Placeholder = "<!-- {{MetadataPlaceholder}} -->";

    public HtmlResult(string indexHtml)
    {
        _indexHtml = indexHtml;
    }

    public HtmlResult(string indexHtml, string? path)
    {
        _indexHtml = indexHtml;
        _path = path;
    }
    
    public async Task ExecuteAsync(HttpContext httpContext)
    {
        if (_path != null)
        {
            try
            {
                var api = httpContext.RequestServices.GetRequiredService<BmmApiClient>();
                var data = await api.LoadMetadata(_path);
                _title = data.Title;
                _description = data.Description;
                if (!string.IsNullOrWhiteSpace(data.CoverUrl))
                    _coverUrl = data.CoverUrl;
            }
            catch (Exception)
            {
                // If we can't get anything useful from the API we just use the default values.
            }
        }
 
        var metaTags =
            $"<meta property=\"og:title\" content=\"{_title}\">" +
            $"<meta property=\"og:description\" content=\"{_description}\">" +
            $"<meta property=\"og:image\" content=\"{_coverUrl}\" />\n";
        var adjustedHtml = _indexHtml.Replace(Placeholder, metaTags);

        httpContext.Response.Headers.Append("Cache-Control", "no-store");
        
        httpContext.Response.ContentType = MediaTypeNames.Text.Html;
        httpContext.Response.ContentLength = Encoding.UTF8.GetByteCount(adjustedHtml);
        await httpContext.Response.WriteAsync(adjustedHtml);
    }
}