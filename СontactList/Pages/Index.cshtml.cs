using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace СontactList.Pages
{
    [Authorize]
    public class IndexModel : PageModel
    {
       

        public void OnGet()
        {

        }
    }
}
