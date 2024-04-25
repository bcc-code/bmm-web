using System.Globalization;
using BMM.Website;
using Microsoft.AspNetCore.Rewrite;

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<ApiConfiguration>(builder.Configuration.GetSection(ApiConfiguration.SectionName));
var apiConfig = builder.Configuration.GetSection(ApiConfiguration.SectionName).Get<ApiConfiguration>();
builder.Services.AddTransient<BmmApiClient>();
builder.Services.AddHttpClient<BmmApiClient>(c => c.BaseAddress = new Uri(apiConfig.BaseUrl));
var app = builder.Build();

var indexFile = File.ReadAllText("wwwroot/index.html");

var handler = () => new HtmlResult(indexFile);

app.MapGet("/", handler);
app.MapGet("index.html", handler);
app.MapGet("/track/{path}", (string path) => new HtmlResult(indexFile, "/track/" + path));
app.MapGet("/track/{path}/{subpath}",
    (string path, string subpath) => new HtmlResult(indexFile, "/track/" + path + "/" + subpath));

// Make sure all patterns from client/app/scripts/app.js are also in here
app.MapGet("welcome/{*.}", handler);
app.MapGet("music/{*.}", handler);
app.MapGet("messages/{*.}", handler);
app.MapGet("speeches/{*.}", handler);
app.MapGet("video/{*.}", handler);
app.MapGet("archive/{*.}", handler);
app.MapGet("audiobooks/{*.}", handler);
app.MapGet("album/{*.}", handler);
app.MapGet("track/{*.}", handler);
app.MapGet("playlist/{*.}", handler);
app.MapGet("groupgoal/{*.}", handler);
app.MapGet("copyright/{*.}", handler);
app.MapGet("messages-unavailable/{*.}", handler);
app.MapGet("romans-statistics/{*.}", handler);
app.MapGet("download/{*.}", handler);

// We want to allow downloading without needing to log in. It looks ugly and can't be translated but offers a better exerience.
app.MapGet("apk/{*.}", () => new HtmlResult(File.ReadAllText("wwwroot/apk.html")));

app.UseRewriter(new RewriteOptions()
    .AddRewrite(".well-known/apple-app-site-association", ".well-known/apple-app-site-association.json", true)
    .AddRewrite("^admin(?!.*\\.(js|css|jpg|svg|png|html|txt|json|map|woff|eot|ttf|woff2|ico|gif)($|\\?)).*",
        "admin/index.html", true));

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        var path = ctx.Context.Request.Path.ToString();
        if (ctx.Context.Request.Path.ToString() == "/admin/index.html" || path.Contains("main.js"))
        {
            ctx.Context.Response.Headers.Append("Cache-Control", "no-store");
        }
        else
        {
            // Cache static files for 30 days
            ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=2592000");
            ctx.Context.Response.Headers.Append("Expires",
                DateTime.UtcNow.AddDays(30).ToString("R", CultureInfo.InvariantCulture));
        }
    }
});

//ToDo: <add name="Content-Security-Policy" value="frame-ancestors https://*.bcc.no" /> for logout-redirect.html and logout.html
app.Run();